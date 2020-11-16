import path from 'path';
import fs from 'fs';
import ts from 'typescript';

export function normalizePath(fileName: string) {
    return fileName.split(path.win32.sep).join(path.posix.sep);
}

export interface DiagnosticsHost extends ts.FormatDiagnosticsHost {
    getCompilationSettings(): import('typescript').CompilerOptions;
}

export function createFormattingHost(compilerOptions: ts.CompilerOptions): DiagnosticsHost {
    return {
        /** Returns the compiler options for the project. */
        getCompilationSettings: () => compilerOptions,
        /** Returns the current working directory. */
        getCurrentDirectory: () => process.cwd(),
        /** Returns the string that corresponds with the selected `NewLineKind`. */
        getNewLine() {
            switch (compilerOptions.newLine) {
                case ts.NewLineKind.CarriageReturnLineFeed:
                    return '\r\n';
                case ts.NewLineKind.LineFeed:
                    return '\n';
                default:
                    return ts.sys.newLine;
            }
        },
        /** Returns a lower case name on case insensitive systems, otherwise the original name. */
        getCanonicalFileName: (fileName) => {
            return ts.sys.useCaseSensitiveFileNames ? fileName : fileName.toLowerCase();
        }
    };
}

export type Resolver = (
    moduleName: string,
    containingFile: string
) => import('typescript').ResolvedModuleFull | undefined;

export function createModuleResolver(host: DiagnosticsHost): Resolver {
    const compilerOptions = host.getCompilationSettings();
    const cache = ts.createModuleResolutionCache(
        process.cwd(),
        host.getCanonicalFileName,
        compilerOptions
    );
    const moduleHost = { ...ts.sys, ...host };

    return (moduleName, containingFile) => {
        const resolved = ts.nodeModuleNameResolver(
            moduleName,
            containingFile,
            compilerOptions,
            moduleHost,
            cache,
        );
        return resolved.resolvedModule;
    };
}

export function loopEach(path: string, callback: (path: string) => void) {
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
