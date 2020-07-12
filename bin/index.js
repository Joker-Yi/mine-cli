#!/usr/bin/env node

// 告诉操作系统用node执行该文件

const cacheDir = 'mayCache';
const program = require('commander'); // 命令行模块
const version = require('../package').version; // 从package.json中获取版本信息
const inquirer = require('inquirer'); // 问答模块
const pacote = require('pacote');
const ncp = require('ncp');
const shell = require('shelljs');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const ora = require('ora');
const downLoad = require('download-git-repo')
const spinner = ora();

let url = 'Joker-Yi/vue-temp'
let clone = false

// 问答模板
let userQuestions = [
  {
    type: 'input',
    name: 'projectName',
    message: 'Project name',
    default() {
      return 'vue-demo';
    }
  },
  {
    type: 'input',
    name: 'projectDescription',
    message: 'Project description',
    default() {
      return 'An awesome vue project';
    }
  },
  {
    type: 'input',
    name: 'projectAuthor',
    message: 'Author',
    default() {
      return 'Your Name <you@example.com>';
    }
  },
  {
    type: 'input',
    name: 'projectAuthor',
    message: 'Author',
    default() {
      return 'Your Name <you@example.com>';
    }
  },
  {
    type: 'input',
    name: 'gitUrl',
    message: 'Please enter the git repository address/name \n of the program template to be cloned(E.g：Joker-Yi/vue-temp)',
    default() {
      return url;
    }
  }
];

program
    .version(version, '-v, --version')
    .description('cli for Vue')
    .usage('<command> [options]');

// 初始化命令
program
    .command('init')
    .action(() => {
      inquirer.prompt(userQuestions) // 调用问答 列表
          .then(answers => {
            return new Promise((resolve, reject) => {
              spinner.start(`Start download template from ` + answers.gitUrl);
              downLoad(answers.gitUrl|| url, answers.projectName, {
                clone
              }, err => {
                if (err) {
                  reject(err)
                } else {
                  spinner.stop()
                  console.log(err ? err :chalk.green("Created successfully..."))
                  resolve(answers);
                }
              })
            });
          })
          .then(answers => {
            console.log(chalk.green('\n To start your project'));
            console.log(
                `\n You can ${chalk.green(
                    `cd ${answers.projectName}`
                )} && ${chalk.green(
                    'npm i \n'
                )}`
            );
            // let packagejsonPath = path.resolve(process.cwd(), `./${answers.projectName}/package.json`);
            // console.log(packagejsonPath)
            // fs.readFile(packagejsonPath, 'utf8', function (err, data) {
            //   console.log(data['dependencies']);
            //   var obj = JSON.parse(data)
            // })
          })
          .catch((err) => {
            console.log(chalk.red('\n' + err));
          })
    });

// 必须在最后被调用，解析命令行参数
program.parse(process.argv);






