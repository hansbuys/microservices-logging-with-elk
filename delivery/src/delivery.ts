import { Request } from "express";
import { controller, httpGet, request, requestParam } from "inversify-express-utils";

@controller("/deliver")
export class DeliveryController {

    @httpGet("/:custId/:numDeliveries")
    public async index(@request() req: Request, @requestParam("custId") custId: string, @requestParam("numDeliveries") numDeliveries: number): Promise<void> {
        let log = req.log.child({ custId });

        log.child({ numDeliveries }).info(`Requesting ${numDeliveries} deliveries for Customer with Id: ${custId}.`);

        for (let i = 1; i <= numDeliveries; i++) {
            const secondDelay = (Math.random() * 15) + 1;
            log = log.child({ delivery: i });

            log.info(`Requesting delivery ${i}/${numDeliveries}.`);

            setTimeout(() => {
                if (secondDelay <= 13) {
                    log.child({ fulfilledDelivery: true }).info(`Fulfilling delivery ${i}/${numDeliveries}.`);
                } else {
                    log.child({ missedDelivery: true }).warn(`Missed window for delivery ${i}/${numDeliveries}.`);
                }
            }, secondDelay * 1000);
        }
    }
}
