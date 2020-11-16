import chalk from 'chalk';
import ts from 'typescript';

export function logError(...rest: any) {
    console.log(chalk.bold.red(...rest));
}

export function printDiagnosticError(arr: ts.Diagnostic[]) {
    let isHasError = false;
    for (let i = 0; i < arr.length; i += 1) {
        const diagnostic = arr[i];
        if (diagnostic.category = ts.DiagnosticCategory.Error) {
            isHasError = true;
        }
        const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
        if (diagnostic.file && typeof diagnostic.start === 'number') {
            const { line, character  } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
            logError(`${diagnostic.file.fileName} (${line + 1},${character + 1}): error\n TS${diagnostic.code}:${message}`);
        } else {
            logError(`Error: ${message}`);
        }
    }
    return isHasError;
}