# npm

此处延伸一下版本号管理的内容：
版本号 
语义化版本：https://semver.org/lang/zh-CN/ 
版本号格式：主版本号.次版本号.修订号 
版本号递增规则： 
- 主版本号：做了不兼容修改或颠覆式的重写 
- 次版本号：向下兼容的功能性新增 
- 修订号：向下兼容的问题修正 
- 
**先行版本号及版本编译信息**可以加到“主版本号.次版本号.修订号”的后面，作为延伸。
版本号只能增加，禁止下降，代码的修改必须以新版本形式更新；
最初版本建议是从v0.1.0开始，0.x.y阶段是基础功能、公众API开发阶段。
1.0.0版本发布时机： 
- 被用于正式环境 
- 稳定的API被使用者依赖 
- 很担心向下兼容的问题

万一不小心把一个不兼容的改版当成了次版本号发行了该怎么办？一旦发现自己破坏了语义化版本控制的规范，就要修正这个问题，并发行一个新的次版本号来更正这个问题并且恢复向下兼容。即使是这种情况，也不能去修改已发行的版本。

npm管理项目版本号 
在命令行窗口输入npm version ?可以查看可以使用的命令：
执行命令及版本提升示例：

假设初始版本为0.1.0
➜  xxx git:(master) npm version preminor
v0.1.0-0
➜  xxx git:(master) npm version minor
v0.1.0
➜  xxx git:(master) npm version prepatch
v0.1.1-0
➜  xxx git:(master) npm version patch  
v0.1.1
➜  xxx git:(master) npm version prerelease
v0.1.2-0
➜  xxx git:(master) npm version premajor
v1.0.0-0
➜  xxx git:(master) npm version major  
v1.0.0

如果使用git进行项目管理，在进行版本提升前，需要将修改内容提交，即commit，然后再执行npm version xxx进行版本提升，版本提升会自动被提交到当前分支中，可以通过git log进行查看。　　

