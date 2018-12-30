import { LogFactory } from "./logfactory";
import { EchoServer } from "./server";

const port: number = Number(process.env.PORT || 3000);
const log: LogFactory = new LogFactory(false);

new EchoServer(port, log).start();
