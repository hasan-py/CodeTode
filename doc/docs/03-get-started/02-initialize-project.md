---
sidebar_position: 2
title: Project Initialization
---

:::info
Before running any command, use `nvm use` when you open a new terminal. This ensures you're using the correct Node.js version specified in the `.nvmrc` file. The project uses Node.js version `v24.5.0` (see `.nvmrc`).
:::

## Backend Project Initialization

### Step 1: Create the Backend Folder

1. Create a `backend` folder.
2. Run the following command to initialize the `package.json` file:

   ```bash
   npm init -y
   ```

### Step 2: Add Essential Files

1. Add a `.gitignore` file (see example in the previous step or copy from the root).
2. Create a `.env` file with the following content (see commit for reference):

   ```env
   # Server
   NODE_ENV=development
   SERVER_PORT=8000
   ```

3. Create a `tsconfig.json` file with the following configuration or we can use tsc --init command by installing typescript globally:

   ```json
   {
     "compilerOptions": {
       "module": "commonjs",
       "esModuleInterop": true,
       "target": "es6",
       "noImplicitAny": true,
       "moduleResolution": "node",
       "sourceMap": true,
       "outDir": "./dist",
       "experimentalDecorators": true,
       "emitDecoratorMetadata": true,
       "resolveJsonModule": true
     },
     "include": ["src/**/*", "src/models/.ts"],
     "exclude": ["node_modules"]
   }
   ```

### Step 3: Set Up the Project Structure

1. Create a `src/index.ts` file.
2. Install the necessary dependencies (see commit for exact versions):

   ```bash
   pnpm install express
   pnpm install --save-dev typescript @types/express dotenv tsc-watch
   ```

### Step 4: Create a Basic Server

Add the following code to `src/index.ts`:

```typescript
import express from "express";

class Server {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.config();
    this.routes();
  }

  public config(): void {
    if (!process.env.SERVER_PORT)
      throw new Error("Environment variable `SERVER_PORT` not found");

    this.app.set("port", process.env.SERVER_PORT);
  }

  public routes(): void {
    this.app.get("/", (req, res) => {
      res.send("Hello World!");
    });
  }

  public start(): void {
    this.app.listen(this.app.get("port"), () => {
      console.log(`API is running at http://localhost:${this.app.get("port")}`);
    });
  }
}

export const server = new Server();
server.start();
```

### Step 5: Add Scripts to `package.json`

1. Add build and start scripts to your `package.json`:

   ```json
   {
     "scripts": {
       "build": "tsc",
       "start": "node dist/index.js"
     }
   }
   ```

2. We are not going to use nodemon. As we are playing with TypeScript, install `tsc-watch` as a dev dependency for live reloading feature (already included above):

   ```bash
   pnpm install --save-dev tsc-watch
   ```

3. Add a live reload script:

   ```json
   {
     "scripts": {
       "build": "tsc",
       "start": "node dist/index.js",
       // highlight-next-line
       "dev": "tsc-watch --onSuccess \"node dist/index.js\""
     }
   }
   ```

### Step 6: Configure Environment Variable Access

1. `dotenv` is already installed above. Update the scripts in `package.json` to include `dotenv`:

   ```json
   {
     "scripts": {
       "build": "tsc",
       // highlight-start
       "start": "node dotenv/config dist/index.js",
       "dev": "tsc-watch --onSuccess \"node dotenv/config dist/index.js\""
       // highlight-end
     }
   }
   ```

:::info
Adding this `dotenv/config` will load environment variables from the `.env` file.
:::

3. You will get build error from above script. So for suppress warnings by updating the scripts:

   ```json
   {
     "scripts": {
       "build": "tsc",
       // highlight-start
       "start": "node --no-warnings -r dotenv/config dist/index.js",
       "dev": "tsc-watch --onSuccess \"node --no-warnings -r dotenv/config dist/index.js\""
       // highlight-end
     }
   }
   ```

:::info
Adding this `--no-warnings -r` will suppress the error or warning
:::

### Step 7: Test the Server

Run the following command to start the server in development mode:

```bash
pnpm run dev
```

You should see the message `API is running at http://localhost:8000` in the console. Make changes to the code and observe live reload in action.

:::warning
If you encounter issues with environment variables, always use the provided scripts (`pnpm start` or `pnpm dev`) instead of running `node dist/index.js` directly.
:::

## Frontend Project Initialization

### Step 1: Scaffold the Frontend Project

1. Open a new terminal in the root directory and ensure you're using the correct Node.js version:

   ```bash
   nvm use
   ```

2. Run the following command to scaffold the frontend project:

   ```bash
   npx create-tsrouter-app@latest frontend --template file-router
   ```

   This sets up the frontend project with all necessary files and configurations. Ensure you have Node.js version `v24.5.0` installed.

### Step 2: Test the Frontend Project

1. Start the development server:

   ```bash
   pnpm run dev
   ```

2. Build the project to ensure everything is working:

   ```bash
   pnpm run build
   ```

### Step 3: Resolve Frontend Errors

If you encounter errors like the following:

```typescript
vite.config.ts:4:25 - error TS2307: Cannot find module 'node:path' or its corresponding type declarations.

4 import { resolve } from 'node:path'
                        ~~~~~~~~~~~

vite.config.ts:9:3 - error TS2769: No overload matches this call.
The last overload gave the following error.
    Object literal may only specify known properties, and 'test' does not exist in type 'UserConfigExport'.

9   test: {
    ~~~~

node_modules/vite/dist/node/index.d.ts:3642:18
    3642 declare function defineConfig(config: UserConfigExport): UserConfigExport;
                        ~~~~~~~~~~~~
    The last overload is declared here.

vite.config.ts:15:20 - error TS2304: Cannot find name '__dirname'.

15       '@': resolve(__dirname, './src'),
                    ~~~~~~~~~

Found 3 errors in the same file, starting at: vite.config.ts:4
```

These errors are related to the `test` property in the `vite.config.ts` file. To fix them:

1. Update the `vite.config.ts` file to match the latest Vite configuration standards.
2. Alternatively, comment out the `test` object if it is not required.

### Step 4: Reinstall Dependencies

If you encounter errors like `node:path not found`, ensure you have Node.js version `v24.5.0` installed (see `.nvmrc`). Then, follow these steps:

1. Delete the `node_modules` folder from the `frontend` directory:

   ```bash
   rm -rf node_modules
   ```

2. Reinstall the dependencies using the correct Node.js version:

   ```bash
   nvm use
   pnpm install
   ```

This ensures that the dependencies are installed with the correct Node.js version.

### Final Steps: Build and Clean Up

1. **Build the Project**  
   Run the following command to build the project and verify it successful:

   ```bash
   pnpm run build
   ```

2. **Remove the Hidden `.git` Folder in the Frontend Directory**  
    When scaffolding the frontend project, a hidden `.git` folder is automatically created inside the `frontend` directory. This can cause issues if you try to commit changes from the root directory, as Git may treat the `frontend` directory as a separate repository.

   To avoid this, delete the `.git` folder inside the `frontend` directory before committing your changes:

   ```bash
   rm -rf .git
   ```

# Only remove if you see a .git folder inside frontend (not the root folder)



**Note:** Always ensure the `.git` folder is removed from the `frontend` directory before committing to the root repository.

With these steps completed, your project should be ready for further development and deployment!
