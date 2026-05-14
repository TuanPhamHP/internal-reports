<template>
	<div id="kpi-results" class="flex flex-col gap-8">
		<!-- Score chart -->
		<div
			class="bg-white dark:bg-gray-800 rounded-xl border border-[#dbe0e6] dark:border-gray-700 overflow-hidden print-inner my-3"
		>
			<div class="px-6 py-4 border-b border-[#dbe0e6] dark:border-gray-700">
				<h3 class="font-bold text-[#111418] dark:text-white">Biểu đồ điểm</h3>
			</div>
			<div class="px-6 py-5 flex flex-col gap-3">
				<div v-for="r in results.devResults" :key="r.dev.id" class="flex items-center gap-3">
					<span class="text-sm font-semibold w-28 truncate text-[#111418] dark:text-white">{{ r.dev.name }}</span>
					<div class="flex-1 bg-[#f0f2f4] dark:bg-gray-700 h-5 rounded-full overflow-hidden">
						<div
							class="h-full rounded-full transition-all flex items-center pl-2"
							:class="scoreBarClass(r.totalScore)"
							:style="{ width: Math.max(r.totalScore, 2) + '%' }"
						>
							<span class="text-[10px] font-bold text-white">{{ r.totalScore.toFixed(1) }}</span>
						</div>
					</div>
					<span class="text-xs w-10 text-right text-[#617289] dark:text-gray-400">
						{{ r.dev.level }}
					</span>
				</div>
				<!-- Manager bar -->
				<div class="flex items-center gap-3 mt-2 pt-2 border-t border-[#dbe0e6] dark:border-gray-700">
					<span class="text-sm font-semibold w-28 truncate text-[#111418] dark:text-white">
						{{ state.project.managerName || 'Quản lý' }}
					</span>
					<div class="flex-1 bg-[#f0f2f4] dark:bg-gray-700 h-5 rounded-full overflow-hidden">
						<div
							class="h-full rounded-full transition-all flex items-center pl-2"
							:class="scoreBarClass(results.managerResult.totalScore)"
							:style="{ width: Math.max(results.managerResult.totalScore, 2) + '%' }"
						>
							<span class="text-[10px] font-bold text-white">{{ results.managerResult.totalScore.toFixed(1) }}</span>
						</div>
					</div>
					<span class="text-xs w-10 text-right text-[#617289] dark:text-gray-400">Mgr</span>
				</div>
			</div>
		</div>

		<!-- Dev bonus table -->
		<div
			class="bg-white dark:bg-gray-800 rounded-xl border border-[#dbe0e6] dark:border-gray-700 overflow-hidden print-inner"
		>
			<div class="px-6 py-4 border-b border-[#dbe0e6] dark:border-gray-700">
				<h3 class="font-bold text-[#111418] dark:text-white">Phân bổ thưởng Devs</h3>
				<p class="text-xs text-[#617289] dark:text-gray-400 mt-0.5 no-print">
					Tổng pool devs: {{ formatVnd(totalDevPool) }}
				</p>
			</div>
			<div class="overflow-x-auto">
				<table class="w-full text-left border-collapse">
					<thead>
						<tr class="bg-[#f8f9fa] dark:bg-gray-900 border-b border-[#dbe0e6] dark:border-gray-700">
							<th class="px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#617289] dark:text-gray-400">
								Tên
							</th>
							<th
								class="px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#617289] dark:text-gray-400 text-center"
							>
								Level
							</th>
							<th
								class="px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#617289] dark:text-gray-400 text-center"
							>
								Điểm KQ
							</th>
							<th
								class="px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#617289] dark:text-gray-400 text-center"
							>
								Điểm CQ
							</th>
							<th
								class="px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#617289] dark:text-gray-400 text-center"
							>
								Điểm Tổng
							</th>
							<th
								class="px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#617289] dark:text-gray-400 text-center"
							>
								Hệ số
							</th>
							<th
								class="px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#617289] dark:text-gray-400 text-center"
							>
								Điểm HS
							</th>
							<th
								class="px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#617289] dark:text-gray-400 text-center"
							>
								% Đóng góp
							</th>
							<th
								class="px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#617289] dark:text-gray-400 text-right no-print"
							>
								Thưởng
							</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-[#dbe0e6] dark:divide-gray-700">
						<tr
							v-for="r in sortedDevResults"
							:key="r.dev.id"
							class="transition-colors"
							:class="
								r.dev.id === topDev?.dev.id
									? 'bg-green-50 dark:bg-green-900/10'
									: 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
							"
						>
							<td class="px-5 py-3 font-semibold text-sm text-[#111418] dark:text-white">{{ r.dev.name }}</td>
							<td class="px-5 py-3 text-center">
								<div class="flex items-center justify-center gap-1">
									<span
										class="text-xs font-semibold px-1.5 py-0.5 rounded-full capitalize"
										:class="
											r.dev.level === 'senior'
												? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
												: r.dev.level === 'middle'
													? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
													: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
										"
										>{{ r.dev.level }}</span
									>
									<span
										v-if="r.dev.role === 'tester'"
										class="text-xs font-semibold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
										>Tester</span
									>
								</div>
							</td>
							<td class="px-5 py-3 text-center text-sm font-medium text-[#111418] dark:text-white">
								{{ r.dev.role === 'tester' ? '—' : r.objectiveScore.toFixed(1) }}
							</td>
							<td class="px-5 py-3 text-center text-sm font-medium text-[#111418] dark:text-white">
								{{ r.subjectiveScore.toFixed(1) }}
							</td>
							<td class="px-5 py-3 text-center">
								<span class="text-sm font-bold" :class="scoreColorClass(r.totalScore)">
									{{ r.totalScore.toFixed(1) }}
								</span>
							</td>
							<td class="px-5 py-3 text-center text-sm text-[#617289] dark:text-gray-400">
								×{{ r.dev.coefficient.toFixed(1) }}
							</td>
							<td class="px-5 py-3 text-center">
								<span class="text-sm font-bold" :class="scoreColorClass(r.weightedScore)">
									{{ r.weightedScore.toFixed(1) }}
								</span>
							</td>
							<td class="px-5 py-3 text-center text-sm font-medium text-[#111418] dark:text-white">
								{{ r.contribution.toFixed(1) }}%
							</td>
							<td class="px-5 py-3 text-right text-sm font-bold text-indigo-600 dark:text-indigo-400 no-print">
								{{ formatVnd(r.bonusAmount) }}
							</td>
						</tr>
					</tbody>
					<tfoot class="no-print">
						<tr class="bg-[#f8f9fa] dark:bg-gray-900 border-t-2 border-[#dbe0e6] dark:border-gray-700 font-bold">
							<td class="px-5 py-3 text-sm text-[#111418] dark:text-white" colspan="7">Tổng</td>
							<td class="px-5 py-3 text-center text-sm text-[#111418] dark:text-white">100%</td>
							<td class="px-5 py-3 text-right text-sm text-indigo-600 dark:text-indigo-400">
								{{ formatVnd(totalDevPool) }}
							</td>
						</tr>
					</tfoot>
				</table>
			</div>
		</div>

		<!-- Individual dev evaluations -->
		<div v-if="sortedDevResults.length" class="flex flex-col gap-6 page-break">
			<h3 class="text-[20px] font-bold text-[#111418] dark:text-white">Đánh giá chi tiết từng thành viên</h3>

			<!-- Manager card -->
			<div class="bg-white dark:bg-gray-800 rounded-xl border border-[#dbe0e6] dark:border-gray-700 p-6 print-inner">
				<div class="flex items-start justify-between gap-4">
					<div>
						<h3 class="font-bold text-[#111418] dark:text-white">
							Quản lý — {{ state.project.managerName || 'Chưa có tên' }}
						</h3>
						<p class="text-xs text-[#617289] dark:text-gray-400 mt-0.5 no-print">Pool: {{ formatVnd(managerPool) }}</p>
					</div>
					<span
						class="text-xl font-black px-3 py-1 rounded-xl shrink-0"
						:class="scoreBgClass(results.managerResult.totalScore)"
					>
						{{ results.managerResult.totalScore.toFixed(1) }}
					</span>
				</div>
				<div class="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
					<div
						v-for="g in managerGroups"
						:key="g.key"
						class="bg-[#f8f9fa] dark:bg-gray-900/50 rounded-lg p-3 text-center"
					>
						<p class="text-xs text-[#617289] dark:text-gray-400">{{ g.label }}</p>
						<p class="text-sm font-bold mt-1" :class="scoreColorClass(groupAvg(g.key))">
							{{ groupAvg(g.key).toFixed(1) }}
						</p>
					</div>
				</div>
				<div
					class="no-print mt-4 pt-4 border-t border-[#dbe0e6] dark:border-gray-700 flex items-center justify-between"
				>
					<span class="text-sm font-semibold text-[#617289] dark:text-gray-400">Thưởng thực tế</span>
					<span class="text-lg font-black text-indigo-600 dark:text-indigo-400">
						{{ formatVnd(results.managerResult.bonusAmount) }}
					</span>
				</div>
				<p
					v-if="results.managerResult.totalScore < 70"
					class="mt-3 text-xs text-yellow-700 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-300 rounded-lg px-3 py-2"
				>
					⚠ Điểm dưới 70 — Cân nhắc điều chỉnh trước khi chốt.
				</p>
			</div>
			<div
				v-for="r in sortedDevResults"
				:key="r.dev.id"
				class="bg-white dark:bg-gray-800 rounded-xl border border-[#dbe0e6] dark:border-gray-700 overflow-hidden print-inner dev-eval-card"
			>
				<!-- Card header -->
				<div class="px-6 py-4 border-b border-[#dbe0e6] dark:border-gray-700 flex items-center justify-between gap-4">
					<div class="flex items-center gap-3">
						<div
							class="size-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 flex items-center justify-center font-black"
						>
							{{ r.dev.name.charAt(0).toUpperCase() }}
						</div>
						<div>
							<p class="font-black text-[#111418] dark:text-white">{{ r.dev.name }}</p>
							<div class="flex items-center gap-2 mt-0.5">
								<span
									class="text-xs font-semibold px-1.5 py-0.5 rounded-full capitalize"
									:class="
										r.dev.level === 'senior'
											? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
											: r.dev.level === 'middle'
												? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
												: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
									"
									>{{ r.dev.level }}</span
								>
								<span class="text-xs text-[#617289] dark:text-gray-400">{{ state.project.period }}</span>
							</div>
						</div>
					</div>
					<div class="flex items-center gap-4 shrink-0">
						<div class="text-center">
							<p class="text-xs text-[#617289] dark:text-gray-400">% Đóng góp</p>
							<p class="font-bold text-[#111418] dark:text-white">{{ r.contribution.toFixed(1) }}%</p>
						</div>
						<div class="text-center no-print">
							<p class="text-xs text-[#617289] dark:text-gray-400">Thưởng</p>
							<p class="font-bold text-indigo-600 dark:text-indigo-400">{{ formatVnd(r.bonusAmount) }}</p>
						</div>
						<span class="text-2xl font-black px-3 py-1 rounded-xl" :class="scoreBgClass(r.totalScore)">
							{{ r.totalScore.toFixed(1) }}
						</span>
					</div>
				</div>

				<div class="px-6 py-5 grid grid-cols-1 md:grid-cols-2 gap-6">
					<!-- Jira metrics -->
					<div>
						<p class="text-xs font-bold text-[#617289] dark:text-gray-400 uppercase tracking-wider mb-3">
							Dữ liệu Jira
						</p>
						<table class="w-full text-sm border-collapse">
							<tbody class="divide-y divide-[#f0f2f4] dark:divide-gray-700">
								<tr>
									<td class="py-1.5 text-[#617289] dark:text-gray-400">Story Points Done</td>
									<td class="py-1.5 text-right font-semibold text-[#111418] dark:text-white">{{ r.dev.jira.sp }}</td>
								</tr>
								<tr>
									<td class="py-1.5 text-[#617289] dark:text-gray-400">Time Spent</td>
									<td class="py-1.5 text-right font-semibold text-[#111418] dark:text-white">
										{{ r.dev.jira.timeSpentHours.toFixed(1) }}h
									</td>
								</tr>
								<tr>
									<td class="py-1.5 text-[#617289] dark:text-gray-400">SP Efficiency</td>
									<td class="py-1.5 text-right font-semibold text-[#111418] dark:text-white">
										{{ r.dev.jira.timeSpentHours > 0 ? (r.dev.jira.sp / r.dev.jira.timeSpentHours).toFixed(2) : '0' }}
										SP/h
									</td>
								</tr>
								<tr>
									<td class="py-1.5 text-[#617289] dark:text-gray-400">Estimation Accuracy</td>
									<td class="py-1.5 text-right font-semibold text-[#111418] dark:text-white">
										{{ calcEstimationAccuracy(r.dev.jira).toFixed(1) }}%
									</td>
								</tr>
								<tr>
									<td class="py-1.5 text-[#617289] dark:text-gray-400">Completion Rate</td>
									<td class="py-1.5 text-right font-semibold text-[#111418] dark:text-white">
										{{
											r.dev.jira.totalTasks > 0 ? Math.round((r.dev.jira.doneTasks / r.dev.jira.totalTasks) * 100) : 0
										}}%
										<span class="text-xs text-[#617289] dark:text-gray-400"
											>({{ r.dev.jira.doneTasks }}/{{ r.dev.jira.totalTasks }})</span
										>
									</td>
								</tr>
								<tr>
									<td class="py-1.5 text-[#617289] dark:text-gray-400">Điểm khách quan</td>
									<td class="py-1.5 text-right font-bold" :class="scoreColorClass(r.objectiveScore)">
										{{ r.objectiveScore.toFixed(1) }}
									</td>
								</tr>
							</tbody>
						</table>
					</div>

					<!-- Subjective scores -->
					<div>
						<p class="text-xs font-bold text-[#617289] dark:text-gray-400 uppercase tracking-wider mb-3">
							Đánh giá chủ quan
						</p>
						<table class="w-full text-sm border-collapse">
							<tbody class="divide-y divide-[#f0f2f4] dark:divide-gray-700">
								<tr v-for="s in subjectiveCriteria(r.dev.role)" :key="s.key">
									<td class="py-1.5 text-[#617289] dark:text-gray-400">{{ s.label }}</td>
									<td class="py-1.5 text-right">
										<div class="flex items-center justify-end gap-2">
											<div class="w-20 bg-[#f0f2f4] dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
												<div
													class="h-full rounded-full"
													:class="
														scoreBarClass(
															(((r.dev.subjective[s.key as keyof typeof r.dev.subjective] as number) - 1) / 9) * 100,
														)
													"
													:style="{
														width:
															(((r.dev.subjective[s.key as keyof typeof r.dev.subjective] as number) - 1) / 9) * 100 +
															'%',
													}"
												></div>
											</div>
											<span class="font-bold w-4 text-[#111418] dark:text-white">{{
												r.dev.subjective[s.key as keyof typeof r.dev.subjective]
											}}</span>
										</div>
										<p
											v-if="r.dev.subjective.notes[s.key as keyof typeof r.dev.subjective.notes]"
											class="text-xs text-[#617289] dark:text-gray-400 mt-0.5 text-right italic"
										>
											{{ r.dev.subjective.notes[s.key as keyof typeof r.dev.subjective.notes] }}
										</p>
									</td>
								</tr>
								<tr>
									<td class="py-1.5 text-[#617289] dark:text-gray-400">Điểm chủ quan</td>
									<td class="py-1.5 text-right font-bold" :class="scoreColorClass(r.subjectiveScore)">
										{{ r.subjectiveScore.toFixed(1) }}
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>

				<!-- Score bar summary -->
				<div class="px-6 pb-5 flex flex-col gap-2">
					<div class="flex items-center gap-3">
						<span class="text-xs w-28 text-[#617289] dark:text-gray-400">Điểm khách quan</span>
						<div class="flex-1 bg-[#f0f2f4] dark:bg-gray-700 h-2 rounded-full overflow-hidden">
							<div
								class="h-full rounded-full bg-indigo-500"
								:style="{ width: r.objectiveScore.toFixed(1) + '%' }"
							></div>
						</div>
						<span class="text-xs font-bold w-8 text-right text-[#111418] dark:text-white">{{
							r.objectiveScore.toFixed(1)
						}}</span>
					</div>
					<div class="flex items-center gap-3">
						<span class="text-xs w-28 text-[#617289] dark:text-gray-400">Điểm chủ quan</span>
						<div class="flex-1 bg-[#f0f2f4] dark:bg-gray-700 h-2 rounded-full overflow-hidden">
							<div
								class="h-full rounded-full bg-purple-500"
								:style="{ width: r.subjectiveScore.toFixed(1) + '%' }"
							></div>
						</div>
						<span class="text-xs font-bold w-8 text-right text-[#111418] dark:text-white">{{
							r.subjectiveScore.toFixed(1)
						}}</span>
					</div>
					<div class="flex items-center gap-3">
						<span class="text-xs w-28 text-[#617289] dark:text-gray-400 font-semibold">Điểm tổng</span>
						<div class="flex-1 bg-[#f0f2f4] dark:bg-gray-700 h-3 rounded-full overflow-hidden">
							<div
								class="h-full rounded-full"
								:class="scoreBarClass(r.totalScore)"
								:style="{ width: r.totalScore.toFixed(1) + '%' }"
							></div>
						</div>
						<span class="text-xs font-black w-8 text-right" :class="scoreColorClass(r.totalScore)">{{
							r.totalScore.toFixed(1)
						}}</span>
					</div>
				</div>
			</div>
		</div>

		<!-- Export buttons -->
		<div class="no-print flex flex-wrap gap-3">
			<button
				@click="exportPdf"
				class="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold rounded-lg transition-colors"
			>
				Xuất PDF
			</button>
			<button
				@click="copyTsv"
				class="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-[#dbe0e6] dark:border-gray-600 text-[#111418] dark:text-white text-sm font-semibold rounded-lg transition-colors"
			>
				Copy bảng
			</button>
			<button
				@click="$emit('export-json')"
				class="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-[#dbe0e6] dark:border-gray-600 text-[#111418] dark:text-white text-sm font-semibold rounded-lg transition-colors"
			>
				Lưu JSON
			</button>
			<label
				class="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-[#dbe0e6] dark:border-gray-600 text-[#111418] dark:text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
			>
				Load JSON
				<input type="file" accept=".json" class="hidden" @change="onLoadJson" />
			</label>
		</div>
	</div>
