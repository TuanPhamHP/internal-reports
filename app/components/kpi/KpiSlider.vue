<template>
	<div class="flex flex-col gap-2">
		<div class="flex items-center justify-between">
			<div>
				<p class="text-sm font-semibold text-[#111418] dark:text-white">{{ label }}</p>
				<p v-if="description" class="text-xs text-[#617289] dark:text-gray-400">{{ description }}</p>
			</div>
			<span
				class="text-lg font-black w-8 text-center"
				:class="modelValue >= 8 ? 'text-green-600' : modelValue >= 6 ? 'text-yellow-600' : 'text-red-500'"
			>
				{{ modelValue }}
			</span>
		</div>
		<input
			:value="modelValue"
			@input="$emit('update:modelValue', Number(($event.target as HTMLInputElement).value))"
			type="range"
			min="1"
			max="10"
			step="1"
			class="w-full accent-indigo-500"
		/>
		<div class="flex justify-between text-xs text-[#617289] dark:text-gray-400">
			<span>1 — Kém</span><span>5 — TB</span><span>10 — Xuất sắc</span>
		</div>
		<button
			@click="showNote = !showNote"
			class="text-xs text-indigo-500 hover:underline self-start"
		>
			{{ showNote ? 'Ẩn ghi chú' : '+ Ghi chú' }}
		</button>
		<textarea
			v-if="showNote"
			:value="note ?? ''"
			@input="$emit('update:note', ($event.target as HTMLTextAreaElement).value)"
			rows="2"
			placeholder="Ghi chú..."
			class="text-xs border border-[#dbe0e6] dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-[#111418] dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
		/>
	</div>
</template>

<script setup lang="ts">
const showNote = ref(false);
defineProps<{
	label: string;
	description?: string;
	modelValue: number;
	note?: string;
}>();
defineEmits<{
	'update:modelValue': [value: number];
	'update:note': [value: string];
}>();
</script>
