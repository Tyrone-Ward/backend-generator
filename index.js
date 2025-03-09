#!/usr/bin/env node

import fs from 'fs/promises'
import path from 'path'
import { exec } from 'child_process'
import util from 'util'
import { argv } from 'node:process'
import { select, Separator } from '@inquirer/prompts'

const execPromise = util.promisify(exec)

const answer = await select({
  message: 'Do you need authentication?',
  choices: [
    {
      name: 'Yes',
      value: true,
      description: 'Adds Clerk authentication and user management to your React application.'
    },
    {
      name: 'No',
      value: false,
      description: 'Roll your own authentication service.'
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

function updatePackageJson(folderName, folderPath) {
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

function cloneRepo(folderName, repoUrl) {
  createFolder(folderName)
    .then((folderPath) => changeWorkingDirectory(folderPath))
    .then(() => cloneRepository(repoUrl))
    .then(() => updatePackageJson(folderName, process.cwd()))
    .then(() => console.log('Run "npm i" to install packages.'))
    .catch((error) => console.error('Error:', error.message))
}

const folderName = argv[2]
const repoUrl = 'https://github.com/Tyrone-Ward/nodejs-template.git'

async function cloneRepo(folderName, repoUrl) {
  try {
    const folderPath = await createFolder(folderName)
    await changeWorkingDirectory(folderPath)
    await cloneRepository(repoUrl)
    await updatePackageJson(folderName, folderPath)
    console.log('Run "npm i" to install packages.')
  } catch (error) {
    console.error('Error:', error.message)
  }
}
