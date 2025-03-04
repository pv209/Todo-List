# TodoList Application

Este é um projeto de **TodoList** com **frontend** e **backend**. O frontend é um aplicativo simples que permite gerenciar tarefas em uma lista. O backend é responsável por armazenar as tarefas em um banco de dados PostgreSQL e disponibilizar uma API RESTful.

## Estrutura do Projeto

A estrutura do projeto é a seguinte:

---

## Requisitos

Antes de começar, certifique-se de ter os seguintes requisitos instalados:

- **Node.js** (versão 12 ou superior)
- **npm** (Node Package Manager)
- **PostgreSQL** (Banco de Dados)

---

## Instalação

1. **Clone o repositório**:

   Clone o repositório para sua máquina local.

   ```bash
   git clone <URL_do_repositório>
   cd <diretório_do_repositório>

## Passo 1: Rodando o Frontend

1. **Navegue até a pasta `todolist`**:

   Abra o terminal e vá para a pasta onde o frontend está localizado:

   ```bash
   cd todolist

2. **Instale as dependências**:

    No diretório do frontend, instale as dependências necessárias utilizando o npm:
   ```bash
   npm install

3. **Inicie o frontend**:

    Execute o comando para iniciar o servidor de desenvolvimento do frontend:
     ```bash
    npm run dev
Isso vai rodar o frontend da aplicação, geralmente acessível em http://localhost:3000 (dependendo da configuração).

## Passo 2:  Rodando o Backend

1. Navegue até a pasta server:
    ```bash
        cd server

2.Instale as dependências:

No diretório do backend, instale as dependências necessárias utilizando o npm.
                        
    npm install
3.Configure as credenciais do banco de dados:

Antes de iniciar o servidor, você precisa configurar suas credenciais de conexão com o banco de dados. Abra o arquivo server/index.js e localize a seguinte parte do código:
                
                const pool = new Pool({
                user: 'postgres',        // Substitua pelo seu usuário do PostgreSQL
                host: 'localhost',       // Substitua pelo seu host (geralmente 'localhost' ou o IP do servidor)
                database: 'todolist-db', // Nome do banco de dados
                password: '123456',      // Substitua pela sua senha do PostgreSQL
                port: 5432,              // Porta padrão do PostgreSQL
                });
Substitua os valores de user, host, database, password e port conforme necessário, de acordo com suas configurações de banco de dados.Substitua os valores de user, host, database, password e port conforme necessário, de acordo com suas configurações de banco de dados.

4.Inicie o servidor do backend:

Após configurar as credenciais, execute o comando para iniciar o servidor backend.
                        
    node index.js
O servidor backend estará rodando em http://localhost:5000.


## Passo 3:  Criar a Tabela no Banco de Dados

1.Acesse o endpoint /criar-tabela:
Após iniciar o servidor backend, abra seu navegador e acesse o seguinte endpoint para criar a tabela no banco de dados:

        http://localhost:5000/criar-tabela
Esse endpoint irá criar a tabela todos no banco de dados PostgreSQL, caso ela ainda não exista. A tabela é necessária para armazenar as tarefas.


## Como Funciona
Frontend: A aplicação de frontend permite que você adicione, visualize, atualize, marque como concluída e exclua tarefas. As alterações feitas no frontend são enviadas para o backend, que armazena os dados no banco de dados PostgreSQL.

Backend: O backend fornece uma API RESTful para lidar com as operações de CRUD (Create, Read, Update, Delete) nas tarefas. Ele também emite atualizações em tempo real usando Socket.IO.

## Endpoints da API
POST /new-task: Cria uma nova tarefa.

GET /read-tasks: Retorna todas as tarefas.

POST /update-task: Atualiza uma tarefa existente.

POST /delete-task: Exclui uma tarefa.

POST /complete-task: Marca uma tarefa como concluída.
