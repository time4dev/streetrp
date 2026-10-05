<script setup lang="ts">
	import { useTabletRouter } from '@/composables/use-tablet-router';

	// framework7-react <ListButton>
	const props = withDefaults(
		defineProps<{
			title: string;
			color?: string;
			link?: string;
			routeProps?: Record<string, any>;
		}>(),
		{
			color: '',
			link: '',
			routeProps: undefined
		}
	);

	const emit = defineEmits<{ click: [] }>();

	const router = useTabletRouter();

	function onClick() {
		if (props.link && props.link !== '#') {
			router.navigate(props.link, props.routeProps);
			return;
		}

		emit('click');
	}
</script>

<template>
	<li>
		<button
			:class="['item-link', 'list-button', color && `color-${color}`]"
			type="button"
			@click="onClick"
		>
			{{ title }}
		</button>
	</li>
</template>
