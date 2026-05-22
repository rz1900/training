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
