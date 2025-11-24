# Monorepo Boilerplate

Monorepo contendo aplicações Web (Next.js) e API (NestJS).

## Estrutura

```
monorepo-boilerplate/
├── apps/
│   ├── web/          # Aplicação web Next.js (porta 3000)
│   └── api/          # Aplicação API NestJS (porta 3001)
├── docker-compose.yml # Configuração do PostgreSQL
├── package.json      # Configuração do workspace
└── pnpm-workspace.yaml
```

## Pré-requisitos

- Node.js >= 18.0.0
- pnpm >= 8.0.0

## Instalação

```bash
pnpm install
```

## Scripts Disponíveis

### Desenvolvimento

```bash
# Executar todas as aplicações
pnpm dev

# Executar apenas a aplicação web
pnpm dev:web

# Executar apenas a API
pnpm dev:api
```

### Build

```bash
# Build de todas as aplicações
pnpm build

# Build apenas da aplicação web
pnpm build:web

# Build apenas da API
pnpm build:api
```

### Produção

```bash
# Iniciar todas as aplicações em produção
pnpm start

# Iniciar apenas a aplicação web
pnpm start:web

# Iniciar apenas a API
pnpm start:api
```

### Outros

```bash
# Lint em todas as aplicações
pnpm lint

# Limpar node_modules
pnpm clean
```

## Aplicações

### Web (apps/web)

Aplicação frontend Next.js rodando na porta **3000**.

- Acesse: http://localhost:3000

### API (apps/api)

Aplicação backend NestJS com TypeORM rodando na porta **3001**.

- Acesse: http://localhost:3001
- Endpoints:
  - GET `/` - Endpoint de exemplo
  - GET `/users` - Lista todos os usuários
  - GET `/users/:id` - Busca um usuário por ID
  - POST `/users` - Cria um novo usuário
  - PUT `/users/:id` - Atualiza um usuário
  - DELETE `/users/:id` - Remove um usuário

#### Banco de Dados PostgreSQL

A API utiliza TypeORM com PostgreSQL. Para iniciar o banco de dados:

```bash
# Iniciar o PostgreSQL via Docker
docker-compose up -d

# Verificar se o container está rodando
docker ps

# Parar o PostgreSQL
docker-compose down

# Parar e remover volumes (apaga os dados)
docker-compose down -v
```

#### Configuração de Ambiente

Copie o arquivo `apps/api/env.example` para `apps/api/.env` e ajuste as variáveis conforme necessário:

```bash
cp apps/api/env.example apps/api/.env
```

Variáveis de ambiente disponíveis:
- `DB_HOST` - Host do PostgreSQL (padrão: localhost)
- `DB_PORT` - Porta do PostgreSQL (padrão: 5432)
- `DB_USERNAME` - Usuário do banco (padrão: postgres)
- `DB_PASSWORD` - Senha do banco (padrão: postgres)
- `DB_NAME` - Nome do banco (padrão: monorepo_db)
- `PORT` - Porta da API (padrão: 3001)
- `NODE_ENV` - Ambiente (development/production)

## Tecnologias

- **Next.js 14** - Framework React (apps/web)
- **NestJS** - Framework Node.js (apps/api)
- **TypeORM** - ORM para TypeScript/JavaScript
- **PostgreSQL** - Banco de dados relacional
- **TypeScript** - Tipagem estática
- **pnpm** - Gerenciador de pacotes
- **ESLint** - Linter
- **Docker** - Containerização do PostgreSQL

