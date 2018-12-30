import { controller, httpGet } from "inversify-express-utils";

@controller("/")
export class EchoController {
    @httpGet("/")
    public async index(): Promise<String> {
        return "hello"
    }
}