# create-stack

CLI that scaffolds projects across multiple stacks with pre-implemented architecture patterns, optional features, and production-ready configurations.

```bash
npx create-stack
```

## Usage

### Interactive (guided prompts)

```bash
npx create-stack
```

### Non-interactive (flags)

```bash
npx create-stack my-app --stack react-spa --features docker,cicd,linting,auth
```

### Utility flags

```bash
create-stack --list       # List available stacks and features
create-stack --dry-run    # Preview what would be created
create-stack --version
```

## Stacks

| Stack | Command | Architecture |
|---|---|---|
| **React SPA** (Vite) | `--stack react-spa` | Feature-based (Bulletproof React inspired) |
| **Next.js** Full-stack | `--stack nextjs` | App Router + Clean Architecture layers |
| **Node.js API** (Express) | `--stack node-express` | Clean Architecture + Repository pattern |
| **Node.js API** (Hono) | `--stack node-hono` | Clean Architecture + Repository pattern |
| **Vanilla** (HTML/CSS/JS) | `--stack vanilla` | Static site with ES modules |

## Optional Features

| Feature | Flag | What it adds |
|---|---|---|
| **Docker** | `docker` | Dockerfile + docker-compose.yml + .dockerignore (stack-optimized) |
| **CI/CD** | `cicd` | GitHub Actions workflow (install → lint → build) |
| **Linting** | `linting` | ESLint + Prettier + Husky + lint-staged |
| **Auth** | `auth` | JWT with refresh tokens, httpOnly cookies, role-based access |

> Auth is not available for the vanilla stack.

## How it works

1. **degit** clones a base template from the [create-stack-templates](https://github.com/create-stack-templates) GitHub org
2. **node-plop** applies post-scaffold customizations (rename, inject feature files)
3. **npm install** runs automatically

Each template repo is a fully functional project — not a skeleton. degit clones it, plop personalizes it.

## Template repos

| Stack | Repository |
|---|---|
| React SPA | [create-stack-templates/react-spa-clean](https://github.com/create-stack-templates/react-spa-clean) |
| Next.js | [create-stack-templates/nextjs-fullstack-clean](https://github.com/create-stack-templates/nextjs-fullstack-clean) |
| Node Express | [create-stack-templates/node-api-express](https://github.com/create-stack-templates/node-api-express) |
| Node Hono | [create-stack-templates/node-api-hono](https://github.com/create-stack-templates/node-api-hono) |
| Vanilla | [create-stack-templates/vanilla-clean](https://github.com/create-stack-templates/vanilla-clean) |

## Development

```bash
git clone https://github.com/YOUR_USERNAME/create-stack.git
cd create-stack
npm install
npm run build
npm link        # use 'create-stack' globally
```

## Requirements

- Node.js >= 18

## License

MIT
