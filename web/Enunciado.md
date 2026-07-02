# Projeto 2 - Sistema de Gerenciamento de Biblioteca

O Projeto 2 será adaptado para o desenvolvimento de uma aplicação web completa para gerenciar uma biblioteca, com API backend em Node.js/Express, banco relacional com Sequelize, autenticação com JWT, documentação com Swagger e frontend em React.

## Funcionalidades detalhadas do Sistema de Biblioteca

O sistema deverá possuir 3 tipos de usuários:
1. Administrador
2. Bibliotecário
3. Leitor/Aluno

### 1. Administrador
O administrador possui acesso completo ao sistema. **O que pode fazer:**
- Cadastrar, editar e excluir usuários do sistema;
- Definir o tipo de usuário como Administrador, Bibliotecário ou Leitor;
- Cadastrar, editar e excluir livros;
- Visualizar todos os livros e todos os leitores;
- Visualizar todos os empréstimos;
- Realizar empréstimos e registrar devoluções;
- Acessar relatórios gerais do sistema.

### 2. Bibliotecário
O bibliotecário será responsável pela operação da biblioteca.

**O que pode fazer:**
- Cadastrar, editar e visualizar livros;
- Buscar livros por título, autor, categoria ou disponibilidade e cadastrar leitores;
- Editar e visualizar leitores;
- Registrar empréstimos e devoluções;
- Consultar histórico de empréstimos e verificar livros atrasados.

**O que não pode fazer:**
- Excluir usuários administradores;
- Alterar permissões de usuários;
- Excluir dados importantes sem autorização.

### 3. Leitor/Aluno
O leitor terá acesso limitado ao sistema.

**O que pode fazer:**
- Fazer login e visualizar livros disponíveis;
- Buscar livros por título, autor ou categoria;
- Consultar seus próprios empréstimos e histórico de empréstimos;
- Verificar data prevista de devolução.

**O que não pode fazer:**
- Cadastrar, editar ou excluir livros;
- Cadastrar outros usuários;
- Registrar empréstimos ou devoluções.

---

## Regras de Negócio e Gerenciamentos

### 1. Autenticação e Controle de Acesso
O sistema deverá possuir login com JWT. Cada usuário deverá acessar o sistema conforme seu perfil.

**Regras:**
- Usuário sem login não acessa o sistema administrativo;
- O administrador acessa todas as funcionalidades;
- O bibliotecário acessa livros, leitores e empréstimos;
- O leitor acessa apenas consulta de livros e seus próprios empréstimos.

### 2. Gerenciamento de Livros
Cada livro deverá possuir, no mínimo: **Título, Autor, Editora, Ano de publicação e Categoria**. Também deve conter **ISBN, Quantidade total, Quantidade disponível e Status** (disponível ou indisponível).

**Funcionalidades:**
- Cadastrar, listar, editar e excluir livros;
- Buscar livro e filtrar por categoria ou disponibilidade.

### 3. Gerenciamento de Leitores
Cada leitor deverá possuir: **Nome, CPF ou RA, E-mail, Telefone, Endereço e Status** (ativo ou inativo).

**Funcionalidades:**
- Cadastrar, listar e editar leitores;
- Buscar leitor por nome, CPF ou RA;
- Inativar leitor e consultar seu histórico de empréstimos.

### 4. Gerenciamento de Empréstimos
Cada empréstimo deverá possuir: **Leitor, Livro, Data do empréstimo, Data prevista de devolução e Data real de devolução**. Também deve constar o Status como **Em aberto, Devolvido ou Atrasado**.

**Regras obrigatórias:**
- Um livro só pode ser emprestado se houver quantidade disponível, diminuindo esse valor ao realizar o empréstimo e aumentando ao registrar devolução.
- Um leitor inativo não pode realizar empréstimo e só pode visualizar os seus próprios empréstimos.
- O sistema deve indicar empréstimos atrasados.

### 5. Busca e Filtros
O sistema deverá permitir:
- Buscar livro por título, autor, categoria ou ISBN e filtrar livros disponíveis;
- Buscar leitor por nome e buscar empréstimos por status;
- Buscar empréstimos por data e por leitor.

---

## Quantidade de usuários no sistema
O sistema deverá permitir o cadastro de vários usuários, mas obrigatoriamente deve conter pelo menos **1 Administrador, 1 Bibliotecário e 2 Leitores**. Durante a apresentação, o grupo deverá demonstrar o funcionamento com esses perfis diferentes.

## Funcionalidades obrigatórias

