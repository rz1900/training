# Workload Approval Prototype Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `last-task`, a runnable browser prototype for the workload approval management system, and save key-node screenshots.

**Architecture:** Use static HTML, CSS, and JavaScript. Keep business data and pure state transitions in `src/data.js`, rendering and browser interactions in `src/app.js`, and verification in `tests/state.test.mjs`.

**Tech Stack:** HTML5, CSS3, vanilla JavaScript ES modules, Node.js for verification, Chrome DevTools for screenshots.

---

## File Structure

- Create `last-task/index.html`: application shell and root containers.
- Create `last-task/src/data.js`: mock users, requirements, reminders, import result, and pure helper functions.
- Create `last-task/src/app.js`: route rendering, role switching, filters, forms, reminder actions, and DOM updates.
- Create `last-task/src/styles.css`: responsive operational dashboard styling.
- Create `last-task/tests/state.test.mjs`: Node-based checks for workload calculation, role filtering, reminder append, and import validation data.
- Create `last-task/README.md`: run, verify, and screenshot notes.
- Create `last-task/screenshots/`: screenshot output directory.

## Task 1: Scaffold Static App Shell

**Files:**
- Create: `last-task/index.html`
- Create: `last-task/src/styles.css`
- Create: `last-task/src/app.js`
- Create: `last-task/src/data.js`
- Create: `last-task/tests/state.test.mjs`
- Create: `last-task/README.md`
- Create directory: `last-task/screenshots`

- [ ] **Step 1: Create the directory tree**

Run:

```powershell
New-Item -ItemType Directory -Force -Path last-task, last-task\src, last-task\tests, last-task\screenshots
```

Expected: the directories exist.

- [ ] **Step 2: Create the initial HTML shell**

Write `last-task/index.html`:

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>工作量核定管理系统</title>
    <link rel="stylesheet" href="./src/styles.css" />
  </head>
  <body>
    <div id="app" class="app-shell"></div>
    <script type="module" src="./src/app.js"></script>
  </body>
</html>
```

- [ ] **Step 3: Create placeholder modules**

Write `last-task/src/data.js`:

```js
export const roles = ["开发管理员", "产品经理", "系统管理员"];

export const currentUser = {
  id: "u-admin",
  name: "陈开发",
  role: "开发管理员",
};
```

Write `last-task/src/app.js`:

```js
import { currentUser } from "./data.js";

const app = document.querySelector("#app");

app.innerHTML = `
  <main class="empty-state">
    <p class="eyebrow">一线体验官专项数据分析系统</p>
    <h1>工作量核定管理系统</h1>
    <p>当前登录：${currentUser.name}（${currentUser.role}）</p>
  </main>
`;
```

Write `last-task/src/styles.css`:

```css
:root {
  color-scheme: light;
  --bg: #f5f7fb;
  --panel: #ffffff;
  --text: #172033;
  --muted: #637083;
  --line: #dfe5ef;
  --primary: #2563eb;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: "Microsoft YaHei", "PingFang SC", Arial, sans-serif;
  color: var(--text);
  background: var(--bg);
}

.empty-state {
  min-height: 100vh;
  display: grid;
  place-content: center;
  text-align: center;
}

.eyebrow {
  color: var(--primary);
  font-weight: 700;
}
```

Write `last-task/tests/state.test.mjs`:

```js
import assert from "node:assert/strict";

assert.equal(1 + 1, 2);
console.log("state tests passed");
```

Write `last-task/README.md`:

```markdown
# 工作量核定管理系统原型

运行方式：

```powershell
cd last-task
python -m http.server 10011
```

打开 `http://localhost:10011`。

验证：

```powershell
node tests/state.test.mjs
```

截图保存在 `screenshots/`。
```

- [ ] **Step 4: Verify shell and test placeholder**

Run:

```powershell
node last-task\tests\state.test.mjs
```

Expected: `state tests passed`.

- [ ] **Step 5: Commit scaffold**

Run:

```powershell
git add last-task
git commit -m "feat: scaffold workload approval prototype"
```

## Task 2: Add Mock Data And Pure State Functions

**Files:**
- Modify: `last-task/src/data.js`
- Modify: `last-task/tests/state.test.mjs`

- [ ] **Step 1: Replace test file with failing business checks**

Write `last-task/tests/state.test.mjs`:

```js
import assert from "node:assert/strict";
import {
  createReminder,
  filterRequirementsForRole,
  importPreview,
  requirements,
  submitFinalWorkload,
  users,
} from "../src/data.js";

