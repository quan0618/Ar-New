/* ar-brown App (C) 2021 arbrown.co.jp All rights reserved.
 *******************************************************************************
 * Program ID:  Layout.js
 * $Revision:   Ver1.0
 * $Modtime:    $
 *******************************************************************************
 * Author      (作成／更新年月日、担当者)
 *  2021/08/01 Rayoo)li : 新規作成
 *
 * Summary Layout画面
 *
 * Instructions / Preconditions
 *  なし
 *
 *******************************************************************************
 */
import React, { BrowserRouter as Router} from 'react-router-dom'

// components
import Menu from '../components/Menu'
import FooterLogIn from '../components/FooterLogIn'

const Layout = ({ children }) => {
  return (
    <Router>
      <Menu />
      <main>{children}</main>
      <FooterLogIn />
    </Router>
  )
}

export default Layout