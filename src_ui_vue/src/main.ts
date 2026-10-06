import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import './stores/events';

import 'assets/styles/framework7.css';
import 'assets/styles/vendor/rc-slider.css';
import 'assets/styles/vendor/rc-checkbox.css';
import 'assets/styles/vendor/react-datepicker.css';
import 'assets/styles/index.scss';
import 'assets/styles/vue-transitions.scss';

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount('#root');
