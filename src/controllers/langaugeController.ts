import { define, singleton, inject } from "@injex/core";
import { LangaugeManager } from "../managers/langaugeManager";
import { OutputFormatContentType } from "../common/enums";
import { promisify } from "util";
import * as zlib from "zlib";
import { controller, get, middleware } from "@injex/express-plugin";
import { Response } from "express";
import { ILangaugeRequest } from "../common/interfaces";
import { RequestValidationMiddleware } from "../middlewares/requestValidationMiddleware";

const gzip = promisify<Buffer, Buffer>(zlib.gzip);

@define()
@singleton()
@controller()
export class LangaugeController {

    @inject() private langaugeManager: LangaugeManager;

    @get("/:owner/:repo")
    @middleware(RequestValidationMiddleware)
    public async render(req: ILangaugeRequest, res: Response<Buffer>) {

        res.setHeader("Content-Type", OutputFormatContentType[req.model.output]);
        res.setHeader("Content-Encoding", "gzip");
        res.setHeader("Cache-Control", `max-age=${req.model.maxAge}`);

        const bitmapBuffer = await this.langaugeManager.generate(req.model.owner, req.model.repo, req.model);
        const buffer = await gzip(bitmapBuffer);

        res.send(buffer);
    }
}