import "reflect-metadata";
import { LogFactory } from "./logfactory";
import { EchoServer } from "./server";

const port: number = Number(process.env.PORT || 3000);
const logFactory: LogFactory = new LogFactory(false);

new EchoServer(port, logFactory).start();
