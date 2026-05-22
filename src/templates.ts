import type { StackChoice, StackInfo, FeatureChoice, FeatureInfo } from './types.js';

export const GITHUB_ORG = 'create-stack-templates';

export const STACKS: Record<StackChoice, StackInfo> = {
  'react-spa': {
    name: 'React SPA (Vite)',
    description: 'Feature-based architecture with React Router and Vite',
    repo: `${GITHUB_ORG}/react-spa-clean`,
  },
  'nextjs': {
    name: 'Next.js (Full-stack)',
    description: 'App Router + Clean layers with Server Components',
    repo: `${GITHUB_ORG}/nextjs-fullstack-clean`,
  },
  'node-express': {
    name: 'Node.js API (Express)',
    description: 'Clean Architecture with Express, Repository pattern',
    repo: `${GITHUB_ORG}/node-api-express`,
  },
  'node-hono': {
    name: 'Node.js API (Hono)',
    description: 'Clean Architecture with Hono, Repository pattern',
    repo: `${GITHUB_ORG}/node-api-hono`,
  },
};

export const FEATURES: Record<FeatureChoice, FeatureInfo> = {
  docker: {
    name: 'Docker',
    description: 'Dockerfile + docker-compose.yml + .dockerignore',
  },
  cicd: {
    name: 'CI/CD',
    description: 'GitHub Actions CI workflow',
  },
  linting: {
    name: 'Linting',
    description: 'ESLint + Prettier + Husky pre-commit hooks',
  },
  auth: {
    name: 'Auth',
    description: 'JWT authentication with refresh tokens and roles',
  },
};

export function getStackChoices() {
  return Object.entries(STACKS).map(([value, info]) => ({
    name: `${info.name} — ${info.description}`,
    value: value as StackChoice,
  }));
}

export function getFeatureChoices() {
  return Object.entries(FEATURES).map(([value, info]) => ({
    name: `${info.name} — ${info.description}`,
    value: value as FeatureChoice,
  }));
}
