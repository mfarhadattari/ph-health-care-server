import { Server } from "http";
import app from "./app";
import config from "./app/config";
import seedAdmin from "./app/utils/seedAdmin";

const port = config.port;

let server: Server;

(async () => {
  server = app.listen(port, async () => {
    console.log("Server listening on port " + port);
    await seedAdmin();
  });
})();
