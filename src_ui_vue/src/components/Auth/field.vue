<script setup lang="ts">
	import { ref } from 'vue';
	import { useField } from 'vee-validate';
	import { IoIosClose, IoIosEye, IoIosEyeOff } from '@/utils/icons';

	const props = defineProps<{
		title: string;
		type: string;
		name: string;
		placeholder: string;
		className?: string;
	}>();

	const passwordVisible = ref(false);

	// Formik <Field> + <ErrorMessage> equivalent
	const { value, setValue, errorMessage } = useField<string | number>(props.name);
</script>

<template>
	<div :class="['auth_field', className]">
		<h4 class="auth_field-title">{{ title }}</h4>

		<div class="auth_field-input">
			<input
				v-model="value"
				:type="passwordVisible ? 'text' : type"
				:placeholder="placeholder"
			/>

			<template v-if="type === 'password'">
				<div class="auth_field-reset">
					<IoIosEye v-if="passwordVisible" @click="passwordVisible = false" />
					<IoIosEyeOff v-else @click="passwordVisible = true" />
				</div>
			</template>

			<div v-else-if="value" class="auth_field-reset">
				<IoIosClose @click="setValue(type !== 'number' ? '' : 0)" />
			</div>
		</div>

		<p v-if="errorMessage" class="auth_field-error">{{ errorMessage }}</p>
	</div>
</template>
