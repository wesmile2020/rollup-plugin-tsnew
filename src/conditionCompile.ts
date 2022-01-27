function conditionCompile(code: string, defines: Record<string, boolean>) {
    const arr = code.split('\n');
    let isHasDefine = false;
    let defineValue = false;

    const needSplitCode = [];

    let tempStart = 0;

    for (let i = 0; i < arr.length; i += 1) {
        if (/^\/\/\s*#if/.test(arr[i])) {
            isHasDefine = true;
            tempStart = i;
            const itemArr = arr[i].split(/\s+/);
            defineValue = defines[itemArr[itemArr.length - 1]];
        } else if (/^\/\/\s*#elif/.test(arr[i])) {
            // 处理前面是否需要remove
            if (isHasDefine && !defineValue) {
                needSplitCode.push([tempStart, i]);
            }

            tempStart = i;
            const itemArr = arr[i].split(/\s+/);
            defineValue = !defineValue && defines[itemArr[itemArr.length - 1]];
        } else if (/^\/\/\s*#el/.test(arr[i])) {
            // 处理前面是否需要remove
            if (isHasDefine && !defineValue) {
                needSplitCode.push([tempStart, i]);
            }
            tempStart = i;
            defineValue = !defineValue;
        } if  (/^\/\/\s*#endif/.test(arr[i])) {
            // 处理前面是否需要remove
            if (isHasDefine && !defineValue) {
                needSplitCode.push([tempStart, i]);
            }
            isHasDefine = false;
        }
    }

    let result: string[] = [];
    tempStart = 0
    for (let i = 0; i < needSplitCode.length; i += 1) {
        const [start, end] = needSplitCode[i];
        result = result.concat(arr.slice(tempStart, start))
        tempStart = end;
    }
    result = result.concat(arr.slice(tempStart, arr.length));

    return result.join('\n');
}

export default conditionCompile;
