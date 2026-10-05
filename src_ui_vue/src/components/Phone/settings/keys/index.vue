<script setup lang="ts">
	import { onMounted, ref } from 'vue';
	import rpc from '@/utils/rpc';
	import { showNotification } from '@/utils/notifications';
	import { usePhoneStore } from '@/stores/phone';
	import Navigation from '../../partials/navigation.vue';
	import Button from '../../partials/button.vue';
	import Group from '../../partials/group.vue';
	import List from './list.vue';

	const items: { [name: string]: string } = {
		cursor: 'Курсор',
		noHUD: 'Видимость интерфейса',
		mic: 'Голосовой чат',
		target: 'Меню игрока',
		inventory: 'Инвентарь',
		tablet: 'Планшет организации',
		engine: 'Двигатель',
		lock: 'Замок ТС',
		seatbelt: 'Ремень безопасности',
		cruise: 'Круиз-контроль',
		left_ind: 'Левый поворотник',
		right_ind: 'Правый поворотник',
		quick_1: 'Быстрый доступ 1',
		quick_2: 'Быстрый доступ 2',
		quick_3: 'Быстрый доступ 3'
	};

	const props = defineProps<{
		close: () => void;
	}>();

	const binds = ref<Record<string, string>>({});
	const selected = ref<string | undefined>(undefined);

	onMounted(() => {
		rpc.callClient('HUD-GetBinds').then((data: any) => (binds.value = data));
	});

	function selectKeyBind(name?: string) {
		selected.value = name;
	}

	async function saveKeyBind(key: string) {
		const current = selected.value;

		if (!current || binds.value[current] === key) return;

		try {
			await rpc.callClient('Binder-Rebind', [current, key]);

			binds.value = { ...binds.value, [current]: key };
		} catch (error) {
			showNotification('error', 'Эта клавиша уже используется');
		}
	}
</script>

<template>
	<div class="settings_keys">
		<List
			v-if="selected"
			:name="items[selected]"
			:current="binds[selected]"
			:select-key="saveKeyBind"
			:close="() => selectKeyBind(undefined)"
		/>

		<template v-else>
			<Navigation title="Назначение клавиш" :close="{ title: '', onClick: props.close }" />

			<Group className="settings_keys-list">
				<Button
					v-for="(title, name) in items"
					:key="name"
					icon="arrow"
					:current="binds[String(name)]"
					:on-click="() => selectKeyBind(String(name))"
				>
					{{ title }}
				</Button>
			</Group>
		</template>
	</div>
</template>