1. **Gerenciamento de Livros**: Cadastrar, listar, editar, excluir e buscar livros por título, autor, categoria ou disponibilidade.
2. **Gerenciamento de Usuários/Leitores**: Cadastrar, listar, editar dados, excluir e buscar leitor por nome ou CPF.
3. **Empréstimos de Livros**: Registrar empréstimo associando a um leitor e livros, informar datas (empréstimo e devolução prevista), registrar devolução e controlar se o livro está disponível ou emprestado.
4. **Autenticação com JWT**: Cadastro, login, geração de token JWT e proteção de rotas, onde apenas autenticados podem manipular dados.
5. **Documentação com Swagger**: Acessível pela rota `/api-docs` apresentando rotas, métodos, parâmetros, corpos das requisições e respostas esperadas.

## Tecnologias obrigatórias

- **Backend**: Node.js, Express, Sequelize, PostgreSQL ou MySQL, JWT e Swagger.
- **Frontend**: React, consumo completo da API e telas para login, livros, leitores e empréstimos.

## Requisitos de avaliação

- **Requisito 1 - API REST**: Criar uma API que implemente corretamente as funcionalidades de livros, leitores e empréstimos.
- **Requisito 2 - Frontend React**: Criar um frontend que consuma todos os métodos da API.
- **Requisito 3 - Swagger**: Documentar a API com Swagger.
- **Requisito 4 - JWT**: Implementar autenticação obrigatória com JWT.

## Entrega

O grupo deverá entregar:
- Código-fonte do backend e frontend.
- Banco de dados configurado e Documentação Swagger funcionando.
- Projeto funcionando durante a apresentação.

---

## Rubrica de Avaliação – Projeto 2

**Sistema de Gerenciamento de Biblioteca** | **Valor Total: 10,0 pontos**

A avaliação será realizada durante a apresentação e demonstração do sistema por todos os integrantes do grupo.

| Critério | Descrição | Pontuação |
| :--- | :--- | :---: |
| **1. Modelagem do Banco de Dados** | Estrutura adequada das tabelas, relacionamentos, chaves estrangeiras e normalização dos dados. | 1,0 |
| **2. API REST (CRUD Livros)** | Implementação correta dos endpoints de cadastro, consulta, atualização e exclusão de livros. | 1,0 |
| **3. API REST (CRUD Leitores)** | Implementação correta dos endpoints de cadastro, consulta, atualização e exclusão de leitores. | 1,0 |
| **4. API REST (Empréstimos e Devoluções)** | Implementação correta dos empréstimos, devoluções e atualização automática da disponibilidade dos livros. | 1,5 |
| **5. Regras de Negócio** | Controle de estoque/disponibilidade, empréstimos em atraso, bloqueios e validações implementadas corretamente. | 1,0 |
| **6. Autenticação JWT** | Cadastro, login, geração de token, proteção de rotas e controle de acesso por perfil de usuário. | 1,0 |
| **7. Documentação Swagger** | Documentação completa e funcional contendo todas as rotas da API. | 0,5 |
| **8. Frontend React** | Interface funcional consumindo todos os endpoints da API. | 1,0 |
| **9. Busca e Filtros** | Implementação dos filtros e pesquisas exigidos no projeto. | 0,5 |
| **10. Apresentação e Domínio do Projeto** | Participação dos integrantes, conhecimento do código e capacidade de responder às perguntas. | 1,5 |
| **Total** | | **10,0 pontos** |

### Critérios de Desconto
- **Banco de Dados (-0,25 a -1,0)**: Relacionamentos incorretos, falta de tabelas obrigatórias e estrutura inconsistente.
- **API (-0,25 a -2,0)**: Endpoints não funcionando, métodos HTTP incorretos e falta de tratamento de erros.
- **JWT (-0,25 a -1,0)**: Rotas sem proteção, token inválido e ausência de controle de permissões.
- **Swagger (-0,25 a -0,5)**: Rotas não documentadas ou documentação incompleta.
- **React (-0,25 a -1,0)**: Telas não funcionais, consumo incorreto da API e operações CRUD incompletas.
- **Apresentação (-0,25 a -1,5)**: Integrantes não participam, não sabem explicar o funcionamento ou o código.

### Bônus (até +1,0 ponto)
Implementações extras poderão receber até 1,0 ponto adicional, limitado à nota máxima da atividade:
- **Dashboard com gráficos**, **Upload de capa dos livros** e **Paginação nas consultas**. (+0,25 cada)
- **Recuperação de senha** e **Notificação de atraso**. (+0,25 cada)
- **Dockerização do projeto**, **Deploy online funcional** e **Testes automatizados**. (+0,50 cada)

> **Observação**: Todos os integrantes deverão estar presentes e participar da apresentação. A ausência ou falta de participação poderá impactar a nota individual do aluno.
