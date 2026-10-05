<script setup lang="ts">
	import { IoIosCall, IoIosBackspace } from '@/utils/icons';

	defineProps<{
		phoneNumber: string;
		callNumber: () => void;
		deleteFromNumber: () => void;
	}>();
</script>

<template>
	<div class="phone_keypad-controls">
		<button class="phone_keypad-submit" @click="callNumber">
			<i class="icon">
				<IoIosCall />
			</i>
		</button>

		<button
			v-if="phoneNumber.length"
			class="phone_keypad-delete"
			@click="deleteFromNumber"
		>
			<IoIosBackspace />
		</button>
	</div>
</template>
