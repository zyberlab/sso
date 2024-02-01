<template>
	<div>
		<v-container fluid>
			<v-layout row>
				<v-flex xs12 sm12 md12 lg12 xl9>
					<v-card>
						<v-card-title class="info">
							<div class="headline white--text">Roles</div>
							<v-spacer></v-spacer>
						</v-card-title>
						<v-card-text>
							<v-form v-model="valid" ref="form" lazy-validation>
								<v-container fluid>
									<v-layout row>
										<v-flex xs4>
											<v-subheader>Metadata</v-subheader>
										</v-flex>
										<v-flex xs12>
											<v-textarea v-model="roles" :rules="rolesRules" rows="15"></v-textarea>
										</v-flex>
									</v-layout>
							</v-container>
						</v-form>
					</v-card-text>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn color="primary" @click="save">Save</v-btn>
					</v-card-actions>
				</v-card>
				</v-flex>
			</v-layout>
		</v-container>

		    <v-dialog
		      v-model="loaderDialog"
		      hide-overlay
		      persistent
		      width="300"
		    >
		      <v-card
		        color="primary"
		        dark
		      >
		        <v-card-text>
		          Please stand by
		          <v-progress-linear
		            indeterminate
		            color="white"
		            class="mb-0"
		          ></v-progress-linear>
		        </v-card-text>
		      </v-card>
		    </v-dialog>

		    <vue-snotify></vue-snotify>
	</div>
</template>



<script>
import { mapGetters } from 'vuex';
import {feathersClient} from '@/services';

function verifyJSON(json) {
	try {
		const parsed = JSON.parse(json);
		if (Object.keys(parsed).length > 0) {
			return true;
		} else {
			return false;
		}
	} catch (e) {
		return false;
	}
}

export default {
	data: () => ({
		valid: true,
		loading: false,
		loaderDialog: false,
		roles: null,
		rolesRules: [
          (v) => (v && verifyJSON(v)) || `Invalid string. Data can't be parsed.`
        ]
	}),
	created () {
		this.fetchInformation();
	},
	methods: {
		fetchInformation() {
			this.$store.dispatch('account/GET_INFORMATION')
			.then((data) => {
				if (data.roles) {
					this.roles = JSON.stringify(data.roles);
				}
			})
			.catch((error) => {
				console.log(error);
			})
		},
		save () {

			if (!this.$refs.form.validate()) {
				return;
			}

			this.loaderDialog = true;
			this.$store.dispatch('account/UPDATE_INFORMATION', {
				field: 'roles',
				data: JSON.parse(this.roles)
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
		}
	},
	watch: {
		roles(val) {
			try {
				this.roles = JSON.stringify(JSON.parse(val), null, 2);
			} catch (e) {}
		}
	}
}
</script>