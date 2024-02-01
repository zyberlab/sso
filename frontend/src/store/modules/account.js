import { feathersClient } from '@/services';

const account = {
	namespaced: true,
	state: {
		employee_data: {},
		isAuthenticated: false
	},
	getters: {
		GET_EMPLOYEE_DATA: state => state.employee_data
	},
	mutations: {
		SET_EMPLOYEE_DATA (state, payload) {
			state.employee_data = payload;
		},
		SET_AUTHENTICATED (state, payload) {
			state.isAuthenticated = payload;
		}
	},
	actions: {
		async LOGIN ({ commit }, user) {
			try {
				const idNumber = `${user.idNumber}@mail.com`;
				const response = await feathersClient.authenticate({
					strategy: 'local',
					email: idNumber,
					password: user.password
				});
				const payload = await feathersClient.passport.verifyJWT(response.accessToken);
				const userData = await feathersClient.service('users').get(payload.userId);
				console.log(userData)
				commit('SET_AUTHENTICATED', true);
				commit('SET_EMPLOYEE_DATA', userData);
				return userData;
			} catch (error) {
				throw error;
			}
		},
		
		async GET_INFORMATION ({}) {
			try {
				const accessToken = (await feathersClient.authenticate()).accessToken;
				const payload = await feathersClient.passport.verifyJWT(accessToken);
				return await feathersClient.service('users').get(payload.userId);
			} catch (error) {
				throw error;
			}
		},
		
		async UPDATE_INFORMATION ({commit}, {field, data, userId}) {
			try {
				const obj = {};
				obj[field] = data;
				
				const accessToken = (await feathersClient.authenticate()).accessToken;
				const payload = await feathersClient.passport.verifyJWT(accessToken);
				commit('SET_EMPLOYEE_DATA', obj);
				
				if (!userId) {
					userId = payload.userId
				}
				return await feathersClient.service('users').patch(userId, obj);
			} catch (error) {
				throw error;
			}
		},
		
		async SAVE_EMPLOYEE ({ commit }, payload) {
			const newEmployee = await feathersClient.service('users').create(payload);
			commit('employee/ADD_TO_LIST', newEmployee, { root: true });
			return newEmployee;
		},
		
		async CHECK_AUTHENTICATION ({commit}) {
			try {
				
				const ssoToken = localStorage.getItem('sso-jwt');
				
				if (ssoToken) {
					const payload = await feathersClient.passport.verifyJWT(ssoToken);
					const user = await feathersClient.service('users').get(payload.userId);
					
					console.log('User', user)
					
					return;
				}
				
				const accessToken = (await feathersClient.authenticate()).accessToken;
				const userId = (await feathersClient.passport.verifyJWT(accessToken)).userId;
				const userData = await feathersClient.service('users').get(userId);
				commit('SET_AUTHENTICATED', true);
				commit('SET_EMPLOYEE_DATA', userData);
				return userData;
			} catch (error) {
				throw error;
			}
		},
		
		async CHECK_ID_NUMBER ({}, idNumber) {
			try {
				const res =  await feathersClient.service('users').find({
					query: {
						emp_id: idNumber
					}
				});
				
				return {
					exists: res.data.length > 0,
					data: res.data
				}
			} catch (error) {
				throw error;
			}
		}
	}
}

export default account;