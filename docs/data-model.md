# Data Model — CSV & TypeScript

## File CSV mẫu

**Vị trí:** `public/file_examle/Jira-t4.csv`

Đây là file export thực từ Jira, dùng để test và phát triển. Khi thêm field mới vào báo cáo, kiểm tra file này trước để xác nhận tên column chính xác.

---

## Cấu trúc CSV (header row)

```
Issue Type, Issue key, Issue id, Summary, Assignee, Assignee Id,
Sprint, Custom field (Story Points), Custom field (Story point estimate),
Time Spent, Status, Due date, Parent, Parent key, Parent summary
```

**Lưu ý:**
- PapaParse parse với `header: true` → tên key của object = tên column CSV (giữ nguyên khoảng trắng và ký tự đặc biệt)
- `Time Spent` đơn vị là **giây** (integer string) — ví dụ: `"3600"` = 1 giờ
- `Custom field (Story Points)` và `Custom field (Story point estimate)` là **float string** — ví dụ: `"3.0"`, `"5.0"`
- Có thể có giá trị rỗng `""` cho nhiều field

---

## TypeScript Model

**File:** `app/models/index.ts`

```typescript
export type DevReportRow = {
  Assignee: string;
  'Assignee Id': string;
  'Custom field (Story Points)': string;
  'Custom field (Story point estimate)': string;
  'Due date': string;
  'Issue Type': string;
  'Issue id': string;
  'Issue key': string;
  Sprint: string;
  Status: string;
  Summary: string;
  'Time Spent': string;
  'Parent summary': string;
};
```

**Chú ý:** Model hiện thiếu các field: `Parent`, `Parent key` — chúng có trong CSV nhưng chưa được dùng.

---

## Quy tắc parse

| Field | Parse Method | Xử lý giá trị rỗng |
|---|---|---|
| Story Points | `parseFloat(row['Custom field (Story Points)'])` | → `NaN`, cần `|| 0` |
| Time Spent | `parseInt(row['Time Spent'])` | → `NaN`, cần `|| 0` |
| Assignee | string trực tiếp | Dùng để group — cần trim() |
| Status | string trực tiếp | So sánh case-sensitive |
| Issue Type | string trực tiếp | Dùng để group |
| Parent summary | string trực tiếp | = Epic name |

---

## Aggregation patterns trong DevReport.vue

### Pattern 1: Tổng story points

```typescript
// Lấy story points từ cột, fallback về 0 nếu rỗng/NaN
const sp = parseFloat(row['Custom field (Story Points)']) || 0
```

### Pattern 2: Group by field

```typescript
// Group rows theo một field, tính tổng SP và time spent
const grouped = data.reduce((acc, row) => {
  const key = row['Parent summary']
  if (!acc[key]) acc[key] = { sp: 0, time: 0, count: 0 }
  acc[key].sp += parseFloat(row['Custom field (Story Points)']) || 0
  acc[key].time += parseInt(row['Time Spent']) || 0
  acc[key].count++
  return acc
}, {} as Record<string, { sp: number; time: number; count: number }>)
```

### Pattern 3: Hiển thị thời gian

```typescript
// Từ giây → giờ với 1 chữ số thập phân
const hours = (totalSeconds / 3600).toFixed(1)
```

---

## Các giá trị Status thực tế (từ file mẫu)

- `Done`
- `Ready for Test`
- `In Progress`
- `To Do`
- `In Review`

**Lưu ý:** Khi lọc theo status "Done" để tính completion rate, so sánh chính xác string `=== 'Done'`.

---

## Mở rộng model

Khi Jira export thêm column mới:

1. Thêm field vào `DevReportRow` trong `app/models/index.ts`
2. Nếu field là số (giây, float): ghi rõ đơn vị trong comment inline
3. Cập nhật file này (docs/data-model.md) với thông tin parse
