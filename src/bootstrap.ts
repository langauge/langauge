import { bootstrap, define, IBootstrap, inject, singleton } from "appolo";
import IEnv from "../config/env/IEnv";
import { ILogger } from "@appolo/logger";

@define()
@singleton()
@bootstrap()
export class Bootstrap implements IBootstrap {

    @inject() env: IEnv;
    @inject() logger: ILogger;

    public async run() {
        try {

            this.logger.info("langauge is runing!");

        } catch (e) {

            this.logger.error("bootstrap error", { e });

            process.exit(1);

        }
    }
}