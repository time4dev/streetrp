import { createApp } from 'vue';
import { createPinia } from 'pinia';
import PrimeVue from 'primevue/config';
import { definePreset } from '@primevue/themes';
import Aura from '@primevue/themes/aura';
import App from './App.vue';
import router from './router';
import './stores/events';

import 'assets/styles/framework7.css';
import 'assets/styles/vendor/rc-slider.css';
import 'assets/styles/vendor/rc-checkbox.css';
import 'assets/styles/vendor/react-datepicker.css';
import 'assets/styles/index.scss';
import 'assets/styles/vue-transitions.scss';

// Recolour the Aura preset to the project's purple palette.
const StreetPreset = definePreset(Aura, {
	semantic: {
		primary: {
			50: '#fbe9fb',
			100: '#f6d0f6',
			200: '#eba8eb',
			300: '#e07fe0',
			400: '#d257d6',
			500: '#b93dbf',
			600: '#9a2ea0',
			700: '#7a2480',
			800: '#5b1a60',
			900: '#3d1141',
			950: '#280b2b'
		}
	}
});

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(PrimeVue, {
	theme: {
		preset: StreetPreset,
		options: {
			darkModeSelector: '.p-dark',
			cssLayer: false
		}
	}
});

// The game UI is dark only, so PrimeVue dark mode is always on.
document.documentElement.classList.add('p-dark');

app.mount('#root');
