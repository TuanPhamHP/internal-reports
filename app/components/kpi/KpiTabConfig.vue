<template>
	<div class="flex flex-col gap-8">
		<!-- Project info -->
		<div class="bg-white dark:bg-gray-800 rounded-xl border border-[#dbe0e6] dark:border-gray-700 overflow-hidden">
			<div class="px-6 py-4 border-b border-[#dbe0e6] dark:border-gray-700">
				<h3 class="font-bold text-[#111418] dark:text-white">Thông tin dự án</h3>
			</div>
			<div class="px-6 py-5 grid grid-cols-1 md:grid-cols-2 gap-4">
				<div class="flex flex-col gap-1">
					<label class="text-xs font-semibold text-[#617289] dark:text-gray-400 uppercase tracking-wide">Tên dự án</label>
					<input v-model="state.project.name" type="text" placeholder="VD: Project Alpha" v-bind="inputClass" />
				</div>
				<div class="flex flex-col gap-1">
					<label class="text-xs font-semibold text-[#617289] dark:text-gray-400 uppercase tracking-wide">Kỳ đánh giá</label>
					<input v-model="state.project.period" type="text" placeholder="VD: T4/2026" v-bind="inputClass" />
				</div>
				<div class="flex flex-col gap-1">
					<label class="text-xs font-semibold text-[#617289] dark:text-gray-400 uppercase tracking-wide">
						Tổng thưởng (VND)
					</label>
					<input v-model.number="state.project.totalBonus" type="number" min="0" step="1000000" v-bind="inputClass" />
					<p class="text-xs text-indigo-500">{{ formatVnd(state.project.totalBonus) }}</p>
				</div>
				<div class="flex flex-col gap-1">
					<label class="text-xs font-semibold text-[#617289] dark:text-gray-400 uppercase tracking-wide">
						Tỉ lệ thưởng Devs: <span class="text-indigo-600 font-bold">{{ state.project.devBonusRatio }}%</span>
						&nbsp;/ Quản lý: <span class="text-indigo-600 font-bold">{{ 100 - state.project.devBonusRatio }}%</span>
					</label>
					<input
						v-model.number="state.project.devBonusRatio"
						type="range"
						min="0"
						max="100"
						step="5"
						class="accent-indigo-500"
					/>
				</div>
				<div class="flex flex-col gap-1">
					<label class="text-xs font-semibold text-[#617289] dark:text-gray-400 uppercase tracking-wide">Tên quản lý</label>
					<input v-model="state.project.managerName" type="text" placeholder="Tên PM / Tech Lead" v-bind="inputClass" />
				</div>
			</div>
		</div>

		<!-- Dev list -->
		<div class="bg-white dark:bg-gray-800 rounded-xl border border-[#dbe0e6] dark:border-gray-700 overflow-hidden">
			<div class="px-6 py-4 border-b border-[#dbe0e6] dark:border-gray-700 flex items-center justify-between">
				<h3 class="font-bold text-[#111418] dark:text-white">Danh sách Dev</h3>
				<div class="flex items-center gap-2">
					<label
						class="flex items-center gap-1.5 text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
					>
						<span>Import Jira CSV</span>
						<input type="file" accept=".csv" class="hidden" @change="onCsvChange" />
					</label>
					<button
						@click="addDev"
						class="flex items-center gap-1 text-sm font-semibold text-white bg-indigo-500 hover:bg-indigo-600 px-3 py-1.5 rounded-lg transition-colors"
					>
						<span class="text-base leading-none">+</span> Thêm dev
					</button>
				</div>
			</div>

			<div v-if="state.devs.length" class="divide-y divide-[#dbe0e6] dark:divide-gray-700">
				<div
					v-for="dev in state.devs"
					:key="dev.id"
					class="px-6 py-3 flex items-center gap-3"
				>
					<input
						:value="dev.name"
						@input="dev.name = ($event.target as HTMLInputElement).value"
						type="text"
						placeholder="Tên dev"
						class="flex-1 border border-[#dbe0e6] dark:border-gray-600 rounded-lg px-3 py-1.5 text-sm bg-white dark:bg-gray-900 text-[#111418] dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
					/>
					<select
						v-model="dev.role"
						class="border border-[#dbe0e6] dark:border-gray-600 rounded-lg px-2 py-1.5 text-sm bg-white dark:bg-gray-900 text-[#111418] dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
					>
						<option value="dev">Dev</option>
						<option value="tester">Tester</option>
						<option value="ba">BA</option>
					</select>
					<select
						v-model="dev.level"
						class="border border-[#dbe0e6] dark:border-gray-600 rounded-lg px-2 py-1.5 text-sm bg-white dark:bg-gray-900 text-[#111418] dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
					>
						<option value="intern">Intern</option>
						<option value="fresher">Fresher</option>
						<option value="junior">Junior</option>
						<option value="middle">Middle</option>
						<option value="senior">Senior</option>
					</select>
					<div class="flex items-center gap-1">
						<input
							v-model.number="dev.monthsInProject"
							type="number"
							min="1"
							class="w-14 border border-[#dbe0e6] dark:border-gray-600 rounded-lg px-2 py-1.5 text-sm bg-white dark:bg-gray-700 text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center"
						/>
						<span class="text-xs text-[#617289] dark:text-gray-400">tháng</span>
					</div>
					<div class="flex items-center gap-1">
						<span class="text-xs text-[#617289] dark:text-gray-400">Hệ số</span>
						<input
							v-model.number="dev.coefficient"
							type="number"
							min="0"
							max="5"
							step="0.1"
							class="w-16 border border-[#dbe0e6] dark:border-gray-600 rounded-lg px-2 py-1.5 text-sm bg-white dark:bg-gray-700 text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center"
						/>
					</div>
					<button @click="removeDev(dev.id)" class="text-xs text-red-500 hover:underline shrink-0">Xóa</button>
				</div>
			</div>
			<p v-else class="px-6 py-4 text-sm text-[#617289] dark:text-gray-400">
				Chưa có dev nào. Nhấn <strong>+ Thêm dev</strong> hoặc <strong>Import Jira CSV</strong>.
			</p>
		</div>

		<!-- Sprint / Parent filter — chỉ hiện sau khi import CSV -->
		<div
			v-if="state.availableParents.length"
			class="bg-white dark:bg-gray-800 rounded-xl border border-[#dbe0e6] dark:border-gray-700 overflow-hidden"
		>
			<div class="px-6 py-4 border-b border-[#dbe0e6] dark:border-gray-700 flex items-center justify-between">
				<div>
					<h3 class="font-bold text-[#111418] dark:text-white">Lọc Sprint / Parent</h3>
					<p class="text-xs text-[#617289] dark:text-gray-400 mt-0.5">
						Chọn sprint / epic được tính vào KPI. Bỏ chọn tất cả = tính hết.
					</p>
				</div>
				<div class="flex items-center gap-2 shrink-0">
					<button @click="selectAllParents" class="text-xs text-indigo-600 hover:underline">Chọn tất cả</button>
					<span class="text-[#617289] dark:text-gray-400">·</span>
					<button @click="clearParents" class="text-xs text-[#617289] dark:text-gray-400 hover:underline">Bỏ chọn</button>
				</div>
			</div>
			<div class="px-6 py-4 flex flex-wrap gap-2">
				<label
					v-for="p in state.availableParents"
					:key="p"
					class="flex items-center gap-1.5 cursor-pointer select-none"
				>
					<input
						type="checkbox"
						:checked="state.selectedParents.includes(p)"
						@change="toggleParent(p)"
						class="rounded accent-indigo-500"
					/>
					<span
						class="text-xs px-2 py-0.5 rounded-full border"
						:class="state.selectedParents.includes(p)
							? 'bg-indigo-50 border-indigo-300 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-600 dark:text-indigo-300'
							: 'bg-[#f0f2f4] border-transparent text-[#617289] dark:bg-gray-700 dark:text-gray-400'"
					>{{ p }}</span>
				</label>
			</div>
			<div v-if="state.selectedParents.length" class="px-6 pb-4">
				<p class="text-xs text-indigo-600 dark:text-indigo-400">
					Đang lọc {{ state.selectedParents.length }} / {{ state.availableParents.length }} sprint/parent.
					Jira data đã được tính lại tự động.
				</p>
			</div>
		</div>

		<!-- Weights -->
		<div class="flex flex-col gap-4">
			<h3 class="text-[22px] font-bold text-[#111418] dark:text-white">Cấu hình trọng số</h3>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<KpiWeightConfig
					title="Tổng thể (Khách quan / Chủ quan)"
					:weights="topWeights"
					:labels="{ objective: 'Khách quan (Jira)', subjective: 'Chủ quan (PM)' }"
					@update:weights="onTopWeights"
				/>
				<KpiWeightConfig
					title="Phần khách quan"
					:weights="objWeights"
					:labels="{
						objSp: 'Story Points',
						objEfficiency: 'SP Efficiency',
						objCompletion: 'Completion Rate',
					}"
					@update:weights="onObjWeights"
				/>
				<KpiWeightConfig
					title="Phần chủ quan"
					:weights="subWeights"
					:labels="{
						subResponse: 'Phản hồi',
						subQuality: 'Chất lượng code',
						subBugRate: 'Bug rate',
						subTeamwork: 'Teamwork',
					}"
					@update:weights="onSubWeights"
				/>
				<KpiWeightConfig
					title="Nhóm quản lý"
					:weights="mgrWeights"
					:labels="{
						mgrOrganization: 'Tổ chức',
						mgrSchedule: 'Tiến độ',
						mgrQuality: 'Chất lượng',
						mgrTeamDev: 'Phát triển team',
					}"
					@update:weights="onMgrWeights"
				/>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import Papa from 'papaparse';
