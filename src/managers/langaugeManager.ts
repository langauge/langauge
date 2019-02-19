import { singleton, define, inject, injectAliasFactory, cache } from "appolo";
import { ILogger } from "@appolo/logger";
import { GaugeType, OutputFormat } from "../common/enums";
import { GithubService } from "../services/githubService";
import { IRenderer } from "../renderers/baseRenderer";
import { IDictionary } from "../common/interfaces";
import { TEN_MINUTES_IN_MILLISECONDS } from "../common/constants";
import * as _ from "lodash";

export interface ILangaugeOptions {
    type: GaugeType;
    output: OutputFormat;
    threshold: number;
    colors: boolean;
    columns: number;
    scale: number;
}

function getCacheKeyResolver(owner: string, repo: string, options: ILangaugeOptions): string {
    return `${owner}/${repo}/${JSON.stringify(options)}`;
}

@define()
@singleton()
export class LangaugeManager {

    @inject() private logger: ILogger;
    @inject() private githubService: GithubService;
    @injectAliasFactory("IRenderer", "TYPE") private rendererCreators: { [index: string]: (options: ILangaugeOptions, totalBytes: number, languagesBytes: IDictionary<number>) => IRenderer };

    @cache({ maxAge: TEN_MINUTES_IN_MILLISECONDS, resolver: getCacheKeyResolver })
    public async generate(owner: string, repo: string, options: ILangaugeOptions): Promise<Buffer> {
        try {

            const createRenderer = this.rendererCreators[options.type];

            let languages = await this.githubService.getRepositoryLanguages(owner, repo);

            if (options.threshold) {
                languages = this.thresholdLanguagesFilter(languages, options.threshold);
            }

            const totalBytes = _(languages).values().sum();

            const renderer = createRenderer(options, totalBytes, languages);

            const bitmapBuffer = await renderer.render();

            return bitmapBuffer;

        } catch (err) {

            this.logger.error(`failed to render langauge for type ${options.type}`, err);

            return Buffer.from("");

        }
    }

    private thresholdLanguagesFilter(languages: IDictionary<number>, threshold: number): IDictionary<number> {

        const totalBytes = _(languages).values().sum();

        return _.transform<number, number>(languages, (result: IDictionary<number>, bytes: number, language: string) => {
            const percent = bytes / totalBytes * 100;

            if (percent >= threshold) {
                result[language] = bytes;
            }

            return result;
        }, {});
    }
}