<script setup lang="ts">
	import { computed, ref } from 'vue';
	import { useTabletRouter } from '@/composables/use-tablet-router';

	// framework7-react <ListItem> (title/after/subtitle/text/footer/link/radio/checkbox/
	// accordionItem/badge/selected + slot="media"/slot="after")
	const props = withDefaults(
		defineProps<{
			title?: string;
			after?: string;
			subtitle?: string;
			text?: string;
			footer?: string;
			// link path; '#' renders a clickable item without navigation (legacy behaviour)
			link?: string;
			routeProps?: Record<string, any>;
			radio?: boolean;
			checkbox?: boolean;
			checked?: boolean;
			name?: string;
			accordionItem?: boolean;
			badge?: string | number;
			badgeColor?: string;
			selected?: boolean;
		}>(),
		{
			title: '',
			after: '',
			subtitle: '',
			text: '',
			footer: '',
			link: '',
			routeProps: undefined,
			radio: false,
			checkbox: false,
			checked: false,
			name: '',
			accordionItem: false,
			badge: undefined,
			badgeColor: '',
			selected: false
		}
	);

	const emit = defineEmits<{ click: []; change: [checked: boolean] }>();

	const router = useTabletRouter();

	const contentRef = ref<HTMLElement>();

	const contentClasses = computed(() => ({
		'item-content': true,
		'item-link': !!props.link,
		'item-selected': props.selected,
		'accordion-item': props.accordionItem
	}));

	function onClick() {
		emit('click');

		if (props.link && props.link !== '#') {
			router.navigate(router.resolve(props.link), props.routeProps);
		}
	}

	function toggleAccordion() {
		contentRef.value?.classList.toggle('accordion-item-opened');
	}

	function onCheck(event: Event) {
		emit('change', (event.target as HTMLInputElement).checked);
	}
</script>

<template>
	<!-- radio / checkbox items render as label.item-content (framework7 markup) -->
	<label
		v-if="radio"
		:class="[contentClasses, 'item-radio']"
		@click="emit('click')"
	>
		<input
			type="radio"
			:name="name"
			:checked="checked"
			@change="onCheck"
		/>
		<i class="icon icon-radio"></i>

		<div class="item-inner">
			<div class="item-title-row">
				<div class="item-title">{{ title }}</div>
				<div class="item-after">
					<slot name="after">{{ after }}</slot>
				</div>
			</div>

			<div v-if="subtitle" class="item-subtitle">{{ subtitle }}</div>
			<div v-if="text" class="item-text">{{ text }}</div>
			<div v-if="footer" class="item-footer">{{ footer }}</div>
		</div>
	</label>

	<label
		v-else-if="checkbox"
		:class="[contentClasses, 'item-checkbox']"
		@click="emit('click')"
	>
		<input
			type="checkbox"
			:name="name"
			:checked="checked"
			@change="onCheck"
		/>
		<i class="icon icon-checkbox"></i>

		<div class="item-inner">
			<div class="item-title-row">
				<div class="item-title">{{ title }}</div>
				<div class="item-after">
					<slot name="after">{{ after }}</slot>
				</div>
			</div>

			<div v-if="subtitle" class="item-subtitle">{{ subtitle }}</div>
			<div v-if="text" class="item-text">{{ text }}</div>
			<div v-if="footer" class="item-footer">{{ footer }}</div>
		</div>
	</label>

	<li
		v-else
		ref="contentRef"
		:class="contentClasses"
		@click="
			() => {
				if (accordionItem) toggleAccordion();
				onClick();
			}
		"
	>
		<div v-if="badge !== undefined || $slots.media" class="item-media">
			<span v-if="badge !== undefined" :class="['badge', badgeColor && `color-${badgeColor}`]">
				{{ badge }}
			</span>

			<slot name="media" />
		</div>

		<div class="item-inner">
			<div class="item-title-row">
				<div class="item-title">{{ title }}</div>
				<div class="item-after">
					<slot name="after">{{ after }}</slot>
				</div>
			</div>

			<div v-if="subtitle" class="item-subtitle">{{ subtitle }}</div>
			<div v-if="text" class="item-text">{{ text }}</div>
			<div v-if="footer" class="item-footer">{{ footer }}</div>
		</div>

		<div v-if="accordionItem" class="accordion-item-content">
			<slot />
		</div>
	</li>
</template>
