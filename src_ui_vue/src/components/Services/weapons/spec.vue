<script setup lang="ts">
	import { computed } from 'vue';
	import images from '@/utils/images';

	type WeaponStats = {
		damage: number;
		accuracy: number;
		speed: number;
		range: number;
	};

	const stats: { [name: string]: WeaponStats } = {
		dagger: { damage: 20, speed: 20, accuracy: 0, range: 2 },
		bat: { damage: 20, speed: 10, accuracy: 0, range: 1 },
		bottle: { damage: 20, speed: 15, accuracy: 0, range: 1 },
		golfclub: { damage: 20, speed: 10, accuracy: 0, range: 1 },
		knuckle: { damage: 10, speed: 20, accuracy: 0, range: 1 },
		knife: { damage: 15, speed: 20, accuracy: 0, range: 1 },

		pistol: { damage: 26, speed: 40, accuracy: 40, range: 25 },
		pistol50: { damage: 51, speed: 40, accuracy: 55, range: 35 },
		snspistol: { damage: 30, speed: 40, accuracy: 40, range: 20 },
		vintagepistol: { damage: 35, speed: 40, accuracy: 40, range: 25 },
		revolver: { damage: 70, speed: 20, accuracy: 65, range: 35 },
		doubleaction: { damage: 70, speed: 35, accuracy: 65, range: 20 },

		machinepistol: { damage: 28, speed: 70, accuracy: 40, range: 30 },
		microsmg: { damage: 21, speed: 60, accuracy: 30, range: 25 },
		minismg: { damage: 22, speed: 84, accuracy: 33, range: 30 },
		smg: { damage: 22, speed: 55, accuracy: 40, range: 35 },
		combatpdw: { damage: 25, speed: 50, accuracy: 45, range: 38 },
		assaultsmg: { damage: 23, speed: 55, accuracy: 45, range: 40 },

		compactrifle: { damage: 36, speed: 60, accuracy: 35, range: 45 },
		assaultrifle: { damage: 30, speed: 60, accuracy: 45, range: 45 },
		carbinerifle: { damage: 32, speed: 65, accuracy: 55, range: 45 },
		advancedrifle: { damage: 34, speed: 70, accuracy: 50, range: 45 },
		specialcarbine: { damage: 34, speed: 65, accuracy: 55, range: 40 },

		sawnoffshotgun: { damage: 96, speed: 20, accuracy: 20, range: 15 },
		pumpshotgun: { damage: 67, speed: 20, accuracy: 30, range: 20 },
		assaultshotgun: { damage: 77, speed: 50, accuracy: 25, range: 15 },
		heavyshotgun: { damage: 85, speed: 45, accuracy: 30, range: 25 },
		musket: { damage: 97, speed: 10, accuracy: 65, range: 85 },
		dbshotgun: { damage: 98, speed: 25, accuracy: 15, range: 10 }
	};

	const items: { [name: string]: string } = {
		damage: 'Урон',
		accuracy: 'Точность',
		speed: 'Скорость',
		range: 'Дальность'
	};

	const props = defineProps<{
		weapon: string;
	}>();

	const state = computed(() => stats[props.weapon]);

	// [...Array(5).keys()] from the legacy render
	const parts = [...Array(5).keys()];

	// legacy cast `(state as any)[name]`
	function getStat(name: string): number {
		return (state.value as any)[name];
	}
</script>

<template>
	<div class="weapons_spec">
		<div v-for="(title, name) in items" :key="name" class="weapons_spec-item">
			<div class="weapons_spec-header">
				<img :src="images.getImage(`weapon-${name}.svg`)" :alt="name" />

				<h4 class="weapons_spec-title">{{ title }}</h4>
			</div>

			<div class="weapons_spec-bar">
				<progress
					v-for="item in parts"
					:key="item"
					:value="getStat(name) <= item * 20 ? 0 : 100"
					max="100"
				/>
			</div>
		</div>
	</div>
</template>
