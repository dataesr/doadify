#!/usr/bin/env node

// Usage: npx @dataesr/doadify my-app
import spawn from 'cross-spawn';
import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { fileURLToPath } from 'url';

// The first argument will be the project name.
const projectName = process.argv[2];

// Create a project directory with the project name.
const currentDir = process.cwd();
const projectDir = path.resolve(currentDir, projectName);
fs.mkdirSync(projectDir, { recursive: true });

// A common approach to building a starter template is to
// create a `template` folder which will house the template
// and the files we want to create.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const templateDir = path.resolve(__dirname, 'templates');
console.log(chalk.red(templateDir));
fs.cpSync(templateDir, projectDir, { recursive: true });

// It is good practice to have dotfiles stored in the
// template without the dot (so they do not get picked
// up by the starter template repository). We can rename
// the dotfiles after we have copied them over to the
// new project directory.
fs.renameSync(
  path.join(projectDir, 'gitignore'),
  path.join(projectDir, '.gitignore')
);
fs.renameSync(
  path.join(projectDir, 'github'),
  path.join(projectDir, '.github')
);

const questions = [
  {
    type: 'list',
    name: 'mongo',
    message: 'Do you need mongodb?',
    choices: ['Yes', 'No'],
    filter(val) {
      return val.toLowerCase();
    },
  },
];

const answers = await inquirer
  .prompt(questions)
  .catch((error) => {
    if (error.isTtyError) {
      console.log(chalk.red('Error'))
    } else {
      console.log(chalk.red('Error'))
    }
  });

const {default: projectPackageJson} = await import(`${path.join(projectDir, 'package.json')}`, { assert: { type: 'json' } });
projectPackageJson.name = projectName;

console.log(chalk.green(JSON.stringify(projectPackageJson, null, 2)));

// Update the project's package.json with the new project name

fs.writeFileSync(
  path.join(projectDir, 'package.json'),
  JSON.stringify(projectPackageJson, null, 2)
);

// // Run `npm install` in the project directory to install
// // the dependencies. We are using a third-party library
// // called `cross-spawn` for cross-platform support.
// // (Node has issues spawning child processes in Windows).
process.chdir(projectName)
// Install client dependancies
spawn.sync('npm', ['create', 'vite@latest', `client`, '--', '--template', 'react'], { stdio: 'inherit' });
spawn.sync('npm', ['i', '--workspace=client', '@dataesr/react-dsfr', '@tanstack/react-query', '@tanstack/react-query-devtools', 'classnames', 'prop-types', 'react-router-dom'], { stdio: 'inherit' });
spawn.sync('npm', ['i', '--workspace=client', '-D', 'sass'], { stdio: 'inherit' });
spawn.sync('npx', ['--workspace=client', 'install-peerdeps', '-D', 'eslint-config-airbnb'], { stdio: 'inherit' });

// Install client dependancies
spawn.sync('npm', ['i', '--workspace=server', 'express', 'dotenv', 'cors'], { stdio: 'inherit' });
spawn.sync('npm', ['i', '--workspace=server', '-D', 'nodemon'], { stdio: 'inherit' });
spawn.sync('npx', ['--workspace=server', 'install-peerdeps', '-D', 'eslint-config-airbnb-base'], { stdio: 'inherit' });

console.log('Success! Your new project is ready.');
console.log(`Created ${projectName} at ${projectDir}`);