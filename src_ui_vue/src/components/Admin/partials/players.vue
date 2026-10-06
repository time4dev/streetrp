<script setup lang="ts">
	import { ref } from 'vue';
	import Select from 'primevue/select';
	import rpc from '@/utils/rpc';

	export type PlayerOption = {
		id: number;
		dbId: string;
		name: string;
		label: string;
	};

	withDefaults(
		defineProps<{
			placeholder?: string;
			invalid?: boolean;
		}>(),
		{
			placeholder: 'Выберите игрока',
			invalid: false
		}
	);

	const emit = defineEmits<{ select: [player: PlayerOption | null] }>();

	const options = ref<PlayerOption[]>([]);
	const selected = ref<PlayerOption | null>(null);
	const loading = ref(false);
	let loaded = false;

	async function loadOptions() {
		if (loaded || loading.value) return;

		loading.value = true;

		try {
			const data = (await rpc.callServer('Admin-GetPlayers')) as {
				id: number;
				dbId: string;
				name: string;
			}[];

			options.value = data.map((item) => ({
				id: item.id,
				dbId: item.dbId,
				name: item.name,
				label: `${item.name} (${item.id})`
			}));
			loaded = true;
		} finally {
			loading.value = false;
		}
	}

	function onChange(value: PlayerOption | null) {
		selected.value = value;
		emit('select', value ?? null);
	}
</script>

<template>
	<Select
		:model-value="selected"
		:options="options"
		option-label="label"
		:placeholder="placeholder"
		:loading="loading"
		:invalid="invalid"
		filter
		show-clear
		@show="loadOptions"
		@update:model-value="onChange"
	/>
</template>
