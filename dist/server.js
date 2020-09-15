"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var express_1 = __importDefault(require("express"));
var routes_1 = __importDefault(require("./routes"));
var upload_1 = __importDefault(require("./config/upload"));
require("./database");
var app = express_1.default();
app.use(express_1.default.json());
app.use('/files', express_1.default.static(upload_1.default.directory));
app.use(routes_1.default);
app.listen(3333, function () {
    console.log('🚀 Server started on port 3333');
});
