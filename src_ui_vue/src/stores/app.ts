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

export type AppState = {
	date: string;
	online: number;
	chat: string[];
};

export const useAppStore = defineStore('app', {
	state: (): AppState => ({
		date: new Date().toISOString(),
		online: 0,
		chat: []
	}),
	actions: {
		setDate(date: string) {
			this.date = date;
		},
		sendMessage(message: string) {
			this.chat =
				this.chat.length >= 40 ? [...this.chat.slice(-39), message] : [...this.chat, message];
		},
		setOnline(count: number) {
			this.online = count;
		}
	}
});
