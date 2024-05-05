import app from "./app";
import logger from "./logger.service";
import { createServer } from "http";

function startServer() {
  const server = createServer(app);
  const port: number =  3658;
  server.listen(port, async () => {
    logger.info(`Example App listening at http://localhost:${port}/file`);
  });
}

startServer();
