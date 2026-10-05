<script setup lang="ts">
	import { computed } from 'vue';
	import { indexOf } from 'lodash-es';
	import { FaChevronCircleLeft, FaChevronCircleRight, FaChevronLeft, FaChevronRight } from '@/utils/icons';

	const props = withDefaults(
		defineProps<{
			items: number[] | string[];
			value: number | string;
			circleButton?: boolean;
			customValue?: string;
			title?: string;
			className?: string;
		}>(),
		{}
	);

	const emit = defineEmits<{ change: [value: any] }>();

	const index = computed(() => indexOf(props.items as any[], props.value as any));

	function nextItem() {
		const { items } = props;

		if (items.length > 1) {
			emit('change', index.value === items.length - 1 ? items[0] : items[index.value + 1]);
		}
	}

	function previousItem() {
		const { items } = props;

		if (items.length > 1) {
			emit('change', index.value === 0 ? items[items.length - 1] : items[index.value - 1]);
		}
	}
</script>

<template>
	<div :class="['selector', className]">
		<h4 v-if="title" class="title">{{ title }}</h4>

		<div class="container">
			<button @click="previousItem">
				<FaChevronCircleLeft v-if="circleButton" />
				<FaChevronLeft v-else />
			</button>

			<span class="value">{{ customValue ?? value }}</span>

			<button @click="nextItem">
				<FaChevronCircleRight v-if="circleButton" />
				<FaChevronRight v-else />
			</button>
		</div>
	</div>
</template>
