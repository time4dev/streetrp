<script setup lang="ts">
	import { onMounted, ref } from 'vue';
	import Login from './login.vue';
	import Register from './register.vue';
	import Forgot from './forgot.vue';
	import Confirm from './confirm.vue';

	// Legacy: componentDidMount -> setState(location.state) ({ email })
	const email = ref('');
	const activeForm = ref<string | undefined>('login');

	onMounted(() => {
		const state = history.state as { email?: string };

		email.value = state.email ?? '';
	});

	function setEmail(value: string) {
		email.value = value;
	}

	function openForm(name: string) {
		activeForm.value = undefined;

		setTimeout(() => (activeForm.value = name), 100);
	}
</script>

<template>
	<div class="auth">
		<Transition name="alert">
			<Login
				v-if="activeForm === 'login'"
				:set-email="setEmail"
				:open-form="openForm"
				:email="email"
			/>

			<Register
				v-else-if="activeForm === 'register'"
				:set-email="setEmail"
				:to-login="() => openForm('login')"
			/>

			<Forgot v-else-if="activeForm === 'forgot'" :to-login="() => openForm('login')" />

			<Confirm v-else-if="activeForm === 'confirm'" :email="email" />
		</Transition>
	</div>
</template>
