import { Server } from "http";
import app from "./app";
import config from "./app/config";

const port = config.port;

let server: Server;

(async () => {
  server = app.listen(port, () => {
    console.log("Server listening on port " + port);
  });
})();
