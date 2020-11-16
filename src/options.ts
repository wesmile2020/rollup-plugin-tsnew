import fs from 'fs';

function loopEach(path: string, callback: (path: string) => void) {
    if (!fs.existsSync(path)) return;
    const stats = fs.statSync(path);
    if (stats.isDirectory()) {
        const dir = fs.readdirSync(path);
        for (let i = 0; i < dir.length; i += 1) {
            const curPath = `${path}/${dir[i]}`;
            const curStats = fs.statSync(curPath);
            if (curStats.isDirectory()) {
                loopEach(curPath, callback);
            } else if (curStats.isFile()) {
                callback(curPath);
            }
        }
    } else {
        callback(path);
    }
}

export function getDeclareFile(cwd: string) {
    if (!fs.existsSync(cwd)) return[];
    const status = fs.statSync(cwd);
    const dir = fs.readdirSync(cwd);
    const result: string[] = [];
    for (let i = 0; i < dir.length; i += 1) {
        if (!/node_modules/.test(dir[i])) {
            loopEach(`${cwd}/${dir[i]}`, (url) => {
                if (url.endsWith('.d.ts')) {
                    result.push(url);
                }
            });
        }
    }
    return result;
}
