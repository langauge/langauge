import { singleton, define, inject, injectAlias, Injex, AliasMap } from "@injex/core";
import { IDictionary, IRenderer, ILangaugeOptions } from "../common/interfaces";
import * as _ from "lodash";
import { GithubService } from "../services/services/githubService";

type RendererCreator = (options: ILangaugeOptions, totalBytes: number, languagesBytes: IDictionary<number>) => IRenderer;

@define()
@singleton()
export class LangaugeManager {

    @inject() private $injex: Injex<any>;
    @inject() private githubService: GithubService;
    @injectAlias("IRenderer", "TYPE") private rendererCreators: AliasMap<string, RendererCreator>;

    public async generate(owner: string, repo: string, options: ILangaugeOptions): Promise<Buffer> {
        try {
            const createRenderer = this.rendererCreators[options.type];

            let languages = await this.githubService.getRepositoryLanguages(owner, repo);

            if (options.threshold) {
                languages = this.thresholdLanguagesFilter(languages, options.threshold);
            }

            const totalBytes = _(languages).values().sum();

            const renderer = createRenderer(options, totalBytes, languages);

            return await renderer.render();

        } catch (err) {

            this.$injex.logger.error(`failed to render langauge for type ${options.type}`, err);

            return Buffer.from("");
        }
    }

    private thresholdLanguagesFilter(languages: IDictionary<number>, threshold: number): IDictionary<number> {
        const totalBytes = _(languages).values().sum();

        return _.transform(languages, (result: IDictionary<number>, bytes: number, language: string) => {
            const percent = bytes / totalBytes * 100;

            if (percent >= threshold) {
                result[language] = bytes;
            }

            return result;
        }, {});
    }
}