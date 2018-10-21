redux版本：4.0.0 

react-redux版本：5.1.0-test.1 

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



#### 3. ```combineReducers```

1. 输入与输出？

   **输入**

   `combineReducers`接收一个由多个```reducer```组合而成```object```作为输入，存入其中。其中`object`中的`value`应与`state`中的`key`（对应的应该称之为`keyState`？？）相对应
   **输出**

   输出一个` combination function`，当调用该函数时，会让传入的```state```和```action```流经内部所有的```reducers```，更新相应的`keyState`

2. 过程

   * 内容校验
   * `reducers`存储
   * 制定`state`和`action`的流经过程



#### 4. `<Provider/>`

1. 输入与输出
   输入`store`， 主要仍是输出一个组件`<Provider />`
2. 过程
   `<Provider/>`利用`React`提供的上下文`Context`，将传入的`store`通过`getChildContext`的方式传递给下面子组件，这样所有的子组件都可以随时访问`store`；