import { LogLevel, createLogger, stdSerializers, Stream } from "bunyan";
import * as Logger from "bunyan"

export class LogFactory {

    private logLevel = process.env.LOG_LEVEL as LogLevel || "debug";
    private namespace: string = "Validation.Echo";
    private outputToFile: string | false;
    private outputToConsole: boolean = true;

    constructor(toFile?: string | false, toConsole: boolean = true) {
        this.outputToFile = toFile === undefined ? `/var/log/service.landscape/${this.namespace.toLowerCase()}.json` : toFile;

        this.outputToConsole = toConsole;
    }

    public createLog(name: String): Logger {
        let loggerName = `${this.namespace}.${name}`;

        const logger = createLogger({
            name: loggerName,
            serializers: {
                err: stdSerializers.err,
                req: stdSerializers.req
            },
            streams: this.getStreams()
        });

        logger.info(`Logger '${loggerName}' created with level: ${this.logLevel}!`);

        return logger;
    }

    private getStreams(): Stream[] {
        const streams: Stream[] = []

        if (this.outputToConsole) {
            streams.push({
                level: this.logLevel,
                stream: process.stdout
            });
        }

        if (this.outputToFile) {
            streams.push({
                type: "rotating-file",
                level: this.logLevel,
                path: this.outputToFile,
                period: "1d",
                count: 5
            });
        }

        return streams;
    }
}