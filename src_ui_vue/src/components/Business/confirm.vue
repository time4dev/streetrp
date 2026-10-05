<script setup lang="ts">
	import PrimaryTitle from '@/components/Common/primary-title.vue';
	import OutlineButton from '@/components/Common/outline-button.vue';
	import GradientButton from '@/components/Common/gradient-button.vue';

	defineProps<{
		submit: () => void;
		cancel: () => void;
	}>();
</script>

<template>
	<div class="business_confirm">
		<div class="business_confirm-container">
			<PrimaryTitle class-name="business_confirm-title">
				Продажа бизнеса государству
			</PrimaryTitle>

			<p class="business_confirm-remark">
				Вы действительно хотите <b>продать бизнес государству</b>?
			</p>

			<div class="business_confirm-buttons">
				<OutlineButton @click="cancel">Закрыть</OutlineButton>
				<GradientButton @click="submit">Продать</GradientButton>
			</div>
		</div>
	</div>
</template>
