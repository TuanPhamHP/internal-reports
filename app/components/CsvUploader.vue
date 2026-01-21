<template>
	<div class="fixed bottom-10 right-10 z-10 flex flex-col gap-4">
		<label for="csv-uploader" title="Import file csv"
			class="no-print block flex items-center justify-center text-white cursor-pointer bg-indigo-500 p-2 w-14 h-14 rounded-full">+</label>
		<input id="csv-uploader" class="no-print hidden" type="file" accept=".csv" @change="onFileChange" />
		<button
			class="no-print block flex items-center justify-center text-white cursor-pointer bg-indigo-500 p-2 w-14 h-14 rounded-full"
			@click="print">Print</button>
		<!-- <button
			class="no-print block flex items-center justify-center text-white cursor-pointer bg-indigo-500 p-2 w-14 h-14 rounded-full"
			@click="exportPdf">
			Export
		</button> -->
		<button
			class="no-print block flex items-center justify-center text-white cursor-pointer bg-indigo-500 p-2 w-14 h-14 rounded-full"
			@click="$router.push('/')">
			Home
		</button>
	</div>
</template>

<script setup>
import Papa from 'papaparse';

const emit = defineEmits(['parsed']);

function onFileChange(e) {
	const file = e.target.files[0];
	if (!file) return;

	Papa.parse(file, {
		header: true,
		skipEmptyLines: true,
		complete: result => {
			emit('parsed', result.data);
		},
	});
}

const print = () => {
	setTimeout(() => {
		window.print();
	}, 1000);
};
const exportPdf = async () => {
	const html2pdf = (await import('html2pdf.js')).default;
	html2pdf().from(document.getElementById('report')).save();
};
</script>
<style scoped>
@media print {
	@page {
		margin: 0mm;
		/* size: A4 landscape; */
	}

	.print-inner {
		break-after: page !important;
	}

	.no-print {
		display: none !important;
	}
}
</style>
