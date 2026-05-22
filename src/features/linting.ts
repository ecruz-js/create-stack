import nodePlop from 'node-plop';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'fs-extra';
import type { ScaffoldConfig } from '../types.js';
import { createSpinner } from '../utils/logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const plopfilePath = path.resolve(__dirname, '../../plopfile.js');

export async function applyLinting(config: ScaffoldConfig): Promise<void> {
  const spinner = createSpinner('Adding linting config...');
  spinner.start();

  try {
    const plop = await nodePlop(plopfilePath);
    const generator = plop.getGenerator('linting');
    const results = await generator.runActions({
      ...config,
      targetDir: config.targetDir,
    });

    if (results.failures.length > 0) {
      spinner.warn('Some linting files could not be created');
      return;
    }

    // Add lint scripts to package.json
    const pkgPath = path.join(config.targetDir, 'package.json');
    if (await fs.pathExists(pkgPath)) {
      const pkg = await fs.readJson(pkgPath);
      pkg.scripts = pkg.scripts || {};
      const isVanilla = config.stack === 'vanilla';
      const ext = isVanilla ? '.js' : '.ts,.tsx';
      const glob = isVanilla ? 'js/**/*.js' : 'src/**/*.{ts,tsx}';
      const lintGlob = isVanilla ? '*.js' : '*.{ts,tsx}';
      pkg.scripts.lint = `eslint ${isVanilla ? 'js' : 'src'} --ext ${ext}`;
      pkg.scripts['lint:fix'] = `eslint ${isVanilla ? 'js' : 'src'} --ext ${ext} --fix`;
      pkg.scripts.format = `prettier --write "${glob}"`;
      pkg.scripts.prepare = 'husky install';

      pkg['lint-staged'] = {
        [lintGlob]: ['eslint --fix', 'prettier --write'],
        '*.{json,css,md}': ['prettier --write'],
      };

      pkg.devDependencies = pkg.devDependencies || {};
      pkg.devDependencies.eslint = '^9.0.0';
      pkg.devDependencies.prettier = '^3.3.0';
      pkg.devDependencies.husky = '^9.1.0';
      pkg.devDependencies['lint-staged'] = '^15.2.0';

      await fs.writeJson(pkgPath, pkg, { spaces: 2 });
    }

    spinner.succeed('Linting config added');
  } catch {
    spinner.fail('Failed to add linting config');
  }
}
