<script setup lang="ts">
	import images from '@/utils/images';
	import GradientButton from '@/components/Common/gradient-button.vue';
	import Point from '@/components/Common/point.vue';

	defineProps<{
		icon: string;
		title: string;
		description: string;
		price: number;
		onClick: () => void;
	}>();
</script>

<template>
	<div class="donation_product">
		<div class="donation_product-icon">
			<img :src="images.getImage(`${icon}.png`, 'donation')" :alt="title" />

			<span />
		</div>

		<h3 class="donation_product-title">{{ title }}</h3>
		<p class="donation_product-descr">{{ description }}</p>

		<Point className="donation_product-price" :amount="price" />

		<div class="donation_product-buy">
			<GradientButton className="donation_product-btn" :on-click="onClick">
				Купить
			</GradientButton>
		</div>
	</div>
</template>
