<script setup lang="ts">
	import images from '@/utils/images';

	const items: { [name: string]: string } = {
		cash_out: 'Снять деньги',
		replenish: 'Пополнить баланс',
		transfer: 'Банковский перевод',
		house: 'Оплатить дом',
		bank: 'Открыть счет',
		business: 'Оплатить бизнес'
	};

	defineProps<{
		openTab: (name: string) => void;
	}>();
</script>

<template>
	<div class="bank_tabs">
		<ul class="bank_tabs-list">
			<li
				v-for="(title, name) in items"
				:key="name"
				class="bank_tabs-item"
				@click="openTab(name)"
			>
				<div class="container">
					<img :src="images.getImage(`${name}.svg`)" :alt="title" />

					<h4>{{ title }}</h4>
				</div>
			</li>
		</ul>
	</div>
</template>
