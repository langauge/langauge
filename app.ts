import { createApp } from "appolo";

(async function () {
    try {

        await createApp().launch();

    } catch (err) {

        console.error("failed to launch langauge", err.stack);

        process.exit(1);

    }
})();