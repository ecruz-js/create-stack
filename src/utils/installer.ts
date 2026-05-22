import { execSync } from 'node:child_process';
import { createSpinner } from './logger.js';

export async function installDependencies(targetDir: string): Promise<void> {
  const spinner = createSpinner('Installing dependencies...');
  spinner.start();

  try {
    execSync('npm install', {
      cwd: targetDir,
      stdio: 'pipe',
    });
    spinner.succeed('Dependencies installed');
  } catch {
    spinner.warn('npm install failed. Run manually: cd ' + targetDir + ' && npm install');
  }
}
