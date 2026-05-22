import type { ScaffoldConfig } from '../types.js';
import { createSpinner } from '../utils/logger.js';

export async function applyLinting(config: ScaffoldConfig): Promise<void> {
  const spinner = createSpinner('Adding linting config...');
  spinner.start();
  // Will be implemented with node-plop later
  spinner.succeed('Linting config added');
}
