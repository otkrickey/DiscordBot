"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.token = exports.port = exports.prefix = void 0;
require('dotenv').config();
const dotenv = (value) => { var _a; return (_a = process.env[value.toUpperCase()]) !== null && _a !== void 0 ? _a : ((value) => { console.error(`[dotenv Error] Please specify '${value.toUpperCase()}' for '.env'.`); return 'error'; })(value); };
exports.prefix = dotenv('prefix');
exports.port = dotenv('port');
exports.token = dotenv('token');
//# sourceMappingURL=.env.js.map