# rollup-plugin-tsnew

a rollup plugin for compile ts file

options
- include: FilterPattern; files need include to compile.
- exclude: FilterPattern; files need exclude to compile.
- check: boolean; is check ts file.
- enableConditionCompile: boolean; 是否启用条件编译
- defines: Record<string, boolean>; 全局变量，用于条件编译

usage
```javascript
import typescript from 'rollup-plugin-tsnew'

module.exports = {
    plugins: [typescript()]
};
```

example 启动条件编译


原始代码
```typescript
//#if DEBUG
console.log('this is debug code');
//#el
console.log('production code');
//#endif
console.log('some other code');
```

rollup plugin config
```javascript
import typescript from 'rollup-plugin-tsnew'

module.exports = {
    plugins: [
        typescript({
            enableConditionCompile: true,
            defines: { DEBUG: true }
        })
    ]
};
```

原始代码将会编译成
```typescript
//#if DEBUG
console.log('this is debug code');
//#el
console.log('some other code');
```