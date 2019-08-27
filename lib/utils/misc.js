"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const js_yaml_1 = __importDefault(require("js-yaml"));
const signale_1 = __importDefault(require("signale"));
const core_1 = require("@actions/core");
const constant_1 = require("../constant");
exports.isTargetEvent = (context) => constant_1.TARGET_EVENT_NAME === context.eventName && constant_1.TARGET_EVENT_ACTION === context.payload.action;
exports.parseConfig = (content) => js_yaml_1.default.safeLoad(Buffer.from(content, 'base64').toString()) || {};
exports.getProjectName = (projectId, octokit) => __awaiter(this, void 0, void 0, function* () {
    signale_1.default.info('Getting project name');
    const { data: { name } } = yield octokit.projects.get({ project_id: projectId });
    return name;
});
exports.getColumnName = (columnId, octokit) => __awaiter(this, void 0, void 0, function* () {
    signale_1.default.info('Getting column name');
    const { data: { name } } = yield octokit.projects.getColumn({ column_id: columnId });
    return name;
});
exports.getConfigFilename = () => core_1.getInput('CONFIG_FILENAME') || constant_1.DEFAULT_CONFIG_FILENAME;
