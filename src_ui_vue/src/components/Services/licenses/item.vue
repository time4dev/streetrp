<script setup lang="ts">
	import images from '@/utils/images';
	import prettify from '@/utils/prettify';
	import PrimaryTitle from '@/components/Common/primary-title.vue';
	import GradientButton from '@/components/Common/gradient-button.vue';

	const licenses: { [name: string]: { name: string; description: string } } = {
		house: {
			name: 'Дом',
			description: 'Позволяет иметь 2 дома'
		},
		business: {
			name: 'Бизнес',
			description: 'Разрешает приобретение 1го бизнеса'
		},
		car: {
			name: 'Легковые ТС',
			description: 'Разрешает управление легковыми ТС'
		},
		motorcycle: {
			name: 'Мотоциклы',
			description: 'Разрешает управление мотоциклами'
		},
		boat: {
			name: 'Лодки',
			description: 'Разрешает управление водными ТС'
		},
		air: {
			name: 'Воздушные ТС',
			description: 'Разрешает управление воздушными ТС'
		},
		truck: {
			name: 'Грузовые ТС',
			description: 'Разрешает управление грузовыми ТС'
		},
		weapon: {
			name: 'Оружие',
			description: 'Требуется для ношения оружия'
		},
		fishing: {
			name: 'Рыболовлю',
			description: 'Требуется для вылова рыбы в большем объеме'
		}
	};

	defineProps<{
		name: string;
		price: number;
		bought: boolean;
		buy: () => void;
	}>();
</script>

<template>
	<div
		:class="['licenses_item', { disabled: bought }]"
		:style="{
			backgroundImage: `${
				bought ? 'linear-gradient(black, black),' : ''
			} url(${images.getImage(`${name}.jpg`, 'licenses')})`
		}"
	>
		<PrimaryTitle class-name="licenses_item-title">Лицензия</PrimaryTitle>
		<h3 class="licenses_item-subtitle">На {{ licenses[name].name }}</h3>

		<template v-if="!bought">
			<p class="licenses_item-info">{{ licenses[name].description }}</p>

			<div class="licenses_item-price">
				<h4>Стоимость</h4>

				<span>{{ prettify.price(price) }}</span>
			</div>

			<GradientButton class-name="licenses_item-buy" @click="buy">Купить</GradientButton>
		</template>
		<template v-else>
			<span class="licenses_item-checkmark" />
		</template>
	</div>
</template>
