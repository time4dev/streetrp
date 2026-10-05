<script setup lang="ts">
	import F7Page from '../../f7/page.vue';
	import F7Navbar from '../../f7/navbar.vue';
	import F7List from '../../f7/list.vue';
	import F7ListItem from '../../f7/list-item.vue';
</script>

<template>
	<F7Page>
		<template #fixed>
			<F7Navbar title="База данных" />
		</template>

		<F7List inset>
			<F7ListItem link="users/" title="Граждани" />
			<F7ListItem link="vehicles/" title="Транспортные средства" />
			<F7ListItem link="/wanted/" title="Розыск" />
		</F7List>
	</F7Page>
</template>
