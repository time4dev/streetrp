<script setup lang="ts">
	import rpc from '@/utils/rpc';
	import GradientButton from '@/components/Common/gradient-button.vue';
	import PrimaryTitle from '@/components/Common/primary-title.vue';
</script>

<template>
	<div class="promo">
		<div class="promo_container">
			<PrimaryTitle class-name="promo_title">Первые шаги</PrimaryTitle>

			<div class="promo_remark">
				Для полноценного просмотра не забудьте включить звук в игре
			</div>

			<div class="promo_video">
				<iframe title="StreetRP" src="https://www.youtube.com/embed/PBnjkfUZ2vs"></iframe>
			</div>

			<GradientButton @click="rpc.callServer('Character-ShowCreator')">Начать</GradientButton>
		</div>
	</div>
</template>
