import "reflect-metadata";
import { LogFactory } from "./logfactory";
import { IntakeServer as IntakeServer } from "./server";

const port: number = Number(process.env.PORT || 3000);
const logFactory: LogFactory = new LogFactory();

new IntakeServer(port, logFactory).start();
