import { App } from "appolo";
import IEnv from "../env/IEnv";
import { LoggerModule } from "@appolo/logger";
import { HttpModule } from "@appolo/http";
import { CacheModule } from "@appolo/cache";

module.exports = async function (env: IEnv, app: App) {

    await app.module(LoggerModule);

    await app.module(HttpModule);

    await app.module(new CacheModule({
        connection: env.redis,
        db: true
    }));

}