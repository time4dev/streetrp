<script setup lang="ts">
	import { computed, provide, reactive } from 'vue';

	// Faithful port of rc-tabs@11 <Tabs> (renders the same DOM/classes).
	// Supported: prefixCls, tabPosition (top/left), destroyInactiveTabPane,
	// activeKey/defaultActiveKey + @change. Panes: <RcTabPane tab-key="..." tab="...">.
	const props = withDefaults(
		defineProps<{
			prefixCls?: string;
			tabPosition?: 'top' | 'right' | 'bottom' | 'left';
			destroyInactiveTabPane?: boolean;
			activeKey?: string | number | null;
			defaultActiveKey?: string | number | null;
			className?: string;
		}>(),
		{
			prefixCls: 'rc-tabs',
			tabPosition: 'top',
			destroyInactiveTabPane: false,
			activeKey: undefined,
			defaultActiveKey: undefined,
			className: ''
		}
	);

	const emit = defineEmits<{ change: [key: string | number] }>();

	const registered = reactive<{ key: string | number; tab: string; disabled: boolean }[]>([]);
	const localKey = ref<string | number | null>(props.defaultActiveKey ?? null);

	function registerTab(key: string | number, tab: string, disabled: boolean) {
		const existing = registered.find((item) => item.key === key);

		if (existing) {
			existing.tab = tab;
			existing.disabled = disabled;
		} else registered.push({ key, tab, disabled });
	}

	function unregisterTab(key: string | number) {
		const index = registered.findIndex((item) => item.key === key);

		if (index !== -1) registered.splice(index, 1);
	}

	const activeKey = computed(() => {
		if (props.activeKey !== undefined) return props.activeKey;

		if (localKey.value !== null && registered.some((item) => item.key === localKey.value)) {
			return localKey.value;
		}

		return registered.find((item) => !item.disabled)?.key ?? null;
	});

	function selectTab(key: string | number, disabled?: boolean) {
		if (disabled) return;

		localKey.value = key;

		emit('change', key);
	}

	function onTabKeyDown(event: KeyboardEvent, index: number) {
		if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;

		const direction = ['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : -1;
		const enabled = registered.filter((item) => !item.disabled);

		if (!enabled.length) return;

		const currentIndex = enabled.findIndex((item) => item.key === activeKey.value);
		const nextIndex = (currentIndex + direction + enabled.length) % enabled.length;

		selectTab(enabled[nextIndex].key);
	}

	const context = {
		registerTab,
		unregisterTab,
		activeKey,
		selectTab,
		onTabKeyDown,
		destroyInactiveTabPane: () => props.destroyInactiveTabPane,
		prefixCls: () => props.prefixCls
	};

	provide(TABS_CONTEXT, context);
</script>

<script lang="ts">
	import { ref, type InjectionKey } from 'vue';

	export const TABS_CONTEXT = Symbol('RcTabs') as InjectionKey<{
		registerTab: (key: string | number, tab: string, disabled: boolean) => void;
		unregisterTab: (key: string | number) => void;
		activeKey: import('vue').ComputedRef<string | number | null>;
		selectTab: (key: string | number, disabled?: boolean) => void;
		onTabKeyDown: (event: KeyboardEvent, index: number) => void;
		destroyInactiveTabPane: () => boolean;
		prefixCls: () => string;
	}>;
</script>

<template>
	<div :class="[prefixCls, `${prefixCls}-${tabPosition}`, className]">
		<div :class="`${prefixCls}-nav`">
			<div :class="`${prefixCls}-nav-wrap`">
				<div :class="`${prefixCls}-nav-list`">
					<div
						v-for="(item, index) in registered"
						:key="item.key"
						:class="[
							`${prefixCls}-tab`,
							{
								[`${prefixCls}-tab-active`]: item.key === activeKey,
								[`${prefixCls}-tab-disabled`]: item.disabled
							}
						]"
						role="tab"
						:aria-selected="item.key === activeKey"
						:aria-disabled="item.disabled"
						tabindex="-1"
						@click="selectTab(item.key, item.disabled)"
						@keydown="onTabKeyDown($event, index)"
					>
						<div :class="`${prefixCls}-tab-btn`">{{ item.tab }}</div>
					</div>

					<div :class="`${prefixCls}-ink-bar`"></div>
				</div>
			</div>
		</div>

		<div :class="`${prefixCls}-content-holder`">
			<div :class="`${prefixCls}-content`">
				<slot />
			</div>
		</div>
	</div>
</template>
