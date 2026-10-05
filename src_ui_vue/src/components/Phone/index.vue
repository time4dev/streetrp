<script setup lang="ts">
	import { computed, inject, onBeforeUnmount, onMounted, provide, ref, watch } from 'vue';
	import rpc from '@/utils/rpc';
	import images from '@/utils/images';
	import { useAppStore } from '@/stores/app';
	import { usePhoneStore } from '@/stores/phone';
	import { PHONE_CONTEXT } from './context';
	import apps from './apps';
	import Brow from './brow.vue';
	import StatusBar from './status-bar.vue';
	import Main from './main/index.vue';
	import Call from './call/index.vue';

	const appStore = useAppStore();
	const phoneStore = usePhoneStore();

	const visible = ref(false);
	const app = ref<string | undefined>(undefined);

	function openApp(name?: string) {
		app.value = name;
	}

	provide(PHONE_CONTEXT, { openApp });

	onMounted(() => {
		rpc.register(
			'Phone-CanClose',
			() => !document.activeElement || document.activeElement.tagName !== 'INPUT'
		);

		setTimeout(() => (visible.value = true), 100);
	});

	onBeforeUnmount(() => {
		rpc.unregister('Phone-CanClose');
	});

	// legacy componentDidUpdate: on incoming call open the call screen
	watch(
		() => phoneStore.call,
		(call, previous) => {
			if (call && !previous) openApp('');
		}
	);

	const appComponent = computed(() => (app.value ? apps[app.value].component : Main));
</script>

<template>
	<Transition name="slideUp">
		<div v-if="visible" class="phone">
			<Brow />

			<div
				:id="phoneStore.call ? 'call' : app"
				class="phone_container"
				:style="{
					backgroundImage: `url(${images.getImage(`${phoneStore.wallpaper}_wp.jpg`, 'phone')})`
				}"
			>
				<StatusBar :date="appStore.date" />

				<!-- legacy timeout {enter: 300, exit: 0}: leave is instant -->
				<Transition name="ios-quick">
					<Call v-if="phoneStore.call" />

					<template v-else>
						<component :is="appComponent" />

						<button
							v-if="app"
							class="phone_close-btn"
							@click="openApp(undefined)"
						/>
					</template>
				</Transition>
			</div>
		</div>
	</Transition>
</template>

<style>
	/* legacy CSSTransition exit timeout was 0 for the app area */
	.ios-quick-leave-active {
		transition: none;
	}
</style>
