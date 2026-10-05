<script setup lang="ts">
	import { reactive, watch } from 'vue';
	import rpc from '@/utils/rpc';
	import images from '@/utils/images';

	type State = {
		tank: number;
		trunk: {
			cells: number;
			slots: number;
		};
	};

	const props = defineProps<{
		model: string;
	}>();

	const state = reactive<State>({
		tank: 0,
		trunk: { cells: 0, slots: 0 }
	});

	watch(
		() => props.model,
		(model) => {
			rpc
				.callServer('Vehicle-GetInfo', model)
				.then(({ tank, trunk }: State) => Object.assign(state, { tank, trunk }));
		},
		{ immediate: true }
	);
</script>

<template>
	<div class="vehicle-shop_info">
		<div class="vehicle-shop_info-item">
			<img :src="images.getImage('trunk.svg')" alt="trunk" />

			<span class="vehicle-shop_info-value">
				<b>{{ state.trunk.slots }}</b> кг
			</span>
		</div>

		<div class="vehicle-shop_info-item">
			<img :src="images.getImage('tank.svg')" alt="tank" />

			<span class="vehicle-shop_info-value">
				<b>{{ state.tank }}</b> л
			</span>
		</div>
	</div>
</template>
