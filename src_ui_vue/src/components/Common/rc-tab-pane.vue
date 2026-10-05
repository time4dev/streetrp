<script setup lang="ts">
	import { computed, inject, onBeforeUnmount, onMounted } from 'vue';
	import { TABS_CONTEXT } from './rc-tabs.vue';

	// Faithful port of rc-tabs@11 <TabPane>.
	const props = withDefaults(
		defineProps<{
			tabKey: string | number;
			tab?: string;
			disabled?: boolean;
		}>(),
		{
			tab: '',
			disabled: false
		}
	);

	const parent = inject(TABS_CONTEXT);

	if (!parent) {
		throw new Error('RcTabPane must be used inside RcTabs');
	}

	const active = computed(() => parent.activeKey.value === props.tabKey);
	const prefixCls = computed(() => parent.prefixCls());

	onMounted(() => {
		parent.registerTab(props.tabKey, props.tab, props.disabled);
	});

	onBeforeUnmount(() => {
		parent.unregisterTab(props.tabKey);
	});
</script>

<template>
	<div
		v-if="active || !parent.destroyInactiveTabPane()"
		:class="[
			`${prefixCls}-tabpane`,
			active ? `${prefixCls}-tabpane-active` : `${prefixCls}-tabpane-inactive`
		]"
		role="tabpanel"
		tabindex="0"
	>
		<slot />
	</div>
</template>
