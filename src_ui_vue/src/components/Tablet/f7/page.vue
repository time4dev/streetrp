<script setup lang="ts">
	import { ref } from 'vue';

	// framework7-react <Page> with pageContent=true (default):
	// fixed elements outside, everything else inside .page-content
	const props = withDefaults(
		defineProps<{
			name?: string;
			infinite?: boolean;
			infinitePreloader?: boolean;
		}>(),
		{
			name: undefined,
			infinite: false,
			infinitePreloader: false
		}
	);

	const emit = defineEmits<{ infinite: [] }>();

	const contentEl = ref<HTMLElement>();

	// F7 infinite scroll: near bottom (default 50px distance) -> onInfinite
	function onScroll() {
		if (!props.infinite || !contentEl.value) return;

		const el = contentEl.value;

		if (el.scrollHeight - el.scrollTop - el.clientHeight < 50) emit('infinite');
	}
</script>

<template>
	<div class="page" :data-name="name">
		<slot name="fixed" />

		<div
			ref="contentEl"
			:class="['page-content', { 'infinite-scroll-content': infinite }]"
			@scroll="onScroll"
		>
			<slot />

			<span
				v-if="infinite && infinitePreloader"
				class="preloader infinite-scroll-preloader"
			>
				<span class="preloader-inner">
					<span v-for="line in 8" :key="line" class="preloader-inner-line" />
				</span>
			</span>
		</div>
	</div>
</template>
