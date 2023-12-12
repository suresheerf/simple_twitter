"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const mongoose_to_swagger_1 = __importDefault(require("mongoose-to-swagger"));
const errorController_1 = __importDefault(require("./controllers/errorController"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const post_routes_1 = __importDefault(require("./routes/post.routes"));
const comment_routes_1 = __importDefault(require("./routes/comment.routes"));
const appError_1 = __importDefault(require("./utils/appError"));
const user_model_1 = __importDefault(require("./models/user.model"));
const post_model_1 = __importDefault(require("./models/post.model"));
const comment_model_1 = __importDefault(require("./models/comment.model"));
const app = (0, express_1.default)();
const options = {
    definition: {
        openapi: '3.1.0',
        info: {
            title: 'api-test-easy API with Swagger',
            version: '0.1.0',
            description: 'This is a nodejs application made with Express and documented with Swagger',
            license: {
                name: 'MIT',
                url: 'https://spdx.org/licenses/MIT.html',
            },
        },
        servers: [
            {
                url: 'http://localhost:3004',
            },
        ],
        components: {
            schemas: {
                User: (0, mongoose_to_swagger_1.default)(user_model_1.default),
                Post: (0, mongoose_to_swagger_1.default)(post_model_1.default),
                Comment: (0, mongoose_to_swagger_1.default)(comment_model_1.default),
            },
        },
    },
    apis: [`${__dirname}/controllers/*.ts`],
};
const specs = (0, swagger_jsdoc_1.default)(options);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.static('public'));
app.get('/', (req, res) => {
    res.status(200).json({ message: 'server running' });
});
// mounting routes
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(specs, { explorer: true }));
app.use('/api', auth_routes_1.default);
app.use('/api', user_routes_1.default);
app.use('/api', post_routes_1.default);
app.use('/api', comment_routes_1.default);
app.all('*', (req, res, next) => {
    next(new appError_1.default(`can't find ${req.originalUrl} on this server!`, 404));
});
app.use(errorController_1.default);
exports.default = app;
