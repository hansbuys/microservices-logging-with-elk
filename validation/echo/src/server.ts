import 'reflect-metadata';
import { InversifyExpressServer } from 'inversify-express-utils';
import { json } from 'body-parser';
import { Container } from 'inversify';
import { Application } from 'express';
import { Server } from 'http';
import * as Logger from "bunyan"
import { LogFactory } from "./logging"

import "./echo"

export class EchoServer {

    readonly port: number;
    readonly log: Logger;
    readonly container: Container

    serverInstance: Application
    listener: Server | undefined;

    constructor(port: number, log: LogFactory) {
        this.port = port
        this.log = log.createLog("EchoServer")

        this.container = new Container

        let server = new InversifyExpressServer(this.container);

        server.setConfig((app: Application) => {
            app.use(json());
        });

        this.serverInstance = server.build();
    }

    start(): void {
        this.listener = this.serverInstance.listen(this.port, () => {
            this.log.info(`Server started on http://localhost:${this.port}`);
        });
    }

    stop(): any {
        if (this.listener !== undefined) {
            this.log.info("Server stopped.");
            this.listener.close();
        }
    }
}
