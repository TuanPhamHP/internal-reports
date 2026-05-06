# docs/ — Tài liệu dự án interal-tools

## Kiến trúc

- [architecture.md](architecture.md) — Sơ đồ luồng dữ liệu, vai trò từng component, quyết định kỹ thuật
- [data-model.md](data-model.md) — Cấu trúc CSV Jira, TypeScript model, quy tắc parse

## Tasks (Hướng dẫn từng bước)

| Task | Mô tả |
|---|---|
| [tasks/add-new-metric.md](tasks/add-new-metric.md) | Thêm chỉ số mới vào dashboard |
| [tasks/add-new-report-page.md](tasks/add-new-report-page.md) | Tạo loại báo cáo mới |
| [tasks/debug-csv-parsing.md](tasks/debug-csv-parsing.md) | Debug lỗi upload hoặc parse CSV |

## Skills (Kỹ năng cho AI agent)

| Skill | Mô tả |
|---|---|
| [skills/analyze-report-data.md](skills/analyze-report-data.md) | Pattern làm việc với computed và aggregation |
| [skills/print-and-export.md](skills/print-and-export.md) | Cơ chế print/PDF, class no-print/print-inner |
| [skills/jira-csv-export.md](skills/jira-csv-export.md) | Cách export CSV đúng từ Jira |
