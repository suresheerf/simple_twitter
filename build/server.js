"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("./config/config");
const app_1 = __importDefault(require("./app"));
mongoose_1.default
    .connect(config_1.DB_URL)
    .then(() => {
    console.log('DB connection successful');
})
    .catch((err) => {
    console.error('Error:', err);
});
app_1.default
    .listen(config_1.PORT, () => {
    console.log(`App listening on ${config_1.PORT}`);
})
    .on('error', (err) => {
    console.log('err: ', err);
});
