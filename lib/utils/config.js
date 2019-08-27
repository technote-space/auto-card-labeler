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
const path_1 = __importDefault(require("path"));
const misc_1 = require("./misc");
const constant_1 = require("../constant");
exports.getConfig = (fileName, octokit, context) => __awaiter(this, void 0, void 0, function* () {
    return misc_1.parseConfig((yield octokit.repos.getContents({
        owner: context.repo.owner,
        repo: context.repo.repo,
        path: path_1.default.posix.join(constant_1.CONFIG_PATH, fileName),
    })).data.content);
});
