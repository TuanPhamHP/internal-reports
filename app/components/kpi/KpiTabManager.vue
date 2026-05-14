<template>
	<div class="flex flex-col gap-6">
		<div
			v-for="group in groups"
			:key="group.key"
			class="bg-white dark:bg-gray-800 rounded-xl border border-[#dbe0e6] dark:border-gray-700 overflow-hidden"
		>
			<div class="px-6 py-4 border-b border-[#dbe0e6] dark:border-gray-700 flex items-center justify-between">
				<div>
					<h3 class="font-bold text-[#111418] dark:text-white">{{ group.title }}</h3>
					<p class="text-xs text-[#617289] dark:text-gray-400 mt-0.5">
						Trọng số: {{ state.weights[group.weightKey as keyof typeof state.weights] }}%
					</p>
				</div>
				<span
					class="text-lg font-black px-3 py-1 rounded-xl"
					:class="scoreBgClass(groupAvg(group.key))"
				>
					{{ groupAvg(group.key).toFixed(1) }}
				</span>
			</div>
			<div class="px-6 py-5 grid grid-cols-1 md:grid-cols-3 gap-6">
				<KpiSlider
					v-for="(criterion, idx) in group.criteria"
					:key="idx"
					:label="criterion"
					:model-value="managerGroup(group.key)[`score${idx + 1}` as 'score1' | 'score2' | 'score3']"
					:note="idx === 0 ? managerGroup(group.key).note : undefined"
					@update:model-value="updateScore(group.key, idx + 1, $event)"
					@update:note="updateNote(group.key, $event)"
				/>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { scoreBgClass } from '~/composables/useKpiCalculator';
import type { KpiState, KpiManagerGroup } from '~/models/kpi';

const props = defineProps<{ state: KpiState }>();
const emit = defineEmits<{ 'update:state': [value: KpiState] }>();

const groups = [
	{
		key: 'organization',
		weightKey: 'mgrOrganization',
		title: 'Nhóm 1 — Đảm bảo tổ chức',
		criteria: ['Phân công công việc hợp lý', 'Theo dõi tiến độ sát sao', 'Duy trì quy trình làm việc rõ ràng'],
	},
	{
		key: 'schedule',
		weightKey: 'mgrSchedule',
		title: 'Nhóm 2 — Đảm bảo tiến độ',
		criteria: ['Tỉ lệ sprint đạt mục tiêu', 'Xử lý rủi ro/blocker kịp thời', 'Dự báo & điều phối resource'],
	},
	{
		key: 'quality',
		weightKey: 'mgrQuality',
		title: 'Nhóm 3 — Đảm bảo chất lượng',
		criteria: ['Tỉ lệ bug production thấp', 'Process review & QA chặt chẽ', 'Cải tiến quy trình trong kỳ'],
	},
	{
		key: 'teamDev',
		weightKey: 'mgrTeamDev',
		title: 'Nhóm 4 — Phát triển team',
		criteria: ['Mentoring & hỗ trợ dev', 'Môi trường làm việc tích cực', 'Đào tạo / knowledge sharing'],
	},
];

function managerGroup(key: string): KpiManagerGroup {
	return props.state.manager[key as keyof typeof props.state.manager];
}

function groupAvg(key: string): number {
	const g = managerGroup(key);
	const avg = (g.score1 + g.score2 + g.score3) / 3;
	return ((avg - 1) / 9) * 100;
}

function updateScore(key: string, scoreIdx: number, val: number) {
	emit('update:state', {
		...props.state,
		manager: {
			...props.state.manager,
			[key]: { ...managerGroup(key), [`score${scoreIdx}`]: val },
		},
	});
}

function updateNote(key: string, val: string) {
	emit('update:state', {
		...props.state,
		manager: {
			...props.state.manager,
			[key]: { ...managerGroup(key), note: val },
		},
	});
}
</script>
