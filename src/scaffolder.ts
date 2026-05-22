import degit from 'degit';
import fs from 'fs-extra';
import path from 'node:path';
import type { ScaffoldConfig } from './types.js';
import { STACKS } from './templates.js';
import { createSpinner, warn } from './utils/logger.js';
import { installDependencies } from './utils/installer.js';
import { applyFeatures } from './features/index.js';

async function cloneTemplate(config: ScaffoldConfig): Promise<void> {
  const stackInfo = STACKS[config.stack];
  const spinner = createSpinner(`Cloning ${stackInfo.name} template...`);
  spinner.start();

  try {
    const emitter = degit(stackInfo.repo, { cache: false, force: true });
    await emitter.clone(config.targetDir);
    spinner.succeed(`Template cloned: ${stackInfo.name}`);
  } catch (err) {
    spinner.fail(`Failed to clone template`);
    const message = err instanceof Error ? err.message : String(err);
    if (message.includes('404')) {
      throw new Error(
        `Template not found: ${stackInfo.repo}. Run create-stack --list to see available stacks.`
      );
    }
    throw new Error(`No internet connection or GitHub is unreachable. degit needs GitHub access.`);
  }
}

async function renameProject(config: ScaffoldConfig): Promise<void> {
  const spinner = createSpinner('Applying project name...');
  spinner.start();

  const pkgPath = path.join(config.targetDir, 'package.json');
  if (await fs.pathExists(pkgPath)) {
    const pkg = await fs.readJson(pkgPath);
    pkg.name = config.projectName;
    await fs.writeJson(pkgPath, pkg, { spaces: 2 });
  }

  const readmePath = path.join(config.targetDir, 'README.md');
  if (await fs.pathExists(readmePath)) {
    let readme = await fs.readFile(readmePath, 'utf-8');
    readme = readme.replace(/\{\{projectName\}\}/g, config.projectName);
    await fs.writeFile(readmePath, readme);
  }

  spinner.succeed('Project name applied');
}

export async function scaffold(config: ScaffoldConfig): Promise<void> {
  let cleanupNeeded = false;

  const cleanup = async () => {
    if (cleanupNeeded && (await fs.pathExists(config.targetDir))) {
      await fs.remove(config.targetDir);
      console.log('\n');
      warn('Operation cancelled. Cleaned up.');
    }
    process.exit(0);
  };

  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);

  try {
    cleanupNeeded = true;
    await cloneTemplate(config);
    await renameProject(config);
    await applyFeatures(config);
    cleanupNeeded = false;
    await installDependencies(config.targetDir);
  } catch (err) {
    if (cleanupNeeded && (await fs.pathExists(config.targetDir))) {
      await fs.remove(config.targetDir);
    }
    throw err;
  } finally {
    process.removeListener('SIGINT', cleanup);
    process.removeListener('SIGTERM', cleanup);
  }
}
