<script setup lang="ts">
	import { reactive, watch } from 'vue';
	import rpc from '@/utils/rpc';
	import images from '@/utils/images';

	const items: { [name: string]: string } = {
		speed: 'Скорость',
		acceleration: 'Ускорение',
		brakes: 'Торможение',
		clutch: 'Управление'
	};

	type State = {
		speed: number;
		acceleration: number;
		brakes: number;
		clutch: number;
	};

	const props = defineProps<{
		model: string;
	}>();

	const state = reactive<State>({
		speed: 0,
		acceleration: 0,
		brakes: 0,
		clutch: 0
	});

	// [...Array(4).keys()] from the legacy render
	const parts = [...Array(4).keys()];

	watch(
		() => props.model,
		(model) => {
			rpc.callClient('Vehicle-GetSpec', model).then((data: State) => Object.assign(state, data));
		},
		{ immediate: true }
	);
</script>

<template>
	<div class="vehicle-shop_spec">
		<div v-for="(value, name) in state" :key="name" class="vehicle-shop_spec-item">
			<img :src="images.getImage(`${name}.svg`)" :alt="name" />

			<div class="bar">
				<div class="bar_container">
					<progress
						v-for="item in parts"
						:key="item"
						class="bar_part"
						:value="value <= item * 25 ? 0 : value"
						:max="(item + 1) * 25"
					/>
				</div>

				<h4 class="bar_title">{{ items[name] }}</h4>
			</div>
		</div>
	</div>
</template>
