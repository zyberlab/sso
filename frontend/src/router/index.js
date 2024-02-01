import Vue from 'vue';
import Router from 'vue-router';
import Login from '@/pages/Login';
import Employees from '@/pages/Employees';
import Profile from '@/pages/Profile';
import ExtraInformation from '@/pages/ExtraInformation';
import UpdatePassword from '@/pages/UpdatePassword';
import Roles from '@/pages/Roles';
import NewEmployee from '@/pages/NewEmployee';
import Signature from '@/pages/Signature';
import { feathersClient } from '@/services';

import { store } from '@/store';

Vue.use(Router);

const router = new Router({
	routes: [
		{
			path: '/',
			name: 'Login',
			component: Login
		},
		{
			path: '/employees',
			name: 'Employees',
			component: Employees,
			meta: {
				layout: 'employee'
			}
		},
		{
			path: '/profile',
			name: 'Profile',
			component: Profile,
			meta: {
				layout: 'employee'
			}
		},
		{
			path: '/extra-information',
			name: 'ExtraInformation',
			component: ExtraInformation,
			meta: {
				layout: 'employee'
			}
		},
		{
			path: '/update-password',
			name: 'UpdatePassword',
			component: UpdatePassword,
			meta: {
				layout: 'employee'
			}
		},
		{
			path: '/roles',
			name: 'Roles',
			component: Roles,
			meta: {
				layout: 'employee'
			}
		},
		{
			path: '/new-employee',
			name: 'NewEmployee',
			component: NewEmployee,
			meta: {
				layout: 'employee'
			}
		},
		{
			path: '/signature',
			name: 'Signature',
			component: Signature,
			meta: {
				layout: 'employee'
			}
		}
	]
});

router.beforeEach(async (to, _, next) => {
	const { isAuthenticated, employee_data: user } = store.state.account;

	if (inIframe()) {
		if (isAuthenticated) {
			window.parent.postMessage(
				{
					action: 'LOGIN',
					success: true,
					user,
					token: localStorage.getItem('feathers-jwt')
				},
				'*'
			);
		} else {
			window.parent.postMessage(
				{
					action: 'LOGIN',
					success: false
				},
				'*'
			);
		}

		return;
	}

	if (isAuthenticated) {
		if (to.path === '/') {
			next({
				path: '/profile'
			});
		} else if (to.path === '/logout' && to.query.continue) {
			await feathersClient.logout();
			store.commit('account/SET_AUTHENTICATED', false);
			location.replace(to.query.continue);
		} else {
			next();
		}
	} else {
		if (to.path !== '/') {
			next({
				path: '/'
			});
		} else {
			next();
		}
	}
});

function inIframe() {
	try {
		return window.self !== window.top;
	} catch (e) {
		return true;
	}
}

export default router;