</template>

<script setup lang="ts">
	import {
		calcAllResults,
		calcEstimationAccuracy,
		formatVnd,
		scoreBarClass,
		scoreBgClass,
		scoreColorClass,
	} from '~/composables/useKpiCalculator';
	import type { KpiState } from '~/models/kpi';

	const props = defineProps<{ state: KpiState }>();
	const emit = defineEmits<{
		'export-json': [];
		'import-json': [file: File];
	}>();

	const results = computed(() => calcAllResults(props.state));
	const sortedDevResults = computed(() => [...results.value.devResults].sort((a, b) => b.totalScore - a.totalScore));
	const topDev = computed(() => sortedDevResults.value[0]);

	const totalDevPool = computed(() => props.state.project.totalBonus * (props.state.project.devBonusRatio / 100));
	const managerPool = computed(
		() => props.state.project.totalBonus * ((100 - props.state.project.devBonusRatio) / 100),
	);

	function subjectiveCriteria(role: 'dev' | 'tester') {
		return [
			{ key: 'response', label: 'Phản hồi & giao tiếp' },
			{ key: 'quality', label: role === 'tester' ? 'Chất lượng test case' : 'Chất lượng code' },
			{ key: 'bugRate', label: role === 'tester' ? 'Khả năng tìm bug' : 'Bug rate' },
			{ key: 'teamwork', label: 'Teamwork' },
		];
	}

	const managerGroups = [
		{ key: 'organization', label: 'Tổ chức' },
		{ key: 'schedule', label: 'Tiến độ' },
		{ key: 'quality', label: 'Chất lượng' },
		{ key: 'teamDev', label: 'Phát triển team' },
	];

	function groupAvg(key: string): number {
		const g = props.state.manager[key as keyof typeof props.state.manager];
		return (((g.score1 + g.score2 + g.score3) / 3 - 1) / 9) * 100;
	}

	async function exportPdf() {
		const html2pdf = (await import('html2pdf.js')).default;
		html2pdf()
			.set({
				margin: 8,
				filename: `kpi-bonus-${props.state.project.period || 'export'}.pdf`,
				jsPDF: { orientation: 'landscape' },
			})
			.from(document.getElementById('kpi-results'))
			.save();
	}

	function copyTsv() {
		const header = ['Tên', 'Level', 'Điểm KQ', 'Điểm CQ', 'Điểm Tổng', 'Hệ số', 'Điểm HS', '% Đóng góp', 'Thưởng'];
		const rows = sortedDevResults.value.map(r => [
			r.dev.name,
			r.dev.level,
			r.objectiveScore.toFixed(1),
			r.subjectiveScore.toFixed(1),
			r.totalScore.toFixed(1),
			r.dev.coefficient.toFixed(1),
			r.weightedScore.toFixed(1),
			r.contribution.toFixed(1) + '%',
			r.bonusAmount.toFixed(0),
		]);
		const tsv = [header, ...rows].map(row => row.join('\t')).join('\n');
		navigator.clipboard.writeText(tsv).catch(() => {});
	}

	function onLoadJson(e: Event) {
		const file = (e.target as HTMLInputElement).files?.[0];
		if (file) emit('import-json', file);
		(e.target as HTMLInputElement).value = '';
	}
