<script setup lang="ts">
	import { IoIosText, IoIosCall, IoIosMail } from '@/utils/icons';

	defineProps<{
		onClick: (type: string) => void;
	}>();

	const controls: Record<string, { label: string; icon: any }> = {
		message: {
			label: 'Написать',
			icon: IoIosText
		},
		call: {
			label: 'Сотовый',
			icon: IoIosCall
		},
		mail: {
			label: 'E-mail',
			icon: IoIosMail
		}
	};
</script>

<template>
	<div class="controls">
		<button
			v-for="(item, type) in controls"
			:key="type"
			class="controls_item"
			@click="onClick(String(type))"
		>
			<i class="icon">
				<component :is="item.icon" />
			</i>
			{{ item.label }}
		</button>
	</div>
</template>
