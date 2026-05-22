import { input, select, checkbox, confirm } from '@inquirer/prompts';
import type { StackChoice, FeatureChoice, ScaffoldConfig } from './types.js';
import { getStackChoices, getFeatureChoices } from './templates.js';
import path from 'node:path';
import fs from 'fs-extra';

function validateProjectName(value: string): string | true {
  if (!value.trim()) return 'Project name is required';
  if (!/^[a-z0-9][a-z0-9-]*$/.test(value)) {
    return 'Only lowercase letters, numbers, and hyphens allowed. Must start with letter or number.';
  }
  return true;
}

export async function collectAnswers(
  defaults: Partial<ScaffoldConfig> = {}
): Promise<ScaffoldConfig> {
  const projectName =
    defaults.projectName ??
    (await input({
      message: 'Project name:',
      default: 'my-app',
      validate: validateProjectName,
    }));

  const targetDir = path.resolve(process.cwd(), projectName);

  if (await fs.pathExists(targetDir)) {
    const overwrite = await confirm({
      message: `Directory "${projectName}" already exists. Overwrite?`,
      default: false,
    });
    if (!overwrite) {
      process.exit(0);
    }
    await fs.remove(targetDir);
  }

  const stack =
    defaults.stack ??
    (await select<StackChoice>({
      message: 'Select stack:',
      choices: getStackChoices(),
    }));

  const features =
    defaults.features ??
    (await checkbox<FeatureChoice>({
      message: 'Select optional features (press Enter to skip):',
      choices: getFeatureChoices(),
    }));

  return { projectName, stack, features, targetDir };
}
