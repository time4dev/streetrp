<script setup lang="ts">
	import { onMounted, reactive } from 'vue';
	import rpc from '@/utils/rpc';
	import dayjs from '@/utils/dayjs';
	import { useTabletRouter } from '@/composables/use-tablet-router';
	import F7Page from '../../f7/page.vue';
	import F7Navbar from '../../f7/navbar.vue';
	import F7List from '../../f7/list.vue';
	import F7ListItem from '../../f7/list-item.vue';
	import F7ListButton from '../../f7/list-button.vue';
	import F7BlockHeader from '../../f7/block-header.vue';
	import F7Block from '../../f7/block.vue';

	const router = useTabletRouter();

	type WantedData = {
		id: string;
		suspect: string;
		reason: string;
		priority: number;
		createdAt: string;
	};

	const props = defineProps<{
		data: WantedData;
		onRemove?: (id: string) => void;
	}>();

	const state = reactive<WantedData>({
		id: '4324ff',
		suspect: 'Test Testovich',
		reason: '1.2, 1.1',
		createdAt: '',
		priority: 2
	});

	onMounted(() => {
		Object.assign(state, props.data);
	});

	async function removeItem() {
		await rpc.callServer('WantedList-RemoveItem', state.id);

		if (props.onRemove) props.onRemove(state.id);

		router.back();
	}
</script>

<template>
	<F7Page>
		<template #fixed>
			<F7Navbar title="Ориентировка" back-link="Назад" />
		</template>

		<F7BlockHeader>Основная информация</F7BlockHeader>

		<F7List inset>
			<F7ListItem title="Имя" :after="state.suspect" />
			<F7ListItem title="Приоритет" :after="String(state.priority)" />
		</F7List>

		<F7BlockHeader>Описание</F7BlockHeader>

		<F7Block strong inset>
			<p>{{ state.reason }}</p>
		</F7Block>

		<F7List inset>
			<F7ListItem
				title="Дата составления"
				:after="dayjs(state.createdAt).format('DD.MM.YY, HH:mm')"
			/>
		</F7List>

		<F7List inset>
			<F7ListButton title="Убрать розыск" color="red" @click="removeItem" />
		</F7List>
	</F7Page>
</template>
