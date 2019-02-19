import { RouteModel, validationParam, validator } from "appolo";
import { enumValues } from "../../common/utils";
import { GaugeTypes, OutputFormat } from "../../common/enums";

export class LangaugeModel extends RouteModel {

    @validationParam(validator.string().required())
    owner: string;

    @validationParam(validator.string().required())
    repo: string;

    @validationParam(validator.string().valid(enumValues(GaugeTypes)).optional().default(GaugeTypes.Solid))
    type: GaugeTypes;

    @validationParam(validator.string().valid(enumValues(OutputFormat)).optional().default(OutputFormat.PNG))
    output: OutputFormat;

    @validationParam(validator.number().min(0).max(100).optional().default(0))
    threshold: number;

    @validationParam(validator.boolean().optional().default(true))
    colors: boolean;
}