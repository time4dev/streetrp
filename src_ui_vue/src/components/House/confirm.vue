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
	<div class="house_confirm">
		<div class="house_confirm-container">
			<PrimaryTitle class-name="house_confirm-title">
				Продажа дома государству
			</PrimaryTitle>

			<p class="house_confirm-remark">
				Вы действительно хотите <b>продать дом государству</b>?
			</p>

			<div class="house_confirm-buttons">
				<OutlineButton @click="cancel">Закрыть</OutlineButton>
				<GradientButton @click="submit">Продать</GradientButton>
			</div>
		</div>
	</div>
</template>