import { formatVnd } from '~/composables/useKpiCalculator';
import type { KpiState } from '~/models/kpi';
import type { DevReportRow } from '~/models/index';

const props = defineProps<{ state: KpiState }>();
const emit = defineEmits<{ 'update:state': [value: KpiState] }>();

// Expose addDev/removeDev — parent controls the array via state mutations
function addDev() {
	emit('update:state', {
		...props.state,
		devs: [
			...props.state.devs,
			{
				id: crypto.randomUUID(),
				name: '',
				role: 'dev' as const,
				level: 'junior' as const,
				monthsInProject: 1,
				coefficient: 1,
				jira: { sp: 0, timeSpentHours: 0, spEstimate: 0, spActual: 0, totalTasks: 0, doneTasks: 0 },
				subjective: {
					response: 5, quality: 5, bugRate: 5, teamwork: 5,
					notes: { response: '', quality: '', bugRate: '', teamwork: '' },
				},
			},
		],
	});
}

function removeDev(id: string) {
	emit('update:state', {
		...props.state,
		devs: props.state.devs.filter(d => d.id !== id),
	});
}

// Weight slices for KpiWeightConfig (keyed subsets of KpiWeights)
const topWeights = computed(() => ({
	objective: props.state.weights.objective,
	subjective: props.state.weights.subjective,
}));
const objWeights = computed(() => ({
	objSp: props.state.weights.objSp,
	objEfficiency: props.state.weights.objEfficiency,
	objCompletion: props.state.weights.objCompletion,
}));
const subWeights = computed(() => ({
	subResponse: props.state.weights.subResponse,
	subQuality: props.state.weights.subQuality,
	subBugRate: props.state.weights.subBugRate,
	subTeamwork: props.state.weights.subTeamwork,
}));
const mgrWeights = computed(() => ({
	mgrOrganization: props.state.weights.mgrOrganization,
	mgrSchedule: props.state.weights.mgrSchedule,
	mgrQuality: props.state.weights.mgrQuality,
	mgrTeamDev: props.state.weights.mgrTeamDev,
}));

