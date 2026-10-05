<script setup lang="ts">
	import { onMounted, ref } from 'vue';
	import images from '@/utils/images';

	const items: { [name: string]: string } = {
		repair: 'Ремонт',
		engine: 'Двигатель',
		transmission: 'Трансмиссия',
		brakes: 'Тормоза',
		turbo: 'Турбонаддув',
		suspension: 'Подвеска',
		engine_sound: 'Звук двигателя',
		horn: 'Клаксон',
		tint: 'Тонировка',
		plate: 'Номер',
		lights: 'Фары',
		neon: 'Неон',
		paint: 'Покраска',
		rims: 'Диски',
		spoiler: 'Спойлер',
		front_bumper: 'Перед. бампер',
		rear_bumper: 'Зад. бампер',
		hood: 'Капот',
		sideskirt: 'Пороги',
		roof: 'Крыша',
		exhaust: 'Выхлоп',
		grille: 'Решётка',
		frame: 'Каркас',
		livery: 'Винилы'
	};

	const props = defineProps<{
		current?: string;
		offset: number;
		open: (name: string) => void;
		onScroll: (position: number) => void;
	}>();

	const list = ref<HTMLUListElement>();

	onMounted(() => {
		// useEffect(..., []): restore the saved horizontal scroll once
		if (list.value && props.offset) list.value.scrollTo(props.offset, 0);
	});

	function onMouseWheel(event: WheelEvent) {
		if (!list.value) return;

		const currentScrollDelta = list.value.scrollLeft;

		list.value.scrollTo(currentScrollDelta + event.deltaY, 0);

		props.onScroll(list.value.scrollLeft);
	}
</script>

<template>
	<div class="lsc_categories">
		<ul ref="list" class="lsc_categories-list" @wheel="onMouseWheel">
			<li
				v-for="(name, key) in items"
				:key="key"
				:class="['lsc_categories-item', { active: current === key }]"
				@click="open(key)"
			>
				<img :src="images.getImage(`${key}.svg`, 'lsc')" :alt="name" />

				<h3 class="lsc_categories-title">{{ name }}</h3>
			</li>
		</ul>
	</div>
</template>
