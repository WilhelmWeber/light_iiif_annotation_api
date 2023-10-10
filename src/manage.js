"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const annotation_api_1 = __importDefault(require("./controllers/annotation_api"));
const manifests_api_1 = __importDefault(require("./controllers/manifests_api"));
const mod_presentation_api_1 = __importDefault(require("./controllers/mod_presentation_api"));
const mongoose_1 = __importDefault(require("mongoose"));
require("dotenv/config");
const port = process.env.PORT || 8080;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
mongoose_1.default.connect(process.env.DB_PATH ? process.env.DB_PATH : "");
mongoose_1.default.Promise = global.Promise;
app.use('/anedit', annotation_api_1.default);
app.use('/manifests', manifests_api_1.default);
app.use('/presentation', mod_presentation_api_1.default);
app.listen(port, () => {
    console.log(`server established at port ${port}`);
});
