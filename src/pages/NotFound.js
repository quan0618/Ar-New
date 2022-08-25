/* ar-brown App (C) 2021 arbrown.co.jp All rights reserved.
 *******************************************************************************
 * Program ID:  NotFound.js
 * $Revision:   Ver1.0
 * $Modtime:    $
 *******************************************************************************
 * Author      (作成／更新年月日、担当者)
 *  2021/08/01 Rayoo)li : 新規作成
 *
 * Summary NotFound画面
 *
 * Instructions / Preconditions
 *  なし
 *
 *******************************************************************************
 */
import { Container, Row, Col } from 'react-bootstrap'
import React, { LinkContainer } from 'react-router-bootstrap'

const NotFound = () => {
  return (
    <Container fluid='md' className='mt-5'>
      <Row>
        <Col>
          <div className='card'>
            <div className='card-header'>404</div>
            <div className='card-body'>
              <h5 className='card-title'>Custom Error Page</h5>
              <p className='card-text'>
                Edit Custom 404 error page
              </p>
              <LinkContainer to='/'>
                <button className='btn btn-primary'>Home Page</button>
              </LinkContainer>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default NotFound