export const roles = ["开发管理员", "产品经理", "系统管理员"];

export const users = [
  { id: "u-admin", name: "陈开发", role: "开发管理员", department: "研发管理部", status: "启用" },
  { id: "u-pm-1", name: "李产品", role: "产品经理", department: "产品一部", status: "启用" },
  { id: "u-pm-2", name: "王产品", role: "产品经理", department: "产品二部", status: "启用" },
  { id: "u-root", name: "赵系统", role: "系统管理员", department: "平台运维组", status: "启用" },
  { id: "u-pm-3", name: "周产品", role: "产品经理", department: "产品三部", status: "禁用" },
];

export const currentUser = users[0];

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
