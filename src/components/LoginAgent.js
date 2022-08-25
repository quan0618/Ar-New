/* ar-brown App (C) 2021 arbrown.co.jp All rights reserved.
 *******************************************************************************
 * Program ID:  LoginAgent.js
 * $Revision:   Ver1.0
 * $Modtime:    $
 *******************************************************************************
 * Author      (作成／更新年月日、担当者)
 *  2021/08/01 Rayoo)li : 新規作成
 *
 * Summary LoginAgent
 *
 * Instructions / Preconditions
 *  なし
 *
 *******************************************************************************
 */
import React,{ Table} from 'react-bootstrap'
import Grid from '@material-ui/core/Grid';
const LoginAgent = ({
  //loginG,
  AgencyID,
  Agency_Name,
  CompanyName,
  SubID,
  // AgencyPG,
  // Mail
}) => {
  return (
      <Grid className='starter-template text-left'>
        <h4>{Agency_Name}</h4>
        <Table className='lead' striped bordered hover size="lg" variant="">
          <tr><td>代理店コード  </td><td>{AgencyID}</td></tr>
          <tr><td>営業所コード  </td><td>{SubID}</td></tr>
          {/* <tr><td>価格グループ  </td><td>{AgencyPG}</td></tr> */}
          <tr><td>営業所名 </td><td>{CompanyName}</td></tr>
          {/* <tr><td>ユーザグループ  </td><td>{loginG}</td></tr> */}
        </Table >
      </Grid>
  )
}
export default LoginAgent
