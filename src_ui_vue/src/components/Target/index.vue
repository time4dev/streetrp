<script setup lang="ts">
	import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
	import { isArray } from 'lodash-es';
	import rpc from '@/utils/rpc';
	import { groups, sections } from './data';
	import Cell from './cell.vue';
	import Passengers from './passengers.vue';
	import Organization from './organization.vue';
	import Animations from './anims.vue';

	type TargetType = 'self' | 'player' | 'vehicle';

	const type = ref<TargetType>();
	const group = ref<string>();

	const list = ref<HTMLUListElement | null>(null);

	let animInterval: ReturnType<typeof setInterval> | undefined;

	const cellItems = computed(() => {
		const source = group.value ? groups[group.value] : type.value ? sections[type.value] : {};

		return Object.entries(source).map(([name, data]) => ({
			name,
			label: isArray(data) ? data[1] : name,
			title: isArray(data) ? data[0] : data
		}));
	});

	// legacy componentDidUpdate: replay the reveal animation when the menu content changes
	watch([type, group], () => animateItems(), { flush: 'post' });

	onMounted(() => {
		rpc.register('Target-ShowMenu', setType);
		rpc.register('Target-Reset', reset);

		animateItems();
	});

	onBeforeUnmount(() => {
		if (type.value) rpc.callClient('Target-CloseMenu');

		rpc.unregister('Target-ShowMenu');
		rpc.unregister('Target-Reset');
	});

	function setType(value?: TargetType) {
		type.value = value;
	}

	function reset() {
		type.value = undefined;
		group.value = undefined;
	}

	function toPrev() {
		if (!group.value) rpc.callClient('Target-CloseMenu');
		else group.value = undefined;
	}

	function animateItems() {
		animInterval = setInterval(() => {
			if (!list.value) return;

			const cell = Array.from(list.value.children).find((item) =>
				item.classList.contains('disabled')
			);

			if (cell) cell.classList.remove('disabled');
			else if (animInterval) clearInterval(animInterval);
		}, 100);
	}

	async function onCellClick(id: string) {
		if (groups[id]) group.value = id;
		else await rpc.callClient('Target-SelectItem', [type.value, { group: group.value, id }]);
	}
</script>

<template>
	<!-- legacy: <CSSTransition in={!!type} timeout={200} classNames="fadeIn" unmountOnExit> -->
	<Transition name="fadeIn">
		<div v-if="type" class="target-menu">
			<ul ref="list" class="target-menu_cells">
				<Cell label="close" :title="group ? 'Назад' : 'Закрыть'" @click="toPrev" />

				<Passengers v-if="group === 'passengers'" :on-click="onCellClick" />
				<Animations v-else-if="group === 'animations'" :show-cells="animateItems" />
				<Organization v-else-if="group === 'organization'" />

				<template v-else>
					<Cell
						v-for="item in cellItems"
						:key="item.name"
						:label="item.label"
						:title="item.title"
						@click="onCellClick(item.name)"
					/>
				</template>
			</ul>
		</div>
	</Transition>
</template>
