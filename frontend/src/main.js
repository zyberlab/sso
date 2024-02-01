import Vue from 'vue';
import router from './router';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import { VueExtendLayout, layout } from 'vue-extend-layout';
import VueLazyload from 'vue-lazyload';
import Vue2Filters from 'vue2-filters';
import { store } from '@/store/index';
import Snotify, { SnotifyPosition } from 'vue-snotify';
import 'vue-snotify/styles/material.css';
import { socket } from '@/services';
import { VueMaskDirective } from 'v-mask';

Vue.use(Vuetify);
Vue.use(VueExtendLayout);
Vue.use(VueLazyload, {
	silent: true
});
Vue.use(Vue2Filters);
Vue.use(Snotify, {
	toast: {
		position: SnotifyPosition.rightTop,
		timeout: 3000
	}
});
Vue.directive('mask', VueMaskDirective);

Vue.config.productionTip = false;

let app;

async function start() {
	if (app) return;

	try {
		await store.dispatch('account/CHECK_AUTHENTICATION');
	} catch (e) {
		console.log('Not authenticated');
	}

	app = new Vue({
		el: '#app',
		store,
		router,
		...layout
	});
}

start();

socket.on('LOG_OUT', a => {
	window.parent.postMessage(
		{
			action: 'LOG_OUT',
			userId: a
		},
		'*'
	);
});
