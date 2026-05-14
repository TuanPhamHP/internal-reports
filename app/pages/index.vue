<template>
	<div class="px-6 py-8 max-w-4xl mx-auto">
		<!-- Welcome header -->
		<div class="mb-8">
			<h1 class="text-2xl font-black text-[#111418] dark:text-white">Dashboard</h1>
			<p class="text-sm text-[#617289] dark:text-gray-400 mt-1">Chọn công cụ từ sidebar hoặc nhấn nhanh bên dưới</p>
		</div>

		<!-- Tool cards -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<button
				v-for="tool in tools"
				:key="tool.route"
				@click="$router.push(tool.route)"
				class="group text-left p-5 bg-white dark:bg-gray-800 rounded-xl border border-[#dbe0e6] dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-md transition-all duration-150"
			>
				<div
					class="size-10 rounded-lg flex items-center justify-center mb-4"
					:class="tool.iconBg"
				>
					<svg class="w-5 h-5" :class="tool.iconColor" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" :d="tool.icon" />
					</svg>
				</div>
				<h3 class="font-bold text-[#111418] dark:text-white text-sm mb-1">{{ tool.title }}</h3>
				<p class="text-xs text-[#617289] dark:text-gray-400 leading-relaxed">{{ tool.description }}</p>
				<div class="mt-4 flex items-center gap-1 text-xs font-semibold" :class="tool.linkColor">
					Mở
					<svg class="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
						<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
					</svg>
				</div>
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
	const tools = [
		{
			title: 'Báo cáo Developers',
			description: 'Import CSV từ Jira để xem báo cáo hiệu suất hàng tháng — story points, time spent, tiến độ task và phân bổ theo epic.',
			route: '/reports/developers',
			icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
			iconBg: 'bg-indigo-100 dark:bg-indigo-900/40',
			iconColor: 'text-indigo-600 dark:text-indigo-400',
			linkColor: 'text-indigo-600 dark:text-indigo-400',
		},
		{
			title: 'KPI Bonus Calculator',
			description: 'Tính thưởng dự án theo KPI cho dev, tester và BA. Hỗ trợ import Jira CSV, hệ số cống hiến và phân bổ thưởng tự động.',
			route: '/reports/kpi-bonus',
			icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01',
			iconBg: 'bg-green-100 dark:bg-green-900/40',
			iconColor: 'text-green-600 dark:text-green-400',
			linkColor: 'text-green-600 dark:text-green-400',
		},
		{
			title: 'Cấu hình KPI',
			description: 'Thiết lập targets SP, completion rate và time log cho từng level. Xem chi tiết tiêu chí đánh giá theo vị trí Dev, Tester, BA.',
			route: '/reports/kpi-settings',
			icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z',
			iconBg: 'bg-violet-100 dark:bg-violet-900/40',
			iconColor: 'text-violet-600 dark:text-violet-400',
			linkColor: 'text-violet-600 dark:text-violet-400',
		},
	];
</script>
