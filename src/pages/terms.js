/* ar-brown App (C) 2021 arbrown.co.jp All rights reserved.
 *******************************************************************************
 * Program ID:  terms.js
 * $Revision:   Ver1.0
 * $Modtime:    $
 *******************************************************************************
 * Author      (作成／更新年月日、担当者)
 *  2021/08/01 Rayoo)li : 新規作成
 *
 * Summary サイトポリシー画面
 *
 * Instructions / Preconditions
 *  なし
 *
 *******************************************************************************
 */
// pages
import Meta from '../components/Meta'
import React, { Container, Row, Col } from 'react-bootstrap'
import {Link} from 'react-router-dom'
/*  AWS標準設定 with Login Auth. */
import Amplify from 'aws-amplify';
import awsconfig from '../aws-exports';

Amplify.configure(awsconfig);

const pageTitle = 'サイトポリシー｜ARB-SIP（在庫・価格照会システム）'

const terms = () => {
  return (
    <Container style={{ backgroundColor: '', 'minWidth': '85vw', 'minHeight': '74vh', padding: '10px 25% 10px 25%' }}>
      <Meta title={pageTitle} />
      <Row>
        <Col>
          <div id="page">
          <h1 className="heading1">利用規約</h1>

          <h2 className="heading2">サイトご利用上の注意</h2>

          <p>このご注意はお客様がエア・ブラウン株式会社（以下「当社」といいます）が運営するウェブサイトをご利用される場合、または商品を購入される場合にあたって、必要な注意事項を定めたものです。お客様が当社サイトをご利用される場合または商品を購入される場合はこのご注意をよくお読みください。お客様が当社サイトをご利用された場合または商品を購入される場合、このご注意に同意されたものとさせていただきます。
          当社はこのご注意の改定を適宜行います。改定の際、予告なく改定いたしますので、当社サイトをご利用の都度このご注意を必ずご確認くださいますようお願いいたします。改定後に当社サイトのご利用があった場合、改定後の注意事項に同意されたものとさせていただきます。</p>

          <h3 className="heading3">著作権</h3>
          <p>当社サイト上に掲載される写真等の著作物の著作権は当社に帰属します。これらの著作物を事前の承諾なしに、複製、送信等を行うことはできません。</p>

          <h3 className="heading3">免責事項</h3>
          <p>当社サイト利用に際して、次の行為を禁止いたします。違反された場合は当社はお客様との取引を停止もしくはお断りいたします。また、お客様の違反行為により当社に損害を与えた場合は、その損害を賠償する責任を負うものとします。当社、他のお客様、サービス提供者その他第三者の権利、利益、名誉等を損ねること。当社より支払う意思がないにもかかわらず注文するなど真に購入する意思なく商品を注文すること、他人になりすまして取引を行うこと、虚偽の情報を入力すること、その他の不正行為を行うこと。法令に違反すること。当社が定める各種規約に違反すること。</p>

          <h3 className="heading3">リンクについて</h3>
          <p>このウェブサイトから、もしくはこのウェブサイトへリンクを張っている当社以外の第三者のウエブサイト（以下「リンクサイト」といいます）の内容は、それぞれ各社の責任で管理されるものであり、当社の管理下にあるものではありません。リンクサイトは、それぞれのリンクサイトの掲げる使用条件に従ってご利用下さい。当社はリンクサイトの内容について、また、それらをご利用になったことにより生じたいかなる損害についても責任を負いません。</p>
          <p>尚、このウェブサイトへのリンクという事実は、当社が同リンクサイトの利用や、リンクサイトに掲載されている商品、サービス、会社等を推奨することを意味するものではなく、また、当社とリンクサイトとの間に提携などの特別な関係があるということを意味するものではありません。</p>
          <h3 className="heading3">その他</h3>
          <p>当サイトのコンテンツ、URL、規約等は予告なしに変更または削除されることがあります。当社の判断により当社サイトのサービスを全部または一部適宜変更、廃止できるものとします。お客様と当社との関係につきましては日本法が適用されるものとします。万一、お客様と当社との間に訴訟の必要が生じた場合には、東京地方裁判所を第一審専属的合意管轄裁判所とします。</p>

          <h3 className="heading3">お問い合わせ</h3>
          <p>
          <Link to='/Contact'>お問い合わせフォーム</Link>からお願いいたします。
          </p>
          </div>
        </Col>
      </Row>
    </Container>
  )
}
//<a style={{ color: '#FFFFFF' }}>お問い合わせフォーム</a>
export default terms