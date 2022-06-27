## Webpack5 配置指南

### 起步
```
mkdir webpack-demo
cd webpack-demo
npm init -y
npm install webpack webpack-cli -D

```

```
+ |- index.html
+ |- /src
+   |- index.js
```
> src/index.js
```
function component() {
  const element = document.createElement('div');

  // lodash（目前通过一个 script 引入）对于执行这一行是必需的
  element.innerHTML = _.join(['Hello', 'webpack'], ' ');

  return element;
}

document.body.appendChild(component());

```

> index.html
```
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>起步</title>
    <script src="https://unpkg.com/lodash@4.17.20"></script>
  </head>
  <body>
    <script src="./src/index.js"></script>
  </body>
</html>
```
[npm 文档](https://docs.npmjs.com/cli/v8/commands/npm-install)

> package.json

```
  - "main": "index.js",
  + "private": true,
```
```
 + |- /dist
   | +   | - index.html |
   | --- | ------------ |index.html
 ```

> 安装loadsh
 ```
npm install --save lodash

在安装一个 package，而此 package 要打包到生产环境 bundle 中时，你应该使用 npm install --save。如果你在安装一个用于开发环境的 package 时（例如，linter, 测试库等），你应该使用 npm install --save-dev。
 ```

> src/index.js
```
+ import _ from 'lodash';

 ```

> dist/index.js

```
-  <script src="https://unpkg.com/lodash@4.17.20"></script>
-  <script src="./src/index.js"></script>
+  <script src="main.js"></script>

 ```

> node

```
npx webpack 
会在dist文件夹下生成一个main.js,可以在浏览下打开index.html

 ```
> 有个报错，lodash 会找不到 他会引入缓存中的，需要请下缓存
```
Module not found: Error: Can't resolve 'lodash'  
 ```

 > package.json

 ```
+ "build": "webpack"
 ```

 > npm 命令

```
npm i --save
npm i -S
npm i --save--dev（官方说等同于-D,实际测试不是）
npm i -D 只有这个才会安装到devDependencies，其他都是dependencies
 ```

 > 使用一个配置文件

 ```
+ |- webpack.config.js

const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
如果 webpack.config.js存在
npx webpack --config webpack.config.js === npx webpack

可以通过在 npm run build 命令与参数之间添加两个连接符的方式向 webpack 传递自定义参数，例如：npm run build -- --color
 ```

### 管理资源

> dist/index.html
 
```
  -  <script src="main.js"></script>
  + <script src="bundle.js"></script>
 ```
 > webpack.config.js

 ```
  -  filename: 'main.js',
  +  filename: 'bundle.js',
 ```

 > 加载css

 ```
 加载css 需要引入style-loader、css-loader，并在 module 配置 中添加这些 loader：

 npm install -D style-loader css-loader
模块 loader 可以链式调用。链中的每个 loader 都将对资源进行转换。链会逆序执行。第一个 loader 将其结果（被转换后的资源）传递下一个 loader，依此类推。最后，webpack 期望链中的最后的 loader 返回 JavaScript。

应保证 loader 的先后顺序：'style-loader' 在前，而 'css-loader' 在后。如果不遵守此约定，webpack 可能会抛出错误。

 webpack.config.js
+--------+
    module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
 ```
 > src/style.css

 ```
.hello {
  color: "#F66"
}
 ```

 > src/index.js

 ```
  + import "./style.css";
  + element.classList.add('hello');
 ```

 > 加载图片

 ```
  src/img.jpeg

  webpack.config.js
  rules
  {
    test: /\.(png|svg|jpg|jpeg|gif)$/i,
    type: 'asset/resource',
  },

  src/index.js
  // 将图像添加到我们已经存在的 div 中。
  import Icon from "./img/jpeg"

  const myIcon = new Image();
  myIcon.src = Icon;

  element.appendChild(myIcon);


 ```
 > 加载字体

 ```
 webpack.config.js
{
  test: /\.(woff|woff2|eot|ttf|otf)$/i,
  type: 'asset/resource',
},
 ```
> 加载数据

```
json 支持是内置的
import Data from './data.json'
csv和xml需要引入csv-loader xml-loader
npm install -D csv-loader xml-loader

import Csv from "./my-csv.csv"
import Xml from "./my-xml.xml"

console.log("csv:",Csv);
console.log("xml:",Xml);

只有在使用 JSON 模块默认导出时会没有警告。

// 没有警告
import data from './data.json';

// 显示警告，规范不允许这样做。
import { foo } from './data.json';
 ```

 > 自定义 JSON 模块 parser

 ```
通过使用 自定义 parser 替代特定的 webpack loader，可以将任何 toml、yaml 或 json5 文件作为 JSON 模块导入。
npm install toml yamljs json5 --save-dev

webpack.config.js

+ const yaml = require('yamljs');

  {
    test: /\.yaml$/i,
    type: 'json',
    parser: {
      parse: yaml.parse,
    },
  },


src/index.js

+ import yaml from './data.yaml';

console.log(yaml.title); // output `YAML Example`
console.log(yaml.owner.name); // output `Tom Preston-Werner`
  ```

### 管理输出

> 创建print.js

```
src/print.js

export default function printMe () {
    console.log("我来自于print.js")
}

src/index.js

import printMe from "./pringt.js"

const btn = document.createElement('button');
btn.innerHTML = 'Click me and check the console!';
btn.onclick = printMe;

index.html
+ <script src="./print.bundle.js"></script>
- <script src="bundle.js"></script>
+ <script src="./index.bundle.js"></script>

webpack.config.js
- entry: './src/index.js',
+ entry: {
    index: './src/index.js',
    print: './src/print.js',
  },

- filename: 'bundle.js',
+ filename: '[name].bundle.js',

? 如果我们更改了我们的一个入口起点的名称，甚至添加了一个新的入口，会发生什么？会在构建时重新命名生成的 bundle，但是我们的 index.html 文件仍然引用旧的名称。让我们用 HtmlWebpackPlugin 来解决这个问题。

```
> 设置 HtmlWebpackPlugin
```
npm install -D html-webpack-plugin

webpack.config.js

const HtmlWebpackPlugin = require('html-webpack-plugin');

plugins: [
  new HtmlWebpackPlugin({
    title: '管理输出',
  }),
],

```
> 清理 /dist 文件夹

```
output: {
  clean: true
}

```

> 通过 WebpackManifestPlugin 插件，可以将 manifest
>  数据提取为一个 json 文件以供使用。

[WebpackManifestPlugin](https://github.com/shellscape/webpack-manifest-plugin)

> 开发环境

```
webpack.config.js

mode: development
```

> 使用 source map

```
devtool: 'inline-source-map',


在浏览器的console 中

不加
VM654 print.js:7 Uncaught ReferenceError: cnosole is not defined
    at HTMLButtonElement.printMe (VM654 print.js:7:5)

加了是显示原文件的
print.js:3 Uncaught ReferenceError: cnosole is not defined
    at HTMLButtonElement.printMe (print.js:3:1)
```

> 在每次编译代码时，手动运行 npm run build 会显得很麻烦。

```
三种方式解决

使用 watch mode(观察模式)(但是并不能刷新浏览器)
1. 添加一个命令

"watch": "webpack --watch",

2. 使用 webpack-dev-server(同时能刷新浏览器)

webpack-dev-server 会从 output.path 中定义的目录中的
 bundle 文件提供服务，即文件将可以通过
  http://[devServer.host]:[devServer.port]/[output.publicPath]/[output.filename] 
  进行访问。

npm install -D webpack-dev-server

webpack.config.js

  devServer: {
    static: './dist',
  },
   optimization: {
    runtimeChunk: 'single',
  },

  package.json

  "start": "webpack serve --open",

  3. 使用 webpack-dev-middleware（了解一下）

```
[webpack-dev-middleware](https://webpack.docschina.org/guides/development/#using-webpack-dev-middleware)

### 代码分离

mini-css-extract-plugin: 用于将 CSS 从主应用程序中分离。

[mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin)

### 缓存

```
webpack.config.js
output: {
  filename: '[name].[contenthash].js',
}

```

> 提取第三方库（library）
```
webpack.config.js
 splitChunks: {
       cacheGroups: {
         vendor: {
           test: /[\\/]node_modules[\\/]/,
           name: 'vendors',
           chunks: 'all',
         },
       },
     },
```
> 模块标识符

```
webpack.config.js

optimization: {
     moduleIds: 'deterministic',
     }
```


### 环境变量

```
webpack.config.js

修改为
函数
module.exports = (env) => {
    console.log(env)
    return {}
}
```

### 构建性能

```
将 loader 应用于最少数量的必要模块,设置制定文件夹

rules: [
  {
    test: /\.js$/,
    include: path.resolve(__dirname, 'src'),
    loader: 'babel-loader',
  },
],

```

### 内容安全策略

```
Webpack 能够为其加载的所有脚本添加 nonce。要启用此功能，需要在引入的入口脚本中设置一个 __webpack_nonce__ 变量。应该为每个唯一的页面视图生成和提供一个唯一的基于 hash 的 nonce，这就是为什么 __webpack_nonce__ 要在入口文件中指定，而不是在配置中指定的原因。注意，nonce 应该是一个 base64 编码的字符串。

src/index.js
__webpack_nonce__ = 'c29tZSBjb29sIHN0cmluZyB3aWxsIHBvcCB1cCAxMjM=';
```
### 开发 - [Vagrant](https://www.vagrantup.com/)

```
如果你在开发一个更加高级的项目，并且使用 Vagrant 来实现在虚拟机(Virtual Machine)上运行你的开发环境，那你可能会需要在虚拟机中运行 webpack。

```

### [依赖管理](https://webpack.docschina.org/guides/dependency-management/)

### [安装](https://webpack.docschina.org/guides/installation/)

### 模块热替换

```
webpack-dev-server 4.0 以上默认开启
devServer: {
  static: './dist',
  hot: true,
},
```
### Tree Shaking

```
tree shaking 是一个术语，通常用于描述移除 JavaScript 上下文中的未引用代码(dead-code)。它依赖于 ES2015 模块语法的 静态结构 特性，例如 import 和 export。这个术语和概念实际上是由ES2015 模块打包工具 rollup 普及起来的。

webpack.config.js 

optimization: {
   usedExports: true,
 },
```

### 生产环境

```
生产环境和开发环境使用一套配置

npm i webpack-merge -D

删除 webpack.config.js

+ webpack.common.js

改回 module.exports = { }
把mode，devtool，devServer 去除，其他公用

+ webpack.dev.js
const { merge } = require('webpack-merge');
 const common = require('./webpack.common.js');

 module.exports = merge(common, {
   mode: 'development',
   devtool: 'inline-source-map',
   devServer: {
     static: './dist',
   },
 });
+ webpack.prod.js

const { merge } = require('webpack-merge');
 const common = require('./webpack.common.js');

 module.exports = merge(common, {
   mode: 'production',
 });

 package.json

 "start": "webpack serve --open --config webpack.dev.js",
"build": "webpack --config webpack.prod.js"


然后出现一个问题，样式不生效了

原因：package.json  中设置了sideEffects:false

删除即可

引入 mini-css-extract-plugin

webpack.common.js 

指定图片打包地址
plugins: [
    ...,
    new MiniCssExtractPlugin({
        filename: 'css/[name].css'
    })
],
module: {
    rules: [
        {
            test: /\.css$/i,
            // use: ['style-loader', 'css-loader'],//css
            use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
        ]
     }

指定img 打包地址

{
    test: /\.(png|svg|jpg|jpeg|gif)$/i,//图片
    type: 'asset/resource',
    generator: {
        filename: 'img/[name].[hash:8].[ext]'
    }
},

指定 js 打包地址

output: {
    filename: 'js/[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
},

```
### [懒加载](https://webpack.docschina.org/guides/lazy-loading/)

### ECMAScript 模块

```
导入
export const CONSTANT = 42;

export let variable = 42;
// 对外暴露的变量为只读
// 无法从外部修改

export function fun() {
  console.log('fun');
}

export class C extends Super {
  method() {
    console.log('method');
  }
}

let a, b, other;
export { a, b, other as c };

export default 1 + 2 + 3 + more();

导出
import { CONSTANT, variable } from './module.js';
// 导入由其他模块导出的“绑定”
// 这些绑定是动态的. 这里并非获取到了值的副本
// 而是当将要访问“variable”时
// 再从导入的模块中获取当前值

import * as module from './module.js';
module.fun();
// 导入包含所有导出内容的“命名空间对象”

import theDefaultValue from './module.js';
// 导入 `default` 导出的快捷方式


默认情况下，webpack 将自动检测文件是 ESM 还是其他模块系统。

Node.js 通过设置 package.json 中的属性来显式设置文件模块类型。 在 package.json 中设置 "type": "module" 会强制 package.json 下的所有文件使用 ECMAScript 模块。 设置 "type": "commonjs" 将会强制使用 CommonJS 模块。

{
  "type": "module"
}
```
> Shimming 预置依赖(我们不推荐使用全局依赖)

```

shimming 是一个库(library)，它将一个新的 API 引入到一个旧的环境中，而且仅靠旧的环境中已有的手段实现。polyfill 就是一个用在浏览器 API 上的 shimming。我们通常的做法是先检查当前浏览器是否支持某个 API，如果不支持的话就按需加载对应的polyfill。然后新旧浏览器就都可以使用这个 API 了。

webpack.common.js

const webpack = require('webpack');
// 全局使用_
 plugins: [
    new webpack.ProvidePlugin({
      _: 'lodash',
    }),
  ],
// 全局使用loadsh 中的 join(按需)

plugins: [
  new webpack.ProvidePlugin({
    join: ['lodash', 'join'],
  }),
],




```

> typescript

```
npm install --save-dev typescript ts-loader
+ src/index.ts

+ tsconfig.json

{
  "compilerOptions": {
    "outDir": "./dist/",
    "noImplicitAny": true,
    "module": "es6",
    "target": "es5",
    "jsx": "react",
    "allowJs": true,
    "moduleResolution": "node"
  }
}

webpack.common.js

rules: [
  {
    test: /\.tsx?$/,
    use: 'ts-loader',
    exclude: /node_modules/,
  },
]
// 与module:{} 同级
resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },

+ import * as _ from 'lodash';

  如果想在 TypeScript 中保留如import _ from 'lodash';的语法被让它作为一种默认的导入方式，需要在文件 tsconfig.json 中设置 "allowSyntheticDefaultImports" : true 和"esModuleInterop" : true 。这个是与 TypeScript 相关的配置，在本文档提及仅供参考。

   开启SourceMap

   tsconfig.json

   + "sourceMap": true,
现在，我们需要告诉 webpack 提取这些 source map，并内联到最终的 bundle 中。

webpack.dev.js

+ devtool: 'inline-source-map',

```
查看 [TypeScript](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) 官方文档 了解更多关于 tsconfig.json 的配置选项。


### [web Workers](https://webpack.docschina.org/guides/web-workers/)

### [渐进式网络应用程序](https://webpack.docschina.org/guides/progressive-web-application/)

### [公共路径](https://webpack.docschina.org/guides/public-path/)

### [集成](https://webpack.docschina.org/guides/integrations/)

### [资源模块](https://webpack.docschina.org/guides/asset-modules/)

### [entry 高级用法](https://webpack.docschina.org/guides/entry-advanced/)

### [Package exports](https://webpack.docschina.org/guides/package-exports/)






