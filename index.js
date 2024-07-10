#!/usr/bin/env node

// Usage: npx @dataesr/doadify my-app
import fs from "fs";
import path from "path";
import inquirer from "inquirer";
import chalk from "chalk";
import { fileURLToPath } from "url";

async function scaffoldFullstack(projectName) {
  const currentDir = process.cwd();
  const projectDir = path.resolve(currentDir, projectName);
  fs.mkdirSync(projectDir, { recursive: true });

  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const templateDir = path.resolve(__dirname, "templates/fullstack");
  fs.cpSync(templateDir, projectDir, { recursive: true });

  const publicDirSrc = path.join(templateDir, "client", "public");
  const publicDirDest = path.join(projectDir, "client", "public");
  fs.mkdirSync(publicDirDest, { recursive: true });
  fs.cpSync(publicDirSrc, publicDirDest, { recursive: true });

  // Update the project's package.json with the new project name
  const { default: projectPackageJson } = await import(
    `${path.join(projectDir, "package.json")}`,
    { assert: { type: "json" } }
  );
  projectPackageJson.name = projectName;
  fs.writeFileSync(
    path.join(projectDir, "package.json"),
    JSON.stringify(projectPackageJson, null, 2)
  );

  // Rename the dotfiles after we have copied them over to the new project directory.
  fs.renameSync(
    path.join(projectDir, "_github"),
    path.join(projectDir, ".github")
  );
  fs.renameSync(
    path.join(projectDir, "_dockerignore"),
    path.join(projectDir, ".dockerignore")
  );
  const clientDir = path.resolve(projectDir, "client");
  fs.renameSync(path.join(clientDir, "_env"), path.join(clientDir, ".env"));
  fs.renameSync(
    path.join(clientDir, "_env.staging"),
    path.join(clientDir, ".env.staging")
  );
  fs.renameSync(
    path.join(clientDir, "_env.production"),
    path.join(clientDir, ".env.production")
  );
  fs.renameSync(
    path.join(clientDir, "_eslintrc"),
    path.join(clientDir, ".eslintrc")
  );
  fs.renameSync(
    path.join(clientDir, "_gitignore"),
    path.join(clientDir, ".gitignore")
  );
  const serverDir = path.resolve(projectDir, "server");
  fs.renameSync(
    path.join(serverDir, "_eslintrc"),
    path.join(serverDir, ".eslintrc")
  );
  fs.renameSync(
    path.join(serverDir, "_gitignore"),
    path.join(serverDir, ".gitignore")
  );
}

async function scaffoldClient(projectName) {
  const currentDir = process.cwd();
  const projectDir = path.resolve(currentDir, projectName);
  fs.mkdirSync(projectDir, { recursive: true });

  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const templateDir = path.resolve(__dirname, "templates/client");
  fs.cpSync(templateDir, projectDir, { recursive: true });

  const publicDirSrc = path.join(templateDir, "public");
  const publicDirDest = path.join(projectDir, "public");
  fs.mkdirSync(publicDirDest, { recursive: true });
  fs.cpSync(publicDirSrc, publicDirDest, { recursive: true });

  // rename the dotfiles after we have copied them over to the new project directory.
  fs.renameSync(
    path.join(projectDir, "_github"),
    path.join(projectDir, ".github")
  );
  fs.renameSync(path.join(projectDir, "_env"), path.join(projectDir, ".env"));
  fs.renameSync(
    path.join(projectDir, "_env.staging"),
    path.join(projectDir, ".env.staging")
  );
  fs.renameSync(
    path.join(projectDir, "_env.production"),
    path.join(projectDir, ".env.production")
  );
  fs.renameSync(
    path.join(projectDir, "_eslintrc"),
    path.join(projectDir, ".eslintrc")
  );
  fs.renameSync(
    path.join(projectDir, "_gitignore"),
    path.join(projectDir, ".gitignore")
  );

  // Update the project's package.json with the new project name
  const { default: projectPackageJson } = await import(
    `${path.join(projectDir, "package.json")}`,
    { assert: { type: "json" } }
  );
  projectPackageJson.name = projectName;
  fs.writeFileSync(
    path.join(projectDir, "package.json"),
    JSON.stringify(projectPackageJson, null, 2)
  );
}

const projectName = process.argv[2];
const questions = [
  {
    type: "list",
    name: "type",
    message: "Do you need a server ?",
    choices: ["Yes", "No"],
    filter(val) {
      return val.toLowerCase();
    },
  },
];

const answers = await inquirer.prompt(questions).catch((error) => {
  if (error.isTtyError) {
    console.log(chalk.red("Error"));
  } else {
    console.log(chalk.red("Error"));
  }
});

if (answers.type === "no") {
  await scaffoldClient(projectName);
  console.log("");
  console.log(
    chalk.yellow.bold(`React project scaffolded in '/${projectName}'`)
  );
  console.log("-------------------------");
  console.log(` To get started, run:`);
  console.log(chalk.italic(`  > cd ${projectName}`));
  console.log(chalk.italic(`  > npm install`));
  console.log(chalk.italic(`  > npm run start`));
  console.log("-------------------------");
  console.log("");
  console.log("");
}
if (answers.type === "yes") {
  await scaffoldFullstack(projectName);
  console.log("");
  console.log(
    chalk.yellow.bold(`Fullstack project scaffolded in '/${projectName}'`)
  );
  console.log("-------------------------");
  console.log(` To get started, run:`);
  console.log(chalk.italic(`  > cd ${projectName}`));
  console.log(chalk.italic(`  > npm install`));
  console.log(chalk.italic(`  > npm run start`));
  console.log("-------------------------");
  console.log("");
  console.log("");
}
