import { expect } from "chai";
import { IncomingMessage } from "http";
import {} from "mocha";
import "reflect-metadata";
import * as request from "request-promise-native";
import { StatusCodeError } from "request-promise-native/errors";
import { LogFactory } from "../src/logfactory";
import { EchoServer } from "../src/server";

const port = Math.floor(Math.random() * (65535 - 49152 + 1) + 49152);
const url = `http://localhost:${port}`;

describe("echo-validation", () => {

    let server: EchoServer;

    beforeEach(() => {
        const log = new LogFactory(false);
        server = new EchoServer(port, log);
        server.start();
    });

    afterEach(() => {
        server.stop();
    });

    it("should say hello", async () => {
        const result = await request.get(url);

        expect(result).to.equal("hello");
    });

    it("should have request-id as a guid", async () => {
        const result: IncomingMessage = await request.get(url, {
            resolveWithFullResponse: true,
        });

        expect(result.headers["x-request-id"]).to.match(/^[0-9A-Fa-f]{8}(?:-[0-9A-Fa-f]{4}){3}-[0-9A-Fa-f]{12}$/);
    });

    it("should have unique request-id", async () => {
        const result1: IncomingMessage = await request.get(url, {
            resolveWithFullResponse: true,
        });
        const result2: IncomingMessage = await request.get(url, {
            resolveWithFullResponse: true,
        });

        const header1 = result1.headers["x-request-id"];
        const header2 = result2.headers["x-request-id"];

        expect(header1).to.not.eql(header2);
    });

    it("should support returning 404", (done) => {
        request.get(url + "/not-existing").then(() => {
            done("failed");
        }).catch((err: StatusCodeError) => {
            expect(err.statusCode).to.eql(404);
            done();
        });
    });
});
