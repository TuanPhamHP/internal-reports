<template>
	<div class="bg-white dark:bg-gray-800 rounded-xl border border-[#dbe0e6] dark:border-gray-700 p-5">
		<h3 class="text-sm font-bold text-[#111418] dark:text-white mb-4">{{ title }}</h3>
		<div class="flex flex-col gap-3">
			<div v-for="(_, key) in weights" :key="key" class="flex items-center gap-3">
				<label class="text-sm text-[#617289] dark:text-gray-400 w-48 shrink-0">{{ labels[key] ?? key }}</label>
				<input
					:value="weights[key]"
					@input="onInput(key, ($event.target as HTMLInputElement).value)"
					type="number"
					min="0"
					max="100"
					class="w-20 border border-[#dbe0e6] dark:border-gray-600 rounded-lg px-2 py-1.5 text-sm bg-white dark:bg-gray-900 text-[#111418] dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-right"
				/>
				<span class="text-sm text-[#617289] dark:text-gray-400">%</span>
			</div>
		</div>
		<div class="mt-4 pt-3 border-t border-[#dbe0e6] dark:border-gray-700 flex items-center gap-2">
			<span class="text-sm text-[#617289] dark:text-gray-400">Tổng:</span>
			<span
				class="text-sm font-bold"
				:class="total === 100 ? 'text-green-600' : 'text-red-500'"
			>{{ total }}%</span>
			<span v-if="total !== 100" class="text-xs text-red-500">⚠ Phải bằng 100%</span>
		</div>
	</div>
</template>

<script setup lang="ts">
const props = defineProps<{
	title: string;
	weights: Record<string, number>;
	labels: Record<string, string>;
}>();
const emit = defineEmits<{ 'update:weights': [value: Record<string, number>] }>();

const total = computed(() => Object.values(props.weights).reduce((s, v) => s + v, 0));

function onInput(key: string, raw: string) {
	const val = Math.max(0, Math.min(100, Number(raw) || 0));
	emit('update:weights', { ...props.weights, [key]: val });
}
</script>
