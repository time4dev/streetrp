<script setup lang="ts">
	import { onBeforeUnmount, onMounted, ref } from 'vue';
	import { useField, useForm } from 'vee-validate';
	import * as yup from 'yup';
	import rpc from '@/utils/rpc';
	import PrimaryTitle from '@/components/Common/primary-title.vue';
	import GradientButton from '@/components/Common/gradient-button.vue';
	import OutlineButton from '@/components/Common/outline-button.vue';

	const recipient = ref<string | undefined>('');

	const { handleSubmit } = useForm({
		initialValues: { sum: 0 },
		validationSchema: yup.object({
			sum: yup.number().min(1).max(10000000).required()
		})
	});

	const { value: sum } = useField<number | string>('sum');

	const onSubmit = handleSubmit((values) => giveMoney(values.sum as number));

	onMounted(() => {
		rpc.register('Player-ShowCashMenu', (name: string) => {
			recipient.value = name;
		});
	});

	onBeforeUnmount(() => {
		rpc.unregister('Player-ShowCashMenu');
	});

	async function giveMoney(value: number) {
		await rpc.callServer('Player-GiveCash', value);

		closeMenu();
	}

	function closeMenu() {
		recipient.value = undefined;
	}
</script>

<template>
	<div v-if="recipient" class="player-cash">
		<PrimaryTitle class-name="player-cash_title">Передача наличных</PrimaryTitle>

		<div class="player-cash_container">
			<div class="player-cash_section">
				<h4>Получатель</h4>
				<span>{{ recipient }}</span>
			</div>

			<div class="player-cash_section">
				<h4>Сумма</h4>

				<form id="cash" class="player-cash_form" @submit="onSubmit">
					<input v-model="sum" class="outline-input" type="text" name="sum" />
				</form>
			</div>
		</div>

		<div class="player-cash_footer">
			<OutlineButton @click="closeMenu">Отмена</OutlineButton>
			<GradientButton form="cash">Передать</GradientButton>
		</div>
	</div>
</template>
