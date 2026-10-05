<script setup lang="ts">
	import images from '@/utils/images';
</script>

<template>
	<div class="lsc_hints">
		<div class="lsc_hints-item">
			<img :src="images.getImage('mouse-drag.svg')" alt="mouse left" />

			<p class="lsc_hints-text">Поворот</p>
		</div>
	</div>
</template>
