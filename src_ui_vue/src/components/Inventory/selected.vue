<script setup lang="ts">
	import { onBeforeUnmount, onMounted, ref } from 'vue';
	import images from '@/utils/images';
	import itemsData from '@/data/inventory.json';

	const props = defineProps<{
		id: number;
		name: string;
		use?: (id: number) => void;
		separate: () => void;
		close: () => void;
	}>();

	const position = ref({ x: 0, y: 0 });
	const root = ref<HTMLElement>();

	function getItemInfo(): any {
		return (itemsData as Record<string, any>)[props.name];
	}

	function onDocumentMouseDown(event: MouseEvent) {
		if (root.value && !root.value.contains(event.target as Node)) props.close();
	}

	// legacy: componentDidMount -> getPosition (rect of the source item element)
	onMounted(() => {
		document.addEventListener('mousedown', onDocumentMouseDown);

		const rect = document.getElementById(`item-${props.id}`)?.getBoundingClientRect();

		if (rect) {
			position.value = { x: rect.left + window.scrollX, y: rect.top + window.scrollY };
		}
	});

	onBeforeUnmount(() => {
		document.removeEventListener('mousedown', onDocumentMouseDown);
	});
</script>

<template>
	<!-- react-outside-click-handler equivalent -->
	<div ref="root" class="inventory_selected-wrapper">
		<div class="inventory_selected" :style="{ top: position.y, left: position.x }">
			<div class="inventory_selected-weight">1шт \ {{ getItemInfo().weight }}кг</div>

			<div class="inventory_selected-name">{{ getItemInfo().name }}</div>

			<div class="inventory_selected-buttons">
				<button :disabled="!use" @click="use && use(id)">
					<svg class="icon">
						<use :href="`${images.getImage('use.svg')}#icon`" />
					</svg>
					Использовать
				</button>

				<button @click="separate">
					<svg class="icon">
						<use :href="`${images.getImage('separate.svg')}#icon`" />
					</svg>
					Разделить
				</button>
			</div>
		</div>
	</div>
</template>
