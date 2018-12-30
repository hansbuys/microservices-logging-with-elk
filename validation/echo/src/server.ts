import 'reflect-metadata';
import { InversifyExpressServer } from 'inversify-express-utils';
import { json } from 'body-parser';
import { Container } from 'inversify';
import { Application } from 'express';
import { Server } from 'http';
import * as Logger from "bunyan";
import { LogFactory } from "./logfactory";

import "./echo";

export class EchoServer {

    private readonly port: number;
    private readonly log: Logger;
    private readonly container: Container;
    private readonly serverInstance: Application;

    private listener?: Server;

    public constructor(port: number, log: LogFactory) {
        this.port = port;
        this.log = log.createLog(EchoServer);

        this.container = new Container();
        this.container.bind(LogFactory).toConstantValue(log);

        let server = new InversifyExpressServer(this.container);

        server.setConfig((app: Application) => {
            app.use(json());
        });

        this.serverInstance = server.build();
    }

    public start(): void {
        this.listener = this.serverInstance.listen(this.port, () => {
            this.log.info(`Server started on http://localhost:${this.port}`);
        });
    }

    public stop(): any {
        if (this.listener) {
            this.log.info("Server stopped.");
            this.listener.close();
        }
    }
}
