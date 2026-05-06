# Task: Debug lỗi parse CSV

## Các lỗi thường gặp

### 1. Metric hiển thị `NaN` hoặc `0`

**Nguyên nhân:** Tên column trong CSV không khớp chính xác với key trong code.

**Cách kiểm tra:**
```javascript
// Trong browser console sau khi upload
// DevTools → Sources → DevReport.vue (hoặc console.log tạm)
console.log(Object.keys(props.data[0]))
```

So sánh với các key đang dùng trong computed. Jira đôi khi thêm/bỏ khoảng trắng hoặc đổi tên field.

**Fix:** Cập nhật tên field trong `DevReportRow` (app/models/index.ts) và trong computed của DevReport.

---

### 2. Tất cả rows bị parse thành 1 object (data.length === 1)

**Nguyên nhân:** File CSV dùng dấu phân cách khác (`;` thay vì `,`), hoặc encoding không phải UTF-8.

**Fix trong CsvUploader.vue:**
```javascript
Papa.parse(file, {
  header: true,
  skipEmptyLines: true,
  delimiter: ';',     // Thêm nếu Jira export dùng dấu chấm phẩy
  encoding: 'UTF-8',  // Thêm nếu có ký tự tiếng Việt bị lỗi
  // ...
})
```

---

### 3. Ký tự tiếng Việt bị lỗi (mojibake)

**Nguyên nhân:** File CSV encoding Windows-1252 hoặc latin1 thay vì UTF-8.

**Fix:**
```javascript
Papa.parse(file, {
  encoding: 'UTF-8',
  // Hoặc thử: encoding: 'windows-1252'
})
```

---

### 4. Assignee bị tách thành nhiều entry trùng nhau

**Nguyên nhân:** Tên có khoảng trắng thừa ở đầu/cuối.

**Fix trong computed:**
```typescript
const key = row['Assignee'].trim()  // Luôn trim() khi dùng làm key
```

---

## Quy trình debug chuẩn

1. Upload file mẫu `public/file_examle/Jira-t4.csv` — nếu lỗi ở đây thì bug trong code
2. Upload file thực — nếu chỉ lỗi ở file thực thì bug trong CSV (encoding, delimiter, column name)
3. Log `props.data[0]` để xem cấu trúc object thực tế
4. So sánh key names với `DevReportRow` type
