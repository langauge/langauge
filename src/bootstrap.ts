import { bootstrap, define, IBootstrap, inject, singleton } from "appolo";
import IEnv from "../config/env/IEnv";
import { ILogger } from "@appolo/logger";
import { GithubService } from "./services/githubService";

@define()
@singleton()
@bootstrap()
export class Bootstrap implements IBootstrap {

    @inject() env: IEnv;
    @inject() logger: ILogger;
    @inject() githubService: GithubService;

    public async run() {
        try {

            const bytes = await this.githubService.getRepositoryBytes("quickey", "quickey");

            this.logger.info("langauge is runing!");

        } catch (e) {

            this.logger.error("bootstrap error", { e });

            process.exit(1);

        }
    }
}