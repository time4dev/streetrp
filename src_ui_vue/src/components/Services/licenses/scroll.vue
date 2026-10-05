<script setup lang="ts">
	import { FaChevronLeft, FaChevronRight } from '@/utils/icons';

	const props = defineProps<{
		list?: HTMLDivElement | null;
	}>();

	function scroll(isForward: boolean) {
		if (!props.list) return;

		const size = (props.list.scrollWidth * 30) / 100;
		const currentPos = props.list.scrollLeft;
		const futurePos = size + currentPos;

		props.list.scrollTo({
			left: isForward ? futurePos : -futurePos,
			behavior: 'smooth'
		});
	}
</script>

<template>
	<div class="licenses_scroll">
		<button class="licenses_scroll-btn" @click="scroll(false)">
			<FaChevronLeft />
		</button>

		<button class="licenses_scroll-btn" @click="scroll(true)">
			<FaChevronRight />
		</button>
	</div>
</template>
