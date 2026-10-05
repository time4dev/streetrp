<script setup lang="ts">
	defineProps<{
		addToNumber: (key: string) => void;
	}>();
</script>

<template>
	<ul class="phone_keypad-list">
		<li
			v-for="index in 10"
			:key="index"
			class="phone_keypad-item"
			@click="addToNumber(String(index - 1))"
		>
			{{ index - 1 }}
		</li>
	</ul>
</template>
