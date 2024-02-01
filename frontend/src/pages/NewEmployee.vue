<template>
	<div>
		<v-container fluid>
			<v-layout row>
				<v-flex xs12 sm12 md12 lg12 xl9>
					<v-stepper v-model="step">
						
						<v-stepper-header>
							<v-stepper-step :complete="step > 1" step="1">Personal Information</v-stepper-step>
							<v-divider></v-divider>
							<v-stepper-step :complete="step > 2" step="2">Extra Information</v-stepper-step>
						</v-stepper-header>
						
						<v-stepper-items>
							<v-stepper-content step="1">
								<v-card>
									<PersonalInformation @personalInfoValid="val => step = val ? 2 : 1" ref="personalInfo" :data="personal_information" :flat="true" />
									<v-card-actions>
										<v-spacer></v-spacer>
										<v-btn color="primary" @click="$refs.personalInfo.validateFields()">Next</v-btn>
									</v-card-actions>
								</v-card>
							</v-stepper-content>
							
							<v-stepper-content step="2">
								<v-card>
									<ExtraInformation @extraInfoValid="val => val ? save() : null" ref="extraInfo" :data="extra_information" :flat="true" :idNumberField="true"/>
									<v-card-actions>
										<v-spacer></v-spacer>
										<v-btn color="primary" @click="step = 1">Back</v-btn>
										<v-btn color="primary" @click="$refs.extraInfo.validateFields()">Save</v-btn>
									</v-card-actions>
								</v-card>
							</v-stepper-content>
						</v-stepper-items>
						
					</v-stepper>
				</v-flex>
			</v-layout>
		</v-container>
		
		<LoaderDialog :loaderDialog="loaderDialog"/>
		<vue-snotify></vue-snotify>
	</div>
</template>

<script>
	import PersonalInformation from '@/components/PersonalInformation';
	import ExtraInformation from '@/components/ExtraInformation';
	import LoaderDialog from '@/components/LoaderDialog';
	export default {
		data: () => ({
			step: 1,
			personal_information: {},
			extra_information: {},
			loaderDialog: false
		}),
		components: {
			PersonalInformation,
			ExtraInformation,
			LoaderDialog
		},
		methods: {
			async save () {
				this.loaderDialog = true;
				try {
					
					const extra_information = JSON.parse(JSON.stringify(this.extra_information));
					delete extra_information.division.sections;

					try {
						const res = await this.$store.dispatch('account/CHECK_ID_NUMBER', extra_information.emp_id);
						console.log('Search result', res);
						if (res.exists) {
							this.$snotify.error('ID Number already exists!');
							this.loaderDialog = false;
							return;
						}
					} catch (error) {
						console.log(error);
						this.$snotify.error('An error occurred');
						this.loaderDialog = false;
						return;
					}

					const employee = {
						email: `${extra_information.emp_id}@mail.com`,
						password: extra_information.emp_id,
						emp_id: extra_information.emp_id,
						personal_information: this.personal_information,
						extra_information: extra_information
					}
					await this.$store.dispatch('account/SAVE_EMPLOYEE', employee);
					this.personal_information = {};
					this.extra_information = {};
					this.$refs.personalInfo.resetValidation();
					this.$refs.extraInfo.resetValidation();
					this.step = 1;

					this.$snotify.success('New user has been successfully added!');
				} catch (error) {
					console.log(error);
					this.$snotify.error('An error occurred');
				}
				this.loaderDialog = false;
			}
		}
	}
</script>