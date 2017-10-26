#! /usr/bin/env node

"use strict"

const program = require('commander')
const path = require('path')
const fs = require('fs')
const co = require('co')
const chalk = require('chalk')
const pkg = require('../package.json')
const shell = require('shelljs')
const argv = require('yargs').argv

function onError(err) {
  console.log('[Error]')
  console.log(err.stack || err)
  process.exit(1)
}

program
  .version(pkg.version)
  .usage('[command] [options]')

program
  .command('*')
  .description('webpack项目构建器')
  .action(cmd => {
    const availableCommands = ['dev', 'build']
    
    if (availableCommands.indexOf(cmd) === -1) {
      program.help()
      process.exit(1)
    } else {
      switch (cmd) {
        case 'dev':
        case 'build':
          const filePath = require.resolve('../server/' + cmd)
          // 需要透传命令行参数
          shell.exec(`node ${filePath} ${process.argv.join(' ')}`)
          break
        default:
          break
      }
    }
  })

program.on('--help', function () {
  console.log('');
  console.log('    dev                 开启本地调试服务器');
  console.log('    build               执行代码构建');
  console.log('');
})

program.parse(process.argv)

const subcmd = program.args[0]
if (!subcmd) {
  program.help()
}