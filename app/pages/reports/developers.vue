<template>
	<div
		class="px-6 py-6 max-w-7xl mx-auto"
		@dragenter.prevent="dragCounter++"
		@dragleave="dragCounter--"
		@dragover.prevent
		@drop.prevent="onDrop"
	>
		<CsvUploader @parsed="getData" />

		<div
			v-if="!srcData.length"
			class="no-print flex flex-col items-center justify-center min-h-[75vh] border-2 border-dashed rounded-2xl transition-all duration-200"
			:class="
				isDragging
					? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 scale-[1.005]'
					: 'border-[#dbe0e6] dark:border-gray-600'
			"
		>
			<div class="flex flex-col items-center gap-4 pointer-events-none select-none">
				<div
					class="w-16 h-16 rounded-2xl flex items-center justify-center transition-colors duration-200"
					:class="isDragging ? 'bg-indigo-200 dark:bg-indigo-700/60' : 'bg-indigo-100 dark:bg-indigo-900/40'"
				>
					<span class="text-xl font-black text-indigo-500 dark:text-indigo-400">CSV</span>
				</div>
				<div class="text-center">
					<p
						class="font-bold text-lg transition-colors duration-200"
						:class="isDragging ? 'text-indigo-600 dark:text-indigo-400' : 'text-[#111418] dark:text-white'"
					>
						{{ isDragging ? 'Thả file vào đây' : 'Kéo thả file CSV vào đây' }}
					</p>
					<p class="text-[#617289] dark:text-gray-400 text-sm mt-1">
						hoặc nhấn nút <strong class="text-indigo-500">+</strong> ở góc dưới phải để chọn file
					</p>
				</div>
				<p class="text-xs text-[#617289] dark:text-gray-400">Hỗ trợ file .csv export từ Jira</p>
			</div>
		</div>

		<div v-if="srcData.length" class="no-print mt-4 mb-2">
			<div
				class="bg-white dark:bg-gray-800 rounded-xl border border-[#dbe0e6] dark:border-gray-700 shadow-sm overflow-hidden"
			>
				<div class="px-6 py-4 border-b border-[#dbe0e6] dark:border-gray-700 flex items-center justify-between">
					<div>
						<h2 class="text-[#111418] dark:text-white font-bold">OKRs tháng này</h2>
						<p class="text-xs text-[#617289] dark:text-gray-400 mt-0.5">
							Nhập OKR thủ công để hiển thị trong báo cáo
						</p>
					</div>
					<button
						@click="showOkrForm = !showOkrForm"
						class="flex items-center gap-1.5 text-sm font-semibold text-white bg-indigo-500 hover:bg-indigo-600 px-3 py-1.5 rounded-lg transition-colors"
					>
						<span class="text-base leading-none">+</span> Thêm OKR
					</button>
				</div>

				<div v-if="okrs.length" class="divide-y divide-[#dbe0e6] dark:divide-gray-700">
					<div
						v-for="okr in okrs"
						:key="okr.id"
						class="px-6 py-4 flex items-start gap-4"
					>
						<div class="flex-1 min-w-0">
							<p class="text-sm font-bold text-[#111418] dark:text-white truncate">{{ okr.title }}</p>
							<p v-if="okr.description" class="text-xs text-[#617289] dark:text-gray-400 mt-0.5">
								{{ okr.description }}
							</p>
						</div>
						<div class="flex items-center gap-3 shrink-0">
							<span
								class="text-sm font-bold"
								:class="
									okr.completionRate >= 80
										? 'text-green-600'
										: okr.completionRate >= 50
											? 'text-yellow-600'
											: 'text-red-500'
								"
							>{{ okr.completionRate }}%</span>
							<button
								@click="removeOkr(okr.id)"
								class="text-xs text-[#617289] hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
							>
								Xóa
							</button>
						</div>
					</div>
				</div>
				<p v-else-if="!showOkrForm" class="px-6 py-4 text-sm text-[#617289] dark:text-gray-400">
					Chưa có OKR nào. Nhấn <strong>+ Thêm OKR</strong> để bắt đầu.
				</p>

				<div v-if="showOkrForm" class="px-6 py-5 bg-[#f8f9fa] dark:bg-gray-900/50 border-t border-[#dbe0e6] dark:border-gray-700">
					<div class="flex flex-col gap-3">
						<div class="flex flex-col gap-1">
							<label class="text-xs font-semibold text-[#617289] dark:text-gray-400 uppercase tracking-wide">Tiêu đề *</label>
							<input
								v-model="newOkr.title"
								type="text"
								placeholder="VD: Nâng cao chất lượng code"
								class="border border-[#dbe0e6] dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
							/>
						</div>
						<div class="flex flex-col gap-1">
							<label class="text-xs font-semibold text-[#617289] dark:text-gray-400 uppercase tracking-wide">Mô tả</label>
							<textarea
								v-model="newOkr.description"
								placeholder="Mô tả ngắn về OKR..."
								rows="2"
								class="border border-[#dbe0e6] dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
							/>
						</div>
						<div class="flex flex-col gap-1">
							<label class="text-xs font-semibold text-[#617289] dark:text-gray-400 uppercase tracking-wide">
								Tỉ lệ hoàn thành: <span class="text-indigo-600 font-bold">{{ newOkr.completionRate }}%</span>
							</label>
							<input
								v-model.number="newOkr.completionRate"
								type="range"
								min="0"
								max="100"
								step="5"
								class="w-full accent-indigo-500"
							/>
							<div class="flex justify-between text-xs text-[#617289] dark:text-gray-400">
								<span>0%</span><span>50%</span><span>100%</span>
							</div>
						</div>
						<div class="flex gap-2 justify-end pt-1">
							<button
								@click="showOkrForm = false; resetNewOkr()"
								class="text-sm px-4 py-1.5 rounded-lg border border-[#dbe0e6] dark:border-gray-600 text-[#617289] dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
							>
								Hủy
							</button>
							<button
								@click="addOkr"
								:disabled="!newOkr.title.trim()"
								class="text-sm px-4 py-1.5 rounded-lg bg-indigo-500 text-white font-semibold hover:bg-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
							>
								Thêm
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>

		<client-only>
			<DevReport :data="srcData" :okrs="okrs" />
		</client-only>
	</div>
