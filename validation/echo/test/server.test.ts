import {expect} from "chai";
import { IncomingMessage } from "http";
import {} from "mocha";
import "reflect-metadata";
import * as request from "request-promise-native";
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

    it("should be available", async () => {
        const result = await request.get(url);

        expect(result).to.equal("hello");
    });

    it("should have request-id", async () => {
        const result: IncomingMessage = await request.get(url, {
            resolveWithFullResponse: true,
        });

        expect(result.rawHeaders).to.include("X-Request-Id");
    });
});
