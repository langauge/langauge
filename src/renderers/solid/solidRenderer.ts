import { define, aliasFactory } from "appolo";
import { BaseRenderer, IRenderer, IRendererLanguage } from "../baseRenderer";
import { GaugeType } from "../../common/enums";
import * as handlebars from "handlebars";
import * as sharp from "sharp";
import * as _ from "lodash";
import * as path from "path";
import * as fs from "fs";

const SOLID_TEMPLATE_PATH = path.resolve(__dirname, "solid.handlebars");
const SOLID_TEMPLATE = fs.readFileSync(SOLID_TEMPLATE_PATH, { encoding: "utf8" });
const ROTATION_EDGE_DEGREE = 135;
const GAUGE_WIDTH = 100;
const GAUGE_HEIGHT = 120;

@define()
@aliasFactory("IRenderer")
export class SolidRenderer extends BaseRenderer implements IRenderer {

    public static readonly TYPE: string = GaugeType.Solid;

    protected async _render(): Promise<sharp.Sharp> {

        const languages = this.hydrateRendererLanguages()
            , width = languages.length * GAUGE_WIDTH
            , height = GAUGE_HEIGHT
            , svg = handlebars.compile(SOLID_TEMPLATE)({ languages, width, height })
            , renderer = sharp(Buffer.from(svg));

        return renderer.resize(width, height);
    }

    private hydrateRendererLanguages(): Array<IRendererLanguage & { rotation: number; xPosition: number; }> {
        return _.map(this.languages, (language: IRendererLanguage, i: number) => ({
            ...language,
            rotation: language.percent / 100 * (ROTATION_EDGE_DEGREE * 2) - ROTATION_EDGE_DEGREE,
            xPosition: i * GAUGE_WIDTH
        }));
    }
}