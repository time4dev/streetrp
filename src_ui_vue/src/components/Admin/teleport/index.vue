<script setup lang="ts">
	import { ref } from 'vue';
	import Tabs from 'primevue/tabs';
	import TabList from 'primevue/tablist';
	import Tab from 'primevue/tab';
	import TabPanels from 'primevue/tabpanels';
	import TabPanel from 'primevue/tabpanel';
	import InputNumber from 'primevue/inputnumber';
	import Button from 'primevue/button';
	import rpc from '@/utils/rpc';
	import Players from '../partials/players.vue';

	const active = ref('player');

	const playerId = ref<number | null>(null);
	const x = ref(0);
	const y = ref(0);
	const z = ref(0);

	async function teleportTo(target: number | null) {
		if (target == null) return;

		await rpc.callServer('Admin-Teleport', [active.value, target, { x: 0, y: 0, z: 0 }]);
	}

	async function teleportToCoords() {
		await rpc.callServer('Admin-Teleport', [
			'coords',
			null,
			{ x: Number(x.value), y: Number(y.value), z: Number(z.value) }
		]);
	}

	async function teleportToWaypoint() {
		await rpc.callServer('Admin-Teleport', ['waypoint', null, { x: 0, y: 0, z: 0 }]);
	}
</script>

<template>
	<div class="admin__pane">
		<h3 class="admin__pane-title">Телепорт</h3>
		<p class="admin__pane-hint">Перемещение к игроку, игрока к себе, на метку или по координатам</p>

		<Tabs v-model:value="active">
			<TabList>
				<Tab value="player">К игроку</Tab>
				<Tab value="yourself">К себе</Tab>
				<Tab value="waypoint">На метку</Tab>
				<Tab value="coords">Координаты</Tab>
			</TabList>

			<TabPanels>
				<TabPanel value="player">
					<div class="admin__form">
						<Players @select="(p: any) => (playerId = p?.id ?? null)" />
						<div class="admin__actions">
							<Button label="Подтвердить" @click="teleportTo(playerId)" />
						</div>
					</div>
				</TabPanel>

				<TabPanel value="yourself">
					<div class="admin__form">
						<Players @select="(p: any) => (playerId = p?.id ?? null)" />
						<div class="admin__actions">
							<Button label="Подтвердить" @click="teleportTo(playerId)" />
						</div>
					</div>
				</TabPanel>

				<TabPanel value="waypoint">
					<div class="admin__form">
						<p class="admin__pane-hint">Игрок будет перемещён на вашу метку (waypoint)</p>
						<div class="admin__actions">
							<Button label="Подтвердить" @click="teleportToWaypoint" />
						</div>
					</div>
				</TabPanel>

				<TabPanel value="coords">
					<div class="admin__grid">
						<div class="admin__field">
							<label class="admin__label">X</label>
							<InputNumber v-model="x" />
						</div>
						<div class="admin__field">
							<label class="admin__label">Y</label>
							<InputNumber v-model="y" />
						</div>
						<div class="admin__field">
							<label class="admin__label">Z</label>
							<InputNumber v-model="z" />
						</div>
					</div>

					<div class="admin__actions">
						<Button label="Подтвердить" @click="teleportToCoords" />
					</div>
				</TabPanel>
			</TabPanels>
		</Tabs>
	</div>
</template>
