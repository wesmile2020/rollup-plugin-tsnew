# rollup-plugin-tsnew

a rollup plugin for compile ts file

options
- include: FilterPattern; files need include to compile.
- exclude: FilterPattern; files need exclude to compile.
- check: boolean; is check ts file.

usage
```javascript
const typescript = require('rollup-plugin-tsnew');

module.exports = {
    plugins: [typescript()]
};
```