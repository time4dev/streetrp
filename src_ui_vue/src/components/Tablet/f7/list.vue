<script setup lang="ts">
	// framework7-react <List>
	withDefaults(
		defineProps<{
			inset?: boolean;
			mediaList?: boolean;
			accordionList?: boolean;
			noChevron?: boolean;
		}>(),
		{
			inset: false,
			mediaList: false,
			accordionList: false,
			noChevron: false
		}
	);
</script>

<template>
	<div
		:class="[
			'list',
			{
				inset,
				'media-list': mediaList,
				'accordion-list': accordionList,
				'no-chevron': noChevron
			}
		]"
	>
		<ul>
			<slot />
		</ul>
	</div>
</template>
