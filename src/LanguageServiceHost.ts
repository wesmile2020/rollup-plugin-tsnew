import ts from 'typescript';
import { getDeclareFile } from './options';

class LanguageServiceHost implements ts.LanguageServiceHost {
    private _compileOptions: ts.CompilerOptions;
    private _versions: Map<string, number> = new Map();
    private _snapshots: Map<string, ts.IScriptSnapshot> = new Map();
    private _fileNames: Set<string> = new Set();
    private _cwd: string;

    constructor(options: ts.CompilerOptions, cwd: string) {
        this._compileOptions = options;
        this._cwd = cwd;
        const files = getDeclareFile(cwd);
        for (let i = 0; i < files.length; i += 1) {
            this._fileNames.add(files[i]);
        }
    }

    getCompilationSettings() {
        return this._compileOptions;
    }

    getScriptFileNames() {
        return [...this._fileNames.values()];
    }

    getScriptVersion(fileName: string) {
        return (this._versions.get(fileName) || 0).toString();
    }

    setScriptSnapshot(fileName: string, code: string) {
        this._fileNames.add(fileName);
        const version = (this._versions.get(fileName) || 0) + 1;
        this._versions.set(fileName, version);
        const snapshot = ts.ScriptSnapshot.fromString(code);
        this._snapshots.set(fileName, snapshot);
    }

    getScriptSnapshot(fileName: string) {
        if (this._snapshots.has(fileName)) {
            return this._snapshots.get(fileName);
        }
        const code = ts.sys.readFile(fileName);
        if (code) {
            this.setScriptSnapshot(fileName, code);
            return this._snapshots.get(fileName);
        }
    }

    getCurrentDirectory() {
        return this._cwd;
    }

    getDefaultLibFileName(opts: ts.CompilerOptions) {
        return ts.getDefaultLibFilePath(opts);
    }
    
    fileExists(path: string) {
        return ts.sys.fileExists(path);
    }

    readFile(path: string, encoding?: string) {
        return ts.sys.readFile(path, encoding);
    }

    readDirectory(path: string, extensions?: string[], exclude?: string[], include?: string[], depth?: number) {
        return ts.sys.readDirectory(path, extensions, exclude, include, depth);
    }

    directoryExists(dirName: string) {
        return ts.sys.directoryExists(dirName);
    }

    getDirectories(dirName: string) {
        return ts.sys.getDirectories(dirName);
    }
}

export default LanguageServiceHost;
