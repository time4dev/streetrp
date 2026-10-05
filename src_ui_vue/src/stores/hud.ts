import { defineStore } from 'pinia';

export type CaptureTeam = {
	name: string;
	members: number;
};

export type Capture = {
	time: number;
	attacker: CaptureTeam;
	defender: CaptureTeam;
};

export type HudState = {
	visible: boolean;
	tasks: boolean;
	capture?: Capture;
};

export const useHudStore = defineStore('hud', {
	state: (): HudState => ({
		visible: true,
		tasks: true,
		capture: undefined
	}),
	actions: {
		setVisible(state: boolean) {
			this.visible = state;
		},
		setCapture(data?: Capture) {
			this.capture = data;
		}
	}
});
