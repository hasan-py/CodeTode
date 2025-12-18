---
sidebar_position: 2
title: Prerequisite
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Prerequisites

Before you can start working with the project, you'll need to install and configure several tools and services. This guide will walk you through installing each prerequisite on Windows, macOS, and Linux.

## Overview

### Required Tools (Essential)

The following tools are **required** to run and develop the project:

1. **Node.js** - JavaScript runtime for backend and frontend development
2. **NVM** (Node Version Manager) - Manage multiple Node.js versions
3. **pnpm** - Package manager for monorepo workspace management
4. **Git** - Version control system
5. **GitHub Account** - Required for authentication in the project
6. **Redis Server** - In-memory data store for caching and sessions
7. **PostgreSQL** - Primary database for the application
8. **Lemon Squeezy Account** - Payment gateway (test account is sufficient)
9. **Database Client** - GUI tool for database management (DBeaver recommended)
10. **VS Code** - Recommended IDE for development

### Optional Tools (For Experimentation)

These tools are **optional** but useful for cloud experimentation:

- **NeonDB Account** - Cloud PostgreSQL database
- **Redis Cloud Account** - Cloud Redis service

---

## 1. Node.js

Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine. **This project requires Node.js v24.5.0** (see the `.nvmrc` file in the root of the repository). Using the exact version ensures compatibility and prevents unexpected issues during development and deployment.

> **Why this version?**
>
> The `.nvmrc` file specifies the Node.js version (`v24.5.0`) that all contributors should use. This guarantees that everyone is running the same environment, avoiding bugs caused by version mismatches.

### Download

