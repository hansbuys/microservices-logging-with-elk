import axios from "axios";
import { Request } from "express";
import { controller, httpGet, request, requestParam} from "inversify-express-utils";

const hostname = process.env.DELIVERY_HOST as string || "localhost";
const port: number = Number(process.env.DELIVERY_PORT || 3000);
const deliveryHost = `${hostname}:${port}`;

@controller("/intake")
export class IntakeController {

    @httpGet("/:id")
    public async index(@request() req: Request, @requestParam("id") custId: string): Promise<void> {
        const numDeliveries = Math.round((Math.random() * 10) + 1);
        const log = req.log.child({ custId });

        log.child({ numDeliveries }).info(`Requested an intake for Customer with Id: ${custId}. ${numDeliveries} items to deliver.`);

        try {
            const url = `http://${deliveryHost}/deliver/${custId}/${numDeliveries}`;
            log.debug(`GET ${url}.`);
            await axios.get(url);
        } catch (error) {
            log.error("Unable to request delivery.", error);
        }
    }
}
