import { singleton, define, inject, injectAliasFactory, cache } from "appolo";
import { ILogger } from "@appolo/logger";
import { GaugeTypes, OutputFormat } from "../common/enums";
import { GithubService } from "../services/githubService";
import * as _ from "lodash";
import { IRenderer } from "../renderers/baseRenderer";
import { IDictionary } from "../common/interfaces";

const TEN_MINUTES_IN_MILLISECONDS = 1000 * 60 * 10;

export interface ILangaugeOptions {
    type: GaugeTypes;
    output: OutputFormat;
    threshold: number;
    colors: boolean;
}

@define()
@singleton()
export class LangaugeManager {

    @inject() private logger: ILogger;
    @inject() private githubService: GithubService;
    @injectAliasFactory("IRenderer", "TYPE") private rendererCreators: { [index: string]: (options: ILangaugeOptions, totalBytes: number, languagesBytes: IDictionary<number>) => IRenderer };

    @cache({ maxAge: TEN_MINUTES_IN_MILLISECONDS, resolver: (owner: string, repo: string, options: ILangaugeOptions) => `${owner}/${repo}/${JSON.stringify(options)}` })
    public async generate(owner: string, repo: string, options: ILangaugeOptions): Promise<Buffer> {
        try {

            const createRenderer = this.rendererCreators[options.type]
                , languages = await this.githubService.getRepositoryLanguages(owner, repo)
                , totalBytes = _(languages).values().sum()
                , renderer = createRenderer(options, totalBytes, languages);

            const bitmapBuffer = await renderer.render();

            return bitmapBuffer;

        } catch (err) {

            this.logger.error(`failed to render langauge for type ${options.type}`, err);

            return Buffer.from("");

        }
    }
}