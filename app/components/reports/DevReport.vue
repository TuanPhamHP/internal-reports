<template>
	<div id="report">

		<div v-if="data && data.length"
			class="bg-background-light dark:bg-background-dark text-[#111418] dark:text-white transition-colors duration-200 min-h-screen">
			<div class="flex flex-col min-h-screen">
				<main class="flex-1 w-full max-w-[1280px] mx-auto px-4 sm:px-8 py-12">
					<div class="flex flex-col gap-8">
						<div class="flex flex-wrap justify-between items-end gap-4">
							<div class="flex flex-col gap-1 text-center mx-auto">
								<h1 class="text-[#111418] dark:text-white text-3xl font-black leading-tight tracking-tight">
									Department Weekly Overview
								</h1>
								<p class="text-[#617289] dark:text-gray-400 text-base font-normal">Week {{ weekCount }}: {{ startDate }}
									- {{ endDate }}</p>
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
								class="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-gray-800 border border-[#dbe0e6] dark:border-gray-700 shadow-sm">
								<p class="text-[#617289] dark:text-gray-400 text-sm font-medium"> Tổng Storypoints trong tuần </p>
								<p class="text-[#111418] dark:text-white text-3xl font-bold tracking-tight">{{ totalStoryPoints }}</p>
								<!-- <div class="flex items-center gap-1 mt-1">
									<span class="material-symbols-outlined text-[#07883b] text-[16px]">trending_up</span>
									<p class="text-[#07883b] text-xs font-bold">+5.4% from last week</p>
								</div> -->
							</div>

							<div
								class="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-gray-800 border border-[#dbe0e6] dark:border-gray-700 shadow-sm">
								<p class="text-[#617289] dark:text-gray-400 text-sm font-medium">Tổng Spent time trong tuần</p>
								<p class="text-[#111418] dark:text-white text-3xl font-bold tracking-tight">{{ totalTimeSpent / 3600 }}
									giờ</p>
								<!-- <div class="flex items-center gap-1 mt-1">
									<span class="material-symbols-outlined text-[#07883b] text-[16px]">trending_up</span>
									<p class="text-[#07883b] text-xs font-bold">+3.0% improvement</p>
								</div> -->
							</div>
							<div
								class="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-gray-800 border border-[#dbe0e6] dark:border-gray-700 shadow-sm">
								<p class="text-[#617289] dark:text-gray-400 text-sm font-medium">Task hoàn thành / tổng số</p>
								<p class="text-[#111418] dark:text-white text-3xl font-bold tracking-tight">
									<span class="text-green-600">{{statusValuesTotal.find(o => o.name ===
										'Done')?.totalRecordsCount}}</span> / {{ data.length }}
								</p>
								<!-- <div class="flex items-center gap-1 mt-1">
									<span class="material-symbols-outlined text-[#07883b] text-[16px]">trending_up</span>
									<p class="text-[#07883b] text-xs font-bold">+3.0% improvement</p>
								</div> -->
							</div>

						</div>
						<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
							<div
								class="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl border border-[#dbe0e6] dark:border-gray-700 shadow-sm overflow-hidden">
								<div class="px-6 py-5 border-b border-[#dbe0e6] dark:border-gray-700 flex justify-between items-center">
									<h2 class="text-[#111418] dark:text-white text-lg font-bold">Tỉ lệ phân bổ nguồn lực</h2>
								</div>
								<div class="p-6 flex flex-col gap-6">
									<div v-for="sprint in sprints" :key="sprint.name" class="flex flex-col gap-3">
										<div class="flex justify-between items-center">
											<div class="flex flex-col">
												<p class="text-[#111418] dark:text-white text-sm font-bold">{{ sprint.name }}</p>
												<p class="text-[#617289] dark:text-gray-400 text-xs"> {{ sprint.uniqueDevelopers.length
												}} developers - {{ sprint.uniqueDevelopers.join(', ') }}</p>

											</div>
											<p class="text-sm font-bold text-primary">{{ Math.round((sprint.totalStoryPoints /
												totalStoryPoints) * 100)
											}}%</p>
										</div>
										<div class="w-full bg-[#f0f2f4] dark:bg-gray-700 h-2 rounded-full overflow-hidden">
											<div class="bg-indigo-500 h-full rounded-full" :style="{
												width: Math.round((sprint.totalStoryPoints /
													totalStoryPoints) * 100) + '%'
											}">
											</div>
										</div>
									</div>
								</div>
							</div>

							<div
								class="bg-white dark:bg-gray-800 rounded-xl border border-[#dbe0e6] dark:border-gray-700 shadow-sm flex flex-col h-full">
								<div class="px-6 py-5 border-b border-[#dbe0e6] dark:border-gray-700">
									<h2 class="text-[#111418] dark:text-white text-lg font-bold">
										Tỉ lệ story points theo loại task
									</h2>
								</div>
								<div class="p-6 flex flex-col items-center justify-center grow">
									<div class="relative w-100">
										<ReportChart :labels="issueTypeLabelsUnique" :values="issueTypeValuesTotal" />
									</div>
								</div>
							</div>
						</div>
						<div>
							<!-- Câu tổng kết để thấy team dồn lực vào đâu -->
							<p class="text-[#111418] dark:text-white text-md">
								Tuần vừa qua, team đã tập trung nguồn lực vào việc hoàn thành các task của Sprint: <b>{{
									sprints[0]?.name }}</b> - chiếm tới <b>{{ Math.round((sprints[0]?.totalStoryPoints /
										totalStoryPoints) * 100) }}%</b> nguồn lực . <br>Song song với đó, team tiếp tục triển khai các task
								trong
								Sprint: <b>{{
									sprints[1]?.name }}</b> cũng như các sprint khác.
							</p>
						</div>
						<div class="border"></div>
						<div class="flex flex-col">
							<h2 class="text-[#111418] dark:text-white text-[22px] font-bold leading-tight tracking-tight pt-4 pb-2">
								Stats của thành viên trong team
							</h2>
							<p class="text-[#617289] dark:text-gray-400 text-sm mb-6">
								Tổng hợp nhanh các thông tin của các thành viên trong team
							</p>
							<div
								class="overflow-x-auto rounded-xl border border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-gray-800">
								<table class="w-full text-left border-collapse">
									<thead>
										<tr class="bg-[#f8f9fa] dark:bg-gray-900 border-b border-[#dbe0e6] dark:border-gray-700">
											<th
												class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#617289] dark:text-gray-400">
												Tên
											</th>
											<th
												class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#617289] dark:text-gray-400 text-center">
												Story Points
											</th>
											<th
												class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#617289] dark:text-gray-400 text-center">
												Time Spent
											</th>
											<th
												class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#617289] dark:text-gray-400">
												Task count
											</th>
											<th
												class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#617289] dark:text-gray-400 text-right">
												Task > 3 SP
											</th>
										</tr>
									</thead>
									<tbody class="divide-y divide-[#dbe0e6] dark:divide-gray-700">
										<tr v-for="assignee in assigneeValuesTotal" :key="assignee.name"
											class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
											<td class="px-6 py-4">
												<div class="flex items-center gap-3">
													<div
														class="size-8 rounded bg-orange-100 dark:bg-orange-900/40 text-orange-600 flex items-center justify-center font-bold text-xs">
														{{ assignee.name.charAt(0).toUpperCase() }}
													</div>
													<p class="text-sm font-bold dark:text-white capitalize ">{{ assignee.name }}</p>
												</div>
											</td>
											<td class="px-6 py-4 text-center font-medium text-sm dark:text-white">{{ assignee.totalStoryPoints
											}}</td>
											<td class="px-6 py-4 text-center font-medium text-sm dark:text-white">{{
												formatTime(assignee.totalTimeSpent) }}</td>
											<td class="px-6 py-4 text-left font-medium text-sm dark:text-white">{{
												assignee.totalRecordsCount
											}} ({{ assignee.totalRecordsAsDone }} hoàn thành)</td>
											<td class="px-6 py-4 text-right font-medium text-sm dark:text-white">
												{{ assignee.totalHardTaskCount }}
											</td>
										</tr>
									</tbody>
								</table>
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
		<div v-else>
			<p class="text-center text-black-700 text-2xl font-bold mt-10">
				Hãy import file csv để xem báo cáo
			</p>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { DevReportRow } from '~/models/index';
