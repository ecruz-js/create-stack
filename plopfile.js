export default function (plop) {
  // Custom helpers
  plop.setHelper('eq', (a, b) => a === b);
  plop.setHelper('includes', (arr, val) => Array.isArray(arr) && arr.includes(val));

  // Docker generator
  plop.setGenerator('docker', {
    description: 'Add Docker files to project',
    prompts: [],
    actions: (data) => {
      const actions = [];
      const isNode = data.stack === 'node-express' || data.stack === 'node-hono';

      let dockerfileTemplate;
      if (data.stack === 'react-spa') dockerfileTemplate = 'docker/Dockerfile-react-spa.hbs';
      else if (data.stack === 'nextjs') dockerfileTemplate = 'docker/Dockerfile-nextjs.hbs';
      else dockerfileTemplate = 'docker/Dockerfile-node.hbs';

      actions.push({
        type: 'add',
        path: '{{targetDir}}/Dockerfile',
        templateFile: dockerfileTemplate,
      });

      actions.push({
        type: 'add',
        path: '{{targetDir}}/docker-compose.yml',
        templateFile: isNode ? 'docker/docker-compose-with-db.hbs' : 'docker/docker-compose.hbs',
      });

      actions.push({
        type: 'add',
        path: '{{targetDir}}/.dockerignore',
        templateFile: 'docker/dockerignore.hbs',
      });

      return actions;
    },
  });

  // CI/CD generator
  plop.setGenerator('cicd', {
    description: 'Add GitHub Actions CI workflow',
    prompts: [],
    actions: [
      {
        type: 'add',
        path: '{{targetDir}}/.github/workflows/ci.yml',
        templateFile: 'cicd/github-actions.yml.hbs',
      },
    ],
  });

  // Linting generator
  plop.setGenerator('linting', {
    description: 'Add ESLint + Prettier + Husky',
    prompts: [],
    actions: (data) => {
      const actions = [];
      const isReact = data.stack === 'react-spa';
      const isNext = data.stack === 'nextjs';

      let eslintTemplate;
      if (isReact) eslintTemplate = 'linting/eslintrc-react.hbs';
      else if (isNext) eslintTemplate = 'linting/eslintrc-next.hbs';
      else eslintTemplate = 'linting/eslintrc-node.hbs';

      actions.push({ type: 'add', path: '{{targetDir}}/.eslintrc.cjs', templateFile: eslintTemplate });
      actions.push({ type: 'add', path: '{{targetDir}}/.prettierrc', templateFile: 'linting/prettierrc.hbs' });
      actions.push({ type: 'add', path: '{{targetDir}}/.husky/pre-commit', templateFile: 'linting/husky-pre-commit.hbs' });

      return actions;
    },
  });

  // Auth generator
  plop.setGenerator('auth', {
    description: 'Add JWT auth module',
    prompts: [],
    actions: (data) => {
      const actions = [];

      actions.push({ type: 'add', path: '{{targetDir}}/src/features/auth/types.ts', templateFile: 'auth/shared/types.ts.hbs' });
      actions.push({ type: 'add', path: '{{targetDir}}/src/features/auth/constants.ts', templateFile: 'auth/shared/constants.ts.hbs' });

      if (data.stack === 'react-spa') {
        actions.push(
          { type: 'add', path: '{{targetDir}}/src/features/auth/AuthContext.tsx', templateFile: 'auth/react-spa/AuthContext.tsx.hbs' },
          { type: 'add', path: '{{targetDir}}/src/features/auth/useAuth.ts', templateFile: 'auth/react-spa/useAuth.ts.hbs' },
          { type: 'add', path: '{{targetDir}}/src/features/auth/ProtectedRoute.tsx', templateFile: 'auth/react-spa/ProtectedRoute.tsx.hbs' },
          { type: 'add', path: '{{targetDir}}/src/features/auth/LoginPage.tsx', templateFile: 'auth/react-spa/LoginPage.tsx.hbs' },
          { type: 'add', path: '{{targetDir}}/src/features/auth/RegisterPage.tsx', templateFile: 'auth/react-spa/RegisterPage.tsx.hbs' },
        );
      } else if (data.stack === 'nextjs') {
        actions.push(
          { type: 'add', path: '{{targetDir}}/src/features/auth/middleware.ts', templateFile: 'auth/nextjs/middleware.ts.hbs' },
          { type: 'add', path: '{{targetDir}}/src/features/auth/actions.ts', templateFile: 'auth/nextjs/auth-actions.ts.hbs' },
          { type: 'add', path: '{{targetDir}}/src/features/auth/AuthProvider.tsx', templateFile: 'auth/nextjs/AuthProvider.tsx.hbs' },
        );
      } else {
        actions.push(
          { type: 'add', path: '{{targetDir}}/src/features/auth/auth.controller.ts', templateFile: 'auth/node/auth.controller.ts.hbs' },
          { type: 'add', path: '{{targetDir}}/src/features/auth/auth.service.ts', templateFile: 'auth/node/auth.service.ts.hbs' },
          { type: 'add', path: '{{targetDir}}/src/features/auth/auth.middleware.ts', templateFile: 'auth/node/auth.middleware.ts.hbs' },
          { type: 'add', path: '{{targetDir}}/src/features/auth/auth.routes.ts', templateFile: 'auth/node/auth.routes.ts.hbs' },
          { type: 'add', path: '{{targetDir}}/src/features/auth/auth.dto.ts', templateFile: 'auth/node/auth.dto.ts.hbs' },
        );
      }

      return actions;
    },
  });
}
