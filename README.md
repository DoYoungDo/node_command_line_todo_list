# node_js_command_line_todo_list

#### 介绍
node js 命令行待办

#### 安装教程

```bash
// 安装依赖
$ npm i

// 编译构建
$ npm run build

// 安装到全局
$ npm i . -g

// 更新环境变量
$ source ~/.bash_profile

// 验证成功
$ todo -h
```

#### 使用说明

<span style="color: chartreuse;">**查看帮助**</span>

```bash
todo -h
```

![](README_files/1.jpg)

<span style="color: chartreuse;">**查看版本**</span>

```bash
todo -V
```

![](README_files/2.jpg)

<span style="color: chartreuse;">**添加待办**</span>

```bash
todo 1
```

![](README_files/3.jpg)

```bash
todo add 2
```

![](README_files/4.jpg)

<span style="color: chartreuse;">**批量添加待办**</span>

```bash
todo 3 4 5
```

![](README_files/5.jpg)

```bash
todo add 6 7 8
```

![](README_files/6.jpg)

<span style="color: chartreuse;">**添加待办时设置完成**</span>

```bash
todo add 9 -d
```

![](README_files/7.jpg)

<span style="color: chartreuse;">**移除待办项**</span>

```bash
todo rm 8
```

![](README_files/8.jpg)

<span style="color: chartreuse;">**批量移除待办项**</span>

```bash
todo rm 7 6 5 4 3 2 1 0
```

![](README_files/9.jpg)

```bash
todo rm 8 4 7 3 6 2 5 0 1
```

![](README_files/10.jpg)

> 索引顺序不敏感

<span style="color: chartreuse;">**修改待办内容**</span>

```bash
todo mod 0 after
```

*之前*

![](README_files/11.jpg)

*之后*

![](README_files/12.jpg)

<span style="color: chartreuse;">**待办内容后追加**</span>

```bash
todo mod 0 \ append -a
```

*之前*

![](README_files/13.jpg)

*之后*

![](README_files/14.jpg)

<span style="color: chartreuse;">**修改待办状态为完成**</span>

```bash
todo mod 0 -d true
```

![](README_files/15.jpg)

```bash
todo done 0
```

![](README_files/16.jpg)

<span style="color: chartreuse;">**查看所有待办**</span>

```bash
todo
```

![](README_files/17.jpg)

```bash
todo list
```

![](README_files/18.jpg)

<span style="color: chartreuse;">**查看所有已完成的待办**</span>

```bash
todo list -d
```

![](README_files/19.jpg)

```bash
todo list -d true
```

![](README_files/20.jpg)

<span style="color: chartreuse;">**查看所有未完成的待办**</span>

![](README_files/21.jpg)

<span style="color: chartreuse;">**查看前五个待办**</span>

```bash
todo list 5]
```

![](README_files/22.jpg)

<span style="color: chartreuse;">**查看第五个之后的待办**</span>

```bash
todo list 5
```

![](README_files/23.jpg)

