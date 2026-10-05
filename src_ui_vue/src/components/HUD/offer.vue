<script setup lang="ts">
	import { onBeforeUnmount, onMounted, reactive } from 'vue';
	import rpc from '@/utils/rpc';

	type Offer = {
		seller: string;
		text: string;
	};

	const state = reactive<Offer>({
		seller: '',
		text: ''
	});

	onMounted(() => {
		rpc.register('HUD-ShowOffer', (data: Partial<Offer>) => Object.assign(state, data));
	});

	onBeforeUnmount(() => {
		rpc.unregister('HUD-ShowOffer');
	});
</script>

<template>
	<Transition name="slideRight">
		<div v-if="state.seller && state.text" class="hud_offer">
			<div class="hud_offer-seller">{{ state.seller }}</div>

			<p class="hud_offer-text">{{ state.text }}</p>

			<p class="hud_offer-desc">
				Нажмите <b>«Y»</b>, чтобы согласиться. Для отказа - <b>«N»</b>.
			</p>
		</div>
	</Transition>
</template>
