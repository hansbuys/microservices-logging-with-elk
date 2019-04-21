import * as Logger from "bunyan";
import { NextFunction, Request, RequestHandler, Response } from "express-serve-static-core";

declare global {
    namespace Express {
        interface Request {
             log: Logger;
        }
    }
}

export function addLogging(log: Logger): RequestHandler {
    log.debug("Add logger to each request.");
    return (req: Request, res: Response, next: NextFunction) => {
        req.log = log;

        next();
    };
}

export function addRequestId(createRequestId: () => string): RequestHandler {
    return (req: Request, res: Response, next: NextFunction) => {
        const requestId = createRequestId();
        req.log = req.log.child({ requestId });

        req.log.debug(`Add X-Request-Id as HTTP header.`);

        res.header("X-Request-Id", requestId);

        next();
    };
}
