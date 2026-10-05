import { defineStore } from 'pinia';

export type Member = {
	userId: string;
	name: string;
	rank: string;
	online: boolean;
};

export type Rank = {
	id: string;
	name: string;
};

type MembersState = {
	items: Member[];
};

type RanksState = {
	items: Rank[];
};

export const useTabletMembersStore = defineStore('tablet-members', {
	state: (): MembersState => ({
		items: []
	}),
	actions: {
		loadMembers(members: Member[]) {
			this.items = [...this.items, ...members];
		},
		updateMember(data: Member) {
			this.items = this.items.map((member) =>
				member.userId === data.userId ? { ...member, ...data } : member
			);
		},
		removeMember(userId: string) {
			this.items = this.items.filter((member) => member.userId !== userId);
		},
		resetMembers() {
			this.items = [];
		},
		reset() {
			this.$reset();
		}
	}
});

export const useTabletRanksStore = defineStore('tablet-ranks', {
	state: (): RanksState => ({
		items: []
	}),
	actions: {
		loadRanks(ranks: Rank[]) {
			this.items = ranks;
		},
		reset() {
			this.$reset();
		}
	}
});
