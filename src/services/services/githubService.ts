import { define, singleton, inject, init } from "@injex/core";
import { IEnvironment, IDictionary } from "../../common/interfaces";
import axios, { AxiosInstance, AxiosResponse } from "axios";

@define()
@singleton()
export class GithubService {

    @inject() private env: IEnvironment;

    private httpService: AxiosInstance;

    @init()
    protected initialize() {
        this.httpService = axios.create({
            baseURL: "https://api.github.com",
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'Authorization': `token ${this.env.githubToken}`
            }
        });
    }

    public async getRepositoryLanguages(owner: string, repo: string): Promise<IDictionary<number>> {
        const response = await this.makeRequest("get", `repos/${owner}/${repo}/languages`);

        return response.data;
    }

    private async makeRequest<T = any>(method: "get" | "post", endpoint: string, body?: any, qs?: any): Promise<AxiosResponse<T>> {
        return this.httpService.request({
            method,
            url: endpoint,
            data: body,
            params: qs
        });
    }
}