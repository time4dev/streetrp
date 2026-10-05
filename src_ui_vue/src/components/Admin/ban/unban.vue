<script setup lang="ts">
	import { useForm, useField } from 'vee-validate';
	import rpc from '@/utils/rpc';
	import { showNotification } from '@/utils/notifications';
	import GradientButton from '@/components/Common/gradient-button.vue';

	const { handleSubmit } = useForm({
		initialValues: { email: '' }
	});

	const { value: email } = useField<string>('email');

	async function unbanPlayer(email: string) {
		try {
			await rpc.callServer('Admin-Unban', email);

			showNotification('success', 'Игрок разбанен!');
		} catch (err: any) {
			if (err.msg) showNotification('error', err.msg);
		}
	}

	const onSubmit = handleSubmit((values: any) => unbanPlayer(values.email));
</script>

<template>
	<form @submit="onSubmit">
		<input
			v-model="email"
			class="admin_field"
			type="text"
			name="email"
			placeholder="email"
		/>

		<GradientButton type="submit">Разбанить</GradientButton>
	</form>
</template>
