/* ar-brown App (C) 2021 arbrown.co.jp All rights reserved.
 *******************************************************************************
 * Program ID:  Contact.js
 * $Revision:   Ver1.0
 * $Modtime:    $
 *******************************************************************************
 * Author      (作成／更新年月日、担当者)
 *  2021/08/01 Rayoo)li : 新規作成
 *
 * Summary Contact画面
 *
 * Instructions / Preconditions
 *  なし
 *
 *******************************************************************************
 */
import Meta from '../components/Meta'
/*コンテナ（画面レイアウト）デザイン*/
import { Container, Row, Col, InputGroup, FormControl } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import Amplify, { API } from 'aws-amplify'
import awsconfig from '../aws-exports'
import React, { useEffect, useState } from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
Amplify.configure(awsconfig)

function Contact() {
	// page content
	const pageTitle = 'お問い合わせ｜ARB-SIP（在庫・価格照会システム）'
	const postInquiry = async body => {
		const APIName = 'amplifyFormAPI'
		const path = '/inquiry'
		const params = {
			body: body,
		}
		return await API.post(APIName, path, params)
	}
	function simulateNetworkRequest() {
		return new Promise((resolve) => setTimeout(resolve, 2000));
	}

	const [isLoading, setLoading] = useState(false);

	useEffect(() => {
		if (isLoading) {
			simulateNetworkRequest().then(() => {
				setLoading(false);
			});
		}
	}, [isLoading]);


	const [msgId, setMsgId] = React.useState(Object);
	const handleSetMsgId = (Object) => {
		setMsgId(Object);
	};
	const [msgText, setMsgText] = React.useState(Object);
	const handleSetMsgText = (Object) => {
		setMsgText(Object);
	};
	const [msgBtn, setMsgBtn] = React.useState(Object);
	const handleSetMsgBtn = (Object) => {
		setMsgBtn(Object);
	};
	async function arSendClick() {
		let companyname = document.getElementById('companyname').value;
		let name = document.getElementById('name').value;
		let email = document.getElementById('email').value;
		let product = document.getElementById('product').value;
		let text = document.getElementById('text').value;

		if (name === '' || email === '' || product === '' || text === '' || companyname === '') {
			handleSetMsgId("エラー");
			handleSetMsgText("全項目を入力してください");
			handleSetMsgBtn("OK");
			handleClickOpen();
			return
		}
		setLoading(true);
		try {
			await postInquiry({ companyname:companyname , name: name, email: email, product: product, text: text })
			//window.alert('お問い合わせの送信が完了しました。')
			handleSetMsgId("送信確認");
			handleSetMsgText("お問い合わせの送信が完了しました。");
			handleSetMsgBtn("OK");
			handleClickOpen();

		} catch (e) {
			//	window.alert(e);
			handleSetMsgId("送信エラー");
			handleSetMsgText("お問い合わせの送信に失敗しました。");
			handleSetMsgBtn("OK");
		}

	}

	function arSetClick() {
		let companyname = document.getElementById('companyname');
		let name = document.getElementById('name');
		let email = document.getElementById('email');
		let product = document.getElementById('product');
		let text = document.getElementById('text');
		companyname.value = '';
		name.value = '';
		email.value = '';
		product.value = '';
		text.value = '';
	}
	const [open, setOpen] = React.useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<Container style={{ backgroundColor: '', 'minWidth': '85vw', 'minHeight': '74vh' }}>
			<div>
				<Meta title={pageTitle} />
			</div>
			<br></br>
			<Row>
				<Col>
				<InputGroup className="mb-3">
						<span style={{ width: '200px', 'textAlign': 'left' }}>
							<InputGroup.Text id="basic-Username">会社名<span style={{ color: 'red' }}>［必須］</span></InputGroup.Text>
						</span>
						<FormControl
							placeholder="○○会社"
							aria-label="companyname"
							aria-describedby="basic-Username"
							id="companyname"
							maxLength="30"
						/>
					</InputGroup>
					<InputGroup className="mb-3">
						<span style={{ width: '200px', 'textAlign': 'left' }}>
							<InputGroup.Text id="basic-Username">氏名<span style={{ color: 'red' }}>［必須］</span></InputGroup.Text>
						</span>
						<FormControl
							placeholder="○○さん"
							aria-label="Username"
							aria-describedby="basic-Username"
							id="name"
							maxLength="30"
						/>
					</InputGroup>

					<InputGroup className="mb-3">
						<span style={{ width: '200px', 'textAlign': 'left' }}>
							<InputGroup.Text id="basic-email">メールアドレス<span style={{ color: 'red' }}>［必須］</span></InputGroup.Text>
						</span>
						<FormControl
							placeholder="○○@○○.com"
							aria-label="email"
							aria-describedby="basic-email"
							id="email"
							type="email"
							maxLength="40"
						/>
					</InputGroup>

					<InputGroup className="mb-3">
						<span style={{ width: '200px', 'textAlign': 'left' }}>
							<InputGroup.Text id="basic-product">型番<span style={{ color: 'red' }}>［必須］</span></InputGroup.Text></span>
						<FormControl
							placeholder="型番"
							aria-label="product"
							aria-describedby="basic-product"
							id="product"
							maxLength="80"
						/>
					</InputGroup>
					<InputGroup>
						<InputGroup.Text id="basic-text">内容<span style={{ width: '140px', 'textAlign': 'left', color: 'red' }}>［必須］</span></InputGroup.Text>
						<FormControl placeholder="お問い合わせ内容詳細" as="textarea" rows="6" aria-label="With textarea" id="text" maxLength="1000" >
						</FormControl>
					</InputGroup>
					<br></br>
					<Row>
						<Button variant="success" size="lg" data-toggle='modal' disabled={isLoading} onClick={!isLoading ? arSendClick : null}>{isLoading ? '送信中....' : 'お問合わせ'}</Button>
						<Button variant="secondary" size="lg" data-toggle='modal' onClick={arSetClick}>リセット</Button>
					</Row>
				</Col>

			</Row>
			<Dialog
				open={open}
				onClose={handleClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">{msgId}</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						{msgText}
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="primary" autoFocus>
						{msgBtn}
					</Button>
				</DialogActions>
			</Dialog>
		</Container>
	)
}

export default Contact