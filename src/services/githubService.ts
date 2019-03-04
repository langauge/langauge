import { define, singleton, inject } from "appolo";
import { HttpService, IHttpResponse } from "@appolo/http";
import { cache } from "@appolo/cache";
import { IDictionary } from "../common/interfaces";
import { TEN_MINUTES_IN_MILLISECONDS } from "../common/constants";
import IEnv from "../../config/env/IEnv";

@define()
@singleton()
export class GithubService {

    @inject() private httpService: HttpService;
    @inject() private env: IEnv;

    @cache({ maxAge: TEN_MINUTES_IN_MILLISECONDS, multi: true })
    public async getRepositoryLanguages(owner: string, repo: string): Promise<IDictionary<number>> {

        const response = await this.makeRequest("get", `repos/${owner}/${repo}/languages`);

        return response.data;
    }

    private async makeRequest<T = any>(method: "get" | "post", endpoint: string, body?: any, qs?: any): Promise<IHttpResponse<T>> {
        const headers: IDictionary<string> = {
            Accept: "application/vnd.github.v3+json"
        };

        if (this.env.githubToken) {
            headers.Authorization = `token ${this.env.githubToken}`;
        }

        return this.httpService.request<T>({
            url: `https://api.github.com/${endpoint}`,
            params: qs,
            data: body,
            method,
            headers
        });
    }
}