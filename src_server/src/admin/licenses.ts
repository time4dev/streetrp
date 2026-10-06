import playerLicenses, { expirationDays } from 'player/licenses';
import permissions from './permissions';
import journal from './journal';

class AdminLicenses {
	constructor() {
		mp.events.subscribe({
			'Admin-GiveLicense': this.give.bind(this),
			'Admin-WithdrawLicense': this.withdraw.bind(this),
			'Admin-GetPlayerLicenses': this.getPlayerLicenses.bind(this)
		});
	}

	private async give(admin: Player, userId: string, license: string) {
		if (!permissions.hasPermission(admin, 'admin')) return;

		const target = this.getTarget(userId);

		if (!target) return mp.events.reject('Игрок не в сети');
		if (!(license in expirationDays)) return mp.events.reject('Неизвестная лицензия');

		await playerLicenses.give(target, license);

		journal.recordAction(
			admin,
			'license',
			`${target.getName()} | ${license}`,
			target.dbId
		);
	}

	private async withdraw(admin: Player, userId: string, license: string) {
		if (!permissions.hasPermission(admin, 'admin')) return;

		const target = this.getTarget(userId);

		if (!target) return mp.events.reject('Игрок не в сети');
		if (!(license in expirationDays)) return mp.events.reject('Неизвестная лицензия');

		await playerLicenses.withdraw(target, license);

		journal.recordAction(
			admin,
			'license_withdraw',
			`${target.getName()} | ${license}`,
			target.dbId
		);
	}

	private getPlayerLicenses(admin: Player, userId: string) {
		if (!permissions.hasPermission(admin, 'helper')) return {};

		const target = this.getTarget(userId);

		return target ? target.licenses : {};
	}

	private getTarget(userId: string) {
		return mp.players.getByDbId(userId);
	}
}

const licenses = new AdminLicenses();

export default licenses;
