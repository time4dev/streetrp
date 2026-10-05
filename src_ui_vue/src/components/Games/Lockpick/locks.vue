<script setup lang="ts">
	import { IoIosLock, IoIosUnlock } from '@/utils/icons';

	defineProps<{
		amount: number;
		opened: number;
	}>();
</script>

<template>
	<div class="lockpick_locks">
		<ul class="lockpick_locks-list">
			<li
				v-for="(item, index) in [...Array(amount).keys()]"
				:key="item"
				:class="['lockpick_locks-item', { active: opened > index }]"
			>
				<IoIosUnlock v-if="opened > index" />
				<IoIosLock v-else />
			</li>
		</ul>
	</div>
</template>
