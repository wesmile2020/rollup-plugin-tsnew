import path from 'path';
import fs from 'fs';
import ts from 'typescript';
import  rollup from 'rollup';
import LanguageServiceHost from './LanguageServiceHost';
import { logError, printDiagnosticError } from './log';

class Engine {
    private _serviceHost: LanguageServiceHost;
    private _service: ts.LanguageService;

    constructor(cwd: string) {
        const configPath = path.resolve(cwd, 'tsconfig.json');
        const { config, error } = ts.readConfigFile(configPath, (url) => fs.readFileSync(url, { encoding: 'utf-8' }));
        if (error) {
            logError(`rpt: Couldn't read tsconfig.json ${error.messageText}`);
            throw new Error('rpt: error');
        }
        const { options, errors } = ts.convertCompilerOptionsFromJson(config.compilerOptions, cwd);
        if (errors.length !== 0) {
            for (let i = 0;i < errors.length; i += 1) {
                logError(`rpt: Couldn't parse tsconfig ${errors[i].messageText}`);
            }
            throw new Error('rpt: error');
        }

        this._serviceHost = new LanguageServiceHost(options, cwd);
        this._service = ts.createLanguageService(this._serviceHost, ts.createDocumentRegistry());
    }

    transform(fileName: string, code: string): rollup.TransformResult {
        const output = ts.transpileModule(code, {
            fileName,
            compilerOptions: this._serviceHost.getCompilationSettings(),
            reportDiagnostics: true,
        });
        const diagnostics = output.diagnostics || [];
        const isHasError = printDiagnosticError(diagnostics);
        if (isHasError) {
            throw new Error('rpt: transform error');
        }
        return {
            code: output.outputText,
            map: output.sourceMapText ? JSON.parse(output.sourceMapText) : null,
        };
    }

    transformWithCheck(fileName: string, code: string): rollup.TransformResult {
        this._serviceHost.setScriptSnapshot(fileName, code);

        const output = this._service.getEmitOutput(fileName);
        const diagnostics = this._service.getCompilerOptionsDiagnostics()
            .concat(this._service.getSyntacticDiagnostics(fileName))
            .concat(this._service.getSemanticDiagnostics(fileName));
        const isHasError = printDiagnosticError(diagnostics);
        if (isHasError) {
            throw new Error('rpt: transform error');
        }
        const { outputFiles } = output;
        let resultCode: string | undefined, resultMap: string | undefined
        let declare, declareMap
        for (let i = 0; i < outputFiles.length; i += 1) {
            if (/\.d\.ts$/.test(outputFiles[i].name)) {
                declare = outputFiles[i].text;
            } else if (/\.d\.ts\.map$/.test(outputFiles[i].name)) {
                declareMap = outputFiles[i].text;
            } else if (/\.map$/.test(outputFiles[i].name)) {
                resultMap = outputFiles[i].text;
            } else {
                resultCode = outputFiles[i].text;
            }
        }
        return {
            code: resultCode,
            map: resultMap ? JSON.parse(resultMap) : null,
        };
    }
}

export default Engine;
