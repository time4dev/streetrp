<script setup lang="ts">
	import { computed } from 'vue';
	import images from '@/utils/images';
	import Key from '../key.vue';

	const props = defineProps<{
		cruise: boolean;
		engine: boolean;
		lock: boolean;
		seatbelt: boolean;
		binds: {
			[name: string]: string;
		};
	}>();

	const items = {
		cruise: 'X',
		engine: 'Alt',
		lock: 'L',
		seatbelt: 'G'
	};

	// Legacy: (props as any)[name]
	const states = computed<Record<string, boolean>>(() => ({
		cruise: props.cruise,
		engine: props.engine,
		lock: props.lock,
		seatbelt: props.seatbelt
	}));

	function iconSrc(name: string) {
		return `${images.getImage(`${name}.svg`)}#icon`;
	}
</script>

<template>
	<div class="speedometer_controls">
		<div
			v-for="(title, name) in items"
			:key="name"
			:class="['speedometer_controls-item', { active: states[name] }]"
		>
			<svg class="icon">
				<use :href="iconSrc(name)" />
			</svg>

			<Key>{{ binds[name] ?? title }}</Key>
		</div>
	</div>
</template>
