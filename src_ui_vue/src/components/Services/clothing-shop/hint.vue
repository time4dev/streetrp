<script setup lang="ts">
	import images from '@/utils/images';
</script>

<template>
	<div class="clothing-shop_hint">
		<img :src="images.getImage('mouse-drag.svg')" alt="mouse left" />

		<p class="clothing-shop_hint-text">Поворот персонажа</p>
	</div>
</template>
