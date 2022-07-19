import fs from 'fs';
import path from 'path';

export function getFile(p: any) {
    return fs.readFileSync(path.join(__dirname, p), 'utf-8');
}

export function getABI(d: any) {
    return JSON.parse(d);
}