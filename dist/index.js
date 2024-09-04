require('./sourcemap-register.js');/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 7351:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.issue = exports.issueCommand = void 0;
const os = __importStar(__nccwpck_require__(2037));
const utils_1 = __nccwpck_require__(5278);
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
function escapeData(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}
//# sourceMappingURL=command.js.map

/***/ }),

/***/ 2186:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getIDToken = exports.getState = exports.saveState = exports.group = exports.endGroup = exports.startGroup = exports.info = exports.notice = exports.warning = exports.error = exports.debug = exports.isDebug = exports.setFailed = exports.setCommandEcho = exports.setOutput = exports.getBooleanInput = exports.getMultilineInput = exports.getInput = exports.addPath = exports.setSecret = exports.exportVariable = exports.ExitCode = void 0;
const command_1 = __nccwpck_require__(7351);
const file_command_1 = __nccwpck_require__(717);
const utils_1 = __nccwpck_require__(5278);
const os = __importStar(__nccwpck_require__(2037));
const path = __importStar(__nccwpck_require__(1017));
const oidc_utils_1 = __nccwpck_require__(8041);
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function exportVariable(name, val) {
    const convertedVal = utils_1.toCommandValue(val);
    process.env[name] = convertedVal;
    const filePath = process.env['GITHUB_ENV'] || '';
    if (filePath) {
        return file_command_1.issueFileCommand('ENV', file_command_1.prepareKeyValueMessage(name, val));
    }
    command_1.issueCommand('set-env', { name }, convertedVal);
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    const filePath = process.env['GITHUB_PATH'] || '';
    if (filePath) {
        file_command_1.issueFileCommand('PATH', inputPath);
    }
    else {
        command_1.issueCommand('add-path', {}, inputPath);
    }
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.
 * Unless trimWhitespace is set to false in InputOptions, the value is also trimmed.
 * Returns an empty string if the value is not defined.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    if (options && options.trimWhitespace === false) {
        return val;
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Gets the values of an multiline input.  Each value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string[]
 *
 */
function getMultilineInput(name, options) {
    const inputs = getInput(name, options)
        .split('\n')
        .filter(x => x !== '');
    if (options && options.trimWhitespace === false) {
        return inputs;
    }
    return inputs.map(input => input.trim());
}
exports.getMultilineInput = getMultilineInput;
/**
 * Gets the input value of the boolean type in the YAML 1.2 "core schema" specification.
 * Support boolean input list: `true | True | TRUE | false | False | FALSE` .
 * The return value is also in boolean type.
 * ref: https://yaml.org/spec/1.2/spec.html#id2804923
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   boolean
 */
function getBooleanInput(name, options) {
    const trueValue = ['true', 'True', 'TRUE'];
    const falseValue = ['false', 'False', 'FALSE'];
    const val = getInput(name, options);
    if (trueValue.includes(val))
        return true;
    if (falseValue.includes(val))
        return false;
    throw new TypeError(`Input does not meet YAML 1.2 "Core Schema" specification: ${name}\n` +
        `Support boolean input list: \`true | True | TRUE | false | False | FALSE\``);
}
exports.getBooleanInput = getBooleanInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setOutput(name, value) {
    const filePath = process.env['GITHUB_OUTPUT'] || '';
    if (filePath) {
        return file_command_1.issueFileCommand('OUTPUT', file_command_1.prepareKeyValueMessage(name, value));
    }
    process.stdout.write(os.EOL);
    command_1.issueCommand('set-output', { name }, utils_1.toCommandValue(value));
}
exports.setOutput = setOutput;
/**
 * Enables or disables the echoing of commands into stdout for the rest of the step.
 * Echoing is disabled by default if ACTIONS_STEP_DEBUG is not set.
 *
 */
function setCommandEcho(enabled) {
    command_1.issue('echo', enabled ? 'on' : 'off');
}
exports.setCommandEcho = setCommandEcho;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */
function isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
exports.isDebug = isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function error(message, properties = {}) {
    command_1.issueCommand('error', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.error = error;
/**
 * Adds a warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function warning(message, properties = {}) {
    command_1.issueCommand('warning', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.warning = warning;
/**
 * Adds a notice issue
 * @param message notice issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function notice(message, properties = {}) {
    command_1.issueCommand('notice', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.notice = notice;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveState(name, value) {
    const filePath = process.env['GITHUB_STATE'] || '';
    if (filePath) {
        return file_command_1.issueFileCommand('STATE', file_command_1.prepareKeyValueMessage(name, value));
    }
    command_1.issueCommand('save-state', { name }, utils_1.toCommandValue(value));
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
function getIDToken(aud) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield oidc_utils_1.OidcClient.getIDToken(aud);
    });
}
exports.getIDToken = getIDToken;
/**
 * Summary exports
 */
var summary_1 = __nccwpck_require__(1327);
Object.defineProperty(exports, "summary", ({ enumerable: true, get: function () { return summary_1.summary; } }));
/**
 * @deprecated use core.summary
 */
var summary_2 = __nccwpck_require__(1327);
Object.defineProperty(exports, "markdownSummary", ({ enumerable: true, get: function () { return summary_2.markdownSummary; } }));
/**
 * Path exports
 */
var path_utils_1 = __nccwpck_require__(2981);
Object.defineProperty(exports, "toPosixPath", ({ enumerable: true, get: function () { return path_utils_1.toPosixPath; } }));
Object.defineProperty(exports, "toWin32Path", ({ enumerable: true, get: function () { return path_utils_1.toWin32Path; } }));
Object.defineProperty(exports, "toPlatformPath", ({ enumerable: true, get: function () { return path_utils_1.toPlatformPath; } }));
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 717:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

// For internal use, subject to change.
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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.prepareKeyValueMessage = exports.issueFileCommand = void 0;
// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
const fs = __importStar(__nccwpck_require__(7147));
const os = __importStar(__nccwpck_require__(2037));
const uuid_1 = __nccwpck_require__(5840);
const utils_1 = __nccwpck_require__(5278);
function issueFileCommand(command, message) {
    const filePath = process.env[`GITHUB_${command}`];
    if (!filePath) {
        throw new Error(`Unable to find environment variable for file command ${command}`);
    }
    if (!fs.existsSync(filePath)) {
        throw new Error(`Missing file at path: ${filePath}`);
    }
    fs.appendFileSync(filePath, `${utils_1.toCommandValue(message)}${os.EOL}`, {
        encoding: 'utf8'
    });
}
exports.issueFileCommand = issueFileCommand;
function prepareKeyValueMessage(key, value) {
    const delimiter = `ghadelimiter_${uuid_1.v4()}`;
    const convertedValue = utils_1.toCommandValue(value);
    // These should realistically never happen, but just in case someone finds a
    // way to exploit uuid generation let's not allow keys or values that contain
    // the delimiter.
    if (key.includes(delimiter)) {
        throw new Error(`Unexpected input: name should not contain the delimiter "${delimiter}"`);
    }
    if (convertedValue.includes(delimiter)) {
        throw new Error(`Unexpected input: value should not contain the delimiter "${delimiter}"`);
    }
    return `${key}<<${delimiter}${os.EOL}${convertedValue}${os.EOL}${delimiter}`;
}
exports.prepareKeyValueMessage = prepareKeyValueMessage;
//# sourceMappingURL=file-command.js.map

/***/ }),

/***/ 8041:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OidcClient = void 0;
const http_client_1 = __nccwpck_require__(6255);
const auth_1 = __nccwpck_require__(5526);
const core_1 = __nccwpck_require__(2186);
class OidcClient {
    static createHttpClient(allowRetry = true, maxRetry = 10) {
        const requestOptions = {
            allowRetries: allowRetry,
            maxRetries: maxRetry
        };
        return new http_client_1.HttpClient('actions/oidc-client', [new auth_1.BearerCredentialHandler(OidcClient.getRequestToken())], requestOptions);
    }
    static getRequestToken() {
        const token = process.env['ACTIONS_ID_TOKEN_REQUEST_TOKEN'];
        if (!token) {
            throw new Error('Unable to get ACTIONS_ID_TOKEN_REQUEST_TOKEN env variable');
        }
        return token;
    }
    static getIDTokenUrl() {
        const runtimeUrl = process.env['ACTIONS_ID_TOKEN_REQUEST_URL'];
        if (!runtimeUrl) {
            throw new Error('Unable to get ACTIONS_ID_TOKEN_REQUEST_URL env variable');
        }
        return runtimeUrl;
    }
    static getCall(id_token_url) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const httpclient = OidcClient.createHttpClient();
            const res = yield httpclient
                .getJson(id_token_url)
                .catch(error => {
                throw new Error(`Failed to get ID Token. \n 
        Error Code : ${error.statusCode}\n 
        Error Message: ${error.message}`);
            });
            const id_token = (_a = res.result) === null || _a === void 0 ? void 0 : _a.value;
            if (!id_token) {
                throw new Error('Response json body do not have ID Token field');
            }
            return id_token;
        });
    }
    static getIDToken(audience) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // New ID Token is requested from action service
                let id_token_url = OidcClient.getIDTokenUrl();
                if (audience) {
                    const encodedAudience = encodeURIComponent(audience);
                    id_token_url = `${id_token_url}&audience=${encodedAudience}`;
                }
                core_1.debug(`ID token url is ${id_token_url}`);
                const id_token = yield OidcClient.getCall(id_token_url);
                core_1.setSecret(id_token);
                return id_token;
            }
            catch (error) {
                throw new Error(`Error message: ${error.message}`);
            }
        });
    }
}
exports.OidcClient = OidcClient;
//# sourceMappingURL=oidc-utils.js.map

/***/ }),

/***/ 2981:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toPlatformPath = exports.toWin32Path = exports.toPosixPath = void 0;
const path = __importStar(__nccwpck_require__(1017));
/**
 * toPosixPath converts the given path to the posix form. On Windows, \\ will be
 * replaced with /.
 *
 * @param pth. Path to transform.
 * @return string Posix path.
 */
function toPosixPath(pth) {
    return pth.replace(/[\\]/g, '/');
}
exports.toPosixPath = toPosixPath;
/**
 * toWin32Path converts the given path to the win32 form. On Linux, / will be
 * replaced with \\.
 *
 * @param pth. Path to transform.
 * @return string Win32 path.
 */
function toWin32Path(pth) {
    return pth.replace(/[/]/g, '\\');
}
exports.toWin32Path = toWin32Path;
/**
 * toPlatformPath converts the given path to a platform-specific path. It does
 * this by replacing instances of / and \ with the platform-specific path
 * separator.
 *
 * @param pth The path to platformize.
 * @return string The platform-specific path.
 */
function toPlatformPath(pth) {
    return pth.replace(/[/\\]/g, path.sep);
}
exports.toPlatformPath = toPlatformPath;
//# sourceMappingURL=path-utils.js.map

/***/ }),

/***/ 1327:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.summary = exports.markdownSummary = exports.SUMMARY_DOCS_URL = exports.SUMMARY_ENV_VAR = void 0;
const os_1 = __nccwpck_require__(2037);
const fs_1 = __nccwpck_require__(7147);
const { access, appendFile, writeFile } = fs_1.promises;
exports.SUMMARY_ENV_VAR = 'GITHUB_STEP_SUMMARY';
exports.SUMMARY_DOCS_URL = 'https://docs.github.com/actions/using-workflows/workflow-commands-for-github-actions#adding-a-job-summary';
class Summary {
    constructor() {
        this._buffer = '';
    }
    /**
     * Finds the summary file path from the environment, rejects if env var is not found or file does not exist
     * Also checks r/w permissions.
     *
     * @returns step summary file path
     */
    filePath() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._filePath) {
                return this._filePath;
            }
            const pathFromEnv = process.env[exports.SUMMARY_ENV_VAR];
            if (!pathFromEnv) {
                throw new Error(`Unable to find environment variable for $${exports.SUMMARY_ENV_VAR}. Check if your runtime environment supports job summaries.`);
            }
            try {
                yield access(pathFromEnv, fs_1.constants.R_OK | fs_1.constants.W_OK);
            }
            catch (_a) {
                throw new Error(`Unable to access summary file: '${pathFromEnv}'. Check if the file has correct read/write permissions.`);
            }
            this._filePath = pathFromEnv;
            return this._filePath;
        });
    }
    /**
     * Wraps content in an HTML tag, adding any HTML attributes
     *
     * @param {string} tag HTML tag to wrap
     * @param {string | null} content content within the tag
     * @param {[attribute: string]: string} attrs key-value list of HTML attributes to add
     *
     * @returns {string} content wrapped in HTML element
     */
    wrap(tag, content, attrs = {}) {
        const htmlAttrs = Object.entries(attrs)
            .map(([key, value]) => ` ${key}="${value}"`)
            .join('');
        if (!content) {
            return `<${tag}${htmlAttrs}>`;
        }
        return `<${tag}${htmlAttrs}>${content}</${tag}>`;
    }
    /**
     * Writes text in the buffer to the summary buffer file and empties buffer. Will append by default.
     *
     * @param {SummaryWriteOptions} [options] (optional) options for write operation
     *
     * @returns {Promise<Summary>} summary instance
     */
    write(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const overwrite = !!(options === null || options === void 0 ? void 0 : options.overwrite);
            const filePath = yield this.filePath();
            const writeFunc = overwrite ? writeFile : appendFile;
            yield writeFunc(filePath, this._buffer, { encoding: 'utf8' });
            return this.emptyBuffer();
        });
    }
    /**
     * Clears the summary buffer and wipes the summary file
     *
     * @returns {Summary} summary instance
     */
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.emptyBuffer().write({ overwrite: true });
        });
    }
    /**
     * Returns the current summary buffer as a string
     *
     * @returns {string} string of summary buffer
     */
    stringify() {
        return this._buffer;
    }
    /**
     * If the summary buffer is empty
     *
     * @returns {boolen} true if the buffer is empty
     */
    isEmptyBuffer() {
        return this._buffer.length === 0;
    }
    /**
     * Resets the summary buffer without writing to summary file
     *
     * @returns {Summary} summary instance
     */
    emptyBuffer() {
        this._buffer = '';
        return this;
    }
    /**
     * Adds raw text to the summary buffer
     *
     * @param {string} text content to add
     * @param {boolean} [addEOL=false] (optional) append an EOL to the raw text (default: false)
     *
     * @returns {Summary} summary instance
     */
    addRaw(text, addEOL = false) {
        this._buffer += text;
        return addEOL ? this.addEOL() : this;
    }
    /**
     * Adds the operating system-specific end-of-line marker to the buffer
     *
     * @returns {Summary} summary instance
     */
    addEOL() {
        return this.addRaw(os_1.EOL);
    }
    /**
     * Adds an HTML codeblock to the summary buffer
     *
     * @param {string} code content to render within fenced code block
     * @param {string} lang (optional) language to syntax highlight code
     *
     * @returns {Summary} summary instance
     */
    addCodeBlock(code, lang) {
        const attrs = Object.assign({}, (lang && { lang }));
        const element = this.wrap('pre', this.wrap('code', code), attrs);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML list to the summary buffer
     *
     * @param {string[]} items list of items to render
     * @param {boolean} [ordered=false] (optional) if the rendered list should be ordered or not (default: false)
     *
     * @returns {Summary} summary instance
     */
    addList(items, ordered = false) {
        const tag = ordered ? 'ol' : 'ul';
        const listItems = items.map(item => this.wrap('li', item)).join('');
        const element = this.wrap(tag, listItems);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML table to the summary buffer
     *
     * @param {SummaryTableCell[]} rows table rows
     *
     * @returns {Summary} summary instance
     */
    addTable(rows) {
        const tableBody = rows
            .map(row => {
            const cells = row
                .map(cell => {
                if (typeof cell === 'string') {
                    return this.wrap('td', cell);
                }
                const { header, data, colspan, rowspan } = cell;
                const tag = header ? 'th' : 'td';
                const attrs = Object.assign(Object.assign({}, (colspan && { colspan })), (rowspan && { rowspan }));
                return this.wrap(tag, data, attrs);
            })
                .join('');
            return this.wrap('tr', cells);
        })
            .join('');
        const element = this.wrap('table', tableBody);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds a collapsable HTML details element to the summary buffer
     *
     * @param {string} label text for the closed state
     * @param {string} content collapsable content
     *
     * @returns {Summary} summary instance
     */
    addDetails(label, content) {
        const element = this.wrap('details', this.wrap('summary', label) + content);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML image tag to the summary buffer
     *
     * @param {string} src path to the image you to embed
     * @param {string} alt text description of the image
     * @param {SummaryImageOptions} options (optional) addition image attributes
     *
     * @returns {Summary} summary instance
     */
    addImage(src, alt, options) {
        const { width, height } = options || {};
        const attrs = Object.assign(Object.assign({}, (width && { width })), (height && { height }));
        const element = this.wrap('img', null, Object.assign({ src, alt }, attrs));
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML section heading element
     *
     * @param {string} text heading text
     * @param {number | string} [level=1] (optional) the heading level, default: 1
     *
     * @returns {Summary} summary instance
     */
    addHeading(text, level) {
        const tag = `h${level}`;
        const allowedTag = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)
            ? tag
            : 'h1';
        const element = this.wrap(allowedTag, text);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML thematic break (<hr>) to the summary buffer
     *
     * @returns {Summary} summary instance
     */
    addSeparator() {
        const element = this.wrap('hr', null);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML line break (<br>) to the summary buffer
     *
     * @returns {Summary} summary instance
     */
    addBreak() {
        const element = this.wrap('br', null);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML blockquote to the summary buffer
     *
     * @param {string} text quote text
     * @param {string} cite (optional) citation url
     *
     * @returns {Summary} summary instance
     */
    addQuote(text, cite) {
        const attrs = Object.assign({}, (cite && { cite }));
        const element = this.wrap('blockquote', text, attrs);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML anchor tag to the summary buffer
     *
     * @param {string} text link text/content
     * @param {string} href hyperlink
     *
     * @returns {Summary} summary instance
     */
    addLink(text, href) {
        const element = this.wrap('a', text, { href });
        return this.addRaw(element).addEOL();
    }
}
const _summary = new Summary();
/**
 * @deprecated use `core.summary`
 */
exports.markdownSummary = _summary;
exports.summary = _summary;
//# sourceMappingURL=summary.js.map

/***/ }),

/***/ 5278:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toCommandProperties = exports.toCommandValue = void 0;
/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */
function toCommandValue(input) {
    if (input === null || input === undefined) {
        return '';
    }
    else if (typeof input === 'string' || input instanceof String) {
        return input;
    }
    return JSON.stringify(input);
}
exports.toCommandValue = toCommandValue;
/**
 *
 * @param annotationProperties
 * @returns The command properties to send with the actual annotation command
 * See IssueCommandProperties: https://github.com/actions/runner/blob/main/src/Runner.Worker/ActionCommandManager.cs#L646
 */
function toCommandProperties(annotationProperties) {
    if (!Object.keys(annotationProperties).length) {
        return {};
    }
    return {
        title: annotationProperties.title,
        file: annotationProperties.file,
        line: annotationProperties.startLine,
        endLine: annotationProperties.endLine,
        col: annotationProperties.startColumn,
        endColumn: annotationProperties.endColumn
    };
}
exports.toCommandProperties = toCommandProperties;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 1514:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getExecOutput = exports.exec = void 0;
const string_decoder_1 = __nccwpck_require__(1576);
const tr = __importStar(__nccwpck_require__(8159));
/**
 * Exec a command.
 * Output will be streamed to the live console.
 * Returns promise with return code
 *
 * @param     commandLine        command to execute (can include additional args). Must be correctly escaped.
 * @param     args               optional arguments for tool. Escaping is handled by the lib.
 * @param     options            optional exec options.  See ExecOptions
 * @returns   Promise<number>    exit code
 */
function exec(commandLine, args, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const commandArgs = tr.argStringToArray(commandLine);
        if (commandArgs.length === 0) {
            throw new Error(`Parameter 'commandLine' cannot be null or empty.`);
        }
        // Path to tool to execute should be first arg
        const toolPath = commandArgs[0];
        args = commandArgs.slice(1).concat(args || []);
        const runner = new tr.ToolRunner(toolPath, args, options);
        return runner.exec();
    });
}
exports.exec = exec;
/**
 * Exec a command and get the output.
 * Output will be streamed to the live console.
 * Returns promise with the exit code and collected stdout and stderr
 *
 * @param     commandLine           command to execute (can include additional args). Must be correctly escaped.
 * @param     args                  optional arguments for tool. Escaping is handled by the lib.
 * @param     options               optional exec options.  See ExecOptions
 * @returns   Promise<ExecOutput>   exit code, stdout, and stderr
 */
function getExecOutput(commandLine, args, options) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        let stdout = '';
        let stderr = '';
        //Using string decoder covers the case where a mult-byte character is split
        const stdoutDecoder = new string_decoder_1.StringDecoder('utf8');
        const stderrDecoder = new string_decoder_1.StringDecoder('utf8');
        const originalStdoutListener = (_a = options === null || options === void 0 ? void 0 : options.listeners) === null || _a === void 0 ? void 0 : _a.stdout;
        const originalStdErrListener = (_b = options === null || options === void 0 ? void 0 : options.listeners) === null || _b === void 0 ? void 0 : _b.stderr;
        const stdErrListener = (data) => {
            stderr += stderrDecoder.write(data);
            if (originalStdErrListener) {
                originalStdErrListener(data);
            }
        };
        const stdOutListener = (data) => {
            stdout += stdoutDecoder.write(data);
            if (originalStdoutListener) {
                originalStdoutListener(data);
            }
        };
        const listeners = Object.assign(Object.assign({}, options === null || options === void 0 ? void 0 : options.listeners), { stdout: stdOutListener, stderr: stdErrListener });
        const exitCode = yield exec(commandLine, args, Object.assign(Object.assign({}, options), { listeners }));
        //flush any remaining characters
        stdout += stdoutDecoder.end();
        stderr += stderrDecoder.end();
        return {
            exitCode,
            stdout,
            stderr
        };
    });
}
exports.getExecOutput = getExecOutput;
//# sourceMappingURL=exec.js.map

/***/ }),

/***/ 8159:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.argStringToArray = exports.ToolRunner = void 0;
const os = __importStar(__nccwpck_require__(2037));
const events = __importStar(__nccwpck_require__(2361));
const child = __importStar(__nccwpck_require__(2081));
const path = __importStar(__nccwpck_require__(1017));
const io = __importStar(__nccwpck_require__(7436));
const ioUtil = __importStar(__nccwpck_require__(1962));
const timers_1 = __nccwpck_require__(9512);
/* eslint-disable @typescript-eslint/unbound-method */
const IS_WINDOWS = process.platform === 'win32';
/*
 * Class for running command line tools. Handles quoting and arg parsing in a platform agnostic way.
 */
class ToolRunner extends events.EventEmitter {
    constructor(toolPath, args, options) {
        super();
        if (!toolPath) {
            throw new Error("Parameter 'toolPath' cannot be null or empty.");
        }
        this.toolPath = toolPath;
        this.args = args || [];
        this.options = options || {};
    }
    _debug(message) {
        if (this.options.listeners && this.options.listeners.debug) {
            this.options.listeners.debug(message);
        }
    }
    _getCommandString(options, noPrefix) {
        const toolPath = this._getSpawnFileName();
        const args = this._getSpawnArgs(options);
        let cmd = noPrefix ? '' : '[command]'; // omit prefix when piped to a second tool
        if (IS_WINDOWS) {
            // Windows + cmd file
            if (this._isCmdFile()) {
                cmd += toolPath;
                for (const a of args) {
                    cmd += ` ${a}`;
                }
            }
            // Windows + verbatim
            else if (options.windowsVerbatimArguments) {
                cmd += `"${toolPath}"`;
                for (const a of args) {
                    cmd += ` ${a}`;
                }
            }
            // Windows (regular)
            else {
                cmd += this._windowsQuoteCmdArg(toolPath);
                for (const a of args) {
                    cmd += ` ${this._windowsQuoteCmdArg(a)}`;
                }
            }
        }
        else {
            // OSX/Linux - this can likely be improved with some form of quoting.
            // creating processes on Unix is fundamentally different than Windows.
            // on Unix, execvp() takes an arg array.
            cmd += toolPath;
            for (const a of args) {
                cmd += ` ${a}`;
            }
        }
        return cmd;
    }
    _processLineBuffer(data, strBuffer, onLine) {
        try {
            let s = strBuffer + data.toString();
            let n = s.indexOf(os.EOL);
            while (n > -1) {
                const line = s.substring(0, n);
                onLine(line);
                // the rest of the string ...
                s = s.substring(n + os.EOL.length);
                n = s.indexOf(os.EOL);
            }
            return s;
        }
        catch (err) {
            // streaming lines to console is best effort.  Don't fail a build.
            this._debug(`error processing line. Failed with error ${err}`);
            return '';
        }
    }
    _getSpawnFileName() {
        if (IS_WINDOWS) {
            if (this._isCmdFile()) {
                return process.env['COMSPEC'] || 'cmd.exe';
            }
        }
        return this.toolPath;
    }
    _getSpawnArgs(options) {
        if (IS_WINDOWS) {
            if (this._isCmdFile()) {
                let argline = `/D /S /C "${this._windowsQuoteCmdArg(this.toolPath)}`;
                for (const a of this.args) {
                    argline += ' ';
                    argline += options.windowsVerbatimArguments
                        ? a
                        : this._windowsQuoteCmdArg(a);
                }
                argline += '"';
                return [argline];
            }
        }
        return this.args;
    }
    _endsWith(str, end) {
        return str.endsWith(end);
    }
    _isCmdFile() {
        const upperToolPath = this.toolPath.toUpperCase();
        return (this._endsWith(upperToolPath, '.CMD') ||
            this._endsWith(upperToolPath, '.BAT'));
    }
    _windowsQuoteCmdArg(arg) {
        // for .exe, apply the normal quoting rules that libuv applies
        if (!this._isCmdFile()) {
            return this._uvQuoteCmdArg(arg);
        }
        // otherwise apply quoting rules specific to the cmd.exe command line parser.
        // the libuv rules are generic and are not designed specifically for cmd.exe
        // command line parser.
        //
        // for a detailed description of the cmd.exe command line parser, refer to
        // http://stackoverflow.com/questions/4094699/how-does-the-windows-command-interpreter-cmd-exe-parse-scripts/7970912#7970912
        // need quotes for empty arg
        if (!arg) {
            return '""';
        }
        // determine whether the arg needs to be quoted
        const cmdSpecialChars = [
            ' ',
            '\t',
            '&',
            '(',
            ')',
            '[',
            ']',
            '{',
            '}',
            '^',
            '=',
            ';',
            '!',
            "'",
            '+',
            ',',
            '`',
            '~',
            '|',
            '<',
            '>',
            '"'
        ];
        let needsQuotes = false;
        for (const char of arg) {
            if (cmdSpecialChars.some(x => x === char)) {
                needsQuotes = true;
                break;
            }
        }
        // short-circuit if quotes not needed
        if (!needsQuotes) {
            return arg;
        }
        // the following quoting rules are very similar to the rules that by libuv applies.
        //
        // 1) wrap the string in quotes
        //
        // 2) double-up quotes - i.e. " => ""
        //
        //    this is different from the libuv quoting rules. libuv replaces " with \", which unfortunately
        //    doesn't work well with a cmd.exe command line.
        //
        //    note, replacing " with "" also works well if the arg is passed to a downstream .NET console app.
        //    for example, the command line:
        //          foo.exe "myarg:""my val"""
        //    is parsed by a .NET console app into an arg array:
        //          [ "myarg:\"my val\"" ]
        //    which is the same end result when applying libuv quoting rules. although the actual
        //    command line from libuv quoting rules would look like:
        //          foo.exe "myarg:\"my val\""
        //
        // 3) double-up slashes that precede a quote,
        //    e.g.  hello \world    => "hello \world"
        //          hello\"world    => "hello\\""world"
        //          hello\\"world   => "hello\\\\""world"
        //          hello world\    => "hello world\\"
        //
        //    technically this is not required for a cmd.exe command line, or the batch argument parser.
        //    the reasons for including this as a .cmd quoting rule are:
        //
        //    a) this is optimized for the scenario where the argument is passed from the .cmd file to an
        //       external program. many programs (e.g. .NET console apps) rely on the slash-doubling rule.
        //
        //    b) it's what we've been doing previously (by deferring to node default behavior) and we
        //       haven't heard any complaints about that aspect.
        //
        // note, a weakness of the quoting rules chosen here, is that % is not escaped. in fact, % cannot be
        // escaped when used on the command line directly - even though within a .cmd file % can be escaped
        // by using %%.
        //
        // the saving grace is, on the command line, %var% is left as-is if var is not defined. this contrasts
        // the line parsing rules within a .cmd file, where if var is not defined it is replaced with nothing.
        //
        // one option that was explored was replacing % with ^% - i.e. %var% => ^%var^%. this hack would
        // often work, since it is unlikely that var^ would exist, and the ^ character is removed when the
        // variable is used. the problem, however, is that ^ is not removed when %* is used to pass the args
        // to an external program.
        //
        // an unexplored potential solution for the % escaping problem, is to create a wrapper .cmd file.
        // % can be escaped within a .cmd file.
        let reverse = '"';
        let quoteHit = true;
        for (let i = arg.length; i > 0; i--) {
            // walk the string in reverse
            reverse += arg[i - 1];
            if (quoteHit && arg[i - 1] === '\\') {
                reverse += '\\'; // double the slash
            }
            else if (arg[i - 1] === '"') {
                quoteHit = true;
                reverse += '"'; // double the quote
            }
            else {
                quoteHit = false;
            }
        }
        reverse += '"';
        return reverse
            .split('')
            .reverse()
            .join('');
    }
    _uvQuoteCmdArg(arg) {
        // Tool runner wraps child_process.spawn() and needs to apply the same quoting as
        // Node in certain cases where the undocumented spawn option windowsVerbatimArguments
        // is used.
        //
        // Since this function is a port of quote_cmd_arg from Node 4.x (technically, lib UV,
        // see https://github.com/nodejs/node/blob/v4.x/deps/uv/src/win/process.c for details),
        // pasting copyright notice from Node within this function:
        //
        //      Copyright Joyent, Inc. and other Node contributors. All rights reserved.
        //
        //      Permission is hereby granted, free of charge, to any person obtaining a copy
        //      of this software and associated documentation files (the "Software"), to
        //      deal in the Software without restriction, including without limitation the
        //      rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
        //      sell copies of the Software, and to permit persons to whom the Software is
        //      furnished to do so, subject to the following conditions:
        //
        //      The above copyright notice and this permission notice shall be included in
        //      all copies or substantial portions of the Software.
        //
        //      THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
        //      IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
        //      FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
        //      AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
        //      LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
        //      FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
        //      IN THE SOFTWARE.
        if (!arg) {
            // Need double quotation for empty argument
            return '""';
        }
        if (!arg.includes(' ') && !arg.includes('\t') && !arg.includes('"')) {
            // No quotation needed
            return arg;
        }
        if (!arg.includes('"') && !arg.includes('\\')) {
            // No embedded double quotes or backslashes, so I can just wrap
            // quote marks around the whole thing.
            return `"${arg}"`;
        }
        // Expected input/output:
        //   input : hello"world
        //   output: "hello\"world"
        //   input : hello""world
        //   output: "hello\"\"world"
        //   input : hello\world
        //   output: hello\world
        //   input : hello\\world
        //   output: hello\\world
        //   input : hello\"world
        //   output: "hello\\\"world"
        //   input : hello\\"world
        //   output: "hello\\\\\"world"
        //   input : hello world\
        //   output: "hello world\\" - note the comment in libuv actually reads "hello world\"
        //                             but it appears the comment is wrong, it should be "hello world\\"
        let reverse = '"';
        let quoteHit = true;
        for (let i = arg.length; i > 0; i--) {
            // walk the string in reverse
            reverse += arg[i - 1];
            if (quoteHit && arg[i - 1] === '\\') {
                reverse += '\\';
            }
            else if (arg[i - 1] === '"') {
                quoteHit = true;
                reverse += '\\';
            }
            else {
                quoteHit = false;
            }
        }
        reverse += '"';
        return reverse
            .split('')
            .reverse()
            .join('');
    }
    _cloneExecOptions(options) {
        options = options || {};
        const result = {
            cwd: options.cwd || process.cwd(),
            env: options.env || process.env,
            silent: options.silent || false,
            windowsVerbatimArguments: options.windowsVerbatimArguments || false,
            failOnStdErr: options.failOnStdErr || false,
            ignoreReturnCode: options.ignoreReturnCode || false,
            delay: options.delay || 10000
        };
        result.outStream = options.outStream || process.stdout;
        result.errStream = options.errStream || process.stderr;
        return result;
    }
    _getSpawnOptions(options, toolPath) {
        options = options || {};
        const result = {};
        result.cwd = options.cwd;
        result.env = options.env;
        result['windowsVerbatimArguments'] =
            options.windowsVerbatimArguments || this._isCmdFile();
        if (options.windowsVerbatimArguments) {
            result.argv0 = `"${toolPath}"`;
        }
        return result;
    }
    /**
     * Exec a tool.
     * Output will be streamed to the live console.
     * Returns promise with return code
     *
     * @param     tool     path to tool to exec
     * @param     options  optional exec options.  See ExecOptions
     * @returns   number
     */
    exec() {
        return __awaiter(this, void 0, void 0, function* () {
            // root the tool path if it is unrooted and contains relative pathing
            if (!ioUtil.isRooted(this.toolPath) &&
                (this.toolPath.includes('/') ||
                    (IS_WINDOWS && this.toolPath.includes('\\')))) {
                // prefer options.cwd if it is specified, however options.cwd may also need to be rooted
                this.toolPath = path.resolve(process.cwd(), this.options.cwd || process.cwd(), this.toolPath);
            }
            // if the tool is only a file name, then resolve it from the PATH
            // otherwise verify it exists (add extension on Windows if necessary)
            this.toolPath = yield io.which(this.toolPath, true);
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                this._debug(`exec tool: ${this.toolPath}`);
                this._debug('arguments:');
                for (const arg of this.args) {
                    this._debug(`   ${arg}`);
                }
                const optionsNonNull = this._cloneExecOptions(this.options);
                if (!optionsNonNull.silent && optionsNonNull.outStream) {
                    optionsNonNull.outStream.write(this._getCommandString(optionsNonNull) + os.EOL);
                }
                const state = new ExecState(optionsNonNull, this.toolPath);
                state.on('debug', (message) => {
                    this._debug(message);
                });
                if (this.options.cwd && !(yield ioUtil.exists(this.options.cwd))) {
                    return reject(new Error(`The cwd: ${this.options.cwd} does not exist!`));
                }
                const fileName = this._getSpawnFileName();
                const cp = child.spawn(fileName, this._getSpawnArgs(optionsNonNull), this._getSpawnOptions(this.options, fileName));
                let stdbuffer = '';
                if (cp.stdout) {
                    cp.stdout.on('data', (data) => {
                        if (this.options.listeners && this.options.listeners.stdout) {
                            this.options.listeners.stdout(data);
                        }
                        if (!optionsNonNull.silent && optionsNonNull.outStream) {
                            optionsNonNull.outStream.write(data);
                        }
                        stdbuffer = this._processLineBuffer(data, stdbuffer, (line) => {
                            if (this.options.listeners && this.options.listeners.stdline) {
                                this.options.listeners.stdline(line);
                            }
                        });
                    });
                }
                let errbuffer = '';
                if (cp.stderr) {
                    cp.stderr.on('data', (data) => {
                        state.processStderr = true;
                        if (this.options.listeners && this.options.listeners.stderr) {
                            this.options.listeners.stderr(data);
                        }
                        if (!optionsNonNull.silent &&
                            optionsNonNull.errStream &&
                            optionsNonNull.outStream) {
                            const s = optionsNonNull.failOnStdErr
                                ? optionsNonNull.errStream
                                : optionsNonNull.outStream;
                            s.write(data);
                        }
                        errbuffer = this._processLineBuffer(data, errbuffer, (line) => {
                            if (this.options.listeners && this.options.listeners.errline) {
                                this.options.listeners.errline(line);
                            }
                        });
                    });
                }
                cp.on('error', (err) => {
                    state.processError = err.message;
                    state.processExited = true;
                    state.processClosed = true;
                    state.CheckComplete();
                });
                cp.on('exit', (code) => {
                    state.processExitCode = code;
                    state.processExited = true;
                    this._debug(`Exit code ${code} received from tool '${this.toolPath}'`);
                    state.CheckComplete();
                });
                cp.on('close', (code) => {
                    state.processExitCode = code;
                    state.processExited = true;
                    state.processClosed = true;
                    this._debug(`STDIO streams have closed for tool '${this.toolPath}'`);
                    state.CheckComplete();
                });
                state.on('done', (error, exitCode) => {
                    if (stdbuffer.length > 0) {
                        this.emit('stdline', stdbuffer);
                    }
                    if (errbuffer.length > 0) {
                        this.emit('errline', errbuffer);
                    }
                    cp.removeAllListeners();
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve(exitCode);
                    }
                });
                if (this.options.input) {
                    if (!cp.stdin) {
                        throw new Error('child process missing stdin');
                    }
                    cp.stdin.end(this.options.input);
                }
            }));
        });
    }
}
exports.ToolRunner = ToolRunner;
/**
 * Convert an arg string to an array of args. Handles escaping
 *
 * @param    argString   string of arguments
 * @returns  string[]    array of arguments
 */
function argStringToArray(argString) {
    const args = [];
    let inQuotes = false;
    let escaped = false;
    let arg = '';
    function append(c) {
        // we only escape double quotes.
        if (escaped && c !== '"') {
            arg += '\\';
        }
        arg += c;
        escaped = false;
    }
    for (let i = 0; i < argString.length; i++) {
        const c = argString.charAt(i);
        if (c === '"') {
            if (!escaped) {
                inQuotes = !inQuotes;
            }
            else {
                append(c);
            }
            continue;
        }
        if (c === '\\' && escaped) {
            append(c);
            continue;
        }
        if (c === '\\' && inQuotes) {
            escaped = true;
            continue;
        }
        if (c === ' ' && !inQuotes) {
            if (arg.length > 0) {
                args.push(arg);
                arg = '';
            }
            continue;
        }
        append(c);
    }
    if (arg.length > 0) {
        args.push(arg.trim());
    }
    return args;
}
exports.argStringToArray = argStringToArray;
class ExecState extends events.EventEmitter {
    constructor(options, toolPath) {
        super();
        this.processClosed = false; // tracks whether the process has exited and stdio is closed
        this.processError = '';
        this.processExitCode = 0;
        this.processExited = false; // tracks whether the process has exited
        this.processStderr = false; // tracks whether stderr was written to
        this.delay = 10000; // 10 seconds
        this.done = false;
        this.timeout = null;
        if (!toolPath) {
            throw new Error('toolPath must not be empty');
        }
        this.options = options;
        this.toolPath = toolPath;
        if (options.delay) {
            this.delay = options.delay;
        }
    }
    CheckComplete() {
        if (this.done) {
            return;
        }
        if (this.processClosed) {
            this._setResult();
        }
        else if (this.processExited) {
            this.timeout = timers_1.setTimeout(ExecState.HandleTimeout, this.delay, this);
        }
    }
    _debug(message) {
        this.emit('debug', message);
    }
    _setResult() {
        // determine whether there is an error
        let error;
        if (this.processExited) {
            if (this.processError) {
                error = new Error(`There was an error when attempting to execute the process '${this.toolPath}'. This may indicate the process failed to start. Error: ${this.processError}`);
            }
            else if (this.processExitCode !== 0 && !this.options.ignoreReturnCode) {
                error = new Error(`The process '${this.toolPath}' failed with exit code ${this.processExitCode}`);
            }
            else if (this.processStderr && this.options.failOnStdErr) {
                error = new Error(`The process '${this.toolPath}' failed because one or more lines were written to the STDERR stream`);
            }
        }
        // clear the timeout
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
        this.done = true;
        this.emit('done', error, this.processExitCode);
    }
    static HandleTimeout(state) {
        if (state.done) {
            return;
        }
        if (!state.processClosed && state.processExited) {
            const message = `The STDIO streams did not close within ${state.delay /
                1000} seconds of the exit event from process '${state.toolPath}'. This may indicate a child process inherited the STDIO streams and has not yet exited.`;
            state._debug(message);
        }
        state._setResult();
    }
}
//# sourceMappingURL=toolrunner.js.map

/***/ }),

/***/ 5526:
/***/ (function(__unused_webpack_module, exports) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PersonalAccessTokenCredentialHandler = exports.BearerCredentialHandler = exports.BasicCredentialHandler = void 0;
class BasicCredentialHandler {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Basic ${Buffer.from(`${this.username}:${this.password}`).toString('base64')}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.BasicCredentialHandler = BasicCredentialHandler;
class BearerCredentialHandler {
    constructor(token) {
        this.token = token;
    }
    // currently implements pre-authorization
    // TODO: support preAuth = false where it hooks on 401
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Bearer ${this.token}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.BearerCredentialHandler = BearerCredentialHandler;
class PersonalAccessTokenCredentialHandler {
    constructor(token) {
        this.token = token;
    }
    // currently implements pre-authorization
    // TODO: support preAuth = false where it hooks on 401
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Basic ${Buffer.from(`PAT:${this.token}`).toString('base64')}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.PersonalAccessTokenCredentialHandler = PersonalAccessTokenCredentialHandler;
//# sourceMappingURL=auth.js.map

/***/ }),

/***/ 6255:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

/* eslint-disable @typescript-eslint/no-explicit-any */
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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HttpClient = exports.isHttps = exports.HttpClientResponse = exports.HttpClientError = exports.getProxyUrl = exports.MediaTypes = exports.Headers = exports.HttpCodes = void 0;
const http = __importStar(__nccwpck_require__(3685));
const https = __importStar(__nccwpck_require__(5687));
const pm = __importStar(__nccwpck_require__(9835));
const tunnel = __importStar(__nccwpck_require__(4294));
var HttpCodes;
(function (HttpCodes) {
    HttpCodes[HttpCodes["OK"] = 200] = "OK";
    HttpCodes[HttpCodes["MultipleChoices"] = 300] = "MultipleChoices";
    HttpCodes[HttpCodes["MovedPermanently"] = 301] = "MovedPermanently";
    HttpCodes[HttpCodes["ResourceMoved"] = 302] = "ResourceMoved";
    HttpCodes[HttpCodes["SeeOther"] = 303] = "SeeOther";
    HttpCodes[HttpCodes["NotModified"] = 304] = "NotModified";
    HttpCodes[HttpCodes["UseProxy"] = 305] = "UseProxy";
    HttpCodes[HttpCodes["SwitchProxy"] = 306] = "SwitchProxy";
    HttpCodes[HttpCodes["TemporaryRedirect"] = 307] = "TemporaryRedirect";
    HttpCodes[HttpCodes["PermanentRedirect"] = 308] = "PermanentRedirect";
    HttpCodes[HttpCodes["BadRequest"] = 400] = "BadRequest";
    HttpCodes[HttpCodes["Unauthorized"] = 401] = "Unauthorized";
    HttpCodes[HttpCodes["PaymentRequired"] = 402] = "PaymentRequired";
    HttpCodes[HttpCodes["Forbidden"] = 403] = "Forbidden";
    HttpCodes[HttpCodes["NotFound"] = 404] = "NotFound";
    HttpCodes[HttpCodes["MethodNotAllowed"] = 405] = "MethodNotAllowed";
    HttpCodes[HttpCodes["NotAcceptable"] = 406] = "NotAcceptable";
    HttpCodes[HttpCodes["ProxyAuthenticationRequired"] = 407] = "ProxyAuthenticationRequired";
    HttpCodes[HttpCodes["RequestTimeout"] = 408] = "RequestTimeout";
    HttpCodes[HttpCodes["Conflict"] = 409] = "Conflict";
    HttpCodes[HttpCodes["Gone"] = 410] = "Gone";
    HttpCodes[HttpCodes["TooManyRequests"] = 429] = "TooManyRequests";
    HttpCodes[HttpCodes["InternalServerError"] = 500] = "InternalServerError";
    HttpCodes[HttpCodes["NotImplemented"] = 501] = "NotImplemented";
    HttpCodes[HttpCodes["BadGateway"] = 502] = "BadGateway";
    HttpCodes[HttpCodes["ServiceUnavailable"] = 503] = "ServiceUnavailable";
    HttpCodes[HttpCodes["GatewayTimeout"] = 504] = "GatewayTimeout";
})(HttpCodes = exports.HttpCodes || (exports.HttpCodes = {}));
var Headers;
(function (Headers) {
    Headers["Accept"] = "accept";
    Headers["ContentType"] = "content-type";
})(Headers = exports.Headers || (exports.Headers = {}));
var MediaTypes;
(function (MediaTypes) {
    MediaTypes["ApplicationJson"] = "application/json";
})(MediaTypes = exports.MediaTypes || (exports.MediaTypes = {}));
/**
 * Returns the proxy URL, depending upon the supplied url and proxy environment variables.
 * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
 */
function getProxyUrl(serverUrl) {
    const proxyUrl = pm.getProxyUrl(new URL(serverUrl));
    return proxyUrl ? proxyUrl.href : '';
}
exports.getProxyUrl = getProxyUrl;
const HttpRedirectCodes = [
    HttpCodes.MovedPermanently,
    HttpCodes.ResourceMoved,
    HttpCodes.SeeOther,
    HttpCodes.TemporaryRedirect,
    HttpCodes.PermanentRedirect
];
const HttpResponseRetryCodes = [
    HttpCodes.BadGateway,
    HttpCodes.ServiceUnavailable,
    HttpCodes.GatewayTimeout
];
const RetryableHttpVerbs = ['OPTIONS', 'GET', 'DELETE', 'HEAD'];
const ExponentialBackoffCeiling = 10;
const ExponentialBackoffTimeSlice = 5;
class HttpClientError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = 'HttpClientError';
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, HttpClientError.prototype);
    }
}
exports.HttpClientError = HttpClientError;
class HttpClientResponse {
    constructor(message) {
        this.message = message;
    }
    readBody() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                let output = Buffer.alloc(0);
                this.message.on('data', (chunk) => {
                    output = Buffer.concat([output, chunk]);
                });
                this.message.on('end', () => {
                    resolve(output.toString());
                });
            }));
        });
    }
    readBodyBuffer() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                const chunks = [];
                this.message.on('data', (chunk) => {
                    chunks.push(chunk);
                });
                this.message.on('end', () => {
                    resolve(Buffer.concat(chunks));
                });
            }));
        });
    }
}
exports.HttpClientResponse = HttpClientResponse;
function isHttps(requestUrl) {
    const parsedUrl = new URL(requestUrl);
    return parsedUrl.protocol === 'https:';
}
exports.isHttps = isHttps;
class HttpClient {
    constructor(userAgent, handlers, requestOptions) {
        this._ignoreSslError = false;
        this._allowRedirects = true;
        this._allowRedirectDowngrade = false;
        this._maxRedirects = 50;
        this._allowRetries = false;
        this._maxRetries = 1;
        this._keepAlive = false;
        this._disposed = false;
        this.userAgent = userAgent;
        this.handlers = handlers || [];
        this.requestOptions = requestOptions;
        if (requestOptions) {
            if (requestOptions.ignoreSslError != null) {
                this._ignoreSslError = requestOptions.ignoreSslError;
            }
            this._socketTimeout = requestOptions.socketTimeout;
            if (requestOptions.allowRedirects != null) {
                this._allowRedirects = requestOptions.allowRedirects;
            }
            if (requestOptions.allowRedirectDowngrade != null) {
                this._allowRedirectDowngrade = requestOptions.allowRedirectDowngrade;
            }
            if (requestOptions.maxRedirects != null) {
                this._maxRedirects = Math.max(requestOptions.maxRedirects, 0);
            }
            if (requestOptions.keepAlive != null) {
                this._keepAlive = requestOptions.keepAlive;
            }
            if (requestOptions.allowRetries != null) {
                this._allowRetries = requestOptions.allowRetries;
            }
            if (requestOptions.maxRetries != null) {
                this._maxRetries = requestOptions.maxRetries;
            }
        }
    }
    options(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('OPTIONS', requestUrl, null, additionalHeaders || {});
        });
    }
    get(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('GET', requestUrl, null, additionalHeaders || {});
        });
    }
    del(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('DELETE', requestUrl, null, additionalHeaders || {});
        });
    }
    post(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('POST', requestUrl, data, additionalHeaders || {});
        });
    }
    patch(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('PATCH', requestUrl, data, additionalHeaders || {});
        });
    }
    put(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('PUT', requestUrl, data, additionalHeaders || {});
        });
    }
    head(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('HEAD', requestUrl, null, additionalHeaders || {});
        });
    }
    sendStream(verb, requestUrl, stream, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request(verb, requestUrl, stream, additionalHeaders);
        });
    }
    /**
     * Gets a typed object from an endpoint
     * Be aware that not found returns a null.  Other errors (4xx, 5xx) reject the promise
     */
    getJson(requestUrl, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            const res = yield this.get(requestUrl, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    postJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.post(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    putJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.put(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    patchJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.patch(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    /**
     * Makes a raw http request.
     * All other methods such as get, post, patch, and request ultimately call this.
     * Prefer get, del, post and patch
     */
    request(verb, requestUrl, data, headers) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._disposed) {
                throw new Error('Client has already been disposed.');
            }
            const parsedUrl = new URL(requestUrl);
            let info = this._prepareRequest(verb, parsedUrl, headers);
            // Only perform retries on reads since writes may not be idempotent.
            const maxTries = this._allowRetries && RetryableHttpVerbs.includes(verb)
                ? this._maxRetries + 1
                : 1;
            let numTries = 0;
            let response;
            do {
                response = yield this.requestRaw(info, data);
                // Check if it's an authentication challenge
                if (response &&
                    response.message &&
                    response.message.statusCode === HttpCodes.Unauthorized) {
                    let authenticationHandler;
                    for (const handler of this.handlers) {
                        if (handler.canHandleAuthentication(response)) {
                            authenticationHandler = handler;
                            break;
                        }
                    }
                    if (authenticationHandler) {
                        return authenticationHandler.handleAuthentication(this, info, data);
                    }
                    else {
                        // We have received an unauthorized response but have no handlers to handle it.
                        // Let the response return to the caller.
                        return response;
                    }
                }
                let redirectsRemaining = this._maxRedirects;
                while (response.message.statusCode &&
                    HttpRedirectCodes.includes(response.message.statusCode) &&
                    this._allowRedirects &&
                    redirectsRemaining > 0) {
                    const redirectUrl = response.message.headers['location'];
                    if (!redirectUrl) {
                        // if there's no location to redirect to, we won't
                        break;
                    }
                    const parsedRedirectUrl = new URL(redirectUrl);
                    if (parsedUrl.protocol === 'https:' &&
                        parsedUrl.protocol !== parsedRedirectUrl.protocol &&
                        !this._allowRedirectDowngrade) {
                        throw new Error('Redirect from HTTPS to HTTP protocol. This downgrade is not allowed for security reasons. If you want to allow this behavior, set the allowRedirectDowngrade option to true.');
                    }
                    // we need to finish reading the response before reassigning response
                    // which will leak the open socket.
                    yield response.readBody();
                    // strip authorization header if redirected to a different hostname
                    if (parsedRedirectUrl.hostname !== parsedUrl.hostname) {
                        for (const header in headers) {
                            // header names are case insensitive
                            if (header.toLowerCase() === 'authorization') {
                                delete headers[header];
                            }
                        }
                    }
                    // let's make the request with the new redirectUrl
                    info = this._prepareRequest(verb, parsedRedirectUrl, headers);
                    response = yield this.requestRaw(info, data);
                    redirectsRemaining--;
                }
                if (!response.message.statusCode ||
                    !HttpResponseRetryCodes.includes(response.message.statusCode)) {
                    // If not a retry code, return immediately instead of retrying
                    return response;
                }
                numTries += 1;
                if (numTries < maxTries) {
                    yield response.readBody();
                    yield this._performExponentialBackoff(numTries);
                }
            } while (numTries < maxTries);
            return response;
        });
    }
    /**
     * Needs to be called if keepAlive is set to true in request options.
     */
    dispose() {
        if (this._agent) {
            this._agent.destroy();
        }
        this._disposed = true;
    }
    /**
     * Raw request.
     * @param info
     * @param data
     */
    requestRaw(info, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                function callbackForResult(err, res) {
                    if (err) {
                        reject(err);
                    }
                    else if (!res) {
                        // If `err` is not passed, then `res` must be passed.
                        reject(new Error('Unknown error'));
                    }
                    else {
                        resolve(res);
                    }
                }
                this.requestRawWithCallback(info, data, callbackForResult);
            });
        });
    }
    /**
     * Raw request with callback.
     * @param info
     * @param data
     * @param onResult
     */
    requestRawWithCallback(info, data, onResult) {
        if (typeof data === 'string') {
            if (!info.options.headers) {
                info.options.headers = {};
            }
            info.options.headers['Content-Length'] = Buffer.byteLength(data, 'utf8');
        }
        let callbackCalled = false;
        function handleResult(err, res) {
            if (!callbackCalled) {
                callbackCalled = true;
                onResult(err, res);
            }
        }
        const req = info.httpModule.request(info.options, (msg) => {
            const res = new HttpClientResponse(msg);
            handleResult(undefined, res);
        });
        let socket;
        req.on('socket', sock => {
            socket = sock;
        });
        // If we ever get disconnected, we want the socket to timeout eventually
        req.setTimeout(this._socketTimeout || 3 * 60000, () => {
            if (socket) {
                socket.end();
            }
            handleResult(new Error(`Request timeout: ${info.options.path}`));
        });
        req.on('error', function (err) {
            // err has statusCode property
            // res should have headers
            handleResult(err);
        });
        if (data && typeof data === 'string') {
            req.write(data, 'utf8');
        }
        if (data && typeof data !== 'string') {
            data.on('close', function () {
                req.end();
            });
            data.pipe(req);
        }
        else {
            req.end();
        }
    }
    /**
     * Gets an http agent. This function is useful when you need an http agent that handles
     * routing through a proxy server - depending upon the url and proxy environment variables.
     * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
     */
    getAgent(serverUrl) {
        const parsedUrl = new URL(serverUrl);
        return this._getAgent(parsedUrl);
    }
    _prepareRequest(method, requestUrl, headers) {
        const info = {};
        info.parsedUrl = requestUrl;
        const usingSsl = info.parsedUrl.protocol === 'https:';
        info.httpModule = usingSsl ? https : http;
        const defaultPort = usingSsl ? 443 : 80;
        info.options = {};
        info.options.host = info.parsedUrl.hostname;
        info.options.port = info.parsedUrl.port
            ? parseInt(info.parsedUrl.port)
            : defaultPort;
        info.options.path =
            (info.parsedUrl.pathname || '') + (info.parsedUrl.search || '');
        info.options.method = method;
        info.options.headers = this._mergeHeaders(headers);
        if (this.userAgent != null) {
            info.options.headers['user-agent'] = this.userAgent;
        }
        info.options.agent = this._getAgent(info.parsedUrl);
        // gives handlers an opportunity to participate
        if (this.handlers) {
            for (const handler of this.handlers) {
                handler.prepareRequest(info.options);
            }
        }
        return info;
    }
    _mergeHeaders(headers) {
        if (this.requestOptions && this.requestOptions.headers) {
            return Object.assign({}, lowercaseKeys(this.requestOptions.headers), lowercaseKeys(headers || {}));
        }
        return lowercaseKeys(headers || {});
    }
    _getExistingOrDefaultHeader(additionalHeaders, header, _default) {
        let clientHeader;
        if (this.requestOptions && this.requestOptions.headers) {
            clientHeader = lowercaseKeys(this.requestOptions.headers)[header];
        }
        return additionalHeaders[header] || clientHeader || _default;
    }
    _getAgent(parsedUrl) {
        let agent;
        const proxyUrl = pm.getProxyUrl(parsedUrl);
        const useProxy = proxyUrl && proxyUrl.hostname;
        if (this._keepAlive && useProxy) {
            agent = this._proxyAgent;
        }
        if (this._keepAlive && !useProxy) {
            agent = this._agent;
        }
        // if agent is already assigned use that agent.
        if (agent) {
            return agent;
        }
        const usingSsl = parsedUrl.protocol === 'https:';
        let maxSockets = 100;
        if (this.requestOptions) {
            maxSockets = this.requestOptions.maxSockets || http.globalAgent.maxSockets;
        }
        // This is `useProxy` again, but we need to check `proxyURl` directly for TypeScripts's flow analysis.
        if (proxyUrl && proxyUrl.hostname) {
            const agentOptions = {
                maxSockets,
                keepAlive: this._keepAlive,
                proxy: Object.assign(Object.assign({}, ((proxyUrl.username || proxyUrl.password) && {
                    proxyAuth: `${proxyUrl.username}:${proxyUrl.password}`
                })), { host: proxyUrl.hostname, port: proxyUrl.port })
            };
            let tunnelAgent;
            const overHttps = proxyUrl.protocol === 'https:';
            if (usingSsl) {
                tunnelAgent = overHttps ? tunnel.httpsOverHttps : tunnel.httpsOverHttp;
            }
            else {
                tunnelAgent = overHttps ? tunnel.httpOverHttps : tunnel.httpOverHttp;
            }
            agent = tunnelAgent(agentOptions);
            this._proxyAgent = agent;
        }
        // if reusing agent across request and tunneling agent isn't assigned create a new agent
        if (this._keepAlive && !agent) {
            const options = { keepAlive: this._keepAlive, maxSockets };
            agent = usingSsl ? new https.Agent(options) : new http.Agent(options);
            this._agent = agent;
        }
        // if not using private agent and tunnel agent isn't setup then use global agent
        if (!agent) {
            agent = usingSsl ? https.globalAgent : http.globalAgent;
        }
        if (usingSsl && this._ignoreSslError) {
            // we don't want to set NODE_TLS_REJECT_UNAUTHORIZED=0 since that will affect request for entire process
            // http.RequestOptions doesn't expose a way to modify RequestOptions.agent.options
            // we have to cast it to any and change it directly
            agent.options = Object.assign(agent.options || {}, {
                rejectUnauthorized: false
            });
        }
        return agent;
    }
    _performExponentialBackoff(retryNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            retryNumber = Math.min(ExponentialBackoffCeiling, retryNumber);
            const ms = ExponentialBackoffTimeSlice * Math.pow(2, retryNumber);
            return new Promise(resolve => setTimeout(() => resolve(), ms));
        });
    }
    _processResponse(res, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const statusCode = res.message.statusCode || 0;
                const response = {
                    statusCode,
                    result: null,
                    headers: {}
                };
                // not found leads to null obj returned
                if (statusCode === HttpCodes.NotFound) {
                    resolve(response);
                }
                // get the result from the body
                function dateTimeDeserializer(key, value) {
                    if (typeof value === 'string') {
                        const a = new Date(value);
                        if (!isNaN(a.valueOf())) {
                            return a;
                        }
                    }
                    return value;
                }
                let obj;
                let contents;
                try {
                    contents = yield res.readBody();
                    if (contents && contents.length > 0) {
                        if (options && options.deserializeDates) {
                            obj = JSON.parse(contents, dateTimeDeserializer);
                        }
                        else {
                            obj = JSON.parse(contents);
                        }
                        response.result = obj;
                    }
                    response.headers = res.message.headers;
                }
                catch (err) {
                    // Invalid resource (contents not json);  leaving result obj null
                }
                // note that 3xx redirects are handled by the http layer.
                if (statusCode > 299) {
                    let msg;
                    // if exception/error in body, attempt to get better error
                    if (obj && obj.message) {
                        msg = obj.message;
                    }
                    else if (contents && contents.length > 0) {
                        // it may be the case that the exception is in the body message as string
                        msg = contents;
                    }
                    else {
                        msg = `Failed request: (${statusCode})`;
                    }
                    const err = new HttpClientError(msg, statusCode);
                    err.result = response.result;
                    reject(err);
                }
                else {
                    resolve(response);
                }
            }));
        });
    }
}
exports.HttpClient = HttpClient;
const lowercaseKeys = (obj) => Object.keys(obj).reduce((c, k) => ((c[k.toLowerCase()] = obj[k]), c), {});
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 9835:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.checkBypass = exports.getProxyUrl = void 0;
function getProxyUrl(reqUrl) {
    const usingSsl = reqUrl.protocol === 'https:';
    if (checkBypass(reqUrl)) {
        return undefined;
    }
    const proxyVar = (() => {
        if (usingSsl) {
            return process.env['https_proxy'] || process.env['HTTPS_PROXY'];
        }
        else {
            return process.env['http_proxy'] || process.env['HTTP_PROXY'];
        }
    })();
    if (proxyVar) {
        try {
            return new URL(proxyVar);
        }
        catch (_a) {
            if (!proxyVar.startsWith('http://') && !proxyVar.startsWith('https://'))
                return new URL(`http://${proxyVar}`);
        }
    }
    else {
        return undefined;
    }
}
exports.getProxyUrl = getProxyUrl;
function checkBypass(reqUrl) {
    if (!reqUrl.hostname) {
        return false;
    }
    const reqHost = reqUrl.hostname;
    if (isLoopbackAddress(reqHost)) {
        return true;
    }
    const noProxy = process.env['no_proxy'] || process.env['NO_PROXY'] || '';
    if (!noProxy) {
        return false;
    }
    // Determine the request port
    let reqPort;
    if (reqUrl.port) {
        reqPort = Number(reqUrl.port);
    }
    else if (reqUrl.protocol === 'http:') {
        reqPort = 80;
    }
    else if (reqUrl.protocol === 'https:') {
        reqPort = 443;
    }
    // Format the request hostname and hostname with port
    const upperReqHosts = [reqUrl.hostname.toUpperCase()];
    if (typeof reqPort === 'number') {
        upperReqHosts.push(`${upperReqHosts[0]}:${reqPort}`);
    }
    // Compare request host against noproxy
    for (const upperNoProxyItem of noProxy
        .split(',')
        .map(x => x.trim().toUpperCase())
        .filter(x => x)) {
        if (upperNoProxyItem === '*' ||
            upperReqHosts.some(x => x === upperNoProxyItem ||
                x.endsWith(`.${upperNoProxyItem}`) ||
                (upperNoProxyItem.startsWith('.') &&
                    x.endsWith(`${upperNoProxyItem}`)))) {
            return true;
        }
    }
    return false;
}
exports.checkBypass = checkBypass;
function isLoopbackAddress(host) {
    const hostLower = host.toLowerCase();
    return (hostLower === 'localhost' ||
        hostLower.startsWith('127.') ||
        hostLower.startsWith('[::1]') ||
        hostLower.startsWith('[0:0:0:0:0:0:0:1]'));
}
//# sourceMappingURL=proxy.js.map

/***/ }),

/***/ 1962:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getCmdPath = exports.tryGetExecutablePath = exports.isRooted = exports.isDirectory = exports.exists = exports.READONLY = exports.UV_FS_O_EXLOCK = exports.IS_WINDOWS = exports.unlink = exports.symlink = exports.stat = exports.rmdir = exports.rm = exports.rename = exports.readlink = exports.readdir = exports.open = exports.mkdir = exports.lstat = exports.copyFile = exports.chmod = void 0;
const fs = __importStar(__nccwpck_require__(7147));
const path = __importStar(__nccwpck_require__(1017));
_a = fs.promises
// export const {open} = 'fs'
, exports.chmod = _a.chmod, exports.copyFile = _a.copyFile, exports.lstat = _a.lstat, exports.mkdir = _a.mkdir, exports.open = _a.open, exports.readdir = _a.readdir, exports.readlink = _a.readlink, exports.rename = _a.rename, exports.rm = _a.rm, exports.rmdir = _a.rmdir, exports.stat = _a.stat, exports.symlink = _a.symlink, exports.unlink = _a.unlink;
// export const {open} = 'fs'
exports.IS_WINDOWS = process.platform === 'win32';
// See https://github.com/nodejs/node/blob/d0153aee367422d0858105abec186da4dff0a0c5/deps/uv/include/uv/win.h#L691
exports.UV_FS_O_EXLOCK = 0x10000000;
exports.READONLY = fs.constants.O_RDONLY;
function exists(fsPath) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield exports.stat(fsPath);
        }
        catch (err) {
            if (err.code === 'ENOENT') {
                return false;
            }
            throw err;
        }
        return true;
    });
}
exports.exists = exists;
function isDirectory(fsPath, useStat = false) {
    return __awaiter(this, void 0, void 0, function* () {
        const stats = useStat ? yield exports.stat(fsPath) : yield exports.lstat(fsPath);
        return stats.isDirectory();
    });
}
exports.isDirectory = isDirectory;
/**
 * On OSX/Linux, true if path starts with '/'. On Windows, true for paths like:
 * \, \hello, \\hello\share, C:, and C:\hello (and corresponding alternate separator cases).
 */
function isRooted(p) {
    p = normalizeSeparators(p);
    if (!p) {
        throw new Error('isRooted() parameter "p" cannot be empty');
    }
    if (exports.IS_WINDOWS) {
        return (p.startsWith('\\') || /^[A-Z]:/i.test(p) // e.g. \ or \hello or \\hello
        ); // e.g. C: or C:\hello
    }
    return p.startsWith('/');
}
exports.isRooted = isRooted;
/**
 * Best effort attempt to determine whether a file exists and is executable.
 * @param filePath    file path to check
 * @param extensions  additional file extensions to try
 * @return if file exists and is executable, returns the file path. otherwise empty string.
 */
function tryGetExecutablePath(filePath, extensions) {
    return __awaiter(this, void 0, void 0, function* () {
        let stats = undefined;
        try {
            // test file exists
            stats = yield exports.stat(filePath);
        }
        catch (err) {
            if (err.code !== 'ENOENT') {
                // eslint-disable-next-line no-console
                console.log(`Unexpected error attempting to determine if executable file exists '${filePath}': ${err}`);
            }
        }
        if (stats && stats.isFile()) {
            if (exports.IS_WINDOWS) {
                // on Windows, test for valid extension
                const upperExt = path.extname(filePath).toUpperCase();
                if (extensions.some(validExt => validExt.toUpperCase() === upperExt)) {
                    return filePath;
                }
            }
            else {
                if (isUnixExecutable(stats)) {
                    return filePath;
                }
            }
        }
        // try each extension
        const originalFilePath = filePath;
        for (const extension of extensions) {
            filePath = originalFilePath + extension;
            stats = undefined;
            try {
                stats = yield exports.stat(filePath);
            }
            catch (err) {
                if (err.code !== 'ENOENT') {
                    // eslint-disable-next-line no-console
                    console.log(`Unexpected error attempting to determine if executable file exists '${filePath}': ${err}`);
                }
            }
            if (stats && stats.isFile()) {
                if (exports.IS_WINDOWS) {
                    // preserve the case of the actual file (since an extension was appended)
                    try {
                        const directory = path.dirname(filePath);
                        const upperName = path.basename(filePath).toUpperCase();
                        for (const actualName of yield exports.readdir(directory)) {
                            if (upperName === actualName.toUpperCase()) {
                                filePath = path.join(directory, actualName);
                                break;
                            }
                        }
                    }
                    catch (err) {
                        // eslint-disable-next-line no-console
                        console.log(`Unexpected error attempting to determine the actual case of the file '${filePath}': ${err}`);
                    }
                    return filePath;
                }
                else {
                    if (isUnixExecutable(stats)) {
                        return filePath;
                    }
                }
            }
        }
        return '';
    });
}
exports.tryGetExecutablePath = tryGetExecutablePath;
function normalizeSeparators(p) {
    p = p || '';
    if (exports.IS_WINDOWS) {
        // convert slashes on Windows
        p = p.replace(/\//g, '\\');
        // remove redundant slashes
        return p.replace(/\\\\+/g, '\\');
    }
    // remove redundant slashes
    return p.replace(/\/\/+/g, '/');
}
// on Mac/Linux, test the execute bit
//     R   W  X  R  W X R W X
//   256 128 64 32 16 8 4 2 1
function isUnixExecutable(stats) {
    return ((stats.mode & 1) > 0 ||
        ((stats.mode & 8) > 0 && stats.gid === process.getgid()) ||
        ((stats.mode & 64) > 0 && stats.uid === process.getuid()));
}
// Get the path of cmd.exe in windows
function getCmdPath() {
    var _a;
    return (_a = process.env['COMSPEC']) !== null && _a !== void 0 ? _a : `cmd.exe`;
}
exports.getCmdPath = getCmdPath;
//# sourceMappingURL=io-util.js.map

/***/ }),

/***/ 7436:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.findInPath = exports.which = exports.mkdirP = exports.rmRF = exports.mv = exports.cp = void 0;
const assert_1 = __nccwpck_require__(9491);
const path = __importStar(__nccwpck_require__(1017));
const ioUtil = __importStar(__nccwpck_require__(1962));
/**
 * Copies a file or folder.
 * Based off of shelljs - https://github.com/shelljs/shelljs/blob/9237f66c52e5daa40458f94f9565e18e8132f5a6/src/cp.js
 *
 * @param     source    source path
 * @param     dest      destination path
 * @param     options   optional. See CopyOptions.
 */
function cp(source, dest, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const { force, recursive, copySourceDirectory } = readCopyOptions(options);
        const destStat = (yield ioUtil.exists(dest)) ? yield ioUtil.stat(dest) : null;
        // Dest is an existing file, but not forcing
        if (destStat && destStat.isFile() && !force) {
            return;
        }
        // If dest is an existing directory, should copy inside.
        const newDest = destStat && destStat.isDirectory() && copySourceDirectory
            ? path.join(dest, path.basename(source))
            : dest;
        if (!(yield ioUtil.exists(source))) {
            throw new Error(`no such file or directory: ${source}`);
        }
        const sourceStat = yield ioUtil.stat(source);
        if (sourceStat.isDirectory()) {
            if (!recursive) {
                throw new Error(`Failed to copy. ${source} is a directory, but tried to copy without recursive flag.`);
            }
            else {
                yield cpDirRecursive(source, newDest, 0, force);
            }
        }
        else {
            if (path.relative(source, newDest) === '') {
                // a file cannot be copied to itself
                throw new Error(`'${newDest}' and '${source}' are the same file`);
            }
            yield copyFile(source, newDest, force);
        }
    });
}
exports.cp = cp;
/**
 * Moves a path.
 *
 * @param     source    source path
 * @param     dest      destination path
 * @param     options   optional. See MoveOptions.
 */
function mv(source, dest, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        if (yield ioUtil.exists(dest)) {
            let destExists = true;
            if (yield ioUtil.isDirectory(dest)) {
                // If dest is directory copy src into dest
                dest = path.join(dest, path.basename(source));
                destExists = yield ioUtil.exists(dest);
            }
            if (destExists) {
                if (options.force == null || options.force) {
                    yield rmRF(dest);
                }
                else {
                    throw new Error('Destination already exists');
                }
            }
        }
        yield mkdirP(path.dirname(dest));
        yield ioUtil.rename(source, dest);
    });
}
exports.mv = mv;
/**
 * Remove a path recursively with force
 *
 * @param inputPath path to remove
 */
function rmRF(inputPath) {
    return __awaiter(this, void 0, void 0, function* () {
        if (ioUtil.IS_WINDOWS) {
            // Check for invalid characters
            // https://docs.microsoft.com/en-us/windows/win32/fileio/naming-a-file
            if (/[*"<>|]/.test(inputPath)) {
                throw new Error('File path must not contain `*`, `"`, `<`, `>` or `|` on Windows');
            }
        }
        try {
            // note if path does not exist, error is silent
            yield ioUtil.rm(inputPath, {
                force: true,
                maxRetries: 3,
                recursive: true,
                retryDelay: 300
            });
        }
        catch (err) {
            throw new Error(`File was unable to be removed ${err}`);
        }
    });
}
exports.rmRF = rmRF;
/**
 * Make a directory.  Creates the full path with folders in between
 * Will throw if it fails
 *
 * @param   fsPath        path to create
 * @returns Promise<void>
 */
function mkdirP(fsPath) {
    return __awaiter(this, void 0, void 0, function* () {
        assert_1.ok(fsPath, 'a path argument must be provided');
        yield ioUtil.mkdir(fsPath, { recursive: true });
    });
}
exports.mkdirP = mkdirP;
/**
 * Returns path of a tool had the tool actually been invoked.  Resolves via paths.
 * If you check and the tool does not exist, it will throw.
 *
 * @param     tool              name of the tool
 * @param     check             whether to check if tool exists
 * @returns   Promise<string>   path to tool
 */
function which(tool, check) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!tool) {
            throw new Error("parameter 'tool' is required");
        }
        // recursive when check=true
        if (check) {
            const result = yield which(tool, false);
            if (!result) {
                if (ioUtil.IS_WINDOWS) {
                    throw new Error(`Unable to locate executable file: ${tool}. Please verify either the file path exists or the file can be found within a directory specified by the PATH environment variable. Also verify the file has a valid extension for an executable file.`);
                }
                else {
                    throw new Error(`Unable to locate executable file: ${tool}. Please verify either the file path exists or the file can be found within a directory specified by the PATH environment variable. Also check the file mode to verify the file is executable.`);
                }
            }
            return result;
        }
        const matches = yield findInPath(tool);
        if (matches && matches.length > 0) {
            return matches[0];
        }
        return '';
    });
}
exports.which = which;
/**
 * Returns a list of all occurrences of the given tool on the system path.
 *
 * @returns   Promise<string[]>  the paths of the tool
 */
function findInPath(tool) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!tool) {
            throw new Error("parameter 'tool' is required");
        }
        // build the list of extensions to try
        const extensions = [];
        if (ioUtil.IS_WINDOWS && process.env['PATHEXT']) {
            for (const extension of process.env['PATHEXT'].split(path.delimiter)) {
                if (extension) {
                    extensions.push(extension);
                }
            }
        }
        // if it's rooted, return it if exists. otherwise return empty.
        if (ioUtil.isRooted(tool)) {
            const filePath = yield ioUtil.tryGetExecutablePath(tool, extensions);
            if (filePath) {
                return [filePath];
            }
            return [];
        }
        // if any path separators, return empty
        if (tool.includes(path.sep)) {
            return [];
        }
        // build the list of directories
        //
        // Note, technically "where" checks the current directory on Windows. From a toolkit perspective,
        // it feels like we should not do this. Checking the current directory seems like more of a use
        // case of a shell, and the which() function exposed by the toolkit should strive for consistency
        // across platforms.
        const directories = [];
        if (process.env.PATH) {
            for (const p of process.env.PATH.split(path.delimiter)) {
                if (p) {
                    directories.push(p);
                }
            }
        }
        // find all matches
        const matches = [];
        for (const directory of directories) {
            const filePath = yield ioUtil.tryGetExecutablePath(path.join(directory, tool), extensions);
            if (filePath) {
                matches.push(filePath);
            }
        }
        return matches;
    });
}
exports.findInPath = findInPath;
function readCopyOptions(options) {
    const force = options.force == null ? true : options.force;
    const recursive = Boolean(options.recursive);
    const copySourceDirectory = options.copySourceDirectory == null
        ? true
        : Boolean(options.copySourceDirectory);
    return { force, recursive, copySourceDirectory };
}
function cpDirRecursive(sourceDir, destDir, currentDepth, force) {
    return __awaiter(this, void 0, void 0, function* () {
        // Ensure there is not a run away recursive copy
        if (currentDepth >= 255)
            return;
        currentDepth++;
        yield mkdirP(destDir);
        const files = yield ioUtil.readdir(sourceDir);
        for (const fileName of files) {
            const srcFile = `${sourceDir}/${fileName}`;
            const destFile = `${destDir}/${fileName}`;
            const srcFileStat = yield ioUtil.lstat(srcFile);
            if (srcFileStat.isDirectory()) {
                // Recurse
                yield cpDirRecursive(srcFile, destFile, currentDepth, force);
            }
            else {
                yield copyFile(srcFile, destFile, force);
            }
        }
        // Change the mode for the newly created directory
        yield ioUtil.chmod(destDir, (yield ioUtil.stat(sourceDir)).mode);
    });
}
// Buffered file copy
function copyFile(srcFile, destFile, force) {
    return __awaiter(this, void 0, void 0, function* () {
        if ((yield ioUtil.lstat(srcFile)).isSymbolicLink()) {
            // unlink/re-link it
            try {
                yield ioUtil.lstat(destFile);
                yield ioUtil.unlink(destFile);
            }
            catch (e) {
                // Try to override file permission
                if (e.code === 'EPERM') {
                    yield ioUtil.chmod(destFile, '0666');
                    yield ioUtil.unlink(destFile);
                }
                // other errors = it doesn't exist, no work to do
            }
            // Copy over symlink
            const symlinkFull = yield ioUtil.readlink(srcFile);
            yield ioUtil.symlink(symlinkFull, destFile, ioUtil.IS_WINDOWS ? 'junction' : null);
        }
        else if (!(yield ioUtil.exists(destFile)) || force) {
            yield ioUtil.copyFile(srcFile, destFile);
        }
    });
}
//# sourceMappingURL=io.js.map

/***/ }),

/***/ 354:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.findMadeSync = exports.findMade = void 0;
const path_1 = __nccwpck_require__(1017);
const findMade = async (opts, parent, path) => {
    // we never want the 'made' return value to be a root directory
    if (path === parent) {
        return;
    }
    return opts.statAsync(parent).then(st => (st.isDirectory() ? path : undefined), // will fail later
    // will fail later
    er => {
        const fer = er;
        return fer && fer.code === 'ENOENT'
            ? (0, exports.findMade)(opts, (0, path_1.dirname)(parent), parent)
            : undefined;
    });
};
exports.findMade = findMade;
const findMadeSync = (opts, parent, path) => {
    if (path === parent) {
        return undefined;
    }
    try {
        return opts.statSync(parent).isDirectory() ? path : undefined;
    }
    catch (er) {
        const fer = er;
        return fer && fer.code === 'ENOENT'
            ? (0, exports.findMadeSync)(opts, (0, path_1.dirname)(parent), parent)
            : undefined;
    }
};
exports.findMadeSync = findMadeSync;
//# sourceMappingURL=find-made.js.map

/***/ }),

/***/ 7280:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.mkdirp = exports.nativeSync = exports.native = exports.manualSync = exports.manual = exports.sync = exports.mkdirpSync = exports.useNativeSync = exports.useNative = exports.mkdirpNativeSync = exports.mkdirpNative = exports.mkdirpManualSync = exports.mkdirpManual = void 0;
const mkdirp_manual_js_1 = __nccwpck_require__(6386);
const mkdirp_native_js_1 = __nccwpck_require__(3842);
const opts_arg_js_1 = __nccwpck_require__(2110);
const path_arg_js_1 = __nccwpck_require__(8577);
const use_native_js_1 = __nccwpck_require__(8918);
/* c8 ignore start */
var mkdirp_manual_js_2 = __nccwpck_require__(6386);
Object.defineProperty(exports, "mkdirpManual", ({ enumerable: true, get: function () { return mkdirp_manual_js_2.mkdirpManual; } }));
Object.defineProperty(exports, "mkdirpManualSync", ({ enumerable: true, get: function () { return mkdirp_manual_js_2.mkdirpManualSync; } }));
var mkdirp_native_js_2 = __nccwpck_require__(3842);
Object.defineProperty(exports, "mkdirpNative", ({ enumerable: true, get: function () { return mkdirp_native_js_2.mkdirpNative; } }));
Object.defineProperty(exports, "mkdirpNativeSync", ({ enumerable: true, get: function () { return mkdirp_native_js_2.mkdirpNativeSync; } }));
var use_native_js_2 = __nccwpck_require__(8918);
Object.defineProperty(exports, "useNative", ({ enumerable: true, get: function () { return use_native_js_2.useNative; } }));
Object.defineProperty(exports, "useNativeSync", ({ enumerable: true, get: function () { return use_native_js_2.useNativeSync; } }));
/* c8 ignore stop */
const mkdirpSync = (path, opts) => {
    path = (0, path_arg_js_1.pathArg)(path);
    const resolved = (0, opts_arg_js_1.optsArg)(opts);
    return (0, use_native_js_1.useNativeSync)(resolved)
        ? (0, mkdirp_native_js_1.mkdirpNativeSync)(path, resolved)
        : (0, mkdirp_manual_js_1.mkdirpManualSync)(path, resolved);
};
exports.mkdirpSync = mkdirpSync;
exports.sync = exports.mkdirpSync;
exports.manual = mkdirp_manual_js_1.mkdirpManual;
exports.manualSync = mkdirp_manual_js_1.mkdirpManualSync;
exports.native = mkdirp_native_js_1.mkdirpNative;
exports.nativeSync = mkdirp_native_js_1.mkdirpNativeSync;
exports.mkdirp = Object.assign(async (path, opts) => {
    path = (0, path_arg_js_1.pathArg)(path);
    const resolved = (0, opts_arg_js_1.optsArg)(opts);
    return (0, use_native_js_1.useNative)(resolved)
        ? (0, mkdirp_native_js_1.mkdirpNative)(path, resolved)
        : (0, mkdirp_manual_js_1.mkdirpManual)(path, resolved);
}, {
    mkdirpSync: exports.mkdirpSync,
    mkdirpNative: mkdirp_native_js_1.mkdirpNative,
    mkdirpNativeSync: mkdirp_native_js_1.mkdirpNativeSync,
    mkdirpManual: mkdirp_manual_js_1.mkdirpManual,
    mkdirpManualSync: mkdirp_manual_js_1.mkdirpManualSync,
    sync: exports.mkdirpSync,
    native: mkdirp_native_js_1.mkdirpNative,
    nativeSync: mkdirp_native_js_1.mkdirpNativeSync,
    manual: mkdirp_manual_js_1.mkdirpManual,
    manualSync: mkdirp_manual_js_1.mkdirpManualSync,
    useNative: use_native_js_1.useNative,
    useNativeSync: use_native_js_1.useNativeSync,
});
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 6386:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.mkdirpManual = exports.mkdirpManualSync = void 0;
const path_1 = __nccwpck_require__(1017);
const opts_arg_js_1 = __nccwpck_require__(2110);
const mkdirpManualSync = (path, options, made) => {
    const parent = (0, path_1.dirname)(path);
    const opts = { ...(0, opts_arg_js_1.optsArg)(options), recursive: false };
    if (parent === path) {
        try {
            return opts.mkdirSync(path, opts);
        }
        catch (er) {
            // swallowed by recursive implementation on posix systems
            // any other error is a failure
            const fer = er;
            if (fer && fer.code !== 'EISDIR') {
                throw er;
            }
            return;
        }
    }
    try {
        opts.mkdirSync(path, opts);
        return made || path;
    }
    catch (er) {
        const fer = er;
        if (fer && fer.code === 'ENOENT') {
            return (0, exports.mkdirpManualSync)(path, opts, (0, exports.mkdirpManualSync)(parent, opts, made));
        }
        if (fer && fer.code !== 'EEXIST' && fer && fer.code !== 'EROFS') {
            throw er;
        }
        try {
            if (!opts.statSync(path).isDirectory())
                throw er;
        }
        catch (_) {
            throw er;
        }
    }
};
exports.mkdirpManualSync = mkdirpManualSync;
exports.mkdirpManual = Object.assign(async (path, options, made) => {
    const opts = (0, opts_arg_js_1.optsArg)(options);
    opts.recursive = false;
    const parent = (0, path_1.dirname)(path);
    if (parent === path) {
        return opts.mkdirAsync(path, opts).catch(er => {
            // swallowed by recursive implementation on posix systems
            // any other error is a failure
            const fer = er;
            if (fer && fer.code !== 'EISDIR') {
                throw er;
            }
        });
    }
    return opts.mkdirAsync(path, opts).then(() => made || path, async (er) => {
        const fer = er;
        if (fer && fer.code === 'ENOENT') {
            return (0, exports.mkdirpManual)(parent, opts).then((made) => (0, exports.mkdirpManual)(path, opts, made));
        }
        if (fer && fer.code !== 'EEXIST' && fer.code !== 'EROFS') {
            throw er;
        }
        return opts.statAsync(path).then(st => {
            if (st.isDirectory()) {
                return made;
            }
            else {
                throw er;
            }
        }, () => {
            throw er;
        });
    });
}, { sync: exports.mkdirpManualSync });
//# sourceMappingURL=mkdirp-manual.js.map

/***/ }),

/***/ 3842:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.mkdirpNative = exports.mkdirpNativeSync = void 0;
const path_1 = __nccwpck_require__(1017);
const find_made_js_1 = __nccwpck_require__(354);
const mkdirp_manual_js_1 = __nccwpck_require__(6386);
const opts_arg_js_1 = __nccwpck_require__(2110);
const mkdirpNativeSync = (path, options) => {
    const opts = (0, opts_arg_js_1.optsArg)(options);
    opts.recursive = true;
    const parent = (0, path_1.dirname)(path);
    if (parent === path) {
        return opts.mkdirSync(path, opts);
    }
    const made = (0, find_made_js_1.findMadeSync)(opts, path);
    try {
        opts.mkdirSync(path, opts);
        return made;
    }
    catch (er) {
        const fer = er;
        if (fer && fer.code === 'ENOENT') {
            return (0, mkdirp_manual_js_1.mkdirpManualSync)(path, opts);
        }
        else {
            throw er;
        }
    }
};
exports.mkdirpNativeSync = mkdirpNativeSync;
exports.mkdirpNative = Object.assign(async (path, options) => {
    const opts = { ...(0, opts_arg_js_1.optsArg)(options), recursive: true };
    const parent = (0, path_1.dirname)(path);
    if (parent === path) {
        return await opts.mkdirAsync(path, opts);
    }
    return (0, find_made_js_1.findMade)(opts, path).then((made) => opts
        .mkdirAsync(path, opts)
        .then(m => made || m)
        .catch(er => {
        const fer = er;
        if (fer && fer.code === 'ENOENT') {
            return (0, mkdirp_manual_js_1.mkdirpManual)(path, opts);
        }
        else {
            throw er;
        }
    }));
}, { sync: exports.mkdirpNativeSync });
//# sourceMappingURL=mkdirp-native.js.map

/***/ }),

/***/ 2110:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.optsArg = void 0;
const fs_1 = __nccwpck_require__(7147);
const optsArg = (opts) => {
    if (!opts) {
        opts = { mode: 0o777 };
    }
    else if (typeof opts === 'object') {
        opts = { mode: 0o777, ...opts };
    }
    else if (typeof opts === 'number') {
        opts = { mode: opts };
    }
    else if (typeof opts === 'string') {
        opts = { mode: parseInt(opts, 8) };
    }
    else {
        throw new TypeError('invalid options argument');
    }
    const resolved = opts;
    const optsFs = opts.fs || {};
    opts.mkdir = opts.mkdir || optsFs.mkdir || fs_1.mkdir;
    opts.mkdirAsync = opts.mkdirAsync
        ? opts.mkdirAsync
        : async (path, options) => {
            return new Promise((res, rej) => resolved.mkdir(path, options, (er, made) => er ? rej(er) : res(made)));
        };
    opts.stat = opts.stat || optsFs.stat || fs_1.stat;
    opts.statAsync = opts.statAsync
        ? opts.statAsync
        : async (path) => new Promise((res, rej) => resolved.stat(path, (err, stats) => (err ? rej(err) : res(stats))));
    opts.statSync = opts.statSync || optsFs.statSync || fs_1.statSync;
    opts.mkdirSync = opts.mkdirSync || optsFs.mkdirSync || fs_1.mkdirSync;
    return resolved;
};
exports.optsArg = optsArg;
//# sourceMappingURL=opts-arg.js.map

/***/ }),

/***/ 8577:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.pathArg = void 0;
const platform = process.env.__TESTING_MKDIRP_PLATFORM__ || process.platform;
const path_1 = __nccwpck_require__(1017);
const pathArg = (path) => {
    if (/\0/.test(path)) {
        // simulate same failure that node raises
        throw Object.assign(new TypeError('path must be a string without null bytes'), {
            path,
            code: 'ERR_INVALID_ARG_VALUE',
        });
    }
    path = (0, path_1.resolve)(path);
    if (platform === 'win32') {
        const badWinChars = /[*|"<>?:]/;
        const { root } = (0, path_1.parse)(path);
        if (badWinChars.test(path.substring(root.length))) {
            throw Object.assign(new Error('Illegal characters in path.'), {
                path,
                code: 'EINVAL',
            });
        }
    }
    return path;
};
exports.pathArg = pathArg;
//# sourceMappingURL=path-arg.js.map

/***/ }),

/***/ 8918:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.useNative = exports.useNativeSync = void 0;
const fs_1 = __nccwpck_require__(7147);
const opts_arg_js_1 = __nccwpck_require__(2110);
const version = process.env.__TESTING_MKDIRP_NODE_VERSION__ || process.version;
const versArr = version.replace(/^v/, '').split('.');
const hasNative = +versArr[0] > 10 || (+versArr[0] === 10 && +versArr[1] >= 12);
exports.useNativeSync = !hasNative
    ? () => false
    : (opts) => (0, opts_arg_js_1.optsArg)(opts).mkdirSync === fs_1.mkdirSync;
exports.useNative = Object.assign(!hasNative
    ? () => false
    : (opts) => (0, opts_arg_js_1.optsArg)(opts).mkdir === fs_1.mkdir, {
    sync: exports.useNativeSync,
});
//# sourceMappingURL=use-native.js.map

/***/ }),

/***/ 4294:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = __nccwpck_require__(4219);


/***/ }),

/***/ 4219:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var net = __nccwpck_require__(1808);
var tls = __nccwpck_require__(4404);
var http = __nccwpck_require__(3685);
var https = __nccwpck_require__(5687);
var events = __nccwpck_require__(2361);
var assert = __nccwpck_require__(9491);
var util = __nccwpck_require__(3837);


exports.httpOverHttp = httpOverHttp;
exports.httpsOverHttp = httpsOverHttp;
exports.httpOverHttps = httpOverHttps;
exports.httpsOverHttps = httpsOverHttps;


function httpOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  return agent;
}

function httpsOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}

function httpOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  return agent;
}

function httpsOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}


function TunnelingAgent(options) {
  var self = this;
  self.options = options || {};
  self.proxyOptions = self.options.proxy || {};
  self.maxSockets = self.options.maxSockets || http.Agent.defaultMaxSockets;
  self.requests = [];
  self.sockets = [];

  self.on('free', function onFree(socket, host, port, localAddress) {
    var options = toOptions(host, port, localAddress);
    for (var i = 0, len = self.requests.length; i < len; ++i) {
      var pending = self.requests[i];
      if (pending.host === options.host && pending.port === options.port) {
        // Detect the request to connect same origin server,
        // reuse the connection.
        self.requests.splice(i, 1);
        pending.request.onSocket(socket);
        return;
      }
    }
    socket.destroy();
    self.removeSocket(socket);
  });
}
util.inherits(TunnelingAgent, events.EventEmitter);

TunnelingAgent.prototype.addRequest = function addRequest(req, host, port, localAddress) {
  var self = this;
  var options = mergeOptions({request: req}, self.options, toOptions(host, port, localAddress));

  if (self.sockets.length >= this.maxSockets) {
    // We are over limit so we'll add it to the queue.
    self.requests.push(options);
    return;
  }

  // If we are under maxSockets create a new one.
  self.createSocket(options, function(socket) {
    socket.on('free', onFree);
    socket.on('close', onCloseOrRemove);
    socket.on('agentRemove', onCloseOrRemove);
    req.onSocket(socket);

    function onFree() {
      self.emit('free', socket, options);
    }

    function onCloseOrRemove(err) {
      self.removeSocket(socket);
      socket.removeListener('free', onFree);
      socket.removeListener('close', onCloseOrRemove);
      socket.removeListener('agentRemove', onCloseOrRemove);
    }
  });
};

TunnelingAgent.prototype.createSocket = function createSocket(options, cb) {
  var self = this;
  var placeholder = {};
  self.sockets.push(placeholder);

  var connectOptions = mergeOptions({}, self.proxyOptions, {
    method: 'CONNECT',
    path: options.host + ':' + options.port,
    agent: false,
    headers: {
      host: options.host + ':' + options.port
    }
  });
  if (options.localAddress) {
    connectOptions.localAddress = options.localAddress;
  }
  if (connectOptions.proxyAuth) {
    connectOptions.headers = connectOptions.headers || {};
    connectOptions.headers['Proxy-Authorization'] = 'Basic ' +
        new Buffer(connectOptions.proxyAuth).toString('base64');
  }

  debug('making CONNECT request');
  var connectReq = self.request(connectOptions);
  connectReq.useChunkedEncodingByDefault = false; // for v0.6
  connectReq.once('response', onResponse); // for v0.6
  connectReq.once('upgrade', onUpgrade);   // for v0.6
  connectReq.once('connect', onConnect);   // for v0.7 or later
  connectReq.once('error', onError);
  connectReq.end();

  function onResponse(res) {
    // Very hacky. This is necessary to avoid http-parser leaks.
    res.upgrade = true;
  }

  function onUpgrade(res, socket, head) {
    // Hacky.
    process.nextTick(function() {
      onConnect(res, socket, head);
    });
  }

  function onConnect(res, socket, head) {
    connectReq.removeAllListeners();
    socket.removeAllListeners();

    if (res.statusCode !== 200) {
      debug('tunneling socket could not be established, statusCode=%d',
        res.statusCode);
      socket.destroy();
      var error = new Error('tunneling socket could not be established, ' +
        'statusCode=' + res.statusCode);
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    if (head.length > 0) {
      debug('got illegal response body from proxy');
      socket.destroy();
      var error = new Error('got illegal response body from proxy');
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    debug('tunneling connection has established');
    self.sockets[self.sockets.indexOf(placeholder)] = socket;
    return cb(socket);
  }

  function onError(cause) {
    connectReq.removeAllListeners();

    debug('tunneling socket could not be established, cause=%s\n',
          cause.message, cause.stack);
    var error = new Error('tunneling socket could not be established, ' +
                          'cause=' + cause.message);
    error.code = 'ECONNRESET';
    options.request.emit('error', error);
    self.removeSocket(placeholder);
  }
};

TunnelingAgent.prototype.removeSocket = function removeSocket(socket) {
  var pos = this.sockets.indexOf(socket)
  if (pos === -1) {
    return;
  }
  this.sockets.splice(pos, 1);

  var pending = this.requests.shift();
  if (pending) {
    // If we have pending requests and a socket gets closed a new one
    // needs to be created to take over in the pool for the one that closed.
    this.createSocket(pending, function(socket) {
      pending.request.onSocket(socket);
    });
  }
};

function createSecureSocket(options, cb) {
  var self = this;
  TunnelingAgent.prototype.createSocket.call(self, options, function(socket) {
    var hostHeader = options.request.getHeader('host');
    var tlsOptions = mergeOptions({}, self.options, {
      socket: socket,
      servername: hostHeader ? hostHeader.replace(/:.*$/, '') : options.host
    });

    // 0 is dummy port for v0.6
    var secureSocket = tls.connect(0, tlsOptions);
    self.sockets[self.sockets.indexOf(socket)] = secureSocket;
    cb(secureSocket);
  });
}


function toOptions(host, port, localAddress) {
  if (typeof host === 'string') { // since v0.10
    return {
      host: host,
      port: port,
      localAddress: localAddress
    };
  }
  return host; // for v0.11 or later
}

function mergeOptions(target) {
  for (var i = 1, len = arguments.length; i < len; ++i) {
    var overrides = arguments[i];
    if (typeof overrides === 'object') {
      var keys = Object.keys(overrides);
      for (var j = 0, keyLen = keys.length; j < keyLen; ++j) {
        var k = keys[j];
        if (overrides[k] !== undefined) {
          target[k] = overrides[k];
        }
      }
    }
  }
  return target;
}


var debug;
if (process.env.NODE_DEBUG && /\btunnel\b/.test(process.env.NODE_DEBUG)) {
  debug = function() {
    var args = Array.prototype.slice.call(arguments);
    if (typeof args[0] === 'string') {
      args[0] = 'TUNNEL: ' + args[0];
    } else {
      args.unshift('TUNNEL:');
    }
    console.error.apply(console, args);
  }
} else {
  debug = function() {};
}
exports.debug = debug; // for test


/***/ }),

/***/ 5840:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
Object.defineProperty(exports, "v1", ({
  enumerable: true,
  get: function () {
    return _v.default;
  }
}));
Object.defineProperty(exports, "v3", ({
  enumerable: true,
  get: function () {
    return _v2.default;
  }
}));
Object.defineProperty(exports, "v4", ({
  enumerable: true,
  get: function () {
    return _v3.default;
  }
}));
Object.defineProperty(exports, "v5", ({
  enumerable: true,
  get: function () {
    return _v4.default;
  }
}));
Object.defineProperty(exports, "NIL", ({
  enumerable: true,
  get: function () {
    return _nil.default;
  }
}));
Object.defineProperty(exports, "version", ({
  enumerable: true,
  get: function () {
    return _version.default;
  }
}));
Object.defineProperty(exports, "validate", ({
  enumerable: true,
  get: function () {
    return _validate.default;
  }
}));
Object.defineProperty(exports, "stringify", ({
  enumerable: true,
  get: function () {
    return _stringify.default;
  }
}));
Object.defineProperty(exports, "parse", ({
  enumerable: true,
  get: function () {
    return _parse.default;
  }
}));

var _v = _interopRequireDefault(__nccwpck_require__(8628));

var _v2 = _interopRequireDefault(__nccwpck_require__(6409));

var _v3 = _interopRequireDefault(__nccwpck_require__(5122));

var _v4 = _interopRequireDefault(__nccwpck_require__(9120));

var _nil = _interopRequireDefault(__nccwpck_require__(5332));

var _version = _interopRequireDefault(__nccwpck_require__(1595));

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

var _parse = _interopRequireDefault(__nccwpck_require__(2746));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),

/***/ 4569:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _crypto = _interopRequireDefault(__nccwpck_require__(6113));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function md5(bytes) {
  if (Array.isArray(bytes)) {
    bytes = Buffer.from(bytes);
  } else if (typeof bytes === 'string') {
    bytes = Buffer.from(bytes, 'utf8');
  }

  return _crypto.default.createHash('md5').update(bytes).digest();
}

var _default = md5;
exports["default"] = _default;

/***/ }),

/***/ 5332:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = '00000000-0000-0000-0000-000000000000';
exports["default"] = _default;

/***/ }),

/***/ 2746:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parse(uuid) {
  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Invalid UUID');
  }

  let v;
  const arr = new Uint8Array(16); // Parse ########-....-....-....-............

  arr[0] = (v = parseInt(uuid.slice(0, 8), 16)) >>> 24;
  arr[1] = v >>> 16 & 0xff;
  arr[2] = v >>> 8 & 0xff;
  arr[3] = v & 0xff; // Parse ........-####-....-....-............

  arr[4] = (v = parseInt(uuid.slice(9, 13), 16)) >>> 8;
  arr[5] = v & 0xff; // Parse ........-....-####-....-............

  arr[6] = (v = parseInt(uuid.slice(14, 18), 16)) >>> 8;
  arr[7] = v & 0xff; // Parse ........-....-....-####-............

  arr[8] = (v = parseInt(uuid.slice(19, 23), 16)) >>> 8;
  arr[9] = v & 0xff; // Parse ........-....-....-....-############
  // (Use "/" to avoid 32-bit truncation when bit-shifting high-order bytes)

  arr[10] = (v = parseInt(uuid.slice(24, 36), 16)) / 0x10000000000 & 0xff;
  arr[11] = v / 0x100000000 & 0xff;
  arr[12] = v >>> 24 & 0xff;
  arr[13] = v >>> 16 & 0xff;
  arr[14] = v >>> 8 & 0xff;
  arr[15] = v & 0xff;
  return arr;
}

var _default = parse;
exports["default"] = _default;

/***/ }),

/***/ 814:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
exports["default"] = _default;

/***/ }),

/***/ 807:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = rng;

var _crypto = _interopRequireDefault(__nccwpck_require__(6113));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const rnds8Pool = new Uint8Array(256); // # of random values to pre-allocate

let poolPtr = rnds8Pool.length;

function rng() {
  if (poolPtr > rnds8Pool.length - 16) {
    _crypto.default.randomFillSync(rnds8Pool);

    poolPtr = 0;
  }

  return rnds8Pool.slice(poolPtr, poolPtr += 16);
}

/***/ }),

/***/ 5274:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _crypto = _interopRequireDefault(__nccwpck_require__(6113));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function sha1(bytes) {
  if (Array.isArray(bytes)) {
    bytes = Buffer.from(bytes);
  } else if (typeof bytes === 'string') {
    bytes = Buffer.from(bytes, 'utf8');
  }

  return _crypto.default.createHash('sha1').update(bytes).digest();
}

var _default = sha1;
exports["default"] = _default;

/***/ }),

/***/ 8950:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
const byteToHex = [];

for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).substr(1));
}

function stringify(arr, offset = 0) {
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  const uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
  // of the following:
  // - One or more input array values don't map to a hex octet (leading to
  // "undefined" in the uuid)
  // - Invalid input values for the RFC `version` or `variant` fields

  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Stringified UUID is invalid');
  }

  return uuid;
}

var _default = stringify;
exports["default"] = _default;

/***/ }),

/***/ 8628:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _rng = _interopRequireDefault(__nccwpck_require__(807));

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html
let _nodeId;

let _clockseq; // Previous uuid creation time


let _lastMSecs = 0;
let _lastNSecs = 0; // See https://github.com/uuidjs/uuid for API details

function v1(options, buf, offset) {
  let i = buf && offset || 0;
  const b = buf || new Array(16);
  options = options || {};
  let node = options.node || _nodeId;
  let clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq; // node and clockseq need to be initialized to random values if they're not
  // specified.  We do this lazily to minimize issues related to insufficient
  // system entropy.  See #189

  if (node == null || clockseq == null) {
    const seedBytes = options.random || (options.rng || _rng.default)();

    if (node == null) {
      // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
      node = _nodeId = [seedBytes[0] | 0x01, seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]];
    }

    if (clockseq == null) {
      // Per 4.2.2, randomize (14 bit) clockseq
      clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
    }
  } // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.


  let msecs = options.msecs !== undefined ? options.msecs : Date.now(); // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock

  let nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1; // Time since last uuid creation (in msecs)

  const dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 10000; // Per 4.2.1.2, Bump clockseq on clock regression

  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  } // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval


  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  } // Per 4.2.1.2 Throw error if too many uuids are requested


  if (nsecs >= 10000) {
    throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq; // Per 4.1.4 - Convert from unix epoch to Gregorian epoch

  msecs += 12219292800000; // `time_low`

  const tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff; // `time_mid`

  const tmh = msecs / 0x100000000 * 10000 & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff; // `time_high_and_version`

  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version

  b[i++] = tmh >>> 16 & 0xff; // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)

  b[i++] = clockseq >>> 8 | 0x80; // `clock_seq_low`

  b[i++] = clockseq & 0xff; // `node`

  for (let n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf || (0, _stringify.default)(b);
}

var _default = v1;
exports["default"] = _default;

/***/ }),

/***/ 6409:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _v = _interopRequireDefault(__nccwpck_require__(5998));

var _md = _interopRequireDefault(__nccwpck_require__(4569));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const v3 = (0, _v.default)('v3', 0x30, _md.default);
var _default = v3;
exports["default"] = _default;

/***/ }),

/***/ 5998:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = _default;
exports.URL = exports.DNS = void 0;

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

var _parse = _interopRequireDefault(__nccwpck_require__(2746));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function stringToBytes(str) {
  str = unescape(encodeURIComponent(str)); // UTF8 escape

  const bytes = [];

  for (let i = 0; i < str.length; ++i) {
    bytes.push(str.charCodeAt(i));
  }

  return bytes;
}

const DNS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
exports.DNS = DNS;
const URL = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';
exports.URL = URL;

function _default(name, version, hashfunc) {
  function generateUUID(value, namespace, buf, offset) {
    if (typeof value === 'string') {
      value = stringToBytes(value);
    }

    if (typeof namespace === 'string') {
      namespace = (0, _parse.default)(namespace);
    }

    if (namespace.length !== 16) {
      throw TypeError('Namespace must be array-like (16 iterable integer values, 0-255)');
    } // Compute hash of namespace and value, Per 4.3
    // Future: Use spread syntax when supported on all platforms, e.g. `bytes =
    // hashfunc([...namespace, ... value])`


    let bytes = new Uint8Array(16 + value.length);
    bytes.set(namespace);
    bytes.set(value, namespace.length);
    bytes = hashfunc(bytes);
    bytes[6] = bytes[6] & 0x0f | version;
    bytes[8] = bytes[8] & 0x3f | 0x80;

    if (buf) {
      offset = offset || 0;

      for (let i = 0; i < 16; ++i) {
        buf[offset + i] = bytes[i];
      }

      return buf;
    }

    return (0, _stringify.default)(bytes);
  } // Function#name is not settable on some platforms (#270)


  try {
    generateUUID.name = name; // eslint-disable-next-line no-empty
  } catch (err) {} // For CommonJS default export support


  generateUUID.DNS = DNS;
  generateUUID.URL = URL;
  return generateUUID;
}

/***/ }),

/***/ 5122:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _rng = _interopRequireDefault(__nccwpck_require__(807));

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function v4(options, buf, offset) {
  options = options || {};

  const rnds = options.random || (options.rng || _rng.default)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`


  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;

    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }

    return buf;
  }

  return (0, _stringify.default)(rnds);
}

var _default = v4;
exports["default"] = _default;

/***/ }),

/***/ 9120:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _v = _interopRequireDefault(__nccwpck_require__(5998));

var _sha = _interopRequireDefault(__nccwpck_require__(5274));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const v5 = (0, _v.default)('v5', 0x50, _sha.default);
var _default = v5;
exports["default"] = _default;

/***/ }),

/***/ 6900:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _regex = _interopRequireDefault(__nccwpck_require__(814));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function validate(uuid) {
  return typeof uuid === 'string' && _regex.default.test(uuid);
}

var _default = validate;
exports["default"] = _default;

/***/ }),

/***/ 1595:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function version(uuid) {
  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Invalid UUID');
  }

  return parseInt(uuid.substr(14, 1), 16);
}

var _default = version;
exports["default"] = _default;

/***/ }),

/***/ 5431:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const core = __nccwpck_require__(2186)
const exec = __nccwpck_require__(1514)
const EVALUATION_PATH = './ioncube_encoder_evaluation/ioncube_encoder.sh'
const ENCODER_PATH = './ioncube_encoder/ioncube_encoder.sh'
const IONCUBE_EVAL_URL = 'https://www.ioncube.com/eval_linux'
const tar = __nccwpck_require__(6630)
const fs = __nccwpck_require__(7147)
const cp = __nccwpck_require__(2081)
const process = __nccwpck_require__(7282)

/**
 * Download ioncube evaluation.
 * @returns {Promise<string>} Returns the path of encoder.
 */
module.exports = async function evaluation() {
  const cwd = process.cwd()

  const gzip_evaluation_path = `${cwd}/ioncube_encoder_evaluation.tar.gz`

  if (!fs.existsSync(__nccwpck_require__.ab + "ioncube_encoder_evaluation")) {
    await download(IONCUBE_EVAL_URL, gzip_evaluation_path)
    await tar.extract({ file: gzip_evaluation_path })

    if (fs.existsSync(gzip_evaluation_path)) {
      fs.unlinkSync(gzip_evaluation_path)
    }
  }

  return EVALUATION_PATH
}

/**
 * Download ioncube licensed version.
 * @returns {Promise<string>} Returns the path of encoder.
 */
module.exports = async function encoder() {
  const cwd = process.cwd()

  let downloadUrl = process.env.IONCUBE_DOWNLOAD_URL
  let path = ENCODER_PATH
  let ioncube_folder = `${cwd}/ioncube_encoder`
  let folder = 'ioncube_encoder'
  if (!process.env.IONCUBE_DOWNLOAD_URL) {
    downloadUrl = IONCUBE_EVAL_URL
    path = EVALUATION_PATH
    ioncube_folder = __nccwpck_require__.ab + "ioncube_encoder_evaluation"
    folder = 'ioncube_encoder_evaluation'
  }

  const gzip_encoder_path = `${cwd}/ioncube_encoder.tar.gz`

  if (!fs.existsSync(folder)) {
    await download(downloadUrl, gzip_encoder_path)

    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true })
    }

    let myOutput = ''
    let myError = ''

    const options = {}
    options.listeners = {
      stdout: data => {
        myOutput += data.toString()
      },
      stderr: data => {
        myError += data.toString()
      }
    }
    options.silent = false
    options.failOnStdErr = false
    options.ignoreReturnCode = false
    await exec.exec(
      `tar -xzvf ${gzip_encoder_path} -C ${folder} --strip-components=1`,
      [],
      options
    )

    if (fs.existsSync(gzip_encoder_path)) {
      fs.unlinkSync(gzip_encoder_path)
    }
  }

  return path
}

const download = async (uri, filename) => {
  const downloadUrl = uri ?? IONCUBE_EVAL_URL
  cp.execSync(`wget ${downloadUrl} -O ${filename}`)
}


/***/ }),

/***/ 9661:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const core = __nccwpck_require__(2186)

/**
 * Validate arch input values.
 * @returns {string} Returns a validated arch input.
 */
module.exports = function validateArchitecture(standard = '64') {
  let arch = core.getInput('arch', { required: false }) ?? standard

  if (arch === '86') {
    arch = 'x86'
  } else {
    arch = 'x86-64'
  }

  core.debug(`Using target architecture: ${arch}`)

  return arch
}


/***/ }),

/***/ 6585:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const core = __nccwpck_require__(2186)

/**
 * Validate binary input values.
 * @returns {bool|string} Returns a validated binary input.
 */
module.exports = function validateBinary(standard = false) {
  const binary = core.getInput('binary') ?? standard
  core.debug(
    binary === true
      ? 'Encoding into binary format'
      : 'Encoding into ASCII format'
  )
  return binary
}


/***/ }),

/***/ 683:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const core = __nccwpck_require__(2186)

/**
 * Validate callback input values.
 * @returns {bool|string} Returns a validated callback input.
 */
module.exports = function validateCallback(standard = '') {
  const callback = core.getInput('callback-file') ?? standard
  core.debug(
    `Using callback file in runtime path: ${
      callback === '' ? 'NONE' : callback
    }`
  )
  return callback
}


/***/ }),

/***/ 8633:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const core = __nccwpck_require__(2186)

/**
 * Validate check input values.
 * @returns {bool|string} Returns a validated check input.
 */
module.exports = function validateCheck(standard = 'auto') {
  let check = core.getInput('license-check') ?? standard

  if (check === 'auto') {
    check = 'auto'
  } else {
    check = 'script'
  }

  core.debug(`Using license check: ${check}`)
  return check
}


/***/ }),

/***/ 7718:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const core = __nccwpck_require__(2186)

/**
 * Validate comments input values.
 * @returns {bool|string} Returns a validated comments input.
 */
module.exports = function validateComments(standard = true) {
  const comments = !(core.getInput('no-doc-comments') ?? standard)
  core.debug(
    comments === true ? 'Allowing doc comments' : 'Now allow doc comments'
  )
  return comments
}


/***/ }),

/***/ 6106:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const core = __nccwpck_require__(2186)

/**
 * Validate encoder-version input values.
 * @returns {string} Returns a validated encoder-version input.
 */
module.exports = function validateEncoderVersion(standard = 'current') {
  let encoderVersion =
    core.getInput('encoder-version', { required: false }) ?? standard

  core.debug(`Using encoder version: ${encoderVersion}`)

  if (encoderVersion === 'obsolete') {
    encoderVersion = 'O'
  } else if (encoderVersion === 'legacy') {
    encoderVersion = 'L'
  } else {
    encoderVersion = 'C'
  }

  return encoderVersion
}


/***/ }),

/***/ 5483:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const core = __nccwpck_require__(2186)

/**
 * Validate encrypt input values.
 * @returns {bool|string} Returns a validated encrypt input.
 */
module.exports = function validateEncrypt(standard = '') {
  const encrypt = core.getInput('encrypt') ?? standard
  core.debug(`Encrypting files: ${encrypt === '' ? 'NONE' : encrypt}`)
  return encrypt
}


/***/ }),

/***/ 5623:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const core = __nccwpck_require__(2186)

/**
 * Validate input input values.
 * @returns {string} Returns a validated input input.
 */
module.exports = function validateInput(standard = '') {
  let input = core.getInput('source') ?? standard

  core.debug(`Using input files: ${input === '' ? '.' : input}`)

  if (input === '') {
    input = __dirname
  }

  return input.replace(/\/$/, '')
}


/***/ }),

/***/ 3538:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const core = __nccwpck_require__(2186)

/**
 * Validate license input values.
 * @returns {bool|string} Returns a validated license input.
 */
module.exports = function validateLicense(standard = '') {
  const license = core.getInput('with-license') ?? standard
  core.debug(
    `Using license file in runtime path: ${license === '' ? 'NONE' : license}`
  )
  return license
}


/***/ }),

/***/ 2918:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const core = __nccwpck_require__(2186)

/**
 * Validate loader input values.
 * @returns {bool|string} Returns a validated loader input.
 */
module.exports = function validateLoader(standard = true) {
  const loader = core.getInput('without-loader-check') ?? standard
  core.debug(
    loader === true
      ? 'Checking for loader in environment'
      : 'Not checking for loader in environment'
  )
  return loader
}


/***/ }),

/***/ 701:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const core = __nccwpck_require__(2186)

/**
 * Validate optimize input values.
 * @returns {bool|string} Returns a validated optimize input.
 */
module.exports = function validateOptimize(standard = 'more') {
  let optimize = core.getInput('optimize') ?? standard

  if (optimize === 'more') {
    optimize = 'more'
  } else {
    optimize = 'max'
  }

  core.debug(`Using optimization: ${optimize}`)
  return optimize
}


/***/ }),

/***/ 6337:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const core = __nccwpck_require__(2186)

/**
 * Validate output input values.
 * @returns {string} Returns a validated output input.
 */
module.exports = function validateOutput(standard = 'encrypted') {
  const output = core.getInput('output') ?? standard

  core.debug(`Using output path: ${output}`)

  return output
}


/***/ }),

/***/ 350:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const core = __nccwpck_require__(2186)

/**
 * Validate passphrase input values.
 * @returns {bool|string} Returns a validated passphrase input.
 */
module.exports = function validatePassphrase(standard = '') {
  const passphrase = core.getInput('passphrase') ?? standard
  core.debug(`Using passphrase: ${passphrase === '' ? 'NONE' : passphrase}`)
  return passphrase
}


/***/ }),

/***/ 8172:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const core = __nccwpck_require__(2186)

/**
 * Validate php-target-version input values.
 * @returns {string} Returns a validated php-target-version input.
 */
module.exports = function validatePhpTargetVersion(standard = '8.2') {
  let phpTargetVersion =
    core.getInput('php-target-version', { required: false }) ?? standard

  core.debug(`Using PHP target version: ${phpTargetVersion}`)

  if (phpTargetVersion === '8.0') {
    phpTargetVersion = '80'
  } else if (phpTargetVersion === '8.1') {
    phpTargetVersion = '81'
  } else {
    phpTargetVersion = '82'
  }

  return phpTargetVersion
}


/***/ }),

/***/ 8620:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const core = __nccwpck_require__(2186)

/**
 * Validate preamble input values.
 * @returns {bool|string} Returns a validated preamble input.
 */
module.exports = function validatePreamble(standard = '') {
  const preamble = core.getInput('preamble-file') ?? standard
  core.debug(`Adding preamble file: ${preamble === '' ? 'NONE' : preamble}`)
  return preamble
}


/***/ }),

/***/ 455:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const core = __nccwpck_require__(2186)

/**
 * Validate reflection input values.
 * @returns {bool|string} Returns a validated reflection input.
 */
module.exports = function validateReflection(standard = false) {
  const reflectionAll = core.getInput('allow-reflection-all') ?? standard

  if (reflectionAll === true) {
    core.debug('Allowing reflection for all')
    return true
  }

  const reflection =
    core.getInput('allow-reflection') ?? (standard === false ? '' : standard)
  core.debug(`Using reflection for: ${reflection === '' ? 'NONE' : reflection}`)
  return reflection
}


/***/ }),

/***/ 5267:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const core = __nccwpck_require__(2186)

/**
 * Validate template input values.
 * @returns {string} Returns a validated template input.
 */
module.exports = function validateTemplate() {
  const template = core.getInput('template', { required: false }) ?? 'php'
  core.debug(`Encoding files using template: ${template}`)

  // TODO: validate template values

  return template
}


/***/ }),

/***/ 2400:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const core = __nccwpck_require__(2186)
const evaluation = __nccwpck_require__(5431)
const encoder = __nccwpck_require__(5431)

/**
 * Validate trial input values.
 * @returns {Promise<string>} Returns a validated trial input.
 */
module.exports = async function validateTrial() {
  const trial = core.getInput('trial', { required: false }) ?? true

  if (trial) {
    return await evaluation()
  }

  return await encoder()
}


/***/ }),

/***/ 1713:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const core = __nccwpck_require__(2186)
const exec = __nccwpck_require__(1514)
const validate = __nccwpck_require__(1002)

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
async function run() {
  const inputs = await validate()

  let myOutput = ''
  let myError = ''

  const options = {}
  options.listeners = {
    stdout: data => {
      myOutput += data.toString()
    },
    stderr: data => {
      myError += data.toString()
    }
  }
  options.silent = false
  options.failOnStdErr = false
  options.ignoreReturnCode = false

  if (!inputs.trial && process.env.IONCUBE_DOWNLOAD_URL) {
    try {
      const exitCode = await exec.exec(
        `${inputs.ioncube} --activate`,
        [],
        options
      )
      core.debug(exitCode)
    } catch (error) {
      core.error(error)
    }
  }

  myOutput = ''
  myError = ''

  let customOptions = ''

  if (inputs.binary === true) {
    customOptions += ' --binary'
  }

  if (inputs.comments === false) {
    customOptions += ' --no-doc-comments'
  }

  if (inputs.encrypt !== '') {
    customOptions += ` --encrypt "${inputs.encrypt}"`
  }

  if (inputs.optimize === 'more' || inputs.optimize === 'max') {
    customOptions += ` --optimize ${inputs.optimize}`
  }

  if (inputs.reflection === true) {
    customOptions += ` --allow-reflection-all`
  } else if (inputs.reflection !== '') {
    customOptions += ` --allow-reflection ${inputs.reflection}`
  }

  if (inputs.preamble !== '') {
    customOptions += ` --preamble-file ${inputs.preamble}`
  }

  if (inputs.passphrase !== '') {
    customOptions += ` --passphrase "${inputs.passphrase}"`
  }

  if (inputs.license !== '') {
    customOptions += ` --with-license ${inputs.license}`
  }

  if (inputs.callback !== '') {
    customOptions += ` --callback-file "${inputs.callback}"`
  }

  if (inputs.check === 'auto' || inputs.check === 'script') {
    customOptions += ` --license-check ${inputs.check}`
  }

  customOptions.trim()

  try {
    const command = `${inputs.ioncube} -${inputs.encoderVersion} -${inputs.phpTargetVersion} -${inputs.arch} ${inputs.input} -o ${inputs.output} ${customOptions} --create-target --replace-target`

    let exitCode = await exec.exec(command, [], options)
    core.debug(exitCode)
    core.debug(myOutput)
    core.debug(myError)

    if (!inputs.trial && process.env.IONCUBE_DOWNLOAD_URL) {
      myOutput = ''
      myError = ''

      exitCode = await exec.exec(`${inputs.ioncube} --deactivate`, [], options)

      core.debug(exitCode)
      core.debug(myOutput)
      core.debug(myError)
    }

    core.setOutput('status', 'Project encoded with success')
  } catch (error) {
    if (!inputs.trial && process.env.IONCUBE_DOWNLOAD_URL) {
      myOutput = ''
      myError = ''

      const exitCode = await exec.exec(
        `${inputs.ioncube} --deactivate`,
        [],
        options
      )

      core.debug(exitCode)
      core.debug(myOutput)
      core.debug(myError)
    }

    core.setFailed(error.message)
  }
}

module.exports = {
  run
}


/***/ }),

/***/ 8326:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const laravel = __nccwpck_require__(6134)

const templates = {
  laravel
}

/**
 * Choose correct template based on template input value.
 * @returns {object} Returns defaults values based on templates.
 */
module.exports = function choose(template = 'php') {
  const standard = {
    encoderVersion: 'current',
    phpTargetVersion: '8.2',
    arch: 64,
    input: '',
    output: 'encrypted',
    reflection: false,
    encrypt: '',
    binary: false,
    optimize: 'more',
    comments: true,
    loader: true,
    preamble: '',
    passphrase: '',
    check: 'auto',
    license: '',
    callback: ''
  }

  const args = templates[template]?.()
  return args ?? standard
}


/***/ }),

/***/ 6134:
/***/ ((module) => {

/**
 * Input values for laravel projects.
 * @returns {object} Returns defaults values for laravel template.
 */
module.exports = function laravel() {
  return {
    encoderVersion: 'current',
    phpTargetVersion: '8.2',
    arch: 64,
    input: '',
    output: 'encrypted',
    reflection: true,
    encrypt: '*.blade.php',
    binary: true,
    optimize: 'max',
    comments: true, // without
    loader: false, // without
    preamble: '',
    passphrase: 'CHANGEME',
    check: 'script',
    license: '/opt/license',
    callback: 'public/ioncube.php'
  }
}


/***/ }),

/***/ 1002:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const core = __nccwpck_require__(2186)

const EVALUATION_PATH = __nccwpck_require__(5431)
const choose = __nccwpck_require__(8326)
const validateTrial = __nccwpck_require__(2400)
const validateTemplate = __nccwpck_require__(5267)
const validateEncoderVersion = __nccwpck_require__(6106)
const validatePhpTargetVersion = __nccwpck_require__(8172)
const validateArchitecture = __nccwpck_require__(9661)
const validateInput = __nccwpck_require__(5623)
const validateOutput = __nccwpck_require__(6337)
const validateReflection = __nccwpck_require__(455)
const validateEncrypt = __nccwpck_require__(5483)
const validateBinary = __nccwpck_require__(6585)
const validateOptimize = __nccwpck_require__(701)
const validateComments = __nccwpck_require__(7718)
const validateLoader = __nccwpck_require__(2918)
const validatePreamble = __nccwpck_require__(8620)
const validatePassphrase = __nccwpck_require__(350)
const validateCheck = __nccwpck_require__(8633)
const validateLicense = __nccwpck_require__(3538)
const validateCallback = __nccwpck_require__(683)

/**
 * Set default arguments depending on inputed template.
 * @returns {Promise<object>} Inputs based on templates.
 */
module.exports = async function validate() {
  const ioncube = await validateTrial()
  const trial = ioncube === EVALUATION_PATH ? true : false

  const template = validateTemplate()
  const defaults = choose(template)

  return {
    template,
    ioncube,
    trial,
    encoderVersion: validateEncoderVersion(defaults.encoderVersion),
    phpTargetVersion: validatePhpTargetVersion(defaults.phpTargetVersion),
    arch: validateArchitecture(defaults.arch),
    input: validateInput(defaults.input),
    output: validateOutput(defaults.output),
    reflection: validateReflection(defaults.reflection),
    encrypt: validateEncrypt(defaults.encrypt),
    binary: validateBinary(defaults.binary),
    optimize: validateOptimize(defaults.optimize),
    comments: validateComments(defaults.comments),
    loader: validateLoader(defaults.loader),
    preamble: validatePreamble(defaults.preamble),
    passphrase: validatePassphrase(defaults.passphrase),
    check: validateCheck(defaults.check),
    license: validateLicense(defaults.license),
    callback: validateCallback(defaults.callback)
  }
}


/***/ }),

/***/ 9491:
/***/ ((module) => {

"use strict";
module.exports = require("assert");

/***/ }),

/***/ 4300:
/***/ ((module) => {

"use strict";
module.exports = require("buffer");

/***/ }),

/***/ 2081:
/***/ ((module) => {

"use strict";
module.exports = require("child_process");

/***/ }),

/***/ 6113:
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ 2361:
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),

/***/ 7147:
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ 3685:
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),

/***/ 5687:
/***/ ((module) => {

"use strict";
module.exports = require("https");

/***/ }),

/***/ 1808:
/***/ ((module) => {

"use strict";
module.exports = require("net");

/***/ }),

/***/ 8061:
/***/ ((module) => {

"use strict";
module.exports = require("node:assert");

/***/ }),

/***/ 6005:
/***/ ((module) => {

"use strict";
module.exports = require("node:crypto");

/***/ }),

/***/ 5673:
/***/ ((module) => {

"use strict";
module.exports = require("node:events");

/***/ }),

/***/ 7561:
/***/ ((module) => {

"use strict";
module.exports = require("node:fs");

/***/ }),

/***/ 9411:
/***/ ((module) => {

"use strict";
module.exports = require("node:path");

/***/ }),

/***/ 4492:
/***/ ((module) => {

"use strict";
module.exports = require("node:stream");

/***/ }),

/***/ 6915:
/***/ ((module) => {

"use strict";
module.exports = require("node:string_decoder");

/***/ }),

/***/ 2037:
/***/ ((module) => {

"use strict";
module.exports = require("os");

/***/ }),

/***/ 1017:
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ 7282:
/***/ ((module) => {

"use strict";
module.exports = require("process");

/***/ }),

/***/ 1576:
/***/ ((module) => {

"use strict";
module.exports = require("string_decoder");

/***/ }),

/***/ 9512:
/***/ ((module) => {

"use strict";
module.exports = require("timers");

/***/ }),

/***/ 4404:
/***/ ((module) => {

"use strict";
module.exports = require("tls");

/***/ }),

/***/ 3837:
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ }),

/***/ 9796:
/***/ ((module) => {

"use strict";
module.exports = require("zlib");

/***/ }),

/***/ 675:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WriteStreamSync = exports.WriteStream = exports.ReadStreamSync = exports.ReadStream = void 0;
const events_1 = __importDefault(__nccwpck_require__(2361));
const fs_1 = __importDefault(__nccwpck_require__(7147));
const minipass_1 = __nccwpck_require__(4968);
const writev = fs_1.default.writev;
const _autoClose = Symbol('_autoClose');
const _close = Symbol('_close');
const _ended = Symbol('_ended');
const _fd = Symbol('_fd');
const _finished = Symbol('_finished');
const _flags = Symbol('_flags');
const _flush = Symbol('_flush');
const _handleChunk = Symbol('_handleChunk');
const _makeBuf = Symbol('_makeBuf');
const _mode = Symbol('_mode');
const _needDrain = Symbol('_needDrain');
const _onerror = Symbol('_onerror');
const _onopen = Symbol('_onopen');
const _onread = Symbol('_onread');
const _onwrite = Symbol('_onwrite');
const _open = Symbol('_open');
const _path = Symbol('_path');
const _pos = Symbol('_pos');
const _queue = Symbol('_queue');
const _read = Symbol('_read');
const _readSize = Symbol('_readSize');
const _reading = Symbol('_reading');
const _remain = Symbol('_remain');
const _size = Symbol('_size');
const _write = Symbol('_write');
const _writing = Symbol('_writing');
const _defaultFlag = Symbol('_defaultFlag');
const _errored = Symbol('_errored');
class ReadStream extends minipass_1.Minipass {
    [_errored] = false;
    [_fd];
    [_path];
    [_readSize];
    [_reading] = false;
    [_size];
    [_remain];
    [_autoClose];
    constructor(path, opt) {
        opt = opt || {};
        super(opt);
        this.readable = true;
        this.writable = false;
        if (typeof path !== 'string') {
            throw new TypeError('path must be a string');
        }
        this[_errored] = false;
        this[_fd] = typeof opt.fd === 'number' ? opt.fd : undefined;
        this[_path] = path;
        this[_readSize] = opt.readSize || 16 * 1024 * 1024;
        this[_reading] = false;
        this[_size] = typeof opt.size === 'number' ? opt.size : Infinity;
        this[_remain] = this[_size];
        this[_autoClose] =
            typeof opt.autoClose === 'boolean' ? opt.autoClose : true;
        if (typeof this[_fd] === 'number') {
            this[_read]();
        }
        else {
            this[_open]();
        }
    }
    get fd() {
        return this[_fd];
    }
    get path() {
        return this[_path];
    }
    //@ts-ignore
    write() {
        throw new TypeError('this is a readable stream');
    }
    //@ts-ignore
    end() {
        throw new TypeError('this is a readable stream');
    }
    [_open]() {
        fs_1.default.open(this[_path], 'r', (er, fd) => this[_onopen](er, fd));
    }
    [_onopen](er, fd) {
        if (er) {
            this[_onerror](er);
        }
        else {
            this[_fd] = fd;
            this.emit('open', fd);
            this[_read]();
        }
    }
    [_makeBuf]() {
        return Buffer.allocUnsafe(Math.min(this[_readSize], this[_remain]));
    }
    [_read]() {
        if (!this[_reading]) {
            this[_reading] = true;
            const buf = this[_makeBuf]();
            /* c8 ignore start */
            if (buf.length === 0) {
                return process.nextTick(() => this[_onread](null, 0, buf));
            }
            /* c8 ignore stop */
            fs_1.default.read(this[_fd], buf, 0, buf.length, null, (er, br, b) => this[_onread](er, br, b));
        }
    }
    [_onread](er, br, buf) {
        this[_reading] = false;
        if (er) {
            this[_onerror](er);
        }
        else if (this[_handleChunk](br, buf)) {
            this[_read]();
        }
    }
    [_close]() {
        if (this[_autoClose] && typeof this[_fd] === 'number') {
            const fd = this[_fd];
            this[_fd] = undefined;
            fs_1.default.close(fd, er => er ? this.emit('error', er) : this.emit('close'));
        }
    }
    [_onerror](er) {
        this[_reading] = true;
        this[_close]();
        this.emit('error', er);
    }
    [_handleChunk](br, buf) {
        let ret = false;
        // no effect if infinite
        this[_remain] -= br;
        if (br > 0) {
            ret = super.write(br < buf.length ? buf.subarray(0, br) : buf);
        }
        if (br === 0 || this[_remain] <= 0) {
            ret = false;
            this[_close]();
            super.end();
        }
        return ret;
    }
    emit(ev, ...args) {
        switch (ev) {
            case 'prefinish':
            case 'finish':
                return false;
            case 'drain':
                if (typeof this[_fd] === 'number') {
                    this[_read]();
                }
                return false;
            case 'error':
                if (this[_errored]) {
                    return false;
                }
                this[_errored] = true;
                return super.emit(ev, ...args);
            default:
                return super.emit(ev, ...args);
        }
    }
}
exports.ReadStream = ReadStream;
class ReadStreamSync extends ReadStream {
    [_open]() {
        let threw = true;
        try {
            this[_onopen](null, fs_1.default.openSync(this[_path], 'r'));
            threw = false;
        }
        finally {
            if (threw) {
                this[_close]();
            }
        }
    }
    [_read]() {
        let threw = true;
        try {
            if (!this[_reading]) {
                this[_reading] = true;
                do {
                    const buf = this[_makeBuf]();
                    /* c8 ignore start */
                    const br = buf.length === 0
                        ? 0
                        : fs_1.default.readSync(this[_fd], buf, 0, buf.length, null);
                    /* c8 ignore stop */
                    if (!this[_handleChunk](br, buf)) {
                        break;
                    }
                } while (true);
                this[_reading] = false;
            }
            threw = false;
        }
        finally {
            if (threw) {
                this[_close]();
            }
        }
    }
    [_close]() {
        if (this[_autoClose] && typeof this[_fd] === 'number') {
            const fd = this[_fd];
            this[_fd] = undefined;
            fs_1.default.closeSync(fd);
            this.emit('close');
        }
    }
}
exports.ReadStreamSync = ReadStreamSync;
class WriteStream extends events_1.default {
    readable = false;
    writable = true;
    [_errored] = false;
    [_writing] = false;
    [_ended] = false;
    [_queue] = [];
    [_needDrain] = false;
    [_path];
    [_mode];
    [_autoClose];
    [_fd];
    [_defaultFlag];
    [_flags];
    [_finished] = false;
    [_pos];
    constructor(path, opt) {
        opt = opt || {};
        super(opt);
        this[_path] = path;
        this[_fd] = typeof opt.fd === 'number' ? opt.fd : undefined;
        this[_mode] = opt.mode === undefined ? 0o666 : opt.mode;
        this[_pos] = typeof opt.start === 'number' ? opt.start : undefined;
        this[_autoClose] =
            typeof opt.autoClose === 'boolean' ? opt.autoClose : true;
        // truncating makes no sense when writing into the middle
        const defaultFlag = this[_pos] !== undefined ? 'r+' : 'w';
        this[_defaultFlag] = opt.flags === undefined;
        this[_flags] = opt.flags === undefined ? defaultFlag : opt.flags;
        if (this[_fd] === undefined) {
            this[_open]();
        }
    }
    emit(ev, ...args) {
        if (ev === 'error') {
            if (this[_errored]) {
                return false;
            }
            this[_errored] = true;
        }
        return super.emit(ev, ...args);
    }
    get fd() {
        return this[_fd];
    }
    get path() {
        return this[_path];
    }
    [_onerror](er) {
        this[_close]();
        this[_writing] = true;
        this.emit('error', er);
    }
    [_open]() {
        fs_1.default.open(this[_path], this[_flags], this[_mode], (er, fd) => this[_onopen](er, fd));
    }
    [_onopen](er, fd) {
        if (this[_defaultFlag] &&
            this[_flags] === 'r+' &&
            er &&
            er.code === 'ENOENT') {
            this[_flags] = 'w';
            this[_open]();
        }
        else if (er) {
            this[_onerror](er);
        }
        else {
            this[_fd] = fd;
            this.emit('open', fd);
            if (!this[_writing]) {
                this[_flush]();
            }
        }
    }
    end(buf, enc) {
        if (buf) {
            //@ts-ignore
            this.write(buf, enc);
        }
        this[_ended] = true;
        // synthetic after-write logic, where drain/finish live
        if (!this[_writing] &&
            !this[_queue].length &&
            typeof this[_fd] === 'number') {
            this[_onwrite](null, 0);
        }
        return this;
    }
    write(buf, enc) {
        if (typeof buf === 'string') {
            buf = Buffer.from(buf, enc);
        }
        if (this[_ended]) {
            this.emit('error', new Error('write() after end()'));
            return false;
        }
        if (this[_fd] === undefined || this[_writing] || this[_queue].length) {
            this[_queue].push(buf);
            this[_needDrain] = true;
            return false;
        }
        this[_writing] = true;
        this[_write](buf);
        return true;
    }
    [_write](buf) {
        fs_1.default.write(this[_fd], buf, 0, buf.length, this[_pos], (er, bw) => this[_onwrite](er, bw));
    }
    [_onwrite](er, bw) {
        if (er) {
            this[_onerror](er);
        }
        else {
            if (this[_pos] !== undefined && typeof bw === 'number') {
                this[_pos] += bw;
            }
            if (this[_queue].length) {
                this[_flush]();
            }
            else {
                this[_writing] = false;
                if (this[_ended] && !this[_finished]) {
                    this[_finished] = true;
                    this[_close]();
                    this.emit('finish');
                }
                else if (this[_needDrain]) {
                    this[_needDrain] = false;
                    this.emit('drain');
                }
            }
        }
    }
    [_flush]() {
        if (this[_queue].length === 0) {
            if (this[_ended]) {
                this[_onwrite](null, 0);
            }
        }
        else if (this[_queue].length === 1) {
            this[_write](this[_queue].pop());
        }
        else {
            const iovec = this[_queue];
            this[_queue] = [];
            writev(this[_fd], iovec, this[_pos], (er, bw) => this[_onwrite](er, bw));
        }
    }
    [_close]() {
        if (this[_autoClose] && typeof this[_fd] === 'number') {
            const fd = this[_fd];
            this[_fd] = undefined;
            fs_1.default.close(fd, er => er ? this.emit('error', er) : this.emit('close'));
        }
    }
}
exports.WriteStream = WriteStream;
class WriteStreamSync extends WriteStream {
    [_open]() {
        let fd;
        // only wrap in a try{} block if we know we'll retry, to avoid
        // the rethrow obscuring the error's source frame in most cases.
        if (this[_defaultFlag] && this[_flags] === 'r+') {
            try {
                fd = fs_1.default.openSync(this[_path], this[_flags], this[_mode]);
            }
            catch (er) {
                if (er?.code === 'ENOENT') {
                    this[_flags] = 'w';
                    return this[_open]();
                }
                else {
                    throw er;
                }
            }
        }
        else {
            fd = fs_1.default.openSync(this[_path], this[_flags], this[_mode]);
        }
        this[_onopen](null, fd);
    }
    [_close]() {
        if (this[_autoClose] && typeof this[_fd] === 'number') {
            const fd = this[_fd];
            this[_fd] = undefined;
            fs_1.default.closeSync(fd);
            this.emit('close');
        }
    }
    [_write](buf) {
        // throw the original, but try to close if it fails
        let threw = true;
        try {
            this[_onwrite](null, fs_1.default.writeSync(this[_fd], buf, 0, buf.length, this[_pos]));
            threw = false;
        }
        finally {
            if (threw) {
                try {
                    this[_close]();
                }
                catch {
                    // ok error
                }
            }
        }
    }
}
exports.WriteStreamSync = WriteStreamSync;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 235:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.chownrSync = exports.chownr = void 0;
const node_fs_1 = __importDefault(__nccwpck_require__(7561));
const node_path_1 = __importDefault(__nccwpck_require__(9411));
const lchownSync = (path, uid, gid) => {
    try {
        return node_fs_1.default.lchownSync(path, uid, gid);
    }
    catch (er) {
        if (er?.code !== 'ENOENT')
            throw er;
    }
};
const chown = (cpath, uid, gid, cb) => {
    node_fs_1.default.lchown(cpath, uid, gid, er => {
        // Skip ENOENT error
        cb(er && er?.code !== 'ENOENT' ? er : null);
    });
};
const chownrKid = (p, child, uid, gid, cb) => {
    if (child.isDirectory()) {
        (0, exports.chownr)(node_path_1.default.resolve(p, child.name), uid, gid, (er) => {
            if (er)
                return cb(er);
            const cpath = node_path_1.default.resolve(p, child.name);
            chown(cpath, uid, gid, cb);
        });
    }
    else {
        const cpath = node_path_1.default.resolve(p, child.name);
        chown(cpath, uid, gid, cb);
    }
};
const chownr = (p, uid, gid, cb) => {
    node_fs_1.default.readdir(p, { withFileTypes: true }, (er, children) => {
        // any error other than ENOTDIR or ENOTSUP means it's not readable,
        // or doesn't exist.  give up.
        if (er) {
            if (er.code === 'ENOENT')
                return cb();
            else if (er.code !== 'ENOTDIR' && er.code !== 'ENOTSUP')
                return cb(er);
        }
        if (er || !children.length)
            return chown(p, uid, gid, cb);
        let len = children.length;
        let errState = null;
        const then = (er) => {
            /* c8 ignore start */
            if (errState)
                return;
            /* c8 ignore stop */
            if (er)
                return cb((errState = er));
            if (--len === 0)
                return chown(p, uid, gid, cb);
        };
        for (const child of children) {
            chownrKid(p, child, uid, gid, then);
        }
    });
};
exports.chownr = chownr;
const chownrKidSync = (p, child, uid, gid) => {
    if (child.isDirectory())
        (0, exports.chownrSync)(node_path_1.default.resolve(p, child.name), uid, gid);
    lchownSync(node_path_1.default.resolve(p, child.name), uid, gid);
};
const chownrSync = (p, uid, gid) => {
    let children;
    try {
        children = node_fs_1.default.readdirSync(p, { withFileTypes: true });
    }
    catch (er) {
        const e = er;
        if (e?.code === 'ENOENT')
            return;
        else if (e?.code === 'ENOTDIR' || e?.code === 'ENOTSUP')
            return lchownSync(p, uid, gid);
        else
            throw e;
    }
    for (const child of children) {
        chownrKidSync(p, child, uid, gid);
    }
    return lchownSync(p, uid, gid);
};
exports.chownrSync = chownrSync;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 4968:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Minipass = exports.isWritable = exports.isReadable = exports.isStream = void 0;
const proc = typeof process === 'object' && process
    ? process
    : {
        stdout: null,
        stderr: null,
    };
const node_events_1 = __nccwpck_require__(5673);
const node_stream_1 = __importDefault(__nccwpck_require__(4492));
const node_string_decoder_1 = __nccwpck_require__(6915);
/**
 * Return true if the argument is a Minipass stream, Node stream, or something
 * else that Minipass can interact with.
 */
const isStream = (s) => !!s &&
    typeof s === 'object' &&
    (s instanceof Minipass ||
        s instanceof node_stream_1.default ||
        (0, exports.isReadable)(s) ||
        (0, exports.isWritable)(s));
exports.isStream = isStream;
/**
 * Return true if the argument is a valid {@link Minipass.Readable}
 */
const isReadable = (s) => !!s &&
    typeof s === 'object' &&
    s instanceof node_events_1.EventEmitter &&
    typeof s.pipe === 'function' &&
    // node core Writable streams have a pipe() method, but it throws
    s.pipe !== node_stream_1.default.Writable.prototype.pipe;
exports.isReadable = isReadable;
/**
 * Return true if the argument is a valid {@link Minipass.Writable}
 */
const isWritable = (s) => !!s &&
    typeof s === 'object' &&
    s instanceof node_events_1.EventEmitter &&
    typeof s.write === 'function' &&
    typeof s.end === 'function';
exports.isWritable = isWritable;
const EOF = Symbol('EOF');
const MAYBE_EMIT_END = Symbol('maybeEmitEnd');
const EMITTED_END = Symbol('emittedEnd');
const EMITTING_END = Symbol('emittingEnd');
const EMITTED_ERROR = Symbol('emittedError');
const CLOSED = Symbol('closed');
const READ = Symbol('read');
const FLUSH = Symbol('flush');
const FLUSHCHUNK = Symbol('flushChunk');
const ENCODING = Symbol('encoding');
const DECODER = Symbol('decoder');
const FLOWING = Symbol('flowing');
const PAUSED = Symbol('paused');
const RESUME = Symbol('resume');
const BUFFER = Symbol('buffer');
const PIPES = Symbol('pipes');
const BUFFERLENGTH = Symbol('bufferLength');
const BUFFERPUSH = Symbol('bufferPush');
const BUFFERSHIFT = Symbol('bufferShift');
const OBJECTMODE = Symbol('objectMode');
// internal event when stream is destroyed
const DESTROYED = Symbol('destroyed');
// internal event when stream has an error
const ERROR = Symbol('error');
const EMITDATA = Symbol('emitData');
const EMITEND = Symbol('emitEnd');
const EMITEND2 = Symbol('emitEnd2');
const ASYNC = Symbol('async');
const ABORT = Symbol('abort');
const ABORTED = Symbol('aborted');
const SIGNAL = Symbol('signal');
const DATALISTENERS = Symbol('dataListeners');
const DISCARDED = Symbol('discarded');
const defer = (fn) => Promise.resolve().then(fn);
const nodefer = (fn) => fn();
const isEndish = (ev) => ev === 'end' || ev === 'finish' || ev === 'prefinish';
const isArrayBufferLike = (b) => b instanceof ArrayBuffer ||
    (!!b &&
        typeof b === 'object' &&
        b.constructor &&
        b.constructor.name === 'ArrayBuffer' &&
        b.byteLength >= 0);
const isArrayBufferView = (b) => !Buffer.isBuffer(b) && ArrayBuffer.isView(b);
/**
 * Internal class representing a pipe to a destination stream.
 *
 * @internal
 */
class Pipe {
    src;
    dest;
    opts;
    ondrain;
    constructor(src, dest, opts) {
        this.src = src;
        this.dest = dest;
        this.opts = opts;
        this.ondrain = () => src[RESUME]();
        this.dest.on('drain', this.ondrain);
    }
    unpipe() {
        this.dest.removeListener('drain', this.ondrain);
    }
    // only here for the prototype
    /* c8 ignore start */
    proxyErrors(_er) { }
    /* c8 ignore stop */
    end() {
        this.unpipe();
        if (this.opts.end)
            this.dest.end();
    }
}
/**
 * Internal class representing a pipe to a destination stream where
 * errors are proxied.
 *
 * @internal
 */
class PipeProxyErrors extends Pipe {
    unpipe() {
        this.src.removeListener('error', this.proxyErrors);
        super.unpipe();
    }
    constructor(src, dest, opts) {
        super(src, dest, opts);
        this.proxyErrors = er => dest.emit('error', er);
        src.on('error', this.proxyErrors);
    }
}
const isObjectModeOptions = (o) => !!o.objectMode;
const isEncodingOptions = (o) => !o.objectMode && !!o.encoding && o.encoding !== 'buffer';
/**
 * Main export, the Minipass class
 *
 * `RType` is the type of data emitted, defaults to Buffer
 *
 * `WType` is the type of data to be written, if RType is buffer or string,
 * then any {@link Minipass.ContiguousData} is allowed.
 *
 * `Events` is the set of event handler signatures that this object
 * will emit, see {@link Minipass.Events}
 */
class Minipass extends node_events_1.EventEmitter {
    [FLOWING] = false;
    [PAUSED] = false;
    [PIPES] = [];
    [BUFFER] = [];
    [OBJECTMODE];
    [ENCODING];
    [ASYNC];
    [DECODER];
    [EOF] = false;
    [EMITTED_END] = false;
    [EMITTING_END] = false;
    [CLOSED] = false;
    [EMITTED_ERROR] = null;
    [BUFFERLENGTH] = 0;
    [DESTROYED] = false;
    [SIGNAL];
    [ABORTED] = false;
    [DATALISTENERS] = 0;
    [DISCARDED] = false;
    /**
     * true if the stream can be written
     */
    writable = true;
    /**
     * true if the stream can be read
     */
    readable = true;
    /**
     * If `RType` is Buffer, then options do not need to be provided.
     * Otherwise, an options object must be provided to specify either
     * {@link Minipass.SharedOptions.objectMode} or
     * {@link Minipass.SharedOptions.encoding}, as appropriate.
     */
    constructor(...args) {
        const options = (args[0] ||
            {});
        super();
        if (options.objectMode && typeof options.encoding === 'string') {
            throw new TypeError('Encoding and objectMode may not be used together');
        }
        if (isObjectModeOptions(options)) {
            this[OBJECTMODE] = true;
            this[ENCODING] = null;
        }
        else if (isEncodingOptions(options)) {
            this[ENCODING] = options.encoding;
            this[OBJECTMODE] = false;
        }
        else {
            this[OBJECTMODE] = false;
            this[ENCODING] = null;
        }
        this[ASYNC] = !!options.async;
        this[DECODER] = this[ENCODING]
            ? new node_string_decoder_1.StringDecoder(this[ENCODING])
            : null;
        //@ts-ignore - private option for debugging and testing
        if (options && options.debugExposeBuffer === true) {
            Object.defineProperty(this, 'buffer', { get: () => this[BUFFER] });
        }
        //@ts-ignore - private option for debugging and testing
        if (options && options.debugExposePipes === true) {
            Object.defineProperty(this, 'pipes', { get: () => this[PIPES] });
        }
        const { signal } = options;
        if (signal) {
            this[SIGNAL] = signal;
            if (signal.aborted) {
                this[ABORT]();
            }
            else {
                signal.addEventListener('abort', () => this[ABORT]());
            }
        }
    }
    /**
     * The amount of data stored in the buffer waiting to be read.
     *
     * For Buffer strings, this will be the total byte length.
     * For string encoding streams, this will be the string character length,
     * according to JavaScript's `string.length` logic.
     * For objectMode streams, this is a count of the items waiting to be
     * emitted.
     */
    get bufferLength() {
        return this[BUFFERLENGTH];
    }
    /**
     * The `BufferEncoding` currently in use, or `null`
     */
    get encoding() {
        return this[ENCODING];
    }
    /**
     * @deprecated - This is a read only property
     */
    set encoding(_enc) {
        throw new Error('Encoding must be set at instantiation time');
    }
    /**
     * @deprecated - Encoding may only be set at instantiation time
     */
    setEncoding(_enc) {
        throw new Error('Encoding must be set at instantiation time');
    }
    /**
     * True if this is an objectMode stream
     */
    get objectMode() {
        return this[OBJECTMODE];
    }
    /**
     * @deprecated - This is a read-only property
     */
    set objectMode(_om) {
        throw new Error('objectMode must be set at instantiation time');
    }
    /**
     * true if this is an async stream
     */
    get ['async']() {
        return this[ASYNC];
    }
    /**
     * Set to true to make this stream async.
     *
     * Once set, it cannot be unset, as this would potentially cause incorrect
     * behavior.  Ie, a sync stream can be made async, but an async stream
     * cannot be safely made sync.
     */
    set ['async'](a) {
        this[ASYNC] = this[ASYNC] || !!a;
    }
    // drop everything and get out of the flow completely
    [ABORT]() {
        this[ABORTED] = true;
        this.emit('abort', this[SIGNAL]?.reason);
        this.destroy(this[SIGNAL]?.reason);
    }
    /**
     * True if the stream has been aborted.
     */
    get aborted() {
        return this[ABORTED];
    }
    /**
     * No-op setter. Stream aborted status is set via the AbortSignal provided
     * in the constructor options.
     */
    set aborted(_) { }
    write(chunk, encoding, cb) {
        if (this[ABORTED])
            return false;
        if (this[EOF])
            throw new Error('write after end');
        if (this[DESTROYED]) {
            this.emit('error', Object.assign(new Error('Cannot call write after a stream was destroyed'), { code: 'ERR_STREAM_DESTROYED' }));
            return true;
        }
        if (typeof encoding === 'function') {
            cb = encoding;
            encoding = 'utf8';
        }
        if (!encoding)
            encoding = 'utf8';
        const fn = this[ASYNC] ? defer : nodefer;
        // convert array buffers and typed array views into buffers
        // at some point in the future, we may want to do the opposite!
        // leave strings and buffers as-is
        // anything is only allowed if in object mode, so throw
        if (!this[OBJECTMODE] && !Buffer.isBuffer(chunk)) {
            if (isArrayBufferView(chunk)) {
                //@ts-ignore - sinful unsafe type changing
                chunk = Buffer.from(chunk.buffer, chunk.byteOffset, chunk.byteLength);
            }
            else if (isArrayBufferLike(chunk)) {
                //@ts-ignore - sinful unsafe type changing
                chunk = Buffer.from(chunk);
            }
            else if (typeof chunk !== 'string') {
                throw new Error('Non-contiguous data written to non-objectMode stream');
            }
        }
        // handle object mode up front, since it's simpler
        // this yields better performance, fewer checks later.
        if (this[OBJECTMODE]) {
            // maybe impossible?
            /* c8 ignore start */
            if (this[FLOWING] && this[BUFFERLENGTH] !== 0)
                this[FLUSH](true);
            /* c8 ignore stop */
            if (this[FLOWING])
                this.emit('data', chunk);
            else
                this[BUFFERPUSH](chunk);
            if (this[BUFFERLENGTH] !== 0)
                this.emit('readable');
            if (cb)
                fn(cb);
            return this[FLOWING];
        }
        // at this point the chunk is a buffer or string
        // don't buffer it up or send it to the decoder
        if (!chunk.length) {
            if (this[BUFFERLENGTH] !== 0)
                this.emit('readable');
            if (cb)
                fn(cb);
            return this[FLOWING];
        }
        // fast-path writing strings of same encoding to a stream with
        // an empty buffer, skipping the buffer/decoder dance
        if (typeof chunk === 'string' &&
            // unless it is a string already ready for us to use
            !(encoding === this[ENCODING] && !this[DECODER]?.lastNeed)) {
            //@ts-ignore - sinful unsafe type change
            chunk = Buffer.from(chunk, encoding);
        }
        if (Buffer.isBuffer(chunk) && this[ENCODING]) {
            //@ts-ignore - sinful unsafe type change
            chunk = this[DECODER].write(chunk);
        }
        // Note: flushing CAN potentially switch us into not-flowing mode
        if (this[FLOWING] && this[BUFFERLENGTH] !== 0)
            this[FLUSH](true);
        if (this[FLOWING])
            this.emit('data', chunk);
        else
            this[BUFFERPUSH](chunk);
        if (this[BUFFERLENGTH] !== 0)
            this.emit('readable');
        if (cb)
            fn(cb);
        return this[FLOWING];
    }
    /**
     * Low-level explicit read method.
     *
     * In objectMode, the argument is ignored, and one item is returned if
     * available.
     *
     * `n` is the number of bytes (or in the case of encoding streams,
     * characters) to consume. If `n` is not provided, then the entire buffer
     * is returned, or `null` is returned if no data is available.
     *
     * If `n` is greater that the amount of data in the internal buffer,
     * then `null` is returned.
     */
    read(n) {
        if (this[DESTROYED])
            return null;
        this[DISCARDED] = false;
        if (this[BUFFERLENGTH] === 0 ||
            n === 0 ||
            (n && n > this[BUFFERLENGTH])) {
            this[MAYBE_EMIT_END]();
            return null;
        }
        if (this[OBJECTMODE])
            n = null;
        if (this[BUFFER].length > 1 && !this[OBJECTMODE]) {
            // not object mode, so if we have an encoding, then RType is string
            // otherwise, must be Buffer
            this[BUFFER] = [
                (this[ENCODING]
                    ? this[BUFFER].join('')
                    : Buffer.concat(this[BUFFER], this[BUFFERLENGTH])),
            ];
        }
        const ret = this[READ](n || null, this[BUFFER][0]);
        this[MAYBE_EMIT_END]();
        return ret;
    }
    [READ](n, chunk) {
        if (this[OBJECTMODE])
            this[BUFFERSHIFT]();
        else {
            const c = chunk;
            if (n === c.length || n === null)
                this[BUFFERSHIFT]();
            else if (typeof c === 'string') {
                this[BUFFER][0] = c.slice(n);
                chunk = c.slice(0, n);
                this[BUFFERLENGTH] -= n;
            }
            else {
                this[BUFFER][0] = c.subarray(n);
                chunk = c.subarray(0, n);
                this[BUFFERLENGTH] -= n;
            }
        }
        this.emit('data', chunk);
        if (!this[BUFFER].length && !this[EOF])
            this.emit('drain');
        return chunk;
    }
    end(chunk, encoding, cb) {
        if (typeof chunk === 'function') {
            cb = chunk;
            chunk = undefined;
        }
        if (typeof encoding === 'function') {
            cb = encoding;
            encoding = 'utf8';
        }
        if (chunk !== undefined)
            this.write(chunk, encoding);
        if (cb)
            this.once('end', cb);
        this[EOF] = true;
        this.writable = false;
        // if we haven't written anything, then go ahead and emit,
        // even if we're not reading.
        // we'll re-emit if a new 'end' listener is added anyway.
        // This makes MP more suitable to write-only use cases.
        if (this[FLOWING] || !this[PAUSED])
            this[MAYBE_EMIT_END]();
        return this;
    }
    // don't let the internal resume be overwritten
    [RESUME]() {
        if (this[DESTROYED])
            return;
        if (!this[DATALISTENERS] && !this[PIPES].length) {
            this[DISCARDED] = true;
        }
        this[PAUSED] = false;
        this[FLOWING] = true;
        this.emit('resume');
        if (this[BUFFER].length)
            this[FLUSH]();
        else if (this[EOF])
            this[MAYBE_EMIT_END]();
        else
            this.emit('drain');
    }
    /**
     * Resume the stream if it is currently in a paused state
     *
     * If called when there are no pipe destinations or `data` event listeners,
     * this will place the stream in a "discarded" state, where all data will
     * be thrown away. The discarded state is removed if a pipe destination or
     * data handler is added, if pause() is called, or if any synchronous or
     * asynchronous iteration is started.
     */
    resume() {
        return this[RESUME]();
    }
    /**
     * Pause the stream
     */
    pause() {
        this[FLOWING] = false;
        this[PAUSED] = true;
        this[DISCARDED] = false;
    }
    /**
     * true if the stream has been forcibly destroyed
     */
    get destroyed() {
        return this[DESTROYED];
    }
    /**
     * true if the stream is currently in a flowing state, meaning that
     * any writes will be immediately emitted.
     */
    get flowing() {
        return this[FLOWING];
    }
    /**
     * true if the stream is currently in a paused state
     */
    get paused() {
        return this[PAUSED];
    }
    [BUFFERPUSH](chunk) {
        if (this[OBJECTMODE])
            this[BUFFERLENGTH] += 1;
        else
            this[BUFFERLENGTH] += chunk.length;
        this[BUFFER].push(chunk);
    }
    [BUFFERSHIFT]() {
        if (this[OBJECTMODE])
            this[BUFFERLENGTH] -= 1;
        else
            this[BUFFERLENGTH] -= this[BUFFER][0].length;
        return this[BUFFER].shift();
    }
    [FLUSH](noDrain = false) {
        do { } while (this[FLUSHCHUNK](this[BUFFERSHIFT]()) &&
            this[BUFFER].length);
        if (!noDrain && !this[BUFFER].length && !this[EOF])
            this.emit('drain');
    }
    [FLUSHCHUNK](chunk) {
        this.emit('data', chunk);
        return this[FLOWING];
    }
    /**
     * Pipe all data emitted by this stream into the destination provided.
     *
     * Triggers the flow of data.
     */
    pipe(dest, opts) {
        if (this[DESTROYED])
            return dest;
        this[DISCARDED] = false;
        const ended = this[EMITTED_END];
        opts = opts || {};
        if (dest === proc.stdout || dest === proc.stderr)
            opts.end = false;
        else
            opts.end = opts.end !== false;
        opts.proxyErrors = !!opts.proxyErrors;
        // piping an ended stream ends immediately
        if (ended) {
            if (opts.end)
                dest.end();
        }
        else {
            // "as" here just ignores the WType, which pipes don't care about,
            // since they're only consuming from us, and writing to the dest
            this[PIPES].push(!opts.proxyErrors
                ? new Pipe(this, dest, opts)
                : new PipeProxyErrors(this, dest, opts));
            if (this[ASYNC])
                defer(() => this[RESUME]());
            else
                this[RESUME]();
        }
        return dest;
    }
    /**
     * Fully unhook a piped destination stream.
     *
     * If the destination stream was the only consumer of this stream (ie,
     * there are no other piped destinations or `'data'` event listeners)
     * then the flow of data will stop until there is another consumer or
     * {@link Minipass#resume} is explicitly called.
     */
    unpipe(dest) {
        const p = this[PIPES].find(p => p.dest === dest);
        if (p) {
            if (this[PIPES].length === 1) {
                if (this[FLOWING] && this[DATALISTENERS] === 0) {
                    this[FLOWING] = false;
                }
                this[PIPES] = [];
            }
            else
                this[PIPES].splice(this[PIPES].indexOf(p), 1);
            p.unpipe();
        }
    }
    /**
     * Alias for {@link Minipass#on}
     */
    addListener(ev, handler) {
        return this.on(ev, handler);
    }
    /**
     * Mostly identical to `EventEmitter.on`, with the following
     * behavior differences to prevent data loss and unnecessary hangs:
     *
     * - Adding a 'data' event handler will trigger the flow of data
     *
     * - Adding a 'readable' event handler when there is data waiting to be read
     *   will cause 'readable' to be emitted immediately.
     *
     * - Adding an 'endish' event handler ('end', 'finish', etc.) which has
     *   already passed will cause the event to be emitted immediately and all
     *   handlers removed.
     *
     * - Adding an 'error' event handler after an error has been emitted will
     *   cause the event to be re-emitted immediately with the error previously
     *   raised.
     */
    on(ev, handler) {
        const ret = super.on(ev, handler);
        if (ev === 'data') {
            this[DISCARDED] = false;
            this[DATALISTENERS]++;
            if (!this[PIPES].length && !this[FLOWING]) {
                this[RESUME]();
            }
        }
        else if (ev === 'readable' && this[BUFFERLENGTH] !== 0) {
            super.emit('readable');
        }
        else if (isEndish(ev) && this[EMITTED_END]) {
            super.emit(ev);
            this.removeAllListeners(ev);
        }
        else if (ev === 'error' && this[EMITTED_ERROR]) {
            const h = handler;
            if (this[ASYNC])
                defer(() => h.call(this, this[EMITTED_ERROR]));
            else
                h.call(this, this[EMITTED_ERROR]);
        }
        return ret;
    }
    /**
     * Alias for {@link Minipass#off}
     */
    removeListener(ev, handler) {
        return this.off(ev, handler);
    }
    /**
     * Mostly identical to `EventEmitter.off`
     *
     * If a 'data' event handler is removed, and it was the last consumer
     * (ie, there are no pipe destinations or other 'data' event listeners),
     * then the flow of data will stop until there is another consumer or
     * {@link Minipass#resume} is explicitly called.
     */
    off(ev, handler) {
        const ret = super.off(ev, handler);
        // if we previously had listeners, and now we don't, and we don't
        // have any pipes, then stop the flow, unless it's been explicitly
        // put in a discarded flowing state via stream.resume().
        if (ev === 'data') {
            this[DATALISTENERS] = this.listeners('data').length;
            if (this[DATALISTENERS] === 0 &&
                !this[DISCARDED] &&
                !this[PIPES].length) {
                this[FLOWING] = false;
            }
        }
        return ret;
    }
    /**
     * Mostly identical to `EventEmitter.removeAllListeners`
     *
     * If all 'data' event handlers are removed, and they were the last consumer
     * (ie, there are no pipe destinations), then the flow of data will stop
     * until there is another consumer or {@link Minipass#resume} is explicitly
     * called.
     */
    removeAllListeners(ev) {
        const ret = super.removeAllListeners(ev);
        if (ev === 'data' || ev === undefined) {
            this[DATALISTENERS] = 0;
            if (!this[DISCARDED] && !this[PIPES].length) {
                this[FLOWING] = false;
            }
        }
        return ret;
    }
    /**
     * true if the 'end' event has been emitted
     */
    get emittedEnd() {
        return this[EMITTED_END];
    }
    [MAYBE_EMIT_END]() {
        if (!this[EMITTING_END] &&
            !this[EMITTED_END] &&
            !this[DESTROYED] &&
            this[BUFFER].length === 0 &&
            this[EOF]) {
            this[EMITTING_END] = true;
            this.emit('end');
            this.emit('prefinish');
            this.emit('finish');
            if (this[CLOSED])
                this.emit('close');
            this[EMITTING_END] = false;
        }
    }
    /**
     * Mostly identical to `EventEmitter.emit`, with the following
     * behavior differences to prevent data loss and unnecessary hangs:
     *
     * If the stream has been destroyed, and the event is something other
     * than 'close' or 'error', then `false` is returned and no handlers
     * are called.
     *
     * If the event is 'end', and has already been emitted, then the event
     * is ignored. If the stream is in a paused or non-flowing state, then
     * the event will be deferred until data flow resumes. If the stream is
     * async, then handlers will be called on the next tick rather than
     * immediately.
     *
     * If the event is 'close', and 'end' has not yet been emitted, then
     * the event will be deferred until after 'end' is emitted.
     *
     * If the event is 'error', and an AbortSignal was provided for the stream,
     * and there are no listeners, then the event is ignored, matching the
     * behavior of node core streams in the presense of an AbortSignal.
     *
     * If the event is 'finish' or 'prefinish', then all listeners will be
     * removed after emitting the event, to prevent double-firing.
     */
    emit(ev, ...args) {
        const data = args[0];
        // error and close are only events allowed after calling destroy()
        if (ev !== 'error' &&
            ev !== 'close' &&
            ev !== DESTROYED &&
            this[DESTROYED]) {
            return false;
        }
        else if (ev === 'data') {
            return !this[OBJECTMODE] && !data
                ? false
                : this[ASYNC]
                    ? (defer(() => this[EMITDATA](data)), true)
                    : this[EMITDATA](data);
        }
        else if (ev === 'end') {
            return this[EMITEND]();
        }
        else if (ev === 'close') {
            this[CLOSED] = true;
            // don't emit close before 'end' and 'finish'
            if (!this[EMITTED_END] && !this[DESTROYED])
                return false;
            const ret = super.emit('close');
            this.removeAllListeners('close');
            return ret;
        }
        else if (ev === 'error') {
            this[EMITTED_ERROR] = data;
            super.emit(ERROR, data);
            const ret = !this[SIGNAL] || this.listeners('error').length
                ? super.emit('error', data)
                : false;
            this[MAYBE_EMIT_END]();
            return ret;
        }
        else if (ev === 'resume') {
            const ret = super.emit('resume');
            this[MAYBE_EMIT_END]();
            return ret;
        }
        else if (ev === 'finish' || ev === 'prefinish') {
            const ret = super.emit(ev);
            this.removeAllListeners(ev);
            return ret;
        }
        // Some other unknown event
        const ret = super.emit(ev, ...args);
        this[MAYBE_EMIT_END]();
        return ret;
    }
    [EMITDATA](data) {
        for (const p of this[PIPES]) {
            if (p.dest.write(data) === false)
                this.pause();
        }
        const ret = this[DISCARDED] ? false : super.emit('data', data);
        this[MAYBE_EMIT_END]();
        return ret;
    }
    [EMITEND]() {
        if (this[EMITTED_END])
            return false;
        this[EMITTED_END] = true;
        this.readable = false;
        return this[ASYNC]
            ? (defer(() => this[EMITEND2]()), true)
            : this[EMITEND2]();
    }
    [EMITEND2]() {
        if (this[DECODER]) {
            const data = this[DECODER].end();
            if (data) {
                for (const p of this[PIPES]) {
                    p.dest.write(data);
                }
                if (!this[DISCARDED])
                    super.emit('data', data);
            }
        }
        for (const p of this[PIPES]) {
            p.end();
        }
        const ret = super.emit('end');
        this.removeAllListeners('end');
        return ret;
    }
    /**
     * Return a Promise that resolves to an array of all emitted data once
     * the stream ends.
     */
    async collect() {
        const buf = Object.assign([], {
            dataLength: 0,
        });
        if (!this[OBJECTMODE])
            buf.dataLength = 0;
        // set the promise first, in case an error is raised
        // by triggering the flow here.
        const p = this.promise();
        this.on('data', c => {
            buf.push(c);
            if (!this[OBJECTMODE])
                buf.dataLength += c.length;
        });
        await p;
        return buf;
    }
    /**
     * Return a Promise that resolves to the concatenation of all emitted data
     * once the stream ends.
     *
     * Not allowed on objectMode streams.
     */
    async concat() {
        if (this[OBJECTMODE]) {
            throw new Error('cannot concat in objectMode');
        }
        const buf = await this.collect();
        return (this[ENCODING]
            ? buf.join('')
            : Buffer.concat(buf, buf.dataLength));
    }
    /**
     * Return a void Promise that resolves once the stream ends.
     */
    async promise() {
        return new Promise((resolve, reject) => {
            this.on(DESTROYED, () => reject(new Error('stream destroyed')));
            this.on('error', er => reject(er));
            this.on('end', () => resolve());
        });
    }
    /**
     * Asynchronous `for await of` iteration.
     *
     * This will continue emitting all chunks until the stream terminates.
     */
    [Symbol.asyncIterator]() {
        // set this up front, in case the consumer doesn't call next()
        // right away.
        this[DISCARDED] = false;
        let stopped = false;
        const stop = async () => {
            this.pause();
            stopped = true;
            return { value: undefined, done: true };
        };
        const next = () => {
            if (stopped)
                return stop();
            const res = this.read();
            if (res !== null)
                return Promise.resolve({ done: false, value: res });
            if (this[EOF])
                return stop();
            let resolve;
            let reject;
            const onerr = (er) => {
                this.off('data', ondata);
                this.off('end', onend);
                this.off(DESTROYED, ondestroy);
                stop();
                reject(er);
            };
            const ondata = (value) => {
                this.off('error', onerr);
                this.off('end', onend);
                this.off(DESTROYED, ondestroy);
                this.pause();
                resolve({ value, done: !!this[EOF] });
            };
            const onend = () => {
                this.off('error', onerr);
                this.off('data', ondata);
                this.off(DESTROYED, ondestroy);
                stop();
                resolve({ done: true, value: undefined });
            };
            const ondestroy = () => onerr(new Error('stream destroyed'));
            return new Promise((res, rej) => {
                reject = rej;
                resolve = res;
                this.once(DESTROYED, ondestroy);
                this.once('error', onerr);
                this.once('end', onend);
                this.once('data', ondata);
            });
        };
        return {
            next,
            throw: stop,
            return: stop,
            [Symbol.asyncIterator]() {
                return this;
            },
        };
    }
    /**
     * Synchronous `for of` iteration.
     *
     * The iteration will terminate when the internal buffer runs out, even
     * if the stream has not yet terminated.
     */
    [Symbol.iterator]() {
        // set this up front, in case the consumer doesn't call next()
        // right away.
        this[DISCARDED] = false;
        let stopped = false;
        const stop = () => {
            this.pause();
            this.off(ERROR, stop);
            this.off(DESTROYED, stop);
            this.off('end', stop);
            stopped = true;
            return { done: true, value: undefined };
        };
        const next = () => {
            if (stopped)
                return stop();
            const value = this.read();
            return value === null ? stop() : { done: false, value };
        };
        this.once('end', stop);
        this.once(ERROR, stop);
        this.once(DESTROYED, stop);
        return {
            next,
            throw: stop,
            return: stop,
            [Symbol.iterator]() {
                return this;
            },
        };
    }
    /**
     * Destroy a stream, preventing it from being used for any further purpose.
     *
     * If the stream has a `close()` method, then it will be called on
     * destruction.
     *
     * After destruction, any attempt to write data, read data, or emit most
     * events will be ignored.
     *
     * If an error argument is provided, then it will be emitted in an
     * 'error' event.
     */
    destroy(er) {
        if (this[DESTROYED]) {
            if (er)
                this.emit('error', er);
            else
                this.emit(DESTROYED);
            return this;
        }
        this[DESTROYED] = true;
        this[DISCARDED] = true;
        // throw away all buffered data, it's never coming out
        this[BUFFER].length = 0;
        this[BUFFERLENGTH] = 0;
        const wc = this;
        if (typeof wc.close === 'function' && !this[CLOSED])
            wc.close();
        if (er)
            this.emit('error', er);
        // if no error to emit, still reject pending promises
        else
            this.emit(DESTROYED);
        return this;
    }
    /**
     * Alias for {@link isStream}
     *
     * Former export location, maintained for backwards compatibility.
     *
     * @deprecated
     */
    static get isStream() {
        return exports.isStream;
    }
}
exports.Minipass = Minipass;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 499:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.constants = void 0;
// Update with any zlib constants that are added or changed in the future.
// Node v6 didn't export this, so we just hard code the version and rely
// on all the other hard-coded values from zlib v4736.  When node v6
// support drops, we can just export the realZlibConstants object.
const zlib_1 = __importDefault(__nccwpck_require__(9796));
/* c8 ignore start */
const realZlibConstants = zlib_1.default.constants || { ZLIB_VERNUM: 4736 };
/* c8 ignore stop */
exports.constants = Object.freeze(Object.assign(Object.create(null), {
    Z_NO_FLUSH: 0,
    Z_PARTIAL_FLUSH: 1,
    Z_SYNC_FLUSH: 2,
    Z_FULL_FLUSH: 3,
    Z_FINISH: 4,
    Z_BLOCK: 5,
    Z_OK: 0,
    Z_STREAM_END: 1,
    Z_NEED_DICT: 2,
    Z_ERRNO: -1,
    Z_STREAM_ERROR: -2,
    Z_DATA_ERROR: -3,
    Z_MEM_ERROR: -4,
    Z_BUF_ERROR: -5,
    Z_VERSION_ERROR: -6,
    Z_NO_COMPRESSION: 0,
    Z_BEST_SPEED: 1,
    Z_BEST_COMPRESSION: 9,
    Z_DEFAULT_COMPRESSION: -1,
    Z_FILTERED: 1,
    Z_HUFFMAN_ONLY: 2,
    Z_RLE: 3,
    Z_FIXED: 4,
    Z_DEFAULT_STRATEGY: 0,
    DEFLATE: 1,
    INFLATE: 2,
    GZIP: 3,
    GUNZIP: 4,
    DEFLATERAW: 5,
    INFLATERAW: 6,
    UNZIP: 7,
    BROTLI_DECODE: 8,
    BROTLI_ENCODE: 9,
    Z_MIN_WINDOWBITS: 8,
    Z_MAX_WINDOWBITS: 15,
    Z_DEFAULT_WINDOWBITS: 15,
    Z_MIN_CHUNK: 64,
    Z_MAX_CHUNK: Infinity,
    Z_DEFAULT_CHUNK: 16384,
    Z_MIN_MEMLEVEL: 1,
    Z_MAX_MEMLEVEL: 9,
    Z_DEFAULT_MEMLEVEL: 8,
    Z_MIN_LEVEL: -1,
    Z_MAX_LEVEL: 9,
    Z_DEFAULT_LEVEL: -1,
    BROTLI_OPERATION_PROCESS: 0,
    BROTLI_OPERATION_FLUSH: 1,
    BROTLI_OPERATION_FINISH: 2,
    BROTLI_OPERATION_EMIT_METADATA: 3,
    BROTLI_MODE_GENERIC: 0,
    BROTLI_MODE_TEXT: 1,
    BROTLI_MODE_FONT: 2,
    BROTLI_DEFAULT_MODE: 0,
    BROTLI_MIN_QUALITY: 0,
    BROTLI_MAX_QUALITY: 11,
    BROTLI_DEFAULT_QUALITY: 11,
    BROTLI_MIN_WINDOW_BITS: 10,
    BROTLI_MAX_WINDOW_BITS: 24,
    BROTLI_LARGE_MAX_WINDOW_BITS: 30,
    BROTLI_DEFAULT_WINDOW: 22,
    BROTLI_MIN_INPUT_BLOCK_BITS: 16,
    BROTLI_MAX_INPUT_BLOCK_BITS: 24,
    BROTLI_PARAM_MODE: 0,
    BROTLI_PARAM_QUALITY: 1,
    BROTLI_PARAM_LGWIN: 2,
    BROTLI_PARAM_LGBLOCK: 3,
    BROTLI_PARAM_DISABLE_LITERAL_CONTEXT_MODELING: 4,
    BROTLI_PARAM_SIZE_HINT: 5,
    BROTLI_PARAM_LARGE_WINDOW: 6,
    BROTLI_PARAM_NPOSTFIX: 7,
    BROTLI_PARAM_NDIRECT: 8,
    BROTLI_DECODER_RESULT_ERROR: 0,
    BROTLI_DECODER_RESULT_SUCCESS: 1,
    BROTLI_DECODER_RESULT_NEEDS_MORE_INPUT: 2,
    BROTLI_DECODER_RESULT_NEEDS_MORE_OUTPUT: 3,
    BROTLI_DECODER_PARAM_DISABLE_RING_BUFFER_REALLOCATION: 0,
    BROTLI_DECODER_PARAM_LARGE_WINDOW: 1,
    BROTLI_DECODER_NO_ERROR: 0,
    BROTLI_DECODER_SUCCESS: 1,
    BROTLI_DECODER_NEEDS_MORE_INPUT: 2,
    BROTLI_DECODER_NEEDS_MORE_OUTPUT: 3,
    BROTLI_DECODER_ERROR_FORMAT_EXUBERANT_NIBBLE: -1,
    BROTLI_DECODER_ERROR_FORMAT_RESERVED: -2,
    BROTLI_DECODER_ERROR_FORMAT_EXUBERANT_META_NIBBLE: -3,
    BROTLI_DECODER_ERROR_FORMAT_SIMPLE_HUFFMAN_ALPHABET: -4,
    BROTLI_DECODER_ERROR_FORMAT_SIMPLE_HUFFMAN_SAME: -5,
    BROTLI_DECODER_ERROR_FORMAT_CL_SPACE: -6,
    BROTLI_DECODER_ERROR_FORMAT_HUFFMAN_SPACE: -7,
    BROTLI_DECODER_ERROR_FORMAT_CONTEXT_MAP_REPEAT: -8,
    BROTLI_DECODER_ERROR_FORMAT_BLOCK_LENGTH_1: -9,
    BROTLI_DECODER_ERROR_FORMAT_BLOCK_LENGTH_2: -10,
    BROTLI_DECODER_ERROR_FORMAT_TRANSFORM: -11,
    BROTLI_DECODER_ERROR_FORMAT_DICTIONARY: -12,
    BROTLI_DECODER_ERROR_FORMAT_WINDOW_BITS: -13,
    BROTLI_DECODER_ERROR_FORMAT_PADDING_1: -14,
    BROTLI_DECODER_ERROR_FORMAT_PADDING_2: -15,
    BROTLI_DECODER_ERROR_FORMAT_DISTANCE: -16,
    BROTLI_DECODER_ERROR_DICTIONARY_NOT_SET: -19,
    BROTLI_DECODER_ERROR_INVALID_ARGUMENTS: -20,
    BROTLI_DECODER_ERROR_ALLOC_CONTEXT_MODES: -21,
    BROTLI_DECODER_ERROR_ALLOC_TREE_GROUPS: -22,
    BROTLI_DECODER_ERROR_ALLOC_CONTEXT_MAP: -25,
    BROTLI_DECODER_ERROR_ALLOC_RING_BUFFER_1: -26,
    BROTLI_DECODER_ERROR_ALLOC_RING_BUFFER_2: -27,
    BROTLI_DECODER_ERROR_ALLOC_BLOCK_TYPE_TREES: -30,
    BROTLI_DECODER_ERROR_UNREACHABLE: -31,
}, realZlibConstants));
//# sourceMappingURL=constants.js.map

/***/ }),

/***/ 6139:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BrotliDecompress = exports.BrotliCompress = exports.Brotli = exports.Unzip = exports.InflateRaw = exports.DeflateRaw = exports.Gunzip = exports.Gzip = exports.Inflate = exports.Deflate = exports.Zlib = exports.ZlibError = exports.constants = void 0;
const assert_1 = __importDefault(__nccwpck_require__(9491));
const buffer_1 = __nccwpck_require__(4300);
const minipass_1 = __nccwpck_require__(4968);
const zlib_1 = __importDefault(__nccwpck_require__(9796));
const constants_js_1 = __nccwpck_require__(499);
var constants_js_2 = __nccwpck_require__(499);
Object.defineProperty(exports, "constants", ({ enumerable: true, get: function () { return constants_js_2.constants; } }));
const OriginalBufferConcat = buffer_1.Buffer.concat;
const _superWrite = Symbol('_superWrite');
class ZlibError extends Error {
    code;
    errno;
    constructor(err) {
        super('zlib: ' + err.message);
        this.code = err.code;
        this.errno = err.errno;
        /* c8 ignore next */
        if (!this.code)
            this.code = 'ZLIB_ERROR';
        this.message = 'zlib: ' + err.message;
        Error.captureStackTrace(this, this.constructor);
    }
    get name() {
        return 'ZlibError';
    }
}
exports.ZlibError = ZlibError;
// the Zlib class they all inherit from
// This thing manages the queue of requests, and returns
// true or false if there is anything in the queue when
// you call the .write() method.
const _flushFlag = Symbol('flushFlag');
class ZlibBase extends minipass_1.Minipass {
    #sawError = false;
    #ended = false;
    #flushFlag;
    #finishFlushFlag;
    #fullFlushFlag;
    #handle;
    #onError;
    get sawError() {
        return this.#sawError;
    }
    get handle() {
        return this.#handle;
    }
    /* c8 ignore start */
    get flushFlag() {
        return this.#flushFlag;
    }
    /* c8 ignore stop */
    constructor(opts, mode) {
        if (!opts || typeof opts !== 'object')
            throw new TypeError('invalid options for ZlibBase constructor');
        //@ts-ignore
        super(opts);
        /* c8 ignore start */
        this.#flushFlag = opts.flush ?? 0;
        this.#finishFlushFlag = opts.finishFlush ?? 0;
        this.#fullFlushFlag = opts.fullFlushFlag ?? 0;
        /* c8 ignore stop */
        // this will throw if any options are invalid for the class selected
        try {
            // @types/node doesn't know that it exports the classes, but they're there
            //@ts-ignore
            this.#handle = new zlib_1.default[mode](opts);
        }
        catch (er) {
            // make sure that all errors get decorated properly
            throw new ZlibError(er);
        }
        this.#onError = err => {
            // no sense raising multiple errors, since we abort on the first one.
            if (this.#sawError)
                return;
            this.#sawError = true;
            // there is no way to cleanly recover.
            // continuing only obscures problems.
            this.close();
            this.emit('error', err);
        };
        this.#handle?.on('error', er => this.#onError(new ZlibError(er)));
        this.once('end', () => this.close);
    }
    close() {
        if (this.#handle) {
            this.#handle.close();
            this.#handle = undefined;
            this.emit('close');
        }
    }
    reset() {
        if (!this.#sawError) {
            (0, assert_1.default)(this.#handle, 'zlib binding closed');
            //@ts-ignore
            return this.#handle.reset?.();
        }
    }
    flush(flushFlag) {
        if (this.ended)
            return;
        if (typeof flushFlag !== 'number')
            flushFlag = this.#fullFlushFlag;
        this.write(Object.assign(buffer_1.Buffer.alloc(0), { [_flushFlag]: flushFlag }));
    }
    end(chunk, encoding, cb) {
        /* c8 ignore start */
        if (typeof chunk === 'function') {
            cb = chunk;
            encoding = undefined;
            chunk = undefined;
        }
        if (typeof encoding === 'function') {
            cb = encoding;
            encoding = undefined;
        }
        /* c8 ignore stop */
        if (chunk) {
            if (encoding)
                this.write(chunk, encoding);
            else
                this.write(chunk);
        }
        this.flush(this.#finishFlushFlag);
        this.#ended = true;
        return super.end(cb);
    }
    get ended() {
        return this.#ended;
    }
    // overridden in the gzip classes to do portable writes
    [_superWrite](data) {
        return super.write(data);
    }
    write(chunk, encoding, cb) {
        // process the chunk using the sync process
        // then super.write() all the outputted chunks
        if (typeof encoding === 'function')
            (cb = encoding), (encoding = 'utf8');
        if (typeof chunk === 'string')
            chunk = buffer_1.Buffer.from(chunk, encoding);
        if (this.#sawError)
            return;
        (0, assert_1.default)(this.#handle, 'zlib binding closed');
        // _processChunk tries to .close() the native handle after it's done, so we
        // intercept that by temporarily making it a no-op.
        // diving into the node:zlib internals a bit here
        const nativeHandle = this.#handle
            ._handle;
        const originalNativeClose = nativeHandle.close;
        nativeHandle.close = () => { };
        const originalClose = this.#handle.close;
        this.#handle.close = () => { };
        // It also calls `Buffer.concat()` at the end, which may be convenient
        // for some, but which we are not interested in as it slows us down.
        buffer_1.Buffer.concat = args => args;
        let result = undefined;
        try {
            const flushFlag = typeof chunk[_flushFlag] === 'number'
                ? chunk[_flushFlag]
                : this.#flushFlag;
            result = this.#handle._processChunk(chunk, flushFlag);
            // if we don't throw, reset it back how it was
            buffer_1.Buffer.concat = OriginalBufferConcat;
        }
        catch (err) {
            // or if we do, put Buffer.concat() back before we emit error
            // Error events call into user code, which may call Buffer.concat()
            buffer_1.Buffer.concat = OriginalBufferConcat;
            this.#onError(new ZlibError(err));
        }
        finally {
            if (this.#handle) {
                // Core zlib resets `_handle` to null after attempting to close the
                // native handle. Our no-op handler prevented actual closure, but we
                // need to restore the `._handle` property.
                ;
                this.#handle._handle =
                    nativeHandle;
                nativeHandle.close = originalNativeClose;
                this.#handle.close = originalClose;
                // `_processChunk()` adds an 'error' listener. If we don't remove it
                // after each call, these handlers start piling up.
                this.#handle.removeAllListeners('error');
                // make sure OUR error listener is still attached tho
            }
        }
        if (this.#handle)
            this.#handle.on('error', er => this.#onError(new ZlibError(er)));
        let writeReturn;
        if (result) {
            if (Array.isArray(result) && result.length > 0) {
                const r = result[0];
                // The first buffer is always `handle._outBuffer`, which would be
                // re-used for later invocations; so, we always have to copy that one.
                writeReturn = this[_superWrite](buffer_1.Buffer.from(r));
                for (let i = 1; i < result.length; i++) {
                    writeReturn = this[_superWrite](result[i]);
                }
            }
            else {
                // either a single Buffer or an empty array
                writeReturn = this[_superWrite](buffer_1.Buffer.from(result));
            }
        }
        if (cb)
            cb();
        return writeReturn;
    }
}
class Zlib extends ZlibBase {
    #level;
    #strategy;
    constructor(opts, mode) {
        opts = opts || {};
        opts.flush = opts.flush || constants_js_1.constants.Z_NO_FLUSH;
        opts.finishFlush = opts.finishFlush || constants_js_1.constants.Z_FINISH;
        opts.fullFlushFlag = constants_js_1.constants.Z_FULL_FLUSH;
        super(opts, mode);
        this.#level = opts.level;
        this.#strategy = opts.strategy;
    }
    params(level, strategy) {
        if (this.sawError)
            return;
        if (!this.handle)
            throw new Error('cannot switch params when binding is closed');
        // no way to test this without also not supporting params at all
        /* c8 ignore start */
        if (!this.handle.params)
            throw new Error('not supported in this implementation');
        /* c8 ignore stop */
        if (this.#level !== level || this.#strategy !== strategy) {
            this.flush(constants_js_1.constants.Z_SYNC_FLUSH);
            (0, assert_1.default)(this.handle, 'zlib binding closed');
            // .params() calls .flush(), but the latter is always async in the
            // core zlib. We override .flush() temporarily to intercept that and
            // flush synchronously.
            const origFlush = this.handle.flush;
            this.handle.flush = (flushFlag, cb) => {
                /* c8 ignore start */
                if (typeof flushFlag === 'function') {
                    cb = flushFlag;
                    flushFlag = this.flushFlag;
                }
                /* c8 ignore stop */
                this.flush(flushFlag);
                cb?.();
            };
            try {
                ;
                this.handle.params(level, strategy);
            }
            finally {
                this.handle.flush = origFlush;
            }
            /* c8 ignore start */
            if (this.handle) {
                this.#level = level;
                this.#strategy = strategy;
            }
            /* c8 ignore stop */
        }
    }
}
exports.Zlib = Zlib;
// minimal 2-byte header
class Deflate extends Zlib {
    constructor(opts) {
        super(opts, 'Deflate');
    }
}
exports.Deflate = Deflate;
class Inflate extends Zlib {
    constructor(opts) {
        super(opts, 'Inflate');
    }
}
exports.Inflate = Inflate;
class Gzip extends Zlib {
    #portable;
    constructor(opts) {
        super(opts, 'Gzip');
        this.#portable = opts && !!opts.portable;
    }
    [_superWrite](data) {
        if (!this.#portable)
            return super[_superWrite](data);
        // we'll always get the header emitted in one first chunk
        // overwrite the OS indicator byte with 0xFF
        this.#portable = false;
        data[9] = 255;
        return super[_superWrite](data);
    }
}
exports.Gzip = Gzip;
class Gunzip extends Zlib {
    constructor(opts) {
        super(opts, 'Gunzip');
    }
}
exports.Gunzip = Gunzip;
// raw - no header
class DeflateRaw extends Zlib {
    constructor(opts) {
        super(opts, 'DeflateRaw');
    }
}
exports.DeflateRaw = DeflateRaw;
class InflateRaw extends Zlib {
    constructor(opts) {
        super(opts, 'InflateRaw');
    }
}
exports.InflateRaw = InflateRaw;
// auto-detect header.
class Unzip extends Zlib {
    constructor(opts) {
        super(opts, 'Unzip');
    }
}
exports.Unzip = Unzip;
class Brotli extends ZlibBase {
    constructor(opts, mode) {
        opts = opts || {};
        opts.flush = opts.flush || constants_js_1.constants.BROTLI_OPERATION_PROCESS;
        opts.finishFlush =
            opts.finishFlush || constants_js_1.constants.BROTLI_OPERATION_FINISH;
        opts.fullFlushFlag = constants_js_1.constants.BROTLI_OPERATION_FLUSH;
        super(opts, mode);
    }
}
exports.Brotli = Brotli;
class BrotliCompress extends Brotli {
    constructor(opts) {
        super(opts, 'BrotliCompress');
    }
}
exports.BrotliCompress = BrotliCompress;
class BrotliDecompress extends Brotli {
    constructor(opts) {
        super(opts, 'BrotliDecompress');
    }
}
exports.BrotliDecompress = BrotliDecompress;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 7329:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.create = void 0;
const fs_minipass_1 = __nccwpck_require__(675);
const node_path_1 = __importDefault(__nccwpck_require__(9411));
const list_js_1 = __nccwpck_require__(4306);
const make_command_js_1 = __nccwpck_require__(3830);
const pack_js_1 = __nccwpck_require__(7788);
const createFileSync = (opt, files) => {
    const p = new pack_js_1.PackSync(opt);
    const stream = new fs_minipass_1.WriteStreamSync(opt.file, {
        mode: opt.mode || 0o666,
    });
    p.pipe(stream);
    addFilesSync(p, files);
};
const createFile = (opt, files) => {
    const p = new pack_js_1.Pack(opt);
    const stream = new fs_minipass_1.WriteStream(opt.file, {
        mode: opt.mode || 0o666,
    });
    p.pipe(stream);
    const promise = new Promise((res, rej) => {
        stream.on('error', rej);
        stream.on('close', res);
        p.on('error', rej);
    });
    addFilesAsync(p, files);
    return promise;
};
const addFilesSync = (p, files) => {
    files.forEach(file => {
        if (file.charAt(0) === '@') {
            (0, list_js_1.list)({
                file: node_path_1.default.resolve(p.cwd, file.slice(1)),
                sync: true,
                noResume: true,
                onReadEntry: entry => p.add(entry),
            });
        }
        else {
            p.add(file);
        }
    });
    p.end();
};
const addFilesAsync = async (p, files) => {
    for (let i = 0; i < files.length; i++) {
        const file = String(files[i]);
        if (file.charAt(0) === '@') {
            await (0, list_js_1.list)({
                file: node_path_1.default.resolve(String(p.cwd), file.slice(1)),
                noResume: true,
                onReadEntry: entry => {
                    p.add(entry);
                },
            });
        }
        else {
            p.add(file);
        }
    }
    p.end();
};
const createSync = (opt, files) => {
    const p = new pack_js_1.PackSync(opt);
    addFilesSync(p, files);
    return p;
};
const createAsync = (opt, files) => {
    const p = new pack_js_1.Pack(opt);
    addFilesAsync(p, files);
    return p;
};
exports.create = (0, make_command_js_1.makeCommand)(createFileSync, createFile, createSync, createAsync, (_opt, files) => {
    if (!files?.length) {
        throw new TypeError('no paths specified to add to archive');
    }
});
//# sourceMappingURL=create.js.map

/***/ }),

/***/ 6861:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CwdError = void 0;
class CwdError extends Error {
    path;
    code;
    syscall = 'chdir';
    constructor(path, code) {
        super(`${code}: Cannot cd into '${path}'`);
        this.path = path;
        this.code = code;
    }
    get name() {
        return 'CwdError';
    }
}
exports.CwdError = CwdError;
//# sourceMappingURL=cwd-error.js.map

/***/ }),

/***/ 2476:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.extract = void 0;
// tar -x
const fsm = __importStar(__nccwpck_require__(675));
const node_fs_1 = __importDefault(__nccwpck_require__(7561));
const list_js_1 = __nccwpck_require__(4306);
const make_command_js_1 = __nccwpck_require__(3830);
const unpack_js_1 = __nccwpck_require__(6973);
const extractFileSync = (opt) => {
    const u = new unpack_js_1.UnpackSync(opt);
    const file = opt.file;
    const stat = node_fs_1.default.statSync(file);
    // This trades a zero-byte read() syscall for a stat
    // However, it will usually result in less memory allocation
    const readSize = opt.maxReadSize || 16 * 1024 * 1024;
    const stream = new fsm.ReadStreamSync(file, {
        readSize: readSize,
        size: stat.size,
    });
    stream.pipe(u);
};
const extractFile = (opt, _) => {
    const u = new unpack_js_1.Unpack(opt);
    const readSize = opt.maxReadSize || 16 * 1024 * 1024;
    const file = opt.file;
    const p = new Promise((resolve, reject) => {
        u.on('error', reject);
        u.on('close', resolve);
        // This trades a zero-byte read() syscall for a stat
        // However, it will usually result in less memory allocation
        node_fs_1.default.stat(file, (er, stat) => {
            if (er) {
                reject(er);
            }
            else {
                const stream = new fsm.ReadStream(file, {
                    readSize: readSize,
                    size: stat.size,
                });
                stream.on('error', reject);
                stream.pipe(u);
            }
        });
    });
    return p;
};
exports.extract = (0, make_command_js_1.makeCommand)(extractFileSync, extractFile, opt => new unpack_js_1.UnpackSync(opt), opt => new unpack_js_1.Unpack(opt), (opt, files) => {
    if (files?.length)
        (0, list_js_1.filesFilter)(opt, files);
});
//# sourceMappingURL=extract.js.map

/***/ }),

/***/ 1663:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

// Get the appropriate flag to use for creating files
// We use fmap on Windows platforms for files less than
// 512kb.  This is a fairly low limit, but avoids making
// things slower in some cases.  Since most of what this
// library is used for is extracting tarballs of many
// relatively small files in npm packages and the like,
// it can be a big boost on Windows platforms.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getWriteFlag = void 0;
const fs_1 = __importDefault(__nccwpck_require__(7147));
const platform = process.env.__FAKE_PLATFORM__ || process.platform;
const isWindows = platform === 'win32';
/* c8 ignore start */
const { O_CREAT, O_TRUNC, O_WRONLY } = fs_1.default.constants;
const UV_FS_O_FILEMAP = Number(process.env.__FAKE_FS_O_FILENAME__) ||
    fs_1.default.constants.UV_FS_O_FILEMAP ||
    0;
/* c8 ignore stop */
const fMapEnabled = isWindows && !!UV_FS_O_FILEMAP;
const fMapLimit = 512 * 1024;
const fMapFlag = UV_FS_O_FILEMAP | O_TRUNC | O_CREAT | O_WRONLY;
exports.getWriteFlag = !fMapEnabled ?
    () => 'w'
    : (size) => (size < fMapLimit ? fMapFlag : 'w');
//# sourceMappingURL=get-write-flag.js.map

/***/ }),

/***/ 2374:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

// parse a 512-byte header block to a data object, or vice-versa
// encode returns `true` if a pax extended header is needed, because
// the data could not be faithfully encoded in a simple header.
// (Also, check header.needPax to see if it needs a pax header.)
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Header = void 0;
const node_path_1 = __nccwpck_require__(9411);
const large = __importStar(__nccwpck_require__(8520));
const types = __importStar(__nccwpck_require__(7390));
class Header {
    cksumValid = false;
    needPax = false;
    nullBlock = false;
    block;
    path;
    mode;
    uid;
    gid;
    size;
    cksum;
    #type = 'Unsupported';
    linkpath;
    uname;
    gname;
    devmaj = 0;
    devmin = 0;
    atime;
    ctime;
    mtime;
    charset;
    comment;
    constructor(data, off = 0, ex, gex) {
        if (Buffer.isBuffer(data)) {
            this.decode(data, off || 0, ex, gex);
        }
        else if (data) {
            this.#slurp(data);
        }
    }
    decode(buf, off, ex, gex) {
        if (!off) {
            off = 0;
        }
        if (!buf || !(buf.length >= off + 512)) {
            throw new Error('need 512 bytes for header');
        }
        this.path = decString(buf, off, 100);
        this.mode = decNumber(buf, off + 100, 8);
        this.uid = decNumber(buf, off + 108, 8);
        this.gid = decNumber(buf, off + 116, 8);
        this.size = decNumber(buf, off + 124, 12);
        this.mtime = decDate(buf, off + 136, 12);
        this.cksum = decNumber(buf, off + 148, 12);
        // if we have extended or global extended headers, apply them now
        // See https://github.com/npm/node-tar/pull/187
        // Apply global before local, so it overrides
        if (gex)
            this.#slurp(gex, true);
        if (ex)
            this.#slurp(ex);
        // old tar versions marked dirs as a file with a trailing /
        const t = decString(buf, off + 156, 1);
        if (types.isCode(t)) {
            this.#type = t || '0';
        }
        if (this.#type === '0' && this.path.slice(-1) === '/') {
            this.#type = '5';
        }
        // tar implementations sometimes incorrectly put the stat(dir).size
        // as the size in the tarball, even though Directory entries are
        // not able to have any body at all.  In the very rare chance that
        // it actually DOES have a body, we weren't going to do anything with
        // it anyway, and it'll just be a warning about an invalid header.
        if (this.#type === '5') {
            this.size = 0;
        }
        this.linkpath = decString(buf, off + 157, 100);
        if (buf.subarray(off + 257, off + 265).toString() ===
            'ustar\u000000') {
            this.uname = decString(buf, off + 265, 32);
            this.gname = decString(buf, off + 297, 32);
            /* c8 ignore start */
            this.devmaj = decNumber(buf, off + 329, 8) ?? 0;
            this.devmin = decNumber(buf, off + 337, 8) ?? 0;
            /* c8 ignore stop */
            if (buf[off + 475] !== 0) {
                // definitely a prefix, definitely >130 chars.
                const prefix = decString(buf, off + 345, 155);
                this.path = prefix + '/' + this.path;
            }
            else {
                const prefix = decString(buf, off + 345, 130);
                if (prefix) {
                    this.path = prefix + '/' + this.path;
                }
                this.atime = decDate(buf, off + 476, 12);
                this.ctime = decDate(buf, off + 488, 12);
            }
        }
        let sum = 8 * 0x20;
        for (let i = off; i < off + 148; i++) {
            sum += buf[i];
        }
        for (let i = off + 156; i < off + 512; i++) {
            sum += buf[i];
        }
        this.cksumValid = sum === this.cksum;
        if (this.cksum === undefined && sum === 8 * 0x20) {
            this.nullBlock = true;
        }
    }
    #slurp(ex, gex = false) {
        Object.assign(this, Object.fromEntries(Object.entries(ex).filter(([k, v]) => {
            // we slurp in everything except for the path attribute in
            // a global extended header, because that's weird. Also, any
            // null/undefined values are ignored.
            return !(v === null ||
                v === undefined ||
                (k === 'path' && gex) ||
                (k === 'linkpath' && gex) ||
                k === 'global');
        })));
    }
    encode(buf, off = 0) {
        if (!buf) {
            buf = this.block = Buffer.alloc(512);
        }
        if (this.#type === 'Unsupported') {
            this.#type = '0';
        }
        if (!(buf.length >= off + 512)) {
            throw new Error('need 512 bytes for header');
        }
        const prefixSize = this.ctime || this.atime ? 130 : 155;
        const split = splitPrefix(this.path || '', prefixSize);
        const path = split[0];
        const prefix = split[1];
        this.needPax = !!split[2];
        this.needPax = encString(buf, off, 100, path) || this.needPax;
        this.needPax =
            encNumber(buf, off + 100, 8, this.mode) || this.needPax;
        this.needPax =
            encNumber(buf, off + 108, 8, this.uid) || this.needPax;
        this.needPax =
            encNumber(buf, off + 116, 8, this.gid) || this.needPax;
        this.needPax =
            encNumber(buf, off + 124, 12, this.size) || this.needPax;
        this.needPax =
            encDate(buf, off + 136, 12, this.mtime) || this.needPax;
        buf[off + 156] = this.#type.charCodeAt(0);
        this.needPax =
            encString(buf, off + 157, 100, this.linkpath) || this.needPax;
        buf.write('ustar\u000000', off + 257, 8);
        this.needPax =
            encString(buf, off + 265, 32, this.uname) || this.needPax;
        this.needPax =
            encString(buf, off + 297, 32, this.gname) || this.needPax;
        this.needPax =
            encNumber(buf, off + 329, 8, this.devmaj) || this.needPax;
        this.needPax =
            encNumber(buf, off + 337, 8, this.devmin) || this.needPax;
        this.needPax =
            encString(buf, off + 345, prefixSize, prefix) || this.needPax;
        if (buf[off + 475] !== 0) {
            this.needPax =
                encString(buf, off + 345, 155, prefix) || this.needPax;
        }
        else {
            this.needPax =
                encString(buf, off + 345, 130, prefix) || this.needPax;
            this.needPax =
                encDate(buf, off + 476, 12, this.atime) || this.needPax;
            this.needPax =
                encDate(buf, off + 488, 12, this.ctime) || this.needPax;
        }
        let sum = 8 * 0x20;
        for (let i = off; i < off + 148; i++) {
            sum += buf[i];
        }
        for (let i = off + 156; i < off + 512; i++) {
            sum += buf[i];
        }
        this.cksum = sum;
        encNumber(buf, off + 148, 8, this.cksum);
        this.cksumValid = true;
        return this.needPax;
    }
    get type() {
        return (this.#type === 'Unsupported' ?
            this.#type
            : types.name.get(this.#type));
    }
    get typeKey() {
        return this.#type;
    }
    set type(type) {
        const c = String(types.code.get(type));
        if (types.isCode(c) || c === 'Unsupported') {
            this.#type = c;
        }
        else if (types.isCode(type)) {
            this.#type = type;
        }
        else {
            throw new TypeError('invalid entry type: ' + type);
        }
    }
}
exports.Header = Header;
const splitPrefix = (p, prefixSize) => {
    const pathSize = 100;
    let pp = p;
    let prefix = '';
    let ret = undefined;
    const root = node_path_1.posix.parse(p).root || '.';
    if (Buffer.byteLength(pp) < pathSize) {
        ret = [pp, prefix, false];
    }
    else {
        // first set prefix to the dir, and path to the base
        prefix = node_path_1.posix.dirname(pp);
        pp = node_path_1.posix.basename(pp);
        do {
            if (Buffer.byteLength(pp) <= pathSize &&
                Buffer.byteLength(prefix) <= prefixSize) {
                // both fit!
                ret = [pp, prefix, false];
            }
            else if (Buffer.byteLength(pp) > pathSize &&
                Buffer.byteLength(prefix) <= prefixSize) {
                // prefix fits in prefix, but path doesn't fit in path
                ret = [pp.slice(0, pathSize - 1), prefix, true];
            }
            else {
                // make path take a bit from prefix
                pp = node_path_1.posix.join(node_path_1.posix.basename(prefix), pp);
                prefix = node_path_1.posix.dirname(prefix);
            }
        } while (prefix !== root && ret === undefined);
        // at this point, found no resolution, just truncate
        if (!ret) {
            ret = [p.slice(0, pathSize - 1), '', true];
        }
    }
    return ret;
};
const decString = (buf, off, size) => buf
    .subarray(off, off + size)
    .toString('utf8')
    .replace(/\0.*/, '');
const decDate = (buf, off, size) => numToDate(decNumber(buf, off, size));
const numToDate = (num) => num === undefined ? undefined : new Date(num * 1000);
const decNumber = (buf, off, size) => Number(buf[off]) & 0x80 ?
    large.parse(buf.subarray(off, off + size))
    : decSmallNumber(buf, off, size);
const nanUndef = (value) => (isNaN(value) ? undefined : value);
const decSmallNumber = (buf, off, size) => nanUndef(parseInt(buf
    .subarray(off, off + size)
    .toString('utf8')
    .replace(/\0.*$/, '')
    .trim(), 8));
// the maximum encodable as a null-terminated octal, by field size
const MAXNUM = {
    12: 0o77777777777,
    8: 0o7777777,
};
const encNumber = (buf, off, size, num) => num === undefined ? false
    : num > MAXNUM[size] || num < 0 ?
        (large.encode(num, buf.subarray(off, off + size)), true)
        : (encSmallNumber(buf, off, size, num), false);
const encSmallNumber = (buf, off, size, num) => buf.write(octalString(num, size), off, size, 'ascii');
const octalString = (num, size) => padOctal(Math.floor(num).toString(8), size);
const padOctal = (str, size) => (str.length === size - 1 ?
    str
    : new Array(size - str.length - 1).join('0') + str + ' ') + '\0';
const encDate = (buf, off, size, date) => date === undefined ? false : (encNumber(buf, off, size, date.getTime() / 1000));
// enough to fill the longest string we've got
const NULLS = new Array(156).join('\0');
// pad with nulls, return true if it's longer or non-ascii
const encString = (buf, off, size, str) => str === undefined ? false : ((buf.write(str + NULLS, off, size, 'utf8'),
    str.length !== Buffer.byteLength(str) || str.length > size));
//# sourceMappingURL=header.js.map

/***/ }),

/***/ 6630:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.u = exports.types = exports.r = exports.t = exports.x = exports.c = void 0;
__exportStar(__nccwpck_require__(7329), exports);
var create_js_1 = __nccwpck_require__(7329);
Object.defineProperty(exports, "c", ({ enumerable: true, get: function () { return create_js_1.create; } }));
__exportStar(__nccwpck_require__(2476), exports);
var extract_js_1 = __nccwpck_require__(2476);
Object.defineProperty(exports, "x", ({ enumerable: true, get: function () { return extract_js_1.extract; } }));
__exportStar(__nccwpck_require__(2374), exports);
__exportStar(__nccwpck_require__(4306), exports);
var list_js_1 = __nccwpck_require__(4306);
Object.defineProperty(exports, "t", ({ enumerable: true, get: function () { return list_js_1.list; } }));
// classes
__exportStar(__nccwpck_require__(7788), exports);
__exportStar(__nccwpck_require__(2522), exports);
__exportStar(__nccwpck_require__(8567), exports);
__exportStar(__nccwpck_require__(7369), exports);
__exportStar(__nccwpck_require__(5478), exports);
var replace_js_1 = __nccwpck_require__(5478);
Object.defineProperty(exports, "r", ({ enumerable: true, get: function () { return replace_js_1.replace; } }));
exports.types = __importStar(__nccwpck_require__(7390));
__exportStar(__nccwpck_require__(6973), exports);
__exportStar(__nccwpck_require__(8780), exports);
var update_js_1 = __nccwpck_require__(8780);
Object.defineProperty(exports, "u", ({ enumerable: true, get: function () { return update_js_1.update; } }));
__exportStar(__nccwpck_require__(4028), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 8520:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// Tar can encode large and negative numbers using a leading byte of
// 0xff for negative, and 0x80 for positive.
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.parse = exports.encode = void 0;
const encode = (num, buf) => {
    if (!Number.isSafeInteger(num)) {
        // The number is so large that javascript cannot represent it with integer
        // precision.
        throw Error('cannot encode number outside of javascript safe integer range');
    }
    else if (num < 0) {
        encodeNegative(num, buf);
    }
    else {
        encodePositive(num, buf);
    }
    return buf;
};
exports.encode = encode;
const encodePositive = (num, buf) => {
    buf[0] = 0x80;
    for (var i = buf.length; i > 1; i--) {
        buf[i - 1] = num & 0xff;
        num = Math.floor(num / 0x100);
    }
};
const encodeNegative = (num, buf) => {
    buf[0] = 0xff;
    var flipped = false;
    num = num * -1;
    for (var i = buf.length; i > 1; i--) {
        var byte = num & 0xff;
        num = Math.floor(num / 0x100);
        if (flipped) {
            buf[i - 1] = onesComp(byte);
        }
        else if (byte === 0) {
            buf[i - 1] = 0;
        }
        else {
            flipped = true;
            buf[i - 1] = twosComp(byte);
        }
    }
};
const parse = (buf) => {
    const pre = buf[0];
    const value = pre === 0x80 ? pos(buf.subarray(1, buf.length))
        : pre === 0xff ? twos(buf)
            : null;
    if (value === null) {
        throw Error('invalid base256 encoding');
    }
    if (!Number.isSafeInteger(value)) {
        // The number is so large that javascript cannot represent it with integer
        // precision.
        throw Error('parsed number outside of javascript safe integer range');
    }
    return value;
};
exports.parse = parse;
const twos = (buf) => {
    var len = buf.length;
    var sum = 0;
    var flipped = false;
    for (var i = len - 1; i > -1; i--) {
        var byte = Number(buf[i]);
        var f;
        if (flipped) {
            f = onesComp(byte);
        }
        else if (byte === 0) {
            f = byte;
        }
        else {
            flipped = true;
            f = twosComp(byte);
        }
        if (f !== 0) {
            sum -= f * Math.pow(256, len - i - 1);
        }
    }
    return sum;
};
const pos = (buf) => {
    var len = buf.length;
    var sum = 0;
    for (var i = len - 1; i > -1; i--) {
        var byte = Number(buf[i]);
        if (byte !== 0) {
            sum += byte * Math.pow(256, len - i - 1);
        }
    }
    return sum;
};
const onesComp = (byte) => (0xff ^ byte) & 0xff;
const twosComp = (byte) => ((0xff ^ byte) + 1) & 0xff;
//# sourceMappingURL=large-numbers.js.map

/***/ }),

/***/ 4306:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.list = exports.filesFilter = void 0;
// tar -t
const fsm = __importStar(__nccwpck_require__(675));
const node_fs_1 = __importDefault(__nccwpck_require__(7561));
const path_1 = __nccwpck_require__(1017);
const make_command_js_1 = __nccwpck_require__(3830);
const parse_js_1 = __nccwpck_require__(2522);
const strip_trailing_slashes_js_1 = __nccwpck_require__(6018);
const onReadEntryFunction = (opt) => {
    const onReadEntry = opt.onReadEntry;
    opt.onReadEntry =
        onReadEntry ?
            e => {
                onReadEntry(e);
                e.resume();
            }
            : e => e.resume();
};
// construct a filter that limits the file entries listed
// include child entries if a dir is included
const filesFilter = (opt, files) => {
    const map = new Map(files.map(f => [(0, strip_trailing_slashes_js_1.stripTrailingSlashes)(f), true]));
    const filter = opt.filter;
    const mapHas = (file, r = '') => {
        const root = r || (0, path_1.parse)(file).root || '.';
        let ret;
        if (file === root)
            ret = false;
        else {
            const m = map.get(file);
            if (m !== undefined) {
                ret = m;
            }
            else {
                ret = mapHas((0, path_1.dirname)(file), root);
            }
        }
        map.set(file, ret);
        return ret;
    };
    opt.filter =
        filter ?
            (file, entry) => filter(file, entry) && mapHas((0, strip_trailing_slashes_js_1.stripTrailingSlashes)(file))
            : file => mapHas((0, strip_trailing_slashes_js_1.stripTrailingSlashes)(file));
};
exports.filesFilter = filesFilter;
const listFileSync = (opt) => {
    const p = new parse_js_1.Parser(opt);
    const file = opt.file;
    let fd;
    try {
        const stat = node_fs_1.default.statSync(file);
        const readSize = opt.maxReadSize || 16 * 1024 * 1024;
        if (stat.size < readSize) {
            p.end(node_fs_1.default.readFileSync(file));
        }
        else {
            let pos = 0;
            const buf = Buffer.allocUnsafe(readSize);
            fd = node_fs_1.default.openSync(file, 'r');
            while (pos < stat.size) {
                const bytesRead = node_fs_1.default.readSync(fd, buf, 0, readSize, pos);
                pos += bytesRead;
                p.write(buf.subarray(0, bytesRead));
            }
            p.end();
        }
    }
    finally {
        if (typeof fd === 'number') {
            try {
                node_fs_1.default.closeSync(fd);
                /* c8 ignore next */
            }
            catch (er) { }
        }
    }
};
const listFile = (opt, _files) => {
    const parse = new parse_js_1.Parser(opt);
    const readSize = opt.maxReadSize || 16 * 1024 * 1024;
    const file = opt.file;
    const p = new Promise((resolve, reject) => {
        parse.on('error', reject);
        parse.on('end', resolve);
        node_fs_1.default.stat(file, (er, stat) => {
            if (er) {
                reject(er);
            }
            else {
                const stream = new fsm.ReadStream(file, {
                    readSize: readSize,
                    size: stat.size,
                });
                stream.on('error', reject);
                stream.pipe(parse);
            }
        });
    });
    return p;
};
exports.list = (0, make_command_js_1.makeCommand)(listFileSync, listFile, opt => new parse_js_1.Parser(opt), opt => new parse_js_1.Parser(opt), (opt, files) => {
    if (files?.length)
        (0, exports.filesFilter)(opt, files);
    if (!opt.noResume)
        onReadEntryFunction(opt);
});
//# sourceMappingURL=list.js.map

/***/ }),

/***/ 3830:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.makeCommand = void 0;
const options_js_1 = __nccwpck_require__(4839);
const makeCommand = (syncFile, asyncFile, syncNoFile, asyncNoFile, validate) => {
    return Object.assign((opt_ = [], entries, cb) => {
        if (Array.isArray(opt_)) {
            entries = opt_;
            opt_ = {};
        }
        if (typeof entries === 'function') {
            cb = entries;
            entries = undefined;
        }
        if (!entries) {
            entries = [];
        }
        else {
            entries = Array.from(entries);
        }
        const opt = (0, options_js_1.dealias)(opt_);
        validate?.(opt, entries);
        if ((0, options_js_1.isSyncFile)(opt)) {
            if (typeof cb === 'function') {
                throw new TypeError('callback not supported for sync tar functions');
            }
            return syncFile(opt, entries);
        }
        else if ((0, options_js_1.isAsyncFile)(opt)) {
            const p = asyncFile(opt, entries);
            // weirdness to make TS happy
            const c = cb ? cb : undefined;
            return c ? p.then(() => c(), c) : p;
        }
        else if ((0, options_js_1.isSyncNoFile)(opt)) {
            if (typeof cb === 'function') {
                throw new TypeError('callback not supported for sync tar functions');
            }
            return syncNoFile(opt, entries);
        }
        else if ((0, options_js_1.isAsyncNoFile)(opt)) {
            if (typeof cb === 'function') {
                throw new TypeError('callback only supported with file option');
            }
            return asyncNoFile(opt, entries);
            /* c8 ignore start */
        }
        else {
            throw new Error('impossible options??');
        }
        /* c8 ignore stop */
    }, {
        syncFile,
        asyncFile,
        syncNoFile,
        asyncNoFile,
        validate,
    });
};
exports.makeCommand = makeCommand;
//# sourceMappingURL=make-command.js.map

/***/ }),

/***/ 8704:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.mkdirSync = exports.mkdir = void 0;
const chownr_1 = __nccwpck_require__(235);
const fs_1 = __importDefault(__nccwpck_require__(7147));
const mkdirp_1 = __nccwpck_require__(7280);
const node_path_1 = __importDefault(__nccwpck_require__(9411));
const cwd_error_js_1 = __nccwpck_require__(6861);
const normalize_windows_path_js_1 = __nccwpck_require__(762);
const symlink_error_js_1 = __nccwpck_require__(3012);
const cGet = (cache, key) => cache.get((0, normalize_windows_path_js_1.normalizeWindowsPath)(key));
const cSet = (cache, key, val) => cache.set((0, normalize_windows_path_js_1.normalizeWindowsPath)(key), val);
const checkCwd = (dir, cb) => {
    fs_1.default.stat(dir, (er, st) => {
        if (er || !st.isDirectory()) {
            er = new cwd_error_js_1.CwdError(dir, er?.code || 'ENOTDIR');
        }
        cb(er);
    });
};
/**
 * Wrapper around mkdirp for tar's needs.
 *
 * The main purpose is to avoid creating directories if we know that
 * they already exist (and track which ones exist for this purpose),
 * and prevent entries from being extracted into symlinked folders,
 * if `preservePaths` is not set.
 */
const mkdir = (dir, opt, cb) => {
    dir = (0, normalize_windows_path_js_1.normalizeWindowsPath)(dir);
    // if there's any overlap between mask and mode,
    // then we'll need an explicit chmod
    /* c8 ignore next */
    const umask = opt.umask ?? 0o22;
    const mode = opt.mode | 0o0700;
    const needChmod = (mode & umask) !== 0;
    const uid = opt.uid;
    const gid = opt.gid;
    const doChown = typeof uid === 'number' &&
        typeof gid === 'number' &&
        (uid !== opt.processUid || gid !== opt.processGid);
    const preserve = opt.preserve;
    const unlink = opt.unlink;
    const cache = opt.cache;
    const cwd = (0, normalize_windows_path_js_1.normalizeWindowsPath)(opt.cwd);
    const done = (er, created) => {
        if (er) {
            cb(er);
        }
        else {
            cSet(cache, dir, true);
            if (created && doChown) {
                (0, chownr_1.chownr)(created, uid, gid, er => done(er));
            }
            else if (needChmod) {
                fs_1.default.chmod(dir, mode, cb);
            }
            else {
                cb();
            }
        }
    };
    if (cache && cGet(cache, dir) === true) {
        return done();
    }
    if (dir === cwd) {
        return checkCwd(dir, done);
    }
    if (preserve) {
        return (0, mkdirp_1.mkdirp)(dir, { mode }).then(made => done(null, made ?? undefined), // oh, ts
        done);
    }
    const sub = (0, normalize_windows_path_js_1.normalizeWindowsPath)(node_path_1.default.relative(cwd, dir));
    const parts = sub.split('/');
    mkdir_(cwd, parts, mode, cache, unlink, cwd, undefined, done);
};
exports.mkdir = mkdir;
const mkdir_ = (base, parts, mode, cache, unlink, cwd, created, cb) => {
    if (!parts.length) {
        return cb(null, created);
    }
    const p = parts.shift();
    const part = (0, normalize_windows_path_js_1.normalizeWindowsPath)(node_path_1.default.resolve(base + '/' + p));
    if (cGet(cache, part)) {
        return mkdir_(part, parts, mode, cache, unlink, cwd, created, cb);
    }
    fs_1.default.mkdir(part, mode, onmkdir(part, parts, mode, cache, unlink, cwd, created, cb));
};
const onmkdir = (part, parts, mode, cache, unlink, cwd, created, cb) => (er) => {
    if (er) {
        fs_1.default.lstat(part, (statEr, st) => {
            if (statEr) {
                statEr.path =
                    statEr.path && (0, normalize_windows_path_js_1.normalizeWindowsPath)(statEr.path);
                cb(statEr);
            }
            else if (st.isDirectory()) {
                mkdir_(part, parts, mode, cache, unlink, cwd, created, cb);
            }
            else if (unlink) {
                fs_1.default.unlink(part, er => {
                    if (er) {
                        return cb(er);
                    }
                    fs_1.default.mkdir(part, mode, onmkdir(part, parts, mode, cache, unlink, cwd, created, cb));
                });
            }
            else if (st.isSymbolicLink()) {
                return cb(new symlink_error_js_1.SymlinkError(part, part + '/' + parts.join('/')));
            }
            else {
                cb(er);
            }
        });
    }
    else {
        created = created || part;
        mkdir_(part, parts, mode, cache, unlink, cwd, created, cb);
    }
};
const checkCwdSync = (dir) => {
    let ok = false;
    let code = undefined;
    try {
        ok = fs_1.default.statSync(dir).isDirectory();
    }
    catch (er) {
        code = er?.code;
    }
    finally {
        if (!ok) {
            throw new cwd_error_js_1.CwdError(dir, code ?? 'ENOTDIR');
        }
    }
};
const mkdirSync = (dir, opt) => {
    dir = (0, normalize_windows_path_js_1.normalizeWindowsPath)(dir);
    // if there's any overlap between mask and mode,
    // then we'll need an explicit chmod
    /* c8 ignore next */
    const umask = opt.umask ?? 0o22;
    const mode = opt.mode | 0o700;
    const needChmod = (mode & umask) !== 0;
    const uid = opt.uid;
    const gid = opt.gid;
    const doChown = typeof uid === 'number' &&
        typeof gid === 'number' &&
        (uid !== opt.processUid || gid !== opt.processGid);
    const preserve = opt.preserve;
    const unlink = opt.unlink;
    const cache = opt.cache;
    const cwd = (0, normalize_windows_path_js_1.normalizeWindowsPath)(opt.cwd);
    const done = (created) => {
        cSet(cache, dir, true);
        if (created && doChown) {
            (0, chownr_1.chownrSync)(created, uid, gid);
        }
        if (needChmod) {
            fs_1.default.chmodSync(dir, mode);
        }
    };
    if (cache && cGet(cache, dir) === true) {
        return done();
    }
    if (dir === cwd) {
        checkCwdSync(cwd);
        return done();
    }
    if (preserve) {
        return done((0, mkdirp_1.mkdirpSync)(dir, mode) ?? undefined);
    }
    const sub = (0, normalize_windows_path_js_1.normalizeWindowsPath)(node_path_1.default.relative(cwd, dir));
    const parts = sub.split('/');
    let created = undefined;
    for (let p = parts.shift(), part = cwd; p && (part += '/' + p); p = parts.shift()) {
        part = (0, normalize_windows_path_js_1.normalizeWindowsPath)(node_path_1.default.resolve(part));
        if (cGet(cache, part)) {
            continue;
        }
        try {
            fs_1.default.mkdirSync(part, mode);
            created = created || part;
            cSet(cache, part, true);
        }
        catch (er) {
            const st = fs_1.default.lstatSync(part);
            if (st.isDirectory()) {
                cSet(cache, part, true);
                continue;
            }
            else if (unlink) {
                fs_1.default.unlinkSync(part);
                fs_1.default.mkdirSync(part, mode);
                created = created || part;
                cSet(cache, part, true);
                continue;
            }
            else if (st.isSymbolicLink()) {
                return new symlink_error_js_1.SymlinkError(part, part + '/' + parts.join('/'));
            }
        }
    }
    return done(created);
};
exports.mkdirSync = mkdirSync;
//# sourceMappingURL=mkdir.js.map

/***/ }),

/***/ 1810:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.modeFix = void 0;
const modeFix = (mode, isDir, portable) => {
    mode &= 0o7777;
    // in portable mode, use the minimum reasonable umask
    // if this system creates files with 0o664 by default
    // (as some linux distros do), then we'll write the
    // archive with 0o644 instead.  Also, don't ever create
    // a file that is not readable/writable by the owner.
    if (portable) {
        mode = (mode | 0o600) & ~0o22;
    }
    // if dirs are readable, then they should be listable
    if (isDir) {
        if (mode & 0o400) {
            mode |= 0o100;
        }
        if (mode & 0o40) {
            mode |= 0o10;
        }
        if (mode & 0o4) {
            mode |= 0o1;
        }
    }
    return mode;
};
exports.modeFix = modeFix;
//# sourceMappingURL=mode-fix.js.map

/***/ }),

/***/ 9862:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.normalizeUnicode = void 0;
// warning: extremely hot code path.
// This has been meticulously optimized for use
// within npm install on large package trees.
// Do not edit without careful benchmarking.
const normalizeCache = Object.create(null);
const { hasOwnProperty } = Object.prototype;
const normalizeUnicode = (s) => {
    if (!hasOwnProperty.call(normalizeCache, s)) {
        normalizeCache[s] = s.normalize('NFD');
    }
    return normalizeCache[s];
};
exports.normalizeUnicode = normalizeUnicode;
//# sourceMappingURL=normalize-unicode.js.map

/***/ }),

/***/ 762:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// on windows, either \ or / are valid directory separators.
// on unix, \ is a valid character in filenames.
// so, on windows, and only on windows, we replace all \ chars with /,
// so that we can use / as our one and only directory separator char.
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.normalizeWindowsPath = void 0;
const platform = process.env.TESTING_TAR_FAKE_PLATFORM || process.platform;
exports.normalizeWindowsPath = platform !== 'win32' ?
    (p) => p
    : (p) => p && p.replace(/\\/g, '/');
//# sourceMappingURL=normalize-windows-path.js.map

/***/ }),

/***/ 4839:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// turn tar(1) style args like `C` into the more verbose things like `cwd`
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.dealias = exports.isNoFile = exports.isFile = exports.isAsync = exports.isSync = exports.isAsyncNoFile = exports.isSyncNoFile = exports.isAsyncFile = exports.isSyncFile = void 0;
const argmap = new Map([
    ['C', 'cwd'],
    ['f', 'file'],
    ['z', 'gzip'],
    ['P', 'preservePaths'],
    ['U', 'unlink'],
    ['strip-components', 'strip'],
    ['stripComponents', 'strip'],
    ['keep-newer', 'newer'],
    ['keepNewer', 'newer'],
    ['keep-newer-files', 'newer'],
    ['keepNewerFiles', 'newer'],
    ['k', 'keep'],
    ['keep-existing', 'keep'],
    ['keepExisting', 'keep'],
    ['m', 'noMtime'],
    ['no-mtime', 'noMtime'],
    ['p', 'preserveOwner'],
    ['L', 'follow'],
    ['h', 'follow'],
    ['onentry', 'onReadEntry'],
]);
const isSyncFile = (o) => !!o.sync && !!o.file;
exports.isSyncFile = isSyncFile;
const isAsyncFile = (o) => !o.sync && !!o.file;
exports.isAsyncFile = isAsyncFile;
const isSyncNoFile = (o) => !!o.sync && !o.file;
exports.isSyncNoFile = isSyncNoFile;
const isAsyncNoFile = (o) => !o.sync && !o.file;
exports.isAsyncNoFile = isAsyncNoFile;
const isSync = (o) => !!o.sync;
exports.isSync = isSync;
const isAsync = (o) => !o.sync;
exports.isAsync = isAsync;
const isFile = (o) => !!o.file;
exports.isFile = isFile;
const isNoFile = (o) => !o.file;
exports.isNoFile = isNoFile;
const dealiasKey = (k) => {
    const d = argmap.get(k);
    if (d)
        return d;
    return k;
};
const dealias = (opt = {}) => {
    if (!opt)
        return {};
    const result = {};
    for (const [key, v] of Object.entries(opt)) {
        // TS doesn't know that aliases are going to always be the same type
        const k = dealiasKey(key);
        result[k] = v;
    }
    // affordance for deprecated noChmod -> chmod
    if (result.chmod === undefined && result.noChmod === false) {
        result.chmod = true;
    }
    delete result.noChmod;
    return result;
};
exports.dealias = dealias;
//# sourceMappingURL=options.js.map

/***/ }),

/***/ 7788:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

// A readable tar stream creator
// Technically, this is a transform stream that you write paths into,
// and tar format comes out of.
// The `add()` method is like `write()` but returns this,
// and end() return `this` as well, so you can
// do `new Pack(opt).add('files').add('dir').end().pipe(output)
// You could also do something like:
// streamOfPaths().pipe(new Pack()).pipe(new fs.WriteStream('out.tar'))
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PackSync = exports.Pack = exports.PackJob = void 0;
const fs_1 = __importDefault(__nccwpck_require__(7147));
const write_entry_js_1 = __nccwpck_require__(4028);
class PackJob {
    path;
    absolute;
    entry;
    stat;
    readdir;
    pending = false;
    ignore = false;
    piped = false;
    constructor(path, absolute) {
        this.path = path || './';
        this.absolute = absolute;
    }
}
exports.PackJob = PackJob;
const minipass_1 = __nccwpck_require__(4968);
const zlib = __importStar(__nccwpck_require__(6139));
const yallist_1 = __nccwpck_require__(3796);
const read_entry_js_1 = __nccwpck_require__(7369);
const warn_method_js_1 = __nccwpck_require__(449);
const EOF = Buffer.alloc(1024);
const ONSTAT = Symbol('onStat');
const ENDED = Symbol('ended');
const QUEUE = Symbol('queue');
const CURRENT = Symbol('current');
const PROCESS = Symbol('process');
const PROCESSING = Symbol('processing');
const PROCESSJOB = Symbol('processJob');
const JOBS = Symbol('jobs');
const JOBDONE = Symbol('jobDone');
const ADDFSENTRY = Symbol('addFSEntry');
const ADDTARENTRY = Symbol('addTarEntry');
const STAT = Symbol('stat');
const READDIR = Symbol('readdir');
const ONREADDIR = Symbol('onreaddir');
const PIPE = Symbol('pipe');
const ENTRY = Symbol('entry');
const ENTRYOPT = Symbol('entryOpt');
const WRITEENTRYCLASS = Symbol('writeEntryClass');
const WRITE = Symbol('write');
const ONDRAIN = Symbol('ondrain');
const path_1 = __importDefault(__nccwpck_require__(1017));
const normalize_windows_path_js_1 = __nccwpck_require__(762);
class Pack extends minipass_1.Minipass {
    opt;
    cwd;
    maxReadSize;
    preservePaths;
    strict;
    noPax;
    prefix;
    linkCache;
    statCache;
    file;
    portable;
    zip;
    readdirCache;
    noDirRecurse;
    follow;
    noMtime;
    mtime;
    filter;
    jobs;
    [WRITEENTRYCLASS];
    onWriteEntry;
    [QUEUE];
    [JOBS] = 0;
    [PROCESSING] = false;
    [ENDED] = false;
    constructor(opt = {}) {
        //@ts-ignore
        super();
        this.opt = opt;
        this.file = opt.file || '';
        this.cwd = opt.cwd || process.cwd();
        this.maxReadSize = opt.maxReadSize;
        this.preservePaths = !!opt.preservePaths;
        this.strict = !!opt.strict;
        this.noPax = !!opt.noPax;
        this.prefix = (0, normalize_windows_path_js_1.normalizeWindowsPath)(opt.prefix || '');
        this.linkCache = opt.linkCache || new Map();
        this.statCache = opt.statCache || new Map();
        this.readdirCache = opt.readdirCache || new Map();
        this.onWriteEntry = opt.onWriteEntry;
        this[WRITEENTRYCLASS] = write_entry_js_1.WriteEntry;
        if (typeof opt.onwarn === 'function') {
            this.on('warn', opt.onwarn);
        }
        this.portable = !!opt.portable;
        if (opt.gzip || opt.brotli) {
            if (opt.gzip && opt.brotli) {
                throw new TypeError('gzip and brotli are mutually exclusive');
            }
            if (opt.gzip) {
                if (typeof opt.gzip !== 'object') {
                    opt.gzip = {};
                }
                if (this.portable) {
                    opt.gzip.portable = true;
                }
                this.zip = new zlib.Gzip(opt.gzip);
            }
            if (opt.brotli) {
                if (typeof opt.brotli !== 'object') {
                    opt.brotli = {};
                }
                this.zip = new zlib.BrotliCompress(opt.brotli);
            }
            /* c8 ignore next */
            if (!this.zip)
                throw new Error('impossible');
            const zip = this.zip;
            zip.on('data', chunk => super.write(chunk));
            zip.on('end', () => super.end());
            zip.on('drain', () => this[ONDRAIN]());
            this.on('resume', () => zip.resume());
        }
        else {
            this.on('drain', this[ONDRAIN]);
        }
        this.noDirRecurse = !!opt.noDirRecurse;
        this.follow = !!opt.follow;
        this.noMtime = !!opt.noMtime;
        if (opt.mtime)
            this.mtime = opt.mtime;
        this.filter =
            typeof opt.filter === 'function' ? opt.filter : () => true;
        this[QUEUE] = new yallist_1.Yallist();
        this[JOBS] = 0;
        this.jobs = Number(opt.jobs) || 4;
        this[PROCESSING] = false;
        this[ENDED] = false;
    }
    [WRITE](chunk) {
        return super.write(chunk);
    }
    add(path) {
        this.write(path);
        return this;
    }
    end(path, encoding, cb) {
        /* c8 ignore start */
        if (typeof path === 'function') {
            cb = path;
            path = undefined;
        }
        if (typeof encoding === 'function') {
            cb = encoding;
            encoding = undefined;
        }
        /* c8 ignore stop */
        if (path) {
            this.add(path);
        }
        this[ENDED] = true;
        this[PROCESS]();
        /* c8 ignore next */
        if (cb)
            cb();
        return this;
    }
    write(path) {
        if (this[ENDED]) {
            throw new Error('write after end');
        }
        if (path instanceof read_entry_js_1.ReadEntry) {
            this[ADDTARENTRY](path);
        }
        else {
            this[ADDFSENTRY](path);
        }
        return this.flowing;
    }
    [ADDTARENTRY](p) {
        const absolute = (0, normalize_windows_path_js_1.normalizeWindowsPath)(path_1.default.resolve(this.cwd, p.path));
        // in this case, we don't have to wait for the stat
        if (!this.filter(p.path, p)) {
            p.resume();
        }
        else {
            const job = new PackJob(p.path, absolute);
            job.entry = new write_entry_js_1.WriteEntryTar(p, this[ENTRYOPT](job));
            job.entry.on('end', () => this[JOBDONE](job));
            this[JOBS] += 1;
            this[QUEUE].push(job);
        }
        this[PROCESS]();
    }
    [ADDFSENTRY](p) {
        const absolute = (0, normalize_windows_path_js_1.normalizeWindowsPath)(path_1.default.resolve(this.cwd, p));
        this[QUEUE].push(new PackJob(p, absolute));
        this[PROCESS]();
    }
    [STAT](job) {
        job.pending = true;
        this[JOBS] += 1;
        const stat = this.follow ? 'stat' : 'lstat';
        fs_1.default[stat](job.absolute, (er, stat) => {
            job.pending = false;
            this[JOBS] -= 1;
            if (er) {
                this.emit('error', er);
            }
            else {
                this[ONSTAT](job, stat);
            }
        });
    }
    [ONSTAT](job, stat) {
        this.statCache.set(job.absolute, stat);
        job.stat = stat;
        // now we have the stat, we can filter it.
        if (!this.filter(job.path, stat)) {
            job.ignore = true;
        }
        this[PROCESS]();
    }
    [READDIR](job) {
        job.pending = true;
        this[JOBS] += 1;
        fs_1.default.readdir(job.absolute, (er, entries) => {
            job.pending = false;
            this[JOBS] -= 1;
            if (er) {
                return this.emit('error', er);
            }
            this[ONREADDIR](job, entries);
        });
    }
    [ONREADDIR](job, entries) {
        this.readdirCache.set(job.absolute, entries);
        job.readdir = entries;
        this[PROCESS]();
    }
    [PROCESS]() {
        if (this[PROCESSING]) {
            return;
        }
        this[PROCESSING] = true;
        for (let w = this[QUEUE].head; !!w && this[JOBS] < this.jobs; w = w.next) {
            this[PROCESSJOB](w.value);
            if (w.value.ignore) {
                const p = w.next;
                this[QUEUE].removeNode(w);
                w.next = p;
            }
        }
        this[PROCESSING] = false;
        if (this[ENDED] && !this[QUEUE].length && this[JOBS] === 0) {
            if (this.zip) {
                this.zip.end(EOF);
            }
            else {
                super.write(EOF);
                super.end();
            }
        }
    }
    get [CURRENT]() {
        return this[QUEUE] && this[QUEUE].head && this[QUEUE].head.value;
    }
    [JOBDONE](_job) {
        this[QUEUE].shift();
        this[JOBS] -= 1;
        this[PROCESS]();
    }
    [PROCESSJOB](job) {
        if (job.pending) {
            return;
        }
        if (job.entry) {
            if (job === this[CURRENT] && !job.piped) {
                this[PIPE](job);
            }
            return;
        }
        if (!job.stat) {
            const sc = this.statCache.get(job.absolute);
            if (sc) {
                this[ONSTAT](job, sc);
            }
            else {
                this[STAT](job);
            }
        }
        if (!job.stat) {
            return;
        }
        // filtered out!
        if (job.ignore) {
            return;
        }
        if (!this.noDirRecurse &&
            job.stat.isDirectory() &&
            !job.readdir) {
            const rc = this.readdirCache.get(job.absolute);
            if (rc) {
                this[ONREADDIR](job, rc);
            }
            else {
                this[READDIR](job);
            }
            if (!job.readdir) {
                return;
            }
        }
        // we know it doesn't have an entry, because that got checked above
        job.entry = this[ENTRY](job);
        if (!job.entry) {
            job.ignore = true;
            return;
        }
        if (job === this[CURRENT] && !job.piped) {
            this[PIPE](job);
        }
    }
    [ENTRYOPT](job) {
        return {
            onwarn: (code, msg, data) => this.warn(code, msg, data),
            noPax: this.noPax,
            cwd: this.cwd,
            absolute: job.absolute,
            preservePaths: this.preservePaths,
            maxReadSize: this.maxReadSize,
            strict: this.strict,
            portable: this.portable,
            linkCache: this.linkCache,
            statCache: this.statCache,
            noMtime: this.noMtime,
            mtime: this.mtime,
            prefix: this.prefix,
            onWriteEntry: this.onWriteEntry,
        };
    }
    [ENTRY](job) {
        this[JOBS] += 1;
        try {
            const e = new this[WRITEENTRYCLASS](job.path, this[ENTRYOPT](job));
            return e
                .on('end', () => this[JOBDONE](job))
                .on('error', er => this.emit('error', er));
        }
        catch (er) {
            this.emit('error', er);
        }
    }
    [ONDRAIN]() {
        if (this[CURRENT] && this[CURRENT].entry) {
            this[CURRENT].entry.resume();
        }
    }
    // like .pipe() but using super, because our write() is special
    [PIPE](job) {
        job.piped = true;
        if (job.readdir) {
            job.readdir.forEach(entry => {
                const p = job.path;
                const base = p === './' ? '' : p.replace(/\/*$/, '/');
                this[ADDFSENTRY](base + entry);
            });
        }
        const source = job.entry;
        const zip = this.zip;
        /* c8 ignore start */
        if (!source)
            throw new Error('cannot pipe without source');
        /* c8 ignore stop */
        if (zip) {
            source.on('data', chunk => {
                if (!zip.write(chunk)) {
                    source.pause();
                }
            });
        }
        else {
            source.on('data', chunk => {
                if (!super.write(chunk)) {
                    source.pause();
                }
            });
        }
    }
    pause() {
        if (this.zip) {
            this.zip.pause();
        }
        return super.pause();
    }
    warn(code, message, data = {}) {
        (0, warn_method_js_1.warnMethod)(this, code, message, data);
    }
}
exports.Pack = Pack;
class PackSync extends Pack {
    sync = true;
    constructor(opt) {
        super(opt);
        this[WRITEENTRYCLASS] = write_entry_js_1.WriteEntrySync;
    }
    // pause/resume are no-ops in sync streams.
    pause() { }
    resume() { }
    [STAT](job) {
        const stat = this.follow ? 'statSync' : 'lstatSync';
        this[ONSTAT](job, fs_1.default[stat](job.absolute));
    }
    [READDIR](job) {
        this[ONREADDIR](job, fs_1.default.readdirSync(job.absolute));
    }
    // gotta get it all in this tick
    [PIPE](job) {
        const source = job.entry;
        const zip = this.zip;
        if (job.readdir) {
            job.readdir.forEach(entry => {
                const p = job.path;
                const base = p === './' ? '' : p.replace(/\/*$/, '/');
                this[ADDFSENTRY](base + entry);
            });
        }
        /* c8 ignore start */
        if (!source)
            throw new Error('Cannot pipe without source');
        /* c8 ignore stop */
        if (zip) {
            source.on('data', chunk => {
                zip.write(chunk);
            });
        }
        else {
            source.on('data', chunk => {
                super[WRITE](chunk);
            });
        }
    }
}
exports.PackSync = PackSync;
//# sourceMappingURL=pack.js.map

/***/ }),

/***/ 2522:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

// this[BUFFER] is the remainder of a chunk if we're waiting for
// the full 512 bytes of a header to come in.  We will Buffer.concat()
// it to the next write(), which is a mem copy, but a small one.
//
// this[QUEUE] is a Yallist of entries that haven't been emitted
// yet this can only get filled up if the user keeps write()ing after
// a write() returns false, or does a write() with more than one entry
//
// We don't buffer chunks, we always parse them and either create an
// entry, or push it into the active entry.  The ReadEntry class knows
// to throw data away if .ignore=true
//
// Shift entry off the buffer when it emits 'end', and emit 'entry' for
// the next one in the list.
//
// At any time, we're pushing body chunks into the entry at WRITEENTRY,
// and waiting for 'end' on the entry at READENTRY
//
// ignored entries get .resume() called on them straight away
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Parser = void 0;
const events_1 = __nccwpck_require__(2361);
const minizlib_1 = __nccwpck_require__(6139);
const yallist_1 = __nccwpck_require__(3796);
const header_js_1 = __nccwpck_require__(2374);
const pax_js_1 = __nccwpck_require__(8567);
const read_entry_js_1 = __nccwpck_require__(7369);
const warn_method_js_1 = __nccwpck_require__(449);
const maxMetaEntrySize = 1024 * 1024;
const gzipHeader = Buffer.from([0x1f, 0x8b]);
const STATE = Symbol('state');
const WRITEENTRY = Symbol('writeEntry');
const READENTRY = Symbol('readEntry');
const NEXTENTRY = Symbol('nextEntry');
const PROCESSENTRY = Symbol('processEntry');
const EX = Symbol('extendedHeader');
const GEX = Symbol('globalExtendedHeader');
const META = Symbol('meta');
const EMITMETA = Symbol('emitMeta');
const BUFFER = Symbol('buffer');
const QUEUE = Symbol('queue');
const ENDED = Symbol('ended');
const EMITTEDEND = Symbol('emittedEnd');
const EMIT = Symbol('emit');
const UNZIP = Symbol('unzip');
const CONSUMECHUNK = Symbol('consumeChunk');
const CONSUMECHUNKSUB = Symbol('consumeChunkSub');
const CONSUMEBODY = Symbol('consumeBody');
const CONSUMEMETA = Symbol('consumeMeta');
const CONSUMEHEADER = Symbol('consumeHeader');
const CONSUMING = Symbol('consuming');
const BUFFERCONCAT = Symbol('bufferConcat');
const MAYBEEND = Symbol('maybeEnd');
const WRITING = Symbol('writing');
const ABORTED = Symbol('aborted');
const DONE = Symbol('onDone');
const SAW_VALID_ENTRY = Symbol('sawValidEntry');
const SAW_NULL_BLOCK = Symbol('sawNullBlock');
const SAW_EOF = Symbol('sawEOF');
const CLOSESTREAM = Symbol('closeStream');
const noop = () => true;
class Parser extends events_1.EventEmitter {
    file;
    strict;
    maxMetaEntrySize;
    filter;
    brotli;
    writable = true;
    readable = false;
    [QUEUE] = new yallist_1.Yallist();
    [BUFFER];
    [READENTRY];
    [WRITEENTRY];
    [STATE] = 'begin';
    [META] = '';
    [EX];
    [GEX];
    [ENDED] = false;
    [UNZIP];
    [ABORTED] = false;
    [SAW_VALID_ENTRY];
    [SAW_NULL_BLOCK] = false;
    [SAW_EOF] = false;
    [WRITING] = false;
    [CONSUMING] = false;
    [EMITTEDEND] = false;
    constructor(opt = {}) {
        super();
        this.file = opt.file || '';
        // these BADARCHIVE errors can't be detected early. listen on DONE.
        this.on(DONE, () => {
            if (this[STATE] === 'begin' ||
                this[SAW_VALID_ENTRY] === false) {
                // either less than 1 block of data, or all entries were invalid.
                // Either way, probably not even a tarball.
                this.warn('TAR_BAD_ARCHIVE', 'Unrecognized archive format');
            }
        });
        if (opt.ondone) {
            this.on(DONE, opt.ondone);
        }
        else {
            this.on(DONE, () => {
                this.emit('prefinish');
                this.emit('finish');
                this.emit('end');
            });
        }
        this.strict = !!opt.strict;
        this.maxMetaEntrySize = opt.maxMetaEntrySize || maxMetaEntrySize;
        this.filter = typeof opt.filter === 'function' ? opt.filter : noop;
        // Unlike gzip, brotli doesn't have any magic bytes to identify it
        // Users need to explicitly tell us they're extracting a brotli file
        // Or we infer from the file extension
        const isTBR = opt.file &&
            (opt.file.endsWith('.tar.br') || opt.file.endsWith('.tbr'));
        // if it's a tbr file it MIGHT be brotli, but we don't know until
        // we look at it and verify it's not a valid tar file.
        this.brotli =
            !opt.gzip && opt.brotli !== undefined ? opt.brotli
                : isTBR ? undefined
                    : false;
        // have to set this so that streams are ok piping into it
        this.on('end', () => this[CLOSESTREAM]());
        if (typeof opt.onwarn === 'function') {
            this.on('warn', opt.onwarn);
        }
        if (typeof opt.onReadEntry === 'function') {
            this.on('entry', opt.onReadEntry);
        }
    }
    warn(code, message, data = {}) {
        (0, warn_method_js_1.warnMethod)(this, code, message, data);
    }
    [CONSUMEHEADER](chunk, position) {
        if (this[SAW_VALID_ENTRY] === undefined) {
            this[SAW_VALID_ENTRY] = false;
        }
        let header;
        try {
            header = new header_js_1.Header(chunk, position, this[EX], this[GEX]);
        }
        catch (er) {
            return this.warn('TAR_ENTRY_INVALID', er);
        }
        if (header.nullBlock) {
            if (this[SAW_NULL_BLOCK]) {
                this[SAW_EOF] = true;
                // ending an archive with no entries.  pointless, but legal.
                if (this[STATE] === 'begin') {
                    this[STATE] = 'header';
                }
                this[EMIT]('eof');
            }
            else {
                this[SAW_NULL_BLOCK] = true;
                this[EMIT]('nullBlock');
            }
        }
        else {
            this[SAW_NULL_BLOCK] = false;
            if (!header.cksumValid) {
                this.warn('TAR_ENTRY_INVALID', 'checksum failure', { header });
            }
            else if (!header.path) {
                this.warn('TAR_ENTRY_INVALID', 'path is required', { header });
            }
            else {
                const type = header.type;
                if (/^(Symbolic)?Link$/.test(type) && !header.linkpath) {
                    this.warn('TAR_ENTRY_INVALID', 'linkpath required', {
                        header,
                    });
                }
                else if (!/^(Symbolic)?Link$/.test(type) &&
                    !/^(Global)?ExtendedHeader$/.test(type) &&
                    header.linkpath) {
                    this.warn('TAR_ENTRY_INVALID', 'linkpath forbidden', {
                        header,
                    });
                }
                else {
                    const entry = (this[WRITEENTRY] = new read_entry_js_1.ReadEntry(header, this[EX], this[GEX]));
                    // we do this for meta & ignored entries as well, because they
                    // are still valid tar, or else we wouldn't know to ignore them
                    if (!this[SAW_VALID_ENTRY]) {
                        if (entry.remain) {
                            // this might be the one!
                            const onend = () => {
                                if (!entry.invalid) {
                                    this[SAW_VALID_ENTRY] = true;
                                }
                            };
                            entry.on('end', onend);
                        }
                        else {
                            this[SAW_VALID_ENTRY] = true;
                        }
                    }
                    if (entry.meta) {
                        if (entry.size > this.maxMetaEntrySize) {
                            entry.ignore = true;
                            this[EMIT]('ignoredEntry', entry);
                            this[STATE] = 'ignore';
                            entry.resume();
                        }
                        else if (entry.size > 0) {
                            this[META] = '';
                            entry.on('data', c => (this[META] += c));
                            this[STATE] = 'meta';
                        }
                    }
                    else {
                        this[EX] = undefined;
                        entry.ignore =
                            entry.ignore || !this.filter(entry.path, entry);
                        if (entry.ignore) {
                            // probably valid, just not something we care about
                            this[EMIT]('ignoredEntry', entry);
                            this[STATE] = entry.remain ? 'ignore' : 'header';
                            entry.resume();
                        }
                        else {
                            if (entry.remain) {
                                this[STATE] = 'body';
                            }
                            else {
                                this[STATE] = 'header';
                                entry.end();
                            }
                            if (!this[READENTRY]) {
                                this[QUEUE].push(entry);
                                this[NEXTENTRY]();
                            }
                            else {
                                this[QUEUE].push(entry);
                            }
                        }
                    }
                }
            }
        }
    }
    [CLOSESTREAM]() {
        queueMicrotask(() => this.emit('close'));
    }
    [PROCESSENTRY](entry) {
        let go = true;
        if (!entry) {
            this[READENTRY] = undefined;
            go = false;
        }
        else if (Array.isArray(entry)) {
            const [ev, ...args] = entry;
            this.emit(ev, ...args);
        }
        else {
            this[READENTRY] = entry;
            this.emit('entry', entry);
            if (!entry.emittedEnd) {
                entry.on('end', () => this[NEXTENTRY]());
                go = false;
            }
        }
        return go;
    }
    [NEXTENTRY]() {
        do { } while (this[PROCESSENTRY](this[QUEUE].shift()));
        if (!this[QUEUE].length) {
            // At this point, there's nothing in the queue, but we may have an
            // entry which is being consumed (readEntry).
            // If we don't, then we definitely can handle more data.
            // If we do, and either it's flowing, or it has never had any data
            // written to it, then it needs more.
            // The only other possibility is that it has returned false from a
            // write() call, so we wait for the next drain to continue.
            const re = this[READENTRY];
            const drainNow = !re || re.flowing || re.size === re.remain;
            if (drainNow) {
                if (!this[WRITING]) {
                    this.emit('drain');
                }
            }
            else {
                re.once('drain', () => this.emit('drain'));
            }
        }
    }
    [CONSUMEBODY](chunk, position) {
        // write up to but no  more than writeEntry.blockRemain
        const entry = this[WRITEENTRY];
        /* c8 ignore start */
        if (!entry) {
            throw new Error('attempt to consume body without entry??');
        }
        const br = entry.blockRemain ?? 0;
        /* c8 ignore stop */
        const c = br >= chunk.length && position === 0 ?
            chunk
            : chunk.subarray(position, position + br);
        entry.write(c);
        if (!entry.blockRemain) {
            this[STATE] = 'header';
            this[WRITEENTRY] = undefined;
            entry.end();
        }
        return c.length;
    }
    [CONSUMEMETA](chunk, position) {
        const entry = this[WRITEENTRY];
        const ret = this[CONSUMEBODY](chunk, position);
        // if we finished, then the entry is reset
        if (!this[WRITEENTRY] && entry) {
            this[EMITMETA](entry);
        }
        return ret;
    }
    [EMIT](ev, data, extra) {
        if (!this[QUEUE].length && !this[READENTRY]) {
            this.emit(ev, data, extra);
        }
        else {
            this[QUEUE].push([ev, data, extra]);
        }
    }
    [EMITMETA](entry) {
        this[EMIT]('meta', this[META]);
        switch (entry.type) {
            case 'ExtendedHeader':
            case 'OldExtendedHeader':
                this[EX] = pax_js_1.Pax.parse(this[META], this[EX], false);
                break;
            case 'GlobalExtendedHeader':
                this[GEX] = pax_js_1.Pax.parse(this[META], this[GEX], true);
                break;
            case 'NextFileHasLongPath':
            case 'OldGnuLongPath': {
                const ex = this[EX] ?? Object.create(null);
                this[EX] = ex;
                ex.path = this[META].replace(/\0.*/, '');
                break;
            }
            case 'NextFileHasLongLinkpath': {
                const ex = this[EX] || Object.create(null);
                this[EX] = ex;
                ex.linkpath = this[META].replace(/\0.*/, '');
                break;
            }
            /* c8 ignore start */
            default:
                throw new Error('unknown meta: ' + entry.type);
            /* c8 ignore stop */
        }
    }
    abort(error) {
        this[ABORTED] = true;
        this.emit('abort', error);
        // always throws, even in non-strict mode
        this.warn('TAR_ABORT', error, { recoverable: false });
    }
    write(chunk, encoding, cb) {
        if (typeof encoding === 'function') {
            cb = encoding;
            encoding = undefined;
        }
        if (typeof chunk === 'string') {
            chunk = Buffer.from(chunk, 
            /* c8 ignore next */
            typeof encoding === 'string' ? encoding : 'utf8');
        }
        if (this[ABORTED]) {
            /* c8 ignore next */
            cb?.();
            return false;
        }
        // first write, might be gzipped
        const needSniff = this[UNZIP] === undefined ||
            (this.brotli === undefined && this[UNZIP] === false);
        if (needSniff && chunk) {
            if (this[BUFFER]) {
                chunk = Buffer.concat([this[BUFFER], chunk]);
                this[BUFFER] = undefined;
            }
            if (chunk.length < gzipHeader.length) {
                this[BUFFER] = chunk;
                /* c8 ignore next */
                cb?.();
                return true;
            }
            // look for gzip header
            for (let i = 0; this[UNZIP] === undefined && i < gzipHeader.length; i++) {
                if (chunk[i] !== gzipHeader[i]) {
                    this[UNZIP] = false;
                }
            }
            const maybeBrotli = this.brotli === undefined;
            if (this[UNZIP] === false && maybeBrotli) {
                // read the first header to see if it's a valid tar file. If so,
                // we can safely assume that it's not actually brotli, despite the
                // .tbr or .tar.br file extension.
                // if we ended before getting a full chunk, yes, def brotli
                if (chunk.length < 512) {
                    if (this[ENDED]) {
                        this.brotli = true;
                    }
                    else {
                        this[BUFFER] = chunk;
                        /* c8 ignore next */
                        cb?.();
                        return true;
                    }
                }
                else {
                    // if it's tar, it's pretty reliably not brotli, chances of
                    // that happening are astronomical.
                    try {
                        new header_js_1.Header(chunk.subarray(0, 512));
                        this.brotli = false;
                    }
                    catch (_) {
                        this.brotli = true;
                    }
                }
            }
            if (this[UNZIP] === undefined ||
                (this[UNZIP] === false && this.brotli)) {
                const ended = this[ENDED];
                this[ENDED] = false;
                this[UNZIP] =
                    this[UNZIP] === undefined ?
                        new minizlib_1.Unzip({})
                        : new minizlib_1.BrotliDecompress({});
                this[UNZIP].on('data', chunk => this[CONSUMECHUNK](chunk));
                this[UNZIP].on('error', er => this.abort(er));
                this[UNZIP].on('end', () => {
                    this[ENDED] = true;
                    this[CONSUMECHUNK]();
                });
                this[WRITING] = true;
                const ret = !!this[UNZIP][ended ? 'end' : 'write'](chunk);
                this[WRITING] = false;
                cb?.();
                return ret;
            }
        }
        this[WRITING] = true;
        if (this[UNZIP]) {
            this[UNZIP].write(chunk);
        }
        else {
            this[CONSUMECHUNK](chunk);
        }
        this[WRITING] = false;
        // return false if there's a queue, or if the current entry isn't flowing
        const ret = this[QUEUE].length ? false
            : this[READENTRY] ? this[READENTRY].flowing
                : true;
        // if we have no queue, then that means a clogged READENTRY
        if (!ret && !this[QUEUE].length) {
            this[READENTRY]?.once('drain', () => this.emit('drain'));
        }
        /* c8 ignore next */
        cb?.();
        return ret;
    }
    [BUFFERCONCAT](c) {
        if (c && !this[ABORTED]) {
            this[BUFFER] =
                this[BUFFER] ? Buffer.concat([this[BUFFER], c]) : c;
        }
    }
    [MAYBEEND]() {
        if (this[ENDED] &&
            !this[EMITTEDEND] &&
            !this[ABORTED] &&
            !this[CONSUMING]) {
            this[EMITTEDEND] = true;
            const entry = this[WRITEENTRY];
            if (entry && entry.blockRemain) {
                // truncated, likely a damaged file
                const have = this[BUFFER] ? this[BUFFER].length : 0;
                this.warn('TAR_BAD_ARCHIVE', `Truncated input (needed ${entry.blockRemain} more bytes, only ${have} available)`, { entry });
                if (this[BUFFER]) {
                    entry.write(this[BUFFER]);
                }
                entry.end();
            }
            this[EMIT](DONE);
        }
    }
    [CONSUMECHUNK](chunk) {
        if (this[CONSUMING] && chunk) {
            this[BUFFERCONCAT](chunk);
        }
        else if (!chunk && !this[BUFFER]) {
            this[MAYBEEND]();
        }
        else if (chunk) {
            this[CONSUMING] = true;
            if (this[BUFFER]) {
                this[BUFFERCONCAT](chunk);
                const c = this[BUFFER];
                this[BUFFER] = undefined;
                this[CONSUMECHUNKSUB](c);
            }
            else {
                this[CONSUMECHUNKSUB](chunk);
            }
            while (this[BUFFER] &&
                this[BUFFER]?.length >= 512 &&
                !this[ABORTED] &&
                !this[SAW_EOF]) {
                const c = this[BUFFER];
                this[BUFFER] = undefined;
                this[CONSUMECHUNKSUB](c);
            }
            this[CONSUMING] = false;
        }
        if (!this[BUFFER] || this[ENDED]) {
            this[MAYBEEND]();
        }
    }
    [CONSUMECHUNKSUB](chunk) {
        // we know that we are in CONSUMING mode, so anything written goes into
        // the buffer.  Advance the position and put any remainder in the buffer.
        let position = 0;
        const length = chunk.length;
        while (position + 512 <= length &&
            !this[ABORTED] &&
            !this[SAW_EOF]) {
            switch (this[STATE]) {
                case 'begin':
                case 'header':
                    this[CONSUMEHEADER](chunk, position);
                    position += 512;
                    break;
                case 'ignore':
                case 'body':
                    position += this[CONSUMEBODY](chunk, position);
                    break;
                case 'meta':
                    position += this[CONSUMEMETA](chunk, position);
                    break;
                /* c8 ignore start */
                default:
                    throw new Error('invalid state: ' + this[STATE]);
                /* c8 ignore stop */
            }
        }
        if (position < length) {
            if (this[BUFFER]) {
                this[BUFFER] = Buffer.concat([
                    chunk.subarray(position),
                    this[BUFFER],
                ]);
            }
            else {
                this[BUFFER] = chunk.subarray(position);
            }
        }
    }
    end(chunk, encoding, cb) {
        if (typeof chunk === 'function') {
            cb = chunk;
            encoding = undefined;
            chunk = undefined;
        }
        if (typeof encoding === 'function') {
            cb = encoding;
            encoding = undefined;
        }
        if (typeof chunk === 'string') {
            chunk = Buffer.from(chunk, encoding);
        }
        if (cb)
            this.once('finish', cb);
        if (!this[ABORTED]) {
            if (this[UNZIP]) {
                /* c8 ignore start */
                if (chunk)
                    this[UNZIP].write(chunk);
                /* c8 ignore stop */
                this[UNZIP].end();
            }
            else {
                this[ENDED] = true;
                if (this.brotli === undefined)
                    chunk = chunk || Buffer.alloc(0);
                if (chunk)
                    this.write(chunk);
                this[MAYBEEND]();
            }
        }
        return this;
    }
}
exports.Parser = Parser;
//# sourceMappingURL=parse.js.map

/***/ }),

/***/ 3588:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

// A path exclusive reservation system
// reserve([list, of, paths], fn)
// When the fn is first in line for all its paths, it
// is called with a cb that clears the reservation.
//
// Used by async unpack to avoid clobbering paths in use,
// while still allowing maximal safe parallelization.
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PathReservations = void 0;
const node_path_1 = __nccwpck_require__(9411);
const normalize_unicode_js_1 = __nccwpck_require__(9862);
const strip_trailing_slashes_js_1 = __nccwpck_require__(6018);
const platform = process.env.TESTING_TAR_FAKE_PLATFORM || process.platform;
const isWindows = platform === 'win32';
// return a set of parent dirs for a given path
// '/a/b/c/d' -> ['/', '/a', '/a/b', '/a/b/c', '/a/b/c/d']
const getDirs = (path) => {
    const dirs = path
        .split('/')
        .slice(0, -1)
        .reduce((set, path) => {
        const s = set[set.length - 1];
        if (s !== undefined) {
            path = (0, node_path_1.join)(s, path);
        }
        set.push(path || '/');
        return set;
    }, []);
    return dirs;
};
class PathReservations {
    // path => [function or Set]
    // A Set object means a directory reservation
    // A fn is a direct reservation on that path
    #queues = new Map();
    // fn => {paths:[path,...], dirs:[path, ...]}
    #reservations = new Map();
    // functions currently running
    #running = new Set();
    reserve(paths, fn) {
        paths =
            isWindows ?
                ['win32 parallelization disabled']
                : paths.map(p => {
                    // don't need normPath, because we skip this entirely for windows
                    return (0, strip_trailing_slashes_js_1.stripTrailingSlashes)((0, node_path_1.join)((0, normalize_unicode_js_1.normalizeUnicode)(p))).toLowerCase();
                });
        const dirs = new Set(paths.map(path => getDirs(path)).reduce((a, b) => a.concat(b)));
        this.#reservations.set(fn, { dirs, paths });
        for (const p of paths) {
            const q = this.#queues.get(p);
            if (!q) {
                this.#queues.set(p, [fn]);
            }
            else {
                q.push(fn);
            }
        }
        for (const dir of dirs) {
            const q = this.#queues.get(dir);
            if (!q) {
                this.#queues.set(dir, [new Set([fn])]);
            }
            else {
                const l = q[q.length - 1];
                if (l instanceof Set) {
                    l.add(fn);
                }
                else {
                    q.push(new Set([fn]));
                }
            }
        }
        return this.#run(fn);
    }
    // return the queues for each path the function cares about
    // fn => {paths, dirs}
    #getQueues(fn) {
        const res = this.#reservations.get(fn);
        /* c8 ignore start */
        if (!res) {
            throw new Error('function does not have any path reservations');
        }
        /* c8 ignore stop */
        return {
            paths: res.paths.map((path) => this.#queues.get(path)),
            dirs: [...res.dirs].map(path => this.#queues.get(path)),
        };
    }
    // check if fn is first in line for all its paths, and is
    // included in the first set for all its dir queues
    check(fn) {
        const { paths, dirs } = this.#getQueues(fn);
        return (paths.every(q => q && q[0] === fn) &&
            dirs.every(q => q && q[0] instanceof Set && q[0].has(fn)));
    }
    // run the function if it's first in line and not already running
    #run(fn) {
        if (this.#running.has(fn) || !this.check(fn)) {
            return false;
        }
        this.#running.add(fn);
        fn(() => this.#clear(fn));
        return true;
    }
    #clear(fn) {
        if (!this.#running.has(fn)) {
            return false;
        }
        const res = this.#reservations.get(fn);
        /* c8 ignore start */
        if (!res) {
            throw new Error('invalid reservation');
        }
        /* c8 ignore stop */
        const { paths, dirs } = res;
        const next = new Set();
        for (const path of paths) {
            const q = this.#queues.get(path);
            /* c8 ignore start */
            if (!q || q?.[0] !== fn) {
                continue;
            }
            /* c8 ignore stop */
            const q0 = q[1];
            if (!q0) {
                this.#queues.delete(path);
                continue;
            }
            q.shift();
            if (typeof q0 === 'function') {
                next.add(q0);
            }
            else {
                for (const f of q0) {
                    next.add(f);
                }
            }
        }
        for (const dir of dirs) {
            const q = this.#queues.get(dir);
            const q0 = q?.[0];
            /* c8 ignore next - type safety only */
            if (!q || !(q0 instanceof Set))
                continue;
            if (q0.size === 1 && q.length === 1) {
                this.#queues.delete(dir);
                continue;
            }
            else if (q0.size === 1) {
                q.shift();
                // next one must be a function,
                // or else the Set would've been reused
                const n = q[0];
                if (typeof n === 'function') {
                    next.add(n);
                }
            }
            else {
                q0.delete(fn);
            }
        }
        this.#running.delete(fn);
        next.forEach(fn => this.#run(fn));
        return true;
    }
}
exports.PathReservations = PathReservations;
//# sourceMappingURL=path-reservations.js.map

/***/ }),

/***/ 8567:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Pax = void 0;
const node_path_1 = __nccwpck_require__(9411);
const header_js_1 = __nccwpck_require__(2374);
class Pax {
    atime;
    mtime;
    ctime;
    charset;
    comment;
    gid;
    uid;
    gname;
    uname;
    linkpath;
    dev;
    ino;
    nlink;
    path;
    size;
    mode;
    global;
    constructor(obj, global = false) {
        this.atime = obj.atime;
        this.charset = obj.charset;
        this.comment = obj.comment;
        this.ctime = obj.ctime;
        this.dev = obj.dev;
        this.gid = obj.gid;
        this.global = global;
        this.gname = obj.gname;
        this.ino = obj.ino;
        this.linkpath = obj.linkpath;
        this.mtime = obj.mtime;
        this.nlink = obj.nlink;
        this.path = obj.path;
        this.size = obj.size;
        this.uid = obj.uid;
        this.uname = obj.uname;
    }
    encode() {
        const body = this.encodeBody();
        if (body === '') {
            return Buffer.allocUnsafe(0);
        }
        const bodyLen = Buffer.byteLength(body);
        // round up to 512 bytes
        // add 512 for header
        const bufLen = 512 * Math.ceil(1 + bodyLen / 512);
        const buf = Buffer.allocUnsafe(bufLen);
        // 0-fill the header section, it might not hit every field
        for (let i = 0; i < 512; i++) {
            buf[i] = 0;
        }
        new header_js_1.Header({
            // XXX split the path
            // then the path should be PaxHeader + basename, but less than 99,
            // prepend with the dirname
            /* c8 ignore start */
            path: ('PaxHeader/' + (0, node_path_1.basename)(this.path ?? '')).slice(0, 99),
            /* c8 ignore stop */
            mode: this.mode || 0o644,
            uid: this.uid,
            gid: this.gid,
            size: bodyLen,
            mtime: this.mtime,
            type: this.global ? 'GlobalExtendedHeader' : 'ExtendedHeader',
            linkpath: '',
            uname: this.uname || '',
            gname: this.gname || '',
            devmaj: 0,
            devmin: 0,
            atime: this.atime,
            ctime: this.ctime,
        }).encode(buf);
        buf.write(body, 512, bodyLen, 'utf8');
        // null pad after the body
        for (let i = bodyLen + 512; i < buf.length; i++) {
            buf[i] = 0;
        }
        return buf;
    }
    encodeBody() {
        return (this.encodeField('path') +
            this.encodeField('ctime') +
            this.encodeField('atime') +
            this.encodeField('dev') +
            this.encodeField('ino') +
            this.encodeField('nlink') +
            this.encodeField('charset') +
            this.encodeField('comment') +
            this.encodeField('gid') +
            this.encodeField('gname') +
            this.encodeField('linkpath') +
            this.encodeField('mtime') +
            this.encodeField('size') +
            this.encodeField('uid') +
            this.encodeField('uname'));
    }
    encodeField(field) {
        if (this[field] === undefined) {
            return '';
        }
        const r = this[field];
        const v = r instanceof Date ? r.getTime() / 1000 : r;
        const s = ' ' +
            (field === 'dev' || field === 'ino' || field === 'nlink' ?
                'SCHILY.'
                : '') +
            field +
            '=' +
            v +
            '\n';
        const byteLen = Buffer.byteLength(s);
        // the digits includes the length of the digits in ascii base-10
        // so if it's 9 characters, then adding 1 for the 9 makes it 10
        // which makes it 11 chars.
        let digits = Math.floor(Math.log(byteLen) / Math.log(10)) + 1;
        if (byteLen + digits >= Math.pow(10, digits)) {
            digits += 1;
        }
        const len = digits + byteLen;
        return len + s;
    }
    static parse(str, ex, g = false) {
        return new Pax(merge(parseKV(str), ex), g);
    }
}
exports.Pax = Pax;
const merge = (a, b) => b ? Object.assign({}, b, a) : a;
const parseKV = (str) => str
    .replace(/\n$/, '')
    .split('\n')
    .reduce(parseKVLine, Object.create(null));
const parseKVLine = (set, line) => {
    const n = parseInt(line, 10);
    // XXX Values with \n in them will fail this.
    // Refactor to not be a naive line-by-line parse.
    if (n !== Buffer.byteLength(line) + 1) {
        return set;
    }
    line = line.slice((n + ' ').length);
    const kv = line.split('=');
    const r = kv.shift();
    if (!r) {
        return set;
    }
    const k = r.replace(/^SCHILY\.(dev|ino|nlink)/, '$1');
    const v = kv.join('=');
    set[k] =
        /^([A-Z]+\.)?([mac]|birth|creation)time$/.test(k) ?
            new Date(Number(v) * 1000)
            : /^[0-9]+$/.test(v) ? +v
                : v;
    return set;
};
//# sourceMappingURL=pax.js.map

/***/ }),

/***/ 7369:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReadEntry = void 0;
const minipass_1 = __nccwpck_require__(4968);
const normalize_windows_path_js_1 = __nccwpck_require__(762);
class ReadEntry extends minipass_1.Minipass {
    extended;
    globalExtended;
    header;
    startBlockSize;
    blockRemain;
    remain;
    type;
    meta = false;
    ignore = false;
    path;
    mode;
    uid;
    gid;
    uname;
    gname;
    size = 0;
    mtime;
    atime;
    ctime;
    linkpath;
    dev;
    ino;
    nlink;
    invalid = false;
    absolute;
    unsupported = false;
    constructor(header, ex, gex) {
        super({});
        // read entries always start life paused.  this is to avoid the
        // situation where Minipass's auto-ending empty streams results
        // in an entry ending before we're ready for it.
        this.pause();
        this.extended = ex;
        this.globalExtended = gex;
        this.header = header;
        /* c8 ignore start */
        this.remain = header.size ?? 0;
        /* c8 ignore stop */
        this.startBlockSize = 512 * Math.ceil(this.remain / 512);
        this.blockRemain = this.startBlockSize;
        this.type = header.type;
        switch (this.type) {
            case 'File':
            case 'OldFile':
            case 'Link':
            case 'SymbolicLink':
            case 'CharacterDevice':
            case 'BlockDevice':
            case 'Directory':
            case 'FIFO':
            case 'ContiguousFile':
            case 'GNUDumpDir':
                break;
            case 'NextFileHasLongLinkpath':
            case 'NextFileHasLongPath':
            case 'OldGnuLongPath':
            case 'GlobalExtendedHeader':
            case 'ExtendedHeader':
            case 'OldExtendedHeader':
                this.meta = true;
                break;
            // NOTE: gnutar and bsdtar treat unrecognized types as 'File'
            // it may be worth doing the same, but with a warning.
            default:
                this.ignore = true;
        }
        /* c8 ignore start */
        if (!header.path) {
            throw new Error('no path provided for tar.ReadEntry');
        }
        /* c8 ignore stop */
        this.path = (0, normalize_windows_path_js_1.normalizeWindowsPath)(header.path);
        this.mode = header.mode;
        if (this.mode) {
            this.mode = this.mode & 0o7777;
        }
        this.uid = header.uid;
        this.gid = header.gid;
        this.uname = header.uname;
        this.gname = header.gname;
        this.size = this.remain;
        this.mtime = header.mtime;
        this.atime = header.atime;
        this.ctime = header.ctime;
        /* c8 ignore start */
        this.linkpath =
            header.linkpath ?
                (0, normalize_windows_path_js_1.normalizeWindowsPath)(header.linkpath)
                : undefined;
        /* c8 ignore stop */
        this.uname = header.uname;
        this.gname = header.gname;
        if (ex) {
            this.#slurp(ex);
        }
        if (gex) {
            this.#slurp(gex, true);
        }
    }
    write(data) {
        const writeLen = data.length;
        if (writeLen > this.blockRemain) {
            throw new Error('writing more to entry than is appropriate');
        }
        const r = this.remain;
        const br = this.blockRemain;
        this.remain = Math.max(0, r - writeLen);
        this.blockRemain = Math.max(0, br - writeLen);
        if (this.ignore) {
            return true;
        }
        if (r >= writeLen) {
            return super.write(data);
        }
        // r < writeLen
        return super.write(data.subarray(0, r));
    }
    #slurp(ex, gex = false) {
        if (ex.path)
            ex.path = (0, normalize_windows_path_js_1.normalizeWindowsPath)(ex.path);
        if (ex.linkpath)
            ex.linkpath = (0, normalize_windows_path_js_1.normalizeWindowsPath)(ex.linkpath);
        Object.assign(this, Object.fromEntries(Object.entries(ex).filter(([k, v]) => {
            // we slurp in everything except for the path attribute in
            // a global extended header, because that's weird. Also, any
            // null/undefined values are ignored.
            return !(v === null ||
                v === undefined ||
                (k === 'path' && gex));
        })));
    }
}
exports.ReadEntry = ReadEntry;
//# sourceMappingURL=read-entry.js.map

/***/ }),

/***/ 5478:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.replace = void 0;
// tar -r
const fs_minipass_1 = __nccwpck_require__(675);
const node_fs_1 = __importDefault(__nccwpck_require__(7561));
const node_path_1 = __importDefault(__nccwpck_require__(9411));
const header_js_1 = __nccwpck_require__(2374);
const list_js_1 = __nccwpck_require__(4306);
const make_command_js_1 = __nccwpck_require__(3830);
const options_js_1 = __nccwpck_require__(4839);
const pack_js_1 = __nccwpck_require__(7788);
// starting at the head of the file, read a Header
// If the checksum is invalid, that's our position to start writing
// If it is, jump forward by the specified size (round up to 512)
// and try again.
// Write the new Pack stream starting there.
const replaceSync = (opt, files) => {
    const p = new pack_js_1.PackSync(opt);
    let threw = true;
    let fd;
    let position;
    try {
        try {
            fd = node_fs_1.default.openSync(opt.file, 'r+');
        }
        catch (er) {
            if (er?.code === 'ENOENT') {
                fd = node_fs_1.default.openSync(opt.file, 'w+');
            }
            else {
                throw er;
            }
        }
        const st = node_fs_1.default.fstatSync(fd);
        const headBuf = Buffer.alloc(512);
        POSITION: for (position = 0; position < st.size; position += 512) {
            for (let bufPos = 0, bytes = 0; bufPos < 512; bufPos += bytes) {
                bytes = node_fs_1.default.readSync(fd, headBuf, bufPos, headBuf.length - bufPos, position + bufPos);
                if (position === 0 &&
                    headBuf[0] === 0x1f &&
                    headBuf[1] === 0x8b) {
                    throw new Error('cannot append to compressed archives');
                }
                if (!bytes) {
                    break POSITION;
                }
            }
            const h = new header_js_1.Header(headBuf);
            if (!h.cksumValid) {
                break;
            }
            const entryBlockSize = 512 * Math.ceil((h.size || 0) / 512);
            if (position + entryBlockSize + 512 > st.size) {
                break;
            }
            // the 512 for the header we just parsed will be added as well
            // also jump ahead all the blocks for the body
            position += entryBlockSize;
            if (opt.mtimeCache && h.mtime) {
                opt.mtimeCache.set(String(h.path), h.mtime);
            }
        }
        threw = false;
        streamSync(opt, p, position, fd, files);
    }
    finally {
        if (threw) {
            try {
                node_fs_1.default.closeSync(fd);
            }
            catch (er) { }
        }
    }
};
const streamSync = (opt, p, position, fd, files) => {
    const stream = new fs_minipass_1.WriteStreamSync(opt.file, {
        fd: fd,
        start: position,
    });
    p.pipe(stream);
    addFilesSync(p, files);
};
const replaceAsync = (opt, files) => {
    files = Array.from(files);
    const p = new pack_js_1.Pack(opt);
    const getPos = (fd, size, cb_) => {
        const cb = (er, pos) => {
            if (er) {
                node_fs_1.default.close(fd, _ => cb_(er));
            }
            else {
                cb_(null, pos);
            }
        };
        let position = 0;
        if (size === 0) {
            return cb(null, 0);
        }
        let bufPos = 0;
        const headBuf = Buffer.alloc(512);
        const onread = (er, bytes) => {
            if (er || typeof bytes === 'undefined') {
                return cb(er);
            }
            bufPos += bytes;
            if (bufPos < 512 && bytes) {
                return node_fs_1.default.read(fd, headBuf, bufPos, headBuf.length - bufPos, position + bufPos, onread);
            }
            if (position === 0 &&
                headBuf[0] === 0x1f &&
                headBuf[1] === 0x8b) {
                return cb(new Error('cannot append to compressed archives'));
            }
            // truncated header
            if (bufPos < 512) {
                return cb(null, position);
            }
            const h = new header_js_1.Header(headBuf);
            if (!h.cksumValid) {
                return cb(null, position);
            }
            /* c8 ignore next */
            const entryBlockSize = 512 * Math.ceil((h.size ?? 0) / 512);
            if (position + entryBlockSize + 512 > size) {
                return cb(null, position);
            }
            position += entryBlockSize + 512;
            if (position >= size) {
                return cb(null, position);
            }
            if (opt.mtimeCache && h.mtime) {
                opt.mtimeCache.set(String(h.path), h.mtime);
            }
            bufPos = 0;
            node_fs_1.default.read(fd, headBuf, 0, 512, position, onread);
        };
        node_fs_1.default.read(fd, headBuf, 0, 512, position, onread);
    };
    const promise = new Promise((resolve, reject) => {
        p.on('error', reject);
        let flag = 'r+';
        const onopen = (er, fd) => {
            if (er && er.code === 'ENOENT' && flag === 'r+') {
                flag = 'w+';
                return node_fs_1.default.open(opt.file, flag, onopen);
            }
            if (er || !fd) {
                return reject(er);
            }
            node_fs_1.default.fstat(fd, (er, st) => {
                if (er) {
                    return node_fs_1.default.close(fd, () => reject(er));
                }
                getPos(fd, st.size, (er, position) => {
                    if (er) {
                        return reject(er);
                    }
                    const stream = new fs_minipass_1.WriteStream(opt.file, {
                        fd: fd,
                        start: position,
                    });
                    p.pipe(stream);
                    stream.on('error', reject);
                    stream.on('close', resolve);
                    addFilesAsync(p, files);
                });
            });
        };
        node_fs_1.default.open(opt.file, flag, onopen);
    });
    return promise;
};
const addFilesSync = (p, files) => {
    files.forEach(file => {
        if (file.charAt(0) === '@') {
            (0, list_js_1.list)({
                file: node_path_1.default.resolve(p.cwd, file.slice(1)),
                sync: true,
                noResume: true,
                onReadEntry: entry => p.add(entry),
            });
        }
        else {
            p.add(file);
        }
    });
    p.end();
};
const addFilesAsync = async (p, files) => {
    for (let i = 0; i < files.length; i++) {
        const file = String(files[i]);
        if (file.charAt(0) === '@') {
            await (0, list_js_1.list)({
                file: node_path_1.default.resolve(String(p.cwd), file.slice(1)),
                noResume: true,
                onReadEntry: entry => p.add(entry),
            });
        }
        else {
            p.add(file);
        }
    }
    p.end();
};
exports.replace = (0, make_command_js_1.makeCommand)(replaceSync, replaceAsync, 
/* c8 ignore start */
() => {
    throw new TypeError('file is required');
}, () => {
    throw new TypeError('file is required');
}, 
/* c8 ignore stop */
(opt, entries) => {
    if (!(0, options_js_1.isFile)(opt)) {
        throw new TypeError('file is required');
    }
    if (opt.gzip ||
        opt.brotli ||
        opt.file.endsWith('.br') ||
        opt.file.endsWith('.tbr')) {
        throw new TypeError('cannot append to compressed archives');
    }
    if (!entries?.length) {
        throw new TypeError('no paths specified to add/replace');
    }
});
//# sourceMappingURL=replace.js.map

/***/ }),

/***/ 1126:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.stripAbsolutePath = void 0;
// unix absolute paths are also absolute on win32, so we use this for both
const node_path_1 = __nccwpck_require__(9411);
const { isAbsolute, parse } = node_path_1.win32;
// returns [root, stripped]
// Note that windows will think that //x/y/z/a has a "root" of //x/y, and in
// those cases, we want to sanitize it to x/y/z/a, not z/a, so we strip /
// explicitly if it's the first character.
// drive-specific relative paths on Windows get their root stripped off even
// though they are not absolute, so `c:../foo` becomes ['c:', '../foo']
const stripAbsolutePath = (path) => {
    let r = '';
    let parsed = parse(path);
    while (isAbsolute(path) || parsed.root) {
        // windows will think that //x/y/z has a "root" of //x/y/
        // but strip the //?/C:/ off of //?/C:/path
        const root = path.charAt(0) === '/' && path.slice(0, 4) !== '//?/' ?
            '/'
            : parsed.root;
        path = path.slice(root.length);
        r += root;
        parsed = parse(path);
    }
    return [r, path];
};
exports.stripAbsolutePath = stripAbsolutePath;
//# sourceMappingURL=strip-absolute-path.js.map

/***/ }),

/***/ 6018:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.stripTrailingSlashes = void 0;
// warning: extremely hot code path.
// This has been meticulously optimized for use
// within npm install on large package trees.
// Do not edit without careful benchmarking.
const stripTrailingSlashes = (str) => {
    let i = str.length - 1;
    let slashesStart = -1;
    while (i > -1 && str.charAt(i) === '/') {
        slashesStart = i;
        i--;
    }
    return slashesStart === -1 ? str : str.slice(0, slashesStart);
};
exports.stripTrailingSlashes = stripTrailingSlashes;
//# sourceMappingURL=strip-trailing-slashes.js.map

/***/ }),

/***/ 3012:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SymlinkError = void 0;
class SymlinkError extends Error {
    path;
    symlink;
    syscall = 'symlink';
    code = 'TAR_SYMLINK_ERROR';
    constructor(symlink, path) {
        super('TAR_SYMLINK_ERROR: Cannot extract through symbolic link');
        this.symlink = symlink;
        this.path = path;
    }
    get name() {
        return 'SymlinkError';
    }
}
exports.SymlinkError = SymlinkError;
//# sourceMappingURL=symlink-error.js.map

/***/ }),

/***/ 7390:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.code = exports.name = exports.isName = exports.isCode = void 0;
const isCode = (c) => exports.name.has(c);
exports.isCode = isCode;
const isName = (c) => exports.code.has(c);
exports.isName = isName;
// map types from key to human-friendly name
exports.name = new Map([
    ['0', 'File'],
    // same as File
    ['', 'OldFile'],
    ['1', 'Link'],
    ['2', 'SymbolicLink'],
    // Devices and FIFOs aren't fully supported
    // they are parsed, but skipped when unpacking
    ['3', 'CharacterDevice'],
    ['4', 'BlockDevice'],
    ['5', 'Directory'],
    ['6', 'FIFO'],
    // same as File
    ['7', 'ContiguousFile'],
    // pax headers
    ['g', 'GlobalExtendedHeader'],
    ['x', 'ExtendedHeader'],
    // vendor-specific stuff
    // skip
    ['A', 'SolarisACL'],
    // like 5, but with data, which should be skipped
    ['D', 'GNUDumpDir'],
    // metadata only, skip
    ['I', 'Inode'],
    // data = link path of next file
    ['K', 'NextFileHasLongLinkpath'],
    // data = path of next file
    ['L', 'NextFileHasLongPath'],
    // skip
    ['M', 'ContinuationFile'],
    // like L
    ['N', 'OldGnuLongPath'],
    // skip
    ['S', 'SparseFile'],
    // skip
    ['V', 'TapeVolumeHeader'],
    // like x
    ['X', 'OldExtendedHeader'],
]);
// map the other direction
exports.code = new Map(Array.from(exports.name).map(kv => [kv[1], kv[0]]));
//# sourceMappingURL=types.js.map

/***/ }),

/***/ 6973:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

// the PEND/UNPEND stuff tracks whether we're ready to emit end/close yet.
// but the path reservations are required to avoid race conditions where
// parallelized unpack ops may mess with one another, due to dependencies
// (like a Link depending on its target) or destructive operations (like
// clobbering an fs object to create one of a different type.)
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UnpackSync = exports.Unpack = void 0;
const fsm = __importStar(__nccwpck_require__(675));
const node_assert_1 = __importDefault(__nccwpck_require__(8061));
const node_crypto_1 = __nccwpck_require__(6005);
const node_fs_1 = __importDefault(__nccwpck_require__(7561));
const node_path_1 = __importDefault(__nccwpck_require__(9411));
const get_write_flag_js_1 = __nccwpck_require__(1663);
const mkdir_js_1 = __nccwpck_require__(8704);
const normalize_unicode_js_1 = __nccwpck_require__(9862);
const normalize_windows_path_js_1 = __nccwpck_require__(762);
const parse_js_1 = __nccwpck_require__(2522);
const strip_absolute_path_js_1 = __nccwpck_require__(1126);
const strip_trailing_slashes_js_1 = __nccwpck_require__(6018);
const wc = __importStar(__nccwpck_require__(4978));
const path_reservations_js_1 = __nccwpck_require__(3588);
const ONENTRY = Symbol('onEntry');
const CHECKFS = Symbol('checkFs');
const CHECKFS2 = Symbol('checkFs2');
const PRUNECACHE = Symbol('pruneCache');
const ISREUSABLE = Symbol('isReusable');
const MAKEFS = Symbol('makeFs');
const FILE = Symbol('file');
const DIRECTORY = Symbol('directory');
const LINK = Symbol('link');
const SYMLINK = Symbol('symlink');
const HARDLINK = Symbol('hardlink');
const UNSUPPORTED = Symbol('unsupported');
const CHECKPATH = Symbol('checkPath');
const MKDIR = Symbol('mkdir');
const ONERROR = Symbol('onError');
const PENDING = Symbol('pending');
const PEND = Symbol('pend');
const UNPEND = Symbol('unpend');
const ENDED = Symbol('ended');
const MAYBECLOSE = Symbol('maybeClose');
const SKIP = Symbol('skip');
const DOCHOWN = Symbol('doChown');
const UID = Symbol('uid');
const GID = Symbol('gid');
const CHECKED_CWD = Symbol('checkedCwd');
const platform = process.env.TESTING_TAR_FAKE_PLATFORM || process.platform;
const isWindows = platform === 'win32';
const DEFAULT_MAX_DEPTH = 1024;
// Unlinks on Windows are not atomic.
//
// This means that if you have a file entry, followed by another
// file entry with an identical name, and you cannot re-use the file
// (because it's a hardlink, or because unlink:true is set, or it's
// Windows, which does not have useful nlink values), then the unlink
// will be committed to the disk AFTER the new file has been written
// over the old one, deleting the new file.
//
// To work around this, on Windows systems, we rename the file and then
// delete the renamed file.  It's a sloppy kludge, but frankly, I do not
// know of a better way to do this, given windows' non-atomic unlink
// semantics.
//
// See: https://github.com/npm/node-tar/issues/183
/* c8 ignore start */
const unlinkFile = (path, cb) => {
    if (!isWindows) {
        return node_fs_1.default.unlink(path, cb);
    }
    const name = path + '.DELETE.' + (0, node_crypto_1.randomBytes)(16).toString('hex');
    node_fs_1.default.rename(path, name, er => {
        if (er) {
            return cb(er);
        }
        node_fs_1.default.unlink(name, cb);
    });
};
/* c8 ignore stop */
/* c8 ignore start */
const unlinkFileSync = (path) => {
    if (!isWindows) {
        return node_fs_1.default.unlinkSync(path);
    }
    const name = path + '.DELETE.' + (0, node_crypto_1.randomBytes)(16).toString('hex');
    node_fs_1.default.renameSync(path, name);
    node_fs_1.default.unlinkSync(name);
};
/* c8 ignore stop */
// this.gid, entry.gid, this.processUid
const uint32 = (a, b, c) => a !== undefined && a === a >>> 0 ? a
    : b !== undefined && b === b >>> 0 ? b
        : c;
// clear the cache if it's a case-insensitive unicode-squashing match.
// we can't know if the current file system is case-sensitive or supports
// unicode fully, so we check for similarity on the maximally compatible
// representation.  Err on the side of pruning, since all it's doing is
// preventing lstats, and it's not the end of the world if we get a false
// positive.
// Note that on windows, we always drop the entire cache whenever a
// symbolic link is encountered, because 8.3 filenames are impossible
// to reason about, and collisions are hazards rather than just failures.
const cacheKeyNormalize = (path) => (0, strip_trailing_slashes_js_1.stripTrailingSlashes)((0, normalize_windows_path_js_1.normalizeWindowsPath)((0, normalize_unicode_js_1.normalizeUnicode)(path))).toLowerCase();
// remove all cache entries matching ${abs}/**
const pruneCache = (cache, abs) => {
    abs = cacheKeyNormalize(abs);
    for (const path of cache.keys()) {
        const pnorm = cacheKeyNormalize(path);
        if (pnorm === abs || pnorm.indexOf(abs + '/') === 0) {
            cache.delete(path);
        }
    }
};
const dropCache = (cache) => {
    for (const key of cache.keys()) {
        cache.delete(key);
    }
};
class Unpack extends parse_js_1.Parser {
    [ENDED] = false;
    [CHECKED_CWD] = false;
    [PENDING] = 0;
    reservations = new path_reservations_js_1.PathReservations();
    transform;
    writable = true;
    readable = false;
    dirCache;
    uid;
    gid;
    setOwner;
    preserveOwner;
    processGid;
    processUid;
    maxDepth;
    forceChown;
    win32;
    newer;
    keep;
    noMtime;
    preservePaths;
    unlink;
    cwd;
    strip;
    processUmask;
    umask;
    dmode;
    fmode;
    chmod;
    constructor(opt = {}) {
        opt.ondone = () => {
            this[ENDED] = true;
            this[MAYBECLOSE]();
        };
        super(opt);
        this.transform = opt.transform;
        this.dirCache = opt.dirCache || new Map();
        this.chmod = !!opt.chmod;
        if (typeof opt.uid === 'number' || typeof opt.gid === 'number') {
            // need both or neither
            if (typeof opt.uid !== 'number' ||
                typeof opt.gid !== 'number') {
                throw new TypeError('cannot set owner without number uid and gid');
            }
            if (opt.preserveOwner) {
                throw new TypeError('cannot preserve owner in archive and also set owner explicitly');
            }
            this.uid = opt.uid;
            this.gid = opt.gid;
            this.setOwner = true;
        }
        else {
            this.uid = undefined;
            this.gid = undefined;
            this.setOwner = false;
        }
        // default true for root
        if (opt.preserveOwner === undefined &&
            typeof opt.uid !== 'number') {
            this.preserveOwner = !!(process.getuid && process.getuid() === 0);
        }
        else {
            this.preserveOwner = !!opt.preserveOwner;
        }
        this.processUid =
            (this.preserveOwner || this.setOwner) && process.getuid ?
                process.getuid()
                : undefined;
        this.processGid =
            (this.preserveOwner || this.setOwner) && process.getgid ?
                process.getgid()
                : undefined;
        // prevent excessively deep nesting of subfolders
        // set to `Infinity` to remove this restriction
        this.maxDepth =
            typeof opt.maxDepth === 'number' ?
                opt.maxDepth
                : DEFAULT_MAX_DEPTH;
        // mostly just for testing, but useful in some cases.
        // Forcibly trigger a chown on every entry, no matter what
        this.forceChown = opt.forceChown === true;
        // turn ><?| in filenames into 0xf000-higher encoded forms
        this.win32 = !!opt.win32 || isWindows;
        // do not unpack over files that are newer than what's in the archive
        this.newer = !!opt.newer;
        // do not unpack over ANY files
        this.keep = !!opt.keep;
        // do not set mtime/atime of extracted entries
        this.noMtime = !!opt.noMtime;
        // allow .., absolute path entries, and unpacking through symlinks
        // without this, warn and skip .., relativize absolutes, and error
        // on symlinks in extraction path
        this.preservePaths = !!opt.preservePaths;
        // unlink files and links before writing. This breaks existing hard
        // links, and removes symlink directories rather than erroring
        this.unlink = !!opt.unlink;
        this.cwd = (0, normalize_windows_path_js_1.normalizeWindowsPath)(node_path_1.default.resolve(opt.cwd || process.cwd()));
        this.strip = Number(opt.strip) || 0;
        // if we're not chmodding, then we don't need the process umask
        this.processUmask =
            !this.chmod ? 0
                : typeof opt.processUmask === 'number' ? opt.processUmask
                    : process.umask();
        this.umask =
            typeof opt.umask === 'number' ? opt.umask : this.processUmask;
        // default mode for dirs created as parents
        this.dmode = opt.dmode || 0o0777 & ~this.umask;
        this.fmode = opt.fmode || 0o0666 & ~this.umask;
        this.on('entry', entry => this[ONENTRY](entry));
    }
    // a bad or damaged archive is a warning for Parser, but an error
    // when extracting.  Mark those errors as unrecoverable, because
    // the Unpack contract cannot be met.
    warn(code, msg, data = {}) {
        if (code === 'TAR_BAD_ARCHIVE' || code === 'TAR_ABORT') {
            data.recoverable = false;
        }
        return super.warn(code, msg, data);
    }
    [MAYBECLOSE]() {
        if (this[ENDED] && this[PENDING] === 0) {
            this.emit('prefinish');
            this.emit('finish');
            this.emit('end');
        }
    }
    [CHECKPATH](entry) {
        const p = (0, normalize_windows_path_js_1.normalizeWindowsPath)(entry.path);
        const parts = p.split('/');
        if (this.strip) {
            if (parts.length < this.strip) {
                return false;
            }
            if (entry.type === 'Link') {
                const linkparts = (0, normalize_windows_path_js_1.normalizeWindowsPath)(String(entry.linkpath)).split('/');
                if (linkparts.length >= this.strip) {
                    entry.linkpath = linkparts.slice(this.strip).join('/');
                }
                else {
                    return false;
                }
            }
            parts.splice(0, this.strip);
            entry.path = parts.join('/');
        }
        if (isFinite(this.maxDepth) && parts.length > this.maxDepth) {
            this.warn('TAR_ENTRY_ERROR', 'path excessively deep', {
                entry,
                path: p,
                depth: parts.length,
                maxDepth: this.maxDepth,
            });
            return false;
        }
        if (!this.preservePaths) {
            if (parts.includes('..') ||
                /* c8 ignore next */
                (isWindows && /^[a-z]:\.\.$/i.test(parts[0] ?? ''))) {
                this.warn('TAR_ENTRY_ERROR', `path contains '..'`, {
                    entry,
                    path: p,
                });
                return false;
            }
            // strip off the root
            const [root, stripped] = (0, strip_absolute_path_js_1.stripAbsolutePath)(p);
            if (root) {
                entry.path = String(stripped);
                this.warn('TAR_ENTRY_INFO', `stripping ${root} from absolute path`, {
                    entry,
                    path: p,
                });
            }
        }
        if (node_path_1.default.isAbsolute(entry.path)) {
            entry.absolute = (0, normalize_windows_path_js_1.normalizeWindowsPath)(node_path_1.default.resolve(entry.path));
        }
        else {
            entry.absolute = (0, normalize_windows_path_js_1.normalizeWindowsPath)(node_path_1.default.resolve(this.cwd, entry.path));
        }
        // if we somehow ended up with a path that escapes the cwd, and we are
        // not in preservePaths mode, then something is fishy!  This should have
        // been prevented above, so ignore this for coverage.
        /* c8 ignore start - defense in depth */
        if (!this.preservePaths &&
            typeof entry.absolute === 'string' &&
            entry.absolute.indexOf(this.cwd + '/') !== 0 &&
            entry.absolute !== this.cwd) {
            this.warn('TAR_ENTRY_ERROR', 'path escaped extraction target', {
                entry,
                path: (0, normalize_windows_path_js_1.normalizeWindowsPath)(entry.path),
                resolvedPath: entry.absolute,
                cwd: this.cwd,
            });
            return false;
        }
        /* c8 ignore stop */
        // an archive can set properties on the extraction directory, but it
        // may not replace the cwd with a different kind of thing entirely.
        if (entry.absolute === this.cwd &&
            entry.type !== 'Directory' &&
            entry.type !== 'GNUDumpDir') {
            return false;
        }
        // only encode : chars that aren't drive letter indicators
        if (this.win32) {
            const { root: aRoot } = node_path_1.default.win32.parse(String(entry.absolute));
            entry.absolute =
                aRoot + wc.encode(String(entry.absolute).slice(aRoot.length));
            const { root: pRoot } = node_path_1.default.win32.parse(entry.path);
            entry.path = pRoot + wc.encode(entry.path.slice(pRoot.length));
        }
        return true;
    }
    [ONENTRY](entry) {
        if (!this[CHECKPATH](entry)) {
            return entry.resume();
        }
        node_assert_1.default.equal(typeof entry.absolute, 'string');
        switch (entry.type) {
            case 'Directory':
            case 'GNUDumpDir':
                if (entry.mode) {
                    entry.mode = entry.mode | 0o700;
                }
            // eslint-disable-next-line no-fallthrough
            case 'File':
            case 'OldFile':
            case 'ContiguousFile':
            case 'Link':
            case 'SymbolicLink':
                return this[CHECKFS](entry);
            case 'CharacterDevice':
            case 'BlockDevice':
            case 'FIFO':
            default:
                return this[UNSUPPORTED](entry);
        }
    }
    [ONERROR](er, entry) {
        // Cwd has to exist, or else nothing works. That's serious.
        // Other errors are warnings, which raise the error in strict
        // mode, but otherwise continue on.
        if (er.name === 'CwdError') {
            this.emit('error', er);
        }
        else {
            this.warn('TAR_ENTRY_ERROR', er, { entry });
            this[UNPEND]();
            entry.resume();
        }
    }
    [MKDIR](dir, mode, cb) {
        (0, mkdir_js_1.mkdir)((0, normalize_windows_path_js_1.normalizeWindowsPath)(dir), {
            uid: this.uid,
            gid: this.gid,
            processUid: this.processUid,
            processGid: this.processGid,
            umask: this.processUmask,
            preserve: this.preservePaths,
            unlink: this.unlink,
            cache: this.dirCache,
            cwd: this.cwd,
            mode: mode,
        }, cb);
    }
    [DOCHOWN](entry) {
        // in preserve owner mode, chown if the entry doesn't match process
        // in set owner mode, chown if setting doesn't match process
        return (this.forceChown ||
            (this.preserveOwner &&
                ((typeof entry.uid === 'number' &&
                    entry.uid !== this.processUid) ||
                    (typeof entry.gid === 'number' &&
                        entry.gid !== this.processGid))) ||
            (typeof this.uid === 'number' &&
                this.uid !== this.processUid) ||
            (typeof this.gid === 'number' && this.gid !== this.processGid));
    }
    [UID](entry) {
        return uint32(this.uid, entry.uid, this.processUid);
    }
    [GID](entry) {
        return uint32(this.gid, entry.gid, this.processGid);
    }
    [FILE](entry, fullyDone) {
        const mode = typeof entry.mode === 'number' ?
            entry.mode & 0o7777
            : this.fmode;
        const stream = new fsm.WriteStream(String(entry.absolute), {
            // slight lie, but it can be numeric flags
            flags: (0, get_write_flag_js_1.getWriteFlag)(entry.size),
            mode: mode,
            autoClose: false,
        });
        stream.on('error', (er) => {
            if (stream.fd) {
                node_fs_1.default.close(stream.fd, () => { });
            }
            // flush all the data out so that we aren't left hanging
            // if the error wasn't actually fatal.  otherwise the parse
            // is blocked, and we never proceed.
            stream.write = () => true;
            this[ONERROR](er, entry);
            fullyDone();
        });
        let actions = 1;
        const done = (er) => {
            if (er) {
                /* c8 ignore start - we should always have a fd by now */
                if (stream.fd) {
                    node_fs_1.default.close(stream.fd, () => { });
                }
                /* c8 ignore stop */
                this[ONERROR](er, entry);
                fullyDone();
                return;
            }
            if (--actions === 0) {
                if (stream.fd !== undefined) {
                    node_fs_1.default.close(stream.fd, er => {
                        if (er) {
                            this[ONERROR](er, entry);
                        }
                        else {
                            this[UNPEND]();
                        }
                        fullyDone();
                    });
                }
            }
        };
        stream.on('finish', () => {
            // if futimes fails, try utimes
            // if utimes fails, fail with the original error
            // same for fchown/chown
            const abs = String(entry.absolute);
            const fd = stream.fd;
            if (typeof fd === 'number' && entry.mtime && !this.noMtime) {
                actions++;
                const atime = entry.atime || new Date();
                const mtime = entry.mtime;
                node_fs_1.default.futimes(fd, atime, mtime, er => er ?
                    node_fs_1.default.utimes(abs, atime, mtime, er2 => done(er2 && er))
                    : done());
            }
            if (typeof fd === 'number' && this[DOCHOWN](entry)) {
                actions++;
                const uid = this[UID](entry);
                const gid = this[GID](entry);
                if (typeof uid === 'number' && typeof gid === 'number') {
                    node_fs_1.default.fchown(fd, uid, gid, er => er ?
                        node_fs_1.default.chown(abs, uid, gid, er2 => done(er2 && er))
                        : done());
                }
            }
            done();
        });
        const tx = this.transform ? this.transform(entry) || entry : entry;
        if (tx !== entry) {
            tx.on('error', (er) => {
                this[ONERROR](er, entry);
                fullyDone();
            });
            entry.pipe(tx);
        }
        tx.pipe(stream);
    }
    [DIRECTORY](entry, fullyDone) {
        const mode = typeof entry.mode === 'number' ?
            entry.mode & 0o7777
            : this.dmode;
        this[MKDIR](String(entry.absolute), mode, er => {
            if (er) {
                this[ONERROR](er, entry);
                fullyDone();
                return;
            }
            let actions = 1;
            const done = () => {
                if (--actions === 0) {
                    fullyDone();
                    this[UNPEND]();
                    entry.resume();
                }
            };
            if (entry.mtime && !this.noMtime) {
                actions++;
                node_fs_1.default.utimes(String(entry.absolute), entry.atime || new Date(), entry.mtime, done);
            }
            if (this[DOCHOWN](entry)) {
                actions++;
                node_fs_1.default.chown(String(entry.absolute), Number(this[UID](entry)), Number(this[GID](entry)), done);
            }
            done();
        });
    }
    [UNSUPPORTED](entry) {
        entry.unsupported = true;
        this.warn('TAR_ENTRY_UNSUPPORTED', `unsupported entry type: ${entry.type}`, { entry });
        entry.resume();
    }
    [SYMLINK](entry, done) {
        this[LINK](entry, String(entry.linkpath), 'symlink', done);
    }
    [HARDLINK](entry, done) {
        const linkpath = (0, normalize_windows_path_js_1.normalizeWindowsPath)(node_path_1.default.resolve(this.cwd, String(entry.linkpath)));
        this[LINK](entry, linkpath, 'link', done);
    }
    [PEND]() {
        this[PENDING]++;
    }
    [UNPEND]() {
        this[PENDING]--;
        this[MAYBECLOSE]();
    }
    [SKIP](entry) {
        this[UNPEND]();
        entry.resume();
    }
    // Check if we can reuse an existing filesystem entry safely and
    // overwrite it, rather than unlinking and recreating
    // Windows doesn't report a useful nlink, so we just never reuse entries
    [ISREUSABLE](entry, st) {
        return (entry.type === 'File' &&
            !this.unlink &&
            st.isFile() &&
            st.nlink <= 1 &&
            !isWindows);
    }
    // check if a thing is there, and if so, try to clobber it
    [CHECKFS](entry) {
        this[PEND]();
        const paths = [entry.path];
        if (entry.linkpath) {
            paths.push(entry.linkpath);
        }
        this.reservations.reserve(paths, done => this[CHECKFS2](entry, done));
    }
    [PRUNECACHE](entry) {
        // if we are not creating a directory, and the path is in the dirCache,
        // then that means we are about to delete the directory we created
        // previously, and it is no longer going to be a directory, and neither
        // is any of its children.
        // If a symbolic link is encountered, all bets are off.  There is no
        // reasonable way to sanitize the cache in such a way we will be able to
        // avoid having filesystem collisions.  If this happens with a non-symlink
        // entry, it'll just fail to unpack, but a symlink to a directory, using an
        // 8.3 shortname or certain unicode attacks, can evade detection and lead
        // to arbitrary writes to anywhere on the system.
        if (entry.type === 'SymbolicLink') {
            dropCache(this.dirCache);
        }
        else if (entry.type !== 'Directory') {
            pruneCache(this.dirCache, String(entry.absolute));
        }
    }
    [CHECKFS2](entry, fullyDone) {
        this[PRUNECACHE](entry);
        const done = (er) => {
            this[PRUNECACHE](entry);
            fullyDone(er);
        };
        const checkCwd = () => {
            this[MKDIR](this.cwd, this.dmode, er => {
                if (er) {
                    this[ONERROR](er, entry);
                    done();
                    return;
                }
                this[CHECKED_CWD] = true;
                start();
            });
        };
        const start = () => {
            if (entry.absolute !== this.cwd) {
                const parent = (0, normalize_windows_path_js_1.normalizeWindowsPath)(node_path_1.default.dirname(String(entry.absolute)));
                if (parent !== this.cwd) {
                    return this[MKDIR](parent, this.dmode, er => {
                        if (er) {
                            this[ONERROR](er, entry);
                            done();
                            return;
                        }
                        afterMakeParent();
                    });
                }
            }
            afterMakeParent();
        };
        const afterMakeParent = () => {
            node_fs_1.default.lstat(String(entry.absolute), (lstatEr, st) => {
                if (st &&
                    (this.keep ||
                        /* c8 ignore next */
                        (this.newer && st.mtime > (entry.mtime ?? st.mtime)))) {
                    this[SKIP](entry);
                    done();
                    return;
                }
                if (lstatEr || this[ISREUSABLE](entry, st)) {
                    return this[MAKEFS](null, entry, done);
                }
                if (st.isDirectory()) {
                    if (entry.type === 'Directory') {
                        const needChmod = this.chmod &&
                            entry.mode &&
                            (st.mode & 0o7777) !== entry.mode;
                        const afterChmod = (er) => this[MAKEFS](er ?? null, entry, done);
                        if (!needChmod) {
                            return afterChmod();
                        }
                        return node_fs_1.default.chmod(String(entry.absolute), Number(entry.mode), afterChmod);
                    }
                    // Not a dir entry, have to remove it.
                    // NB: the only way to end up with an entry that is the cwd
                    // itself, in such a way that == does not detect, is a
                    // tricky windows absolute path with UNC or 8.3 parts (and
                    // preservePaths:true, or else it will have been stripped).
                    // In that case, the user has opted out of path protections
                    // explicitly, so if they blow away the cwd, c'est la vie.
                    if (entry.absolute !== this.cwd) {
                        return node_fs_1.default.rmdir(String(entry.absolute), (er) => this[MAKEFS](er ?? null, entry, done));
                    }
                }
                // not a dir, and not reusable
                // don't remove if the cwd, we want that error
                if (entry.absolute === this.cwd) {
                    return this[MAKEFS](null, entry, done);
                }
                unlinkFile(String(entry.absolute), er => this[MAKEFS](er ?? null, entry, done));
            });
        };
        if (this[CHECKED_CWD]) {
            start();
        }
        else {
            checkCwd();
        }
    }
    [MAKEFS](er, entry, done) {
        if (er) {
            this[ONERROR](er, entry);
            done();
            return;
        }
        switch (entry.type) {
            case 'File':
            case 'OldFile':
            case 'ContiguousFile':
                return this[FILE](entry, done);
            case 'Link':
                return this[HARDLINK](entry, done);
            case 'SymbolicLink':
                return this[SYMLINK](entry, done);
            case 'Directory':
            case 'GNUDumpDir':
                return this[DIRECTORY](entry, done);
        }
    }
    [LINK](entry, linkpath, link, done) {
        // XXX: get the type ('symlink' or 'junction') for windows
        node_fs_1.default[link](linkpath, String(entry.absolute), er => {
            if (er) {
                this[ONERROR](er, entry);
            }
            else {
                this[UNPEND]();
                entry.resume();
            }
            done();
        });
    }
}
exports.Unpack = Unpack;
const callSync = (fn) => {
    try {
        return [null, fn()];
    }
    catch (er) {
        return [er, null];
    }
};
class UnpackSync extends Unpack {
    sync = true;
    [MAKEFS](er, entry) {
        return super[MAKEFS](er, entry, () => { });
    }
    [CHECKFS](entry) {
        this[PRUNECACHE](entry);
        if (!this[CHECKED_CWD]) {
            const er = this[MKDIR](this.cwd, this.dmode);
            if (er) {
                return this[ONERROR](er, entry);
            }
            this[CHECKED_CWD] = true;
        }
        // don't bother to make the parent if the current entry is the cwd,
        // we've already checked it.
        if (entry.absolute !== this.cwd) {
            const parent = (0, normalize_windows_path_js_1.normalizeWindowsPath)(node_path_1.default.dirname(String(entry.absolute)));
            if (parent !== this.cwd) {
                const mkParent = this[MKDIR](parent, this.dmode);
                if (mkParent) {
                    return this[ONERROR](mkParent, entry);
                }
            }
        }
        const [lstatEr, st] = callSync(() => node_fs_1.default.lstatSync(String(entry.absolute)));
        if (st &&
            (this.keep ||
                /* c8 ignore next */
                (this.newer && st.mtime > (entry.mtime ?? st.mtime)))) {
            return this[SKIP](entry);
        }
        if (lstatEr || this[ISREUSABLE](entry, st)) {
            return this[MAKEFS](null, entry);
        }
        if (st.isDirectory()) {
            if (entry.type === 'Directory') {
                const needChmod = this.chmod &&
                    entry.mode &&
                    (st.mode & 0o7777) !== entry.mode;
                const [er] = needChmod ?
                    callSync(() => {
                        node_fs_1.default.chmodSync(String(entry.absolute), Number(entry.mode));
                    })
                    : [];
                return this[MAKEFS](er, entry);
            }
            // not a dir entry, have to remove it
            const [er] = callSync(() => node_fs_1.default.rmdirSync(String(entry.absolute)));
            this[MAKEFS](er, entry);
        }
        // not a dir, and not reusable.
        // don't remove if it's the cwd, since we want that error.
        const [er] = entry.absolute === this.cwd ?
            []
            : callSync(() => unlinkFileSync(String(entry.absolute)));
        this[MAKEFS](er, entry);
    }
    [FILE](entry, done) {
        const mode = typeof entry.mode === 'number' ?
            entry.mode & 0o7777
            : this.fmode;
        const oner = (er) => {
            let closeError;
            try {
                node_fs_1.default.closeSync(fd);
            }
            catch (e) {
                closeError = e;
            }
            if (er || closeError) {
                this[ONERROR](er || closeError, entry);
            }
            done();
        };
        let fd;
        try {
            fd = node_fs_1.default.openSync(String(entry.absolute), (0, get_write_flag_js_1.getWriteFlag)(entry.size), mode);
        }
        catch (er) {
            return oner(er);
        }
        const tx = this.transform ? this.transform(entry) || entry : entry;
        if (tx !== entry) {
            tx.on('error', (er) => this[ONERROR](er, entry));
            entry.pipe(tx);
        }
        tx.on('data', (chunk) => {
            try {
                node_fs_1.default.writeSync(fd, chunk, 0, chunk.length);
            }
            catch (er) {
                oner(er);
            }
        });
        tx.on('end', () => {
            let er = null;
            // try both, falling futimes back to utimes
            // if either fails, handle the first error
            if (entry.mtime && !this.noMtime) {
                const atime = entry.atime || new Date();
                const mtime = entry.mtime;
                try {
                    node_fs_1.default.futimesSync(fd, atime, mtime);
                }
                catch (futimeser) {
                    try {
                        node_fs_1.default.utimesSync(String(entry.absolute), atime, mtime);
                    }
                    catch (utimeser) {
                        er = futimeser;
                    }
                }
            }
            if (this[DOCHOWN](entry)) {
                const uid = this[UID](entry);
                const gid = this[GID](entry);
                try {
                    node_fs_1.default.fchownSync(fd, Number(uid), Number(gid));
                }
                catch (fchowner) {
                    try {
                        node_fs_1.default.chownSync(String(entry.absolute), Number(uid), Number(gid));
                    }
                    catch (chowner) {
                        er = er || fchowner;
                    }
                }
            }
            oner(er);
        });
    }
    [DIRECTORY](entry, done) {
        const mode = typeof entry.mode === 'number' ?
            entry.mode & 0o7777
            : this.dmode;
        const er = this[MKDIR](String(entry.absolute), mode);
        if (er) {
            this[ONERROR](er, entry);
            done();
            return;
        }
        if (entry.mtime && !this.noMtime) {
            try {
                node_fs_1.default.utimesSync(String(entry.absolute), entry.atime || new Date(), entry.mtime);
                /* c8 ignore next */
            }
            catch (er) { }
        }
        if (this[DOCHOWN](entry)) {
            try {
                node_fs_1.default.chownSync(String(entry.absolute), Number(this[UID](entry)), Number(this[GID](entry)));
            }
            catch (er) { }
        }
        done();
        entry.resume();
    }
    [MKDIR](dir, mode) {
        try {
            return (0, mkdir_js_1.mkdirSync)((0, normalize_windows_path_js_1.normalizeWindowsPath)(dir), {
                uid: this.uid,
                gid: this.gid,
                processUid: this.processUid,
                processGid: this.processGid,
                umask: this.processUmask,
                preserve: this.preservePaths,
                unlink: this.unlink,
                cache: this.dirCache,
                cwd: this.cwd,
                mode: mode,
            });
        }
        catch (er) {
            return er;
        }
    }
    [LINK](entry, linkpath, link, done) {
        const ls = `${link}Sync`;
        try {
            node_fs_1.default[ls](linkpath, String(entry.absolute));
            done();
            entry.resume();
        }
        catch (er) {
            return this[ONERROR](er, entry);
        }
    }
}
exports.UnpackSync = UnpackSync;
//# sourceMappingURL=unpack.js.map

/***/ }),

/***/ 8780:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

// tar -u
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.update = void 0;
const make_command_js_1 = __nccwpck_require__(3830);
const replace_js_1 = __nccwpck_require__(5478);
// just call tar.r with the filter and mtimeCache
exports.update = (0, make_command_js_1.makeCommand)(replace_js_1.replace.syncFile, replace_js_1.replace.asyncFile, replace_js_1.replace.syncNoFile, replace_js_1.replace.asyncNoFile, (opt, entries = []) => {
    replace_js_1.replace.validate?.(opt, entries);
    mtimeFilter(opt);
});
const mtimeFilter = (opt) => {
    const filter = opt.filter;
    if (!opt.mtimeCache) {
        opt.mtimeCache = new Map();
    }
    opt.filter =
        filter ?
            (path, stat) => filter(path, stat) &&
                !(
                /* c8 ignore start */
                ((opt.mtimeCache?.get(path) ?? stat.mtime ?? 0) >
                    (stat.mtime ?? 0))
                /* c8 ignore stop */
                )
            : (path, stat) => !(
            /* c8 ignore start */
            ((opt.mtimeCache?.get(path) ?? stat.mtime ?? 0) >
                (stat.mtime ?? 0))
            /* c8 ignore stop */
            );
};
//# sourceMappingURL=update.js.map

/***/ }),

/***/ 449:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.warnMethod = void 0;
const warnMethod = (self, code, message, data = {}) => {
    if (self.file) {
        data.file = self.file;
    }
    if (self.cwd) {
        data.cwd = self.cwd;
    }
    data.code =
        (message instanceof Error &&
            message.code) ||
            code;
    data.tarCode = code;
    if (!self.strict && data.recoverable !== false) {
        if (message instanceof Error) {
            data = Object.assign(message, data);
            message = message.message;
        }
        self.emit('warn', code, message, data);
    }
    else if (message instanceof Error) {
        self.emit('error', Object.assign(message, data));
    }
    else {
        self.emit('error', Object.assign(new Error(`${code}: ${message}`), data));
    }
};
exports.warnMethod = warnMethod;
//# sourceMappingURL=warn-method.js.map

/***/ }),

/***/ 4978:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// When writing files on Windows, translate the characters to their
// 0xf000 higher-encoded versions.
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.decode = exports.encode = void 0;
const raw = ['|', '<', '>', '?', ':'];
const win = raw.map(char => String.fromCharCode(0xf000 + char.charCodeAt(0)));
const toWin = new Map(raw.map((char, i) => [char, win[i]]));
const toRaw = new Map(win.map((char, i) => [char, raw[i]]));
const encode = (s) => raw.reduce((s, c) => s.split(c).join(toWin.get(c)), s);
exports.encode = encode;
const decode = (s) => win.reduce((s, c) => s.split(c).join(toRaw.get(c)), s);
exports.decode = decode;
//# sourceMappingURL=winchars.js.map

/***/ }),

/***/ 4028:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WriteEntryTar = exports.WriteEntrySync = exports.WriteEntry = void 0;
const fs_1 = __importDefault(__nccwpck_require__(7147));
const minipass_1 = __nccwpck_require__(4968);
const path_1 = __importDefault(__nccwpck_require__(1017));
const header_js_1 = __nccwpck_require__(2374);
const mode_fix_js_1 = __nccwpck_require__(1810);
const normalize_windows_path_js_1 = __nccwpck_require__(762);
const options_js_1 = __nccwpck_require__(4839);
const pax_js_1 = __nccwpck_require__(8567);
const strip_absolute_path_js_1 = __nccwpck_require__(1126);
const strip_trailing_slashes_js_1 = __nccwpck_require__(6018);
const warn_method_js_1 = __nccwpck_require__(449);
const winchars = __importStar(__nccwpck_require__(4978));
const prefixPath = (path, prefix) => {
    if (!prefix) {
        return (0, normalize_windows_path_js_1.normalizeWindowsPath)(path);
    }
    path = (0, normalize_windows_path_js_1.normalizeWindowsPath)(path).replace(/^\.(\/|$)/, '');
    return (0, strip_trailing_slashes_js_1.stripTrailingSlashes)(prefix) + '/' + path;
};
const maxReadSize = 16 * 1024 * 1024;
const PROCESS = Symbol('process');
const FILE = Symbol('file');
const DIRECTORY = Symbol('directory');
const SYMLINK = Symbol('symlink');
const HARDLINK = Symbol('hardlink');
const HEADER = Symbol('header');
const READ = Symbol('read');
const LSTAT = Symbol('lstat');
const ONLSTAT = Symbol('onlstat');
const ONREAD = Symbol('onread');
const ONREADLINK = Symbol('onreadlink');
const OPENFILE = Symbol('openfile');
const ONOPENFILE = Symbol('onopenfile');
const CLOSE = Symbol('close');
const MODE = Symbol('mode');
const AWAITDRAIN = Symbol('awaitDrain');
const ONDRAIN = Symbol('ondrain');
const PREFIX = Symbol('prefix');
class WriteEntry extends minipass_1.Minipass {
    path;
    portable;
    myuid = (process.getuid && process.getuid()) || 0;
    // until node has builtin pwnam functions, this'll have to do
    myuser = process.env.USER || '';
    maxReadSize;
    linkCache;
    statCache;
    preservePaths;
    cwd;
    strict;
    mtime;
    noPax;
    noMtime;
    prefix;
    fd;
    blockLen = 0;
    blockRemain = 0;
    buf;
    pos = 0;
    remain = 0;
    length = 0;
    offset = 0;
    win32;
    absolute;
    header;
    type;
    linkpath;
    stat;
    onWriteEntry;
    #hadError = false;
    constructor(p, opt_ = {}) {
        const opt = (0, options_js_1.dealias)(opt_);
        super();
        this.path = (0, normalize_windows_path_js_1.normalizeWindowsPath)(p);
        // suppress atime, ctime, uid, gid, uname, gname
        this.portable = !!opt.portable;
        this.maxReadSize = opt.maxReadSize || maxReadSize;
        this.linkCache = opt.linkCache || new Map();
        this.statCache = opt.statCache || new Map();
        this.preservePaths = !!opt.preservePaths;
        this.cwd = (0, normalize_windows_path_js_1.normalizeWindowsPath)(opt.cwd || process.cwd());
        this.strict = !!opt.strict;
        this.noPax = !!opt.noPax;
        this.noMtime = !!opt.noMtime;
        this.mtime = opt.mtime;
        this.prefix =
            opt.prefix ? (0, normalize_windows_path_js_1.normalizeWindowsPath)(opt.prefix) : undefined;
        this.onWriteEntry = opt.onWriteEntry;
        if (typeof opt.onwarn === 'function') {
            this.on('warn', opt.onwarn);
        }
        let pathWarn = false;
        if (!this.preservePaths) {
            const [root, stripped] = (0, strip_absolute_path_js_1.stripAbsolutePath)(this.path);
            if (root && typeof stripped === 'string') {
                this.path = stripped;
                pathWarn = root;
            }
        }
        this.win32 = !!opt.win32 || process.platform === 'win32';
        if (this.win32) {
            // force the \ to / normalization, since we might not *actually*
            // be on windows, but want \ to be considered a path separator.
            this.path = winchars.decode(this.path.replace(/\\/g, '/'));
            p = p.replace(/\\/g, '/');
        }
        this.absolute = (0, normalize_windows_path_js_1.normalizeWindowsPath)(opt.absolute || path_1.default.resolve(this.cwd, p));
        if (this.path === '') {
            this.path = './';
        }
        if (pathWarn) {
            this.warn('TAR_ENTRY_INFO', `stripping ${pathWarn} from absolute path`, {
                entry: this,
                path: pathWarn + this.path,
            });
        }
        const cs = this.statCache.get(this.absolute);
        if (cs) {
            this[ONLSTAT](cs);
        }
        else {
            this[LSTAT]();
        }
    }
    warn(code, message, data = {}) {
        return (0, warn_method_js_1.warnMethod)(this, code, message, data);
    }
    emit(ev, ...data) {
        if (ev === 'error') {
            this.#hadError = true;
        }
        return super.emit(ev, ...data);
    }
    [LSTAT]() {
        fs_1.default.lstat(this.absolute, (er, stat) => {
            if (er) {
                return this.emit('error', er);
            }
            this[ONLSTAT](stat);
        });
    }
    [ONLSTAT](stat) {
        this.statCache.set(this.absolute, stat);
        this.stat = stat;
        if (!stat.isFile()) {
            stat.size = 0;
        }
        this.type = getType(stat);
        this.emit('stat', stat);
        this[PROCESS]();
    }
    [PROCESS]() {
        switch (this.type) {
            case 'File':
                return this[FILE]();
            case 'Directory':
                return this[DIRECTORY]();
            case 'SymbolicLink':
                return this[SYMLINK]();
            // unsupported types are ignored.
            default:
                return this.end();
        }
    }
    [MODE](mode) {
        return (0, mode_fix_js_1.modeFix)(mode, this.type === 'Directory', this.portable);
    }
    [PREFIX](path) {
        return prefixPath(path, this.prefix);
    }
    [HEADER]() {
        /* c8 ignore start */
        if (!this.stat) {
            throw new Error('cannot write header before stat');
        }
        /* c8 ignore stop */
        if (this.type === 'Directory' && this.portable) {
            this.noMtime = true;
        }
        this.onWriteEntry?.(this);
        this.header = new header_js_1.Header({
            path: this[PREFIX](this.path),
            // only apply the prefix to hard links.
            linkpath: this.type === 'Link' && this.linkpath !== undefined ?
                this[PREFIX](this.linkpath)
                : this.linkpath,
            // only the permissions and setuid/setgid/sticky bitflags
            // not the higher-order bits that specify file type
            mode: this[MODE](this.stat.mode),
            uid: this.portable ? undefined : this.stat.uid,
            gid: this.portable ? undefined : this.stat.gid,
            size: this.stat.size,
            mtime: this.noMtime ? undefined : this.mtime || this.stat.mtime,
            /* c8 ignore next */
            type: this.type === 'Unsupported' ? undefined : this.type,
            uname: this.portable ? undefined
                : this.stat.uid === this.myuid ? this.myuser
                    : '',
            atime: this.portable ? undefined : this.stat.atime,
            ctime: this.portable ? undefined : this.stat.ctime,
        });
        if (this.header.encode() && !this.noPax) {
            super.write(new pax_js_1.Pax({
                atime: this.portable ? undefined : this.header.atime,
                ctime: this.portable ? undefined : this.header.ctime,
                gid: this.portable ? undefined : this.header.gid,
                mtime: this.noMtime ? undefined : (this.mtime || this.header.mtime),
                path: this[PREFIX](this.path),
                linkpath: this.type === 'Link' && this.linkpath !== undefined ?
                    this[PREFIX](this.linkpath)
                    : this.linkpath,
                size: this.header.size,
                uid: this.portable ? undefined : this.header.uid,
                uname: this.portable ? undefined : this.header.uname,
                dev: this.portable ? undefined : this.stat.dev,
                ino: this.portable ? undefined : this.stat.ino,
                nlink: this.portable ? undefined : this.stat.nlink,
            }).encode());
        }
        const block = this.header?.block;
        /* c8 ignore start */
        if (!block) {
            throw new Error('failed to encode header');
        }
        /* c8 ignore stop */
        super.write(block);
    }
    [DIRECTORY]() {
        /* c8 ignore start */
        if (!this.stat) {
            throw new Error('cannot create directory entry without stat');
        }
        /* c8 ignore stop */
        if (this.path.slice(-1) !== '/') {
            this.path += '/';
        }
        this.stat.size = 0;
        this[HEADER]();
        this.end();
    }
    [SYMLINK]() {
        fs_1.default.readlink(this.absolute, (er, linkpath) => {
            if (er) {
                return this.emit('error', er);
            }
            this[ONREADLINK](linkpath);
        });
    }
    [ONREADLINK](linkpath) {
        this.linkpath = (0, normalize_windows_path_js_1.normalizeWindowsPath)(linkpath);
        this[HEADER]();
        this.end();
    }
    [HARDLINK](linkpath) {
        /* c8 ignore start */
        if (!this.stat) {
            throw new Error('cannot create link entry without stat');
        }
        /* c8 ignore stop */
        this.type = 'Link';
        this.linkpath = (0, normalize_windows_path_js_1.normalizeWindowsPath)(path_1.default.relative(this.cwd, linkpath));
        this.stat.size = 0;
        this[HEADER]();
        this.end();
    }
    [FILE]() {
        /* c8 ignore start */
        if (!this.stat) {
            throw new Error('cannot create file entry without stat');
        }
        /* c8 ignore stop */
        if (this.stat.nlink > 1) {
            const linkKey = `${this.stat.dev}:${this.stat.ino}`;
            const linkpath = this.linkCache.get(linkKey);
            if (linkpath?.indexOf(this.cwd) === 0) {
                return this[HARDLINK](linkpath);
            }
            this.linkCache.set(linkKey, this.absolute);
        }
        this[HEADER]();
        if (this.stat.size === 0) {
            return this.end();
        }
        this[OPENFILE]();
    }
    [OPENFILE]() {
        fs_1.default.open(this.absolute, 'r', (er, fd) => {
            if (er) {
                return this.emit('error', er);
            }
            this[ONOPENFILE](fd);
        });
    }
    [ONOPENFILE](fd) {
        this.fd = fd;
        if (this.#hadError) {
            return this[CLOSE]();
        }
        /* c8 ignore start */
        if (!this.stat) {
            throw new Error('should stat before calling onopenfile');
        }
        /* c8 ignore start */
        this.blockLen = 512 * Math.ceil(this.stat.size / 512);
        this.blockRemain = this.blockLen;
        const bufLen = Math.min(this.blockLen, this.maxReadSize);
        this.buf = Buffer.allocUnsafe(bufLen);
        this.offset = 0;
        this.pos = 0;
        this.remain = this.stat.size;
        this.length = this.buf.length;
        this[READ]();
    }
    [READ]() {
        const { fd, buf, offset, length, pos } = this;
        if (fd === undefined || buf === undefined) {
            throw new Error('cannot read file without first opening');
        }
        fs_1.default.read(fd, buf, offset, length, pos, (er, bytesRead) => {
            if (er) {
                // ignoring the error from close(2) is a bad practice, but at
                // this point we already have an error, don't need another one
                return this[CLOSE](() => this.emit('error', er));
            }
            this[ONREAD](bytesRead);
        });
    }
    /* c8 ignore start */
    [CLOSE](cb = () => { }) {
        /* c8 ignore stop */
        if (this.fd !== undefined)
            fs_1.default.close(this.fd, cb);
    }
    [ONREAD](bytesRead) {
        if (bytesRead <= 0 && this.remain > 0) {
            const er = Object.assign(new Error('encountered unexpected EOF'), {
                path: this.absolute,
                syscall: 'read',
                code: 'EOF',
            });
            return this[CLOSE](() => this.emit('error', er));
        }
        if (bytesRead > this.remain) {
            const er = Object.assign(new Error('did not encounter expected EOF'), {
                path: this.absolute,
                syscall: 'read',
                code: 'EOF',
            });
            return this[CLOSE](() => this.emit('error', er));
        }
        /* c8 ignore start */
        if (!this.buf) {
            throw new Error('should have created buffer prior to reading');
        }
        /* c8 ignore stop */
        // null out the rest of the buffer, if we could fit the block padding
        // at the end of this loop, we've incremented bytesRead and this.remain
        // to be incremented up to the blockRemain level, as if we had expected
        // to get a null-padded file, and read it until the end.  then we will
        // decrement both remain and blockRemain by bytesRead, and know that we
        // reached the expected EOF, without any null buffer to append.
        if (bytesRead === this.remain) {
            for (let i = bytesRead; i < this.length && bytesRead < this.blockRemain; i++) {
                this.buf[i + this.offset] = 0;
                bytesRead++;
                this.remain++;
            }
        }
        const chunk = this.offset === 0 && bytesRead === this.buf.length ?
            this.buf
            : this.buf.subarray(this.offset, this.offset + bytesRead);
        const flushed = this.write(chunk);
        if (!flushed) {
            this[AWAITDRAIN](() => this[ONDRAIN]());
        }
        else {
            this[ONDRAIN]();
        }
    }
    [AWAITDRAIN](cb) {
        this.once('drain', cb);
    }
    write(chunk, encoding, cb) {
        /* c8 ignore start - just junk to comply with NodeJS.WritableStream */
        if (typeof encoding === 'function') {
            cb = encoding;
            encoding = undefined;
        }
        if (typeof chunk === 'string') {
            chunk = Buffer.from(chunk, typeof encoding === 'string' ? encoding : 'utf8');
        }
        /* c8 ignore stop */
        if (this.blockRemain < chunk.length) {
            const er = Object.assign(new Error('writing more data than expected'), {
                path: this.absolute,
            });
            return this.emit('error', er);
        }
        this.remain -= chunk.length;
        this.blockRemain -= chunk.length;
        this.pos += chunk.length;
        this.offset += chunk.length;
        return super.write(chunk, null, cb);
    }
    [ONDRAIN]() {
        if (!this.remain) {
            if (this.blockRemain) {
                super.write(Buffer.alloc(this.blockRemain));
            }
            return this[CLOSE](er => er ? this.emit('error', er) : this.end());
        }
        /* c8 ignore start */
        if (!this.buf) {
            throw new Error('buffer lost somehow in ONDRAIN');
        }
        /* c8 ignore stop */
        if (this.offset >= this.length) {
            // if we only have a smaller bit left to read, alloc a smaller buffer
            // otherwise, keep it the same length it was before.
            this.buf = Buffer.allocUnsafe(Math.min(this.blockRemain, this.buf.length));
            this.offset = 0;
        }
        this.length = this.buf.length - this.offset;
        this[READ]();
    }
}
exports.WriteEntry = WriteEntry;
class WriteEntrySync extends WriteEntry {
    sync = true;
    [LSTAT]() {
        this[ONLSTAT](fs_1.default.lstatSync(this.absolute));
    }
    [SYMLINK]() {
        this[ONREADLINK](fs_1.default.readlinkSync(this.absolute));
    }
    [OPENFILE]() {
        this[ONOPENFILE](fs_1.default.openSync(this.absolute, 'r'));
    }
    [READ]() {
        let threw = true;
        try {
            const { fd, buf, offset, length, pos } = this;
            /* c8 ignore start */
            if (fd === undefined || buf === undefined) {
                throw new Error('fd and buf must be set in READ method');
            }
            /* c8 ignore stop */
            const bytesRead = fs_1.default.readSync(fd, buf, offset, length, pos);
            this[ONREAD](bytesRead);
            threw = false;
        }
        finally {
            // ignoring the error from close(2) is a bad practice, but at
            // this point we already have an error, don't need another one
            if (threw) {
                try {
                    this[CLOSE](() => { });
                }
                catch (er) { }
            }
        }
    }
    [AWAITDRAIN](cb) {
        cb();
    }
    /* c8 ignore start */
    [CLOSE](cb = () => { }) {
        /* c8 ignore stop */
        if (this.fd !== undefined)
            fs_1.default.closeSync(this.fd);
        cb();
    }
}
exports.WriteEntrySync = WriteEntrySync;
class WriteEntryTar extends minipass_1.Minipass {
    blockLen = 0;
    blockRemain = 0;
    buf = 0;
    pos = 0;
    remain = 0;
    length = 0;
    preservePaths;
    portable;
    strict;
    noPax;
    noMtime;
    readEntry;
    type;
    prefix;
    path;
    mode;
    uid;
    gid;
    uname;
    gname;
    header;
    mtime;
    atime;
    ctime;
    linkpath;
    size;
    onWriteEntry;
    warn(code, message, data = {}) {
        return (0, warn_method_js_1.warnMethod)(this, code, message, data);
    }
    constructor(readEntry, opt_ = {}) {
        const opt = (0, options_js_1.dealias)(opt_);
        super();
        this.preservePaths = !!opt.preservePaths;
        this.portable = !!opt.portable;
        this.strict = !!opt.strict;
        this.noPax = !!opt.noPax;
        this.noMtime = !!opt.noMtime;
        this.onWriteEntry = opt.onWriteEntry;
        this.readEntry = readEntry;
        const { type } = readEntry;
        /* c8 ignore start */
        if (type === 'Unsupported') {
            throw new Error('writing entry that should be ignored');
        }
        /* c8 ignore stop */
        this.type = type;
        if (this.type === 'Directory' && this.portable) {
            this.noMtime = true;
        }
        this.prefix = opt.prefix;
        this.path = (0, normalize_windows_path_js_1.normalizeWindowsPath)(readEntry.path);
        this.mode =
            readEntry.mode !== undefined ?
                this[MODE](readEntry.mode)
                : undefined;
        this.uid = this.portable ? undefined : readEntry.uid;
        this.gid = this.portable ? undefined : readEntry.gid;
        this.uname = this.portable ? undefined : readEntry.uname;
        this.gname = this.portable ? undefined : readEntry.gname;
        this.size = readEntry.size;
        this.mtime =
            this.noMtime ? undefined : opt.mtime || readEntry.mtime;
        this.atime = this.portable ? undefined : readEntry.atime;
        this.ctime = this.portable ? undefined : readEntry.ctime;
        this.linkpath =
            readEntry.linkpath !== undefined ?
                (0, normalize_windows_path_js_1.normalizeWindowsPath)(readEntry.linkpath)
                : undefined;
        if (typeof opt.onwarn === 'function') {
            this.on('warn', opt.onwarn);
        }
        let pathWarn = false;
        if (!this.preservePaths) {
            const [root, stripped] = (0, strip_absolute_path_js_1.stripAbsolutePath)(this.path);
            if (root && typeof stripped === 'string') {
                this.path = stripped;
                pathWarn = root;
            }
        }
        this.remain = readEntry.size;
        this.blockRemain = readEntry.startBlockSize;
        this.onWriteEntry?.(this);
        this.header = new header_js_1.Header({
            path: this[PREFIX](this.path),
            linkpath: this.type === 'Link' && this.linkpath !== undefined ?
                this[PREFIX](this.linkpath)
                : this.linkpath,
            // only the permissions and setuid/setgid/sticky bitflags
            // not the higher-order bits that specify file type
            mode: this.mode,
            uid: this.portable ? undefined : this.uid,
            gid: this.portable ? undefined : this.gid,
            size: this.size,
            mtime: this.noMtime ? undefined : this.mtime,
            type: this.type,
            uname: this.portable ? undefined : this.uname,
            atime: this.portable ? undefined : this.atime,
            ctime: this.portable ? undefined : this.ctime,
        });
        if (pathWarn) {
            this.warn('TAR_ENTRY_INFO', `stripping ${pathWarn} from absolute path`, {
                entry: this,
                path: pathWarn + this.path,
            });
        }
        if (this.header.encode() && !this.noPax) {
            super.write(new pax_js_1.Pax({
                atime: this.portable ? undefined : this.atime,
                ctime: this.portable ? undefined : this.ctime,
                gid: this.portable ? undefined : this.gid,
                mtime: this.noMtime ? undefined : this.mtime,
                path: this[PREFIX](this.path),
                linkpath: this.type === 'Link' && this.linkpath !== undefined ?
                    this[PREFIX](this.linkpath)
                    : this.linkpath,
                size: this.size,
                uid: this.portable ? undefined : this.uid,
                uname: this.portable ? undefined : this.uname,
                dev: this.portable ? undefined : this.readEntry.dev,
                ino: this.portable ? undefined : this.readEntry.ino,
                nlink: this.portable ? undefined : this.readEntry.nlink,
            }).encode());
        }
        const b = this.header?.block;
        /* c8 ignore start */
        if (!b)
            throw new Error('failed to encode header');
        /* c8 ignore stop */
        super.write(b);
        readEntry.pipe(this);
    }
    [PREFIX](path) {
        return prefixPath(path, this.prefix);
    }
    [MODE](mode) {
        return (0, mode_fix_js_1.modeFix)(mode, this.type === 'Directory', this.portable);
    }
    write(chunk, encoding, cb) {
        /* c8 ignore start - just junk to comply with NodeJS.WritableStream */
        if (typeof encoding === 'function') {
            cb = encoding;
            encoding = undefined;
        }
        if (typeof chunk === 'string') {
            chunk = Buffer.from(chunk, typeof encoding === 'string' ? encoding : 'utf8');
        }
        /* c8 ignore stop */
        const writeLen = chunk.length;
        if (writeLen > this.blockRemain) {
            throw new Error('writing more to entry than is appropriate');
        }
        this.blockRemain -= writeLen;
        return super.write(chunk, cb);
    }
    end(chunk, encoding, cb) {
        if (this.blockRemain) {
            super.write(Buffer.alloc(this.blockRemain));
        }
        /* c8 ignore start - just junk to comply with NodeJS.WritableStream */
        if (typeof chunk === 'function') {
            cb = chunk;
            encoding = undefined;
            chunk = undefined;
        }
        if (typeof encoding === 'function') {
            cb = encoding;
            encoding = undefined;
        }
        if (typeof chunk === 'string') {
            chunk = Buffer.from(chunk, encoding ?? 'utf8');
        }
        if (cb)
            this.once('finish', cb);
        chunk ? super.end(chunk, cb) : super.end(cb);
        /* c8 ignore stop */
        return this;
    }
}
exports.WriteEntryTar = WriteEntryTar;
const getType = (stat) => stat.isFile() ? 'File'
    : stat.isDirectory() ? 'Directory'
        : stat.isSymbolicLink() ? 'SymbolicLink'
            : 'Unsupported';
//# sourceMappingURL=write-entry.js.map

/***/ }),

/***/ 3796:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Node = exports.Yallist = void 0;
class Yallist {
    tail;
    head;
    length = 0;
    static create(list = []) {
        return new Yallist(list);
    }
    constructor(list = []) {
        for (const item of list) {
            this.push(item);
        }
    }
    *[Symbol.iterator]() {
        for (let walker = this.head; walker; walker = walker.next) {
            yield walker.value;
        }
    }
    removeNode(node) {
        if (node.list !== this) {
            throw new Error('removing node which does not belong to this list');
        }
        const next = node.next;
        const prev = node.prev;
        if (next) {
            next.prev = prev;
        }
        if (prev) {
            prev.next = next;
        }
        if (node === this.head) {
            this.head = next;
        }
        if (node === this.tail) {
            this.tail = prev;
        }
        this.length--;
        node.next = undefined;
        node.prev = undefined;
        node.list = undefined;
        return next;
    }
    unshiftNode(node) {
        if (node === this.head) {
            return;
        }
        if (node.list) {
            node.list.removeNode(node);
        }
        const head = this.head;
        node.list = this;
        node.next = head;
        if (head) {
            head.prev = node;
        }
        this.head = node;
        if (!this.tail) {
            this.tail = node;
        }
        this.length++;
    }
    pushNode(node) {
        if (node === this.tail) {
            return;
        }
        if (node.list) {
            node.list.removeNode(node);
        }
        const tail = this.tail;
        node.list = this;
        node.prev = tail;
        if (tail) {
            tail.next = node;
        }
        this.tail = node;
        if (!this.head) {
            this.head = node;
        }
        this.length++;
    }
    push(...args) {
        for (let i = 0, l = args.length; i < l; i++) {
            push(this, args[i]);
        }
        return this.length;
    }
    unshift(...args) {
        for (var i = 0, l = args.length; i < l; i++) {
            unshift(this, args[i]);
        }
        return this.length;
    }
    pop() {
        if (!this.tail) {
            return undefined;
        }
        const res = this.tail.value;
        const t = this.tail;
        this.tail = this.tail.prev;
        if (this.tail) {
            this.tail.next = undefined;
        }
        else {
            this.head = undefined;
        }
        t.list = undefined;
        this.length--;
        return res;
    }
    shift() {
        if (!this.head) {
            return undefined;
        }
        const res = this.head.value;
        const h = this.head;
        this.head = this.head.next;
        if (this.head) {
            this.head.prev = undefined;
        }
        else {
            this.tail = undefined;
        }
        h.list = undefined;
        this.length--;
        return res;
    }
    forEach(fn, thisp) {
        thisp = thisp || this;
        for (let walker = this.head, i = 0; !!walker; i++) {
            fn.call(thisp, walker.value, i, this);
            walker = walker.next;
        }
    }
    forEachReverse(fn, thisp) {
        thisp = thisp || this;
        for (let walker = this.tail, i = this.length - 1; !!walker; i--) {
            fn.call(thisp, walker.value, i, this);
            walker = walker.prev;
        }
    }
    get(n) {
        let i = 0;
        let walker = this.head;
        for (; !!walker && i < n; i++) {
            walker = walker.next;
        }
        if (i === n && !!walker) {
            return walker.value;
        }
    }
    getReverse(n) {
        let i = 0;
        let walker = this.tail;
        for (; !!walker && i < n; i++) {
            // abort out of the list early if we hit a cycle
            walker = walker.prev;
        }
        if (i === n && !!walker) {
            return walker.value;
        }
    }
    map(fn, thisp) {
        thisp = thisp || this;
        const res = new Yallist();
        for (let walker = this.head; !!walker;) {
            res.push(fn.call(thisp, walker.value, this));
            walker = walker.next;
        }
        return res;
    }
    mapReverse(fn, thisp) {
        thisp = thisp || this;
        var res = new Yallist();
        for (let walker = this.tail; !!walker;) {
            res.push(fn.call(thisp, walker.value, this));
            walker = walker.prev;
        }
        return res;
    }
    reduce(fn, initial) {
        let acc;
        let walker = this.head;
        if (arguments.length > 1) {
            acc = initial;
        }
        else if (this.head) {
            walker = this.head.next;
            acc = this.head.value;
        }
        else {
            throw new TypeError('Reduce of empty list with no initial value');
        }
        for (var i = 0; !!walker; i++) {
            acc = fn(acc, walker.value, i);
            walker = walker.next;
        }
        return acc;
    }
    reduceReverse(fn, initial) {
        let acc;
        let walker = this.tail;
        if (arguments.length > 1) {
            acc = initial;
        }
        else if (this.tail) {
            walker = this.tail.prev;
            acc = this.tail.value;
        }
        else {
            throw new TypeError('Reduce of empty list with no initial value');
        }
        for (let i = this.length - 1; !!walker; i--) {
            acc = fn(acc, walker.value, i);
            walker = walker.prev;
        }
        return acc;
    }
    toArray() {
        const arr = new Array(this.length);
        for (let i = 0, walker = this.head; !!walker; i++) {
            arr[i] = walker.value;
            walker = walker.next;
        }
        return arr;
    }
    toArrayReverse() {
        const arr = new Array(this.length);
        for (let i = 0, walker = this.tail; !!walker; i++) {
            arr[i] = walker.value;
            walker = walker.prev;
        }
        return arr;
    }
    slice(from = 0, to = this.length) {
        if (to < 0) {
            to += this.length;
        }
        if (from < 0) {
            from += this.length;
        }
        const ret = new Yallist();
        if (to < from || to < 0) {
            return ret;
        }
        if (from < 0) {
            from = 0;
        }
        if (to > this.length) {
            to = this.length;
        }
        let walker = this.head;
        let i = 0;
        for (i = 0; !!walker && i < from; i++) {
            walker = walker.next;
        }
        for (; !!walker && i < to; i++, walker = walker.next) {
            ret.push(walker.value);
        }
        return ret;
    }
    sliceReverse(from = 0, to = this.length) {
        if (to < 0) {
            to += this.length;
        }
        if (from < 0) {
            from += this.length;
        }
        const ret = new Yallist();
        if (to < from || to < 0) {
            return ret;
        }
        if (from < 0) {
            from = 0;
        }
        if (to > this.length) {
            to = this.length;
        }
        let i = this.length;
        let walker = this.tail;
        for (; !!walker && i > to; i--) {
            walker = walker.prev;
        }
        for (; !!walker && i > from; i--, walker = walker.prev) {
            ret.push(walker.value);
        }
        return ret;
    }
    splice(start, deleteCount = 0, ...nodes) {
        if (start > this.length) {
            start = this.length - 1;
        }
        if (start < 0) {
            start = this.length + start;
        }
        let walker = this.head;
        for (let i = 0; !!walker && i < start; i++) {
            walker = walker.next;
        }
        const ret = [];
        for (let i = 0; !!walker && i < deleteCount; i++) {
            ret.push(walker.value);
            walker = this.removeNode(walker);
        }
        if (!walker) {
            walker = this.tail;
        }
        else if (walker !== this.tail) {
            walker = walker.prev;
        }
        for (const v of nodes) {
            walker = insertAfter(this, walker, v);
        }
        return ret;
    }
    reverse() {
        const head = this.head;
        const tail = this.tail;
        for (let walker = head; !!walker; walker = walker.prev) {
            const p = walker.prev;
            walker.prev = walker.next;
            walker.next = p;
        }
        this.head = tail;
        this.tail = head;
        return this;
    }
}
exports.Yallist = Yallist;
// insertAfter undefined means "make the node the new head of list"
function insertAfter(self, node, value) {
    const prev = node;
    const next = node ? node.next : self.head;
    const inserted = new Node(value, prev, next, self);
    if (inserted.next === undefined) {
        self.tail = inserted;
    }
    if (inserted.prev === undefined) {
        self.head = inserted;
    }
    self.length++;
    return inserted;
}
function push(self, item) {
    self.tail = new Node(item, self.tail, undefined, self);
    if (!self.head) {
        self.head = self.tail;
    }
    self.length++;
}
function unshift(self, item) {
    self.head = new Node(item, undefined, self.head, self);
    if (!self.tail) {
        self.tail = self.head;
    }
    self.length++;
}
class Node {
    list;
    next;
    prev;
    value;
    constructor(value, prev, next, list) {
        this.list = list;
        this.value = value;
        if (prev) {
            prev.next = this;
            this.prev = prev;
        }
        else {
            this.prev = undefined;
        }
        if (next) {
            next.prev = this;
            this.next = next;
        }
        else {
            this.next = undefined;
        }
    }
}
exports.Node = Node;
//# sourceMappingURL=index.js.map

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId].call(module.exports, module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/**
 * The entrypoint for the action.
 */
const { run } = __nccwpck_require__(1713)

run()

})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=index.js.map