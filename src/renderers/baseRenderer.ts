import { inject } from "appolo";
import IEnv from "../../config/env/IEnv";
import { ILogger } from "@appolo/logger";
import { ILangaugeOptions } from "../managers/langaugeManager";
import { IDictionary } from "../common/interfaces";

export interface IRenderer {
    options: ILangaugeOptions;
    totalBytes: number;
    languagesBytes: IDictionary<number>;
    render(): Promise<Buffer>;
}

export abstract class BaseRenderer implements IRenderer {

    @inject() protected logger: ILogger;
    @inject() protected env: IEnv;

    protected constructor(public options: ILangaugeOptions, public totalBytes: number, public languagesBytes: IDictionary<number>) {

    }

    public async abstract render(): Promise<Buffer>;
}