import ReportChart from '~/components/chart/ReportChart.vue';
const weekCount = ref(0);
const startDate = ref('');
const endDate = ref('');
function getISOWeekNumber(date: Date) {
	const target = new Date(date.valueOf()); // Create a copy
	const dayNr = (date.getDay() + 6) % 7; // ISO weeks start on Monday
	target.setDate(target.getDate() - dayNr + 3); // Set to Thursday of the week
	const jan4 = new Date(target.getFullYear(), 0, 4); // Week 1 contains Jan 4th
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

	startDate.value = monday.toISOString().split('T')[0];
	endDate.value = sunday.toISOString().split('T')[0];
})
const props = defineProps({
	data: { type: Array as () => DevReportRow[], required: true },
});
type Sprint = {
	name: string;
	developers: string[];
	uniqueDevelopers: string[];
	totalStoryPoints: number;
	totalTimeSpent: number;
}
const headers = computed(() => (props.data.length ? Object.keys(props.data[0]) : []));
const totalStoryPoints = computed(() => props.data.reduce((acc, row) => acc + Number(row['Custom field (Story Points)']), 0));
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
	}
]
const sprints = computed(() => {
	const sprints: Sprint[] = [];
	props.data.forEach((row) => {
		const sprint = sprints.find((s) => s.name === row.Sprint);
		if (sprint) {
			sprint.developers.push(row.Assignee);
			sprint.totalStoryPoints += Number(row['Custom field (Story Points)']);
			sprint.totalTimeSpent += Number(row['Time Spent']);
			sprint.uniqueDevelopers = [...new Set(sprint.developers)];
		} else {
			const obj = {
				name: row.Sprint,
				developers: [row.Assignee],
				totalStoryPoints: Number(row['Custom field (Story Points)']),
				totalTimeSpent: Number(row['Time Spent']),
				uniqueDevelopers: [] as string[]
			}
			obj.uniqueDevelopers = [...new Set(obj.developers)];
			sprints.push(obj);
		}

	});
	return sprints.sort((a, b) => b.totalStoryPoints - a.totalStoryPoints);
});
const issueTypeLabelsUnique = computed(() => {
	return props.data.reduce((acc, row) => {
		if (!acc.includes(row['Issue Type'])) {
			acc.push(row['Issue Type']);
		}
		return acc;
	}, [] as string[]);
});
const issueTypeValuesTotal = computed(() => {
	return issueTypeLabelsUnique.value.map((issueType) => {
		return props.data.reduce((acc, row) => {
			if (row['Issue Type'] === issueType) {
				acc += Number(row['Custom field (Story Points)']);
			}
			return acc;
		}, 0);
	})
})
// Thống kê theo Assignee
const assigneeValuesTotal = computed(() => {
	const statsMap = new Map<string, {
		name: string;
		totalStoryPoints: number;
		totalTimeSpent: number;
		totalRecordsCount: number;
		totalRecordsAsDone: number;
		totalHardTaskCount: number;
	}>();

	props.data.forEach((row) => {
		const assignee = row.Assignee;
		if (!statsMap.has(assignee)) {
			statsMap.set(assignee, {
				name: assignee,
				totalStoryPoints: 0,
				totalTimeSpent: 0,
				totalRecordsCount: 0,
				totalRecordsAsDone: 0,
				totalHardTaskCount: 0
			});
		}
		const stats = statsMap.get(assignee)!;
		stats.totalStoryPoints += Number(row['Custom field (Story Points)']);
		stats.totalTimeSpent += Number(row['Time Spent']);
		stats.totalRecordsCount += 1;
		if (row.Status === 'Done') {
			stats.totalRecordsAsDone += 1;
		}
		// Hard task là các task có row['Custom field (Story Points)'] > 3
		if (Number(row['Custom field (Story Points)']) > 3) {
			stats.totalHardTaskCount += 1;
		}
	});

	return Array.from(statsMap.values());
});
// Thống kê theo Status
const statusValuesTotal = computed(() => {
	const statsMap = new Map<string, { name: string; totalStoryPoints: number; totalTimeSpent: number; totalRecordsCount: number }>();

	props.data.forEach((row) => {
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

// Hàm nhận vào số seconds trả ra string dạng xh ym zm
function formatTime(seconds: number) {
	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	return `${hours}h ${minutes}m`;
}
console.log(statusValuesTotal.value);

</script>
