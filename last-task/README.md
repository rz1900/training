# 工作量核定管理系统原型

这是根据 `5.20-5.22培训准备(1).docx` 实现的前端演示系统。系统使用本地模拟数据，不依赖真实后端、MySQL 或 Redis。

## 运行

```powershell
cd last-task
python -m http.server 10011
```

打开：

```text
http://localhost:10011
```

## 验证

```powershell
node tests/state.test.mjs
```

## 演示功能

- 数据看板：状态数量、初核/最终/核减工作量统计。
- 需求管理：按状态、产品经理、归属系统筛选。
- 批量导入：模拟 Excel 导入结果与行级错误提示。
- 工作量填写：填写最终核定工作量并自动计算核减。
- 催办记录：对待填写需求发起催办并留痕。
- 用户与角色：展示产品经理、开发管理员、系统管理员角色。

## 截图

关键节点截图保存在 `screenshots/`：

- `01-dashboard.png`
- `02-requirements.png`
- `03-import-result.png`
- `04-submit-workload.png`
- `05-reminders.png`
- `06-users-roles.png`
