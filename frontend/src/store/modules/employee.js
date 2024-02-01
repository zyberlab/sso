import { feathersClient } from '@/services';

const employee = {
	namespaced: true,
	state: {
        list: [],
        isLoaded: false
    },
	mutations: {
        SET_LIST(state, payload) {
            state.list = payload;
        },
        SET_IS_LOADED(state, payload) {
            state.isLoaded = payload;
        },
        ADD_TO_LIST(state, payload) {
            state.list.push(payload);
        }
    },
	actions: {
		async GET_EMPLOYEES ({ state, commit }) {
            if (state.isLoaded) return;

			try {
                const data = await feathersClient.service('users').find({
                    query: {
                        $paginate: {
                            value: false
                        }
                    }
                });
                
                commit('SET_LIST', data);
                commit('SET_IS_LOADED', true);
            } catch (e) {
                console.log('Error loading employees');
                console.log(e);
            }
		}
	}
}

export default employee;