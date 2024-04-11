# node_js_command_line_todo_list

#### 介绍
node js 命令行待办

#### 安装教程

```bash
npm i
```
---

```bash
npm run build
```
--- 

```bash
node out/index.js -h
```
 
or 

```bash
alias todo='node out/index.js'
```

```bash
todo -h
```

#### 使用说明

示例：

- 直接跟参数

```bash
# 一次添加三个待办
$ todo 123 321 123456

┌─────────┬──────┬──────┬───────────┬───────────────────────────┬──────────┐
│ (index) │ 状态  │ 索引 │   待办     │         创建时间           │ 完成时间  │
├─────────┼──────┼──────┼───────────┼───────────────────────────┼──────────┤
│    0    │ '❌' │  0   │   '123'   │ '2024-04-11 19:16:22 206' │   '-'    │
│    1    │ '❌' │  1   │   '321'   │ '2024-04-11 19:16:22 206' │   '-'    │
│    2    │ '❌' │  2   │ '1234567' │ '2024-04-11 19:16:22 206' │   '-'    │
└─────────┴──────┴──────┴───────────┴───────────────────────────┴──────────┘
```

- 不跟参数

```bash
# 显示当前`table`的所有待办
$ todo

┌─────────┬──────┬──────┬───────────┬───────────────────────────┬──────────┐
│ (index) │ 状态  │ 索引 │   待办     │         创建时间           │ 完成时间  │
├─────────┼──────┼──────┼───────────┼───────────────────────────┼──────────┤
│    0    │ '❌' │  0   │   '123'   │ '2024-04-11 19:16:22 206' │   '-'    │
│    1    │ '❌' │  1   │   '321'   │ '2024-04-11 19:16:22 206' │   '-'    │
│    2    │ '❌' │  2   │ '1234567' │ '2024-04-11 19:16:22 206' │   '-'    │
└─────────┴──────┴──────┴───────────┴───────────────────────────┴──────────┘
```

- 查看帮助

```bash
$ todo -h
$ todo add -h
$ todo rm -h
$ todo mod -h
$ todo list -h
$ todo done -h
$ todo clear -h
$ todo conf -h
```

- 跟命令

```bash
# 添加待办
$ todo add 123 321 ... 

# 添加并完成
$ todo add 123 321 ... -d

# 移除索引(索引不是index)为：1、2、5、6、7的待办
$ todo rm 1 2 5-7

# 将索引为1的待办内容修改为111
$ todo mod 1 111

# 将索引为1的待办内容追加上111
$ todo mod 1 111 -a

# 将索引为1的待办状态修改为完成
$ todo mod 1 -d

# 将索引为1的待办状态修改为示完成
$ todo mod 1 -d false

# 显示当前`table`的所有待办
$ todo list

# 显示当前`table`的所有已经完成的待办
$ todo list -d 

# 显示当前`table`的未已经完成的待办
$ todo list -d false

# 显示当前`table`索引从3开始的所有待办
$ todo list 3
$ todo list 3-

# 显示当前`table`索引从0到3的所有待办
$ todo list 3] 
$ todo list 0-3

# 显示当前`table`待办数量
$ todo list -c

# 修改索引为1、2、3的待办的状态为完成
$ todo done 1 2 3

# 清空当前`table`待办
$ todo clear

# 显示当前配置
$ todo conf 
$ todo conf list

# 显示所有内置变量
$ todo conf -v

# 将当前`table`修改为newtable
$ todo conf set table newtable

# 显示所有表
$ todo conf list table

```
#### 参与贡献

1.  Fork 本仓库
2.  新建 Feat_xxx 分支
3.  提交代码
4.  新建 Pull Request


#### 特技

