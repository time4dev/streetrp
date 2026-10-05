<script setup lang="ts">
	import type { ContactData } from './index.vue';

	const props = defineProps<{
		selectContact: (contact: ContactData) => void;
		contacts: ContactData[];
	}>();

	const letterExisting = (prev: ContactData, next: ContactData) => {
		return prev.firstName[0].toLowerCase() === next.firstName[0].toLowerCase();
	};
</script>

<template>
	<div class="contacts_list">
		<ul>
			<li
				v-for="(contact, index) in props.contacts"
				:key="index"
				@click="selectContact(contact)"
			>
				<h3
					v-if="index === 0 || !letterExisting(props.contacts[index - 1], contact)"
					class="letter"
				>
					{{ contact.firstName[0].toUpperCase() }}
				</h3>

				<p class="name">
					<b>{{ contact.firstName }}</b> {{ contact.lastName }}
				</p>
			</li>
		</ul>
	</div>
</template>
