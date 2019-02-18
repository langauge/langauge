import { define, singleton, inject, cache } from "appolo";
import { HttpService, IResponse } from "@appolo/http";
import * as _ from "lodash";

const TEN_MINUTES_IN_MS = 1000 * 60 * 10;

@define()
@singleton()
export class GithubService {

    @inject() httpService: HttpService;

    @cache({ maxAge: TEN_MINUTES_IN_MS })
    public async getRepositoryBytes(owner: string, repo: string) {
        const languages = await this.getRepositoryLanguages(owner, repo);
        const totalBytes = _(languages).values().sum();

        return {
            total: totalBytes,
            ...languages
        };
    }

    public async getRepository(owner: string, repo: string) {
        const response = await this.makeRequest("get", `repos/${owner}/${repo}`);

        return response.data;
    }

    public async getRepositoryLanguages(owner: string, repo: string) {
        const response = await this.makeRequest("get", `repos/${owner}/${repo}/languages`);

        return response.data;
    }

    private async makeRequest<T = any>(method: "get" | "post", endpoint: string, body?: any, qs?: any): Promise<IResponse<T>> {
        return this.httpService.request<T>({
            url: `https://api.github.com/${endpoint}`,
            params: qs,
            data: body,
            method: method,
            headers: {
                Accept: "application/vnd.github.v3+json"
            }
        });
    }
}