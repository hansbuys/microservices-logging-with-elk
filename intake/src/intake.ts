import { Request } from "express";
import { controller, httpGet } from "inversify-express-utils";

@controller("/")
export class IntakeController {

    @httpGet("/")
    public async index(req: Request): Promise<void> {
        req.log.debug("Requesting an intake.");
    }
}
