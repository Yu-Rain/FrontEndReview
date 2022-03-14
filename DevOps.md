# DevOps

## Circle CI

> [Continuous integration with CircleCI](https://lab.github.com/githubtraining/continuous-integration-with-circleci)

1. 注册Circle CI， Set Up 一个项目
	通过提交新的commit触发验证
2. 编写config.yml 文件

config.yml 作用：
	
* 配置构建环境，定义了整个交付过程
* 包含一个Docker 映像，用于执行构建、定义环境
* 有一个 checkout 命令允许 CircleCI 访问您的项目

3. 提交config.yml的commit，触发CI自动执行，验证通过
4. 添加验证

	  ```
	   - run:
          name: build the jekyll site
          command: bundle exec jekyll build
	  ```
	  
5. 保护main分支	
	
为什么使用受保护分支		
```
受保护的分支确保协作者无法对特定分支进行不可撤销的更改。这还允许您在合并之前启用 CI 所需的状态检查。

受保护的分支允许贡献者在您的存储库中创建分支和拉取请求，同时确保在合并之前彻底审查这些更改。

当存储库采用像 CircleCI 这样的持续集成服务时，可以根据其构建状态保护分支，
因此审查过程可以在很大程度上实现自动化，从而为贡献者提供自我效能。
项目维护人员还可以通过将注意力集中在不容易自动化的灰色区域和流程中而受益。

```

6. 提交一个commit，发起合并到main分支的请求。如果有错误会报告错误信息，并且不会合并到main。
7. 解决完错误后，重新提交。
8. 添加一个单元测试

添加持续部署
什么是持续部署？
持续部署或 CD 是从 CI 中的自动化构建的扩展步骤。 CD 是各个阶段的自动化，将新的更改部署到不同的环境。
CD 的目标是减少完成项目所需的时间。自动化提供更短的反馈循环。这可能看起来像是更快的测试周期，或者更快的部署和用户反馈。

12. 每当main分支有新的提交，GitHub页面就会部署


------------

GitHub Apps

步骤1：
安装 WIP 和 Request Info 程序

步骤2：触发 WIP 程序
（WIP 是一个常见的缩写（work in progress），表示正在进行的工作。）
把 Pull request 的标题加上 WIP

步骤3：添加 webhook 有效负载传送服务

Pull Request 标题包含WIP的时候会被阻止合并
让我们分解一下 WIP 的工作原理： 
1. WIP应用程序专门侦听拉取请求标题的更改 
2. 当拉取请求标题更改时，应用程序会搜索关键字“WIP” 
3. 如果搜索找到“WIP”，应用程序会向 GitHub 的 API 发送请求以阻止合并该拉取请求

步骤4：监视webhooks
删除标题中的“WIP”，允许合并

步骤5：将GitHub上的操作连接到事件和有效负载





当用户打开一个空的 issue 或 pull request 时，Request Info 应用程序会这样做——请求更多信息。 您可以看到 Request Info 已经使用默认消息响应了此拉取请求。


步骤8：更改 config.yml 文件的默认消息

步骤9：了解有关 GitHub API 的更多信息

APIs 与 webhooks的区别

* Webhooks 是特定的“噪音”解释器。它们侦听特定事件的发生作为它们的触发器。
* 当事件被触发时，更加详细的 GitHub API 为机器人提供了过多的信息（作为有效负载）。机器人获取此有效负载，对其稍作更改，然后将其交还给 GitHub 的 API，后者将更改传送回您的存储库。
* GitHub API 可以发送对平台进行更改的信息，但仅限于通过 webhook 提示时。
* GitHub API 和 GitHub 的 webhooks 都是 GitHub Apps 的关键组件。
* GitHub API 和 GitHub 的 webhooks 都是 GitHub Apps 的关键组件。

