<template>
	<div class="px-3 py-3 max-w-7xl mx-auto min-h-screen dark:bg-gray-950">
		<!-- Header -->
		<div class="mb-6 flex items-end justify-between gap-4 flex-wrap">
			<div>
				<h1 class="text-[28px] font-black text-[#111418] dark:text-white tracking-tight no-print">
					KPI Bonus Calculator
				</h1>
				<h1 class="text-[28px] text-center font-black text-[#111418] dark:text-white tracking-tight print-only">
					{{ state.project.name || 'Chưa có tên dự án' }}
				</h1>
				<p class="text-[#617289] dark:text-gray-400 text-sm mt-1 no-print">
					{{ state.project.name || 'Chưa có tên dự án' }}
					<span v-if="state.project.period"> — {{ state.project.period }}</span>
				</p>
			</div>
			<button @click="confirmReset" class="text-xs text-red-500 hover:underline no-print">Reset dữ liệu</button>
		</div>

		<!-- Tab navigation -->
		<div class="flex gap-1 mb-6 bg-[#f0f2f4] dark:bg-gray-800 p-1 rounded-xl w-fit no-print">
			<button
				v-for="tab in tabs"
				:key="tab.key"
				@click="activeTab = tab.key"
				class="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg transition-colors"
				:class="
					activeTab === tab.key
						? 'bg-white dark:bg-gray-700 text-[#111418] dark:text-white shadow-sm'
						: 'text-[#617289] dark:text-gray-400 hover:text-[#111418] dark:hover:text-white'
				"
			>
				<span v-if="tabStatus[tab.key as keyof typeof tabStatus]" class="text-green-500 text-xs leading-none">✓</span>
				{{ tab.label }}
			</button>
		</div>

		<!-- Tab content -->
		<client-only>
			<KpiTabConfig v-if="activeTab === 'config'" :state="state" @update:state="state = $event" />
			<KpiTabDevs v-else-if="activeTab === 'devs'" :state="state" @update:state="state = $event" />
			<KpiTabManager v-else-if="activeTab === 'manager'" :state="state" @update:state="state = $event" />
			<KpiTabResults
				v-else-if="activeTab === 'results'"
				:state="state"
				@export-json="exportJson"
				@import-json="importJson"
			/>
		</client-only>
	</div>
</template>

<script setup lang="ts">
	import { isConfigComplete, isDevsComplete, isManagerComplete } from '~/composables/useKpiCalculator';
	import { aggregateJiraFromRows, useKpiStore } from '~/composables/useKpiStore';
	import type { DevReportRow } from '~/models/index';

	const { state, resetState, exportJson, importJson } = useKpiStore();

	// Re-aggregate Jira data khi filter sprint/parent thay đổi.
	// Watch ở đây (owner của state) để tránh cycle props → emit → props.
	watch(
		() => state.value.selectedParents,
		selectedParents => {
			if (!state.value.rawCsvRows.length) return;
			const byAssignee = new Map<string, DevReportRow[]>();
			state.value.rawCsvRows.forEach((row: DevReportRow) => {
				if (!byAssignee.has(row.Assignee)) byAssignee.set(row.Assignee, []);
				byAssignee.get(row.Assignee)!.push(row);
			});
			state.value.devs = state.value.devs.map(dev => {
				const devRows = byAssignee.get(dev.name);
				if (!devRows) return dev;
				return { ...dev, jira: aggregateJiraFromRows(devRows, selectedParents) };
			});
		},
		{ deep: true },
	);

	const activeTab = ref<'config' | 'devs' | 'manager' | 'results'>('config');

	const tabs: { key: 'config' | 'devs' | 'manager' | 'results'; label: string }[] = [
		{ key: 'config', label: 'Cấu hình' },
		{ key: 'devs', label: 'Đánh giá Nhân sự' },
		{ key: 'manager', label: 'Đánh giá Quản lý' },
		{ key: 'results', label: 'Kết quả' },
	];

	const tabStatus = computed(() => ({
		config: isConfigComplete(state.value),
		devs: isDevsComplete(state.value),
		manager: isManagerComplete(state.value),
		results: true,
	}));

	function confirmReset() {
		if (confirm('Reset toàn bộ dữ liệu KPI? Hành động này không thể hoàn tác.')) {
			resetState();
		}
	}
</script>

<style scoped>
	.print-only {
		display: none;
	}
	@media print {
		.no-print {
			display: none !important;
		}
		.print-only {
			display: block;
		}
	}
</style>
