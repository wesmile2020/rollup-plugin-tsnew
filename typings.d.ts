import rollup from 'rollup';

interface Options {
    include?: FilterPattern;
    exclude?: FilterPattern;
    check?: boolean;
}

export default function typescript(options: Options): rollup.Plugin;