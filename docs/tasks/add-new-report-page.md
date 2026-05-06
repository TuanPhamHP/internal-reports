# Task: Thêm trang báo cáo mới

## Mô tả

Hướng dẫn tạo một loại báo cáo mới (ví dụ: báo cáo theo Sprint, báo cáo Bug, báo cáo Manager).

---

## Checklist

### 1. Tạo page

Tạo file `app/pages/reports/<ten-bao-cao>.vue`:

```vue
<template>
  <div>
    <CsvUploader @parsed="srcData = $event" />
    <NewReport v-if="srcData.length > 0" :data="srcData" />
    <div v-else class="flex items-center justify-center h-64 text-gray-400">
      Upload file CSV để xem báo cáo
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DevReportRow } from '~/models'
const srcData = ref<DevReportRow[]>([])
</script>
```

### 2. Tạo component báo cáo

Tạo file `app/components/reports/NewReport.vue`:

```vue
<script setup lang="ts">
import type { DevReportRow } from '~/models'

const props = defineProps<{ data: DevReportRow[] }>()

// Computed aggregations ở đây
</script>
```

### 3. Thêm link từ landing page

Trong `app/pages/index.vue`, thêm `<NuxtLink to="/reports/<ten-bao-cao>">`.

### 4. Nếu cần model riêng

Nếu báo cáo mới dùng CSV khác format (không phải Jira developer export):
- Tạo type mới trong `app/models/index.ts`
- Đặt tên rõ ràng: `SprintReportRow`, `BugReportRow`, ...

---

## Nguyên tắc

- **Không chia sẻ state** giữa các báo cáo — mỗi page có `srcData` ref độc lập
- **Tái sử dụng** `CsvUploader.vue` cho tất cả loại báo cáo
- **Tái sử dụng** `ReportChart.vue` cho bất kỳ doughnut/bar chart nào
- Nếu cần chart type khác (line, bar), tạo component riêng trong `app/components/chart/`
