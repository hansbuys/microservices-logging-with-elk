import { json } from "body-parser";
import * as Logger from "bunyan";
import { Application } from "express";
import { Server } from "http";
import { Container } from "inversify";
import { InversifyExpressServer } from "inversify-express-utils";
import { v1 as uuid } from "uuid";
import { LogFactory } from "./logfactory";
import { addLogging, addRequestId } from "./middleware";

import "./intake";

export class IntakeServer {

    private readonly log: Logger;
    private readonly container: Container;
    private readonly serverInstance: Application;

    private listener?: Server;

    public constructor(private readonly port: number, logFactory: LogFactory) {
        this.log = logFactory.createLog(IntakeServer);

        this.container = new Container();
        this.container.bind(LogFactory).toConstantValue(logFactory);

        const server = new InversifyExpressServer(this.container);

        server.setConfig((app: Application) => {
            app.use(json());
            app.use(addLogging(this.log));
            app.use(addRequestId(uuid));
        });

        this.serverInstance = server.build();
    }

    public start(): void {
        this.listener = this.serverInstance.listen(this.port, () => {
            this.log.info(`Server started on http://localhost:${this.port}`);
        });
    }

    public stop(): void {
        if (this.listener) {
            this.log.info("Server stopped.");
            this.listener.close();
        }
    }
}
