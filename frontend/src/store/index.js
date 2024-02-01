import Vue from 'vue';
import Vuex from 'vuex';

import account from './modules/account';
import division from './modules/division';
import employee from './modules/employee';

Vue.use(Vuex)

export const store = new Vuex.Store({
    modules: {
        account,
        division,
        employee
    },
});