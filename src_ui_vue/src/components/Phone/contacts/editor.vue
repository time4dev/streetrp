<script setup lang="ts">
	import { useForm } from 'vee-validate';
	import * as yup from 'yup';
	import { IoIosContact } from '@/utils/icons';
	import type { ContactData } from './index.vue';
	import Navigation from '../partials/navigation.vue';
	import Input from '../partials/input.vue';
	import Button from '../partials/button.vue';
	import Group from '../partials/group.vue';

	const props = defineProps<{
		contact?: ContactData;
		save: (data: ContactData) => Promise<void>;
		remove: () => Promise<void>;
		close: () => void;
	}>();

	const { handleSubmit } = useForm({
		initialValues: props.contact ?? { firstName: '', lastName: '', phone: '' },
		validationSchema: yup.object({
			firstName: yup.string().trim().required().min(1).max(32),
			lastName: yup.string().trim().required().min(1).max(32),
			phone: yup
				.string()
				.trim()
				.required()
				.min(6)
				.max(6)
				.matches(/^[0-9]+$/)
		})
	});

	const onSubmit = handleSubmit((values) => props.save(values as ContactData));
</script>

<template>
	<div class="contacts_editor">
		<Navigation
			:close="{ title: 'Отменить', onClick: close }"
			:action="{ title: 'Готово', form: 'contact-editor' }"
		/>

		<div class="avatar">
			<template v-if="contact">
				{{ contact.firstName.charAt(0) }}{{ contact.lastName.charAt(0) }}
			</template>
			<IoIosContact v-else />
		</div>

		<form id="contact-editor" @submit="onSubmit">
			<Group>
				<Input type="text" name="firstName" placeholder="Имя" />
				<Input type="text" name="lastName" placeholder="Фамилия" />
				<Input type="text" name="phone" placeholder="Номер телефона" />
			</Group>
		</form>

		<Button v-if="contact" :on-click="remove" color="red">Удалить контакт</Button>
	</div>
</template>
