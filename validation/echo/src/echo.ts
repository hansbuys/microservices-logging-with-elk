import { controller, httpGet } from "inversify-express-utils";
import { inject } from "inversify";
import { LogFactory } from "./logfactory";
import * as Logger from "bunyan";

@controller("/")
export class EchoController {

    private readonly log: Logger;

    constructor(@inject(LogFactory) log: LogFactory) {
        this.log = log.createLog(EchoController);
     }

    @httpGet("/")
    public async index(): Promise<String> {
        this.log.debug("Saying 'hello'.");
        return "hello"
    }
}