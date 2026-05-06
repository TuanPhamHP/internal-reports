# Skill: Export CSV từ Jira đúng cách

## Mục đích

Hướng dẫn export CSV từ Jira sao cho khớp với model `DevReportRow` mà ứng dụng mong đợi.

---

## Các bước export

1. Vào **Jira Board** → chọn Sprint hoặc Filter muốn báo cáo
2. Vào **Issues** → **Export** → **Export CSV (all fields)** hoặc **Export CSV (current fields)**
3. Chọn **comma** làm delimiter (không chọn semicolon)
4. Encoding: **UTF-8**
5. Lưu file `.csv`

---

## Columns bắt buộc phải có

Ứng dụng cần ít nhất các columns sau (tên phải khớp chính xác):

| Column name | Dùng để |
|---|---|
| `Assignee` | Phân nhóm theo dev |
| `Custom field (Story Points)` | Tính điểm story |
| `Time Spent` | Tính thời gian (đơn vị: giây) |
| `Status` | Completion rate |
| `Issue Type` | Phân loại Task/Bug/Story |
| `Parent summary` | Tên Epic |
| `Sprint` | Hiển thị trên header báo cáo |
| `Summary` | Tên task (hiển thị trong narrative) |

---

## Kiểm tra file trước khi import

Mở file CSV bằng text editor (không phải Excel — Excel có thể đổi format):

```
Issue Type,Issue key,Issue id,Summary,Assignee,...
Task,PROJ-123,10001,"Tên task",Nguyễn Văn A,...
```

- Dòng đầu phải là header
- Dấu phân cách phải là dấu phẩy (`,`)
- Tên column phải khớp chính xác (phân biệt chữ hoa/thường, khoảng trắng)

---

## Xử lý khi Jira đổi tên column

Nếu Jira cập nhật và đổi tên column (ví dụ: `Story Points` thay vì `Custom field (Story Points)`):

1. Kiểm tra tên thực tế trong CSV export mới
2. Cập nhật `DevReportRow` trong `app/models/index.ts`
3. Tìm tất cả chỗ dùng tên cũ trong `DevReport.vue` bằng Grep
4. Cập nhật tên column trong computed properties

---

## File mẫu tham chiếu

`public/file_examle/Jira-t4.csv` là file export thực từ dự án "Control Tower - MVP", tháng 4/2026. Dùng để test khi phát triển tính năng mới.
