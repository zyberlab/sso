<template>
	<div>
		<v-container fluid>
			<v-layout row>
				<v-flex xs12 sm12 md12 lg12 xl9>
					<v-card>
						<ExtraInformation @extraInfoValid="test" ref="extraInfo" :data="extra_information" :flat="true" :idNumberField="false" title="Extra Information" />
						<v-card-actions>
							<v-spacer></v-spacer>
							<v-btn color="primary" @click="save()">Save</v-btn>
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
	import ExtraInformation from '@/components/ExtraInformation';
	import LoaderDialog from '@/components/LoaderDialog';
	import { mapGetters } from 'vuex';
	
	export default {
		data: () => ({
			loading: false,
			extra_information: {},
			loaderDialog: false,
			divisions: [],
			sections: []
		}),
		created () {
			this.extra_information = Object.assign({}, this.employee_data.extra_information);
			console.log(this.extra_information)
		},
		methods: {
			test(val) {
				console.log(val)
			},
			save () {
				const extra_information = JSON.parse(JSON.stringify(this.extra_information));
				delete extra_information.division.sections;
				this.loaderDialog = true;
				this.$store.dispatch('account/UPDATE_INFORMATION', {
					field: 'extra_information',
					data: extra_information
				})
				.then((res) => {
					console.log(res)
					this.loaderDialog = false;
					this.$snotify.success('Personal information updated');
				})
				.catch((error) => {
					console.log(error);
					this.loaderDialog = false;
					this.$snotify.error('An error occurred');
				});
			}
		},
		computed: {
			...mapGetters({
				employee_data: 'account/GET_EMPLOYEE_DATA'
			})
		},
		components: {
			ExtraInformation,
			LoaderDialog
		}
	}
</script>

<style scoped>
</style>