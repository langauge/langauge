export enum GaugeType {
    Solid = "solid"
}

export enum OutputFormat {
    PNG = "png",
    JPEG = "jpeg",
    WEBP = "webp",
    TIFF = "tiff"
}

export const OutputFormatContentType = {
    [OutputFormat.JPEG]: "image/jpeg",
    [OutputFormat.TIFF]: "image/tiff",
    [OutputFormat.WEBP]: "image/webp",
    [OutputFormat.PNG]: "image/png"
};