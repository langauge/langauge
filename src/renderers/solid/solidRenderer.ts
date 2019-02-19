import { define, aliasFactory } from "appolo";
import { BaseRenderer, IRenderer } from "../baseRenderer";
import { GaugeTypes, OutputFormat } from "../../common/enums";
import * as handlebars from "handlebars";
import * as languages from "../../../data/languages";
import * as sharp from "sharp";
import * as _ from "lodash";
import * as path from "path";
import * as fs from "fs";

const SOLID_TEMPLATE_PATH = path.resolve(__dirname, "solid.handlebars");
const SOLID_TEMPLATE = fs.readFileSync(SOLID_TEMPLATE_PATH, { encoding: "utf8" });
const MARGIN = 5;
const ROTATION_EDGE_DEG = 135;

@define()
@aliasFactory("IRenderer")
export class SolidRenderer extends BaseRenderer implements IRenderer {

    public static readonly TYPE: string = GaugeTypes.Solid;

    public async render(): Promise<Buffer> {

        const repoLanguages = this.createRepoLanuages();

        const width = repoLanguages.length * 100;

        const svg = handlebars.compile(SOLID_TEMPLATE)({
            totalBytes: this.totalBytes,
            repoLanguages: repoLanguages,
            width
        });
        const renderer = sharp(Buffer.from(svg));

        switch (this.options.output) {
            case OutputFormat.JPEG:
                renderer.jpeg(); break;
            case OutputFormat.PNG:
                renderer.png(); break;
            case OutputFormat.TIFF:
                renderer.tiff(); break;
            case OutputFormat.WEBP:
                renderer.webp(); break;
        }

        renderer.resize(width, 120);

        return renderer.toBuffer();
    }

    private createRepoLanuages() {
        let index = 0;

        return _.reduce(this.languagesBytes, (result, bytes, language) => {

            const lang = languages[language]
                , percent = bytes / this.totalBytes * 100
                , rotation = percent / 100 * (ROTATION_EDGE_DEG * 2) - ROTATION_EDGE_DEG;

            if (this.options.threshold > percent) {
                return result;
            }

            result.push({
                language,
                bytes,
                rotation,
                percent: percent.toFixed(1),
                xPosition: index * 100,
                color: this.options.colors ? (lang && lang.color) || "#000000" : "transparent"
            });

            index++;

            return result;
        }, []);
    }
}