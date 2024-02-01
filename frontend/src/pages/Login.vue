<template>
	<div class="form-container">
		<v-container fluid fill-height>
			<v-layout align-center justify-center>
				<v-flex xs12 sm8 md5>
					<v-form v-model="valid" ref="form" lazy-validation>
						<v-card class="px-5 py-4" height="500" tile>
							<v-card-title>
								<div class=" grey--text text--darken-4">
									<div class="headline">Sign in</div>
									<p>Single Sign-On Management System</p>
									<p class="red--text text--darken-1" v-show="authError">
										ID number or password is incorrect.
									</p>
								</div>
							</v-card-title>
							<v-card-text>
								<v-text-field
									@keyup.enter="submit"
									label="ID Number"
									type="text"
									v-model="idNumber"
									:rules="idNumberRules"
									@keyup.native.enter="submit"
									required
								></v-text-field>
								<v-text-field
									label="Password"
									:append-icon="icon ? 'visibility' : 'visibility_off'"
									@click:append="icon = !icon"
									:type="icon ? 'password' : 'text'"
									v-model="password"
									required
									:rules="passwordRules"
									@keyup.native.enter="submit"
								></v-text-field>
							</v-card-text>
							<v-card-actions>
								<v-spacer></v-spacer>
								<v-btn
									class="blue darken-1 white--text"
									:loading="loading"
									:disabled="loading"
									@click="submit"
									>Login</v-btn
								>
							</v-card-actions>
						</v-card>
					</v-form>
				</v-flex>
			</v-layout>
		</v-container>

		<vue-snotify></vue-snotify>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				valid: true,
				idNumber: null,
				password: null,
				idNumberRules: [v => !!v || 'Enter your ID number'],
				passwordRules: [v => !!v || 'Enter your password'],
				color: '#1565C0',
				authError: false,
				icon: true,
				loading: false
			};
		},
		methods: {
			async submit() {
				this.loading = true;
				try {
					const data = await this.$store.dispatch('account/LOGIN', {
						idNumber: this.idNumber,
						password: this.password
					});

					const { referer } = this.$route.query;
					if (referer) {
						location.replace(referer);
						return;
					}

					if (
						data.roles &&
						data.roles.sso &&
						data.roles.sso.includes('admin')
					) {
						this.$router.push({ name: 'Employees' });
					} else {
						this.$router.push({ name: 'Profile' });
					}
				} catch (error) {
					this.$snotify.error('Invalid credentials');
					console.error('ERROR!', error);
				}
				this.loading = false;
			}
		}
	};
</script>

<style scoped>
	.form-container {
		margin-top: 10%;
	}
</style>
