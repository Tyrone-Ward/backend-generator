#!/usr/bin/env node

const fs = require('fs').promises
const path = require('path')
const { exec } = require('child_process')
const util = require('util')
const { argv } = require('node:process')

const execPromise = util.promisify(exec)

async function cloneRepo(folderName, repoUrl) {
  try {
    // Create the folder
    await fs.mkdir(folderName, { recursive: true })
    console.log(`Folder "${folderName}" created.`)

    // Change the working directory
    const folderPath = path.resolve(folderName)
    process.chdir(folderPath)
    console.log(`Changed working directory to "${folderPath}".`)

    // Clone the repo
    await execPromise(`git clone ${repoUrl} .`)
    console.log(`Repository cloned into "${folderPath}".`)

    // Modify package.json
    const packageJsonPath = path.join(folderPath, 'package.json')
    const packageData = await fs.readFile(packageJsonPath, 'utf8')
    const packageJson = JSON.parse(packageData)

    // Update the "name" property
    packageJson.name = folderName.toLowerCase()

    // Write back to package.json
    await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8')
    console.log(`Updated package.json name to "${folderName.toLowerCase()}".`)

    console.log('Run "npm i" to install packages.')
  } catch (error) {
    console.error('Error:', error.message)
  }
}

const folderName = argv[2]
const repoUrl = 'https://github.com/Tyrone-Ward/nodejs-template.git'

cloneRepo(folderName, repoUrl)
