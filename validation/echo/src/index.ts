import { EchoServer } from "./server";
import { LogFactory } from "./logging";

const port: number = Number(process.env.PORT || 3000);
const log: LogFactory = new LogFactory(false);
new EchoServer(port, log).start();