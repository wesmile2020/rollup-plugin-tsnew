import rollup from 'rollup';
import { FilterPattern } from '@rollup/pluginutils';

interface Options {
    include?: FilterPattern;
    exclude?: FilterPattern;
    check?: boolean;
}

declare function typescript(options: Options): rollup.Plugin

export { typescript };
export default typescript;