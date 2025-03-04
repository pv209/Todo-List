const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const { Pool } = require('pg');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.json());
app.use(cors());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'todolist-db',
  password: '123456',
  port: 5432,
});

pool.connect((err) => {
  if (err) {
    return console.error('Erro ao conectar ao banco:', err.stack);
  }
  console.log('Conexão com o banco estabelecida com sucesso!');
});

io.on('connection', (socket) => {
  console.log('Novo cliente conectado');

  // Emitir eventos para o cliente quando ele se conectar, por exemplo:
  socket.emit('message', 'Bem-vindo à aplicação de tarefas!');

  // Escutando quando o cliente se desconectar
  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

app.get('/criar-tabela', async (req, res) => {
  try {
    const query = `
        CREATE TABLE IF NOT EXISTS todos (
            id SERIAL PRIMARY KEY,
            task VARCHAR(100) NOT NULL,
            status VARCHAR(45) NOT NULL,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;

    await pool.query(query);
    res.status(200).json({ mensagem: 'Tabela criada com sucesso!' });
  } catch (error) {
    console.error('Erro ao criar tabela:', error);
    res.status(500).json({ erro: 'Erro ao criar tabela' });
  }
});

app.post('/new-task', (req, res) => {
  console.log(req.body);
  const q = 'INSERT INTO todos (task, createdAt, status) VALUES ($1, $2, $3)';
  pool.query(q, [req.body.task, new Date(), 'active'], (err, result) => {
    if (err) {
      console.log('Failed to store');
      res.status(500).json({ error: 'Failed to store task' });
    } else {
      console.log('Todo saved');
      const updatedTasks = 'SELECT * FROM todos';
      pool.query(updatedTasks, (error, newList) => {
        if (error) {
          console.log(error);
          res.status(500).json({ error: 'Failed to retrieve tasks' });
        } else {
          // Emite para todos os clientes conectados que uma nova tarefa foi criada
          io.emit('taskUpdated', newList.rows);
          res.send(newList.rows); // 'rows' contém o resultado da consulta no PostgreSQL
        }
      });
    }
  });
});

app.get('/read-tasks', (req, res) => {
  const q = 'SELECT * FROM todos';
  pool.query(q, (err, result) => {
    if (err) {
      console.log("Failed to read tasks");
      res.status(500).json({ error: 'Failed to read tasks' });
    } else {
      console.log("Got tasks successfully from DB");
      res.send(result.rows); // 'rows' contém o resultado da consulta no PostgreSQL
    }
  });
});

app.post('/update-task', (req, res) => {
  console.log(req.body);
  const q = 'UPDATE todos SET task = $1 WHERE id = $2';
  pool.query(q, [req.body.task, req.body.updateId], (err, result) => {
    if (err) {
      console.log('Failed to update');
      res.status(500).json({ error: 'Failed to update task' });
    } else {
      console.log('Updated');
      pool.query('SELECT * FROM todos', (e, r) => {
        if (e) {
          console.log(e);
          res.status(500).json({ error: 'Failed to fetch tasks after update' });
        } else {
          // Emite para todos os clientes conectados que uma tarefa foi atualizada
          io.emit('taskUpdated', r.rows);
          res.send(r.rows); // 'rows' contém o resultado da consulta no PostgreSQL
        }
      });
    }
  });
});

app.post('/delete-task', (req, res) => {
  const q = 'DELETE FROM todos WHERE id = $1';
  pool.query(q, [req.body.id], (err, result) => {
    if (err) {
      console.log('Failed to delete');
      res.status(500).json({ error: 'Failed to delete task' });
    } else {
      console.log('Deleted successfully');
      pool.query('SELECT * FROM todos', (e, newList) => {
        if (e) {
          console.log(e);
          res.status(500).json({ error: 'Failed to fetch tasks after deletion' });
        } else {
          // Emite para todos os clientes conectados que uma tarefa foi excluída
          io.emit('taskUpdated', newList.rows);
          res.send(newList.rows); // 'rows' contém o resultado da consulta no PostgreSQL
        }
      });
    }
  });
});

app.post('/complete-task', (req, res) => {
  console.log(req.body);

  const q = 'UPDATE todos SET status = $1 WHERE id = $2';
  pool.query(q, ['completed', req.body.id], (err, result) => {
    if (result) {
      pool.query('SELECT * FROM todos', (e, newList) => {
        if (e) {
          console.log(e);
          res.status(500).json({ error: 'Failed to fetch tasks after completion' });
        } else {
          // Emite para todos os clientes conectados que uma tarefa foi marcada como concluída
          io.emit('taskUpdated', newList.rows);
          res.send(newList.rows); // 'rows' contém o resultado da consulta no PostgreSQL
        }
      });
    } else {
      res.status(500).json({ error: 'Failed to complete task' });
    }
  });
});

// Inicia o servidor com o Socket.IO
server.listen(5000, () => {
  console.log('Server started on port 5000');
});
