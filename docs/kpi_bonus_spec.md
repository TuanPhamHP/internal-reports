# KPI Bonus Calculator — Spec & Implementation Reference

## Tổng quan

Route `/reports/kpi-bonus` — tính KPI thưởng dự án, hoàn toàn client-side.

Đối tượng đánh giá:

- **Dev** — kết hợp điểm khách quan (Jira) + điểm chủ quan (PM nhập tay)
- **Tester** — chỉ điểm chủ quan (không log Jira), tổng điểm = 100% subjective
- **BA** — chỉ điểm chủ quan (không log Jira), tổng điểm = 100% subjective
- **Quản lý** — đánh giá theo 4 nhóm tổ chức/tiến độ/chất lượng/team

Kết quả: điểm có hệ số → % đóng góp → phân bổ tiền thưởng.

---

## Model TypeScript — `app/models/kpi.ts`

```typescript
// Level dùng chung với DevReport, định nghĩa tại app/models/index.ts
type MemberLevel = 'intern' | 'fresher' | 'junior' | 'middle' | 'senior';

export interface KpiProject {
  name: string;
  period: string;        // VD: "T4/2026"
  totalBonus: number;    // VND
  devBonusRatio: number; // 0–100, phần % cho devs (manager = 100 - này)
  managerName: string;
}

export interface KpiWeights {
  // Tỉ lệ khách quan vs chủ quan (tổng = 100) — chỉ áp dụng cho Dev
  objective: number;     // default: 60
  subjective: number;    // default: 40
  // Sub-weights phần khách quan (tổng = 100)
  objSp: number;         // default: 50
  objEfficiency: number; // default: 30
  objCompletion: number; // default: 20
  // Sub-weights phần chủ quan (tổng = 100)
  subResponse: number;   // default: 30
  subQuality: number;    // default: 35
  subBugRate: number;    // default: 20
  subTeamwork: number;   // default: 15
  // Weights nhóm quản lý (tổng = 100)
  mgrOrganization: number; // default: 25
  mgrSchedule: number;     // default: 30
  mgrQuality: number;      // default: 25
  mgrTeamDev: number;      // default: 20
}

export interface KpiDevJira {
  sp: number;              // Story Points Done (status = 'Done' hoặc 'Ready for Test')
  timeSpentHours: number;  // Giờ đã log
  spEstimate: number;      // SP estimate trung bình (thông tin, không tính điểm)
  spActual: number;        // SP actual trung bình (thông tin, không tính điểm)
  totalTasks: number;
  doneTasks: number;
}

export interface KpiDevSubjective {
  response: number; // 1–10 | Dev/Tester: Phản hồi & giao tiếp | BA: Giao tiếp & phản hồi stakeholder
  quality: number;  // 1–10 | Dev: chất lượng code | Tester: chất lượng test case | BA: Chất lượng yêu cầu & giải pháp
  bugRate: number;  // 1–10 | Dev: bug rate (10=ít bug) | Tester: khả năng tìm bug | BA: Tỉ lệ rework từ yêu cầu (10=ít rework)
  teamwork: number; // 1–10 | Tất cả: Teamwork & phối hợp
  notes: { response: string; quality: string; bugRate: string; teamwork: string };
}

export interface KpiDev {
  id: string;
  name: string;
  role: 'dev' | 'tester' | 'ba';
  level: MemberLevel;
  monthsInProject: number;
  coefficient: number; // hệ số cống hiến, default 1.0 — nhân vào totalScore khi tính contribution
  jira: KpiDevJira;
  subjective: KpiDevSubjective;
}

// Computed results — không persist
export interface KpiDevResult {
  dev: KpiDev;
  objectiveScore: number;  // 0–100 (tester luôn = 0, không dùng)
  subjectiveScore: number; // 0–100
  totalScore: number;      // 0–100
  weightedScore: number;   // totalScore × coefficient
  contribution: number;    // % pool dev, tính từ weightedScore
  bonusAmount: number;     // VND
}
```

---

## Scoring Logic — `app/composables/useKpiCalculator.ts`

### KPI Targets theo level (nguồn: `app/models/index.ts`)

| Level   | SP/tháng | Completion | Time tối thiểu |
|---------|----------|------------|----------------|
| Intern  | 25       | 70%        | 80h            |
| Fresher | 25       | 70%        | 80h            |
| Junior  | 30       | 75%        | 100h           |
| Middle  | 70       | 85%        | 120h           |
| Senior  | 90       | 90%        | 140h           |

### Điểm khách quan — Dev only

```
absScore(actual, target) = min(actual / target, 1) × 100   // capped tại 100

spScore   = absScore(jira.sp, target.spPerMonth)
compScore = absScore(completionRate%, target.completionRate)
```

**SP Efficiency — tiered theo % đạt SP target:**

SP/h thuần không phải metric tốt vì dev làm ít SP nhưng dùng ít giờ sẽ có tỉ lệ cao giả tạo.
Thay vào đó, `effScore` được tính theo mức độ đạt SP target:

| SP đạt được (spPct = sp / spTarget) | Tier | Score |
|---|---|---|
| < 40% | Rất thấp | 0 – 20 (tuyến tính) |
| 40 – 60% | Thấp | 20 – 40 |
| 60 – 80% | Trung bình | 40 – 60 |
| 80 – 100% | Khá | 60 – 80 |
| ≥ 100% SP, chưa đủ time | Đạt SP, chờ time | 80 + timePct × 20 |
| ≥ 100% SP + ≥ time target | Đạt KPI ✓ | 100 |

