<script setup lang="ts">
	import { computed } from 'vue';
	import prettify from '@/utils/prettify';
	import Name from './name.vue';
	import Item from './item.vue';

	const props = defineProps<{
		name: string;
		money: number;
		account: string;
	}>();

	const firstName = computed(() => props.name.split('_')[0]);
	const lastName = computed(() => props.name.split('_')[1]);
</script>

<template>
	<div class="bank_info">
		<Name :first-name="firstName" :last-name="lastName" />

		<div class="bank_info-items">
			<Item title="Баланс" :value="prettify.price(money)" />
			<Item
				title="Номер счета"
				:value="account ? prettify.phoneNumber(account) : 'Отсутствует'"
			/>
		</div>
	</div>
</template>
