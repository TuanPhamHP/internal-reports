<template>
	<div class="bg-white dark:bg-gray-800 rounded-xl border border-[#dbe0e6] dark:border-gray-700 overflow-hidden">
		<!-- Header -->
		<div
			class="px-5 py-4 flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
			@click="open = !open"
		>
			<div
				class="size-9 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 flex items-center justify-center font-black text-sm shrink-0"
			>
				{{ dev.name ? dev.name.charAt(0).toUpperCase() : '?' }}
			</div>
			<div class="flex-1 min-w-0">
				<p class="font-bold text-sm text-[#111418] dark:text-white truncate capitalize">
					{{ dev.name || 'Dev chưa đặt tên' }}
				</p>
				<div class="flex items-center gap-1.5">
					<span
						class="text-xs font-semibold px-1.5 py-0.5 rounded-full capitalize"
						:class="
							dev.level === 'senior'
								? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
								: dev.level === 'middle'
									? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
									: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
						"
						>{{ dev.level }}</span
					>
					<span
						v-if="dev.role === 'tester'"
						class="text-xs font-semibold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
						>Tester</span
					>
					<span
						v-if="dev.role === 'ba'"
						class="text-xs font-semibold px-1.5 py-0.5 rounded-full bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300"
						>BA</span
					>
					<span
						v-if="dev.role === 'designer'"
						class="text-xs font-semibold px-1.5 py-0.5 rounded-full bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300"
						>Designer</span
					>
				</div>
			</div>
			<div v-if="allDevs.length > 0" class="shrink-0 text-right">
				<p class="text-xs text-[#617289] dark:text-gray-400">Điểm tổng</p>
				<p class="font-black text-base" :class="scoreColorClass(totalScore)">
					{{ totalScore.toFixed(1) }}
				</p>
			</div>
			<span class="text-[#617289] dark:text-gray-400 text-lg select-none">{{ open ? '▲' : '▼' }}</span>
		</div>

		<!-- Body -->
		<div v-if="open" class="border-t border-[#dbe0e6] dark:border-gray-700 px-5 py-5 flex flex-col gap-6">
			<!-- A: Jira data — dev, designer & ba -->
			<div v-if="dev.role !== 'tester'">
				<h4 class="text-xs font-bold text-[#617289] dark:text-gray-400 uppercase tracking-wider mb-3">
					A — Dữ liệu Jira
				</h4>
				<div class="grid grid-cols-2 md:grid-cols-3 gap-3">
					<div v-for="field in jiraFields" :key="field.key" class="flex flex-col gap-1">
						<label class="text-xs text-[#617289] dark:text-gray-400">{{ field.label }}</label>
						<input
							:value="dev.jira[field.key as keyof typeof dev.jira]"
							@input="updateJira(field.key, ($event.target as HTMLInputElement).value)"
							type="number"
							min="0"
							step="0.01"
							class="border border-[#dbe0e6] dark:border-gray-600 rounded-lg px-3 py-1.5 text-sm bg-white dark:bg-gray-900 text-[#111418] dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
						/>
					</div>
				</div>
				<!-- Computed metrics -->
				<div class="mt-3 grid grid-cols-3 gap-3">
					<div class="bg-[#f8f9fa] dark:bg-gray-900/50 rounded-lg p-3 text-center">
						<p class="text-xs text-[#617289] dark:text-gray-400">SP Efficiency</p>
						<p class="text-sm font-bold text-[#111418] dark:text-white">{{ spEfficiency }} SP/h</p>
					</div>
					<div class="bg-[#f8f9fa] dark:bg-gray-900/50 rounded-lg p-3 text-center">
						<p class="text-xs text-[#617289] dark:text-gray-400">Est. Accuracy</p>
						<p class="text-sm font-bold text-[#111418] dark:text-white">{{ estimationAccuracy }}%</p>
					</div>
					<div class="bg-[#f8f9fa] dark:bg-gray-900/50 rounded-lg p-3 text-center">
						<p class="text-xs text-[#617289] dark:text-gray-400">Completion</p>
						<p class="text-sm font-bold text-[#111418] dark:text-white">{{ completionRate }}%</p>
					</div>
				</div>
			</div>
			<!-- Tester: không có Jira data -->
			<div
				v-else
				class="rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 px-4 py-3 text-xs text-amber-700 dark:text-amber-300"
			>
				Tester — không tính điểm khách quan (Jira). Điểm tổng = 100% đánh giá chủ quan.
			</div>

			<!-- B: Subjective -->
			<div>
				<h4 class="text-xs font-bold text-[#617289] dark:text-gray-400 uppercase tracking-wider mb-3">
					{{ dev.role === 'tester' ? 'Đánh giá chủ quan' : 'B — Đánh giá chủ quan' }}
				</h4>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-5">
					<KpiSlider
						label="Phản hồi & giao tiếp"
						description="Tốc độ và chất lượng phản hồi trong công việc"
						:model-value="dev.subjective.response"
						:note="dev.subjective.notes.response"
						@update:model-value="updateSubjective('response', $event)"
						@update:note="updateNote('response', $event)"
					/>
					<KpiSlider
						:label="dev.role === 'tester' ? 'Chất lượng test case' : dev.role === 'ba' ? 'Chất lượng yêu cầu & giải pháp' : 'Chất lượng code'"
						:description="
							dev.role === 'tester'
								? 'Mức độ rõ ràng, đầy đủ và chính xác của test case'
								: dev.role === 'ba'
									? 'Tính rõ ràng, đầy đủ và khả thi của tài liệu yêu cầu'
									: 'Code review, readability, best practices'
						"
						:model-value="dev.subjective.quality"
						:note="dev.subjective.notes.quality"
						@update:model-value="updateSubjective('quality', $event)"
						@update:note="updateNote('quality', $event)"
					/>
					<KpiSlider
						:label="dev.role === 'tester' ? 'Khả năng tìm bug' : dev.role === 'ba' ? 'Tỉ lệ rework từ yêu cầu' : 'Bug rate'"
						:description="
							dev.role === 'tester'
								? '10 = phát hiện nhiều bug quan trọng; 1 = bỏ sót nhiều bug'
								: dev.role === 'ba'
									? '10 = ít rework; 1 = yêu cầu thường xuyên phải làm lại'
									: '10 = không có bug; 1 = nhiều bug nghiêm trọng'
						"
						:model-value="dev.subjective.bugRate"
						:note="dev.subjective.notes.bugRate"
						@update:model-value="updateSubjective('bugRate', $event)"
						@update:note="updateNote('bugRate', $event)"
					/>
					<KpiSlider
						label="Teamwork"
						description="Hỗ trợ đồng đội, tinh thần hợp tác"
						:model-value="dev.subjective.teamwork"
						:note="dev.subjective.notes.teamwork"
						@update:model-value="updateSubjective('teamwork', $event)"
						@update:note="updateNote('teamwork', $event)"
					/>
				</div>
			</div>

			<!-- Score formula breakdown -->
			<div v-if="allDevs.length > 0" class="border-t border-[#dbe0e6] dark:border-gray-700 pt-4 flex flex-col gap-5">
				<h4 class="text-xs font-bold text-[#617289] dark:text-gray-400 uppercase tracking-wider">
					Công thức tính điểm
				</h4>

				<!-- Objective breakdown table — dev, designer & ba -->
				<div v-if="dev.role !== 'tester'">
					<p class="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-2">
						A — Điểm khách quan ({{ weights.objective }}%)
					</p>
					<div class="overflow-x-auto">
						<table class="w-full text-xs border-collapse">
							<thead>
								<tr class="bg-[#f0f2f4] dark:bg-gray-900 text-[#617289] dark:text-gray-300">
									<th class="px-2 py-1.5 text-left font-semibold">Tiêu chí</th>
									<th class="px-2 py-1.5 text-right font-semibold">Thực tế</th>
									<th class="px-2 py-1.5 text-right font-semibold">Target</th>
									<th class="px-2 py-1.5 text-right font-semibold">Điểm</th>
									<th class="px-2 py-1.5 text-right font-semibold">Trọng số</th>
									<th class="px-2 py-1.5 text-right font-semibold">Đóng góp</th>
								</tr>
							</thead>
							<tbody class="divide-y divide-[#dbe0e6] dark:divide-gray-700">
								<tr class="text-[#111418] dark:text-white">
									<td class="px-2 py-1.5">Story Points</td>
									<td class="px-2 py-1.5 text-right">{{ objBd.actualSp.toFixed(1) }}</td>
									<td class="px-2 py-1.5 text-right">{{ objBd.spTarget }}</td>
									<td class="px-2 py-1.5 text-right font-bold" :class="scoreColorClass(objBd.spScore)">
										{{ objBd.spScore.toFixed(1) }}
									</td>
									<td class="px-2 py-1.5 text-right">{{ weights.objSp }}%</td>
									<td class="px-2 py-1.5 text-right font-semibold">
										{{ ((objBd.spScore * weights.objSp) / 100).toFixed(1) }}
									</td>
								</tr>
								<tr class="text-[#111418] dark:text-white">
									<td class="px-2 py-1.5">
										<div>SP Efficiency</div>
										<div
											class="text-[10px] mt-0.5"
											:class="
												objBd.effLabel === 'Đạt KPI ✓'
													? 'text-green-600 dark:text-green-400 font-semibold'
													: 'text-[#617289] dark:text-gray-400'
											"
										>
											{{ objBd.effLabel }}
										</div>
									</td>
									<td class="px-2 py-1.5 text-right">
										{{ (objBd.spPct * 100).toFixed(0) }}%
										<div class="text-[10px] text-[#617289] dark:text-gray-400">
											{{ objBd.actualTimeH.toFixed(0) }}h logged
										</div>
									</td>
									<td class="px-2 py-1.5 text-right">
										≥100% SP
										<div class="text-[10px] text-[#617289] dark:text-gray-400">+≥{{ objBd.timeTarget }}h</div>
									</td>
									<td class="px-2 py-1.5 text-right font-bold" :class="scoreColorClass(objBd.effScore)">
										{{ objBd.effScore.toFixed(1) }}
									</td>
									<td class="px-2 py-1.5 text-right">{{ weights.objEfficiency }}%</td>
									<td class="px-2 py-1.5 text-right font-semibold">
										{{ ((objBd.effScore * weights.objEfficiency) / 100).toFixed(1) }}
									</td>
								</tr>
								<tr class="text-[#111418] dark:text-white">
									<td class="px-2 py-1.5">Completion Rate</td>
									<td class="px-2 py-1.5 text-right">{{ objBd.actualCompRate.toFixed(1) }}%</td>
									<td class="px-2 py-1.5 text-right">{{ objBd.compTarget }}%</td>
									<td class="px-2 py-1.5 text-right font-bold" :class="scoreColorClass(objBd.compScore)">
										{{ objBd.compScore.toFixed(1) }}
									</td>
									<td class="px-2 py-1.5 text-right">{{ weights.objCompletion }}%</td>
									<td class="px-2 py-1.5 text-right font-semibold">
										{{ ((objBd.compScore * weights.objCompletion) / 100).toFixed(1) }}
									</td>
								</tr>
							</tbody>
							<tfoot>
								<tr class="bg-indigo-50 dark:bg-indigo-900/20 font-bold text-indigo-700 dark:text-indigo-300">
									<td colspan="5" class="px-2 py-1.5 text-right">Điểm khách quan =</td>
									<td class="px-2 py-1.5 text-right text-base">{{ objectiveScore.toFixed(1) }}</td>
								</tr>
							</tfoot>
						</table>
					</div>
				</div>
			</div>

			<!-- Subjective breakdown table -->
			<div>
				<p class="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-2">
					<template v-if="dev.role === 'tester'">Điểm chủ quan (100%)</template>
					<template v-else>B — Điểm chủ quan ({{ weights.subjective }}%)</template>
				</p>
				<div class="overflow-x-auto">
					<table class="w-full text-xs border-collapse">
						<thead>
							<tr class="bg-[#f0f2f4] dark:bg-gray-900 text-[#617289] dark:text-gray-300">
								<th class="px-2 py-1.5 text-left font-semibold">Tiêu chí</th>
								<th class="px-2 py-1.5 text-right font-semibold">Slider (1–10)</th>
								<th class="px-2 py-1.5 text-right font-semibold">Điểm</th>
								<th class="px-2 py-1.5 text-right font-semibold">Trọng số</th>
								<th class="px-2 py-1.5 text-right font-semibold">Đóng góp</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-[#dbe0e6] dark:divide-gray-700">
							<tr v-for="row in subRows" :key="row.key" class="text-[#111418] dark:text-white">
								<td class="px-2 py-1.5">{{ row.label }}</td>
								<td class="px-2 py-1.5 text-right">{{ row.raw }}</td>
								<td class="px-2 py-1.5 text-right font-bold" :class="scoreColorClass(row.score)">
									{{ row.score.toFixed(1) }}
								</td>
								<td class="px-2 py-1.5 text-right">{{ row.weight }}%</td>
								<td class="px-2 py-1.5 text-right font-semibold">{{ ((row.score * row.weight) / 100).toFixed(1) }}</td>
							</tr>
						</tbody>
						<tfoot>
							<tr class="bg-purple-50 dark:bg-purple-900/20 font-bold text-purple-700 dark:text-purple-300">
								<td colspan="4" class="px-2 py-1.5 text-right">Điểm chủ quan =</td>
								<td class="px-2 py-1.5 text-right text-base">{{ subjectiveScore.toFixed(1) }}</td>
							</tr>
						</tfoot>
					</table>
				</div>
			</div>

			<!-- Total formula -->
			<div class="bg-[#f8f9fa] dark:bg-gray-900/50 rounded-lg px-4 py-3">
				<p class="text-xs text-[#617289] dark:text-gray-400 mb-1.5">Điểm tổng</p>
				<div v-if="dev.role === 'tester'" class="flex items-center gap-2 flex-wrap text-sm">
					<span class="text-[#617289] dark:text-gray-400">Chủ quan</span>
					<span class="text-purple-600 dark:text-purple-400 font-semibold">{{ subjectiveScore.toFixed(1) }}</span>
					<span class="text-[#617289] dark:text-gray-400">× 100%</span>
					<span class="text-[#617289] dark:text-gray-400">=</span>
					<span class="text-2xl font-black px-3 py-1 rounded-xl" :class="scoreBgClass(totalScore)">{{
						totalScore.toFixed(1)
					}}</span>
				</div>
				<div v-else class="flex items-center gap-2 flex-wrap text-sm">
					<span class="text-indigo-600 dark:text-indigo-400 font-semibold">{{ objectiveScore.toFixed(1) }}</span>
					<span class="text-[#617289] dark:text-gray-400">× {{ weights.objective }}%</span>
					<span class="text-[#617289] dark:text-gray-400">+</span>
					<span class="text-purple-600 dark:text-purple-400 font-semibold">{{ subjectiveScore.toFixed(1) }}</span>
					<span class="text-[#617289] dark:text-gray-400">× {{ weights.subjective }}%</span>
					<span class="text-[#617289] dark:text-gray-400">=</span>
					<span class="text-2xl font-black px-3 py-1 rounded-xl" :class="scoreBgClass(totalScore)">{{
						totalScore.toFixed(1)
					}}</span>
				</div>
			</div>
		</div>

		<!-- Remove -->
		<div class="flex justify-end">
			<button @click="$emit('remove')" class="text-xs text-red-500 hover:underline">Xóa dev này</button>
		</div>
	</div>
</template>

<script setup lang="ts">
	import {
		calcEstimationAccuracy,
		calcObjBreakdown,
		calcObjectiveScore,
		calcSubjectiveScore,
		calcDevTotalScore,
		scoreColorClass,
		scoreBgClass,
	} from '~/composables/useKpiCalculator';
	import { useKpiTargets } from '~/composables/useKpiTargets';
	import type { KpiDev, KpiWeights } from '~/models/kpi';

	const props = defineProps<{
		dev: KpiDev;
		allDevs: KpiDev[];
		weights: KpiWeights;
	}>();
	const emit = defineEmits<{
		'update:dev': [value: KpiDev];
		remove: [];
	}>();

	const { getTargetsForRole } = useKpiTargets();
	const targets = computed(() => getTargetsForRole(props.dev.role));

	const open = ref(false);

	const jiraFields = [
		{ key: 'sp', label: 'Story Points Done' },
		{ key: 'timeSpentHours', label: 'Time Spent (giờ)' },
		{ key: 'spEstimate', label: 'SP Estimate TB' },
		{ key: 'spActual', label: 'SP Actual TB' },
		{ key: 'totalTasks', label: 'Tổng tasks' },
		{ key: 'doneTasks', label: 'Tasks Done' },
	];

	const spEfficiency = computed(() =>
		props.dev.jira.timeSpentHours > 0 ? (props.dev.jira.sp / props.dev.jira.timeSpentHours).toFixed(2) : '0',
	);
	const estimationAccuracy = computed(() => calcEstimationAccuracy(props.dev.jira).toFixed(1));
	const completionRate = computed(() =>
		props.dev.jira.totalTasks > 0 ? Math.round((props.dev.jira.doneTasks / props.dev.jira.totalTasks) * 100) : 0,
	);
	const objectiveScore = computed(() => calcObjectiveScore(props.dev, props.allDevs, props.weights, targets.value));
	const subjectiveScore = computed(() => calcSubjectiveScore(props.dev, props.weights));
	const totalScore = computed(() => calcDevTotalScore(props.dev, props.allDevs, props.weights, targets.value));

	const objBd = computed(() => calcObjBreakdown(props.dev, targets.value));
	const subRows = computed(() => {
		const s = props.dev.subjective;
		const w = props.weights;
		const role = props.dev.role;
		return [
			{
				key: 'response',
				label: role === 'ba' ? 'Giao tiếp & phản hồi stakeholder'
					: role === 'designer' ? 'Tiến độ & đúng hẹn'
					: 'Phản hồi & giao tiếp',
				raw: s.response,
				score: ((s.response - 1) / 9) * 100,
				weight: w.subResponse,
			},
			{
				key: 'quality',
				label: role === 'tester' ? 'Chất lượng test case'
					: role === 'ba' ? 'Chất lượng yêu cầu & giải pháp'
					: role === 'designer' ? 'Chất lượng thiết kế'
					: 'Chất lượng code',
				raw: s.quality,
				score: ((s.quality - 1) / 9) * 100,
				weight: w.subQuality,
			},
			{
				key: 'bugRate',
				label: role === 'tester' ? 'Khả năng tìm bug'
					: role === 'ba' ? 'Tỉ lệ rework từ yêu cầu'
					: role === 'designer' ? 'Chất lượng handoff'
					: 'Bug rate',
				raw: s.bugRate,
				score: ((s.bugRate - 1) / 9) * 100,
				weight: w.subBugRate,
			},
			{
				key: 'teamwork',
				label: role === 'designer' ? 'Sáng tạo & phối hợp' : 'Teamwork & phối hợp',
				raw: s.teamwork,
				score: ((s.teamwork - 1) / 9) * 100,
				weight: w.subTeamwork,
			},
		];
	});

	function updateJira(key: string, raw: string) {
		emit('update:dev', {
			...props.dev,
			jira: { ...props.dev.jira, [key]: parseFloat(raw) || 0 },
		});
	}

	function updateSubjective(key: keyof Omit<KpiDev['subjective'], 'notes'>, val: number) {
		emit('update:dev', {
			...props.dev,
			subjective: { ...props.dev.subjective, [key]: val },
		});
	}

	function updateNote(key: keyof KpiDev['subjective']['notes'], val: string) {
		emit('update:dev', {
			...props.dev,
			subjective: {
				...props.dev.subjective,
				notes: { ...props.dev.subjective.notes, [key]: val },
			},
		});
	}
</script>
