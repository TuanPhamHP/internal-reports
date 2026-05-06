<template>
	<client-only>
		<canvas ref="canvas"></canvas>
	</client-only>
</template>

<script setup>
import { Chart } from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const props = defineProps({
	labels: Array,
	values: Array,
});

const canvas = ref(null);
let chartInstance = null;

onMounted(async () => {
	await nextTick();

	chartInstance = new Chart(canvas.value, {
		type: 'doughnut',
		plugins: [ChartDataLabels],
		data: {
			labels: props.labels,
			datasets: [
				{
					label: 'Weekly Data',
					data: props.values,
				},
			],
		},
		options: {
			plugins: {
				legend: {
					position: 'bottom',
					align: 'center',
				},
				datalabels: {
					color: '#fff',
					font: { weight: 'bold' },
					formatter: (value, ctx) => {
						const sum = ctx.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
						return `${value} / ${((value * 100) / sum).toFixed(1)}%`;
					},
				},
			},
		},
	});

	const beforePrint = () => chartInstance?.resize(210, 210);
	const afterPrint = () => chartInstance?.resize();

	window.addEventListener('beforeprint', beforePrint);
	window.addEventListener('afterprint', afterPrint);

	onUnmounted(() => {
		window.removeEventListener('beforeprint', beforePrint);
		window.removeEventListener('afterprint', afterPrint);
		chartInstance?.destroy();
	});
});
</script>
