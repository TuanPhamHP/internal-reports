<template>
	<div class="px-6 py-8 max-w-5xl mx-auto">
		<!-- Header -->
		<div class="mb-8">
			<h1 class="text-[28px] font-black text-[#111418] dark:text-white tracking-tight">Cấu hình KPI</h1>
			<p class="text-[#617289] dark:text-gray-400 text-sm mt-1">Thiết lập ngưỡng đánh giá cho từng cấp độ và vị trí</p>
		</div>

		<!-- Tab nav -->
		<div class="flex gap-1 mb-6 bg-[#f0f2f4] dark:bg-gray-800 p-1 rounded-xl w-fit">
			<button
				v-for="tab in tabs"
				:key="tab.key"
				@click="activeTab = tab.key"
				class="px-4 py-2 text-sm font-semibold rounded-lg transition-colors"
				:class="
					activeTab === tab.key
						? 'bg-white dark:bg-gray-700 text-[#111418] dark:text-white shadow-sm'
						: 'text-[#617289] dark:text-gray-400 hover:text-[#111418] dark:hover:text-white'
				"
			>
				{{ tab.label }}
			</button>
		</div>

		<!-- Dev tab -->
		<div v-if="activeTab === 'dev'" class="flex flex-col gap-6">
			<div class="bg-white dark:bg-gray-800 rounded-xl border border-[#dbe0e6] dark:border-gray-700 overflow-hidden">
				<div class="px-6 py-4 border-b border-[#dbe0e6] dark:border-gray-700">
					<h3 class="font-bold text-[#111418] dark:text-white">Targets theo Level — Dev</h3>
					<p class="text-xs text-[#617289] dark:text-gray-400 mt-0.5">Áp dụng khi tính điểm khách quan (Story Points, Completion Rate, Time Spent)</p>
				</div>
				<div class="overflow-x-auto">
					<table class="w-full text-left border-collapse">
						<thead>
							<tr class="bg-[#f8f9fa] dark:bg-gray-900 border-b border-[#dbe0e6] dark:border-gray-700">
								<th class="px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#617289] dark:text-gray-400">Level</th>
								<th class="px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#617289] dark:text-gray-400 text-center">SP / tháng</th>
								<th class="px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#617289] dark:text-gray-400 text-center">Completion (%)</th>
								<th class="px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#617289] dark:text-gray-400 text-center">Time tối thiểu (h)</th>
								<th class="px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#617289] dark:text-gray-400 text-center">Bug Rate Max (%)</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-[#dbe0e6] dark:divide-gray-700">
							<tr v-for="level in levels" :key="level.key" class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
								<td class="px-5 py-3">
									<span class="text-xs font-semibold px-2 py-0.5 rounded-full capitalize" :class="level.badgeClass">{{ level.key }}</span>
								</td>
								<td class="px-5 py-3 text-center">
									<input v-model.number="editDevTargets[level.key].spPerMonth" type="number" min="1" step="5" v-bind="numInputClass" />
								</td>
								<td class="px-5 py-3 text-center">
									<input v-model.number="editDevTargets[level.key].completionRate" type="number" min="1" max="100" step="5" v-bind="numInputClass" />
								</td>
								<td class="px-5 py-3 text-center">
									<input v-model.number="editDevTargets[level.key].timeSpentMinHours" type="number" min="1" step="10" v-bind="numInputClass" />
								</td>
								<td class="px-5 py-3 text-center">
									<input v-model.number="editDevTargets[level.key].bugRateMax" type="number" min="0" max="100" step="1" v-bind="numInputClass" />
								</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div class="px-6 py-4 border-t border-[#dbe0e6] dark:border-gray-700 flex items-center gap-3">
					<button @click="handleSaveDev" class="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold rounded-lg transition-colors">Lưu thay đổi</button>
					<button @click="handleResetDev" class="px-4 py-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-[#dbe0e6] dark:border-gray-600 text-[#111418] dark:text-white text-sm font-semibold rounded-lg transition-colors">Khôi phục mặc định</button>
					<span v-if="savedMsg" class="text-xs text-green-600 dark:text-green-400 font-semibold">{{ savedMsg }}</span>
				</div>
			</div>

			<!-- SP Efficiency tiers reference -->
			<div class="bg-white dark:bg-gray-800 rounded-xl border border-[#dbe0e6] dark:border-gray-700 overflow-hidden">
				<div class="px-6 py-4 border-b border-[#dbe0e6] dark:border-gray-700">
					<h3 class="font-bold text-[#111418] dark:text-white">SP Efficiency — Tham chiếu Tier</h3>
					<p class="text-xs text-[#617289] dark:text-gray-400 mt-0.5">Điểm efficiency tính theo % SP đạt được so với target tháng</p>
				</div>
				<div class="overflow-x-auto">
					<table class="w-full text-left border-collapse">
						<thead>
							<tr class="bg-[#f8f9fa] dark:bg-gray-900 border-b border-[#dbe0e6] dark:border-gray-700">
								<th class="px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#617289] dark:text-gray-400">Mức SP đạt</th>
								<th class="px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#617289] dark:text-gray-400">Tier</th>
								<th class="px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#617289] dark:text-gray-400 text-center">Điểm</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-[#dbe0e6] dark:divide-gray-700 text-sm">
							<tr class="text-[#111418] dark:text-white">
								<td class="px-5 py-2.5 text-[#617289] dark:text-gray-400">&lt; 40%</td>
								<td class="px-5 py-2.5"><span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300">Rất thấp</span></td>
								<td class="px-5 py-2.5 text-center font-semibold text-red-500">0 – 20</td>
							</tr>
							<tr class="text-[#111418] dark:text-white">
								<td class="px-5 py-2.5 text-[#617289] dark:text-gray-400">40 – 60%</td>
								<td class="px-5 py-2.5"><span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300">Thấp</span></td>
								<td class="px-5 py-2.5 text-center font-semibold text-orange-500">20 – 40</td>
							</tr>
							<tr class="text-[#111418] dark:text-white">
								<td class="px-5 py-2.5 text-[#617289] dark:text-gray-400">60 – 80%</td>
								<td class="px-5 py-2.5"><span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300">Trung bình</span></td>
								<td class="px-5 py-2.5 text-center font-semibold text-yellow-500">40 – 60</td>
							</tr>
							<tr class="text-[#111418] dark:text-white">
								<td class="px-5 py-2.5 text-[#617289] dark:text-gray-400">80 – 100%</td>
								<td class="px-5 py-2.5"><span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">Khá</span></td>
								<td class="px-5 py-2.5 text-center font-semibold text-blue-500">60 – 80</td>
							</tr>
							<tr class="text-[#111418] dark:text-white">
								<td class="px-5 py-2.5 text-[#617289] dark:text-gray-400">≥ 100% SP, chưa đủ time</td>
								<td class="px-5 py-2.5"><span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">Đạt SP, chờ time</span></td>
								<td class="px-5 py-2.5 text-center font-semibold text-indigo-500">80 – 99</td>
							</tr>
							<tr class="bg-green-50 dark:bg-green-900/10 text-[#111418] dark:text-white font-semibold">
								<td class="px-5 py-2.5 text-[#617289] dark:text-gray-400">≥ 100% SP + ≥ Time target</td>
								<td class="px-5 py-2.5"><span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300">Đạt KPI</span></td>
								<td class="px-5 py-2.5 text-center font-semibold text-green-600">100</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>

			<!-- Score weight reference -->
			<div class="bg-white dark:bg-gray-800 rounded-xl border border-[#dbe0e6] dark:border-gray-700 overflow-hidden">
				<div class="px-6 py-4 border-b border-[#dbe0e6] dark:border-gray-700">
					<h3 class="font-bold text-[#111418] dark:text-white">Công thức điểm — Dev</h3>
					<p class="text-xs text-[#617289] dark:text-gray-400 mt-0.5">Trọng số mặc định — có thể điều chỉnh trong từng kỳ KPI</p>
				</div>
				<div class="px-6 py-5 grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<p class="text-xs font-bold text-[#617289] dark:text-gray-400 uppercase tracking-wider mb-3">Điểm khách quan (mặc định 60%)</p>
						<div class="flex flex-col gap-2">
							<div v-for="item in objItems" :key="item.label" class="flex items-center gap-2">
								<div class="flex-1 bg-[#f0f2f4] dark:bg-gray-700 h-2 rounded-full overflow-hidden">
									<div class="h-full bg-indigo-400 rounded-full" :style="{ width: item.weight + '%' }"></div>
								</div>
								<span class="text-xs text-[#111418] dark:text-white w-28 text-right">{{ item.label }}</span>
								<span class="text-xs font-bold text-indigo-600 dark:text-indigo-400 w-8 text-right">{{ item.weight }}%</span>
							</div>
						</div>
					</div>
					<div>
						<p class="text-xs font-bold text-[#617289] dark:text-gray-400 uppercase tracking-wider mb-3">Điểm chủ quan (mặc định 40%)</p>
						<div class="flex flex-col gap-2">
							<div v-for="item in subItems" :key="item.label" class="flex items-center gap-2">
								<div class="flex-1 bg-[#f0f2f4] dark:bg-gray-700 h-2 rounded-full overflow-hidden">
									<div class="h-full bg-purple-400 rounded-full" :style="{ width: item.weight + '%' }"></div>
								</div>
								<span class="text-xs text-[#111418] dark:text-white w-28 text-right">{{ item.label }}</span>
								<span class="text-xs font-bold text-purple-600 dark:text-purple-400 w-8 text-right">{{ item.weight }}%</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Designer tab -->
		<div v-else-if="activeTab === 'designer'" class="flex flex-col gap-6">
			<div class="bg-white dark:bg-gray-800 rounded-xl border border-[#dbe0e6] dark:border-gray-700 overflow-hidden">
				<div class="px-6 py-4 border-b border-[#dbe0e6] dark:border-gray-700">
					<h3 class="font-bold text-[#111418] dark:text-white">Targets theo Level — Designer</h3>
					<p class="text-xs text-[#617289] dark:text-gray-400 mt-0.5">SP target thấp hơn Dev do tính chất công việc sáng tạo — áp dụng cho điểm khách quan</p>
				</div>
				<div class="overflow-x-auto">
					<table class="w-full text-left border-collapse">
						<thead>
							<tr class="bg-[#f8f9fa] dark:bg-gray-900 border-b border-[#dbe0e6] dark:border-gray-700">
								<th class="px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#617289] dark:text-gray-400">Level</th>
								<th class="px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#617289] dark:text-gray-400 text-center">SP / tháng</th>
								<th class="px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#617289] dark:text-gray-400 text-center">Completion (%)</th>
								<th class="px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#617289] dark:text-gray-400 text-center">Time tối thiểu (h)</th>
								<th class="px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#617289] dark:text-gray-400 text-center">Bug Rate Max (%)</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-[#dbe0e6] dark:divide-gray-700">
							<tr v-for="level in levels" :key="level.key" class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
								<td class="px-5 py-3">
									<span class="text-xs font-semibold px-2 py-0.5 rounded-full capitalize" :class="level.badgeClass">{{ level.key }}</span>
								</td>
								<td class="px-5 py-3 text-center">
									<input v-model.number="editDesignerTargets[level.key].spPerMonth" type="number" min="1" step="5" v-bind="numInputClass" />
								</td>
								<td class="px-5 py-3 text-center">
									<input v-model.number="editDesignerTargets[level.key].completionRate" type="number" min="1" max="100" step="5" v-bind="numInputClass" />
								</td>
								<td class="px-5 py-3 text-center">
									<input v-model.number="editDesignerTargets[level.key].timeSpentMinHours" type="number" min="1" step="10" v-bind="numInputClass" />
								</td>
								<td class="px-5 py-3 text-center">
									<input v-model.number="editDesignerTargets[level.key].bugRateMax" type="number" min="0" max="100" step="1" v-bind="numInputClass" />
								</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div class="px-6 py-4 border-t border-[#dbe0e6] dark:border-gray-700 flex items-center gap-3">
					<button @click="handleSaveDesigner" class="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white text-sm font-semibold rounded-lg transition-colors">Lưu thay đổi</button>
					<button @click="handleResetDesigner" class="px-4 py-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-[#dbe0e6] dark:border-gray-600 text-[#111418] dark:text-white text-sm font-semibold rounded-lg transition-colors">Khôi phục mặc định</button>
					<span v-if="savedMsg" class="text-xs text-green-600 dark:text-green-400 font-semibold">{{ savedMsg }}</span>
				</div>
			</div>

			<!-- Designer criteria reference -->
			<div class="bg-white dark:bg-gray-800 rounded-xl border border-[#dbe0e6] dark:border-gray-700 overflow-hidden">
				<div class="px-6 py-4 border-b border-[#dbe0e6] dark:border-gray-700">
					<h3 class="font-bold text-[#111418] dark:text-white">Công thức điểm — Designer</h3>
					<p class="text-xs text-[#617289] dark:text-gray-400 mt-0.5">Tương tự Dev: 60% khách quan (Jira) + 40% chủ quan (PM)</p>
				</div>
				<div class="px-6 py-5 grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<p class="text-xs font-bold text-[#617289] dark:text-gray-400 uppercase tracking-wider mb-3">Điểm khách quan (mặc định 60%)</p>
						<div class="flex flex-col gap-2">
							<div v-for="item in objItems" :key="item.label" class="flex items-center gap-2">
								<div class="flex-1 bg-[#f0f2f4] dark:bg-gray-700 h-2 rounded-full overflow-hidden">
									<div class="h-full bg-pink-400 rounded-full" :style="{ width: item.weight + '%' }"></div>
								</div>
								<span class="text-xs text-[#111418] dark:text-white w-28 text-right">{{ item.label }}</span>
								<span class="text-xs font-bold text-pink-600 dark:text-pink-400 w-8 text-right">{{ item.weight }}%</span>
							</div>
						</div>
					</div>
					<div>
						<p class="text-xs font-bold text-[#617289] dark:text-gray-400 uppercase tracking-wider mb-3">Điểm chủ quan (mặc định 40%)</p>
						<div class="flex flex-col gap-2">
							<div v-for="item in designerSubItems" :key="item.label" class="flex items-center gap-2">
								<div class="flex-1 bg-[#f0f2f4] dark:bg-gray-700 h-2 rounded-full overflow-hidden">
									<div class="h-full bg-purple-400 rounded-full" :style="{ width: item.weight + '%' }"></div>
								</div>
								<span class="text-xs text-[#111418] dark:text-white w-36 text-right">{{ item.label }}</span>
								<span class="text-xs font-bold text-purple-600 dark:text-purple-400 w-8 text-right">{{ item.weight }}%</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Designer subjective criteria cards -->
			<div class="bg-white dark:bg-gray-800 rounded-xl border border-[#dbe0e6] dark:border-gray-700 overflow-hidden">
				<div class="px-6 py-4 border-b border-[#dbe0e6] dark:border-gray-700">
					<h3 class="font-bold text-[#111418] dark:text-white">Tiêu chí đánh giá chủ quan — Designer</h3>
				</div>
				<div class="divide-y divide-[#dbe0e6] dark:divide-gray-700">
					<div v-for="c in designerCriteria" :key="c.key" class="px-6 py-4 flex items-start gap-4">
						<div class="size-8 rounded-lg bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300 flex items-center justify-center text-xs font-black shrink-0">
							{{ c.weight }}%
						</div>
						<div class="flex-1">
							<p class="font-semibold text-sm text-[#111418] dark:text-white">{{ c.label }}</p>
							<p class="text-xs text-[#617289] dark:text-gray-400 mt-0.5">{{ c.description }}</p>
							<p class="text-xs text-pink-600 dark:text-pink-400 mt-1 italic">{{ c.scaleNote }}</p>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- BA tab -->
		<div v-else-if="activeTab === 'ba'" class="flex flex-col gap-6">
			<div class="bg-white dark:bg-gray-800 rounded-xl border border-[#dbe0e6] dark:border-gray-700 overflow-hidden">
				<div class="px-6 py-4 border-b border-[#dbe0e6] dark:border-gray-700">
					<h3 class="font-bold text-[#111418] dark:text-white">Targets theo Level — BA</h3>
					<p class="text-xs text-[#617289] dark:text-gray-400 mt-0.5">SP target thấp hơn Dev do tính chất công việc phân tích — áp dụng cho điểm khách quan (Jira)</p>
				</div>
				<div class="overflow-x-auto">
					<table class="w-full text-left border-collapse">
						<thead>
							<tr class="bg-[#f8f9fa] dark:bg-gray-900 border-b border-[#dbe0e6] dark:border-gray-700">
								<th class="px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#617289] dark:text-gray-400">Level</th>
								<th class="px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#617289] dark:text-gray-400 text-center">SP / tháng</th>
								<th class="px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#617289] dark:text-gray-400 text-center">Completion (%)</th>
								<th class="px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#617289] dark:text-gray-400 text-center">Time tối thiểu (h)</th>
								<th class="px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#617289] dark:text-gray-400 text-center">Bug Rate Max (%)</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-[#dbe0e6] dark:divide-gray-700">
							<tr v-for="level in levels" :key="level.key" class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
								<td class="px-5 py-3">
									<span class="text-xs font-semibold px-2 py-0.5 rounded-full capitalize" :class="level.badgeClass">{{ level.key }}</span>
								</td>
								<td class="px-5 py-3 text-center">
									<input v-model.number="editBaTargets[level.key].spPerMonth" type="number" min="1" step="1" v-bind="numInputClass" />
								</td>
								<td class="px-5 py-3 text-center">
									<input v-model.number="editBaTargets[level.key].completionRate" type="number" min="1" max="100" step="5" v-bind="numInputClass" />
								</td>
								<td class="px-5 py-3 text-center">
									<input v-model.number="editBaTargets[level.key].timeSpentMinHours" type="number" min="1" step="10" v-bind="numInputClass" />
								</td>
								<td class="px-5 py-3 text-center">
									<input v-model.number="editBaTargets[level.key].bugRateMax" type="number" min="0" max="100" step="1" v-bind="numInputClass" />
								</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div class="px-6 py-4 border-t border-[#dbe0e6] dark:border-gray-700 flex items-center gap-3">
					<button @click="handleSaveBa" class="px-4 py-2 bg-violet-500 hover:bg-violet-600 text-white text-sm font-semibold rounded-lg transition-colors">Lưu thay đổi</button>
					<button @click="handleResetBa" class="px-4 py-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-[#dbe0e6] dark:border-gray-600 text-[#111418] dark:text-white text-sm font-semibold rounded-lg transition-colors">Khôi phục mặc định</button>
					<span v-if="savedMsg" class="text-xs text-green-600 dark:text-green-400 font-semibold">{{ savedMsg }}</span>
				</div>
			</div>

			<!-- BA score formula -->
			<div class="bg-white dark:bg-gray-800 rounded-xl border border-[#dbe0e6] dark:border-gray-700 overflow-hidden">
				<div class="px-6 py-4 border-b border-[#dbe0e6] dark:border-gray-700">
					<h3 class="font-bold text-[#111418] dark:text-white">Công thức điểm — BA</h3>
					<p class="text-xs text-[#617289] dark:text-gray-400 mt-0.5">Tương tự Dev: 60% khách quan (Jira) + 40% chủ quan (PM)</p>
				</div>
				<div class="px-6 py-5 grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<p class="text-xs font-bold text-[#617289] dark:text-gray-400 uppercase tracking-wider mb-3">Điểm khách quan (mặc định 60%)</p>
						<div class="flex flex-col gap-2">
							<div v-for="item in objItems" :key="item.label" class="flex items-center gap-2">
								<div class="flex-1 bg-[#f0f2f4] dark:bg-gray-700 h-2 rounded-full overflow-hidden">
									<div class="h-full bg-violet-400 rounded-full" :style="{ width: item.weight + '%' }"></div>
								</div>
								<span class="text-xs text-[#111418] dark:text-white w-28 text-right">{{ item.label }}</span>
								<span class="text-xs font-bold text-violet-600 dark:text-violet-400 w-8 text-right">{{ item.weight }}%</span>
							</div>
						</div>
					</div>
					<div>
						<p class="text-xs font-bold text-[#617289] dark:text-gray-400 uppercase tracking-wider mb-3">Điểm chủ quan (mặc định 40%)</p>
						<div class="flex flex-col gap-2">
							<div v-for="item in baSubItems" :key="item.label" class="flex items-center gap-2">
								<div class="flex-1 bg-[#f0f2f4] dark:bg-gray-700 h-2 rounded-full overflow-hidden">
									<div class="h-full bg-purple-400 rounded-full" :style="{ width: item.weight + '%' }"></div>
								</div>
								<span class="text-xs text-[#111418] dark:text-white w-48 text-right">{{ item.label }}</span>
								<span class="text-xs font-bold text-purple-600 dark:text-purple-400 w-8 text-right">{{ item.weight }}%</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- BA subjective criteria cards -->
			<div class="bg-white dark:bg-gray-800 rounded-xl border border-[#dbe0e6] dark:border-gray-700 overflow-hidden">
				<div class="px-6 py-4 border-b border-[#dbe0e6] dark:border-gray-700">
					<h3 class="font-bold text-[#111418] dark:text-white">Tiêu chí đánh giá chủ quan — BA</h3>
				</div>
				<div class="divide-y divide-[#dbe0e6] dark:divide-gray-700">
					<div v-for="c in baCriteria" :key="c.key" class="px-6 py-4 flex items-start gap-4">
						<div class="size-8 rounded-lg bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 flex items-center justify-center text-xs font-black shrink-0">
							{{ c.weight }}%
						</div>
						<div class="flex-1">
							<p class="font-semibold text-sm text-[#111418] dark:text-white">{{ c.label }}</p>
							<p class="text-xs text-[#617289] dark:text-gray-400 mt-0.5">{{ c.description }}</p>
							<p class="text-xs text-violet-600 dark:text-violet-400 mt-1 italic">{{ c.scaleNote }}</p>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Tester tab -->
		<div v-else-if="activeTab === 'tester'" class="flex flex-col gap-6">
			<div class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl px-6 py-4">
				<p class="text-sm font-semibold text-amber-800 dark:text-amber-300">Điểm tổng = 100% đánh giá chủ quan</p>
				<p class="text-xs text-amber-700 dark:text-amber-400 mt-1">Tester không có điểm khách quan (Jira). Toàn bộ điểm đến từ 4 tiêu chí chủ quan được PM đánh giá từ 1–10.</p>
			</div>

			<div class="bg-white dark:bg-gray-800 rounded-xl border border-[#dbe0e6] dark:border-gray-700 overflow-hidden">
				<div class="px-6 py-4 border-b border-[#dbe0e6] dark:border-gray-700">
					<h3 class="font-bold text-[#111418] dark:text-white">Tiêu chí đánh giá — Tester</h3>
				</div>
				<div class="divide-y divide-[#dbe0e6] dark:divide-gray-700">
					<div v-for="c in testerCriteria" :key="c.key" class="px-6 py-4 flex items-start gap-4">
						<div class="size-8 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 flex items-center justify-center text-xs font-black shrink-0">
							{{ c.weight }}%
						</div>
						<div class="flex-1">
							<p class="font-semibold text-sm text-[#111418] dark:text-white">{{ c.label }}</p>
							<p class="text-xs text-[#617289] dark:text-gray-400 mt-0.5">{{ c.description }}</p>
							<p class="text-xs text-amber-600 dark:text-amber-400 mt-1 italic">{{ c.scaleNote }}</p>
						</div>
					</div>
				</div>
			</div>
		</div>

	</div>
</template>

<script setup lang="ts">
import { useKpiTargets } from '~/composables/useKpiTargets';
import { KPI_TARGETS, KPI_DESIGNER_TARGETS, KPI_BA_TARGETS } from '~/models/index';
import type { KpiTarget, MemberLevel } from '~/models/index';

const { devTargets, saveDev, resetDev, designerTargets, saveDesigner, resetDesigner, baTargets, saveBa, resetBa } = useKpiTargets();

const activeTab = ref<'dev' | 'designer' | 'ba' | 'tester'>('dev');

const tabs = [
	{ key: 'dev' as const, label: 'Dev' },
	{ key: 'designer' as const, label: 'Designer' },
	{ key: 'ba' as const, label: 'BA' },
	{ key: 'tester' as const, label: 'Tester' },
];

const editDevTargets = ref<Record<MemberLevel, KpiTarget>>(JSON.parse(JSON.stringify(devTargets.value)));
const editDesignerTargets = ref<Record<MemberLevel, KpiTarget>>(JSON.parse(JSON.stringify(designerTargets.value)));
const editBaTargets = ref<Record<MemberLevel, KpiTarget>>(JSON.parse(JSON.stringify(baTargets.value)));

const levels: { key: MemberLevel; badgeClass: string }[] = [
	{ key: 'intern',  badgeClass: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' },
	{ key: 'fresher', badgeClass: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' },
	{ key: 'junior',  badgeClass: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' },
	{ key: 'middle',  badgeClass: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' },
	{ key: 'senior',  badgeClass: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' },
];

const numInputClass = {
	class: 'w-20 text-center border border-[#dbe0e6] dark:border-gray-600 rounded-lg px-2 py-1 text-sm bg-white dark:bg-gray-700 text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500',
};

const savedMsg = ref('');

function showSaved(msg = 'Đã lưu!') {
	savedMsg.value = msg;
	setTimeout(() => { savedMsg.value = ''; }, 2000);
}

function handleSaveDev() {
	devTargets.value = JSON.parse(JSON.stringify(editDevTargets.value));
	saveDev();
	showSaved();
}

function handleResetDev() {
	if (!confirm('Khôi phục về giá trị mặc định cho Dev?')) return;
	resetDev();
	editDevTargets.value = JSON.parse(JSON.stringify(KPI_TARGETS));
	showSaved('Đã khôi phục mặc định');
}

function handleSaveDesigner() {
	designerTargets.value = JSON.parse(JSON.stringify(editDesignerTargets.value));
	saveDesigner();
	showSaved();
}

function handleResetDesigner() {
	if (!confirm('Khôi phục về giá trị mặc định cho Designer?')) return;
	resetDesigner();
	editDesignerTargets.value = JSON.parse(JSON.stringify(KPI_DESIGNER_TARGETS));
	showSaved('Đã khôi phục mặc định');
}

function handleSaveBa() {
	baTargets.value = JSON.parse(JSON.stringify(editBaTargets.value));
	saveBa();
	showSaved();
}

function handleResetBa() {
	if (!confirm('Khôi phục về giá trị mặc định cho BA?')) return;
	resetBa();
	editBaTargets.value = JSON.parse(JSON.stringify(KPI_BA_TARGETS));
	showSaved('Đã khôi phục mặc định');
}

const objItems = [
	{ label: 'Story Points', weight: 50 },
	{ label: 'SP Efficiency', weight: 30 },
	{ label: 'Completion Rate', weight: 20 },
];

const subItems = [
	{ label: 'Phản hồi', weight: 30 },
	{ label: 'Chất lượng', weight: 35 },
	{ label: 'Bug rate', weight: 20 },
	{ label: 'Teamwork', weight: 15 },
];

const baSubItems = [
	{ label: 'Giao tiếp & phản hồi stakeholder', weight: 30 },
	{ label: 'Chất lượng yêu cầu & giải pháp', weight: 35 },
	{ label: 'Tỉ lệ rework từ yêu cầu', weight: 20 },
	{ label: 'Teamwork & phối hợp', weight: 15 },
];

const designerSubItems = [
	{ label: 'Tiến độ & đúng hẹn', weight: 30 },
	{ label: 'Chất lượng thiết kế', weight: 35 },
	{ label: 'Chất lượng handoff', weight: 20 },
	{ label: 'Sáng tạo & phối hợp', weight: 15 },
];

const designerCriteria = [
	{
		key: 'response',
		label: 'Tiến độ & đúng hẹn',
		weight: 30,
		description: 'Khả năng hoàn thành task đúng deadline, phản hồi nhanh với feedback từ PM và developer, chủ động báo cáo tiến độ.',
		scaleNote: '10 = luôn đúng hẹn, phản hồi nhanh; 1 = thường trễ deadline, ít phản hồi',
	},
	{
		key: 'quality',
		label: 'Chất lượng thiết kế',
		weight: 35,
		description: 'Mức độ đáp ứng yêu cầu UX/UI, tính nhất quán với design system, khả năng giải quyết vấn đề người dùng qua thiết kế.',
		scaleNote: '10 = thiết kế rõ ràng, đúng spec, đẹp và usable; 1 = không đáp ứng yêu cầu, nhiều revision',
	},
	{
		key: 'bugRate',
		label: 'Chất lượng handoff',
		weight: 20,
		description: 'Mức độ đầy đủ và chính xác của tài liệu bàn giao cho dev (Figma inspect, spec, asset, trạng thái, interaction notes). Handoff kém gây nhiều lần hỏi lại.',
		scaleNote: '10 = handoff đầy đủ, dev không cần hỏi; 1 = thiếu spec, asset lỗi, dev phải guess',
	},
	{
		key: 'teamwork',
		label: 'Sáng tạo & phối hợp',
		weight: 15,
		description: 'Khả năng đề xuất giải pháp sáng tạo, chủ động phối hợp với BA/dev trong quá trình thiết kế, tham gia review và cải thiện trải nghiệm người dùng.',
		scaleNote: '10 = nhiều đề xuất giá trị, hợp tác tốt; 1 = thụ động, chỉ làm theo yêu cầu',
	},
];

const testerCriteria = [
	{
		key: 'response',
		label: 'Phản hồi & giao tiếp',
		weight: 30,
		description: 'Tốc độ và chất lượng phản hồi với team, PM, và developer trong quá trình kiểm thử.',
		scaleNote: '10 = phản hồi nhanh, rõ ràng; 1 = chậm hoặc thiếu thông tin',
	},
	{
		key: 'quality',
		label: 'Chất lượng test case',
		weight: 35,
		description: 'Mức độ rõ ràng, đầy đủ, có thể tái hiện và độ bao phủ của các test case được viết.',
		scaleNote: '10 = test case đầy đủ, có thể chạy lại; 1 = thiếu điều kiện, mô tả mơ hồ',
	},
	{
		key: 'bugRate',
		label: 'Khả năng tìm bug',
		weight: 20,
		description: 'Số lượng và mức độ nghiêm trọng của bug phát hiện được, đặc biệt là bug ảnh hưởng đến user.',
		scaleNote: '10 = phát hiện nhiều bug quan trọng; 1 = bỏ sót bug nghiêm trọng',
	},
	{
		key: 'teamwork',
		label: 'Teamwork & phối hợp',
		weight: 15,
		description: 'Khả năng làm việc nhóm, hỗ trợ dev tái hiện bug, phối hợp với PM trong sprint review.',
		scaleNote: '10 = chủ động hỗ trợ, phối hợp tốt; 1 = thụ động, ít giao tiếp',
	},
];

const baCriteria = [
	{
		key: 'response',
		label: 'Giao tiếp & phản hồi stakeholder',
		weight: 30,
		description: 'Khả năng lắng nghe, diễn đạt rõ ràng và duy trì kênh thông tin giữa business và team kỹ thuật.',
		scaleNote: '10 = phản hồi nhanh, bridging tốt; 1 = mất kênh, thông tin sai',
	},
	{
		key: 'quality',
		label: 'Chất lượng yêu cầu & giải pháp',
		weight: 35,
		description: 'Tính rõ ràng, đầy đủ, khả thi và không mâu thuẫn của tài liệu yêu cầu (BRD, user story, acceptance criteria).',
		scaleNote: '10 = tài liệu hoàn chỉnh, team không cần hỏi lại; 1 = mơ hồ, thiếu AC',
	},
	{
		key: 'bugRate',
		label: 'Tỉ lệ rework từ yêu cầu',
		weight: 20,
		description: 'Mức độ ổn định của yêu cầu sau khi đã được sign-off. Rework nhiều = yêu cầu thiếu rõ ràng hoặc thay đổi liên tục.',
		scaleNote: '10 = ít rework, yêu cầu ổn định; 1 = liên tục thay đổi yêu cầu',
	},
	{
		key: 'teamwork',
		label: 'Teamwork & phối hợp',
		weight: 15,
		description: 'Hỗ trợ team trong sprint planning, clarification session, và phối hợp với tester trong UAT.',
		scaleNote: '10 = chủ động, hỗ trợ tốt; 1 = không phối hợp, blocking team',
	},
];
</script>
