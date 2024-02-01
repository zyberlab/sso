<template>
	<div>
		<v-container fluid>
			<v-layout row>
				<v-flex xs12 sm12 md12 lg12 xl9>
					<v-card>
						<v-card-title>
							<div class="headline">Employees</div>
							<v-spacer></v-spacer>
							<v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>
						</v-card-title>
						<v-data-table disable-initial-sort :headers="headers" :items="items" :search="search" :loading="loading" :rows-per-page-items="rowsPerPage">
							<template slot="items" slot-scope="props">
								<tr slot="activator">
									<td>{{ props.item.emp_id }}</td>
									<td>{{ props.item.personal_information.first_name }}</td>
									<td>{{ props.item.personal_information.middle_name }}</td>
									<td>{{ props.item.personal_information.surname }}</td>
									<td>{{ props.item.extra_information.appointment }}</td>
									<td>{{ props.item.extra_information.division.text }}</td>
									<td>
										<v-menu bottom left>
											<v-btn slot="activator" icon >
									            <v-icon>more_vert</v-icon>
									         </v-btn>
									         <v-card>
									         	<v-card-title>
									         		<div class="title">Update information</div>
									         	</v-card-title>
													<v-list>
														<v-list-tile @click.prevent.stop="openInfoDialog(props.item)" ripple>
															<v-list-tile-title>Roles</v-list-tile-title>
														</v-list-tile>
														<v-list-tile @click="resetPassword(props.item.emp_id, props.item._id)" ripple>
															<v-list-tile-title>Reset Password</v-list-tile-title>
														</v-list-tile>
													</v-list>
									         </v-card>
										</v-menu>	
									</td>
								</tr>
							</template>
							<v-alert slot="no-results" :value="true" color="error" icon="warning">
								Your search for "{{ search }}" found no results.
							</v-alert>
						</v-data-table>
					</v-card>
				</v-flex>
			</v-layout>
		</v-container>
		<v-dialog v-model="infoDialog" persistent max-width="490">
			<v-card>
				<v-card-title class="primary">
					<div class="headline white--text">{{infoDialogTitle}}</div>
				</v-card-title>
				<v-card-text>
					<v-form v-model="valid" ref="form" lazy-validation>
						<v-textarea :rules="rolesRules" rows="15" v-model="roles"></v-textarea>
					</v-form>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="grey darken-1" flat @click.native="infoDialog = false">Close</v-btn>
					<v-btn color="primary" @click="saveRoles">Save</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<LoaderDialog :loaderDialog="loaderDialog"/>
		<vue-snotify></vue-snotify>
	</div>
</template>

<script>
import {feathersClient as app} from '@/services';
import {verifyJSON} from '@/services/helpers';
import LoaderDialog from '@/components/LoaderDialog';

export default {
	data: () => ({
		search: null,
		loading: false,
		rowsPerPage: [10,20,35,{"text":"$vuetify.dataIterator.rowsPerPageAll","value":-1}],
		headers: [
		{ text: 'ID number', align: 'left', value: 'emp_id' },
		{ text: 'First name', value: 'personal_information.first_name' },
		{ text: 'Middle name', value: 'personal_information.middle_name' },
		{ text: 'Surname', value: 'personal_information.surname' },
		{ text: 'Appointment', value: 'extra_information.appointment' },
		{ text: 'Division', value: 'extra_information.division.text' },
		{ text: 'Actions', value: '_id', sortable: false }
		],
		valid: true,
		infoDialog: false,
		infoDialogTitle: null,
		rolesRules: [
          (v) => (v && verifyJSON(v)) || `Invalid string. Data can't be parsed.`
        ],
        roles: null,
        loaderDialog: false,
        selectedItem: {}
	}),
	async created () {
		this.loading = true;
		await this.$store.dispatch('employee/GET_EMPLOYEES');
		this.loading = false;
	},
	methods: {
		openInfoDialog (user) {
			this.roles = null;
			this.loaderDialog = true;
			this.selectedItem = user;
			app.service('users').get(user._id)
			.then((data) => {
				this.loaderDialog = false;
				if (data.roles) {
					this.roles = JSON.stringify(data.roles);
				}

				this.infoDialogTitle = 'Roles';
				this.infoDialog = true;
			});
		},
		saveRoles() {
			this.saveInformation('roles', this.roles);
		},
		saveInformation(field, value) {

			if (!this.$refs.form.validate()) {
				return;
			}
			
			if (field === 'roles') {
				value = JSON.parse(value);
			}

			this.loaderDialog = true;
			this.$store.dispatch('account/UPDATE_INFORMATION', {
				field: field,
				data: value,
				userId: this.selectedItem._id
			})
			.then((res) => {
				this.loaderDialog = false;
				this.$snotify.success('Roles has been successfully updated');
			})
			.catch((error) => {
				console.log(error);
				this.loaderDialog = false;
				this.$snotify.error('An error occurred');
			})

		},
		fetchInformation(_id) {
			return app.service('users').get(_id);
		},
		async resetPassword (employeeId, _id) {
			try {
				const c = confirm('Are you sure?');

				if (!c) {
					return;
				}

				this.loaderDialog = true;

				const response = await this.$store.dispatch('account/UPDATE_INFORMATION', {
					field: 'password',
					data: employeeId,
					userId: _id
				});

				this.loaderDialog = false;
				this.$snotify.success('Password has been successfully updated');
			} catch (error) {
				this.loaderDialog = false;
				this.$snotify.error('An error occurred');
				console.log(error);
			}
		}
	},
	watch: {
		roles(val) {
			try {
				if (val) {
					this.roles = JSON.stringify(JSON.parse(val), null, 2);
				}
			} catch (e) {}
		}
	},
	components: {
		LoaderDialog
	},
	computed: {
		items() {
			return this.$store.state.employee.list;
		}
	}
}
</script>