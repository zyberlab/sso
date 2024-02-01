<template>
	<v-card :flat="flat">
		<v-card-title v-if="title">
			<div class="headline">{{ title }}</div>
			<v-spacer></v-spacer>
		</v-card-title>
		<v-divider v-if="title"></v-divider>
		<v-card-text>
			<v-container fluid>
				<v-form ref="form" v-model="valid">
					<v-layout row>
						<v-flex xs4>
							<v-subheader>First name</v-subheader>
						</v-flex>
						<v-flex xs12>
							<v-text-field required :rules="rules" v-model="data.first_name"></v-text-field>
						</v-flex>
					</v-layout>

					<v-layout row>
						<v-flex xs4>
							<v-subheader>Middle name</v-subheader>
						</v-flex>
						<v-flex xs12>
							<v-text-field required :rules="rules" v-model="data.middle_name"></v-text-field>
						</v-flex>
					</v-layout>

					<v-layout row>
						<v-flex xs4>
							<v-subheader>Last name</v-subheader>
						</v-flex>
						<v-flex xs12>
							<v-text-field required :rules="rules" v-model="data.surname"></v-text-field>
						</v-flex>
					</v-layout>

					<v-layout row>
						<v-flex xs4>
							<v-subheader>Extension</v-subheader>
						</v-flex>
						<v-flex xs12>
							<v-text-field v-model="data.name_extension"></v-text-field>
						</v-flex>
					</v-layout>

					<v-layout row>
						<v-flex xs4>
							<v-subheader>Email address</v-subheader>
						</v-flex>
						<v-flex xs12>
							<v-text-field required :rules="emailRules" v-model="data.email"></v-text-field>
						</v-flex>
					</v-layout>

					<v-layout row>
						<v-flex xs4>
							<v-subheader>Birthday</v-subheader>
						</v-flex>
						<v-flex xs12>
							<v-text-field
								v-mask="'####-##-##'"
								v-model="data.birthday"
								required
								:rules="rules"
							></v-text-field>
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
	},
	data: () => ({
		valid: true,
		rules: [v => !!v || 'This field is required'],
		emailRules: [
			v => !!v || 'This field is required',
			v => /.+@.+/.test(v) || 'E-mail must be valid'
		]
	}),
	methods: {
		validateFields() {
			this.$emit('personalInfoValid', this.$refs.form.validate());
		},
		resetValidation() {
			this.$refs.form.resetValidation();
		}
	}
};
</script>