const submitted = submitFinalWorkload(requirements[0], 8);
assert.equal(submitted.finalWorkload, 8);
assert.equal(submitted.reductionWorkload, 4);
assert.equal(submitted.status, "已填写");

const pmRows = filterRequirementsForRole(requirements, {
  name: "李产品",
  role: "产品经理",
});
assert.ok(pmRows.length > 0);
assert.ok(pmRows.every((row) => row.productManager === "李产品"));

const adminRows = filterRequirementsForRole(requirements, {
  name: "陈开发",
  role: "开发管理员",
});
assert.equal(adminRows.length, requirements.length);

const reminder = createReminder(requirements[0], users[1], "请在今天完成最终工作量填写");
assert.equal(reminder.requirementName, requirements[0].name);
assert.equal(reminder.productManager, requirements[0].productManager);

assert.equal(importPreview.successRows.length, 5);
assert.equal(importPreview.failedRows[0].row, 4);

console.log("state tests passed");
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```powershell
node last-task\tests\state.test.mjs
```

Expected: FAIL because exported functions and arrays do not exist.

- [ ] **Step 3: Implement data and pure functions**

Write `last-task/src/data.js`:

```js
export const roles = ["开发管理员", "产品经理", "系统管理员"];

export const users = [
  { id: "u-admin", name: "陈开发", role: "开发管理员", department: "研发管理部", status: "启用" },
  { id: "u-pm-1", name: "李产品", role: "产品经理", department: "产品一部", status: "启用" },
  { id: "u-pm-2", name: "王产品", role: "产品经理", department: "产品二部", status: "启用" },
  { id: "u-root", name: "赵系统", role: "系统管理员", department: "平台运维组", status: "启用" },
  { id: "u-pm-3", name: "周产品", role: "产品经理", department: "产品三部", status: "禁用" },
];

export const requirements = [
  {
    id: "REQ-202605-001",
    name: "移动端体验反馈闭环",
    description: "打通一线体验官反馈、产品确认和整改跟踪流程。",
    productManager: "李产品",
    system: "体验官平台",
    initialWorkload: 12,
    initialAmount: 9600,
    finalWorkload: null,
    reductionWorkload: null,
    status: "待填写",
    updatedAt: "2026-05-20",
  },
  {
    id: "REQ-202605-002",
    name: "供应商结算报表优化",
    description: "新增按系统、产品经理、月份维度的工作量核算报表。",
    productManager: "王产品",
    system: "结算中心",
    initialWorkload: 18,
    initialAmount: 14400,
    finalWorkload: 15,
    reductionWorkload: 3,
    status: "已填写",
    updatedAt: "2026-05-21",
  },
  {
    id: "REQ-202605-003",
    name: "需求导入模板标准化",
    description: "统一需求名称、归属系统、初核工作量等字段校验规则。",
    productManager: "李产品",
    system: "研发管理平台",
    initialWorkload: 6,
    initialAmount: 4800,
    finalWorkload: 6,
    reductionWorkload: 0,
    status: "已核定",
    updatedAt: "2026-05-19",
  },
  {
    id: "REQ-202605-004",
    name: "评审会议纪要归档",
    description: "将工作量评审会结论与需求记录关联，方便历史追溯。",
    productManager: "周产品",
    system: "评审会议系统",
    initialWorkload: 9,
    initialAmount: 7200,
    finalWorkload: null,
    reductionWorkload: null,
    status: "待填写",
    updatedAt: "2026-05-22",
  },
  {
    id: "REQ-202605-005",
    name: "AI 智能分析摘要",
    description: "基于历史需求数据生成核减原因摘要和风险提示。",
    productManager: "王产品",
    system: "AI 分析平台",
    initialWorkload: 20,
    initialAmount: 16000,
    finalWorkload: 17,
    reductionWorkload: 3,
    status: "已填写",
    updatedAt: "2026-05-18",
  },
  {
    id: "REQ-202605-006",
    name: "产品经理待办提醒",
    description: "开发管理员发起催办后，产品经理工作台展示待办提醒。",
    productManager: "李产品",
    system: "研发管理平台",
    initialWorkload: 10,
    initialAmount: 8000,
    finalWorkload: null,
    reductionWorkload: null,
    status: "待填写",
    updatedAt: "2026-05-22",
  },
];

export const reminders = [
  {
    id: "REM-001",
    requirementId: "REQ-202605-001",
    requirementName: "移动端体验反馈闭环",
    productManager: "李产品",
    sentBy: "陈开发",
    sentAt: "2026-05-22 09:30",
    message: "请在今天 18:00 前填写最终核定工作量。",
  },
];

export const importPreview = {
  successRows: [
    { row: 2, name: "移动端体验反馈闭环", productManager: "李产品" },
    { row: 3, name: "供应商结算报表优化", productManager: "王产品" },
    { row: 5, name: "评审会议纪要归档", productManager: "周产品" },
    { row: 6, name: "AI 智能分析摘要", productManager: "王产品" },
    { row: 7, name: "产品经理待办提醒", productManager: "李产品" },
  ],
  failedRows: [
    { row: 4, reason: "初核工作量为空，需填写数字" },
    { row: 8, reason: "产品经理不存在或账号已禁用" },
  ],
};

export function submitFinalWorkload(requirement, finalWorkload) {
  const value = Number(finalWorkload);
  return {
    ...requirement,
    finalWorkload: value,
    reductionWorkload: Number((requirement.initialWorkload - value).toFixed(1)),
    status: "已填写",
    updatedAt: "2026-05-22",
  };
}

export function filterRequirementsForRole(rows, user) {
  if (user.role === "产品经理") {
    return rows.filter((row) => row.productManager === user.name);
  }
  return rows;
}

export function createReminder(requirement, sender, message) {
  return {
    id: `REM-${Date.now()}`,
    requirementId: requirement.id,
    requirementName: requirement.name,
    productManager: requirement.productManager,
    sentBy: sender.name,
    sentAt: "2026-05-22 11:40",
    message,
  };
}

export function formatMoney(value) {
  return `¥${Number(value).toLocaleString("zh-CN")}`;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run:

```powershell
node last-task\tests\state.test.mjs
```

Expected: `state tests passed`.

- [ ] **Step 5: Commit state layer**

Run:

```powershell
git add last-task/src/data.js last-task/tests/state.test.mjs
git commit -m "feat: add workload prototype state model"
```

## Task 3: Implement Dashboard, Navigation, And Requirement Management

**Files:**
- Modify: `last-task/src/app.js`
- Modify: `last-task/src/styles.css`

- [ ] **Step 1: Implement app rendering**

Write `last-task/src/app.js` with:

```js
import {
  createReminder,
  filterRequirementsForRole,
  formatMoney,
  importPreview,
  reminders as initialReminders,
  requirements as initialRequirements,
  roles,
  submitFinalWorkload,
  users,
} from "./data.js";

