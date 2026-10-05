<script setup lang="ts">
	import { onMounted, ref } from 'vue';
	import dayjs from '@/utils/dayjs';
	import rpc from '@/utils/rpc';
	import { IoClose } from '@/utils/icons';
	import licenses from '@/data/licenses.json';

	type Items = { [name: string]: string };

	const items = ref<Items>();

	function licenseTitle(name: string): string {
		return (licenses as Record<string, string>)[name];
	}

	// legacy: componentDidMount -> setState(location.state)
	onMounted(() => {
		const state = history.state as { licenses: Items };

		items.value = state.licenses;
	});
</script>

<template>
	<div class="player-licenses">
		<div class="player-licenses_container">
			<span class="faction-docs_close" @click="rpc.callClient('Browser-HidePage')">
				<IoClose />
			</span>

			<ul class="player-licenses_list">
				<li
					v-for="[name, expires] in Object.entries(items ?? {})"
					:key="name"
					class="player-licenses_item"
				>
					<h4>{{ licenseTitle(name) }}</h4>
					<span>{{ dayjs(expires).format('DD.MM.YY') }}</span>
				</li>
			</ul>
		</div>
	</div>
</template>
