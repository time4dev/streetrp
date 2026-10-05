<script setup lang="ts">
	import { IoIosSearch, IoIosCloseCircle } from '@/utils/icons';

	const props = withDefaults(
		defineProps<{
			value: string;
			placeholder: string;
			className?: string;
		}>(),
		{}
	);

	const emit = defineEmits<{ change: [value: string] }>();

	function onInput(event: Event) {
		emit('change', (event.target as HTMLInputElement).value);
	}
</script>

<template>
	<label :class="['phone_search', className]">
		<IoIosSearch className="phone_search-icon" />

		<input
			type="text"
			:value="value"
			:placeholder="placeholder"
			@input="onInput"
		/>

		<IoIosCloseCircle
			v-if="value"
			className="phone_search-close"
			@click="emit('change', '')"
		/>
	</label>
</template>
