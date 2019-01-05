import { Request } from "express";
import { controller, httpGet } from "inversify-express-utils";

@controller("/")
export class EchoValidationController {

    @httpGet("/")
    public async index(req: Request): Promise<string> {
        req.log.debug("Saying 'hello'.");
        return "hello";
    }
}
