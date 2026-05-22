import nodePlop from 'node-plop';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { ScaffoldConfig } from '../types.js';
import { createSpinner } from '../utils/logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const plopfilePath = path.resolve(__dirname, '../../plopfile.js');

export async function applyDocker(config: ScaffoldConfig): Promise<void> {
  const spinner = createSpinner('Adding Docker files...');
  spinner.start();

  try {
    const plop = await nodePlop(plopfilePath);
    const generator = plop.getGenerator('docker');
    const results = await generator.runActions({
      ...config,
      targetDir: config.targetDir,
    });

    if (results.failures.length > 0) {
      spinner.warn('Some Docker files could not be created');
      return;
    }

    spinner.succeed('Docker files added');
  } catch {
    spinner.fail('Failed to add Docker files');
  }
}
