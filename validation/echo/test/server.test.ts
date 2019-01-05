import { expect } from "chai";
import { IncomingMessage } from "http";
import { Done } from "mocha";
import { suite, test} from "mocha-typescript";
import "mocha-typescript";
import "reflect-metadata";
import * as request from "request-promise-native";
import { StatusCodeError } from "request-promise-native/errors";
import { LogFactory } from "../src/logfactory";
import { EchoServer } from "../src/server";

@suite
export class EchoServerTests {

    private readonly port = Math.floor(Math.random() * (65535 - 49152 + 1) + 49152);
    private readonly url = `http://localhost:${this.port}`;

    private readonly logFactory = new LogFactory(false);
    private readonly server: EchoServer = new EchoServer(this.port, this.logFactory);

    public before(): void {
        this.server.start();
    }

    public after(): void {
        this.server.stop();
    }

    @test("Says hello.")
    public async saysHello(): Promise<void> {
        const result = await request.get(this.url);
        expect(result).to.equal("hello");
    }

    @test("Has a request Id header that is a GUID.")
    public async hasRequestIdGuid(): Promise<void> {
        const result: IncomingMessage = await request.get(this.url, {
            resolveWithFullResponse: true,
        });

        expect(result.headers["x-request-id"]).to.match(/^[0-9A-Fa-f]{8}(?:-[0-9A-Fa-f]{4}){3}-[0-9A-Fa-f]{12}$/);
    }

    @test("Has a unique request Id header per request.")
    public async shouldHaveUniqueRequestId(): Promise<void> {
        const result1: IncomingMessage = await request.get(this.url, {
            resolveWithFullResponse: true,
        });
        const result2: IncomingMessage = await request.get(this.url, {
            resolveWithFullResponse: true,
        });

        const header1 = result1.headers["x-request-id"];
        const header2 = result2.headers["x-request-id"];

        expect(header1).to.not.eql(header2);
    }

    @test("Supports 404.")
    public supports404(done: Done): void {
        request.get(this.url + "/not-existing").then(() => {
            done("failed");
        }).catch((err: StatusCodeError) => {
            expect(err.statusCode).to.eql(404);
            done();
        });
    }
}
