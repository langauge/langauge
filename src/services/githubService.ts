import { define, singleton, inject } from "appolo";
import { HttpService, IResponse } from "@appolo/http";
import { IDictionary } from "../common/interfaces";
import IEnv from "../../config/env/IEnv";


@define()
@singleton()
export class GithubService {

    @inject() private httpService: HttpService;
    @inject() private env: IEnv;

    public async getRepository(owner: string, repo: string) {
        const response = await this.makeRequest("get", `repos/${owner}/${repo}`);

        return response.data;
    }

    public async getRepositoryLanguages(owner: string, repo: string): Promise<IDictionary<number>> {

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