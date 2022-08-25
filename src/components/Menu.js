/* ar-brown App (C) 2021 arbrown.co.jp All rights reserved.
 *******************************************************************************
 * Program ID:  Menu.js
 * $Revision:   Ver1.0
 * $Modtime:    $
 *******************************************************************************
 * Author      (作成／更新年月日、担当者)
 *  2021/08/01 Rayoo)li : 新規作成
 *
 * Summary Menu
 *
 * Instructions / Preconditions
 *  なし
 *
 *******************************************************************************
 */
import { Nav, Container, Row, Col } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import logo_icon from './logo_icon.gif'
import logo_bg from './bg.jpg'
import { ChatSquareText } from 'react-bootstrap-icons';
import { HouseDoor } from 'react-bootstrap-icons';
import { Table } from 'react-bootstrap-icons';
//import { Table } from 'react-bootstrap-icons';
import { FilePerson } from 'react-bootstrap-icons';
import { Envelope } from 'react-bootstrap-icons';
import { DoorClosed } from 'react-bootstrap-icons';
import moment from 'moment';
import React, { useEffect, useReducer } from 'react';
import API, { graphqlOperation } from '@aws-amplify/api';
import { agencyGroupSortLastupdate, customerByeMail } from '../graphql/queries';
/*  AWS標準設定 with Login Auth. */
import Amplify, { Auth } from 'aws-amplify';
import awsconfig from '../aws-exports';
import { makeStyles } from '@material-ui/core/styles';
Amplify.configure(awsconfig);

// Menu Auth Customize -- SingOut
const signOut = async () => {
	await Auth.signOut()
	try {
		await Auth.signOut();
	} catch (error) {
		console.log('error signing out: ', error);
	}
	document.location.reload();
}
const useStyles = makeStyles(() => ({
	img: {
		width: '100%',
		height: '50px'
	},
	logo: {
		// width: '140%',
		// height: '140%',
		width: '239px',
		height: '69px',
		border: 0
	},
	font: {
		'text-align': 'right!important',
		'vertical-align': 'middle!important',
		'fontSize': '120%',
		'margin-right': '0rem',
	}
}));
const QUERY = 'QUERY';
const initialInventoryState1 = { lastupdate: "" };
const initialUserEmail = { email: "" };
const reducer1 = (state, action) => {
	switch (action.type) {
		case QUERY:
			return { ...state, lastupdate: action.Invs };
		default:
			return state;
	}
};
const reducerUser = (state, action) => {
	switch (action.type) {
		case QUERY:
			return { ...state, email: action.Invs };
		default:
			return state;
	}
};

const Menu = () => {
	const classes = useStyles();
	const [inventories1, setInv1] = useReducer(reducer1, initialInventoryState1);
	const [user, setUser] = useReducer(reducerUser, initialUserEmail);
	useEffect(() => {
		async function listInvData() {
			// get the Login user infomation. Set to user
			// const { accessToken } = await Auth.currentSession();
			// const cognitogroups = accessToken.payload['cognito:groups'];
			// const userAuth = cognitogroups[0];
			// const agencyPriceGroup = await API.graphql(graphqlOperation(customerByeMail, { Agency_Email: userAuth }));
			const user = await Auth.currentUserInfo();
			const emailAgent = await API.graphql(graphqlOperation(customerByeMail, { Agency_Email: user.attributes.email }));
			setUser({ type: QUERY, Invs: user.attributes.email });
			const agentinfo = emailAgent.data.customerByeMail['items'];
			if (agentinfo.length > 0) {
				const agentGroupID = agentinfo[0].Agency_Price_Group;
				const InvData = await API.graphql(graphqlOperation(agencyGroupSortLastupdate, { Agency_Price_Group: agentGroupID, sortDirection: "DESC", limit: 1 }));
				let yymmdd = moment(InvData.data.AgencyGroupSortList.items[0].lastupdate).utcOffset(9).format('YYYY年MM月DD日 HH時mm分')
				setInv1({ type: QUERY, Invs: yymmdd });
			}
		}
		listInvData();

	}, []);

	return (
		<Container style={{ backgroundColor: '', 'minWidth': '85vw' }}>
			<Row>
				<Col>
					<LinkContainer to='/'>
						<Nav.Link className='d-flex col-md-3 mb-2 mb-md-0 text-dark text-decoration-none'>
							<div><img src={logo_icon} alt="" className={classes.logo} ></img></div>
						</Nav.Link>
					</LinkContainer>
				</Col>
				<LinkContainer to='/'>
					<Nav.Link className='nav-link px-2 link-secondary' title="在庫・価格照会" data-toggle="popover" >
						<HouseDoor alt="在庫照会" color="royalblue" size={46} />
					</Nav.Link>
				</LinkContainer>
				<LinkContainer to='/OrderList'>
					<Nav.Link className='nav-link px-2 link-secondary' title="発注一覧" data-toggle="popover" >
						<Table alt="発注一覧" color="royalblue" size={46} />
					</Nav.Link>
				</LinkContainer>
				<LinkContainer to='/Home'>
					<Nav.Link className='nav-link px-2 link-secondary sr-only-focusable' title="お知らせ・キャンペーン情報" data-toggle="popover" >
						<ChatSquareText alt="HOME" color="royalblue" size={46} />
					</Nav.Link>
				</LinkContainer>
				<LinkContainer to='/agent'>
					<Nav.Link className='nav-link px-2 link-secondary' title="代理店情報" data-toggle="popover">
						<FilePerson color="royalblue" size={46} />
					</Nav.Link>
				</LinkContainer>

				<LinkContainer to='/Contact'>
					<Nav.Link className='nav-link px-2 link-secondary' title="お問い合わせ" data-toggle="popover">
						<Envelope color="royalblue" size={46} />
					</Nav.Link>
				</LinkContainer>

				<LinkContainer to='/'>
					<Nav.Link className='nav-link px-2 link-secondary' title="終了" data-toggle="popover">
						<DoorClosed onClick={signOut} color="royalblue" size={46} />
					</Nav.Link>
				</LinkContainer>
			</Row>
			<Row>
				<Col>
					<div className={classes.font}> ログインユーザー：{user.email}
					</div>
				</Col>
			</Row>
			<Row>
				<Col>
					<div className={classes.font}> 在庫情報最後更新時間：{inventories1.lastupdate}
					</div>
				</Col>
			</Row>
			<Row>
				<img src={logo_bg} alt="" className={classes.img}></img>
			</Row>
		</Container >
	)
}
export default Menu;