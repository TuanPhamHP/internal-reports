<template>
	<div class="px-3 py-3 max-w-7xl mx-auto">
		<p class="text-center text-black-700 text-2xl font-bold mt-10">Hệ thống báo cáo nhà làm</p>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
			<div class="bg-neutral-primary-soft block p-6 border rounded border-default rounded-base shadow-xs">
				<svg
					class="w-7 h-7 mb-3 text-body"
					aria-hidden="true"
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					fill="none"
					viewBox="0 0 24 24"
				>
					<path
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M10 21v-9m3-4H7.5a2.5 2.5 0 1 1 0-5c1.5 0 2.875 1.25 3.875 2.5M14 21v-9m-9 0h14v8a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-8ZM4 8h16a1 1 0 0 1 1 1v3H3V9a1 1 0 0 1 1-1Zm12.155-5c-3 0-5.5 5-5.5 5h5.5a2.5 2.5 0 0 0 0-5Z"
					/>
				</svg>
				<h5 class="mb-2 text-2xl font-semibold tracking-tight text-heading">Báo cáo của Developers</h5>
				<p class="mb-3 text-body">Báo cáo hiệu suất hàng tháng từ Jira CSV</p>
				<button
					@click="$router.push('/reports/developers')"
					class="flex font-medium bg-indigo-600 text-white w-fit p-2 rounded items-center hover:bg-indigo-700 transition-colors"
				>
					Xem báo cáo
					<svg
						class="w-4 h-4 ms-2"
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						fill="none"
						viewBox="0 0 24 24"
					>
						<path
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M18 14v4.833A1.166 1.166 0 0 1 16.833 20H5.167A1.167 1.167 0 0 1 4 18.833V7.167A1.166 1.166 0 0 1 5.167 6h4.618m4.447-2H20v5.768m-7.889 2.121 7.778-7.778"
						/>
					</svg>
				</button>
			</div>

			<div class="bg-neutral-primary-soft block p-6 border rounded border-default rounded-base shadow-xs">
				<svg
					class="w-7 h-7 mb-3 text-indigo-500"
					aria-hidden="true"
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					fill="none"
					viewBox="0 0 24 24"
				>
					<path
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
					/>
				</svg>
				<h5 class="mb-2 text-2xl font-semibold tracking-tight text-heading">KPI Bonus Calculator</h5>
				<p class="mb-3 text-body">Tính thưởng dự án theo KPI — hỗ trợ import Jira CSV</p>
				<button
					@click="$router.push('/reports/kpi-bonus')"
					class="flex font-medium bg-indigo-600 text-white w-fit p-2 rounded items-center hover:bg-indigo-700 transition-colors"
				>
					Tính KPI
					<svg
						class="w-4 h-4 ms-2"
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						fill="none"
						viewBox="0 0 24 24"
					>
						<path
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M18 14v4.833A1.166 1.166 0 0 1 16.833 20H5.167A1.167 1.167 0 0 1 4 18.833V7.167A1.166 1.166 0 0 1 5.167 6h4.618m4.447-2H20v5.768m-7.889 2.121 7.778-7.778"
						/>
					</svg>
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import CsvUploader from '../components/CsvUploader.vue';
	import DevReport from '../components/reports/DevReport.vue';
	import type { DevReportRow } from '../models/index';
	import { ref } from 'vue';

	const srcData = ref<DevReportRow[]>([]);
	const getData = (data: any) => {
		srcData.value = data as DevReportRow[];
		console.log(data);
	};

	const exportPdf = async () => {
		const html2pdf = (await import('html2pdf.js')).default;
		html2pdf().from(document.getElementById('report')).save();
	};
</script>
