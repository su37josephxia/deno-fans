# Deno资料汇总

> 官方网站 https://deno.land/



## 介绍

### 名字的由来

Deno是又Node的发明人Ryan Dahl（利安达迩）编写的下一代服务器端运行时环境。所以任性的作者将Node的音节颠倒过来作为新框架的名字。

### 发音

大家可以发音为“德诺”或“迪诺”，我更喜欢叫他迪诺。

### Logo

Deno和恐龙的发音(dinosaur)[ˈdaɪnəsɔːr]非常相近。所以官方都使用小恐龙标记。

![image-20200408151836617](assets/image-20200408151836617.png)

### 创作动机

简单的说就是觉得原来的不好，所以要升级一下。

Ryan Dahl在2007-2012年一直在维护NodeJS，后来他把Nodejs移交给其他开发者，自己转而研究AI。跑一下题AI也确实是目前最有研发潜力的技术。

但是他始终不太喜欢Python，希望用JS搞AI，但是当他再次使用NodeJS时他却发现这个框架已经背离了他的初衷。所以希望重新来过。



### Node不足与Deno改进

#### 异步API不统一

##### 问题

异步处理同时存在callback和Promise两种写法

我们知道8.0以前的node api基本上都是callback方式的，为了解决这个问题一方面node慢慢增加了一部分promise写法的api。另外在util包中增加了一个promisify接口用于把回调方式的api转换为promise方式

```js
const {promisify} = require('util')
const readFile = promisify(fs.readFile)
readFile('./conf.js').then(data=>console.log(data))
```

##### 改进

作为改进Deno统一使用Promise接口，配合async写法整个系统变得流畅统一了。

对于异步API的控制不是很熟悉的同学可以参考一下我的另一篇文章

https://juejin.im/post/5e8d8b9751882573ad5e11b3



#### 不兼容ES模块

##### 问题

NodeJs自己的CommonJS与ES不兼容，导致了NodeJS一直无法完美的兼容ES6 模块语法。

##### 改进

使用了TS语言，完全兼容ES模块。

#### 复杂的Npm模块管理工具

##### 问题

想一想每次下载代码后不得不npm i安装依赖，的确很让人头疼。这是由于一个中心化的模块存储方式造成的。这里你可能认为没有什么不妥，但是想想目前后端的分布式系统只要把服务注册到zookeeper上面。就可轻松的被调用你就会感到差距在哪里。

##### 改进

Deno采用不强制中心化存储方式，换句话说你可以加载任何地方的模块。

#### 缺乏安全性问题

##### 问题

Node没有安全模块 如果下载别人的模块做了什么你完全不知道，比如他在自己的模块中加入了挖矿程序。你完全控制不了。

##### 改进

引入安全机制 

默认情况下不具备读写权限。需要显示代开权限

```js
--allow-read：打开读权限，可以指定可读的目录，比如--allow-read=/temp。
--allow-write：打开写权限。
--allow-net=google.com：允许网络通信，可以指定可请求的域，比如--allow-net=google.com。
--allow-env：允许读取环境变量。
```



#### 依赖大量外部工具

##### 问题

由于在开发中要解决打包，转码(ES6->ES5 或 TS ->ES5)格式检查等很多问题，需要大量的外部工具支持，一个成熟项目需要一套工具链的支持。 早就不是那个开罐就吃的方便面而是需要一个全家桶（webpack babel，typescript、eslint、prettier......）

##### 改进

Deno 内置了开发者需要的各种功能包括打包、格式美化、测试、安装、文档生成等软件生命周期的各种功能。

```bash
deno bundle：将脚本和依赖打包
deno eval：执行代码
deno fetch：将依赖抓取到本地
deno fmt：代码的格式美化
deno help：等同于-h参数
deno info：显示本地的依赖缓存
deno install：将脚本安装为可执行文件
deno repl：进入 REPL 环境
deno run：运行脚本
deno test：运行测试
```





## 安装

Using Shell:

```
curl -fsSL https://deno.land/x/install/install.sh | sh
```

Or using PowerShell:

```
iwr https://deno.land/x/install/install.ps1 -useb | iex
```

Using [Homebrew](https://formulae.brew.sh/formula/deno) (macOS or Linux):

```
brew install deno
```

Using [Chocolatey](https://chocolatey.org/packages/deno) (Windows):

```
choco install deno
```

See [deno_install](https://github.com/denoland/deno_install) for more installation options.



## 开发实战

### REPL环境

运行`deno`，就会进入 REPL 环境。

```bash
➜  sample git:(master) ✗ deno
> console.log('hello')
hello
undefined
> exit
```



### 执行远程代码

```bash
deno https://deno.land/std/examples/welcome.ts
```



### 简单Http服务器

```js
import { serve } from "https://deno.land/std@v0.36.0/http/server.ts";
const s = serve({ port: 3000 });
console.log("http://localhost:3000/");
for await (const req of s) {
  req.respond({ body: "Hello World\n" });
}
```

运行

```bash
deno --allow-net index.ts
```



### 简单爬虫

```js
const url = Deno.args[0]
const res = await fetch(url)
await Deno.copy(Deno.stdout,res.body)
```

运行

```
deno --allow-net index.ts http://www.baidu.com
```