- **Official Website**: [https://nodejs.org/](https://nodejs.org/)
- **Recommended Version**: LTS (Long Term Support)

<Tabs>
<TabItem value="windows-node" label="Windows">

#### Installation

1. Download the Windows Installer (.msi) from [nodejs.org](https://nodejs.org/)
2. Run the installer and follow the setup wizard
3. Restart your command prompt/PowerShell

#### Verification

```bash
node --version
npm --version
```

Expected output:

```
v24.5.0
9.x.x (or higher)
```

</TabItem>
<TabItem value="macos-node" label="macOS">

#### Installation

**Option 1: Download from website**

1. Download the macOS Installer (.pkg) from [nodejs.org](https://nodejs.org/)
2. Run the installer and follow the setup wizard

**Option 2: Using Homebrew**

```bash
brew install node
```

#### Verification

```bash
node --version
npm --version
```

Expected output:

```
v24.5.0
9.x.x (or higher)
```

</TabItem>
<TabItem value="linux-node" label="Linux">

#### Installation

**Ubuntu/Debian:**

```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**CentOS/RHEL/Fedora:**

```bash
curl -fsSL https://rpm.nodesource.com/setup_lts.x | sudo bash -
sudo yum install -y nodejs
```

**Arch Linux:**

```bash
sudo pacman -S nodejs npm
```

#### Verification

```bash
node --version
npm --version
```

Expected output:

```
v24.5.0
9.x.x (or higher)
```

</TabItem>
</Tabs>

---

## 2. NVM (Node Version Manager)

NVM (Node Version Manager) allows you to install and switch between multiple Node.js versions easily. This is **essential** for our project because we require all contributors to use the exact Node.js version defined in `.nvmrc` (`v24.5.0`).

> **Why use NVM?**
>
> - Ensures everyone uses the same Node.js version for consistency
> - Prevents bugs and build errors caused by version mismatches
> - Makes it easy to switch Node.js versions for different projects

### Download

- **Website**: [https://github.com/nvm-sh/nvm](https://github.com/nvm-sh/nvm)
- **Windows Version**: [https://github.com/coreybutler/nvm-windows](https://github.com/coreybutler/nvm-windows)

<Tabs>
<TabItem value="windows-nvm" label="Windows">

#### Installation

1. Download `nvm-setup.zip` from [nvm-windows releases](https://github.com/coreybutler/nvm-windows/releases)
2. Extract and run `nvm-setup.exe` as Administrator
3. Restart your command prompt/PowerShell

#### Verification

```bash
nvm version
```

#### Install and Use Project Node.js Version

```bash
# This will install and use the version specified in .nvmrc (v24.5.0)
nvm install
nvm use
```

</TabItem>
<TabItem value="macos-nvm" label="macOS">

#### Installation

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
```

After installation, restart your terminal or run:

```bash
source ~/.bashrc
```

#### Verification

```bash
nvm --version
```

#### Install and Use Project Node.js Version

```bash
# This will install and use the version specified in .nvmrc (v24.5.0)
nvm install
nvm use
nvm alias default v24.5.0
```

</TabItem>
<TabItem value="linux-nvm" label="Linux">

#### Installation

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
```

After installation, restart your terminal or run:

```bash
source ~/.bashrc
```

#### Verification

```bash
nvm --version
```

#### Install and Use Project Node.js Version

```bash
# This will install and use the version specified in .nvmrc (v24.5.0)
nvm install
nvm use
nvm alias default v24.5.0
```

</TabItem>
</Tabs>

### pnpm

pnpm is a fast, disk space efficient package manager that this project uses for managing dependencies in the monorepo workspace. It's **essential** for installing and managing packages across multiple workspaces (backend, frontend, packages).

> **Why pnpm?**
>
> - Efficient disk usage with content-addressable storage
> - Built-in support for monorepo workspaces
> - Faster installations compared to npm
> - Strict dependency management prevents phantom dependencies

- **Official Website**: [https://pnpm.io/](https://pnpm.io/)

<Tabs>
<TabItem value="windows-pnpm" label="Windows">

#### Installation

**Using npm (after Node.js is installed):**

```bash
npm install -g pnpm
```

**Using PowerShell:**

```bash
iwr https://get.pnpm.io/install.ps1 -useb | iex
```

#### Verification

```bash
pnpm --version
```

Expected output:

```
9.x.x (or higher)
```

</TabItem>
<TabItem value="macos-pnpm" label="macOS">

#### Installation

**Using npm (after Node.js is installed):**

```bash
npm install -g pnpm
```

**Using Homebrew:**

```bash
brew install pnpm
```

**Using curl:**

```bash
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

#### Verification

```bash
pnpm --version
```

Expected output:

```
9.x.x (or higher)
```

</TabItem>
<TabItem value="linux-pnpm" label="Linux">

#### Installation

**Using npm (after Node.js is installed):**

```bash
npm install -g pnpm
```

**Using curl:**

```bash
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

#### Verification

```bash
pnpm --version
```

Expected output:

```
9.x.x (or higher)
```

</TabItem>
</Tabs>

---

## 4. Git (Version Control)

Git is essential for version control and collaboration. While you can download the project as a ZIP file, having Git installed is recommended for proper development workflow.

### Download

- **Official Website**: [https://git-scm.com/](https://git-scm.com/)

<Tabs>
<TabItem value="windows-git" label="Windows">

#### Installation

1. Download Git for Windows from [git-scm.com](https://git-scm.com/download/win)
2. Run the installer with recommended settings
3. During installation, choose "Git from the command line and also from 3rd-party software"

#### Verification

```bash
git --version
```

#### Initial Setup

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

</TabItem>
<TabItem value="macos-git" label="macOS">

#### Installation

**Git comes pre-installed on macOS, but you can update it:**

**Using Homebrew:**

```bash
brew install git
```

**Using Xcode Command Line Tools:**

```bash
xcode-select --install
```

#### Verification

```bash
git --version
```

#### Initial Setup

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

</TabItem>
<TabItem value="linux-git" label="Linux">

#### Installation

**Ubuntu/Debian:**

```bash
sudo apt update
sudo apt install git
```

**CentOS/RHEL:**

```bash
sudo yum install git
```

**Fedora:**

```bash
sudo dnf install git
```

#### Verification

```bash
git --version
```

#### Initial Setup

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

</TabItem>
</Tabs>

---

## 5. GitHub Account

A GitHub account is **required** for this project as it uses GitHub authentication for user login and authorization.

### Setup Steps

1. **Create Account**: Visit [github.com](https://github.com) and create a free account
2. **Verify Email**: Check your email and verify your GitHub account
3. **Profile Setup**: Add a profile picture and basic information (optional but recommended)

### Authentication Setup

You'll need to set up authentication for Git operations:

<Tabs>
<TabItem value="personal-token" label="Personal Access Token (Recommended)">

#### Create Personal Access Token

1. Go to **GitHub.com** → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. Click **"Generate new token (classic)"**
3. Set expiration and select scopes:
   - `repo` (Full control of private repositories)
   - `workflow` (Update GitHub Action workflows)
4. Copy the generated token (save it securely!)

#### Configure Git

```bash
git config --global user.name "your-github-username"
git config --global user.email "your-github-email@example.com"
```

When prompted for password during git operations, use your **personal access token** instead of your GitHub password.

</TabItem>
<TabItem value="ssh-key" label="SSH Key">

#### Generate SSH Key

```bash
ssh-keygen -t ed25519 -C "your-github-email@example.com"
```

#### Add SSH Key to GitHub

1. Copy your public key:
   ```bash
   cat ~/.ssh/id_ed25519.pub
   ```
2. Go to **GitHub.com** → **Settings** → **SSH and GPG keys**
3. Click **"New SSH key"** and paste your public key

#### Test Connection

```bash
ssh -T git@github.com
```

</TabItem>
</Tabs>

---

## 6. Redis Server

Redis is an in-memory data structure store used for caching and session management in our application.

### Download

- **Official Website**: [https://redis.io/download](https://redis.io/download)

<Tabs>
<TabItem value="windows-redis" label="Windows">

#### Installation

**Option 1: Using Chocolatey**

```bash
choco install redis-64
```

**Option 2: Using Windows Subsystem for Linux (WSL)**

1. Install WSL2
2. Follow Linux installation instructions in WSL

**Option 3: Docker**

```bash
docker run --name redis -p 6379:6379 -d redis:latest
```

#### Start Redis Server

```bash
redis-server
```

#### Verification

Open a new terminal and run:

```bash
redis-cli ping
```

Expected output:

```
PONG
```

</TabItem>
<TabItem value="macos-redis" label="macOS">

#### Installation

**Using Homebrew (Recommended):**

```bash
brew install redis
```

#### Start Redis Server

```bash
brew services start redis
```

#### Verification

```bash
redis-cli ping
```

Expected output:

```
PONG
```

#### Stop Redis Server

```bash
brew services stop redis
```

</TabItem>
<TabItem value="linux-redis" label="Linux">

#### Installation

**Ubuntu/Debian:**

```bash
sudo apt update
sudo apt install redis-server
```

**CentOS/RHEL:**

```bash
sudo yum install redis
```

**Fedora:**

```bash
sudo dnf install redis
```

#### Start Redis Server

```bash
sudo systemctl start redis
sudo systemctl enable redis
```

#### Verification

```bash
redis-cli ping
```

Expected output:

```
PONG
```

</TabItem>
</Tabs>

---

## 7. PostgreSQL

PostgreSQL is our primary database system for storing application data.

### Download

- **Official Website**: [https://www.postgresql.org/download/](https://www.postgresql.org/download/)

<Tabs>
<TabItem value="windows-postgres" label="Windows">

#### Installation

1. Download the Windows installer from [postgresql.org](https://www.postgresql.org/download/windows/)
2. Run the installer and follow the setup wizard
3. Remember the password you set for the `postgres` user or set the password to `postgres` for simplicity during development
4. Default port: 5432

#### Verification

```bash
psql --version
```

#### Connect to Database

```bash
psql -U postgres -h localhost
```

</TabItem>
<TabItem value="macos-postgres" label="macOS">

#### Installation

**Using Homebrew (Recommended):**

```bash
brew install postgresql
```

#### Start PostgreSQL

```bash
brew services start postgresql
```

#### Create Database User

```bash
createuser -s postgres
```

#### Verification

```bash
psql --version
```

#### Connect to Database

```bash
psql postgres
```

</TabItem>
<TabItem value="linux-postgres" label="Linux">

#### Installation

**Ubuntu/Debian:**

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

**CentOS/RHEL:**

```bash
sudo yum install postgresql-server postgresql-contrib
sudo postgresql-setup initdb
```

**Fedora:**

```bash
sudo dnf install postgresql-server postgresql-contrib
sudo postgresql-setup --initdb
```

#### Start PostgreSQL

```bash
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### Setup Database User

```bash
sudo -u postgres psql
```

In the PostgreSQL prompt:

```sql
ALTER USER postgres PASSWORD 'your_password';
\q
```

#### Verification

```bash
psql --version
```

</TabItem>
</Tabs>

---

## 8. Lemon Squeezy Account (Payment Gateway)

Lemon Squeezy is the payment gateway used in this project for handling payments and subscriptions. A **test account** is sufficient for development purposes.

> **Why Lemon Squeezy?**
>
> - Simple integration for SaaS products
> - Built-in subscription management
> - Global payment processing
> - Developer-friendly API

### Setup Steps

1. **Create Account**: Visit [lemonsqueezy.com](https://lemonsqueezy.com) and create a free account
2. **Verify Account**: Complete email verification and basic profile setup
3. **Access Test Mode**: Lemon Squeezy provides test mode by default for development

### Get API Credentials

<Tabs>
<TabItem value="test-mode" label="Test Mode (Development)">

#### Access Test Credentials

1. Log into your Lemon Squeezy dashboard
2. Go to **Settings** → **API**
3. Create a new API key for testing
4. Copy the **Test API Key**

#### Environment Variables

You'll need these for your `.env` file:

```bash
LEMONSQUEEZY_API_KEY=your_test_api_key_here
LEMONSQUEEZY_STORE_ID=your_test_store_id_here
LEMONSQUEEZY_WEBHOOK_SECRET=your_webhook_secret_here
```

#### Create Test Products

1. In your dashboard, go to **Products**
2. Create test products/subscriptions for development
3. Note the product IDs for your application

</TabItem>
<TabItem value="production" label="Production (Later)">

#### Production Setup

When ready for production:

1. Complete business verification in Lemon Squeezy
2. Add real products and pricing
3. Switch to production API keys
4. Configure webhooks for your production domain

#### Important

- Keep test and production credentials separate
- Never use production keys in development
- Test all payment flows thoroughly before going live

</TabItem>
</Tabs>

---

## 9. Database Client (DBeaver)

DBeaver is a universal database tool that provides a GUI for managing PostgreSQL databases.

### Download

- **Official Website**: [https://dbeaver.io/download/](https://dbeaver.io/download/)

<Tabs>
<TabItem value="windows-dbeaver" label="Windows">

#### Installation

1. Download the Windows installer from [dbeaver.io](https://dbeaver.io/download/)
2. Run the installer and follow the setup wizard
3. Launch DBeaver

#### Setup Connection

1. Click "New Database Connection"
2. Select "PostgreSQL"
3. Enter connection details:
   - Host: `localhost`
   - Port: `5432`
   - Database: `postgres`
   - Username: `postgres`
   - Password: (your password)

</TabItem>
<TabItem value="macos-dbeaver" label="macOS">

#### Installation

**Option 1: Download from website**

1. Download the macOS installer from [dbeaver.io](https://dbeaver.io/download/)
2. Drag DBeaver to Applications folder

**Option 2: Using Homebrew**

```bash
brew install --cask dbeaver-community
```

#### Setup Connection

1. Click "New Database Connection"
2. Select "PostgreSQL"
3. Enter connection details:
   - Host: `localhost`
   - Port: `5432`
   - Database: `postgres`
   - Username: `postgres`
   - Password: (your password)

</TabItem>
<TabItem value="linux-dbeaver" label="Linux">

#### Installation

**Ubuntu/Debian:**

```bash
wget -O - https://dbeaver.io/debs/dbeaver.gpg.key | sudo apt-key add -
echo "deb https://dbeaver.io/debs/dbeaver-ce /" | sudo tee /etc/apt/sources.list.d/dbeaver.list
sudo apt update
sudo apt install dbeaver-ce
```

**Using Snap:**

```bash
sudo snap install dbeaver-ce
```

#### Setup Connection

1. Click "New Database Connection"
2. Select "PostgreSQL"
3. Enter connection details:
   - Host: `localhost`
   - Port: `5432`
   - Database: `postgres`
   - Username: `postgres`
   - Password: (your password)

</TabItem>
</Tabs>

---

## 10. VS Code (Recommended IDE)

Visual Studio Code is our recommended IDE for development with excellent support for TypeScript, Node.js, and React.

### Download

- **Official Website**: [https://code.visualstudio.com/](https://code.visualstudio.com/)

<Tabs>
<TabItem value="windows-vscode" label="Windows">

#### Installation

1. Download the Windows installer from [code.visualstudio.com](https://code.visualstudio.com/)
2. Run the installer and follow the setup wizard
3. Check "Add to PATH" during installation

#### Verification

```bash
code --version
```

#### Recommended Extensions

Install these extensions for optimal development experience:

- **TypeScript and JavaScript Language Features** (built-in)
- **ES7+ React/Redux/React-Native snippets**
- **Prettier - Code formatter**
- **ESLint**
- **PostgreSQL** (by Chris Kolkman)
- **Redis** (by Josh Peng)

</TabItem>
<TabItem value="macos-vscode" label="macOS">

#### Installation

**Option 1: Download from website**

1. Download the macOS installer from [code.visualstudio.com](https://code.visualstudio.com/)
2. Drag VS Code to Applications folder

**Option 2: Using Homebrew**

```bash
brew install --cask visual-studio-code
```

#### Add to PATH

1. Open VS Code
2. Press `Cmd+Shift+P`
3. Type "Shell Command: Install 'code' command in PATH"

#### Verification

```bash
code --version
```

#### Recommended Extensions

Install these extensions for optimal development experience:

- **TypeScript and JavaScript Language Features** (built-in)
- **ES7+ React/Redux/React-Native snippets**
- **Prettier - Code formatter**
- **ESLint**
- **PostgreSQL** (by Chris Kolkman)
- **Redis** (by Josh Peng)

</TabItem>
<TabItem value="linux-vscode" label="Linux">

#### Installation

**Ubuntu/Debian:**

```bash
wget -qO- https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > packages.microsoft.gpg
sudo install -o root -g root -m 644 packages.microsoft.gpg /etc/apt/trusted.gpg.d/
sudo sh -c 'echo "deb [arch=amd64,arm64,armhf signed-by=/etc/apt/trusted.gpg.d/packages.microsoft.gpg] https://packages.microsoft.com/repos/code stable main" > /etc/apt/sources.list.d/vscode.list'
sudo apt update
sudo apt install code
```

**Using Snap:**

```bash
sudo snap install code --classic
```

#### Verification

```bash
code --version
```

#### Recommended Extensions

Install these extensions for optimal development experience:

- **TypeScript and JavaScript Language Features** (built-in)
- **ES7+ React/Redux/React-Native snippets**
- **Prettier - Code formatter**
- **ESLint**
- **PostgreSQL** (by Chris Kolkman)
- **Redis** (by Josh Peng)

</TabItem>
</Tabs>

---

## Optional: Cloud Services for Experimentation

The following cloud services are **optional** but useful for experimenting with cloud databases and services instead of running everything locally.

### NeonDB (Cloud PostgreSQL)

NeonDB provides a cloud-based PostgreSQL database that's perfect for development and experimentation.

#### Setup Steps

1. **Create Account**: Visit [neon.tech](https://neon.tech) and create a free account
2. **Create Database**: Create a new project/database
3. **Get Connection String**: Copy the connection string from your dashboard
4. **Update Environment**: Use the connection string in your `.env` file

#### Benefits

- No local PostgreSQL installation needed
- Automatic backups and scaling
- Free tier available for development
- Easy branching for different environments

### Redis Cloud

Redis Cloud provides managed Redis instances in the cloud.

#### Setup Steps

1. **Create Account**: Visit [redis.com/cloud](https://redis.com/try-free/) and create a free account
2. **Create Database**: Set up a new Redis database
3. **Get Connection Details**: Copy the connection details (host, port, password)
4. **Update Environment**: Use the connection details in your `.env` file

#### Benefits

- No local Redis installation needed
- High availability and persistence
- Free tier available for development
- Global deployment options

---

## Final Verification

After installing all prerequisites, verify your setup by running these commands:

```bash
# Check Node.js and npm
node --version
npm --version

# Check NVM
nvm --version

# Check pnpm
pnpm --version

# Check Git
git --version

# Check if Redis is running (if using local Redis)
redis-cli ping

# Check PostgreSQL (if using local PostgreSQL)
psql --version

# Check VS Code
code --version
```

### Account Verifications

Make sure you have accounts set up for:

- ✅ **GitHub Account**: Can log into github.com
- ✅ **Lemon Squeezy Account**: Can access dashboard and API keys
- ✅ **NeonDB Account** (optional): Cloud database ready
- ✅ **Redis Cloud Account** (optional): Cloud Redis instance ready
