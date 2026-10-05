import { defineStore } from 'pinia';

export type Call = {
	type: 'incoming' | 'outgoing';
	phoneNumber: string;
	isRecieve?: boolean;
};

export type PhoneState = {
	call?: Call;
	wallpaper: string;
};

export const usePhoneStore = defineStore('phone', {
	state: (): PhoneState => ({
		call: undefined,
		wallpaper: '0'
	}),
	actions: {
		setCall(data?: Call) {
			this.call = data;
		},
		acceptCall() {
			if (this.call) this.call = { ...this.call, isRecieve: true };
		},
		setWallpaper(name: string) {
			this.wallpaper = name;
		}
	}
});
