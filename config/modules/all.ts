import { App } from "appolo";
import IEnv from "../env/IEnv";
import { LoggerModule } from "@appolo/logger";
import { HttpModule } from "@appolo/http";

module.exports = async function (env: IEnv, app: App) {

    await app.module(LoggerModule);

    await app.module(new HttpModule());

}