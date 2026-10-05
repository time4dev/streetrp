<script setup lang="ts">
	import { useTabletRouter } from '@/composables/use-tablet-router';
	import { getApps } from '../apps';

	// framework7-react <List noChevron><ListItem reloadAll link .../></List>
	const props = withDefaults(
		defineProps<{
			tabs: ReturnType<typeof getApps>;
			activeTab: string;
			openTab: (name: string) => void;
		}>(),
		{}
	);

	const router = useTabletRouter();

	function open(key: string, route: string) {
		props.openTab(key);

		// legacy: <ListItem reloadAll link={route}> — reloadAll clears the page stack
		router.navigate(route, undefined, { reloadAll: true });
	}
</script>

<template>
	<div class="tablet_tabs">
		<div class="list no-chevron">
			<ul>
				<template v-for="(item, key) in props.tabs" :key="key">
					<li
						:class="['item-content', 'item-link', { 'item-selected': String(key) === props.activeTab }]"
						@click="open(String(key), item.route)"
					>
						<div class="item-media">
							<i class="tablet_tabs-icon" :style="{ backgroundColor: item.color }">
								<component :is="item.icon" />
							</i>
						</div>

						<div class="item-inner">
							<div class="item-title">{{ item.title }}</div>
						</div>
					</li>
				</template>
			</ul>
		</div>
	</div>
</template>
