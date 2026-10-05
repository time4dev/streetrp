<script setup lang="ts">
	import images from '@/utils/images';
	import PrimaryTitle from '@/components/Common/primary-title.vue';
	import Padlock from './padlock.vue';

	defineProps<{
		index: number;
		locked: boolean;
		inventory: number;
		vehicles: number;
		toggleLock: () => Promise<void>;
	}>();
</script>

<template>
	<div class="house_main">
		<PrimaryTitle class-name="house_main-title">Дом {{ index }}</PrimaryTitle>

		<Padlock :status="locked" :toggle="toggleLock" />

		<div class="house_options">
			<div class="house_options-item">
				<img :src="images.getImage('safe.svg')" alt="safe" />

				<span v-if="inventory > 0">
					Сейф на <b>{{ inventory }}</b> кг
				</span>
				<span v-else>Сейф отсутствует</span>
			</div>

			<div class="house_options-item">
				<img :src="images.getImage('garage.svg')" alt="garage" />

				<span>
					<b>{{ vehicles }}</b> мест в гараже
				</span>
			</div>
		</div>
	</div>
</template>
