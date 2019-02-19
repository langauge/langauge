import { controller, Controller, inject, get, IRequest, IResponse, validation } from "appolo";
import { ILogger } from "@appolo/logger";
import { LangaugeModel } from "./langaugeModel";
import { LangaugeManager } from "../../managers/langaugeManager";
import { OutputFormat } from "../../common/enums";

@controller("/langauge")
export class LangaugeController extends Controller {

    @inject() private langaugeManager: LangaugeManager;

    @get("/:owner/:repo")
    @validation(LangaugeModel)
    public async langauge(req: IRequest, res: IResponse, model: LangaugeModel) {

        const { owner, repo, ...rest } = model;

        res.setHeader("Content-Type", this.getContentType(model.output));

        return this.langaugeManager.generate(owner, repo, rest);
    }

    private getContentType(output: OutputFormat): string {
        switch (output) {
            case OutputFormat.JPEG:
                return "image/jpeg";
            case OutputFormat.TIFF:
                return "image/tiff";
            case OutputFormat.WEBP:
                return "image/webp";
            case OutputFormat.PNG:
            default:
                return "image/png";
        }
    }
}