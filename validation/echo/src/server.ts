import { json } from "body-parser";
import * as Logger from "bunyan";
import { Application, NextFunction, Request, RequestHandler, Response } from "express";
import { Server } from "http";
import { Container } from "inversify";
import { InversifyExpressServer } from "inversify-express-utils";
import { v1 as uuid } from "uuid";
import { LogFactory } from "./logfactory";

import "./echo";

export class EchoServer {
    private static addLogging(log: Logger): RequestHandler {
        log.debug("Add logger to each request.");
        return (req: Request, res: Response, next: NextFunction) => {
            req.log = log;

            next();
        };
    }

    private static addRequestId(req: Request, res: Response, next: NextFunction) {
        const requestId = uuid();
        req.log = req.log.child({ requestId });

        req.log.debug(`Add X-Request-Id as HTTP header.`);

        res.header("X-Request-Id", requestId);

        next();
    }

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

        const server = new InversifyExpressServer(this.container);

        server.setConfig((app: Application) => {
            app.use(json());
            app.use(EchoServer.addLogging(this.log));
            app.use(EchoServer.addRequestId);
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
