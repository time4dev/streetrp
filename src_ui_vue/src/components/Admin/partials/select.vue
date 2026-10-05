<script setup lang="ts">
	import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
	import rpc from '@/utils/rpc';

	// Port of react-select v4 as used in the legacy admin (admin_select prefix classes).
	type Option = {
		value: any;
		label: string;
		dbId?: string;
	};

	const props = withDefaults(
		defineProps<{
			placeholder?: string;
			options: Option[];
			noOptionsMessage?: () => string;
			className?: string;
			classNamePrefix?: string;
			// legacy onMenuOpen (lazy options loading)
			onMenuOpen?: () => void;
		}>(),
		{
			placeholder: '',
			className: '',
			classNamePrefix: 'admin_select',
			noOptionsMessage: undefined,
			onMenuOpen: undefined
		}
	);

	const emit = defineEmits<{ change: [option: Option | null] }>();

	const prefix = computed(() => props.classNamePrefix || 'admin_select');
	const menuOpen = ref(false);
	const filter = ref('');
	const selected = ref<Option | null>(null);
	const root = ref<HTMLElement>();
	const inputEl = ref<HTMLInputElement>();

	const filtered = computed(() => {
		if (!filter.value) return props.options;

		return props.options.filter((option) =>
			option.label.toLowerCase().includes(filter.value.toLowerCase())
		);
	});

	function toggleMenu() {
		menuOpen.value = !menuOpen.value;

		if (menuOpen.value) {
			props.onMenuOpen?.();

			setTimeout(() => inputEl.value?.focus(), 0);
		}
	}

	function select(option: Option) {
		selected.value = option;
		menuOpen.value = false;
		filter.value = '';

		emit('change', option);
	}

	function onDocumentMouseDown(event: MouseEvent) {
		if (root.value && !root.value.contains(event.target as Node)) {
			menuOpen.value = false;
			filter.value = '';
		}
	}

	onMounted(() => {
		document.addEventListener('mousedown', onDocumentMouseDown);
	});

	onBeforeUnmount(() => {
		document.removeEventListener('mousedown', onDocumentMouseDown);
	});
</script>

<template>
	<div ref="root" :class="[prefix, className]">
		<div
			:class="[`${prefix}__control`, { [`${prefix}__control--is-focused`]: menuOpen }]"
			@click="toggleMenu"
		>
			<div :class="[`${prefix}__value-container`, { [`${prefix}__value-container--has-value`]: !!selected }]">
				<div v-if="!selected && !filter" :class="`${prefix}__placeholder`">
					{{ placeholder }}
				</div>

				<div v-else :class="`${prefix}__single-value`">
					{{ selected ? selected.label : filter }}
				</div>

				<div :class="`${prefix}__input`">
					<input
						ref="inputEl"
						v-model="filter"
						type="text"
						:style="{
							background: 'transparent',
							border: 0,
							outline: 0,
							color: 'inherit',
							width: '1px'
						}"
					/>
				</div>
			</div>

			<div :class="`${prefix}__indicators`">
				<div :class="[`${prefix}__indicator`, `${prefix}__dropdown-indicator`]"></div>
			</div>
		</div>

		<div v-if="menuOpen" :class="`${prefix}__menu`">
			<div :class="`${prefix}__menu-list`">
				<div
					v-for="option in filtered"
					:key="option.value"
					:class="[
						`${prefix}__option`,
						{
							[`${prefix}__option--is-selected`]: selected?.value === option.value,
							[`${prefix}__option--is-focused`]: true
						}
					]"
					@click.stop="select(option)"
				>
					{{ option.label }}
				</div>

				<div v-if="!filtered.length" :class="`${prefix}__menu-notice`">
					{{ noOptionsMessage?.() ?? 'Не найдено' }}
				</div>
			</div>
		</div>
	</div>
</template>
