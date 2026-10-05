<script setup lang="ts">
	import images from '@/utils/images';

	defineProps<{
		username: string;
		rank: string;
		faction: string;
	}>();
</script>

<template>
	<!-- framework7-react <List mediaList><ListItem title footer><img slot="media"/></ListItem></List> -->
	<div class="tablet_profile">
		<div class="list media-list">
			<ul>
				<li class="item-content">
					<div class="item-media">
						<img :src="images.getImage(`${faction}_logo.png`, 'factions')" alt="avatar" />
					</div>

					<div class="item-inner">
						<div class="item-title">{{ username }}</div>
						<div class="item-footer">{{ rank }}</div>
					</div>
				</li>
			</ul>
		</div>
	</div>
</template>
