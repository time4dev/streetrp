<script setup lang="ts">
	import vehiclesData from '@/data/vehicles.json';
	import F7Page from '../../../f7/page.vue';
	import F7Navbar from '../../../f7/navbar.vue';
	import F7List from '../../../f7/list.vue';
	import F7ListItem from '../../../f7/list-item.vue';

	const props = defineProps<{
		name: string;
		owner: string;
		owners: number;
	}>();
</script>

<template>
	<F7Page>
		<template #fixed>
			<F7Navbar title="ТС" back-link="Поиск" />
		</template>

		<F7List inset>
			<F7ListItem title="Название" :after="(vehiclesData as any)[props.name] ?? props.name" />
			<F7ListItem title="Владелец" :after="props.owner" />
			<F7ListItem title="Всего владельцев" :after="props.owners.toString()" />
		</F7List>
	</F7Page>
</template>
