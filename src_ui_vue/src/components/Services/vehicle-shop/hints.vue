<script setup lang="ts">
	import images from '@/utils/images';
</script>

<template>
	<div class="vehicle-shop_hints">
		<div class="vehicle-shop_hints-item">
			<img :src="images.getImage('esc-key.svg')" alt="ESC" />

			<p class="vehicle-shop_hints-text">Нажмите, чтобы закрыть меню</p>
		</div>
	</div>
</template>
