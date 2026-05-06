# CLAUDE.md — interal-tools

## Tổng quan dự án

Ứng dụng dashboard xuất báo cáo nhân sự từ file CSV export của Jira. Người dùng upload file CSV từ Jira, ứng dụng xử lý client-side và hiển thị báo cáo tại trang `/reports/developers`.

**Mục tiêu:** Tự động hóa báo cáo hiệu suất dev hàng tuần từ dữ liệu Jira — bao gồm story points, time spent, tiến độ task, và phân bổ nguồn lực theo epic.

---

## Tech Stack

| Layer       | Thư viện / Version                         |
| ----------- | ------------------------------------------ |
| Framework   | Nuxt 4.2.2 (SSR disabled — client-only)    |
| UI          | Vue 3.5.27 + Tailwind CSS 6                |
| CSV Parsing | PapaParse 5.5.3                            |
| Charts      | Chart.js 4.5.1 + chartjs-plugin-datalabels |
| PDF Export  | html2pdf.js 0.14.0                         |
| Type System | TypeScript                                 |

---

## Cấu trúc dự án

```
app/
├── components/
│   ├── CsvUploader.vue        # Upload CSV + nút in/home
│   ├── chart/ReportChart.vue  # Doughnut chart (Chart.js)
│   └── reports/DevReport.vue  # Dashboard chính — toàn bộ logic tính toán
├── models/index.ts            # Type DevReportRow (khớp header CSV Jira)
└── pages/
    ├── index.vue              # Landing page → link đến /reports/developers
    └── reports/developers.vue # Page chứa CsvUploader + DevReport
public/
└── file_examle/Jira-t4.csv   # File CSV mẫu từ Jira
docs/                          # Tài liệu kiến trúc và hướng dẫn cho AI agent
```

---

## Data Flow

```
Jira Export (CSV)
      ↓
CsvUploader.vue   [PapaParse, header:true, skipEmptyLines:true]
      ↓ emit('parsed', rows)
developers.vue    [srcData ref]
      ↓ :data="srcData"
DevReport.vue     [computed aggregations]
      ↓
UI: KPI cards · Epic bars · Doughnut chart · Team table · Narrative
```

---

## Model dữ liệu — `DevReportRow`

Định nghĩa tại [app/models/index.ts](app/models/index.ts). Khớp 1-1 với header của CSV Jira export.

Các trường quan trọng nhất:

| Field                         | Kiểu   | Ghi chú                                   |
| ----------------------------- | ------ | ----------------------------------------- |
| `Assignee`                    | string | Tên developer                             |
| `Custom field (Story Points)` | string | Điểm độ phức tạp (parse sang float)       |
| `Time Spent`                  | string | Thời gian làm việc tính bằng **giây**     |
| `Status`                      | string | Done / In Progress / Ready for Test / ... |
| `Issue Type`                  | string | Task / Bug / Story / ...                  |
| `Parent summary`              | string | Tên Epic                                  |
| `Sprint`                      | string | Sprint name                               |

---

## Logic tính toán chính (DevReport.vue)

| Computed               | Mô tả                                                              |
| ---------------------- | ------------------------------------------------------------------ |
| `totalStoryPoints`     | Tổng story points toàn team                                        |
| `totalTimeSpent`       | Tổng seconds → hiển thị theo giờ                                   |
| `epics`                | Group theo `Parent summary`, sort desc theo SP                     |
| `assigneeValuesTotal`  | Mảng per-dev: SP, time, task count, done count, hard task (SP > 3) |
| `issueTypeValuesTotal` | SP theo từng Issue Type                                            |
| `statusValuesTotal`    | Số lượng task theo từng Status                                     |

---

## Quy tắc phát triển

- **Không thêm backend / API call** — ứng dụng hoạt động hoàn toàn client-side.
- **Không thêm state management** (Pinia/Vuex) — dữ liệu chỉ cần reactive local ref.
- Khi thêm field mới vào model, cập nhật `DevReportRow` trong `app/models/index.ts` trước.
- Mỗi section UI mới trong `DevReport.vue` phải có class `.print-inner` nếu cần xuất hiện khi print.
- Không đặt comment giải thích "what" — chỉ comment khi logic "why" không tự hiển nhiên.
- Tham khảo file mẫu `public/file_examle/Jira-t4.csv` khi cần kiểm tra cấu trúc CSV.

---

## Lệnh thường dùng

```bash
yarn dev          # Khởi động dev server
yarn build        # Build production
yarn generate     # Static site generation
yarn preview      # Preview build
```

---

## Tài liệu mở rộng

Xem thư mục [docs/](docs/) để biết chi tiết:

- [docs/architecture.md](docs/architecture.md) — Kiến trúc chi tiết và luồng dữ liệu
- [docs/data-model.md](docs/data-model.md) — Cấu trúc CSV và model TypeScript
- [docs/story-point-convention.md](docs/story-point-convention.md) — Quy ước về Story point trong quản lý dự án
- [docs/tasks/](docs/tasks/) — Các task thường gặp khi phát triển
- [docs/skills/](docs/skills/) — Hướng dẫn kỹ năng cho AI agent
