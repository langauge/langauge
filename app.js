"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const appolo_1 = require("appolo");
(async function () {
    try {
        await appolo_1.createApp().launch();
    }
    catch (err) {
        console.error("failed to launch langauge", err.stack);
        process.exit(1);
    }
})();
//# sourceMappingURL=app.js.map