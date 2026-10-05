<script setup lang="ts">
	defineProps<{
		pages: number;
		current: number;
		selectPage: (index: number) => void;
	}>();
</script>

<template>
	<div class="phone_pagination">
		<ul class="phone_pagination-list">
			<li
				v-for="item in pages"
				:key="item"
				:class="['phone_pagination-item', { active: current === item - 1 }]"
				@click="selectPage(item - 1)"
			>
				{{ item }}
			</li>
		</ul>
	</div>
</template>
