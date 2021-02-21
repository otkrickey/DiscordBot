require('dotenv').config();
const dotenv = (value: string): string => { return process.env[value.toUpperCase()] ?? ((value: string): string => { console.error(`[dotenv Error] Please specify '${value.toUpperCase()}' for '.env'.`); return 'error'; })(value); }
export const prefix = dotenv('prefix');
export const port = dotenv('port');
export const token = dotenv('token');