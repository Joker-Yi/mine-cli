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
          .then((answers) => {
            spinner.start('Start download template');
            // pacote 包的下载，缓存和管理   包名  缓存/下载到的路径  参数配置
            // return pacote.extract('may-templates-demo', './mayCache', {
            //   cache: false
            // }).then(() => {
              spinner.start('Start download template');
              return answers;
            // });
          })
          .then(answers => {
            return new Promise((resolve, reject) => {
              spinner.start('Start copy template');
              // 复制模板  复制源  复制到哪儿去   回调函数
              // ncp(cacheDir, answers.projectName, err => {
              //   if (err) {
              //     reject(err);
              //   } else {
              //     shell.rm('-rf', cacheDir); // 删除缓存
              //     spinner.succeed('Copy template succeed');
              //     resolve(answers);
              //   }
              // });
              downLoad(url, answers.projectName, {
                clone
              }, err => {
                if ( err){
                  reject(err)
                } else {
                  spinner.stop()
                  console.log(err?err:"项目创建成功")
                  resolve(answers);
                }
              })
            });
          })
          // .then((answers) => {
          //   // 修改package.json
          //   let packagejsonPath = path.resolve(process.cwd(), `./${answers.projectName}/package.json`);
          //   const packageJson = Object.assign(
          //       require(packagejsonPath),
          //       {
          //         name: answers.projectName,
          //         author: answers.projectAuthor,
          //         version: '0.0.1'
          //       }
          //   );
          //   fs.writeFileSync(packagejsonPath, JSON.stringify(packageJson, null, 4));
          //   // 重命名文件
          //   fs.renameSync(
          //       `${answers.projectName}/.npmrc.text`,
          //       `${answers.projectName}/.npmrc`
          //   );
          //   fs.renameSync(
          //       `${answers.projectName}/.gitignore.text`,
          //       `${answers.projectName}/.gitignore`
          //   );
          //   // 替换变量
          //   let readmePath = `./${answers.projectName}/README.md`;
          //   let data = fs.readFileSync(readmePath)
          //       .toString()
          //       .replace('PROJECT_DESCRIPTION', answers.projectDescription);
          //   fs.writeFileSync(readmePath, data);
          //   return answers
          // })
          .then(answers => {
            console.log(chalk.green('\n To created an project'));
            console.log(
                `\n you can ${chalk.green(
                    `cd ${answers.projectName}`
                )} && ${chalk.green(
                    'npm i \n'
                )}`
            );
            let packagejsonPath = path.resolve(process.cwd(), `./${answers.projectName}/package.json`);
            console.log(packagejsonPath)
            fs.readFile(packagejsonPath, 'utf8', function (err, data) {
              console.log(data['dependencies']);
              var obj = JSON.parse(data)
            })
          })
    });

// 必须在最后被调用，解析命令行参数
program.parse(process.argv);






