# Kiến trúc ứng dụng

## Tổng quan

interal-tools là ứng dụng **SPA thuần client-side** (Nuxt với SSR tắt). Không có backend, không có database — toàn bộ xử lý dữ liệu diễn ra trong trình duyệt của người dùng.

---

## Sơ đồ luồng dữ liệu

```
[Jira Project] ──export──► CSV file (local disk)
                                   │
                              (user upload)
                                   │
                                   ▼
                         ┌─────────────────────┐
                         │   CsvUploader.vue   │
                         │  PapaParse.parse()  │
                         │  header: true       │
                         │  skipEmptyLines     │
                         └────────┬────────────┘
                                  │ emit('parsed', DevReportRow[])
                                  ▼
                         ┌─────────────────────┐
                         │  developers.vue     │
                         │  srcData = ref([])  │
                         └────────┬────────────┘
                                  │ :data="srcData"
                                  ▼
                         ┌─────────────────────┐
                         │    DevReport.vue    │
                         │  computed props     │
                         │  Chart.js render    │
                         │  Print / PDF        │
                         └─────────────────────┘
```

---

## Các component và vai trò

### `app/pages/reports/developers.vue`
- **Vai trò:** Container page, điều phối giữa uploader và report
- **State:** `srcData: Ref<DevReportRow[]>` — dữ liệu CSV đã parse
- **Không có logic nghiệp vụ** — chỉ kết nối component con

### `app/components/CsvUploader.vue`
- **Vai trò:** UI upload file + điều khiển in ấn
- **Input:** File CSV từ `<input type="file">`
- **Output:** `emit('parsed', result.data)` — mảng object với key = CSV header
- **Chú ý:** Nút Print dùng `window.print()` với CSS `@media print` tích hợp sẵn

### `app/components/reports/DevReport.vue`
- **Vai trò:** Toàn bộ logic nghiệp vụ + render báo cáo
- **Props:** `data: DevReportRow[]`
- **Computed:** Tất cả aggregations (xem [data-model.md](data-model.md))
- **Sections UI:**
  1. Header — tên báo cáo, tuần, khoảng ngày
  2. KPI Cards — story points, time spent, task completion rate
  3. Epic Resource Allocation — progress bar per epic
  4. Issue Type Distribution — doughnut chart
  5. Team Member Stats — bảng per-assignee
  6. Summary Narrative — văn bản tự động tóm tắt
  7. Footer — ngày tạo, ghi chú bảo mật

### `app/components/chart/ReportChart.vue`
- **Vai trò:** Wrapper Chart.js cho doughnut chart
- **Props:** `labels: string[]`, `values: number[]`
- **Plugin:** chartjs-plugin-datalabels hiển thị giá trị + phần trăm

---

## Thư viện và lý do chọn

| Thư viện | Lý do |
|---|---|
| **PapaParse** | Parse CSV phía client đáng tin cậy, xử lý encoding tốt |
| **Chart.js** | Chart nhẹ, hỗ trợ doughnut + datalabels plugin |
| **html2pdf.js** | Export PDF không cần server |
| **Nuxt (SSR off)** | Routing, auto-import, DX tốt — không cần SSR vì không có SEO requirement |

---

## Print / PDF Export

Hai cách xuất báo cáo:

1. **Browser Print** (`window.print()` trong CsvUploader):
   - CSS `@media print` ẩn `.no-print`
   - Mỗi `.print-inner` thêm `page-break-after: always`
   - Xóa margin toàn trang

2. **html2pdf.js** (hàm `exportPdf()` — hiện chưa được gọi từ UI):
   - Chuyển `#report-content` thành PDF blob
   - Có thể kích hoạt bằng cách thêm nút trong CsvUploader

---

## Mở rộng trong tương lai

Nếu cần mở rộng, ưu tiên theo thứ tự:

1. **Thêm loại báo cáo mới** → tạo page mới trong `app/pages/reports/`, tạo component trong `app/components/reports/`
2. **Thêm field CSV** → cập nhật `DevReportRow` trước, sau đó computed trong DevReport
3. **Thêm chart** → dùng lại `ReportChart.vue` với props mới, hoặc tạo component chart riêng nếu chart type khác
4. **Backend** → chỉ khi cần lưu lịch sử hoặc auth — hiện tại không cần
