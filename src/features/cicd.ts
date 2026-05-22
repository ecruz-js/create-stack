import nodePlop from 'node-plop';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { ScaffoldConfig } from '../types.js';
import { createSpinner } from '../utils/logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const plopfilePath = path.resolve(__dirname, '../../plopfile.js');

export async function applyCicd(config: ScaffoldConfig): Promise<void> {
  const spinner = createSpinner('Adding CI/CD workflow...');
  spinner.start();

  try {
    const plop = await nodePlop(plopfilePath);
    const generator = plop.getGenerator('cicd');
    const results = await generator.runActions({
      ...config,
      targetDir: config.targetDir,
    });

    if (results.failures.length > 0) {
      spinner.warn('CI/CD workflow could not be created');
      return;
    }

    spinner.succeed('CI/CD workflow added');
  } catch {
    spinner.fail('Failed to add CI/CD workflow');
  }
}
