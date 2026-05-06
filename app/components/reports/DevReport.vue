<template>
	<div id="report">
		<div
			v-if="data && data.length"
			class="bg-background-light dark:bg-background-dark text-[#111418] dark:text-white transition-colors duration-200 min-h-screen"
		>
			<div class="flex flex-col min-h-screen">
				<main class="flex-1 w-full max-w-[1280px] mx-auto px-4 sm:px-8 py-12">
					<div class="flex flex-col gap-8">
						<div class="flex flex-wrap justify-between items-end gap-4">
							<div class="flex flex-col gap-1 text-center mx-auto">
								<h1 class="text-[#111418] dark:text-white text-[32px] font-black leading-tight tracking-tight">
									Department Monthy Overview
								</h1>
								<div class="no-print flex items-center gap-2 text-[#617289] dark:text-gray-400 text-base font-normal">
									<span>Tháng:</span>
									<input
										type="date"
										v-model="startDate"
										class="border border-[#dbe0e6] dark:border-gray-600 rounded-md px-2 py-1 text-sm bg-white dark:bg-gray-700 text-[#111418] dark:text-white"
									/>
									<span>-</span>
									<input
										type="date"
										v-model="endDate"
										class="border border-[#dbe0e6] dark:border-gray-600 rounded-md px-2 py-1 text-sm bg-white dark:bg-gray-700 text-[#111418] dark:text-white"
									/>
								</div>
								<p class="print-only text-[#617289] dark:text-gray-400 text-base font-normal">
									Tháng: {{ startDate }} - {{ endDate }}
								</p>
							</div>
						</div>
						<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
							<div class="col-span-4">
								<h2 class="text-[#111418] dark:text-white text-[22px] font-bold leading-tight tracking-tight pt-4 pb-2">
									Chỉ số hiệu suất
								</h2>
								<p class="text-[#617289] dark:text-gray-400 text-sm mb-1">
									Tổng hợp nhanh chỉ số về hiệu suất của team
								</p>
							</div>
							<div
								class="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-gray-800 border border-[#dbe0e6] dark:border-gray-700 shadow-sm"
							>
								<p class="text-[#617289] dark:text-gray-400 text-sm font-medium">Tổng Storypoints trong tháng</p>
								<p class="text-[#111418] dark:text-white text-3xl font-bold tracking-tight">{{ totalStoryPoints }}</p>
								<!-- <div class="flex items-center gap-1 mt-1">
									<span class="material-symbols-outlined text-[#07883b] text-[16px]">trending_up</span>
									<p class="text-[#07883b] text-xs font-bold">+5.4% from last week</p>
								</div> -->
							</div>

							<div
								class="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-gray-800 border border-[#dbe0e6] dark:border-gray-700 shadow-sm"
							>
								<p class="text-[#617289] dark:text-gray-400 text-sm font-medium">Tổng Spent time trong tháng</p>
								<p class="text-[#111418] dark:text-white text-3xl font-bold tracking-tight">
									{{ totalTimeSpent / 3600 }} giờ
								</p>
								<!-- <div class="flex items-center gap-1 mt-1">
									<span class="material-symbols-outlined text-[#07883b] text-[16px]">trending_up</span>
									<p class="text-[#07883b] text-xs font-bold">+3.0% improvement</p>
								</div> -->
							</div>
							<div
								class="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-gray-800 border border-[#dbe0e6] dark:border-gray-700 shadow-sm"
							>
								<p class="text-[#617289] dark:text-gray-400 text-sm font-medium">Task hoàn thành / tổng số</p>
								<p class="text-[#111418] dark:text-white text-3xl font-bold tracking-tight">
									<span class="text-green-600">{{
										assigneeValuesTotal.reduce((sum, a) => sum + a.totalRecordsAsDone, 0)
									}}</span>
									/ {{ data.length }}
								</p>
								<!-- <div class="flex items-center gap-1 mt-1">
									<span class="material-symbols-outlined text-[#07883b] text-[16px]">trending_up</span>
									<p class="text-[#07883b] text-xs font-bold">+3.0% improvement</p>
								</div> -->
							</div>
						</div>
						<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
							<div
								class="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl border border-[#dbe0e6] dark:border-gray-700 shadow-sm overflow-hidden"
							>
								<div class="px-6 py-5 border-b border-[#dbe0e6] dark:border-gray-700 flex justify-between items-center">
									<h2 class="text-[#111418] dark:text-white text-lg font-bold">Tỉ lệ phân bổ nguồn lực</h2>
								</div>
								<div class="p-6 flex flex-col gap-6">
									<div v-for="epic in epics" :key="epic.name" class="flex flex-col gap-3">
										<div class="flex justify-between items-start">
											<div class="flex flex-col">
												<p class="text-[#111418] dark:text-white text-sm font-bold">{{ epic.name }}</p>
												<p class="text-[#617289] dark:text-gray-400 text-xs">
													{{ epic.uniqueDevelopers.length }} developers — {{ epic.uniqueDevelopers.join(', ') }}
												</p>
											</div>
											<div class="flex flex-col items-end shrink-0 ml-4">
												<span class="text-sm font-bold text-indigo-600 dark:text-indigo-400">
													{{ Math.round((epic.totalStoryPoints / totalStoryPoints) * 100) }}%
												</span>
												<span class="text-xs text-[#617289] dark:text-gray-400">
													{{ formatTime(epic.totalTimeSpent) }}
												</span>
											</div>
										</div>
										<div class="w-full bg-[#f0f2f4] dark:bg-gray-700 h-2 rounded-full overflow-hidden">
											<div
												class="bg-indigo-500 h-full rounded-full"
												:style="{
													width: Math.round((epic.totalStoryPoints / totalStoryPoints) * 100) + '%',
												}"
											></div>
										</div>
									</div>
								</div>
							</div>

							<div
								class="chart-col no-print bg-white dark:bg-gray-800 rounded-xl border border-[#dbe0e6] dark:border-gray-700 shadow-sm flex flex-col h-full"
							>
								<div class="px-6 py-5 border-b border-[#dbe0e6] dark:border-gray-700">
									<h2 class="text-[#111418] dark:text-white text-lg font-bold">Tỉ lệ story points theo loại task</h2>
								</div>
								<div class="chart-body p-6 flex flex-col items-center justify-center grow">
									<div class="chart-wrapper relative w-100">
										<ReportChart :labels="issueTypeLabelsUnique" :values="issueTypeValuesTotal" />
									</div>
								</div>
							</div>
						</div>
						<div>
							<!-- Câu tổng kết để thấy team dồn lực vào đâu -->
							<p class="text-[#111418] dark:text-white text-md">
								Tháng vừa qua, team đã tập trung nguồn lực vào việc hoàn thành các task của Epic:
								<b>{{ epics[0]?.name }}</b> - chiếm tới
								<b>{{ Math.round(((epics[0]?.totalStoryPoints || 0) / totalStoryPoints) * 100) }}%</b> nguồn lực .
								<br />Song song với đó, team tiếp tục triển khai các task trong Epic: <b>{{ epics[1]?.name }}</b> cũng
								như các epic khác.
							</p>
						</div>
						<div class="border print-divider"></div>
						<div class="stats-section flex flex-col">
							<h2 class="text-[#111418] dark:text-white text-[22px] font-bold leading-tight tracking-tight pt-4 pb-2">
								Stats của thành viên trong team
							</h2>
							<p class="text-[#617289] dark:text-gray-400 text-sm mb-6">
								Tổng hợp nhanh các thông tin của các thành viên trong team
							</p>
							<div
								class="overflow-x-auto rounded-xl border border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-gray-800"
							>
								<table class="w-full text-left border-collapse">
									<thead>
										<tr class="bg-[#f8f9fa] dark:bg-gray-900 border-b border-[#dbe0e6] dark:border-gray-700">
											<th
												class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#617289] dark:text-gray-400"
											>
												Tên
											</th>
											<th
												class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#617289] dark:text-gray-400 text-center"
											>
												Story Points
											</th>
											<th
												class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#617289] dark:text-gray-400 text-center"
											>
												Time Spent
											</th>
											<th
												class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#617289] dark:text-gray-400"
											>
												Task count
											</th>
											<th
												class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#617289] dark:text-gray-400 text-center"
											>
												Complexity
											</th>
											<th
												class="no-print px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#617289] dark:text-gray-400 text-center"
											>
												Level
											</th>
										</tr>
									</thead>
									<tbody class="divide-y divide-[#dbe0e6] dark:divide-gray-700">
										<tr
											v-for="assignee in assigneeValuesTotal"
											:key="assignee.name"
											class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
										>
											<td class="px-6 py-4">
												<div class="flex items-center gap-3">
													<div
														class="size-8 rounded bg-orange-100 dark:bg-orange-900/40 text-orange-600 flex items-center justify-center font-bold text-xs"
													>
														{{ assignee.name.charAt(0).toUpperCase() }}
													</div>
													<p class="text-sm font-bold dark:text-white capitalize">{{ assignee.name }}</p>
												</div>
											</td>
											<td class="px-6 py-4 text-center font-medium text-sm dark:text-white">
												{{ assignee.totalStoryPoints }}
											</td>
											<td class="px-6 py-4 text-center font-medium text-sm dark:text-white">
												{{ formatTime(assignee.totalTimeSpent) }}
											</td>
											<td class="px-6 py-4 text-left font-medium text-sm dark:text-white">
												{{ assignee.totalRecordsCount }} ({{ assignee.totalRecordsAsDone }} hoàn thành)
											</td>
											<td class="px-6 py-4 text-center">
												<div class="flex items-center justify-center gap-1 flex-wrap">
													<span
														class="text-xs font-bold px-1.5 py-0.5 rounded bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
														>S {{ assignee.tierS }}</span
													>
													<span
														class="text-xs font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
														>M {{ assignee.tierM }}</span
													>
													<span
														class="text-xs font-bold px-1.5 py-0.5 rounded bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300"
														>L {{ assignee.tierL }}</span
													>
													<span
														class="text-xs font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
														>XL {{ assignee.tierXL }}</span
													>
												</div>
											</td>
											<td class="no-print px-6 py-4 text-center">
												<select
													v-model="memberLevels[assignee.name]"
													class="text-xs border border-[#dbe0e6] dark:border-gray-600 rounded-lg px-2 py-1.5 bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
												>
													<option value="">— Chọn —</option>
													<option value="intern">Intern</option>
													<option value="fresher">Fresher</option>
													<option value="junior">Junior</option>
													<option value="middle">Middle</option>
													<option value="senior">Senior</option>
												</select>
											</td>
										</tr>
									</tbody>
								</table>
								<div
									class="mt-3 border border-[#dbe0e6] dark:border-gray-700 rounded-lg px-4 py-3 bg-[#f8f9fa] dark:bg-gray-900/50"
								>
									<p class="text-[10px] font-bold text-[#617289] dark:text-gray-400 uppercase tracking-wider mb-2">
										Chú giải — Complexity tier
									</p>
									<div class="grid grid-cols-2 gap-x-8 gap-y-1.5">
										<div class="flex items-center gap-2">
											<span
												class="text-xs font-bold px-1.5 py-0.5 rounded bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 w-7 text-center shrink-0"
												>S</span
											>
											<span class="text-xs text-[#617289] dark:text-gray-400">≤ 2 SP — Đơn giản (≤ 3 h)</span>
										</div>
										<div class="flex items-center gap-2">
											<span
												class="text-xs font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 w-7 text-center shrink-0"
												>M</span
											>
											<span class="text-xs text-[#617289] dark:text-gray-400">3–5 SP — Vừa phải (~1 ngày)</span>
										</div>
										<div class="flex items-center gap-2">
											<span
												class="text-xs font-bold px-1.5 py-0.5 rounded bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300 w-7 text-center shrink-0"
												>L</span
											>
											<span class="text-xs text-[#617289] dark:text-gray-400">6–12 SP — Phức tạp (3–4 ngày)</span>
										</div>
										<div class="flex items-center gap-2">
											<span
												class="text-xs font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 w-7 text-center shrink-0"
												>XL</span
											>
											<span class="text-xs text-[#617289] dark:text-gray-400">≥ 13 SP — Rất phức tạp (>4 ngày)</span>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div v-if="kpiEvaluation.length > 0" class="flex flex-col">
							<h2 class="text-[#111418] dark:text-white text-[22px] font-bold leading-tight tracking-tight pt-4 pb-2">
								Đánh giá KPI
							</h2>
							<p class="text-[#617289] dark:text-gray-400 text-sm mb-6">
								So sánh hiệu suất thực tế với target theo level. Cập nhật tự động khi chọn level ở bảng trên.
							</p>
							<div
								class="overflow-x-auto rounded-xl border border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-gray-800"
							>
								<table class="w-full text-left border-collapse">
									<thead>
										<tr class="bg-[#f8f9fa] dark:bg-gray-900 border-b border-[#dbe0e6] dark:border-gray-700">
											<th
												class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#617289] dark:text-gray-400"
											>
												Tên
											</th>
											<th
												class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#617289] dark:text-gray-400 text-center"
											>
												Level
											</th>
											<th
												class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#617289] dark:text-gray-400 text-center"
											>
												SP / Target
											</th>
											<th
												class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#617289] dark:text-gray-400 text-center"
											>
												Time Spent
											</th>
											<th
												class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#617289] dark:text-gray-400 text-center"
											>
												Hoàn thành
											</th>
											<th
												class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#617289] dark:text-gray-400 text-center"
											>
												Bug rate
											</th>
											<th
												class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#617289] dark:text-gray-400 text-center"
											>
												Kết quả
											</th>
										</tr>
									</thead>
									<tbody class="divide-y divide-[#dbe0e6] dark:divide-gray-700">
										<tr
											v-for="row in kpiEvaluation"
											:key="row.name"
											class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
										>
											<td class="px-6 py-4">
												<p class="text-sm font-bold dark:text-white capitalize">{{ row.name }}</p>
											</td>
											<td class="px-6 py-4 text-center">
												<span
													class="text-xs font-semibold px-2 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 capitalize"
												>
													{{ KPI_TARGETS[row.level].label }}
												</span>
											</td>
											<td class="px-6 py-4 text-center text-sm">
												<span :class="row.spMet ? 'text-green-600' : 'text-red-500'" class="font-bold">{{
													row.actualSP
												}}</span>
												<span class="text-[#617289] dark:text-gray-400"> / {{ row.targetSP }}</span>
												<span class="ml-1 font-bold" :class="row.spMet ? 'text-green-600' : 'text-red-500'">{{
													row.spMet ? '✓' : '✗'
												}}</span>
											</td>
											<td class="px-6 py-4 text-center text-sm">
												<span :class="row.timeMet ? 'text-green-600' : 'text-red-500'" class="font-bold"
													>{{ row.actualHours }}h</span
												>
												<span class="text-[#617289] dark:text-gray-400"> / {{ row.targetHours }}h</span>
												<span class="ml-1 font-bold" :class="row.timeMet ? 'text-green-600' : 'text-red-500'">{{
													row.timeMet ? '✓' : '✗'
												}}</span>
											</td>
											<td class="px-6 py-4 text-center text-sm">
												<span :class="row.completionMet ? 'text-green-600' : 'text-red-500'" class="font-bold"
													>{{ row.completionRate }}%</span
												>
												<span class="text-[#617289] dark:text-gray-400"> / {{ row.targetCompletion }}%</span>
												<span class="ml-1 font-bold" :class="row.completionMet ? 'text-green-600' : 'text-red-500'">{{
													row.completionMet ? '✓' : '✗'
												}}</span>
											</td>
											<td class="px-6 py-4 text-center text-sm">
												<span :class="row.bugMet ? 'text-green-600' : 'text-red-500'" class="font-bold"
													>{{ row.bugRate }}%</span
												>
												<span class="text-[#617289] dark:text-gray-400"> / &lt;{{ row.targetBugRate }}%</span>
												<span class="ml-1 font-bold" :class="row.bugMet ? 'text-green-600' : 'text-red-500'">{{
													row.bugMet ? '✓' : '✗'
												}}</span>
											</td>
											<td class="px-6 py-4 text-center">
												<span
													class="text-xs font-bold px-2 py-1 rounded-full"
													:class="{
														'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300': row.metCount === 4,
														'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300':
															row.metCount >= 2 && row.metCount < 4,
														'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300': row.metCount < 2,
													}"
													>{{ row.metCount }}/4</span
												>
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					</div>
					<div class="border print-divider"></div>
					<div v-if="okrs && okrs.length" class="stats-section flex flex-col">
						<h2 class="text-[#111418] dark:text-white text-[22px] font-bold leading-tight tracking-tight pt-4 pb-2">
							OKRs tháng này
						</h2>
						<p class="text-[#617289] dark:text-gray-400 text-sm mb-6">
							Mục tiêu & kết quả then chốt của team trong tháng
						</p>
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div
								v-for="okr in okrs"
								:key="okr.id"
								class="bg-white dark:bg-gray-800 rounded-xl border border-[#dbe0e6] dark:border-gray-700 shadow-sm p-5 flex flex-col gap-3"
							>
								<div class="flex items-start justify-between gap-3">
									<p class="text-sm font-bold text-[#111418] dark:text-white leading-snug">{{ okr.title }}</p>
									<span
										class="shrink-0 text-sm font-black px-2 py-0.5 rounded-full"
										:class="
											okr.completionRate >= 80
												? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
												: okr.completionRate >= 50
													? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300'
													: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
										"
										>{{ okr.completionRate }}%</span
									>
								</div>
								<p v-if="okr.description" class="text-xs text-[#617289] dark:text-gray-400 leading-relaxed">
									{{ okr.description }}
								</p>
								<div class="flex flex-col gap-1">
									<div class="w-full bg-[#f0f2f4] dark:bg-gray-700 h-2 rounded-full overflow-hidden">
										<div
											class="h-full rounded-full transition-all"
											:class="
												okr.completionRate >= 80
													? 'bg-green-500'
													: okr.completionRate >= 50
														? 'bg-yellow-400'
														: 'bg-red-400'
											"
											:style="{ width: okr.completionRate + '%' }"
										></div>
									</div>
								</div>
							</div>
						</div>
					</div>

					<footer class="mt-16 py-8 border-t border-[#dbe0e6] dark:border-gray-800 text-center">
						<p class="text-[#617289] dark:text-gray-400 text-xs">
							Generated on {{ new Date().toLocaleDateString() }} • Confidential Data
						</p>
					</footer>
				</main>
			</div>
		</div>
		<!-- <div v-else>
			<p class="text-center text-black-700 text-2xl font-bold mt-10">Hãy import file csv để xem báo cáo</p>
		</div> -->
	</div>
