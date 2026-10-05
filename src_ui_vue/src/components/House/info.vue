<script setup lang="ts">
	import prettify from '@/utils/prettify';
	import PrimaryTitle from '@/components/Common/primary-title.vue';

	defineProps<{
		isOwner: boolean;
		owner: string;
		tax: number;
		price: number;
		paid: number;
	}>();
</script>

<template>
	<div class="house_info">
		<PrimaryTitle>Информация</PrimaryTitle>

		<div class="house_info-container">
			<div class="house_info-item">
				<h4 class="house_info-name">Владелец</h4>

				<span class="house_info-value">{{ owner || 'Отсутствует' }}</span>
			</div>

			<div class="house_info-item">
				<h4 class="house_info-name">Стоимость в день</h4>

				<span class="house_info-value">{{ prettify.price(tax) }}</span>
			</div>

			<div class="house_info-item">
				<h4 class="house_info-name">{{ isOwner ? 'Гос. продажа' : 'Цена' }}</h4>

				<span class="house_info-value">{{ prettify.price(price) }}</span>
			</div>
		</div>

		<div v-if="isOwner" class="house_info-item house_info-item--main">
			<h4 class="house_info-name">Оплачено дней</h4>

			<span class="house_info-value">{{ paid }}</span>

			<p class="house_info-remark">Оплатить услуги можно в банке</p>
		</div>
	</div>
</template>
