#!/usr/bin/env node

import fs from 'fs/promises'
import path from 'path'
import { exec } from 'child_process'
import util from 'util'
import { argv } from 'node:process'
import { select, Separator } from '@inquirer/prompts'

const execPromise = util.promisify(exec)

const authenticationAnswer = await select({
  message: 'Do you need authentication?',
  choices: [
    {
      name: 'Yes',
      value: true,
      description: 'Good for an API'
    },
    {
      name: 'No',
      value: false,
      description: 'Suitable for tooling.'
    }
  ]
})

let authenticationDetails

if (authenticationAnswer) {
  authenticationDetails = await select({
    message: 'Auth type',
    choices: [
      {
        name: 'Clerk',
        value: '@clerk/backend',
        description: 'Adds Clerk authentication and user management to your project.'
      },
      {
        name: 'JSON Web Token',
        value: 'jsonwebtoken', // jsonwebtoken
        description: 'JWT Authentication.'
      }
    ]
  })
}

const database = await select({
  message: 'Select a database.',
  choices: [
    {
      name: 'SQLite3',
      value: 'sqlite3',
      description: 'Install asynchronous, non-blocking SQLite3 bindings for Node.js.'
    },
    {
      name: 'MongoDB',
      value: 'mongodb',
      description: 'Install official MongoDB driver for Node.js'
    },
    {
      name: 'No database',
      value: undefined
    }
  ]
})

function createFolder(folderName) {
  return fs.mkdir(folderName, { recursive: true }).then(() => {
    console.log(`Folder "${folderName}" created.`)
    return path.resolve(folderName)
  })
}

function changeWorkingDirectory(folderPath) {
  process.chdir(folderPath)
  console.log(`Changed working directory to "${folderPath}".`)
  return Promise.resolve(folderPath)
}

function cloneRepository(repoUrl) {
  return execPromise(`git clone ${repoUrl} .`).then(() => {
    console.log(`Repository cloned.`)
  })
}
// TDOD: add dependencies based on user input
function updatePackageJson(folderName, folderPath, options) {
  const packageJsonPath = path.join(folderPath, 'package.json')

  return fs
    .readFile(packageJsonPath, 'utf8')
    .then((data) => {
      const packageJson = JSON.parse(data)
      packageJson.name = folderName.toLowerCase()
      return fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8')
    })
    .then(() => {
      console.log(`Updated package.json name to "${folderName.toLowerCase()}".`)
    })
}

const options = { authentication: authenticationDetails, database }
console.log(options)

const folderName = argv[2]
const repoUrl = 'https://github.com/Tyrone-Ward/nodejs-template.git'

async function cloneRepo(folderName, repoUrl) {
  try {
    const folderPath = await createFolder(folderName)
    await changeWorkingDirectory(folderPath)
    await cloneRepository(repoUrl)
    await updatePackageJson(folderName, folderPath, options)
    console.log(options)
    console.log('Run "npm i" to install packages.')
  } catch (error) {
    console.error('Error:', error.message)
  }
}

cloneRepo(folderName, repoUrl)