</template>

<script setup lang="ts">
	import { KPI_TARGETS, type DevReportRow, type MemberLevel, type OKR } from '~/models/index';
	import ReportChart from '~/components/chart/ReportChart.vue';
	const weekCount = ref(0);
	const startDate = ref('');
	const endDate = ref('');
	function getISOWeekNumber(date: Date) {
		const target = new Date(date.valueOf()); // Create a copy
		const dayNr = (date.getDay() + 6) % 7; // ISO weeks start on Monday
		target.setDate(target.getDate() - dayNr + 3); // Set to Thursday of the week
		const jan4 = new Date(target.getFullYear(), 0, 4); // Week 1 contains Jan 4th
		// @ts-ignore
		const dayDiff = (target - jan4) / 86400000; // Difference in days
		return 1 + Math.ceil(dayDiff / 7); // Calculate week number
	}

	onMounted(() => {
		const now = new Date();
		weekCount.value = getISOWeekNumber(now) - 1;
		const prevWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
		const day = prevWeek.getDay() || 7;

		const monday = new Date(prevWeek);
		monday.setDate(prevWeek.getDate() - day + 1);
		const sunday = new Date(monday);
		sunday.setDate(monday.getDate() + 6);
		// @ts-ignore
		startDate.value = monday.toISOString().split('T')[0];
		// @ts-ignore
		endDate.value = sunday.toISOString().split('T')[0];
	});
	const props = defineProps({
		data: { type: Array as () => DevReportRow[], required: true },
		okrs: { type: Array as () => OKR[], default: () => [] },
	});

	const memberLevels = reactive<Record<string, MemberLevel | ''>>({});
	type Sprint = {
		name: string;
		developers: string[];
		uniqueDevelopers: string[];
		totalStoryPoints: number;
		totalTimeSpent: number;
	};
	const totalStoryPoints = computed(() =>
		props.data.reduce((acc, row) => acc + Number(row['Custom field (Story Points)']), 0),
	);
	const totalTimeSpent = computed(() => props.data.reduce((acc, row) => acc + Number(row['Time Spent']), 0));
	const weekKpisSetting = [
		{
			name: 'Senior',
			storyPoints: 30,
			timeSpent: 30,
			taskCount: 5,
			taskHardCount: 2,
		},
		{
			name: 'Junior',
			storyPoints: 20,
			timeSpent: 20,
			taskCount: 5,
			taskHardCount: 1,
		},
	];
	const epics = computed(() => {
		const epics: Sprint[] = [];
		props.data.forEach(row => {
			const parentName = row['Parent summary'] || row['Sprint'];
			const epic = epics.find(s => s.name === parentName);

			if (epic) {
				epic.developers.push(row.Assignee);
				epic.totalStoryPoints += Number(row['Custom field (Story Points)']);
				epic.totalTimeSpent += Number(row['Time Spent']);
				epic.uniqueDevelopers = [...new Set(epic.developers)];
			} else {
				const obj = {
					name: parentName,
					developers: [row.Assignee],
					totalStoryPoints: Number(row['Custom field (Story Points)']),
					totalTimeSpent: Number(row['Time Spent']),
					uniqueDevelopers: [] as string[],
				};
				obj.uniqueDevelopers = [...new Set(obj.developers)];
				epics.push(obj);
			}
		});
		return epics.sort((a, b) => b.totalStoryPoints - a.totalStoryPoints);
	});
	console.log(epics.value);

	const issueTypeLabelsUnique = computed(() => {
		return props.data.reduce((acc, row) => {
			if (!acc.includes(row['Issue Type'])) {
				acc.push(row['Issue Type']);
			}
			return acc;
		}, [] as string[]);
	});
	const issueTypeValuesTotal = computed(() => {
		return issueTypeLabelsUnique.value.map(issueType => {
			return props.data.reduce((acc, row) => {
				if (row['Issue Type'] === issueType) {
					acc += Number(row['Custom field (Story Points)']);
				}
				return acc;
			}, 0);
		});
	});
	// Thống kê theo Assignee
	const assigneeValuesTotal = computed(() => {
		const statsMap = new Map<
			string,
			{
				name: string;
				totalStoryPoints: number;
				totalTimeSpent: number;
				totalRecordsCount: number;
				totalRecordsAsDone: number;
				tierS: number;
				tierM: number;
				tierL: number;
				tierXL: number;
			}
		>();

		props.data.forEach(row => {
			const assignee = row.Assignee;
			if (!statsMap.has(assignee)) {
				statsMap.set(assignee, {
					name: assignee,
					totalStoryPoints: 0,
					totalTimeSpent: 0,
					totalRecordsCount: 0,
					totalRecordsAsDone: 0,
					tierS: 0,
					tierM: 0,
					tierL: 0,
					tierXL: 0,
				});
			}
			const stats = statsMap.get(assignee)!;
			stats.totalStoryPoints += Number(row['Custom field (Story Points)']);
			stats.totalTimeSpent += Number(row['Time Spent']);
			stats.totalRecordsCount += 1;
			if (['Done', 'Ready for Test'].includes(row.Status)) {
				stats.totalRecordsAsDone += 1;
			}
			const sp = Number(row['Custom field (Story Points)']);
			if (sp <= 2) stats.tierS += 1;
			else if (sp <= 5) stats.tierM += 1;
			else if (sp <= 12) stats.tierL += 1;
			else stats.tierXL += 1;
		});

		return Array.from(statsMap.values());
	});
	// Thống kê theo Status
	const statusValuesTotal = computed(() => {
		const statsMap = new Map<
			string,
			{ name: string; totalStoryPoints: number; totalTimeSpent: number; totalRecordsCount: number }
		>();

		props.data.forEach(row => {
			const status = row.Status;
			if (!statsMap.has(status)) {
				statsMap.set(status, {
					name: status,
					totalStoryPoints: 0,
					totalTimeSpent: 0,
					totalRecordsCount: 0,
				});
			}
			const stats = statsMap.get(status)!;
			stats.totalStoryPoints += Number(row['Custom field (Story Points)']);
			stats.totalTimeSpent += Number(row['Time Spent']);
			stats.totalRecordsCount += 1;
		});

		return Array.from(statsMap.values());
	});
	console.log(statusValuesTotal);

	const kpiEvaluation = computed(() =>
		assigneeValuesTotal.value
			.filter(a => memberLevels[a.name])
			.map(assignee => {
				const level = memberLevels[assignee.name] as MemberLevel;
				const target = KPI_TARGETS[level];

				const completionRate =
					assignee.totalRecordsCount > 0
						? Math.round((assignee.totalRecordsAsDone / assignee.totalRecordsCount) * 100)
						: 0;

				const bugCount = props.data.filter(r => r.Assignee === assignee.name && r['Issue Type'] === 'Bug').length;
				const bugRate =
					assignee.totalRecordsCount > 0 ? Math.round((bugCount / assignee.totalRecordsCount) * 1000) / 10 : 0;

				const actualHours = Math.round((assignee.totalTimeSpent / 3600) * 10) / 10;
				const timeMet = actualHours >= target.timeSpentMinHours;

				const spMet = assignee.totalStoryPoints >= target.spPerMonth;
				const completionMet = completionRate >= target.completionRate;
				const bugMet = bugRate <= target.bugRateMax;

				return {
					name: assignee.name,
					level,
					actualSP: assignee.totalStoryPoints,
					targetSP: target.spPerMonth,
					spMet,
					actualHours,
					targetHours: target.timeSpentMinHours,
					timeMet,
					completionRate,
					targetCompletion: target.completionRate,
					completionMet,
					bugRate,
					targetBugRate: target.bugRateMax,
					bugMet,
					metCount: [spMet, timeMet, completionMet, bugMet].filter(Boolean).length,
				};
			}),
	);

	// Hàm nhận vào số seconds trả ra string dạng xh ym zm
	function formatTime(seconds: number) {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		return `${hours}h ${minutes}m`;
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
		.stats-section {
			break-before: page !important;
		}
	}
</style>
