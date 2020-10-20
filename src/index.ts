import { Injex } from "@injex/node";
import { EnvPlugin } from "@injex/env-plugin";
import { ExpressPlugin } from "@injex/express-plugin";
import { LogLevel } from "@injex/core";

Injex.create({
    rootDirs: [
        __dirname
    ],
    logLevel: LogLevel.Info,
    plugins: [
        new ExpressPlugin({
            name: "app"
        }),
        new EnvPlugin({
            defaults: {
                port: 6060,
                githubToken: process.env.GITHUB_TOKEN
            }
        })
    ]
}).bootstrap();