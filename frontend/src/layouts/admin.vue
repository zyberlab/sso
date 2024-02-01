<template>
	<v-app>
		<v-navigation-drawer
			fixed
			:clipped="$vuetify.breakpoint.mdAndUp"
			app
			v-model="drawer"
		>
			<v-list dense>
				<template v-for="item in items">
					<v-layout row v-if="item.heading" align-center :key="item.heading">
						<v-flex xs6>
							<v-subheader v-if="item.heading">
								{{ item.heading }}
							</v-subheader>
						</v-flex>
						<v-flex xs6 class="text-xs-center">
							<a href="#!" class="body-2 black--text">EDIT</a>
						</v-flex>
					</v-layout>
					<v-list-group
						v-else-if="item.children"
						v-model="item.model"
						:key="item.text"
						:prepend-icon="item.model ? item.icon : item['icon-alt']"
						append-icon=""
					>
						<v-list-tile slot="activator">
							<v-list-tile-content>
								<v-list-tile-title>
									{{ item.text }}
								</v-list-tile-title>
							</v-list-tile-content>
						</v-list-tile>
						<v-list-tile v-for="(child, i) in item.children" :key="i">
							<v-list-tile-action v-if="child.icon">
								<v-icon>{{ child.icon }}</v-icon>
							</v-list-tile-action>
							<v-list-tile-content>
								<v-list-tile-title>
									{{ child.text }}
								</v-list-tile-title>
							</v-list-tile-content>
						</v-list-tile>
					</v-list-group>
					<v-list-tile v-else :to="{ name: item.url }" ripple :key="item.text">
						<v-list-tile-action>
							<v-icon>{{ item.icon }}</v-icon>
						</v-list-tile-action>
						<v-list-tile-content>
							<v-list-tile-title>
								{{ item.text }}
							</v-list-tile-title>
						</v-list-tile-content>
					</v-list-tile>
				</template>
			</v-list>
		</v-navigation-drawer>

		<v-toolbar
			color="blue darken-3"
			dark
			app
			:clipped-left="$vuetify.breakpoint.mdAndUp"
			fixed
		>
			<v-toolbar-title style="width: 300px" class="ml-0 pl-3">
				<v-toolbar-side-icon
					@click.stop="drawer = !drawer"
				></v-toolbar-side-icon>
				<span class="hidden-sm-and-down">SSO Management</span>
			</v-toolbar-title>
			<v-text-field
				flat
				solo-inverted
				prepend-icon="search"
				label="Search"
				class="hidden-sm-and-down"
			></v-text-field>
			<v-spacer></v-spacer>
			<v-btn icon @click="changeEmployeesView">
				<v-icon v-if="employeesListView === 'list'">apps</v-icon>
				<v-icon v-else-if="employeesListView === 'grid'">list</v-icon>
			</v-btn>
		</v-toolbar>

		<v-content>
			<v-container fluid>
				<router-view />
			</v-container>
		</v-content>
	</v-app>
</template>

<script>
export default {
	name: 'admin',
	data: () => ({
		dialog: false,
		drawer: null,
		items: [
			{
				icon: 'supervisor_account',
				text: 'Employees',
				url: 'Employees',
			},
		],
	}),
	computed: {
		employeesListView() {
			return this.$store.getters['user/GET_EMPLOYEES_LIST_VIEW'];
		},
	},
	methods: {
		changeEmployeesView() {
			const view = this.employeesListView === 'grid' ? 'list' : 'grid';
			this.$store.commit('user/SET_EMPLOYEES_LIST_VIEW', view);
		},
	},
	props: {
		source: String,
	},
};
</script>
