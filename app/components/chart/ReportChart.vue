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

onMounted(async () => {
	await nextTick();

	new Chart(canvas.value, {
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
					font: {
						weight: 'bold',
					},
					formatter: (value, ctx) => {
						const sum = ctx.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
						const percentage = ((value * 100) / sum).toFixed(1) + '%';
						return `${value} / ${percentage}`;
					},
				},
			},
		},
	});
});
</script>
