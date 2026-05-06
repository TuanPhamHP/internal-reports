# Skill: Phân tích và mở rộng logic báo cáo

## Mục đích

Hướng dẫn AI agent hiểu và làm việc với logic nghiệp vụ trong `DevReport.vue`.

---

## Ngữ cảnh cần nắm

Trước khi chỉnh sửa bất kỳ computed nào, đọc:
- `app/models/index.ts` — để biết các field có sẵn
- `app/components/reports/DevReport.vue` — toàn bộ computed hiện tại
- `public/file_examle/Jira-t4.csv` — 5-10 dòng đầu để hiểu data thực

---

## Pattern chuẩn cho computed mới

### Tổng một field số

```typescript
const totalX = computed(() =>
  props.data.reduce((sum, row) => sum + (parseFloat(row['Field']) || 0), 0)
)
```

### Group by + aggregate

```typescript
const byAssignee = computed(() => {
  const map: Record<string, { sp: number; time: number }> = {}
  for (const row of props.data) {
    const name = row['Assignee'].trim()
    if (!map[name]) map[name] = { sp: 0, time: 0 }
    map[name].sp += parseFloat(row['Custom field (Story Points)']) || 0
    map[name].time += parseInt(row['Time Spent']) || 0
  }
  return Object.entries(map)
    .map(([name, v]) => ({ name, ...v }))
    .sort((a, b) => b.sp - a.sp)
})
```

### Lọc theo điều kiện

```typescript
const doneTasks = computed(() =>
  props.data.filter(row => row['Status'] === 'Done')
)
```

---

## Quy tắc an toàn

- **Luôn dùng `|| 0`** khi parse số từ CSV — giá trị rỗng `""` parse thành `NaN`
- **Luôn dùng `.trim()`** khi dùng string làm key trong Record/Map
- **Không mutate `props.data`** — computed phải là pure function
- **Không gọi API** — đây là ứng dụng offline

---

## Khi thêm section UI mới

1. Computed data đặt trước `return` trong `<script setup>`
2. Template đặt đúng thứ tự visual (KPI → Charts → Table → Narrative)
3. Thêm class `print-inner` nếu section cần phân trang khi in
4. Dùng Tailwind utility classes — không viết CSS tùy chỉnh trừ khi cần thiết
5. Responsive: grid `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`

---

## Thêm chart mới

`ReportChart.vue` nhận `labels` và `values`. Chuẩn bị data:

```typescript
const chartLabels = computed(() =>
  byAssignee.value.map(d => d.name)
)
const chartValues = computed(() =>
  byAssignee.value.map(d => d.sp)
)
```

Render:
```html
<ReportChart :labels="chartLabels" :values="chartValues" />
```

Nếu cần chart type khác (bar, line) → tạo component mới trong `app/components/chart/`.
