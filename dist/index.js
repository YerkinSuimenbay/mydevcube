"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const axios_1 = __importDefault(require("axios"));
// import yargs from 'yargs';
const yargs = __importStar(require("yargs"));
// AXIOS
const URL = 'https://api.app.shortcut.com/api/v3/projects';
const TOKEN = '6256ab94-efbb-4426-8d04-218bbc1156fc';
const fetchProjects = (ids) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield axios_1.default.get(URL, { headers: { "Shortcut-Token": TOKEN } });
    let projectsToExport = res.data;
    if (ids === null || ids === void 0 ? void 0 : ids.length)
        projectsToExport = projectsToExport.filter(project => ids.includes(project.id));
    projectsToExport = projectsToExport.map(item => ({ id: item.id, name: item.name, description: item.description }));
    return projectsToExport;
});
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const argv = yargs.options({
            fileName: {
                alias: 'o',
                type: 'string',
                demandOption: true,
                description: 'output file name'
            },
            ids: {
                alias: 'p',
                type: 'array',
                demandOption: true,
                description: 'list of project ids to export'
            },
        }).parseSync();
        const { fileName, ids } = argv;
        const projects = yield fetchProjects(ids);
        if (projects.length) {
            (0, fs_1.writeFile)(`${fileName}.json`, JSON.stringify(projects), (err) => {
                if (err) {
                    console.log(err);
                    throw err;
                }
                console.log(`Projects were exported as ${fileName}.json`);
            });
        }
        else {
            console.log('No project found. No file exported.');
        }
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            console.log('error message: ', error.message);
            return [];
        }
        else {
            console.log('unexpected error: ', error);
            return [];
        }
    }
});
start();
