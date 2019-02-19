<p align="center">
    <img alt="langauge" src="https://raw.githubusercontent.com/langauge/langauge/master/assets/langauge_logo.png"/>
</p>
<h2 align="center">
LANGAUGE.IO &middot; <a href="https://github.com/langauge/langauge/blob/master/LICENSE"><img alt="License" src="https://img.shields.io/badge/license-MIT-blue.svg"></a>
</h2>
<h3 align="center">
Stylize README files with your repositories programming languages usage.
</h3>
<p align="center">
<img alt="Langauge" src="https://badge.langauge.io/langauge/langauge" />
</p>

---

### Usage

Add Langauge to your README or Website

#### Markdown

`![Langauge](https://badge.langauge.io/:owner/:repo)`

#### HTML

`<img alt="Langauge" src="https://badge.langauge.io/:owner/:repo" />`

### Options

Langauge supports the following query string options.

#### type

Type: `string`, Default: `solid`

Set the renderer style type.

Currently only `solid` is supported.  
More styles are coming soon.

#### output

Type: `string`, Default: `png`

Set the output format.

Available options are: `png`, `jpeg`, `webp`, `tiff`.

#### threshold

Type: `number`, Default: `0`

Set the min language usage percentage.

Languages percentage usage below this threshold won't be rendered.

#### colors

Type: `boolean`, Default: `true`

Render with colors.

#### columns

Type: `number`, Default: repo languages count

Split the result into columns.

#### scale

Type: `number`, default: `1`

Scale the result size.

**NOTE!** There is a regression in `libsvg` pacakge, The `scale` option is notstable.

### Reporting Issues

We use GitHub Issues as the official bug tracker for Langauge. Here are some advices for our users that want to report an issue:

1. Make sure that you are using the latest version of Langauge. The issue that you are about to report may be already fixed in the latest master branch version: https://github.com/langauge/langauge/tree/master.
2. Providing us reproducible steps for the issue will shorten the time it takes for it to be fixed. A JSFiddle is always welcomed.

### Contributions

Pull requests are welcome. For major changes, please [open an issue](https://github.com/langauge/langauge/issues/new/choose) first to discuss what you would like to change.

Please make sure to update tests as appropriate.

### License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.