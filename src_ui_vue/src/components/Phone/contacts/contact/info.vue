<script setup lang="ts">
	import prettify from '@/utils/prettify';

	defineProps<{
		phone: string;
	}>();
</script>

<template>
	<div class="contacts_contact-info">
		<ul>
			<li>
				<h4>Сотовый</h4>
				<p>{{ prettify.phoneNumber(phone) }}</p>
			</li>
		</ul>
	</div>
</template>
