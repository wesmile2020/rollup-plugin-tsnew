import ts from 'typescript';

export const DEFAULT_COMPILER_OPTIONS: ts.CompilerOptions = {
    skipLibCheck: true,
    module: ts.ModuleKind.ESNext,
    // Always use tslib
    noEmitHelpers: true,
    importHelpers: true,
    // Typescript needs to emit the code for us to work with
    noEmit: false,
    emitDeclarationOnly: false,
    // Preventing Typescript from resolving code may break compilation
    noResolve: false
};

export function formatCompilerOptions(compilerOptions: ts.CompilerOptions) {
    return { ...DEFAULT_COMPILER_OPTIONS, ...compilerOptions, };
}