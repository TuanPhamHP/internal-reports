# Task: Thêm metric mới vào báo cáo

## Mô tả

Hướng dẫn từng bước để thêm một chỉ số (metric) mới vào trang `/reports/developers`.

---

## Checklist

### 1. Xác định nguồn dữ liệu

- [ ] Kiểm tra file `public/file_examle/Jira-t4.csv` để xác nhận column CSV tương ứng tồn tại
- [ ] Xác định cách parse: số nguyên, float, hay string
- [ ] Nếu cần field chưa có trong `DevReportRow` → thêm vào `app/models/index.ts`

### 2. Thêm computed property

Trong `app/components/reports/DevReport.vue`, thêm computed:

```typescript
const newMetric = computed(() => {
  return props.data.reduce((sum, row) => {
    return sum + (parseFloat(row['Field Name']) || 0)
  }, 0)
})
```

### 3. Thêm vào UI

**KPI Card** — thêm vào section KPI cards:

```html
<div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
  <p class="text-sm text-gray-500">Tên metric</p>
  <p class="text-2xl font-bold text-gray-800">{{ newMetric }}</p>
</div>
```

**Cột trong bảng team** — thêm `<th>` và `<td>` tương ứng trong bảng assigneeValuesTotal.

### 4. Đảm bảo print

- Nếu metric thuộc section mới, bọc trong `<div class="print-inner">` để phân trang khi in
- Section không cần in: thêm class `no-print`

### 5. Kiểm tra

- Upload file `public/file_examle/Jira-t4.csv` và kiểm tra metric hiển thị đúng
- Kiểm tra với file có giá trị rỗng hoặc `0` để tránh NaN

---

## Ví dụ thực tế: Thêm "Average Story Points per Dev"

```typescript
// Trong DevReport.vue
const avgSpPerDev = computed(() => {
  const devs = Object.keys(assigneeValuesTotal.value)
  if (devs.length === 0) return 0
  return (totalStoryPoints.value / devs.length).toFixed(1)
})
```
