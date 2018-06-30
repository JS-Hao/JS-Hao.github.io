#### 1. 函数柯里化

```javascript
const getAddFunc = a => b => {
    return a + b;
}

const addFunc = getAddFunc(1);
addFunc(2); // 3
addFunc(3); // 4
```

优势：

1. 避免大量的传参——可将可复用的变量以闭包的形式保存起来；
2. 便于复用
3. 降低耦合度和代码冗余



#### 2. 代码组合（```compose```）

耳熟能详的compose，这里提供一种实现思路：（优点：不需要return）;

```javascript
const compose = function(funcList) {
	return funcList.reduce((func1, func2) => {
		return ctx => {
			func1 = func1.bind(null, ctx);
			func2 = func2.bind(null, ctx);
			return func2(func1());
		}
	})
}

const funcA = ctx => {
	ctx.a = 'A';
	console.log('A1', Object.keys(ctx));
	return 1212;
}

const funcB = (ctx, num) => {
	ctx.b = 'B';
	console.log('B1', Object.keys(ctx), num);
}


const funcC = ctx => {
	ctx.c = 'C';
	console.log('C1', Object.keys(ctx));
}

const func = compose([funcA, funcB, funcC]);
func({});
```

