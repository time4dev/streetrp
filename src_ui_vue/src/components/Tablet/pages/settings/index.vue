<script setup lang="ts">
	import { ref } from 'vue';
	import F7Page from '../../f7/page.vue';
	import F7Navbar from '../../f7/navbar.vue';
	import F7List from '../../f7/list.vue';
	import F7ListItem from '../../f7/list-item.vue';
	import F7Toggle from '../../f7/toggle.vue';

	const lightTheme = ref(false);

	function toggleTabletTheme(checked: boolean) {
		lightTheme.value = checked;
	}
</script>

<template>
	<F7Page>
		<template #fixed>
			<F7Navbar title="Настройки" />
		</template>

		<F7List inset>
			<F7ListItem title="Светлая тема">
				<template #after>
					<F7Toggle
						color="green"
						name="theme"
						:checked="lightTheme"
						@change="toggleTabletTheme"
					/>
				</template>
			</F7ListItem>
		</F7List>
	</F7Page>
</template>
