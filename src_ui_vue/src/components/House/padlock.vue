<script setup lang="ts">
	import { IoIosLock, IoIosUnlock } from '@/utils/icons';
	import sound from '@/assets/audio/lock.mp3';

	const props = defineProps<{
		status: boolean;
		toggle: () => Promise<void>;
	}>();

	const audio = new Audio(sound);

	function toggleLock() {
		props.toggle().then(() => audio.play());
	}
</script>

<template>
	<div class="house_padlock" @click="toggleLock">
		<div class="house_padlock-icon">
			<IoIosLock v-if="status" />
			<IoIosUnlock v-else />
		</div>

		<p class="house_padlock-remark">
			Нажмите на замок, чтобы {{ status ? 'открыть' : 'закрыть' }} дом
		</p>
	</div>
</template>
