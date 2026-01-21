<template>
	<div class="px-3 py-3 max-w-7xl mx-auto">
		<CsvUploader @parsed="getData" />
		<client-only>

			<DevReport :data="srcData" />
		</client-only>
	</div>
</template>

<script setup lang="ts">
import CsvUploader from '~/components/CsvUploader.vue';
import DevReport from '~/components/reports/DevReport.vue';
import type { DevReportRow } from '~/models/index';
import { ref } from 'vue';

const srcData = ref<DevReportRow[]>([]);
const getData = (data: any) => {
	srcData.value = data as DevReportRow[];
	console.log(data);
};
</script>
<style scoped>
@media print {
	@page {
		margin: 0mm;
		/* size: A4 landscape; */
		layout: portrait;
	}

	.print-inner {
		break-after: page !important;
	}

	.no-print {
		display: none !important;
	}
}
</style>
