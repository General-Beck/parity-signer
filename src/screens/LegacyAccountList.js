// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.

// Parity is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Parity is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Parity.  If not, see <http://www.gnu.org/licenses/>.

'use strict';

import PropTypes from 'prop-types';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Subscribe } from 'unstated';

import colors from '../colors';
import AccountCard from '../components/AccountCard';
import Background from '../components/Background';
import Button from '../components/Button';
// import PopupMenu from '../components/PopupMenu';
import fonts from '../fonts';
import AccountsStore from '../stores/AccountsStore';

export default class LegacyAccountList extends React.PureComponent {
	static navigationOptions = {
		title: 'Accounts'
	};

	render() {
		return (
			<Subscribe to={[AccountsStore]}>
				{accounts => {
					return (
						<AccountListView
							{...this.props}
							accounts={accounts.getLegacySubstrateAccounts()}
							onAccountSelected={key => {
								accounts.select(key);
								this.props.navigation.navigate('AccountDetails');
							}}
						/>
					);
				}}
			</Subscribe>
		);
	}
}

class AccountListView extends React.PureComponent {
	static propTypes = {
		accounts: PropTypes.array.isRequired,
		onAccountSelected: PropTypes.func.isRequired
	};

	constructor(props) {
		super(props);
	}

	showOnboardingMessage = () => {
		const { navigate } = this.props.navigation;
		const createLink = (text, navigation) => (
			<Text style={styles.link} onPress={() => navigate(navigation)}>
				{text}
			</Text>
		);

		return (
			<View style={styles.onboardingWrapper}>
				<Text style={styles.onboardingText}>
					No account yet?{'\n'}
					{createLink('Create', 'AccountNew')} or{' '}
					{createLink('recover', 'AccountRecover')} an account to get started.
				</Text>
			</View>
		);
	};

	render() {
		const { accounts, navigation, onAccountSelected } = this.props;
		const hasNoAccount = accounts.length < 1;
		const { navigate } = navigation;

		return (
			<View style={styles.body}>
				<Background />
				<View style={styles.header}>
					<Text style={styles.title}>ACCOUNTS</Text>
					<View style={styles.menuView}>
						<Icon
							onPress={() => navigate('Settings')}
							name="settings"
							size={35}
							color={colors.bg_text_sec}
						/>
					</View>
				</View>
				{hasNoAccount && this.showOnboardingMessage()}
				<FlatList
					ref={list => {
						this.list = list;
					}}
					style={styles.content}
					data={accounts}
					keyExtractor={([key]) => key}
					renderItem={({ item: [accountKey, account] }) => {
						return (
							<AccountCard
								address={account.address}
								networkKey={account.networkKey}
								onPress={() => {
									onAccountSelected(accountKey);
								}}
								style={{ paddingBottom: null }}
								title={account.name}
							/>
						);
					}}
					enableEmptySections
				/>
				{!hasNoAccount && (
					<View style={styles.bottom}>
						<Button title="Scan" onPress={() => navigate('QrScanner')} />
					</View>
				)}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	body: {
		backgroundColor: colors.bg,
		flex: 1,
		flexDirection: 'column'
	},
	bottom: {
		alignItems: 'center',
		display: 'flex',
		justifyContent: 'space-between',
		marginTop: 20
	},
	content: {
		flex: 1
	},
	header: {
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'center'
	},
	link: {
		textDecorationLine: 'underline'
	},
	menuView: {
		alignItems: 'stretch',
		display: 'flex',
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'flex-end'
	},
	onboardingText: {
		color: colors.bg_text_sec,
		fontFamily: fonts.regular,
		fontSize: 20
	},
	onboardingWrapper: {
		alignItems: 'flex-end',
		flex: 1,
		flexDirection: 'row'
	},
	title: {
		color: colors.bg_text_sec,
		flexDirection: 'column',
		fontFamily: fonts.bold,
		fontSize: 18,
		justifyContent: 'center',
		marginTop: 16,
		paddingLeft: 72
	}
});
