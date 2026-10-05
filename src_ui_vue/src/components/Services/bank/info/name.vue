<script setup lang="ts">
	defineProps<{
		firstName: string;
		lastName: string;
	}>();
</script>

<template>
	<div class="bank_info-name">
		<span class="initials">{{ firstName[0] }}{{ lastName[0] }}</span>

		<div class="fullname">
			<span>{{ firstName }}</span> <span>{{ lastName }}</span>
		</div>
	</div>
</template>
