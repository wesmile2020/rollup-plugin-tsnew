import rollup from 'rollup';
import { FilterPattern } from '@rollup/pluginutils';

interface Options {
    include?: FilterPattern;
    exclude?: FilterPattern;
    check?: boolean;
}

export { typescript };
export default function typescript(options: Options): rollup.Plugin;