const app = document.querySelector("#app");

const state = {
  activeView: "dashboard",
  currentUser: users[0],
  requirements: initialRequirements.map((item) => ({ ...item })),
  reminders: initialReminders.map((item) => ({ ...item })),
  filters: {
    status: "全部",
    productManager: "全部",
    system: "全部",
  },
};

const navItems = [
  { id: "dashboard", label: "数据看板" },
  { id: "requirements", label: "需求管理" },
  { id: "import", label: "批量导入" },
  { id: "my-workload", label: "工作量填写" },
  { id: "reminders", label: "催办记录" },
  { id: "users", label: "用户与角色" },
];

function statusClass(status) {
  return `tag tag-${status}`;
}

function roleHint(role) {
  if (role === "产品经理") return "仅展示本人负责需求，可填写最终核定工作量。";
  if (role === "系统管理员") return "可查看用户账号、角色配置与账号状态。";
  return "可导入需求、跟踪状态、催办填写并查看统计。";
}

function visibleRequirements() {
  return filterRequirementsForRole(state.requirements, state.currentUser);
}

function filteredRequirements() {
  return visibleRequirements().filter((row) => {
    return (
      (state.filters.status === "全部" || row.status === state.filters.status) &&
      (state.filters.productManager === "全部" || row.productManager === state.filters.productManager) &&
      (state.filters.system === "全部" || row.system === state.filters.system)
    );
  });
}

function dashboardMetrics() {
  const rows = visibleRequirements();
  const totalInitial = rows.reduce((sum, row) => sum + row.initialWorkload, 0);
  const totalFinal = rows.reduce((sum, row) => sum + (row.finalWorkload || 0), 0);
  const totalReduction = rows.reduce((sum, row) => sum + (row.reductionWorkload || 0), 0);
  const countByStatus = rows.reduce((acc, row) => {
    acc[row.status] = (acc[row.status] || 0) + 1;
    return acc;
  }, {});
  return { rows, totalInitial, totalFinal, totalReduction, countByStatus };
}

