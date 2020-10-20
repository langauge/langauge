import { define, singleton } from "@injex/core";
import { IMiddleware } from "@injex/express-plugin";
import { NextFunction, Response } from "express";
import * as joi from "joi";
import { TEN_MINUTES_IN_SECONDS } from "../common/constants";
import { GaugeType, OutputFormat } from "../common/enums";
import { ILangaugeRequest, IRequestModel } from "../common/interfaces";
import { enumValues } from "../common/utils";

const schema: joi.ObjectSchema<IRequestModel> = joi.object().keys({
    owner: joi.string().required(),
    repo: joi.string().required(),
    maxAge: joi.number().optional().default(TEN_MINUTES_IN_SECONDS),
    type: joi.string().valid(...enumValues(GaugeType)).optional().default(GaugeType.Solid),
    output: joi.string().valid(...enumValues(OutputFormat)).optional().default(OutputFormat.PNG),
    threshold: joi.number().optional().default(0),
    colors: joi.boolean().optional().default(true),
    columns: joi.number().optional().default(0),
    scale: joi.number().optional().default(1)
});

@define()
@singleton()
export class RequestValidationMiddleware implements IMiddleware {
    public async handle(req: ILangaugeRequest, res: Response, next: NextFunction) {
        try {
            req.model = await schema.validateAsync({ ...req.query, ...req.params });
            next();
        } catch (e) {
            next(e);
        }
    }
}