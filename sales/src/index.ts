import { LogFactory } from "./logfactory";
import { Application } from "./app";

const hostname = process.env.INTAKE_HOST as string || "localhost";
const port: number = Number(process.env.INTAKE_PORT || 3000);

const logFactory: LogFactory = new LogFactory();
const intakeHost = `${hostname}:${port}`;
new Application(logFactory, intakeHost).start();

