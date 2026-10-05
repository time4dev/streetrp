import { defineStore } from 'pinia';

export type Money = {
	cash: number;
	bank: number;
	points: number;
};

export type PlayerState = {
	id: number;
	satiety: number;
	money: Money;
	tasks: string[];
	bonus: number;
};

export const usePlayerStore = defineStore('player', {
	state: (): PlayerState => ({
		id: 0,
		satiety: 100,
		money: {
			cash: 0,
			bank: 0,
			points: 0
		},
		bonus: -1,
		tasks: []
	}),
	actions: {
		setSatiety(amount: number) {
			this.satiety = amount;
		},
		setMoney(data: Money) {
			this.money = data;
		},
		setTasks(tasks: string[]) {
			this.tasks = tasks;
		},
		setId(id: number) {
			this.id = id;
		},
		setBonus(time: number) {
			this.bonus = time;
		}
	}
});
