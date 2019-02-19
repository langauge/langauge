import { inject } from "appolo";
import IEnv from "../../config/env/IEnv";
import { ILogger } from "@appolo/logger";
import { ILangaugeOptions } from "../managers/langaugeManager";
import { IDictionary } from "../common/interfaces";
import { OutputFormat } from "../common/enums";
import * as _ from "lodash";
import * as languages from "../../data/languages";
import * as sharp from "sharp";

export interface IRenderer {
    render(): Promise<Buffer>;
}

export interface IRendererLanguage {
    language: string;
    bytes: number;
    percent: number;
    color: string;
}

const NO_COLOR = "";

export abstract class BaseRenderer implements IRenderer {

    @inject() protected logger: ILogger;
    @inject() protected env: IEnv;

    protected languages: IRendererLanguage[];

    protected constructor(protected options: ILangaugeOptions, protected totalBytes: number, languagesBytes: IDictionary<number>) {

        this.languages = this.createLanguages(languagesBytes);

    }

    public async render(): Promise<Buffer> {

        const renderer = await this._render();

        switch (this.options.output) {
            case OutputFormat.JPEG:
                renderer.jpeg(); break;
            case OutputFormat.PNG:
                renderer.png(); break;
            case OutputFormat.TIFF:
                renderer.tiff(); break;
            case OutputFormat.WEBP:
                renderer.webp(); break;
        }

        return renderer.toBuffer();
    }

    protected getLanguageColor(language: string) {
        return this.options.colors
            ? _.get(languages, `${language}.color`, NO_COLOR)
            : NO_COLOR;
    }

    protected async abstract _render(): Promise<sharp.Sharp>;

    private createLanguages(languagesBytes: IDictionary<number>): IRendererLanguage[] {

        return _.reduce(languagesBytes, (result: IRendererLanguage[], bytes: number, language: string) => {

            const percent = bytes / this.totalBytes * 100

            result.push({
                language,
                bytes,
                percent: parseFloat(percent.toFixed(1)),
                color: this.getLanguageColor(language)
            });

            return result;
        }, []);
    }
}