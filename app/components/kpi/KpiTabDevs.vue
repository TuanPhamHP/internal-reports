<template>
	<div class="flex flex-col gap-4">
		<div v-if="state.devs.length === 0" class="text-center py-12 text-[#617289] dark:text-gray-400">
			<p class="text-sm">Chưa có dev nào. Quay lại Tab <strong>Cấu hình</strong> để thêm dev.</p>
		</div>
		<KpiDevCard
			v-for="dev in state.devs"
			:key="dev.id"
			:dev="dev"
			:all-devs="state.devs"
			:weights="state.weights"
			@update:dev="updateDev($event)"
			@remove="removeDev(dev.id)"
		/>
	</div>
</template>

<script setup lang="ts">
import type { KpiDev, KpiState } from '~/models/kpi';

const props = defineProps<{ state: KpiState }>();
const emit = defineEmits<{ 'update:state': [value: KpiState] }>();

function updateDev(updated: KpiDev) {
	emit('update:state', {
		...props.state,
		devs: props.state.devs.map(d => (d.id === updated.id ? updated : d)),
	});
}

function removeDev(id: string) {
	emit('update:state', { ...props.state, devs: props.state.devs.filter(d => d.id !== id) });
}
</script>