</template>

<script setup lang="ts">
import Papa from 'papaparse';
import CsvUploader from '~/components/CsvUploader.vue';
import DevReport from '~/components/reports/DevReport.vue';
import type { DevReportRow, OKR } from '~/models/index';

const srcData = ref<DevReportRow[]>([]);
const dragCounter = ref(0);
const isDragging = computed(() => dragCounter.value > 0);

const okrs = ref<OKR[]>([]);
const showOkrForm = ref(false);
const newOkr = reactive({ title: '', description: '', completionRate: 50 });
let nextOkrId = 1;

function addOkr() {
	if (!newOkr.title.trim()) return;
	okrs.value.push({ id: nextOkrId++, title: newOkr.title.trim(), description: newOkr.description.trim(), completionRate: newOkr.completionRate });
	showOkrForm.value = false;
	resetNewOkr();
}

function removeOkr(id: number) {
	okrs.value = okrs.value.filter(o => o.id !== id);
}

function resetNewOkr() {
	newOkr.title = '';
	newOkr.description = '';
	newOkr.completionRate = 50;
}

function getData(data: any) {
	srcData.value = data as DevReportRow[];
}

function onDrop(e: DragEvent) {
	dragCounter.value = 0;
	const file = e.dataTransfer?.files[0];
	if (!file || !file.name.toLowerCase().endsWith('.csv')) return;
	Papa.parse(file, {
		header: true,
		skipEmptyLines: true,
		complete: (result: Papa.ParseResult<DevReportRow>) => {
			srcData.value = result.data;
		},
	});
}
</script>

<style>
@media print {
	@page {
		size: A4 landscape;
		margin: 8mm 10mm;
	}
}
</style>

<style scoped>
@media print {
	.no-print {
		display: none !important;
	}
}
</style>
