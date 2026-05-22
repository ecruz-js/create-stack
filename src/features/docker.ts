import type { ScaffoldConfig } from '../types.js';
import { createSpinner } from '../utils/logger.js';

export async function applyDocker(config: ScaffoldConfig): Promise<void> {
  const spinner = createSpinner('Adding Docker files...');
  spinner.start();
  // Will be implemented with node-plop later
  spinner.succeed('Docker files added');
}
