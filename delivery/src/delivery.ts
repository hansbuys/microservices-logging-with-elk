import { Request } from "express";
import { controller, httpGet } from "inversify-express-utils";

@controller("/")
export class DeliveryController {

    @httpGet("/")
    public async index(req: Request): Promise<void> {
        req.log.debug("Requesting a delivery...");
    }
}
