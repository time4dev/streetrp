<script setup lang="ts">
	import { onMounted, ref } from 'vue';
	import rpc from '@/utils/rpc';
	import { IoClose } from '@/utils/icons';

	const fields = {
		firstName: 'Имя',
		lastName: 'Фамилия',
		gender: 'Пол',
		registerAt: 'Дата регистрации'
		// partner: 'Семейное положение'
	};

	const fieldEntries = Object.entries(fields);

	type PlayerData = Record<string, string>;

	const player = ref<PlayerData | null>(null);

	// legacy: componentDidMount -> setState(location.state)
	onMounted(() => {
		// vue-router keeps its own navigation keys in history.state — copy only the page data
		const { back, current, forward, replaced, position, scroll, ...data } =
			history.state as Record<string, any>;

		player.value = data;
	});
</script>

<template>
	<div class="player-passport">
		<div class="player-passport_container">
			<span class="faction-docs_close" @click="rpc.callClient('Browser-HidePage')">
				<IoClose />
			</span>

			<ul class="player-passport_fields">
				<li
					v-for="[name, title] in fieldEntries"
					:key="name"
					class="player-passport_field"
				>
					<h4 class="player-passport_field-name">{{ title }}</h4>

					<span class="player-passport_field-value">{{ player?.[name] }}</span>
				</li>
			</ul>
		</div>
	</div>
</template>
