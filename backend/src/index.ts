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
