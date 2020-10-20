import { bootstrap, IBootstrap, inject, Injex } from "@injex/core";
import { Application } from "express";
import { IEnvironment } from "./common/interfaces";

@bootstrap()
export class Bootstrap implements IBootstrap {

    @inject() private $injex: Injex<any>;
    @inject() private env: IEnvironment;
    @inject() private app: Application;

    public run(): void | Promise<void> {
        this.app.listen(this.env.port, this._onListen.bind(this));
    }

    private _onListen() {
        this.$injex.logger.info(`Langauge.IO server running on port ${this.env.port}...`);
    }

    public didCatch(e: Error): void {
        this.$injex.logger.error("failed to run langauge", e);
        process.exit(1);
    }
}