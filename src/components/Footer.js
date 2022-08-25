/* ar-brown App (C) 2021 arbrown.co.jp All rights reserved.
 *******************************************************************************
 * Program ID:  Footer.js
 * $Revision:   Ver1.0
 * $Modtime:    $
 *******************************************************************************
 * Author      (作成／更新年月日、担当者)
 *  2021/08/01 Rayoo)li : 新規作成
 *
 * Summary Footer
 *
 * Instructions / Preconditions
 *  なし
 *
 *******************************************************************************
 */
import React, { Container } from 'react-bootstrap'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  footer: {
    'text-align': 'center',
    margin: '0px 0 0 0',
    padding: '0px 0px 0px 0px',
    background: 'transparent no-repeat center center',
    'background-color': '#99613E',
    bottom: '0vh',
    'margin-bottom': '0vh',
    'border-width': '1px 0 0',
    position: 'relative',
    width: '100%',
  }
}));
const Footer = () => {
  const classes = useStyles();
  const year = new Date().getFullYear()
  return (
		<Container style={{ backgroundColor: '','minWidth': '85vw'}}>
      <footer className={classes.footer}>
        <div style={{ fontSize: 10, color: '#FFFFFF' }} >
          ｜<a style={{ color: '#FFFFFF' }} href="http://www.arbrown.com" target="_blank" rel="noreferrer">CORPORATE SITE</a>
          <br />
          Copyright &copy; {year}, ARBROWN CO.,LTD, All Rights Reserved.
        </div>
      </footer>
    </Container>
  )
}

export default Footer