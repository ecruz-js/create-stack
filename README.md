# create-stack

Scaffold projects with pre-implemented architecture patterns.

## Usage

```bash
npx create-stack
```

### Non-interactive

```bash
npx create-stack my-app --stack react-spa --features docker,linting
```

### Flags

| Flag | Description |
|---|---|
| `--stack <type>` | Stack: `react-spa`, `nextjs`, `node-express`, `node-hono` |
| `--features <list>` | Comma-separated: `docker`, `cicd`, `linting`, `auth` |
| `--list` | Show available stacks and features |
| `--dry-run` | Preview without creating files |

## Stacks

| Stack | Architecture |
|---|---|
| React SPA (Vite) | Feature-based (Bulletproof React inspired) |
| Next.js Full-stack | App Router + Clean Architecture layers |
| Node.js API (Express) | Clean Architecture + Repository pattern |
| Node.js API (Hono) | Clean Architecture + Repository pattern |

## Optional Features

- **Docker** — Dockerfile + docker-compose (stack-optimized)
- **CI/CD** — GitHub Actions workflow
- **Linting** — ESLint + Prettier + Husky + lint-staged
- **Auth** — JWT with refresh tokens, httpOnly cookies, role-based access

## License

MIT
