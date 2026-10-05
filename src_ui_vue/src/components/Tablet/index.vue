<script setup lang="ts">
	import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
	import { useAppStore } from '@/stores/app';
	import { useTabletMembersStore, useTabletRanksStore } from '@/stores/tablet';
	import { useTabletRouter } from '@/composables/use-tablet-router';
	import routes from './routes';
	import Details from './details.vue';
	import StatusBar from './status-bar.vue';
	import Sidebar from './sidebar/index.vue';

	export type User = {
		name: string;
		faction: string;
		rank: string;
	};

	const appStore = useAppStore();
	const membersStore = useTabletMembersStore();
	const ranksStore = useTabletRanksStore();
	const router = useTabletRouter();

	const lightTheme = ref(true);
	const activeTab = ref('');
	const user = ref<User>({
		name: 'Test Testovich',
		faction: 'lspd',
		rank: 'Раб'
	});

	onMounted(() => {
		const state = (history.state ?? {}) as {
			user?: User;
			reset?: boolean;
		};

		// legacy mapDispatchToProps: resetTablet = dispatch({ type: RESET_STATE })
		if (state.reset) {
			membersStore.reset();
			ranksStore.reset();
		}

		if (state.user) user.value = state.user;
	});

	onBeforeUnmount(() => {
		membersStore.resetMembers();
	});

	function openTab(name: string) {
		activeTab.value = name;
	}

	function openTabRoute(name: string) {
		openTab(name);
	}

	const currentPage = computed(() => {
		const route = router.state.stack[router.state.stack.length - 1];

		if (!route) return null;

		return { component: routes[route.path], props: route.props ?? {}, path: route.path };
	});

	defineExpose({ openTab: openTabRoute });
</script>

<template>
	<div class="tablet">
		<Details />

		<!-- framework7-react <App theme="ios" themeDark={!lightTheme}> -->
		<div class="framework7-root ios" :class="{ 'theme-dark': !lightTheme }">
			<div class="tablet_container">
				<StatusBar :date="appStore.date" />

				<div class="tablet_content">
					<Sidebar
						:user="user"
						:active-tab="activeTab"
						:open-tab="openTab"
					/>

					<div class="tablet_tab">
						<Transition name="fadeIn">
							<component
								:is="currentPage.component"
								v-if="currentPage"
								:key="currentPage.path"
								v-bind="currentPage.props"
							/>
						</Transition>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
