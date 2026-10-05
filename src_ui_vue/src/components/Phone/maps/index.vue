<script setup lang="ts">
	import { onMounted, ref } from 'vue';
	import rpc from '@/utils/rpc';
	import Title from '../partials/title.vue';
	import SearchInput from '../partials/search.vue';
	import Group from '../partials/group.vue';
	import Button from '../partials/button.vue';

	const items = ref<string[]>([]);
	const selected = ref<string | undefined>(undefined);
	const searchValue = ref('');

	onMounted(() => {
		rpc.callServer('Blips-GetNames').then((names: string[]) => {
			items.value = names.sort();
		});
	});

	async function showNearestItem(name: string) {
		await rpc.callServer('Blips-MarkNearest', name);

		selected.value = name;
	}

	function getFilteredItems() {
		return items.value.filter(
			(item) => item.toLowerCase().indexOf(searchValue.value.toLowerCase()) !== -1
		);
	}
</script>

<template>
	<div class="maps">
		<div class="maps_header">
			<Title>Список мест</Title>

			<SearchInput
				placeholder="Поиск"
				:value="searchValue"
				@change="(value: string) => (searchValue = value)"
			/>
		</div>

		<Group className="maps_list">
			<Button
				v-for="(item, index) in getFilteredItems()"
				:key="index"
				:icon="selected === item ? 'check' : undefined"
				:on-click="() => showNearestItem(item)"
			>
				{{ item }}
			</Button>
		</Group>
	</div>
</template>
