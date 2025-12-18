---
sidebar_position: 1
title: Start with Monorepo
---

# Starting a Monorepo: Step-by-Step Guide

Setting up a monorepo can seem daunting, but it's actually pretty straightforward. Here's how I set up this project step by step.

## Step 1: Initialize the Project

First, I created a new directory for the project and initialized it as a Node.js project:

```bash
mkdir code-tode
cd code-tode
npm init -y
```

This generates a `package.json` file, which is essential for managing dependencies and scripts.

## Step 1.1: Install Node.js 24 with nvm

Before proceeding, ensure you have `nvm` (Node Version Manager) installed. If not, install it by following the instructions on the [nvm GitHub repository](https://github.com/nvm-sh/nvm#installing-and-updating).

Once `nvm` is installed, install Node.js version 24.5.0 (as used in the commit):

```bash
nvm install 24.5.0
nvm use 24.5.0
```

To make this version the default for the project, create an `.nvmrc` file with the version number:

```bash
echo "v24.5.0" > .nvmrc
```

This ensures that anyone working on the project can easily switch to the correct Node.js version by running `nvm use`.

## Step 2: Add a `.gitignore` File

To keep the repository clean, add a `.gitignore` file. This file tells Git which files and directories to ignore.

```gitignore
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
```

## Step 3: Specify the Node.js Version with `.nvmrc`

To ensure everyone uses the same Node.js version, add a `.nvmrc` file with the following content:

```plaintext
v24.5.0
```

This makes it easy to switch to the correct Node.js version using `nvm`:

```bash
nvm use
```

## Step 4: Set Up the Monorepo Structure

Use `pnpm` for managing the monorepo. First, install `pnpm` globally:

```bash
npm install -g pnpm
```

Create a `pnpm-workspace.yaml` file to define the monorepo structure:

```yaml
packages:
  - "packages/*"
  - "frontend"
  - "backend"
```

This tells `pnpm` where to look for packages in the monorepo.

## Step 5: Initialize Git Repository

Finally, I initialized a Git repository and connected it to a remote repository:

```bash
git init
git remote add origin https://your.git.repo/here
git add .
git commit -m "Initial commit"
git push -u origin main
```

## Why This Setup?

- **`package.json`**: Manages dependencies and scripts for the project.
- **`.gitignore`**: Keeps the repository clean by ignoring unnecessary files.
- **`.nvmrc`**: Ensures consistent Node.js versions across environments.
- **`pnpm-workspace.yaml`**: Defines the structure of the monorepo, making it easy to manage multiple packages.

And that's it! With these steps, the monorepo is ready to go. Happy coding!
