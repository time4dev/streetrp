<script setup lang="ts">
	import type { FunctionalComponent } from 'vue';

	type Control = {
		name: string;
		label: string;
		icon: FunctionalComponent;
	};

	defineProps<{
		items: Control[];
		onClick: (type: string) => void;
	}>();
</script>

<template>
	<div class="call_controls">
		<button
			v-for="item in items"
			:key="item.name"
			:class="['call_controls-item', `call_controls-item--${item.name}`]"
			@click="onClick(item.name)"
		>
			<i class="icon">
				<component :is="item.icon" />
			</i>
			{{ item.label }}
		</button>
	</div>
</template>
