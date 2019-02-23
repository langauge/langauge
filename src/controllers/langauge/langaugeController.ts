import { controller, Controller, inject, get, IRequest, IResponse, validation } from "appolo";
import { LangaugeModel } from "./langaugeModel";
import { LangaugeManager } from "../../managers/langaugeManager";
import { OutputFormatContentType } from "../../common/enums";
import { promisify } from "util";
import * as zlib from "zlib";

const gzip = promisify<Buffer, Buffer>(zlib.gzip);

@controller()
export class LangaugeController extends Controller {

    @inject() private langaugeManager: LangaugeManager;

    @get("/:owner/:repo")
    @validation(LangaugeModel)
    public async langauge(req: IRequest, res: IResponse, model: LangaugeModel) {

        const { owner, repo, maxAge, ...rest } = model;

        res.setHeader("Content-Type", OutputFormatContentType[model.output]);
        res.setHeader("Content-Encoding", "gzip");
        res.setHeader("Cache-Control", `max-age=${maxAge}`);

        const bitmapBuffer = await this.langaugeManager.generate(owner, repo, rest);

        return gzip(bitmapBuffer);
    }
}