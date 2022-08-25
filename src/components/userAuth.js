/* ar-brown App (C) 2021 arbrown.co.jp All rights reserved.
 *******************************************************************************
 * Program ID:  userAuth.js
 * $Revision:   Ver1.0
 * $Modtime:    $
 *******************************************************************************
 * Author      (作成／更新年月日、担当者)
 *  2021/08/01 Rayoo)li : 新規作成
 *
 * Summary userAuthユーザー権限チェック
 *
 * Instructions / Preconditions
 *  なし
 *
 *******************************************************************************
 */
import Amplify, { Auth } from 'aws-amplify';

/*  AWS標準設定 with Login Auth. */
import awsconfig from '../aws-exports';
Amplify.configure(awsconfig);

async function userAuth() {
	const { accessToken } = await Auth.currentSession();
	const cognitogroups = accessToken.payload['cognito:groups'];
	let userAuth = '1';
	cognitogroups ? (
        userAuth = cognitogroups[0] === 'admin' ? '0' : '1'
      ) : (
        userAuth = '1'
      )
	return userAuth;
}
export default userAuth;