function renderShell() {
  app.innerHTML = `
    <aside class="sidebar">
      <div class="brand">
        <span class="brand-mark">核</span>
        <div>
          <strong>工作量核定</strong>
          <small>管理系统原型</small>
        </div>
      </div>
      <nav>
        ${navItems
          .map(
            (item) => `
              <button class="nav-item ${state.activeView === item.id ? "active" : ""}" data-view="${item.id}">
                ${item.label}
              </button>
            `,
          )
          .join("")}
      </nav>
    </aside>
    <section class="workspace">
      <header class="topbar">
        <div>
          <p class="eyebrow">一线体验官专项数据分析系统</p>
          <h1>${navItems.find((item) => item.id === state.activeView).label}</h1>
          <p class="muted">${roleHint(state.currentUser.role)}</p>
        </div>
        <label class="role-switcher">
          当前角色
          <select id="role-user">
            ${users
              .filter((user) => user.status === "启用")
              .map(
                (user) => `
                  <option value="${user.id}" ${user.id === state.currentUser.id ? "selected" : ""}>
                    ${user.name} - ${user.role}
                  </option>
                `,
              )
              .join("")}
          </select>
        </label>
      </header>
      <main class="content" id="content"></main>
    </section>
  `;

  app.querySelectorAll("[data-view]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeView = button.dataset.view;
      render();
    });
  });

  app.querySelector("#role-user").addEventListener("change", (event) => {
    state.currentUser = users.find((user) => user.id === event.target.value);
    render();
  });
}

function renderDashboard() {
  const metrics = dashboardMetrics();
  const managerGroups = Object.entries(
    metrics.rows.reduce((acc, row) => {
      if (!acc[row.productManager]) acc[row.productManager] = { count: 0, reduction: 0 };
      acc[row.productManager].count += 1;
      acc[row.productManager].reduction += row.reductionWorkload || 0;
      return acc;
    }, {}),
  );

  return `
    <section class="metric-grid">
      <article class="metric-card"><span>待填写</span><strong>${metrics.countByStatus["待填写"] || 0}</strong></article>
      <article class="metric-card"><span>已填写</span><strong>${metrics.countByStatus["已填写"] || 0}</strong></article>
      <article class="metric-card"><span>已核定</span><strong>${metrics.countByStatus["已核定"] || 0}</strong></article>
      <article class="metric-card"><span>核减工作量</span><strong>${metrics.totalReduction} 人天</strong></article>
    </section>
    <section class="two-column">
      <article class="panel">
        <div class="panel-title"><h2>核算概览</h2><span>自动统计</span></div>
        <div class="summary-list">
          <p><b>初核总工作量</b><span>${metrics.totalInitial} 人天</span></p>
          <p><b>最终已填工作量</b><span>${metrics.totalFinal} 人天</span></p>
          <p><b>预估金额</b><span>${formatMoney(metrics.rows.reduce((sum, row) => sum + row.initialAmount, 0))}</span></p>
        </div>
      </article>
      <article class="panel">
        <div class="panel-title"><h2>产品经理维度</h2><span>需求数 / 核减</span></div>
        <div class="bars">
          ${managerGroups
            .map(
              ([manager, info]) => `
                <div class="bar-row">
                  <span>${manager}</span>
                  <div><i style="width:${Math.max(16, info.count * 24)}%"></i></div>
                  <b>${info.count} 项 / ${info.reduction} 人天</b>
                </div>
              `,
            )
            .join("")}
        </div>
      </article>
    </section>
    <section class="panel">
      <div class="panel-title"><h2>近期需求</h2><span>状态透明跟踪</span></div>
      ${renderRequirementTable(metrics.rows.slice(0, 5), false)}
    </section>
  `;
}

