#!/usr/bin/env node

import { program } from 'commander';
import { banner, done, error } from './utils/logger.js';
import { collectAnswers } from './prompts.js';
import { scaffold } from './scaffolder.js';
import { STACKS, FEATURES } from './templates.js';
import type { StackChoice, FeatureChoice } from './types.js';
import chalk from 'chalk';

program
  .name('create-stack')
  .description('Scaffold projects with pre-implemented architecture patterns')
  .version('0.1.0')
  .argument('[project-name]', 'Name of the project')
  .option('--stack <type>', 'Stack: react-spa | nextjs | node-express | node-hono | vanilla')
  .option('--features <list>', 'Comma-separated: docker,cicd,linting,auth (use "none" for no features)')
  .option('--list', 'List available stacks and features')
  .option('--dry-run', 'Show what would be created without creating files')
  .action(async (projectName: string | undefined, options) => {
    try {
      if (options.list) {
        printList();
        return;
      }

      banner();

      const defaults: Record<string, unknown> = {};
      if (projectName) defaults.projectName = projectName;
      if (options.stack) {
        if (!(options.stack in STACKS)) {
          error(`Unknown stack: "${options.stack}". Run create-stack --list to see options.`);
          process.exit(1);
        }
        defaults.stack = options.stack as StackChoice;
      }
      if (options.features) {
        if (options.features === 'none') {
          defaults.features = [];
        } else {
          const feats = options.features.split(',') as FeatureChoice[];
          const validFeatures = Object.keys(FEATURES);
          for (const f of feats) {
            if (!validFeatures.includes(f)) {
              error(`Unknown feature: "${f}". Run create-stack --list to see options.`);
              process.exit(1);
            }
          }
          defaults.features = feats;
        }
      } else if (projectName && options.stack) {
        defaults.features = [];
      }

      const config = await collectAnswers(defaults);

      if (options.dryRun) {
        printDryRun(config);
        return;
      }

      await scaffold(config);
      done(config.projectName);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      error(message);
      process.exit(1);
    }
  });

function printList(): void {
  console.log();
  console.log(chalk.bold('Available stacks:'));
  for (const [key, info] of Object.entries(STACKS)) {
    console.log(`  ${chalk.cyan(key.padEnd(16))} ${info.description}`);
  }
  console.log();
  console.log(chalk.bold('Available features:'));
  for (const [key, info] of Object.entries(FEATURES)) {
    console.log(`  ${chalk.cyan(key.padEnd(16))} ${info.description}`);
  }
  console.log();
}

function printDryRun(config: { projectName: string; stack: StackChoice; features: FeatureChoice[]; targetDir: string }): void {
  const stackInfo = STACKS[config.stack];
  console.log();
  console.log(chalk.bold('Dry run — no files will be created:'));
  console.log(`  ${chalk.bold('Stack:')}    ${stackInfo.name}`);
  console.log(`  ${chalk.bold('Features:')} ${config.features.length > 0 ? config.features.join(', ') : 'none'}`);
  console.log(`  ${chalk.bold('Target:')}   ${config.targetDir}`);
  console.log();
}

program.parse();
