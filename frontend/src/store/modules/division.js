import {feathersClient} from '@/services';

const division = {
	namespaced: true,
	state: {},
	getters: {},
	mutations: {},
	actions: {
		GET_DIVISIONS ({}) {
			return feathersClient.service('divisions').find({
				query: {
					$paginate: {
						value: false
					}
				}
			});
		}
	}
}

export default division;