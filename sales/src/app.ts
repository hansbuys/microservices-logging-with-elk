import axios from "axios";
import { LogFactory } from "./logfactory";
import * as Logger from "bunyan";

export class Application {

    private custId = 100;
    private readonly log: Logger;

    constructor(logFactory: LogFactory, private intakeHost: string) {
        this.log = logFactory.createLog(Application);
    }

    public start(): void {
        setInterval(async () => {
            const log = this.log.child({ custId: this.custId });
            log.info(`New sale for Customer with Id: ${this.custId}.`);
        
            try {
                const url = `http://${this.intakeHost}/intake/${this.custId}`;
                log.debug(`GET ${url}.`);
                await axios.get(url);
            } catch(e) {
                log.error("Unable to request an intake.", e);
            }

            this.custId += 1;
        }, 5000);
    }
}