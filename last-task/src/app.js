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
      <div class="sidebar-note">
        <b>模拟角色</b>
        <span>${roles.join(" / ")}</span>
      </div>
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
    state.filters = { status: "全部", productManager: "全部", system: "全部" };
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
  const demoUser = state.currentUser.role === "产品经理" ? state.currentUser : users.find((user) => user.name === "李产品");
  const rows = filterRequirementsForRole(state.requirements, demoUser);
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
