import ora, { type Ora } from 'ora';
import chalk from 'chalk';

export function createSpinner(text: string): Ora {
  return ora({ text, color: 'cyan' });
}

export function success(message: string): void {
  console.log(chalk.green('✔') + ' ' + message);
}

export function error(message: string): void {
  console.log(chalk.red('✖') + ' ' + message);
}

export function warn(message: string): void {
  console.log(chalk.yellow('⚠') + ' ' + message);
}

export function info(message: string): void {
  console.log(chalk.blue('ℹ') + ' ' + message);
}

export function banner(): void {
  console.log();
  console.log(chalk.bold.cyan('  create-stack'));
  console.log(chalk.gray('  Scaffold projects with architecture patterns'));
  console.log();
}

export function done(projectName: string): void {
  console.log();
  console.log(chalk.green.bold('  Done!'));
  console.log();
  console.log(`  ${chalk.bold('cd')} ${projectName}`);
  console.log(`  ${chalk.bold('npm run dev')}`);
  console.log();
}
