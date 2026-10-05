<script setup lang="ts">
	import { computed } from 'vue';
	import { FaStar, FaRegStar } from '@/utils/icons';

	const props = defineProps<{
		type: string;
	}>();

	const types = ['low', 'average', 'premium'];

	const level = computed(() => types.indexOf(props.type.split('_')[0]));
</script>

<template>
	<div class="house_quality">
		<div
			v-for="(item, index) in types"
			:key="item"
			:class="['house_quality-item', { disabled: level < index }]"
		>
			<FaStar v-if="level >= index" />
			<FaRegStar v-else />
		</div>
	</div>
</template>
