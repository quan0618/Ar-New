/* ar-brown App (C) 2021 arbrown.co.jp All rights reserved.
 *******************************************************************************
 * Program ID:  Header.js
 * $Revision:   Ver1.0
 * $Modtime:    $
 *******************************************************************************
 * Author      (作成／更新年月日、担当者)
 *  2021/08/01 Rayoo)li : 新規作成
 *
 * Summary Header
 *
 * Instructions / Preconditions
 *  なし
 *
 *******************************************************************************
 */
import React, { Container } from 'react-bootstrap'

const Header = ({ head, description }) => {
  return (
    <Container style={{ 'height': '100%', 'minWidth': '85vw', position: 'relative'}}>
      <div className='starter-template text-center mt-5'>
        <h1>{head} Page</h1>
        <p className='lead text-capitalize'>{description}</p>
      </div>
    </Container>
  )
}

export default Header