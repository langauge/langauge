import { Request } from "express";
import { GaugeType, OutputFormat } from "./enums";

export interface IDictionary<T = any> {
    [index: string]: T;
}

export interface IEnvironment {
    port: number;
    githubToken: string;
}

export interface IRenderer {
    render(): Promise<Buffer>;
}

export interface ILangaugeOptions {
    type: GaugeType;
    output: OutputFormat;
    threshold: number;
    colors: boolean;
    columns: number;
    scale: number;
}

export interface IRequestModel extends ILangaugeOptions {
    owner: string;
    repo: string;
    maxAge: number;
}

export interface IRendererLanguage {
    language: string;
    bytes: number;
    percent: number;
    color: string;
}

export interface ILangaugeRequest extends Request {
    model: IRequestModel;
}