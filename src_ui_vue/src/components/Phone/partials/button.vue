<script setup lang="ts">
	import { IoIosArrowForward, MdCheck } from '@/utils/icons';

	withDefaults(
		defineProps<{
			className?: string;
			current?: string;
			icon?: 'arrow' | 'check';
			color?: 'red' | 'blue';
			onClick?: () => void;
		}>(),
		{}
	);
</script>

<template>
	<div
		:class="[
			'phone_button',
			className,
			color && `phone_button--${color}`,
			{ 'phone_button--disabled': !onClick }
		]"
		@click="onClick && onClick()"
	>
		<slot />

		<span class="phone_button-selected">{{ current }}</span>

		<span v-if="icon" :class="['phone_button-icon', `phone_button-icon--${icon}`]">
			<IoIosArrowForward v-if="icon === 'arrow'" />
			<MdCheck v-else />
		</span>
	</div>
</template>
