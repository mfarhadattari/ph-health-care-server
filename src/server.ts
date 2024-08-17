import { Server } from "http";
import app from "./app";
import config from "./app/config";
import seedAdmin from "./app/utils/seedAdmin";

const port = config.port;

let server: Server;

(async () => {
  server = app.listen(port, async () => {
    console.log("Server listening on port " + port);
    // seed super admin  for application
    await seedAdmin();

    const existHandler = () => {
      if (server) {
        server.close(() => {
          console.info("Server closed");
        });
      }
      process.exit(1);
    };

    process.on("uncaughtException", (err) => {
      console.log(err);
      existHandler();
    });

    process.on("unhandledRejection", (err) => {
      console.log(err);
      existHandler();
    });
  });
})();
