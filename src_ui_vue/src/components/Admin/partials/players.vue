<script setup lang="ts">
	import { onMounted, ref } from 'vue';
	import rpc from '@/utils/rpc';
	import Select from './select.vue';

	type Player = {
		dbId: string;
		id: number;
		name: string;
	};
	type Option = {
		value: number;
		label: string;
		dbId: string;
	};

	const props = defineProps<{
		onChange: (data: Omit<Player, 'name'>) => void;
	}>();

	const options = ref<Option[]>([]);
	const selected = ref<Option | null>(null);

	async function fetchPlayers() {
		if (options.value.length > 0) return;

		const data: Player[] = await rpc.callServer('Admin-GetPlayers');
		const prepared = data.map((item) => ({
			value: item.id,
			label: `${item.name} (${item.id})`,
			dbId: item.dbId
		}));

		options.value = prepared;
	}

	function selectPlayer(data: Option | null) {
		selected.value = data;

		if (data) {
			props.onChange({ dbId: data.dbId, id: data.value });
		}
	}
</script>

<template>
	<div class="admin_players">
		<Select
			className="admin_select"
			className-prefix="admin_select"
			placeholder="Игрок"
			:options="options"
			:no-options-message="() => 'Не найден'"
			:on-menu-open="fetchPlayers"
			@change="(data: any) => selectPlayer(data)"
		/>
	</div>
</template>