</script>

<style scoped>
	@media print {
		.dev-eval-card {
			page-break-inside: avoid;
			break-inside: avoid;
		}
	}
	@media print {
		.no-print {
			display: none !important;
		}
		.print-only {
			display: block !important;
		}

		/* Compact main container */
		main {
			padding: 0 12px !important;
			max-width: 100% !important;
		}

		/* Remove screen-only constraints */
		.min-h-screen {
			min-height: 0 !important;
		}

		/* Compact vertical spacing */
		.py-12 {
			padding-top: 10px !important;
			padding-bottom: 10px !important;
		}
		.gap-8 {
			gap: 12px !important;
		}
		.gap-6 {
			gap: 8px !important;
		}
		.mb-6 {
			margin-bottom: 8px !important;
		}
		.mt-16 {
			margin-top: 8px !important;
		}

		/* Compact card & cell padding */
		.p-6 {
			padding: 8px 10px !important;
		}
		.px-6 {
			padding-left: 8px !important;
			padding-right: 8px !important;
		}
		.py-5 {
			padding-top: 6px !important;
			padding-bottom: 6px !important;
		}
		.py-4 {
			padding-top: 5px !important;
			padding-bottom: 5px !important;
		}
		.py-8 {
			padding-top: 6px !important;
			padding-bottom: 6px !important;
		}

		/* Compact typography */
		h1 {
			font-size: 17px !important;
		}
		.text-3xl {
			font-size: 17px !important;
		}

		/* Clean up decorative styles */
		.shadow-sm {
			box-shadow: none !important;
		}

		/* Fix table overflow clipping */
		.overflow-x-auto {
			overflow: visible !important;
		}

		/* Hide horizontal divider between sections */
		.print-divider {
			display: none !important;
		}

		/* Prevent rows from splitting across pages */
		tr {
			break-inside: avoid !important;
		}

		/* Footer */
		footer {
			margin-top: 6px !important;
			padding-top: 4px !important;
			padding-bottom: 4px !important;
		}

		/* Chart column: không cho h-full gây overflow */
		.chart-col {
			height: auto !important;
			overflow: hidden !important;
		}
		.chart-body {
			flex-grow: 0 !important;
			padding: 8px !important;
		}
		.chart-wrapper {
			width: 210px !important;
		}

		/* Stats table bắt đầu trang mới */
		.stats-section,
		.page-break {
			break-before: page !important;
		}
	}
</style>
