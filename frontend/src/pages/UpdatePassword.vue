<template>
	<div>
		<v-container fluid>
			<v-layout row>
				<v-flex xs12 sm12 md12 lg12 xl9>
					<v-card>
						<v-card-title>
							<div class="headline white--text">Update Password</div>
							<v-spacer></v-spacer>
						</v-card-title>
						<v-divider></v-divider>
						<v-card-text>
							<v-form v-model="valid" ref="form" lazy-validation>
								<v-container fluid>
									<v-layout row>
										<v-flex xs4>
											<v-subheader>New Password</v-subheader>
										</v-flex>
										<v-flex xs12>
											<v-text-field :append-icon="pwordPrependIcon ? 'visibility' : 'visibility_off'"
											@click:append="pwordPrependIcon = !pwordPrependIcon"
											:type="pwordPrependIcon ? 'password' : 'text'" v-model="password.new" required :rules="passwordRules"></v-text-field>
										</v-flex>
									</v-layout>
									
									<v-layout row>
										<v-flex xs4>
											<v-subheader>Confirm Password</v-subheader>
										</v-flex>
										<v-flex xs12>
											<v-text-field :append-icon="confirmPrependIcon ? 'visibility' : 'visibility_off'"
											@click:append="confirmPrependIcon = !confirmPrependIcon"
											:type="confirmPrependIcon ? 'password' : 'text'" v-model="password.confirm" required :rules="passwordRules"></v-text-field>
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
		
		<v-dialog v-model="loaderDialog" hide-overlay persistent width="300">
			<v-card color="primary" dark>
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
	const divisions = feathersClient.service('divisions');
	
	export default {
		data: () => ({
			valid: true,
			loading: false,
			loaderDialog: false,
			password: {
				new: null,
				confirm: null
			},
			passwordRules: [
			(v) => !!v || 'This field is required'
			],
			pwordPrependIcon: true,
			confirmPrependIcon: true
		}),
		methods: {
			save () {
				
				if (this.password.new !== this.password.confirm) {
					this.$snotify.error(`Passwords did not match`);
					return;
				}
				
				if (!this.$refs.form.validate()) {
					return;
				}
				
				this.loaderDialog = true;
				this.$store.dispatch('account/UPDATE_INFORMATION', {
					field: 'password',
					data: this.password.new
				})
				.then((res) => {
					this.loaderDialog = false;
					this.$snotify.success('Password has been successfully updated');
				})
				.catch((error) => {
					console.log(error);
					this.loaderDialog = false;
					this.$snotify.error('An error occurred');
				})
			}
		}
	}
</script>

<style scoped>
</style>