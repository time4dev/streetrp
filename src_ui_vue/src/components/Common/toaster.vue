<script setup lang="ts">
	import { computed } from 'vue';
	import { toastState, type Container } from '@/utils/notifications';

	// Renders the same DOM/class structure react-toastify produced,
	// so the legacy stylesheets (assets/styles/components/notifications.scss) keep working.
	const props = defineProps<{ container: Container }>();

	const toasts = computed(() => toastState[props.container]);
	const containerClass = computed(() =>
		props.container === 'hud' ? 'notifications' : 'menu-notifications'
	);
	const transitionName = computed(() => (props.container === 'hud' ? 'toast-zoom' : 'toast-flip'));
</script>

<template>
	<div class="Toastify">
		<div :class="['Toastify__toast-container', containerClass]">
			<TransitionGroup :name="transitionName">
				<div
					v-for="toast in toasts"
					:key="toast.id"
					:class="[
						'Toastify__toast',
						`Toastify__toast--${toast.type === 'warn' ? 'warning' : toast.type}`,
						container === 'hud' ? 'notifications_item' : 'menu-notifications-item'
					]"
				>
					<div
						:class="[
							'Toastify__toast-body',
							container === 'hud' ? 'notifications_body' : 'menu-notifications-body'
						]"
					>
						{{ toast.message }}
					</div>
				</div>
			</TransitionGroup>
		</div>
	</div>
</template>
