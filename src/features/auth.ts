import nodePlop from 'node-plop';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'fs-extra';
import type { ScaffoldConfig } from '../types.js';
import { createSpinner } from '../utils/logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const plopfilePath = path.resolve(__dirname, '../../plopfile.js');

export async function applyAuth(config: ScaffoldConfig): Promise<void> {
  const spinner = createSpinner('Adding auth module...');
  spinner.start();

  try {
    const plop = await nodePlop(plopfilePath);
    const generator = plop.getGenerator('auth');
    const results = await generator.runActions({
      ...config,
      targetDir: config.targetDir,
    });

    if (results.failures.length > 0) {
      spinner.warn('Some auth files could not be created');
      return;
    }

    // Add auth dependencies to package.json
    const isNode = config.stack === 'node-express' || config.stack === 'node-hono';
    const pkgPath = path.join(config.targetDir, 'package.json');
    if (await fs.pathExists(pkgPath)) {
      const pkg = await fs.readJson(pkgPath);
      pkg.dependencies = pkg.dependencies || {};

      if (isNode) {
        pkg.dependencies['jsonwebtoken'] = '^9.0.0';
        pkg.dependencies['bcrypt'] = '^5.1.0';
        pkg.dependencies['cookie-parser'] = '^1.4.0';
        pkg.devDependencies = pkg.devDependencies || {};
        pkg.devDependencies['@types/jsonwebtoken'] = '^9.0.0';
        pkg.devDependencies['@types/bcrypt'] = '^5.0.0';
        pkg.devDependencies['@types/cookie-parser'] = '^1.4.0';
      } else if (config.stack === 'nextjs') {
        pkg.dependencies['jose'] = '^5.0.0';
        pkg.dependencies['bcrypt'] = '^5.1.0';
        pkg.devDependencies = pkg.devDependencies || {};
        pkg.devDependencies['@types/bcrypt'] = '^5.0.0';
      }

      await fs.writeJson(pkgPath, pkg, { spaces: 2 });
    }

    spinner.succeed('Auth module added');
  } catch {
    spinner.fail('Failed to add auth module');
  }
}
