import * as Logger from "bunyan";
import { inject } from "inversify";
import { controller, httpGet } from "inversify-express-utils";
import { LogFactory } from "./logfactory";

@controller("/")
export class EchoController {

    private readonly log: Logger;

    constructor(@inject(LogFactory) log: LogFactory) {
        this.log = log.createLog(EchoController);
     }

    @httpGet("/")
    public async index(): Promise<string> {
        this.log.debug("Saying 'hello'.");
        return "hello";
    }
}
