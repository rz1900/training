# 课堂笔记项目

这是一个基于 Markdown 的课堂笔记项目，用来统一管理：

- 课程索引
- 课堂笔记
- 名词解释
- 参考资料

## 目录结构

```text
class-notes/
├── README.md
├── index.md
├── notes/
│   ├── README.md
│   └── 2026-05-20-example.md
├── glossary/
│   ├── README.md
│   └── terms.md
├── references/
│   ├── README.md
│   └── resources.md
└── templates/
    ├── note-template.md
    ├── glossary-term-template.md
    └── reference-template.md
```

## 使用建议

1. 从 [index.md](index.md) 进入总索引。
2. 每节课复制 [note-template.md](templates/note-template.md) 到 `notes/` 下，并按日期和主题命名。
3. 新概念统一写入 [terms.md](glossary/terms.md)。
4. 书籍、论文、网页、视频等统一写入 [resources.md](references/resources.md)。

## 命名约定

- 课堂笔记：`YYYY-MM-DD-主题.md`
- 名词解释：按拼音或主题分组，也可以先集中写在 `terms.md`
- 参考资料：建议记录来源、链接、访问日期和简短摘要
