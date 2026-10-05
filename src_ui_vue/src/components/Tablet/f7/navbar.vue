<script setup lang="ts">
	import { useTabletRouter } from '@/composables/use-tablet-router';

	// framework7-react <Navbar>
	const props = withDefaults(
		defineProps<{
			title?: string;
			backLink?: string;
		}>(),
		{
			title: '',
			backLink: ''
		}
	);

	const emit = defineEmits<{ 'back-click': [] }>();

	const router = useTabletRouter();

	function onBack() {
		emit('back-click');

		router.back();
	}
</script>

<template>
	<div class="navbar">
		<div class="navbar-bg"></div>

		<div class="navbar-inner">
			<div v-if="backLink" class="left">
				<a class="link back" @click="onBack">
					<i class="icon icon-back"></i>
					<span>{{ backLink }}</span>
				</a>
			</div>

			<div class="title">{{ title }}</div>

			<div class="right"></div>
		</div>
	</div>
</template>
