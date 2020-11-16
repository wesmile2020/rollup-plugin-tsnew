import rollup from 'rollup';
import fs from 'fs';
import { createFilter, FilterPattern } from '@rollup/pluginutils';
import Engine from './Engine';

// const tslibPkg = require('tslib/package.json');

interface Options {
    include?: FilterPattern;
    exclude?: FilterPattern;
    check?: boolean;
}

const defaultOptions: Options = {
    include: ['*.ts+(|x)', '**/*.ts+(|x)'],
    exclude: ['*.d.ts', '**/*.d.ts'],
    check: true,
};


function typescript(options: Options): rollup.Plugin {
    const opts = { ...defaultOptions, ...options };
    const filter = createFilter(opts.include, opts.exclude);
    const cwd = process.cwd();
    
    const engine = new Engine(cwd);
    // process tslib
    // const tslibPath = require.resolve(`tslib/${tslibPkg.module}`);
    // const tslib = fs.readFileSync(tslibPath, 'utf-8');
    // const TSLIb_VIRTUAL = '\0tslib';

    return {
        name: 'rpt',

        resolveId(source, importer) {
            if (!importer) return null;
            
        },

        transform(code: string, id: string) {
            if (!filter(id)) return;
            if (opts.check) {
                return engine.transformWithCheck(id, code);
            } else {
                return engine.transform(id, code);
            }
        }
    }
}

export { typescript };

export default typescript;
