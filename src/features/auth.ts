import type { ScaffoldConfig } from '../types.js';
import { createSpinner } from '../utils/logger.js';

export async function applyAuth(config: ScaffoldConfig): Promise<void> {
  const spinner = createSpinner('Adding auth module...');
  spinner.start();
  // Will be implemented with node-plop later
  spinner.succeed('Auth module added');
}
