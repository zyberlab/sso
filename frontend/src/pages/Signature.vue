<template>
	<div>
		<v-container fluid>
			<v-layout row>
				<v-flex xs12 sm12 md12 lg12 xl9>
					<v-card>
						<v-card-title class="info">
							<div class="headline white--text">Signature</div>
							<v-spacer></v-spacer>
						</v-card-title>
						<v-card-text>
							<v-avatar v-if="account.extra_information.signature" size="200" tile>
								<v-img :src="account.extra_information.signature">
									<v-layout slot="placeholder" fill-height align-center justify-center ma-0>
										<v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
									</v-layout>
								</v-img>
							</v-avatar>
							<div class="my-3"></div>
							<input type="file" ref="file" />
						</v-card-text>
						<v-card-actions>
							<v-spacer></v-spacer>
							<v-btn color="primary" @click="save">Upload</v-btn>
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
	import LoaderDialog from '@/components/LoaderDialog';
	import { feathersClient } from '@/services';
	import { mapGetters } from 'vuex';
	import { getDataURI, getImageProperties, generateThumbnailReso, resizeImage } from '@/services/helpers.js';
	
	export default {
		data: () => ({
			loading: false,
			loaderDialog: false
		}),
		created () {
		},
		methods: {
			async save () {
				const files = this.$refs.file.files;
				
				if (!files.length) {
					this.$snotify.error('No file chosen');
					return;
				}
				
				this.loaderDialog = true;
				
				try {
					const dataURI = await getDataURI(files[0]);
					const image = await getImageProperties(dataURI);
					const { width, height } = generateThumbnailReso(image.width, image.height);
					const src = await resizeImage(dataURI, width, height);
					const extra_information = JSON.parse(JSON.stringify(this.account.extra_information));
					extra_information.signature = src;

					await this.$store.dispatch('account/UPDATE_INFORMATION', {
						field: 'extra_information',
						data: extra_information
					});

					this.$snotify.success('E-Signature has been successfully uploaded');
				} catch (error) {
					console.log(error);
				}
				
				this.loaderDialog = false;
			}
		},
		computed: {
			account () {
				return this.$store.getters['account/GET_EMPLOYEE_DATA'];
			}
		},
		components: {
			LoaderDialog
		}
	}
</script>

<style scoped>
</style>