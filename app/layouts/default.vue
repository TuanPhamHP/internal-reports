<template>
	<div class="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">
		<!-- Mobile overlay -->
		<div
			v-if="sidebarOpen"
			class="fixed inset-0 z-20 bg-black/50 lg:hidden"
			@click="sidebarOpen = false"
		/>

		<!-- Sidebar -->
		<aside
			class="fixed inset-y-0 left-0 z-30 w-60 bg-[#111827] flex flex-col transition-transform duration-200 ease-in-out"
			:class="sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
		>
			<!-- Brand -->
			<div class="px-5 py-5 border-b border-white/10 shrink-0">
				<div class="flex items-center gap-2.5">
					<div class="size-8 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
						<svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
						</svg>
					</div>
					<div>
						<p class="text-white font-bold text-sm leading-tight">Nội bộ nhà làm</p>
						<p class="text-gray-500 text-[11px] leading-tight">Internal Tools</p>
					</div>
				</div>
			</div>

			<!-- Navigation -->
			<nav class="flex-1 px-3 py-4 overflow-y-auto flex flex-col gap-0.5">
				<NuxtLink
					to="/"
					class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
					:class="route.path === '/' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'"
				>
					<svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
					</svg>
					Dashboard
				</NuxtLink>

				<p class="text-[10px] font-bold uppercase tracking-widest text-gray-600 px-3 pt-4 pb-1">Báo cáo</p>

				<NuxtLink
					to="/reports/developers"
					class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
					:class="route.path.startsWith('/reports/developers') ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'"
				>
					<svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
					</svg>
					Báo cáo Developers
				</NuxtLink>

				<NuxtLink
					to="/reports/kpi-bonus"
					class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
					:class="route.path.startsWith('/reports/kpi-bonus') ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'"
				>
					<svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
					</svg>
					KPI Bonus
				</NuxtLink>

				<p class="text-[10px] font-bold uppercase tracking-widest text-gray-600 px-3 pt-4 pb-1">Cài đặt</p>

				<NuxtLink
					to="/reports/kpi-settings"
					class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
					:class="route.path.startsWith('/reports/kpi-settings') ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'"
				>
					<svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z" />
					</svg>
					Cấu hình KPI
				</NuxtLink>
			</nav>

			<!-- Footer -->
			<div class="px-5 py-4 border-t border-white/10 shrink-0">
				<p class="text-[11px] text-gray-600">v1.0 · Client-side only</p>
			</div>
		</aside>

		<!-- Content area -->
		<div class="flex-1 flex flex-col lg:ml-60 min-w-0">
			<!-- Mobile top bar -->
			<header class="lg:hidden flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-900 border-b border-[#dbe0e6] dark:border-gray-700 shrink-0">
				<button
					@click="sidebarOpen = true"
					class="p-1.5 rounded-lg text-[#617289] dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
				>
					<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
					</svg>
				</button>
				<span class="font-bold text-sm text-[#111418] dark:text-white">Nội bộ nhà làm</span>
			</header>

			<!-- Page content -->
			<main class="flex-1 overflow-y-auto">
				<slot />
			</main>
		</div>
	</div>
</template>

<script setup lang="ts">
	const route = useRoute();
	const sidebarOpen = ref(false);

	watch(() => route.path, () => { sidebarOpen.value = false; });
</script>
