<template>
	<div>
		<v-container fluid>
			<v-layout row>
				<v-flex xs12 sm12 md12 lg12 xl9>
					<v-card>
						<PersonalInformation @personalInfoValid="val => val ? save() : null" ref="personalInfo" :data="personal_information" :flat="true" title="Personal Information" />
						<v-card-actions>
							<v-spacer></v-spacer>
							<v-btn color="primary" @click="$refs.personalInfo.validateFields()">Save</v-btn>
						</v-card-actions>
					</v-card>
				</v-flex>
			</v-layout>
		</v-container>

		<LoaderDialog :loaderDialog="loaderDialog"/>
		<vue-snotify></vue-snotify>
	</div>
</template>



<script>
import PersonalInformation from '@/components/PersonalInformation';
import LoaderDialog from '@/components/LoaderDialog';
import {feathersClient} from '@/services';
import { mapGetters } from 'vuex';

export default {
	data: () => ({
		loading: false,
		personal_information: {},
		loaderDialog: false
	}),
	created () {
		this.personal_information = Object.assign({}, this.employee_data.personal_information);
	},
	methods: {
		save () {
			this.loaderDialog = true;
			this.$store.dispatch('account/UPDATE_INFORMATION', {
				field: 'personal_information',
				data: this.personal_information
			})
			.then((res) => {
				this.loaderDialog = false;
				this.$snotify.success('Personal information updated');
			})
			.catch((error) => {
				console.log(error);
				this.loaderDialog = false;
				this.$snotify.error('An error occurred');
			})
		}
	},
	computed: {
		...mapGetters({
			employee_data: 'account/GET_EMPLOYEE_DATA'
		})
	},
	components: {
		PersonalInformation,
		LoaderDialog
	}
}
</script>

<style scoped>
</style>