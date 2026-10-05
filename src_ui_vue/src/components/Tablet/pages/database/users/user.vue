<script setup lang="ts">
	import rpc from '@/utils/rpc';
	import prettify from '@/utils/prettify';
	import dayjs from '@/utils/dayjs';
	import vehiclesList from '@/data/vehicles.json';
	import { useTabletRouter } from '@/composables/use-tablet-router';
	import F7Page from '../../../f7/page.vue';
	import F7Navbar from '../../../f7/navbar.vue';
	import F7List from '../../../f7/list.vue';
	import F7ListItem from '../../../f7/list-item.vue';
	import F7ListButton from '../../../f7/list-button.vue';
	import F7BlockHeader from '../../../f7/block-header.vue';

	const router = useTabletRouter();

	const props = defineProps<{
		userId: string;
		registrationAt: string;
		bankAccount: string;
		phone: string;
		vehicles: { name: string; govNumber: string }[];
	}>();

	async function getWantedData() {
		const data = await rpc.callServer('WantedList-FindById', props.userId);

		if (data) router.navigate('/wanted/item/', { data });
		else router.navigate('/wanted/form/', { userId: props.userId });
	}
</script>

<template>
	<F7Page>
		<template #fixed>
			<F7Navbar title="Гражданин" back-link="Поиск" />
		</template>

		<F7BlockHeader>Основная информация</F7BlockHeader>

		<F7List inset>
			<F7ListItem title="Прибытие в штат" :after="dayjs(registrationAt).format('DD.MM.YYYY')" />
			<F7ListItem title="Банк. счет" :after="prettify.phoneNumber(bankAccount)" />
			<F7ListItem title="Телефон" :after="prettify.phoneNumber(phone)" />
		</F7List>

		<F7BlockHeader>Имущество</F7BlockHeader>

		<F7List accordion-list inset>
			<F7ListItem accordion-item title="Транспорт">
				<F7List>
					<F7ListItem
						v-for="(item, index) in vehicles"
						:key="index"
						:title="(vehiclesList as any)[item.name] ?? item.name"
						:after="item.govNumber"
					/>
				</F7List>
			</F7ListItem>
		</F7List>

		<F7List inset>
			<F7ListItem link="#" title="Розыск" @click="getWantedData" />
		</F7List>

		<F7List inset>
			<F7ListButton
				title="Выписать штраф"
				link="/fine/"
				:route-props="{ userId }"
			/>
			<F7ListButton
				title="Арестовать"
				color="red"
				link="/arrest/"
				:route-props="{ userId }"
			/>
		</F7List>
	</F7Page>
</template>