function onTopWeights(v: Record<string, number>) {
	emit('update:state', { ...props.state, weights: { ...props.state.weights, ...v } });
}
function onObjWeights(v: Record<string, number>) {
	emit('update:state', { ...props.state, weights: { ...props.state.weights, ...v } });
}
function onSubWeights(v: Record<string, number>) {
	emit('update:state', { ...props.state, weights: { ...props.state.weights, ...v } });
}
function onMgrWeights(v: Record<string, number>) {
	emit('update:state', { ...props.state, weights: { ...props.state.weights, ...v } });
}

// Jira CSV import
function onCsvChange(e: Event) {
	const file = (e.target as HTMLInputElement).files?.[0];
	if (!file) return;
	Papa.parse<DevReportRow>(file, {
		header: true,
		skipEmptyLines: true,
		complete: result => {
			const rows = result.data.filter(r => r.Assignee);

			// Extract unique parent names
			const parentSet = new Set<string>();
			rows.forEach(r => {
				const p = r['Parent summary'] || r['Sprint'];
				if (p) parentSet.add(p);
			});
			const availableParents = [...parentSet].sort();
			// Reset filter to "all selected" on new import
			const selectedParents: string[] = [];

			// Group by assignee
			const byAssignee = new Map<string, DevReportRow[]>();
			rows.forEach(row => {
				if (!byAssignee.has(row.Assignee)) byAssignee.set(row.Assignee, []);
				byAssignee.get(row.Assignee)!.push(row);
			});

			const newDevs = [...props.state.devs];
			for (const [name, devRows] of byAssignee.entries()) {
				const jira = aggregateJiraFromRows(devRows, selectedParents);
				const existing = newDevs.find(d => d.name === name);
				if (existing) {
					existing.jira = jira;
				} else {
					newDevs.push({
						id: crypto.randomUUID(),
						name,
						role: 'dev' as const,
						level: 'junior',
						monthsInProject: 1,
						coefficient: 1,
						jira,
						subjective: {
							response: 5, quality: 5, bugRate: 5, teamwork: 5,
							notes: { response: '', quality: '', bugRate: '', teamwork: '' },
						},
					});
				}
			}

			emit('update:state', {
				...props.state,
				devs: newDevs,
				rawCsvRows: rows,
				availableParents,
				selectedParents,
			});
			(e.target as HTMLInputElement).value = '';
		},
	});
}

function toggleParent(parent: string) {
	const current = props.state.selectedParents;
	const next = current.includes(parent)
		? current.filter(p => p !== parent)
		: [...current, parent];
	emit('update:state', { ...props.state, selectedParents: next });
}

function selectAllParents() {
	emit('update:state', { ...props.state, selectedParents: [...props.state.availableParents] });
}

function clearParents() {
	emit('update:state', { ...props.state, selectedParents: [] });
}

const inputClass = {
	class: 'border border-[#dbe0e6] dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-900 text-[#111418] dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500',
};
</script>
