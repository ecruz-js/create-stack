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
      if (data.stack === 'vanilla') dockerfileTemplate = 'plop-templates/docker/Dockerfile-vanilla.hbs';
      else if (data.stack === 'react-spa') dockerfileTemplate = 'plop-templates/docker/Dockerfile-react-spa.hbs';
      else if (data.stack === 'nextjs') dockerfileTemplate = 'plop-templates/docker/Dockerfile-nextjs.hbs';
      else dockerfileTemplate = 'plop-templates/docker/Dockerfile-node.hbs';

      actions.push({
        type: 'add',
        path: '{{targetDir}}/Dockerfile',
        templateFile: dockerfileTemplate,
      });

      actions.push({
        type: 'add',
        path: '{{targetDir}}/docker-compose.yml',
        templateFile: isNode ? 'plop-templates/docker/docker-compose-with-db.hbs' : 'plop-templates/docker/docker-compose.hbs',
      });

      actions.push({
        type: 'add',
        path: '{{targetDir}}/.dockerignore',
        templateFile: 'plop-templates/docker/dockerignore.hbs',
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
        templateFile: 'plop-templates/cicd/github-actions.yml.hbs',
      },
    ],
  });

  // Linting generator
  plop.setGenerator('linting', {
    description: 'Add ESLint + Prettier + Husky',
    prompts: [],
    actions: (data) => {
      const actions = [];
      let eslintTemplate;
      if (data.stack === 'react-spa') eslintTemplate = 'plop-templates/linting/eslintrc-react.hbs';
      else if (data.stack === 'nextjs') eslintTemplate = 'plop-templates/linting/eslintrc-next.hbs';
      else if (data.stack === 'vanilla') eslintTemplate = 'plop-templates/linting/eslintrc-vanilla.hbs';
      else eslintTemplate = 'plop-templates/linting/eslintrc-node.hbs';

      actions.push({ type: 'add', path: '{{targetDir}}/.eslintrc.cjs', templateFile: eslintTemplate });
      actions.push({ type: 'add', path: '{{targetDir}}/.prettierrc', templateFile: 'plop-templates/linting/prettierrc.hbs' });
      actions.push({ type: 'add', path: '{{targetDir}}/.husky/pre-commit', templateFile: 'plop-templates/linting/husky-pre-commit.hbs' });

      return actions;
    },
  });

  // Auth generator
  plop.setGenerator('auth', {
    description: 'Add JWT auth module',
    prompts: [],
    actions: (data) => {
      const actions = [];

      actions.push({ type: 'add', path: '{{targetDir}}/src/features/auth/types.ts', templateFile: 'plop-templates/auth/shared/types.ts.hbs' });
      actions.push({ type: 'add', path: '{{targetDir}}/src/features/auth/constants.ts', templateFile: 'plop-templates/auth/shared/constants.ts.hbs' });

      if (data.stack === 'react-spa') {
        actions.push(
          { type: 'add', path: '{{targetDir}}/src/features/auth/AuthContext.tsx', templateFile: 'plop-templates/auth/react-spa/AuthContext.tsx.hbs' },
          { type: 'add', path: '{{targetDir}}/src/features/auth/useAuth.ts', templateFile: 'plop-templates/auth/react-spa/useAuth.ts.hbs' },
          { type: 'add', path: '{{targetDir}}/src/features/auth/ProtectedRoute.tsx', templateFile: 'plop-templates/auth/react-spa/ProtectedRoute.tsx.hbs' },
          { type: 'add', path: '{{targetDir}}/src/features/auth/LoginPage.tsx', templateFile: 'plop-templates/auth/react-spa/LoginPage.tsx.hbs' },
          { type: 'add', path: '{{targetDir}}/src/features/auth/RegisterPage.tsx', templateFile: 'plop-templates/auth/react-spa/RegisterPage.tsx.hbs' },
        );
      } else if (data.stack === 'nextjs') {
        actions.push(
          { type: 'add', path: '{{targetDir}}/src/features/auth/middleware.ts', templateFile: 'plop-templates/auth/nextjs/middleware.ts.hbs' },
          { type: 'add', path: '{{targetDir}}/src/features/auth/actions.ts', templateFile: 'plop-templates/auth/nextjs/auth-actions.ts.hbs' },
          { type: 'add', path: '{{targetDir}}/src/features/auth/AuthProvider.tsx', templateFile: 'plop-templates/auth/nextjs/AuthProvider.tsx.hbs' },
        );
      } else {
        actions.push(
          { type: 'add', path: '{{targetDir}}/src/features/auth/auth.controller.ts', templateFile: 'plop-templates/auth/node/auth.controller.ts.hbs' },
          { type: 'add', path: '{{targetDir}}/src/features/auth/auth.service.ts', templateFile: 'plop-templates/auth/node/auth.service.ts.hbs' },
          { type: 'add', path: '{{targetDir}}/src/features/auth/auth.middleware.ts', templateFile: 'plop-templates/auth/node/auth.middleware.ts.hbs' },
          { type: 'add', path: '{{targetDir}}/src/features/auth/auth.routes.ts', templateFile: 'plop-templates/auth/node/auth.routes.ts.hbs' },
          { type: 'add', path: '{{targetDir}}/src/features/auth/auth.dto.ts', templateFile: 'plop-templates/auth/node/auth.dto.ts.hbs' },
        );
      }

      return actions;
    },
  });
}
