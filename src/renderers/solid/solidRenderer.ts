import { define, aliasFactory } from "appolo";
import { BaseRenderer, IRendererLanguage } from "../baseRenderer";
import { GaugeType } from "../../common/enums";
import * as handlebars from "handlebars";
import * as sharp from "sharp";
import * as _ from "lodash";
import * as path from "path";
import * as fs from "fs";
import { DEFAULT_DPI } from "../../common/constants";

const SOLID_TEMPLATE_PATH = path.resolve(__dirname, "solid.handlebars");
const SOLID_TEMPLATE = fs.readFileSync(SOLID_TEMPLATE_PATH, { encoding: "utf8" });
const ROTATION_EDGE_DEGREE = 135;
const GAUGE_WIDTH = 100;
const GAUGE_HEIGHT = 120;

@define()
@aliasFactory("IRenderer")
export class SolidRenderer extends BaseRenderer {

    public static readonly TYPE: string = GaugeType.Solid;

    protected async _render(): Promise<sharp.Sharp> {

        const languages = this.hydrateRendererLanguages()
            , totalLanguages = languages.length
            , [width, height] = this.calculageCanvasSize(totalLanguages)
            , destWidth = width * this.options.scale
            , destHeight = height * this.options.scale
            , dpi = DEFAULT_DPI * destWidth / width
            , svg = Buffer.from(handlebars.compile(SOLID_TEMPLATE)({ languages, width, height }));

        return sharp(svg, { density: dpi })
            .resize(destWidth, destHeight);
    }

    private calculageCanvasSize(languagesCount: number): [number, number] {
        return [
            this.options.columns * GAUGE_WIDTH,
            Math.ceil(languagesCount / this.options.columns) * GAUGE_HEIGHT
        ];
    }

    private hydrateRendererLanguages(): Array<IRendererLanguage & { rotation: number; translateX: number; translateY: number; }> {
        const results = [];

        const languagesRows = _.chunk(this.languages, this.options.columns);

        let currentLanguage: IRendererLanguage;

        for (let i = 0, rows = languagesRows.length; i < rows; i++) {

            for (let j = 0, columns = languagesRows[i].length; j < columns; j++) {

                currentLanguage = languagesRows[i][j];

                results.push({
                    ...currentLanguage,
                    rotation: currentLanguage.percent / 100 * (ROTATION_EDGE_DEGREE * 2) - ROTATION_EDGE_DEGREE,
                    translateX: j * GAUGE_WIDTH,
                    translateY: i * GAUGE_HEIGHT
                });
            }
        }

        return results;
    }
}