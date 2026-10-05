<script setup lang="ts">
	import images from '@/utils/images';

	const items: { [key: string]: string[] } = {
		melee: ['dagger', 'bat', 'bottle', 'golfclub', 'knuckle', 'knife'],
		handguns: [
			'pistol',
			'pistol50',
			'snspistol',
			'vintagepistol',
			'revolver',
			'doubleaction',
			'machinepistol',
			'microsmg',
			'minismg',
			'smg',
			'combatpdw',
			'assaultsmg'
		],
		rifles: [
			'compactrifle',
			'assaultrifle',
			'carbinerifle',
			'advancedrifle',
			'specialcarbine'
		],
		shotguns: [
			'sawnoffshotgun',
			'pumpshotgun',
			'assaultshotgun',
			'heavyshotgun',
			'musket',
			'dbshotgun'
		]
	};

	defineProps<{
		selected: string;
		category: string;
		selectItem: (name: string) => void;
	}>();
</script>

<template>
	<div class="weapons_list">
		<div class="weapons_list-container">
			<div
				v-for="item in items[category]"
				:key="item"
				:class="['weapons_list-item', { active: item === selected }]"
				@click="selectItem(item)"
			>
				<img :src="images.getImage(`${item}.png`, 'inventory')" :alt="item" />
			</div>
		</div>
	</div>
</template>
