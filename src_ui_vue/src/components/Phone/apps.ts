import Main from './main/index.vue';
import Keypad from './keypad/index.vue';
import Contacts from './contacts/index.vue';
import Settings from './settings/index.vue';
import Maps from './maps/index.vue';
import Sim from './sim/index.vue';
import Vehicles from './vehicles/index.vue';
import Referral from './referral/index.vue';
import Support from './support/index.vue';
import Donation from './donation/index.vue';

export type PhoneApp = {
	name: string;
	component: any;
	attached?: boolean;
};

const apps: { [key: string]: PhoneApp } = {
	maps: {
		name: 'Карты',
		component: Maps
	},
	sim: {
		name: 'Racoon',
		component: Sim
	},
	referral: {
		name: 'Referral',
		component: Referral
	},
	vehicles: {
		name: 'Транспорт',
		component: Vehicles
	},
	donation: {
		name: 'Магазин',
		component: Donation
	},
	support: {
		name: 'Поддержка',
		component: Support
	},

	calls: {
		name: 'Звонки',
		component: Keypad,
		attached: true
	},
	contacts: {
		name: 'Контакты',
		component: Contacts,
		attached: true
	},
	messages: {
		name: 'Сообщения',
		component: Main,
		attached: true
	},
	settings: {
		name: 'Настройки',
		component: Settings,
		attached: true
	}
};

export default apps;
