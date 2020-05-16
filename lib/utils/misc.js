"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfigFilename = exports.getColumnName = exports.getProjectName = void 0;
const core_1 = require("@actions/core");
exports.getProjectName = (projectId, octokit) => __awaiter(void 0, void 0, void 0, function* () { return (yield octokit.projects.get({ 'project_id': projectId })).data.name; });
exports.getColumnName = (columnId, octokit) => __awaiter(void 0, void 0, void 0, function* () { return (yield octokit.projects.getColumn({ 'column_id': columnId })).data.name; });
exports.getConfigFilename = () => core_1.getInput('CONFIG_FILENAME', { required: true });
