<script setup lang="ts">
	import { useForm, useField } from 'vee-validate';
	import rpc from '@/utils/rpc';
	import Tabs from '@/components/Common/rc-tabs.vue';
	import RcTabPane from '@/components/Common/rc-tab-pane.vue';
	import GradientButton from '@/components/Common/gradient-button.vue';
	import Players from '../partials/players.vue';

	const { handleSubmit, setFieldValue } = useForm({
		initialValues: { type: 'player', player: '', x: '', y: '', z: '' }
	});

	const { value: x } = useField<string | number>('x');
	const { value: y } = useField<string | number>('y');
	const { value: z } = useField<string | number>('z');

	function onTabChange(key: string | number) {
		setFieldValue('type', String(key));
	}

	const onSubmit = handleSubmit(({ type, player, ...coords }: any) => {
		rpc.callServer('Admin-Teleport', [type, player, coords]);
	});
</script>

<template>
	<div class="admin_teleport">
		<form @submit="onSubmit">
			<Tabs prefix-cls="admin_tabs" default-active-key="player" @change="onTabChange">
				<RcTabPane tab-key="player" tab="К игроку">
					<Players :on-change="(data: any) => setFieldValue('player', data.id)" />
					<GradientButton type="submit">Подтвердить</GradientButton>
				</RcTabPane>

				<RcTabPane tab-key="yourself" tab="К себе">
					<Players :on-change="(data: any) => setFieldValue('player', data.id)" />
					<GradientButton type="submit">Подтвердить</GradientButton>
				</RcTabPane>

				<RcTabPane tab-key="waypoint" tab="На метку">
					<GradientButton type="submit">Подтвердить</GradientButton>
				</RcTabPane>

				<RcTabPane tab-key="coords" tab="Координаты">
					<input
						v-model="x"
						class="admin_field"
						type="number"
						name="x"
						placeholder="X"
					/>
					<input
						v-model="y"
						class="admin_field"
						type="number"
						name="y"
						placeholder="Y"
					/>
					<input
						v-model="z"
						class="admin_field"
						type="number"
						name="z"
						placeholder="Z"
					/>

					<GradientButton type="submit">Подтвердить</GradientButton>
				</RcTabPane>
			</Tabs>
		</form>
	</div>
</template>
