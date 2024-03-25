import { Server } from "http";
import app from "./app";
import config from "./app/config";

let server: Server;

(async () => {
  server = app.listen(config.port, () => {
    console.log(`[Server] PH Health Care Server in running...`);
  });
})();
