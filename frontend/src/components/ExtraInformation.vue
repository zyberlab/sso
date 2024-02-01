<template>
	<v-card :flat="flat">
		<v-card-title v-if="title">
			<div class="headline">{{title}}</div>
			<v-spacer></v-spacer>
		</v-card-title>
		<v-divider v-if="title"></v-divider>
		<v-card-text>
			<v-container fluid>
				<v-form v-model="valid" ref="form">
					<v-layout row>
						<v-flex xs4>
							<v-subheader>Division</v-subheader>
						</v-flex>
						<v-flex xs12>
							<v-select required :rules="rules" :items="divisions" label="Select" item-text="text" item-value="value" return-object v-model="data.division"></v-select>
						</v-flex>
					</v-layout>
					
					<v-layout row>
						<v-flex xs4>
							<v-subheader>Section</v-subheader>
						</v-flex>
						<v-flex xs12>
							<v-select required :rules="rules" :items="sections" label="Select" item-text="text" item-value="value" return-object v-model="data.section"></v-select>
						</v-flex>
					</v-layout>
					
					<v-layout row v-if="idNumberField">
						<v-flex xs4>
							<v-subheader>ID Number</v-subheader>
						</v-flex>
						<v-flex xs12>
							<v-text-field required :rules="rules" v-model="data.emp_id"></v-text-field>
						</v-flex>
					</v-layout>
					
					<v-layout row>
						<v-flex xs4>
							<v-subheader>Position</v-subheader>
						</v-flex>
						<v-flex xs12>
							<v-text-field required :rules="rules" v-model="data.position"></v-text-field>
						</v-flex>
					</v-layout>
				</v-form>
			</v-container>
		</v-card-text>
	</v-card>
</template>

<script>
	export default {
		props: {
			data: Object,
			title: String,
			flat: Boolean,
			idNumberField: Boolean
		},
		created () {
			this.fetchDivisions();
		},
		data: () => ({
			divisions: [],
			sections: [],
			valid: true,
			rules: [v => !!v || 'This field is required']
		}),
		methods: {
			async fetchDivisions () {
				const divisions = await this.$store.dispatch('division/GET_DIVISIONS');
				this.divisions = divisions.map((d) => {
					return {
						text: d.name,
						sections: d.sections.map((s) => ({
							text: s.name,
							value: s.name
						})),
						value: d.name
					}
				});
				
				if (this.data.section) {
					this.sections = this.divisions.filter((division) => {
						return division.sections.findIndex(section => section.text === this.data.section.text) !== -1;
					}).map(division => division.sections)[0];
				}
				
			},
			validateFields() {
				console.log('res', this.$refs.form.validate())
				this.$emit('extraInfoValid', this.$refs.form.validate());
			},
			resetValidation() {
				this.$refs.form.resetValidation();
			}
		},
		watch: {
			'data.division' (val) {
				const i = this.divisions.findIndex(data => data.text === val.text);
				if (i !== -1) {
					this.sections = this.divisions[i].sections;
				}
			}
		}
	}
</script>