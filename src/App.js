/* ar-brown App (C) 2021 arbrown.co.jp All rights reserved.
 *******************************************************************************
 * Program ID:  App.js
 * $Revision:   Ver1.0
 * $Modtime:    $
 *******************************************************************************
 * Author      (作成／更新年月日、担当者)
 *  2021/08/01 Rayoo)li : 新規作成
 *
 * Summary 登録画面
 *
 * Instructions / Preconditions
 *  なし
 *
 *******************************************************************************
 */
// 依頼
import React, { useEffect } from "react";
import { Container, Row, Col, Image } from 'react-bootstrap'
import { Route, Switch } from 'react-router-dom'
// Layout
import Layout from './layout/Layout'
// pages
import Home from './pages/Home'
import Agent from './pages/Agent'
import Contact from './pages/Contact'
import InventorySearch from './pages/InventorySearch'
import NotFound from './pages/NotFound'
import Order from './pages/Order'
import OrderConfirmation from './pages/OrderConfirmation'
import OrderList from './pages/OrderList'
import Footer from './components/Footer'
import privacy from './pages/privacy'
import terms from './pages/terms'
// page content
import Meta from './components/Meta'
// AWS標準設定 with Login Auth.
import logo_icon from './components/logo_icon.gif'
import logo_01 from './components/logo_01.jpg'
import Amplify, { Auth, I18n } from 'aws-amplify';
import awsconfig from './aws-exports';
import { AmplifyAuthenticator, AmplifySignIn ,AmplifyAuthContainer} from "@aws-amplify/ui-react";
import { AuthState, onAuthUIStateChange, Translations } from "@aws-amplify/ui-components";
import ja from "@aws-amplify-jp/vocabulary-ja";
import { makeStyles } from '@material-ui/core/styles';
import logo_bg from './components/bg.jpg'
import AuthRoute from "./components/AuthRoute";
import AddAddress from "./pages/AddAddress";
Amplify.configure(awsconfig);
Auth.configure(awsconfig)
const pageTitle = 'ARB-SIP（在庫・価格照会システム）'
// 自動定義
I18n.setLanguage("ja-JP");
I18n.putVocabulariesForLanguage("ja-JP", ja(Translations));
I18n.putVocabulariesForLanguage("ja-JP", {
  [Translations.FORGOT_PASSWORD_TEXT] : "パスワードを忘れましたか？",
});

const useStyles = makeStyles(() => ({
  img: {
    width: '100%',
    height: '50px'
  },
  logo: {
    width: '239px',
    height: '69px',
  },
  img2: {
    width: '570px',
    height: '450px',
    display: 'flex',
    'justify-content': 'center',
  },
  font: {
    'text-align': 'right!important',
    'vertical-align': 'middle!important',
    'fontSize': '120%',
    'margin-right': '0rem',
  },
  authenticator: {
    display: 'flex',
    'justify-content': 'flex-start',
    'align-items': 'flex-start',
    flex: 1,
    height: '70vh',
    'margin-bottom': '0rem',
    '--container-height':'70vh',
    '--container-display': 'flex',
    '--container-justify': 'flex-start',
    '--container-align': 'flex-start'
  }
}));
const App = () => {
  const [authState, setAuthState] = React.useState();
  const [user, setUser] = React.useState();
  const classes = useStyles();

  useEffect(() => {
    onAuthUIStateChange((nextAuthState, authData) => {
      setAuthState(nextAuthState);
      setUser(authData);
    });
  }, []);
  return authState === AuthState.SignedIn && user ? (
    <Layout>
      <Switch>
        <Route path='/' component={InventorySearch} exact/>
        <Route path='/Agent' component={Agent} />
        <Route path='/Contact' component={Contact} />
        <Route path='/Home' component={Home} />
        <Route path='/privacy' component={privacy} />
        <Route path='/terms' component={terms} />
        <AuthRoute path='/Order' component={Order} />
        <AuthRoute path='/OrderConfirmation' component={OrderConfirmation} />
        <Route path='/OrderList' component={OrderList} />
        <Route path='/AddAddress' component={AddAddress} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  ) : (
    <div>
		<Container style={{ backgroundColor: '','minWidth': '85vw', 'minHeight':'95vh'}}>
        <div>
          <Meta title={pageTitle} />
        </div>
        <Row><Image fluid src={logo_icon} alt="ARBROWN　エア・ブラウン" ></Image ></Row>
        <Row><img src={logo_bg} alt="" className={classes.img}></img></Row>
        <Row>
          <Col style={{ backgroundColor: '' }}>
          <br></br>
          <br></br>
          <AmplifyAuthContainer >
            <AmplifyAuthenticator className={classes.authenticator}>
              <AmplifySignIn headerText='ARB-SIP（在庫・価格照会システム）' slot='sign-in' hideSignUp={true} />
            </AmplifyAuthenticator>
            </AmplifyAuthContainer>
          </Col>
          <Col>
          <br></br>
          <br></br>
            <Row><img src={logo_01} alt="ARBROWN　エア・ブラウン" className={classes.img2}></img></Row>
          </Col>
        </Row>
      </Container>
      <Footer />
    </div>
  );
}
export default App;
