<script setup lang="ts">
	import { ref } from 'vue';
	import images from '@/utils/images';
	import prettify from '@/utils/prettify';

	const props = defineProps<{
		category: string;
		items: string[];
		prices: number[];
		select: (id: number) => void;
		installed: number;
		selected?: number;
	}>();

	const list = ref<HTMLUListElement>();

	function onMouseWheel(event: WheelEvent) {
		if (!list.value) return;

		const currentScrollDelta = list.value.scrollLeft;

		list.value.scrollTo(currentScrollDelta + event.deltaY, 0);
	}

	function selectItem(index: number) {
		props.select(index);
	}
</script>

<template>
	<div class="lsc_items">
		<ul ref="list" class="lsc_items-list" @wheel="onMouseWheel">
			<li
				v-for="(item, index) in items"
				:key="item"
				:class="[
					'lsc_items-item',
					{ disabled: index - 1 === installed, active: selected === index }
				]"
				@click="selectItem(index)"
			>
				<img :src="images.getImage(`${category}.svg`, 'lsc')" :alt="item" />

				<h3 class="lsc_items-title">
					{{
						item === 'default' ? 'Стандарт.' : item === 'custom' ? `Вариант ${index}` : item
					}}
				</h3>

				<span class="lsc_items-price">{{ prettify.price(prices[index] ?? prices[0]) }}</span>
			</li>
		</ul>
	</div>
</template>
