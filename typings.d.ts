import rollup from 'rollup';

interface Options {
    include?: FilterPattern;
    exclude?: FilterPattern;
    check?: boolean;
}

export { typescript };
export default function typescript(options: Options): rollup.Plugin;