<script setup lang="ts">
	import images from '@/utils/images';
</script>

<template>
	<div class="inventory_hints">
		<div class="inventory_hints-item">
			<img :src="images.getImage('esc-key.svg')" alt="mouse left" />

			<p class="inventory_hints-text">
				Нажмите <br />
				Чтобы закрыть инвентарь
			</p>
		</div>

		<div class="inventory_hints-item">
			<img :src="images.getImage('mouse-left.svg')" alt="mouse left" />

			<p class="inventory_hints-text">
				Нажать на предмет <br />
				Показать информацию о предмете
			</p>
		</div>

		<div class="inventory_hints-item">
			<img :src="images.getImage('zero-key.svg')" alt="mouse left" />

			<p class="inventory_hints-text">
				Нажмите <br />
				Чтобы убрать предмет из рук
			</p>
		</div>
	</div>
</template>
