import { currentUser } from "./data.js";

const app = document.querySelector("#app");

app.innerHTML = `
  <main class="empty-state">
    <p class="eyebrow">一线体验官专项数据分析系统</p>
    <h1>工作量核定管理系统</h1>
    <p>当前登录：${currentUser.name}（${currentUser.role}）</p>
  </main>
`;