function renderFilters() {
  const managers = ["全部", ...new Set(visibleRequirements().map((row) => row.productManager))];
  const systems = ["全部", ...new Set(visibleRequirements().map((row) => row.system))];
  return `
    <section class="filters">
      <label>状态
        <select data-filter="status">${["全部", "待填写", "已填写", "已核定"].map((item) => `<option ${state.filters.status === item ? "selected" : ""}>${item}</option>`).join("")}</select>
      </label>
      <label>产品经理
        <select data-filter="productManager">${managers.map((item) => `<option ${state.filters.productManager === item ? "selected" : ""}>${item}</option>`).join("")}</select>
      </label>
      <label>归属系统
        <select data-filter="system">${systems.map((item) => `<option ${state.filters.system === item ? "selected" : ""}>${item}</option>`).join("")}</select>
      </label>
    </section>
  `;
}

function renderRequirementTable(rows, withActions = true) {
  return `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>需求编号</th>
            <th>需求名称</th>
            <th>产品经理</th>
            <th>归属系统</th>
            <th>初核</th>
            <th>最终</th>
            <th>核减</th>
            <th>状态</th>
            ${withActions ? "<th>操作</th>" : ""}
          </tr>
        </thead>
        <tbody>
          ${rows
            .map(
              (row) => `
                <tr>
                  <td>${row.id}</td>
                  <td><strong>${row.name}</strong><small>${row.description}</small></td>
                  <td>${row.productManager}</td>
                  <td>${row.system}</td>
                  <td>${row.initialWorkload} 人天<br><small>${formatMoney(row.initialAmount)}</small></td>
                  <td>${row.finalWorkload ?? "-"}${row.finalWorkload ? " 人天" : ""}</td>
                  <td>${row.reductionWorkload ?? "-"}${row.reductionWorkload !== null ? " 人天" : ""}</td>
                  <td><span class="${statusClass(row.status)}">${row.status}</span></td>
                  ${
                    withActions
                      ? `<td class="actions">
                          <button data-submit="${row.id}" ${row.status === "已核定" ? "disabled" : ""}>填写</button>
                          <button data-remind="${row.id}" ${row.status !== "待填写" ? "disabled" : ""}>催办</button>
                        </td>`
                      : ""
                  }
                </tr>
              `,
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderRequirements() {
  return `
    ${renderFilters()}
    <section class="panel">
      <div class="panel-title"><h2>需求信息管理</h2><span>增删改查演示 / 条件筛选</span></div>
      ${renderRequirementTable(filteredRequirements())}
    </section>
  `;
}

function renderImport() {
  return `
    <section class="panel hero-panel">
      <div>
        <p class="eyebrow">Excel 模板批量录入</p>
        <h2>导入需求信息</h2>
        <p class="muted">系统校验需求名称、产品经理、归属系统、初核工作量和金额字段，并在成功后通知对应产品经理。</p>
      </div>
      <button>下载标准模板</button>
    </section>
    <section class="two-column">
      <article class="panel">
        <div class="panel-title"><h2>导入成功</h2><span>${importPreview.successRows.length} 行</span></div>
        ${importPreview.successRows.map((row) => `<p class="result success">第 ${row.row} 行：${row.name}，已通知 ${row.productManager}</p>`).join("")}
      </article>
      <article class="panel">
        <div class="panel-title"><h2>导入失败</h2><span>${importPreview.failedRows.length} 行</span></div>
        ${importPreview.failedRows.map((row) => `<p class="result danger">第 ${row.row} 行：${row.reason}</p>`).join("")}
      </article>
    </section>
  `;
}

function renderMyWorkload() {
  const rows = filterRequirementsForRole(state.requirements, { ...state.currentUser, role: "产品经理" });
  return `
    <section class="panel">
      <div class="panel-title"><h2>${state.currentUser.role === "产品经理" ? "我的待填写需求" : "产品经理填写视图演示"}</h2><span>提交后状态变为已填写</span></div>
      ${renderRequirementTable(rows, true)}
    </section>
  `;
}

function renderReminders() {
  return `
    <section class="panel">
      <div class="panel-title"><h2>催办记录</h2><span>全流程留痕</span></div>
      <div class="timeline">
        ${state.reminders
          .map(
            (item) => `
              <article>
                <b>${item.requirementName}</b>
                <p>${item.message}</p>
                <small>${item.sentAt} / ${item.sentBy} → ${item.productManager}</small>
              </article>
            `,
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderUsers() {
  return `
    <section class="panel">
      <div class="panel-title"><h2>用户账号与角色</h2><span>RBAC 权限管理演示</span></div>
      <div class="user-grid">
        ${users
          .map(
            (user) => `
              <article class="user-card">
                <strong>${user.name}</strong>
                <span>${user.department}</span>
                <p><b>${user.role}</b><em class="${user.status === "启用" ? "ok" : "off"}">${user.status}</em></p>
              </article>
            `,
          )
          .join("")}
      </div>
    </section>
  `;
}

function openSubmit(rowId) {
  const row = state.requirements.find((item) => item.id === rowId);
  const value = window.prompt(`填写「${row.name}」最终核定工作量（人天）`, row.finalWorkload ?? row.initialWorkload);
  if (value === null || value === "") return;
  state.requirements = state.requirements.map((item) => (item.id === rowId ? submitFinalWorkload(item, value) : item));
  render();
}

function sendReminder(rowId) {
  const row = state.requirements.find((item) => item.id === rowId);
  const reminder = createReminder(row, state.currentUser, "请尽快填写最终核定工作量，系统已记录本次催办。");
  state.reminders = [reminder, ...state.reminders];
  state.activeView = "reminders";
  render();
}

function attachContentEvents() {
  app.querySelectorAll("[data-filter]").forEach((select) => {
    select.addEventListener("change", (event) => {
      state.filters[event.target.dataset.filter] = event.target.value;
      render();
    });
  });
  app.querySelectorAll("[data-submit]").forEach((button) => {
    button.addEventListener("click", () => openSubmit(button.dataset.submit));
  });
  app.querySelectorAll("[data-remind]").forEach((button) => {
    button.addEventListener("click", () => sendReminder(button.dataset.remind));
  });
}

function renderContent() {
  const content = app.querySelector("#content");
  const views = {
    dashboard: renderDashboard,
    requirements: renderRequirements,
    import: renderImport,
    "my-workload": renderMyWorkload,
    reminders: renderReminders,
    users: renderUsers,
  };
  content.innerHTML = views[state.activeView]();
  attachContentEvents();
}

function render() {
  renderShell();
  renderContent();
}

render();
```

- [ ] **Step 2: Implement full styles**

Write `last-task/src/styles.css` with responsive layout, panels, tables, tags, filters, timeline, and user cards. Use a restrained blue-gray palette and avoid decorative gradients as primary content.

- [ ] **Step 3: Open in browser**

Run:

```powershell
cd last-task
python -m http.server 10011
```

Expected: `Serving HTTP on :: port 10011`.

Open: `http://localhost:10011`.

- [ ] **Step 4: Manually verify views**

Expected:

- Dashboard shows metrics.
- Requirement table renders all records for administrator.
- Role switcher to `李产品 - 产品经理` limits visible requirements.
- Import page shows success and failure rows.

- [ ] **Step 5: Commit UI core**

Run:

```powershell
git add last-task/src/app.js last-task/src/styles.css
git commit -m "feat: build workload prototype UI"
```

## Task 4: Polish Styles, Documentation, And Screenshot Capture

**Files:**
- Modify: `last-task/src/styles.css`
- Modify: `last-task/README.md`
- Create screenshots in: `last-task/screenshots`

- [ ] **Step 1: Complete CSS polish**

Ensure:

- Sidebar remains usable on desktop.
- Tables wrap text without clipping.
- Buttons have disabled states.
- Cards use radius 8px or less.
- Mobile layout stacks sidebar and content.

- [ ] **Step 2: Update README**

Write `last-task/README.md`:

```markdown
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
```

- [ ] **Step 3: Run state tests**

Run:

```powershell
node last-task\tests\state.test.mjs
```

Expected: `state tests passed`.

- [ ] **Step 4: Capture screenshots**

Use the browser at `http://localhost:10011` and save:

- `last-task/screenshots/01-dashboard.png`
- `last-task/screenshots/02-requirements.png`
- `last-task/screenshots/03-import-result.png`
- `last-task/screenshots/04-submit-workload.png`
- `last-task/screenshots/05-reminders.png`
- `last-task/screenshots/06-users-roles.png`

For `04-submit-workload.png`, trigger the workload prompt or submit a value so the page shows the updated `已填写` state and recalculated reduction.

- [ ] **Step 5: Commit final prototype**

Run:

```powershell
git add last-task
git commit -m "feat: finish workload approval prototype"
```

## Final Verification

- [ ] Run `node last-task\tests\state.test.mjs`.
- [ ] Serve the app with `python -m http.server 10011` from `last-task`.
- [ ] Verify all six screenshots exist.
- [ ] Check `git status --short` and report any intentionally uncommitted files.
