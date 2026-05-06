# KPI Framework theo Level

## Cách sử dụng

1. Upload file CSV Jira tại `/reports/developers`
2. Trong bảng **Stats của thành viên**, chọn **Level** cho từng người ở cột cuối
3. Bảng **Đánh giá KPI** xuất hiện ngay bên dưới và cập nhật tự động

---

## KPI Target theo Level

| Level | SP / Tháng | Completion Rate | Bug Rate (tối đa) |
|:---:|:---:|:---:|:---:|
| Fresher | ≥ 15 SP | ≥ 70% | ≤ 20% |
| Junior | ≥ 20 SP | ≥ 75% | ≤ 15% |
| Middle | ≥ 30 SP | ≥ 85% | ≤ 10% |
| Senior | ≥ 40 SP | ≥ 90% | ≤ 5% |

Giá trị này được định nghĩa tại `app/models/index.ts` → `KPI_TARGETS`.

---

## Định nghĩa từng chỉ số

### SP / Tháng
- **Nguồn:** `Custom field (Story Points)` trong CSV
- **Tính:** Tổng SP của tất cả task được assign trong kỳ
- **Đạt:** `actualSP >= target.spPerMonth`

### Completion Rate (Tỉ lệ hoàn thành)
- **Nguồn:** Cột `Status`
- **Tính:** `(task Done + task Ready for Test) / tổng task × 100%`
- **Đạt:** `completionRate >= target.completionRate`

### Bug Rate
- **Nguồn:** Cột `Issue Type`
- **Tính:** `(task có Issue Type = "Bug") / tổng task × 100%`
- **Đạt:** `bugRate <= target.bugRateMax` (thấp hơn = tốt hơn)

---

## Kết quả đánh giá

| Màu | Ý nghĩa |
|---|---|
| Xanh lá (3/3) | Đạt tất cả KPI |
| Vàng (2/3) | Đạt đa số, cần cải thiện 1 chỉ số |
| Đỏ (0-1/3) | Không đạt, cần review |

---

## Điều chỉnh target

Để thay đổi KPI target, sửa trực tiếp trong `app/models/index.ts`:

```typescript
export const KPI_TARGETS: Record<MemberLevel, KpiTarget> = {
  fresher: { label: 'Fresher', spPerMonth: 15, completionRate: 70, bugRateMax: 20 },
  junior:  { label: 'Junior',  spPerMonth: 20, completionRate: 75, bugRateMax: 15 },
  middle:  { label: 'Middle',  spPerMonth: 30, completionRate: 85, bugRateMax: 10 },
  senior:  { label: 'Senior',  spPerMonth: 40, completionRate: 90, bugRateMax: 5  },
};
```

---

## Lưu ý

- **Level assignment không persist** qua các lần upload — cần chọn lại khi upload CSV mới
- Nếu một thành viên chưa được chọn level, họ sẽ không xuất hiện trong bảng Đánh giá KPI
- Bug Rate chỉ tính các task có `Issue Type` = `"Bug"` chính xác (phân biệt chữ hoa/thường)
- Tham khảo bảng quy đổi SP tại [story-point-convention.md](story-point-convention.md) để hiểu ngữ cảnh của từng mức target
