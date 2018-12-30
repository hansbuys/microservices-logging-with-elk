import {expect} from "chai";
import {} from "mocha";
import "reflect-metadata";
import * as request from "request-promise-native";
import { LogFactory } from "../src/logfactory";
import { EchoServer } from "../src/server";

const port = 3000;
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
});
