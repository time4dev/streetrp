<script setup lang="ts">
	import rpc from '@/utils/rpc';

	withDefaults(
		defineProps<{
			type?: 'button' | 'submit' | 'reset';
			className?: string;
			disabled?: boolean;
			form?: string;
			isClose?: boolean;
		}>(),
		{}
	);

	const emit = defineEmits<{ click: [] }>();

	function handleClick(isClose?: boolean) {
		if (isClose) rpc.callClient('Browser-HidePage');
		else emit('click');
	}
</script>

<template>
	<button
		:class="['outline-btn', className]"
		:type="type"
		:form="form"
		:disabled="disabled"
		@click="handleClick(isClose)"
	>
		<slot />
	</button>
</template>