```
spPct  = sp / target.spPerMonth
metSP  = spPct >= 1
metTime = timeSpentHours >= target.timeSpentMinHours

if metSP && metTime:   effScore = 100
elif metSP:            effScore = 80 + (timeH / timeTarget) × 20   // 80–99
else:                  effScore = piecewiseLinear(spPct)            // 0–80

objectiveScore = spScore × (objSp/100)
              + effScore × (objEfficiency/100)
              + compScore × (objCompletion/100)
```

### Điểm chủ quan — Dev, Tester & BA

```
norm(val) = (val - 1) / 9 × 100   // chuẩn hoá slider 1–10 → 0–100

subjectiveScore = norm(response) × (subResponse/100)
                + norm(quality)  × (subQuality/100)
                + norm(bugRate)  × (subBugRate/100)
                + norm(teamwork) × (subTeamwork/100)
```

Labels khác nhau theo role nhưng công thức tính hoàn toàn giống nhau:

| Slot | Dev | Tester | BA |
|---|---|---|---|
| response | Phản hồi & giao tiếp | Phản hồi & giao tiếp | Giao tiếp & phản hồi stakeholder |
| quality | Chất lượng code | Chất lượng test case | Chất lượng yêu cầu & giải pháp |
| bugRate | Bug rate (10=ít bug) | Khả năng tìm bug (10=nhiều) | Tỉ lệ rework từ yêu cầu (10=ít) |
| teamwork | Teamwork & phối hợp | Teamwork & phối hợp | Teamwork & phối hợp |

### Điểm tổng

```
// Dev
totalScore = objectiveScore × (objective/100) + subjectiveScore × (subjective/100)

// Tester & BA — bỏ qua objective hoàn toàn
totalScore = subjectiveScore
```

### Phân bổ thưởng

```
weightedScore   = totalScore × coefficient
contribution%   = weightedScore / Σ(weightedScore_all) × 100
bonusAmount     = totalDevPool × (contribution / 100)

// Manager
managerBonus = totalBonus × ((100 - devBonusRatio) / 100)
managerActual = managerBonus × (managerScore / 100)
```

---

## Jira CSV Import

SP Done tính theo status: `'Done'` hoặc `'Ready for Test'` (cả hai đều được tính).

```typescript
const doneRows = rows.filter(r => r.Status === 'Done' || r.Status === 'Ready for Test');
jira.sp = sum(doneRows, r => parseFloat(r['Custom field (Story Points)']));
```

---

## UI — Các thành phần chính

### KpiTabConfig.vue — Tab 1

- Thông tin dự án (tên, kỳ, tổng thưởng, tỉ lệ dev/manager, tên quản lý)
- Danh sách thành viên: mỗi row gồm **Tên | Role (Dev/Tester/BA) | Level | Số tháng | Hệ số | Xóa**
- Import Jira CSV tự động điền data (chỉ áp dụng cho dev — tester & BA không cần)
- Cấu hình trọng số qua `KpiWeightConfig`

### KpiTabDevs.vue — Tab 2

Mỗi thành viên là `KpiDevCard` (accordion).

**Dev card:**
- Section A: inputs Jira data + computed metrics (SP Efficiency, Est. Accuracy, Completion)
- Section B: 4 slider chủ quan với labels dev
- Section C: bảng breakdown công thức
  - **Objective table**: cột Tiêu chí | Thực tế | Target | Điểm | Trọng số | Đóng góp
    - SP: thực tế vs target SP
    - SP Efficiency: hiển thị **% đạt SP** (sp/spTarget×100) + giờ đã log; Target = "≥100% SP + ≥Nh"; tier label (Rất thấp / Thấp / Trung bình / Khá / Đạt SP chờ time / Đạt KPI ✓) hiển thị dưới tên tiêu chí
    - Completion Rate: thực tế % vs target %
  - **Subjective table**: cột Tiêu chí | Slider | Điểm | Trọng số | Đóng góp
  - Dòng tổng: `objScore × obj% + subScore × sub% = badge`

**Tester card:**
- Banner vàng thay section Jira: "Tester — không tính điểm khách quan"
- Section B: 4 slider với labels tester (Chất lượng test case, Khả năng tìm bug)
- Section C: chỉ Subjective table + dòng tổng `subjectiveScore × 100%`

**BA card:**
- Banner tím thay section Jira: "BA — không tính điểm khách quan"
- Section B: 4 slider với labels BA (Giao tiếp & phản hồi stakeholder, Chất lượng yêu cầu & giải pháp, Tỉ lệ rework từ yêu cầu, Teamwork & phối hợp)
- Section C: chỉ Subjective table + dòng tổng `subjectiveScore × 100%`

### KpiTabResults.vue — Tab 4

Bảng phân bổ thưởng gồm: Tên | Level/Role badge | Điểm KQ | Điểm CQ | Điểm Tổng | **Hệ số** | **Điểm HS** | % Đóng góp | Thưởng

- Tester / BA: cột Điểm KQ hiển thị `—`, Jira section thay bằng banner màu tương ứng
- Hàng có điểm cao nhất được highlight xanh nhạt
- Đánh giá chi tiết từng người in riêng trang (break-before: page)

---

## Lưu ý triển khai

- State persist vào `localStorage` key `'kpi-bonus-state'`, auto-save qua `watch(state, deep: true)`
- `coefficient` và `role` là nullable khi load state cũ → dùng `?? 1` và `?? 'dev'` khi đọc
- Không thêm backend / Pinia — composables + local ref
- Format tiền: `Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })`
- Class `.print-inner` cho section cần in PDF
- Dynamic Tailwind class (badge màu) phải có trong `safelist` của `tailwind.config.js`
