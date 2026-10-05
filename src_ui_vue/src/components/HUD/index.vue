<script setup lang="ts">
	import { onMounted, ref } from 'vue';
	import rpc from '@/utils/rpc';
	import { useAppStore } from '@/stores/app';
	import { useHudStore } from '@/stores/hud';
	import { usePlayerStore } from '@/stores/player';
	import { usePhoneStore } from '@/stores/phone';
	import PlayerCash from '@/components/Player/cash.vue';
	import TargetMenu from '@/components/Target/index.vue';
	import Location from './location.vue';
	import Binds from './binds.vue';
	import Online from './online.vue';
	import Money from './money.vue';
	import HudDate from './date.vue';
	import Speedometer from './speedometer/index.vue';
	import Tasks from './tasks.vue';
	import Mic from './mic.vue';
	import Ammo from './ammo.vue';
	import Hunger from './hunger.vue';
	import Interact from './interact.vue';
	import HudCall from './call.vue';
	import Offer from './offer.vue';
	import Level from './level.vue';
	import Capture from './capture/index.vue';
	import Bonus from './bonus.vue';

	const app = useAppStore();
	const hud = useHudStore();
	const player = usePlayerStore();
	const phone = usePhoneStore();

	const binds = ref<{
		[name: string]: string;
	}>({});
	const position = ref({
		bottom: 2,
		left: 10
	});

	onMounted(() => {
		rpc.callClient('HUD-GetBinds').then((data) => (binds.value = data));

		getDistToMinimap();
	});

	async function getDistToMinimap() {
		const data = await rpc.callClient('HUD-GetMinimapAnchor');

		position.value = { left: data.rightX * 100, bottom: (1 - data.bottomY) * 100 };
	}
</script>

<template>
	<div class="hud" :style="{ display: hud.visible ? 'block' : 'none' }">
		<Binds :items="binds" />
		<Online :player-id="player.id" :count="app.online" />
		<Money :cash="player.money.cash" :bank="player.money.bank" />
		<Mic :bind="binds.mic" />
		<Ammo />
		<Interact />
		<Offer />
		<Level />

		<Tasks v-if="hud.tasks" :items="player.tasks" />

		<div
			class="hud_minimap"
			:style="{
				left: `calc(${position.left}% + 2%)`,
				bottom: `calc(${position.bottom}% + 2.5px)`
			}"
		>
			<Hunger :amount="player.satiety" />
			<Location />

			<HudCall v-if="phone.call?.type === 'incoming'" :info="phone.call" />
		</div>

		<div class="hud_container">
			<HudDate :value="app.date" />
			<Speedometer :binds="binds" />
		</div>

		<TargetMenu />
		<PlayerCash />

		<Capture
			v-if="hud.capture"
			:time="hud.capture.time"
			:attacker="hud.capture.attacker"
			:defender="hud.capture.defender"
		/>
		<Bonus v-if="player.bonus > 0" :time="player.bonus" />
	</div>
</template>
