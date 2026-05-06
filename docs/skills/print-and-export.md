# Skill: Print và Export báo cáo

## Hai cơ chế export

### 1. Browser Print (`window.print()`)

**Kích hoạt:** Nút in trong `CsvUploader.vue`

**Cách hoạt động:**
- CSS `@media print` trong `CsvUploader.vue` ẩn `.no-print`
- Mỗi `.print-inner` có `page-break-after: always`
- Toàn bộ margin trang được xóa

**Để section mới xuất hiện khi in:**
```html
<div class="print-inner">
  <!-- Nội dung section -->
</div>
```

**Để ẩn element khi in:**
```html
<div class="no-print">
  <!-- Nút, filter, UI control không cần in -->
</div>
```

---

### 2. html2pdf.js (`exportPdf()`)

**Trạng thái:** Hàm đã được implement trong `CsvUploader.vue` nhưng **chưa gắn vào UI**.

**Để kích hoạt:** Thêm nút trong template CsvUploader:

```html
<button @click="exportPdf" class="...">
  Export PDF
</button>
```

**Cấu hình hiện tại:**
```javascript
html2pdf()
  .set({
    margin: 10,
    filename: 'report.pdf',
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  })
  .from(document.getElementById('report-content'))
  .save()
```

**Yêu cầu:** Element có `id="report-content"` phải bọc toàn bộ nội dung báo cáo trong `DevReport.vue`.

---

## Quy tắc print-safe

- Tránh `overflow: hidden` trên container wrapping `.print-inner` — sẽ cắt nội dung
- Màu nền (`bg-gray-50`, `bg-white`) in được trong Chrome nếu bật "Background graphics"
- Chart.js render thành `<canvas>` — in được ngay, không cần xử lý thêm
- Bảng dài hơn 1 trang: thêm `page-break-inside: avoid` trên từng row nếu cần

---

## Debug print layout

1. Mở DevTools → Ctrl+Shift+P → "Show print preview"
2. Kiểm tra section nào bị cắt hoặc chồng lên nhau
3. Thêm/bỏ `print-inner` để điều chỉnh page break
