import { RouteModel, validationParam, validator } from "appolo";
import { enumValues } from "../../common/utils";
import { GaugeType, OutputFormat } from "../../common/enums";
import { TEN_MINUTES_IN_SECONDS } from "../../common/constants";

export class LangaugeModel extends RouteModel {

    @validationParam(validator.string().required())
    owner: string;

    @validationParam(validator.string().required())
    repo: string;

    @validationParam(validator.number().min(1).optional().default(TEN_MINUTES_IN_SECONDS))
    maxAge: number;

    @validationParam(validator.string().valid(enumValues(GaugeType)).optional().default(GaugeType.Solid))
    type: GaugeType;

    @validationParam(validator.string().valid(enumValues(OutputFormat)).optional().default(OutputFormat.PNG))
    output: OutputFormat;

    @validationParam(validator.number().min(0).max(100).optional().default(0))
    threshold: number;

    @validationParam(validator.boolean().optional().default(true))
    colors: boolean;

    @validationParam(validator.number().min(0).optional().default(0))
    columns: number;

    @validationParam(validator.number().min(0.1).optional().default(1))
    scale: number;
}

export class PurgeLangaugeModel extends RouteModel {
    @validationParam(validator.string().required())
    owner: string;

    @validationParam(validator.string().required())
    repo: string;
}