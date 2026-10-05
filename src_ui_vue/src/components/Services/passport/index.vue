<script setup lang="ts">
	import { onMounted, reactive } from 'vue';
	import { capitalize, trim } from 'lodash-es';
	import rpc from '@/utils/rpc';
	import { showNotification } from '@/utils/notifications';
	import GradientButton from '@/components/Common/gradient-button.vue';
	import OutlineButton from '@/components/Common/outline-button.vue';
	import PrimaryTitle from '@/components/Common/primary-title.vue';
	import Point from '@/components/Common/point.vue';
	import Form from './form.vue';

	type State = {
		name: string;
		price: number;
	};

	const state = reactive<State>({
		name: '',
		price: 0
	});

	onMounted(() => {
		// vue-router keeps its own navigation keys in history.state — copy only the page data
		const { back, current, forward, replaced, position, scroll, ...data } =
			history.state as Record<string, any>;

		Object.assign(state, data);
	});

	async function buy(firstName: string, lastName: string) {
		try {
			const data = {
				firstName: capitalize(trim(firstName)),
				lastName: capitalize(trim(lastName))
			};

			await rpc.callServer('Passport-Buy', data);

			state.name = `${data.firstName} ${data.lastName}`;
		} catch (err: any) {
			if (err.msg) showNotification('error', err.msg);
		}
	}
</script>

<template>
	<div class="passport">
		<PrimaryTitle class-name="passport_title">Паспортный стол</PrimaryTitle>

		<div class="passport_container">
			<p class="passport_name">
				Ваше имя <strong>{{ state.name }}</strong>
			</p>

			<Form :submit="buy" />

			<Point class-name="passport_price" :amount="state.price" />
		</div>

		<div class="passport_footer">
			<OutlineButton is-close>Закрыть</OutlineButton>

			<GradientButton class-name="passport_buy" form="passport">Сменить</GradientButton>
		</div>
	</div>
</template>
