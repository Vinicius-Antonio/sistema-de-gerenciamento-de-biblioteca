# Sistema de Gerenciamento de Biblioteca

Projeto completo: `api/` (Node/Express/Sequelize/PostgreSQL/JWT) + `web/` (React/Vite).

## Como rodar

### 1. Backend

```bash
cd api
npm install
cp .env.example .env        # ajuste usuário/senha do Postgres se precisar
npm run migrate
npm run seed
npm run dev                 # http://localhost:3000
```

Documentação Swagger: `http://localhost:3000/api-docs`

### 2. Frontend

```bash
cd web
npm install
npm run dev                  # http://localhost:5173
```

Contas de demonstração (já vêm no seed, senha `senha123` para todas):
- `admin@biblioteca.com` — Administrador
- `librarian@biblioteca.com` — Bibliotecário
- `dosia@example.com` / `maria@example.com` — Leitores

## O que foi corrigido nesta rodada

**1. Bug de path que derrubava o servidor.** `book.routes.js`, `loan.routes.js`, `reader.routes.js` e `user.routes.js` importavam de `../middleware/auth.js` (singular), mas a pasta real é `middlewares/` (plural, onde já viviam `asyncHandler.js` e `errorHandler.js`). Sem essa correção o backend nem chegava a subir (`ERR_MODULE_NOT_FOUND`). Movido `auth.js` para `middlewares/` e corrigidos os 4 imports.

**2. `POST /users/login` quebrado e removido.** Essa rota estava montada *depois* de `router.use(isAdmin)` em `user.routes.js` — ou seja, seria preciso já estar logado como admin para conseguir fazer login, o que é logicamente impossível. Como o login de verdade já existe em `POST /auth/login` (com geração de JWT), a rota e a função `login()` duplicada em `user.controller.js` foram removidas.

**3. Leitor agora consegue pegar livro emprestado (ponto 1 do seu pedido).** Antes, `POST /loans` exigia `isLibrarianOrAdmin`, então um leitor nunca conseguia criar um empréstimo — nem para si mesmo. Agora:
- A rota aceita qualquer usuário autenticado.
- No `loan.controller.js`, se `req.userRole === 'READER'`, o `readerId` do corpo da requisição é **ignorado** e substituído pelo leitor vinculado à própria conta (via `Reader.findOne({ where: { userId: req.userId } })`). Isso impede um leitor de forjar `readerId` e pegar um livro emprestado em nome de outra pessoa — testei isso explicitamente (ver seção de testes abaixo).
- Devolução (`PATCH /loans/:id/return`) continua restrita a bibliotecário/admin, como no enunciado original.
- No front, o botão **"Pegar Emprestado"** aparece direto nos cards do Acervo (`BooksPage.jsx`) quando o usuário logado é `READER`, com prazo automático de 14 dias. Ele soma ao fluxo que já existia para bibliotecário/admin (que continuam usando o modal de "Novo Empréstimo" em Empréstimos).

**4. Mensagens de status corrigidas (ponto 5).** No filtro de disponibilidade do Acervo, o `<select>` mostrava o valor cru do enum (`AVAILABLE`/`UNAVAILABLE`) em vez de texto em português. Agora mostra "Disponível"/"Indisponível", igual ao badge dos cards.

**5. Bug de CSS entre páginas.** Classes como `.modal-overlay`, `.modal-card`, `.table-wrapper`, `.leitor-avatar` e `.btn-icon-edit/.btn-icon-delete` estavam definidas em apenas uma página (ex: só em `UsersPage.css` ou só em `ReadersPage.css`), mas usadas em várias outras. Como cada página só carrega o próprio CSS quando é visitada, quem nunca passasse por `UsersPage` (ex: um Bibliotecário, que nem tem acesso a ela) veria os modais de Livro/Leitor completamente sem estilo. Movi esses estilos compartilhados para `index.css` (carregado globalmente), então agora funcionam em qualquer ordem de navegação.

**6. `SettingsPage.jsx` lendo a chave errada do `localStorage`.** Lia `localStorage.getItem('user')`, mas quem grava é o `AuthContext` usando a chave `biblioteca_user`. Corrigido — sem isso, o "Salvar Alterações" nunca encontrava o usuário logado.

**7. `--bg-card` não existia.** `UsersPage.css` usava essa variável CSS, mas ela nunca foi definida em `index.css`. Adicionada como alias de `--white`.

## Regras de negócio confirmadas por teste manual

Testei tudo isso rodando o backend de verdade com Postgres antes de te entregar:
- Leitor loga, lista livros, pega um emprestado para si mesmo sem informar `readerId` → funciona.
- Leitor tenta forjar `readerId` de outro leitor no corpo da requisição → é ignorado, o empréstimo é sempre atribuído a ele mesmo.
- Leitor tenta listar `/readers` ou registrar devolução → bloqueado com 403.
- `GET /loans` como leitor só retorna os próprios empréstimos.
- Bibliotecário registra empréstimo para outro leitor e depois a devolução → `availableQuantity` do livro sobe e desce corretamente.
- Requisição sem token → 401 em qualquer rota protegida.

## O que ainda não existe (fora do escopo desta rodada)

- **Docker**: nenhum `Dockerfile`/`docker-compose.yml` real foi enviado com conteúdo legível até agora — se você mandar o conteúdo real, eu reviso ou crio um do zero.
- **Regras de empréstimo configuráveis** (prazo, multa, máx. livros por leitor) na tela de Configurações: os campos existem na UI mas não persistem em nenhum endpoint do backend — são só um formulário local por enquanto.
- **Relatórios**: `ReportsPage.jsx` continua 100% com dados mockados (números fixos), sem endpoint de agregação no backend ainda.
