<script setup lang="ts">
	import { IoIosArrowBack } from '@/utils/icons';
	import type { FunctionalComponent } from 'vue';

	defineProps<{
		className?: string;
		title?: string;
		close?: {
			title: string;
			onClick: () => void;
		};
		action?: {
			title: string | FunctionalComponent;
			onClick?: () => void;
			form?: string;
		};
	}>();
</script>

<template>
	<div class="phone_navigation">
		<button
			v-if="close"
			type="button"
			class="phone_navigation-back"
			@click="close.onClick"
		>
			<IoIosArrowBack />
			<span>{{ close.title }}</span>
		</button>

		<h3 class="phone_navigation-title">{{ title }}</h3>

		<button
			v-if="action"
			:type="action.form ? 'submit' : 'button'"
			:form="action.form"
			class="phone_navigation-action"
			@click="action.onClick"
		>
			<span>
				<component :is="action.title" v-if="typeof action.title !== 'string'" />
				<template v-else>{{ action.title }}</template>
			</span>
		</button>
	</div>
</template>
