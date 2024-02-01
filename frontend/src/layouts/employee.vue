<template>
	<v-app :dark="isDark">
		<v-navigation-drawer fixed :clipped="$vuetify.breakpoint.mdAndUp" app v-model="drawer">
			<v-list dense>
				<template v-for="(item, i) in items">
					<v-layout row v-if="item.heading" align-center :key="item.heading">
						<v-flex xs6>
							<v-subheader v-if="item.heading">{{ item.heading }}</v-subheader>
						</v-flex>
						<v-flex xs6 class="text-xs-center">
							<a href="#!" class="body-2 black--text">EDIT</a>
						</v-flex>
					</v-layout>
					<v-divider v-else-if="item.divider" :key="i" dark class="my-3"></v-divider>
					<v-list-group
						v-else-if="item.children"
						v-model="item.model"
						:key="item.text"
						:prepend-icon="item.model ? item.icon : item['icon-alt']"
						append-icon
					>
						<v-list-tile slot="activator">
							<v-list-tile-content>
								<v-list-tile-title>{{ item.text }}</v-list-tile-title>
							</v-list-tile-content>
						</v-list-tile>
						<v-list-tile v-for="(child, i) in item.children" :key="i">
							<v-list-tile-action v-if="child.icon">
								<v-icon>{{ child.icon }}</v-icon>
							</v-list-tile-action>
							<v-list-tile-content>
								<v-list-tile-title>{{ child.text }}</v-list-tile-title>
							</v-list-tile-content>
						</v-list-tile>
					</v-list-group>
					<v-list-tile v-else :to="{name: item.url}" ripple :key="item.text">
						<v-list-tile-action>
							<v-icon>{{ item.icon }}</v-icon>
						</v-list-tile-action>
						<v-list-tile-content>
							<v-list-tile-title>{{ item.text }}</v-list-tile-title>
						</v-list-tile-content>
					</v-list-tile>
				</template>
			</v-list>
		</v-navigation-drawer>
		<v-toolbar app :clipped-left="$vuetify.breakpoint.mdAndUp" fixed>
			<v-toolbar-title style="width: 300px" class="ml-0 pl-3">
				<v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
				<span class="hidden-sm-and-down">SSO Management</span>
			</v-toolbar-title>
			<!-- <v-text-field flat solo-inverted prepend-icon="search" label="Search" class="hidden-sm-and-down"></v-text-field> -->
			<v-spacer></v-spacer>
			<v-btn icon @click="isDark = !isDark" title="Switch theme">
				<v-icon>{{ isDark ? 'nights_stay' : 'wb_sunny' }}</v-icon>
			</v-btn>
			<v-btn icon @click="logout" title="Log out">
				<v-icon>exit_to_app</v-icon>
			</v-btn>
		</v-toolbar>
		<v-content>
			<router-view />
		</v-content>
	</v-app>
</template>


<script>
import { feathersClient } from '@/services';
import { mapGetters } from 'vuex';

const SSO_THEME = 'SSO_THEME';

function getCurrentTheme () {
	const theme = localStorage.getItem(SSO_THEME);
	if (theme !== undefined) {
		return theme;
	}

	return 'light';
}

export default {
	name: 'employee',
	data: () => ({
		dialog: false,
		drawer: null,
		items: [
			{
				icon: 'account_circle',
				text: 'Profile',
				url: 'Profile',
			},
			{
				icon: 'assignment',
				text: 'Extra Information',
				url: 'ExtraInformation',
			},
			{
				icon: 'lock',
				text: 'Update Password',
				url: 'UpdatePassword',
			},
			// {
			// 	icon: 'gesture',
			// 	text: 'Signature',
			// 	url: 'Signature',
			// },
		],
		isDark: getCurrentTheme() === 'dark'
	}),
	computed: {
		...mapGetters({
			employee_data: 'account/GET_EMPLOYEE_DATA',
		}),
	},
	created() {
		if (this.employee_data.roles) {
			if (
				this.employee_data.roles.sso &&
				this.employee_data.roles.sso.includes('admin')
			) {
				this.items.unshift({ divider: true });

				this.items.unshift({
					icon: 'person_add',
					text: 'New Employee',
					url: 'NewEmployee',
				});

				this.items.unshift({
					icon: 'people',
					text: 'Employees',
					url: 'Employees',
				});
			}
		}
	},
	methods: {
		logout() {
			feathersClient.logout().then(() => {
				this.$store.commit('account/SET_AUTHENTICATED', false);
				this.$store.commit('account/SET_EMPLOYEE_DATA', {});
				this.$router.push({ name: 'Login' });
			});
		},
	},
	props: {
		source: String,
	},
	watch: {
		isDark(val) {
			localStorage.setItem(SSO_THEME, val ? 'dark' : 'light');
		}
	}
};
</script>

