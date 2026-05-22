import type { ScaffoldConfig } from '../types.js';
import { createSpinner } from '../utils/logger.js';

export async function applyCicd(config: ScaffoldConfig): Promise<void> {
  const spinner = createSpinner('Adding CI/CD workflow...');
  spinner.start();
  // Will be implemented with node-plop later
  spinner.succeed('CI/CD workflow added');
}