1.  使用 Readme\_XXX.md 来支持不同的语言，例如 Readme\_en.md, Readme\_zh.md
2.  Gitee 官方博客 [blog.gitee.com](https://blog.gitee.com)
3.  你可以 [https://gitee.com/explore](https://gitee.com/explore) 这个地址来了解 Gitee 上的优秀开源项目
4.  [GVP](https://gitee.com/gvp) 全称是 Gitee 最有价值开源项目，是综合评定出的优秀开源项目
5.  Gitee 官方提供的使用手册 [https://gitee.com/help](https://gitee.com/help)
6.  Gitee 封面人物是一档用来展示 Gitee 会员风采的栏目 [https://gitee.com/gitee-stars/](https://gitee.com/gitee-stars/)


# 显示当前配置
$ todo conf 
```
#### 参与贡献

1.  Fork 本仓库
2.  新建 Feat_xxx 分支
3.  提交代码
4.  新建 Pull Request


```
#### 参与贡献

1.  Fork 本仓库
2.  新建 Feat_xxx 分支
3.  提交代码
4.  新建 Pull Request


#### 特技

1.  使用 Readme\_XXX.md 来支持不同的语言，例如 Readme\_en.md, Readme\_zh.md
2.  Gitee 官方博客 [blog.gitee.com](https://blog.gitee.com)
3.  你可以 [https://gitee.com/explore](https://gitee.com/explore) 这个地址来了解 Gitee 上的优秀开源项目
4.  [GVP](https://gitee.com/gvp) 全称是 Gitee 最有价值开源项目，是综合评定出的优秀开源项目
5.  Gitee 官方提供的使用手册 [https://gitee.com/help](https://gitee.com/help)
6.  Gitee 封面人物是一档用来展示 Gitee 会员风采的栏目 [https://gitee.com/gitee-stars/](https://gitee.com/gitee-stars/)


# 显示当前配置
$ todo conf 
```
#### 参与贡献

1.  Fork 本仓库
2.  新建 Feat_xxx 分支
3.  提交代码
4.  新建 Pull Request


#### 特技

1.  使用 Readme\_XXX.md 来支持不同的语言，例如 Readme\_en.md, Readme\_zh.md
2.  Gitee 官方博客 [blog.gitee.com](https://blog.gitee.com)
3.  你可以 [https://gitee.com/explore](https://gitee.com/explore) 这个地址来了解 Gitee 上的优秀开源项目
4.  [GVP](https://gitee.com/gvp) 全称是 Gitee 最有价值开源项目，是综合评定出的优秀开源项目
5.  Gitee 官方提供的使用手册 [https://gitee.com/help](https://gitee.com/help)
6.  Gitee 封面人物是一档用来展示 Gitee 会员风采的栏目 [https://gitee.com/gitee-stars/](https://gitee.com/gitee-stars/)


# 显示当前配置
$ todo conf 
```
#### 参与贡献

1.  Fork 本仓库
2.  新建 Feat_xxx 分支
3.  提交代码
4.  新建 Pull Request


#### 特技

1.  使用 Readme\_XXX.md 来支持不同的语言，例如 Readme\_en.md, Readme\_zh.md
2.  Gitee 官方博客 [blog.gitee.com](https://blog.gitee.com)
3.  你可以 [https://gitee.com/explore](https://gitee.com/explore) 这个地址来了解 Gitee 上的优秀开源项目
4.  [GVP](https://gitee.com/gvp) 全称是 Gitee 最有价值开源项目，是综合评定出的优秀开源项目
5.  Gitee 官方提供的使用手册 [https://gitee.com/help](https://gitee.com/help)
6.  Gitee 封面人物是一档用来展示 Gitee 会员风采的栏目 [https://gitee.com/gitee-stars/](https://gitee.com/gitee-stars/)


# 显示当前配置
$ todo conf 
```
#### 参与贡献

1.  Fork 本仓库
2.  新建 Feat_xxx 分支
3.  提交代码
4.  新建 Pull Request


#### 特技

1.  使用 Readme\_XXX.md 来支持不同的语言，例如 Readme\_en.md, Readme\_zh.md
2.  Gitee 官方博客 [blog.gitee.com](https://blog.gitee.com)
3.  你可以 [https://gitee.com/explore](https://gitee.com/explore) 这个地址来了解 Gitee 上的优秀开源项目
4.  [GVP](https://gitee.com/gvp) 全称是 Gitee 最有价值开源项目，是综合评定出的优秀开源项目
5.  Gitee 官方提供的使用手册 [https://gitee.com/help](https://gitee.com/help)
6.  Gitee 封面人物是一档用来展示 Gitee 会员风采的栏目 [https://gitee.com/gitee-stars/](https://gitee.com/gitee-stars/)

```
#### 参与贡献

1.  Fork 本仓库
2.  新建 Feat_xxx 分支
3.  提交代码
4.  新建 Pull Request


#### 特技

1.  使用 Readme\_XXX.md 来支持不同的语言，例如 Readme\_en.md, Readme\_zh.md
2.  Gitee 官方博客 [blog.gitee.com](https://blog.gitee.com)
3.  你可以 [https://gitee.com/explore](https://gitee.com/explore) 这个地址来了解 Gitee 上的优秀开源项目
4.  [GVP](https://gitee.com/gvp) 全称是 Gitee 最有价值开源项目，是综合评定出的优秀开源项目
5.  Gitee 官方提供的使用手册 [https://gitee.com/help](https://gitee.com/help)
6.  Gitee 封面人物是一档用来展示 Gitee 会员风采的栏目 [https://gitee.com/gitee-stars/](https://gitee.com/gitee-stars/)
