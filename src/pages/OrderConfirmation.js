/* eslint-disable no-irregular-whitespace */
/* ar-brown App (C) 2021 arbrown.co.jp All rights reserved.
 *******************************************************************************
 * Program ID:  OrderConfirmation.js
 * $Revision:   Ver1.0
 * $Modtime:    $
 *******************************************************************************
 * Author      (作成／更新年月日、担当者)
 *  2022/03/30 Rayoo)li : 新規作成
 *
 * Summary OrderConfirmation画面
 *
 * Instructions / Preconditions
 *  なし
 *
 *******************************************************************************
 */
import userAuth from '../components/userAuth'
import { Container, Row, Col } from 'react-bootstrap'
import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import { updateArOrder, updateArAgencyOrderInfo } from '../graphql/mutations';
import { useLocation } from 'react-router-dom';
import API, { graphqlOperation } from '@aws-amplify/api';
import BootstrapTable from 'react-bootstrap-table-next';
import { orderByQuoteNumber, listArAgencyOrderInfos, getArAgencyByAgencyid } from '../graphql/queries';
import { updateArInventory } from '../graphql/mutations';
import moment from 'moment';
import { useHistory } from "react-router-dom";
import FileSaver from "file-saver"
// import { TextField } from '@material-ui/core';
import InputBase from '@material-ui/core/InputBase';
import ArToast from '../components/ArToast';
import '../components/ArGlobal';
// import { TextField } from '@material-ui/core';

const TAX_RATE = 0.1;
const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 200,
  },
  rootl: {
    maxWidth: '100%'
  },
  card1: {
    maxWidth: '100%'
  },
  card2: {
    maxWidth: '100%'
  },
  table: {
    minWidth: 700,
  },
  paper: {
    padding: theme.spacing(2),
    margin: 'auto',
    maxWidth: '100%'
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '20ch',
    fontSize: '20px'
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  textFieldOrderQuantity: {
    margin: theme.spacing(0),
    position: 'relative',
    height: "100%",
  },
  resize: {
    height: "100%"
  }
}));


function getSteps() {
  return ['受注受付', '受付処理中', '納期確定', '受注キャンセル'];
}
let Status = '1';
let orderID = '';
let invoiceSubtotal = '';
let invoiceFax = '';
let invoiceTotal = '';
let invoicePayTotal = '';
let histotyOrder = [];
let historyDate;
const OrderConfirmation = () => {

  // function moneytonum1(val) {
  //   let num = val.trim();
  //   let ss = num.toString();
  //   if (ss.length === 0) {
  //     return "0";
  //   }
  //   return ss.replace(/,/g, "");
  // }
  // function numtomoney1(number, toFixed) {
  //   let str = [];
  //   if (!number) return 0
  //   if (typeof number === "number") number = String(number)
  //   let tempNumber = number.split('.');
  //   number = tempNumber[0]
  //   if (number.length <= 3) {
  //     if (tempNumber[1]) {
  //       number += '.' + tempNumber[1].slice(0, toFixed);
  //     }
  //     return number
  //   }
  //   number.split('').reverse().forEach((item, index) => {
  //     if (index !== 0 && index % 3 === 0) {
  //       str.push(',', item)
  //     } else {
  //       str.push(item)
  //     }
  //   })
  //   number = str.reverse().join('')
  //   if (tempNumber[1]) {
  //     number += '.' + tempNumber[1].slice(0, toFixed);
  //   }
  //   return number;
  // }
  function toPoint(percent) {
    let str = percent.replace("%", "");
    str = str / 100;
    return str;
  }
  const CaptionElement = () =>
    <h4
      style={{
        borderRadius: '0.25em',
        textAlign: 'center',
        color: 'purple',
        border: '1px solid purple',
        padding: '0.5em'
      }}>
      ご注文製品
    </h4>;
  const headerStyle = { backgroundColor: '#D3D3D3' }
  const columns = [
    { dataField: 'id', text: 'ID', hidden: true, },
    { dataField: 'Product_Name_j', text: '製品名', headerStyle },
    { dataField: 'Campaign_price', text: '定価', align: 'right', headerStyle },
    { dataField: 'Wholes_Rate', text: '仕切率', align: 'right', headerStyle },
    {
      dataField: 'OrderQuantity', text: '数量 ', align: 'right', type: 'number', headerStyle, style: { margin: '0px', width: '100px' },
      formatter: (cellContent, row) => {
        if (row.id !== null) {
          return (
            <InputBase
              id={row.id}
              color="primary"
              type="number"
              defaultValue={row.OrderQuantity}
              name="count"
              variant='outlined'
              readOnly={!orderApprovalFlag}
              className={classes.textFieldOrderQuantity}
              onBlur={(e) => { handleSetCount(row, e.target.value, row.Quantity) }}
              onChange={(e) => { handleSetMax(row.id, row.Quantity, e.target.value) }}
            />
          );
        }
      }
    },
    {
      dataField: 'Total', text: '小計 ', align: 'right', type: 'number', headerStyle,
      formatter: (cellContent, row) => {
        return (
          <span>
            {numtomoney(Math.round(parseFloat(row.OrderQuantity) * parseFloat(moneytonum(row.Campaign_price)) * parseFloat(toPoint(row.Wholes_Rate))))}
          </span>
        );
      }
    },
    { dataField: 'Wholes_Price', text: '提供価格', hidden: true, }
  ];
  const classes = useStyles();
  const steps = getSteps();
  const history = useHistory();
  const [displayFlg, setDisplayFlg] = React.useState(Object);
  const [orderApprovalFlag, setOrderApprovalFlag] = React.useState(false);
  const [orderDataText, setOrderData] = React.useState(Object);
  const [toast, setToast] = React.useState({ open: false, message: "send Email success", severity: "success" });
  const handleSetAuthFlg = (Object) => {
    setDisplayFlg(Object);
  }
  const [orderinfo, setOrderinfo] = useState([]);
  const [orderaddressinfo, setOrderaddressinfo] = useState(Object);
  // const [dataAll, SetdataAll] = useState()
  function orderClick() {
    updateArOrders();
    numberKu();
    // a1 : 発注， a6 canceld order; a5：saler 承认
    let templteType = "a6";// agency cancled order
    for (let i in orderinfo) {
      if (orderinfo[i].OrderQuantity !== 0) {
        templteType = "a1";
      }
    }
    if (templteType === "a1") {
      const body = {
        templete: "a1",
        subject: "代理店様受注登録【" + location.state.QuoteNumber + " 】",
        msgUrl: "https:www.google.com",
        txtEnd: "",
        receiveUser: '',
        message: "営業アシスタント様<br>【" + location.state.QuoteNumber + " 】代理店様受注登録が行われました。　<br>内容確認をお願いします。"
      };
      sendEmail(body, "Saler");
    }
    sendAgencyEmail("templteType");
  }
  // Email the agency
  async function sendAgencyEmail(emailtemplete) {
    let agencyList = await API.graphql(graphqlOperation(getArAgencyByAgencyid, { Agency_id: orderinfo[0].Agency_id }))
    let AgencyInfo = agencyList.data.getArAgencyByAgencyid['items'];
    let AgencyEmails = [];
    for (let item in AgencyInfo) {
      AgencyEmails.push(AgencyInfo[item].Agency_Email);
    }
    let bodyAgency;
    if (emailtemplete === 'a1') {
      bodyAgency = {
        templete: "a1",
        subject: "宛先：代理店様",
        msgUrl: "https:www.google.com",
        txtEnd: "",
        receiveUser: 'Agency',
        toAgencyEmails: AgencyEmails,
        message: "営業アシスタント様<br>【" + location.state.QuoteNumber + " 】受注登録頂きありがとうございました。。　<br>＊＊＊＊しばらくお待ちください。"
      };
    } else if (emailtemplete === 'a5') {
      bodyAgency = {
        templete: "a5",
        subject: "代理店様受注登録【" + location.state.QuoteNumber + " 】",
        msgUrl: "https:www.google.com",
        txtEnd: "",
        receiveUser: 'Agency',
        toAgencyEmails: AgencyEmails,
        message: "営業アシスタント様<br>【" + location.state.QuoteNumber + " 】受注登録頂きありがとうございました。。　<br>＊＊＊＊しばらくお待ちください。"
      }
    }
    else if (emailtemplete === 'a6') {
      let messageInfo = "*******御中<br>" +
        "いつもお世話になっております。<br>" +
        "弊社Web受注システムにご注文いただきました【Web受注番号】についてキャンセル操作が行われキャンセルが確定いたしましたのでご連絡いたします。<br>" +
        "Web受注番号：" + location.state.QuoteNumber + "<br>" +
        "なお、ご不明点等ございましたらお問い合わせをお願いします。<br><br>" + "以上、よろしくお願いいたします。<br>" +
        "<pre>                                            エア・ブラウン株式会社<pre><br>" +
        "<pre>                                            エア・ブラウン株式会社<pre>"
      bodyAgency = {
        templete: "a6",
        subject: "Web受注キャンセルのご報告　【" + location.state.QuoteNumber + "】",
        msgUrl: "",
        receiveUser: 'Agency',
        message: messageInfo,
        toAgencyEmails: AgencyEmails,
      };
    }
    sendEmail(bodyAgency, "Agency");
  }
  // 仮在庫数を変更
  async function numberKu() {
    for (let index = 0; index < orderinfo.length; index++) {
      let Quantity = orderinfo[index].Quantity - orderinfo[index].OrderQuantity;
      await API.graphql(graphqlOperation(updateArInventory, { input: { id: orderinfo[index].Product_id, Product_Code: orderinfo[index].Product_Code, TempInventoryQuantity: Quantity } }))
    }
  }
  //承认click
  async function orderApprovalClick() {
    let hopedateValue = document.getElementById('hopedate').value;
    if (hopedateValue !== orderaddressinfo.DesiredDeliveryDate) {
      console.log("希望纳期changed", hopedateValue)
    }
    let date2;
    if (orderDataText.length > 17) {
      date2 = orderDataText + "T00:00.000Z";
    } else if (orderDataText.length > 0) {
      date2 = orderDataText + "T00:00:00.000Z";
    } else {
      date2 = '';
    }
    // for (const item in orderinfo) {
    //     if(orderinfo[item].OrderQuantity > 0){
    //       canceledOrder = true;
    //     }
    // }


    await API.graphql(
      graphqlOperation(updateArOrder, {
        input: {
          id: orderID,
          ShippingBlock: 'Z1',
          Status: '4',/*登録完了*/
          QuoteNumber: location.state.QuoteNumber,
          DesiredDeliveryDate: date2,/*希望納期日 */
        }
      })
    )
    let sesFlag = false;
    for (let i = 0; i < orderinfo.length; i++) {
      if (orderinfo[i].OrderQuantity !== histotyOrder[i].OrderQuantity) {
        sesFlag = true;
        console.log("update order OrderQuantity ")
        await API.graphql(
          graphqlOperation(updateArAgencyOrderInfo, {
            input: {
              id: orderinfo[i].id, Agency_id: orderinfo[i].Agency_id, QuoteNumber: location.state.QuoteNumber, Product_Code: orderinfo[i].Product_Code,
              OrderQuantity: parseFloat(orderinfo[i].OrderQuantity),
            }
          })
        );
      }
    }
    if (sesFlag || historyDate !== orderDataText) {
      console.log("send Email");
      const body = {
        templete: "a5",
        subject: "販売承認確認【" + location.state.QuoteNumber + " 】",
        msgUrl: "https:www.google.com",
        txtEnd: "",
        receiveUser: '',
        message: "営業アシスタント様<br>【" + location.state.QuoteNumber + " 】代理店様受注登録が行われました。　<br>内容確認をお願いします。"
      };
      sendEmail(body, "Saler");
      sendAgencyEmail("a5");
    }
  }
  //
  function sendEmail(bodyContent, type) {
    const body = JSON.stringify(bodyContent);
    const requestOptions = {
      method: "POST",
      body,
    };

    fetch(global.ArGlob.EmailEndPoint, requestOptions)
      .then((response) => {
        console.log("response:", response.status)
        if (response.ok) {
          setToast(
            {
              open: false,
              message: "send " + type + " Email success",
              severity: "success"
            }
          );
          setToast(
            {
              open: true,
              message: "send " + type + " Email success",
              severity: "success"
            }
          );
        } else {
          setToast(
            {
              open: false,
              message: "send " + type + " Email error",
              severity: "error"
            },
            {
              open: true,
              message: "send " + type + " Email error",
              severity: "error"
            }
          );
        }
        return response.json();
      })
      .then((response) => {
        console.log("成功", response)
      })
      .catch((error) => {
        console.log("失败", error)
      });

  }

  //ファイルを書込み
  function outFile() {

    // 受注アップロード連携ファイルフォーマット(取込用/結果用 共用)
    let SalesSlipNumber138 = orderinfo.split(item => item.SalesGroup === '138');
    let SalesSlipNumber137 = orderinfo.split(item => item.SalesGroup === '137');
    let SalesSlipNumber136 = orderinfo.split(item => item.SalesGroup === '136');
    if (SalesSlipNumber138.length > 0) {
      outFileWithSalesGroupNumber(SalesSlipNumber138);
    }
    if (SalesSlipNumber137.length > 0) {
      outFileWithSalesGroupNumber(SalesSlipNumber137);
    }
    if (SalesSlipNumber136.length > 0) {
      outFileWithSalesGroupNumber(SalesSlipNumber136);
    }
  }
  function getSpaceStr(count) {
    let result = '';
    for (let index = 0; index < count; index++) {
      result += '\t';
    }
    return result
  }
  function outFileWithSalesGroupNumber(orderinfo) {
    let str = '';
    str +=
      'ステータス' + '\t' +
      '割当番号(キー)' + '\t' +
      '販売伝票タイプ' + '\t' +
      '販売組織' + '\t' +
      '流通チャネル' + '\t' +
      '製品部門' + '\t' +
      '営業所' + '\t' +
      '営業グループ' + '\t' +
      '受注先' + '\t' +
      '受注先_敬称' + '\t' +
      '受注先_名称 1' + '\t' +
      '受注先_名称 2' + '\t' +
      '受注先_名称 3' + '\t' +
      '受注先_名称 4' + '\t' +
      '受注先_地名/番地-号' + '\t' +
      '受注先_国コード' + '\t' +
      '受注先_郵便番号' + '\t' +
      '受注先_私書箱番号' + '\t' +
      '受注先_私書箱住所' + '\t' +
      '受注先_市区町村' + '\t' +
      '受注先_所在地' + '\t' +
      '受注先_地域 (都道府県)' + '\t' +
      '受注先_私書箱' + '\t' +
      '受注先_電話番号 1' + '\t' +
      '受注先_テレボックス番号' + '\t' +
      '受注先_FAX 番号' + '\t' +
      '受注先_言語キー' + '\t' +
      '出荷先' + '\t' +
      '出荷先_敬称' + '\t' +
      '出荷先_名称 1' + '\t' +
      '出荷先_名称 2' + '\t' +
      '出荷先_名称 3' + '\t' +
      '出荷先_名称 4' + '\t' +
      '出荷先_地名/番地-号' + '\t' +
      '出荷先_国コード' + '\t' +
      '出荷先_郵便番号' + '\t' +
      '出荷先_私書箱番号' + '\t' +
      '出荷先_私書箱住所' + '\t' +
      '出荷先_市区町村' + '\t' +
      '出荷先_所在地' + '\t' +
      '出荷先_地域 (都道府県)' + '\t' +
      '出荷先_私書箱' + '\t' +
      '出荷先_電話番号 1' + '\t' +
      '出荷先_テレボックス番号' + '\t' +
      '出荷先_FAX 番号' + '\t' +
      '出荷先_言語キー' + '\t' +
      '得意先発注番号' + '\t' +
      'エンドユーザ' + '\t' +
      'エンドユーザ_敬称' + '\t' +
      'エンドユーザ_名称 1' + '\t' +
      'エンドユーザ_名称 2' + '\t' +
      'エンドユーザ_名称 3' + '\t' +
      'エンドユーザ_名称 4' + '\t' +
      'エンドユーザ_地名/番地-号' + '\t' +
      'エンドユーザ_国コード' + '\t' +
      'エンドユーザ_郵便番号' + '\t' +
      'エンドユーザ_私書箱番号' + '\t' +
      'エンドユーザ_私書箱住所' + '\t' +
      'エンドユーザ_市区町村' + '\t' +
      'エンドユーザ_所在地' + '\t' +
      'エンドユーザ_地域 (都道府県)' + '\t' +
      'エンドユーザ_私書箱' + '\t' +
      'エンドユーザ_電話番号 1' + '\t' +
      'エンドユーザ_テレボックス番号' + '\t' +
      'エンドユーザ_FAX 番号' + '\t' +
      'エンドユーザ_言語キー' + '\t' +
      'コンテナヤード' + '\t' +
      '営業員' + '\t' +
      '価格設定日付' + '\t' +
      '伝票通貨' + '\t' +
      '換算レート' + '\t' +
      '伝票日付' + '\t' +
      '会計換算レート' + '\t' +
      '社内備考' + '\t' +
      '送り状備考' + '\t' +
      '請求書備考' + '\t' +
      'INVOICE備考' + '\t' +
      '予約レート番号' + '\t' +
      '換算レート固定' + '\t' +
      '販売伝票明細' + '\t' +
      '明細カテゴリ' + '\t' +
      'プラント' + '\t' +
      '保管場所' + '\t' +
      '品目' + '\t' +
      'テキスト' + '\t' +
      '受注数量' + '\t' +
      '販売単位' + '\t' +
      '納入日付' + '\t' +
      '輸送計画日付' + '\t' +
      '条件レート' + '\t' +
      '出荷先発注番号' + '\t' +
      '社内備考' + '\t' +
      '出荷依頼書備考' + '\t' +
      '送り状備考' + '\t' +
      '請求書備考' + '\t' +
      '直送購買発注備考' + '\t' +
      '直送東レEDI用備考' + '\t' +
      '購買伝票タイプ' + '\t' +
      '購買組織' + '\t' +
      '購買グループ' + '\t' +
      '仕入先' + '\t' +
      '通貨コード' + '\t' +
      '換算レート(文字)' + '\t' +
      '換算レート固定' + '\t' +
      '無償' + '\t' +
      '納入期日' + '\t' +
      '選択：発注単価' + '\t' +
      '選択：発注総額' + '\t' +
      '正味発注価格' + '\t' +
      '価格単位' + '\t' +
      '正味発注額' + '\t' +
      '価格単位' + '\t' +
      '基本数量単位' + '\t' +
      '税コード' + '\t' +
      '保管場所' + '\t' +
      '市場' + '\t' +
      'セグメント' + '\t' +
      'エンドユーザー' + '\t' +
      '予約レート番号' + '\t' +
      'インコタームズ' + '\t' +
      'インコタームズ (2)' + '\t' +
      '拒否理由' + '\t' +
      'アイコン' + '\t' +
      '販売伝票' + '\t' +
      '出荷ブロック' + '\t' +
      'コメント';
    // データ
    let comments = orderaddressinfo.comments === null ? '' : orderaddressinfo.comments;
    for (let index = 0; index < orderinfo.length; index++) {
      str += '\n' +
        getSpaceStr(1) +
        orderaddressinfo.QuoteNumber + '\t' +
        "ZS01" + '\t' +
        "10" + '\t' +
        "01" + '\t' +
        "01" + '\t' +
        "1001" + '\t' +
        orderinfo[index].SalesGroup + '\t' +
        orderaddressinfo.Contractor +
        getSpaceStr(19) +
        orderaddressinfo.ShippingDestination +
        getSpaceStr(40) +
        "AG196" + '\t' +
        getSpaceStr(1) +
        "JPY" +
        getSpaceStr(10) +
        orderinfo[index].DetailNo + '\t' +
        getSpaceStr(1) +
        orderinfo[index].SalesGroup + '\t' +
        getSpaceStr(1) +
        orderinfo[index].Product_Name_j + '\t' +
        getSpaceStr(1) +
        orderinfo[index].OrderQuantity + '\t' +
        getSpaceStr(3) +
        orderinfo[index].Campaign_price + '\t' +
        getSpaceStr(25) +
        "0100" + '\t' +
        "0560" + '\t' +
        getSpaceStr(4) +
        orderinfo[index].delflg + '\t' +
        getSpaceStr(2) +
        orderaddressinfo.ShippingBlock + '\t' +
        comments;
    }

    // エンコード
    str.replace(/\s+/g, '');
    let exportContent = "\uFEFF";
    let blob = new Blob([exportContent + str], {
      type: "text/plain;charset=utf-8"
    });
    // ファイルを作成
    FileSaver.saveAs(blob, "受注アップロード取込データ.TXT");
  }

  const updateArOrders = async () => {
    await API.graphql(
      graphqlOperation(updateArOrder, {
        input: {
          id: orderID,
          Status: 3,
          QuoteNumber: location.state.QuoteNumber
        }
      })
    );
    history.push({ pathname: '/OrderList' });
  }
  function moneytonum(val) {
    let num = val.trim();
    let ss = num.toString();
    if (ss.length === 0) {
      return "0";
    }
    return ss.replace(/,/g, "");
  }
  function numtomoney(number, toFixed) {
    let str = [];
    if (!number) return 0
    if (typeof number === "number") number = String(number)
    let tempNumber = number.split('.');
    number = tempNumber[0]
    if (number.length <= 3) {
      if (tempNumber[1]) {
        number += '.' + tempNumber[1].slice(0, toFixed);
      }
      return number
    }
    number.split('').reverse().forEach((item, index) => {
      if (index !== 0 && index % 3 === 0) {
        str.push(',', item)
      } else {
        str.push(item)
      }
    })
    number = str.reverse().join('')
    if (tempNumber[1]) {
      number += '.' + tempNumber[1].slice(0, toFixed);
    }
    return number;
  }
  const handleSetMax = (id, Quantity, Object) => {
    let idTemp = document.getElementById(id);
    if (Object <= 0) {
      idTemp.value = 0;
      setQ(id, 0)
      return
    }
    if (Object > Quantity) {
      idTemp.value = Quantity;
      setQ(id, Quantity);
      return
    }
    setQ(id, idTemp.value);
  }
  function setQ(id, num) {
    for (let j = 0; j < orderinfo.length; j++) {
      if (orderinfo[j].id === id) {
        orderinfo[j].OrderQuantity = num;
        break;
      }
    }
  }
  const handleSetCount = (row, Object, Quantity) => {
    if (Object < 0) {
      return;
    }
    if (Object > Quantity) {
      return;
    }
    for (let j = 0; j < orderinfo.length; j++) {
      if (orderinfo[j].id === row.id) {
        orderinfo[j].OrderQuantity = Object
        break;
      }
    }
    let postageSum = 0;
    for (let j = 0; j < orderinfo.length; j++) {
      if (parseFloat(orderinfo[j].OrderQuantity) * parseFloat(moneytonum(orderinfo[j].Campaign_price)) * parseFloat(toPoint(orderinfo[j].Wholes_Rate)) > 0 && parseFloat(orderinfo[j].OrderQuantity) * parseFloat(moneytonum(orderinfo[j].Campaign_price)) * parseFloat(toPoint(orderinfo[j].Wholes_Rate)) <= 5000) {
        postageSum += 1000;
      }
    }
    let sum = 0;
    for (let j = 0; j < orderinfo.length; j++) {
      sum = sum + parseFloat(orderinfo[j].OrderQuantity) * parseFloat(moneytonum(orderinfo[j].Campaign_price)) * parseFloat(toPoint(orderinfo[j].Wholes_Rate));
    }
    invoiceSubtotal = numtomoney(sum, 0);
    invoiceFax = numtomoney(Math.round(sum * TAX_RATE), 0);
    invoiceTotal = numtomoney(postageSum, 0);
    invoicePayTotal = numtomoney(Math.round(sum + sum * TAX_RATE + postageSum), 0);
    handleSetflg(invoicePayTotal);
  };
  const [flg, setInvoiceSubtotal] = React.useState(Object);
  const handleSetflg = (Object) => {
    setInvoiceSubtotal(Object);
  };
  function txtChangedOrderData(e) {
    setOrderData(e.target.value);
  }
  const location = useLocation();
  useEffect(() => {
    if (location.state === undefined) {
      history.push({ pathname: '/' });
      return
    }
    async function listInvData() {
      const userAuths = await userAuth();
      let QuoteNumber = location.state.QuoteNumber;
      const orderByQuoteNumberIngo = await API.graphql(graphqlOperation(orderByQuoteNumber, { QuoteNumber: QuoteNumber }));
      if (orderByQuoteNumberIngo.data.orderByQuoteNumber !== null) {
        const orderInfo = orderByQuoteNumberIngo.data.orderByQuoteNumber['items'];
        if (orderInfo.length > 0) {
          Status = orderInfo[0].Status;
          if (userAuths === '1') {
            if (Status === '2') {
              handleSetAuthFlg(false);
            } else {
              handleSetAuthFlg(true);
            }
          } else {
            handleSetAuthFlg(true);
            setOrderApprovalFlag(true);
          }
          orderID = orderInfo[0].id;
          if (orderInfo[0].RegistrationDate !== null && orderInfo[0].RegistrationDate !== '') {
            orderInfo[0].RegistrationDate = moment(orderInfo[0].RegistrationDate).utcOffset(0).format('YYYY/MM/DD');
          }
          if (orderInfo[0].DesiredDeliveryDate !== null && orderInfo[0].DesiredDeliveryDate !== '') {
            orderInfo[0].DesiredDeliveryDate = moment(orderInfo[0].DesiredDeliveryDate).utcOffset(0).format('YYYY-MM-DD');
          }
          historyDate = orderInfo[0].DesiredDeliveryDate;
          setOrderData(orderInfo[0].DesiredDeliveryDate);
          console.log("orderDate", orderInfo[0].DesiredDeliveryDate)
          setOrderaddressinfo(orderInfo[0]);
        }
      }
      let listArAgencyOrderInfo = await API.graphql(graphqlOperation(listArAgencyOrderInfos, { QuoteNumber: QuoteNumber }));
      if (listArAgencyOrderInfo.data.listArAgencyOrderInfos !== null) {
        const order = listArAgencyOrderInfo.data.listArAgencyOrderInfos['items'];
        console.log("orderList:", order)
        for (let item in order) {
          let historyItem = {};
          historyItem.id = order[item].id;
          historyItem.OrderQuantity = order[item].OrderQuantity;
          histotyOrder.push(historyItem);
        }
        console.log("histotyOrder:", histotyOrder)
        setOrderinfo(order);
        let postageSum = 0;
        for (let j = 0; j < order.length; j++) {
          if (parseFloat(order[j].OrderQuantity) * parseFloat(moneytonum(order[j].Campaign_price)) * parseFloat(toPoint(order[j].Wholes_Rate)) > 0 && parseFloat(order[j].OrderQuantity) * parseFloat(moneytonum(order[j].Campaign_price)) * parseFloat(toPoint(order[j].Wholes_Rate)) <= 5000) {
            postageSum += 1000;
          }
        }
        let sum = 0;
        for (let j = 0; j < order.length; j++) {
          sum = sum + parseFloat(order[j].OrderQuantity) * parseFloat(moneytonum(order[j].Campaign_price)) * parseFloat(toPoint(order[j].Wholes_Rate));
        }
        invoiceSubtotal = numtomoney(sum, 0);
        invoiceFax = numtomoney(Math.round(sum * TAX_RATE), 0);
        invoiceTotal = numtomoney(postageSum, 0);
        invoicePayTotal = numtomoney(Math.round(sum + sum * TAX_RATE + postageSum), 0);
        handleSetflg(invoicePayTotal);
      }
    }
    listInvData();
  }, []);

  return (
    <Container style={{ backgroundColor: '', 'minWidth': '85vw', 'minHeight': '74vh' }}>
      <div className={classes.rootl} style={{ display: 'flex', alignItems: 'center' }}>
        <Stepper activeStep={Number(Status) - 3} alternativeLabel style={{ width: '90%' }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <div className={classes.card1}>
          <Row> <Col>
          </Col>
            <Col align="right" style={{ width: 320 }}>

              {orderApprovalFlag === true ? <Button variant="contained" size='medium' color="primary" onClick={orderApprovalClick} style={{ float: 'left' }}>承认</Button> :
                <div >
                  <Button variant="contained" size='medium' color="primary" onClick={() => { outFile(); }} style={{ float: 'left' }}>書出</Button>
                  <Button hidden={displayFlg} variant="contained" color="primary" size='medium' style={{ float: 'right' }} onClick={() => { orderClick(); }}>発注</Button>
                </div>
              }
            </Col>
          </Row>
        </div>
      </div>
      <Paper className={classes.paper}>
        <Grid container spacing={2}>
          <Grid item xs={6} sm container>
            <Grid item xs container direction="column" spacing={2}>
              <Grid item xs>
                <Typography gutterBottom variant="subtitle1" component="div">
                  <h4 style={{ color: 'purple' }}>配送先情報</h4>
                </Typography>
                <Typography variant="body2" component="div">
                  <h5>会社名　　　　:{orderaddressinfo.CompanyName}</h5>
                </Typography>
                <Typography variant="body2" component="div">
                  <h5>営業所名　　　:{orderaddressinfo.GroupName}</h5>
                </Typography>
                <Typography variant="body2" component="div">
                  <h5>登録者　　　　:{orderaddressinfo.Insertperson}</h5>
                </Typography>
                <Typography variant="body2" component="div">
                  <h5>調達担当者　　:{orderaddressinfo.OrderPerson}</h5>
                </Typography>
                <Typography variant="body2" component="div">
                  <h5>ARB担当営業　:{orderaddressinfo.ARBSalesRepresentative}</h5>
                </Typography>
                <Typography variant="body2" component="div">
                  <h5>受注先　　　　:{orderaddressinfo.Contractor}</h5>
                </Typography>
                <Typography variant="body2" component="div">
                  <h5>出荷先　　　　:{orderaddressinfo.ShippingDestination}</h5>
                </Typography>
              </Grid>
            </Grid>
            <Grid item xs={6} sm>
              <Typography gutterBottom variant="subtitle1" component="div">
                <h4 style={{ color: 'purple' }}>注文情報</h4>
              </Typography>
              <Row>
                <Col>
                  <Typography variant="body2" component="div">
                    <h5>登録番号　:{location.state.QuoteNumber}</h5>
                  </Typography>
                </Col>
                <Col>
                  <Typography variant="body2" component="div">
                    <h5>登録日　:{orderaddressinfo.RegistrationDate}</h5>
                  </Typography>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Typography variant="body2" component="div">
                    <h5>発注番号　:{orderaddressinfo.OrderNumber}</h5>
                  </Typography>
                </Col>
                <Col>
                  <Typography variant="body2" component="div">
                    <h5>希望納期: <InputBase
                      id="hopedate"
                      label=""
                      type="date"
                      className={classes.textField}
                      value={orderDataText}
                      readOnly={!orderApprovalFlag}
                      onChange={(e) => { txtChangedOrderData(e) }}
                    /></h5>
                  </Typography>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Typography variant="body2" component="div">
                    <h5>注文番号　:{orderaddressinfo.ChouNumber}</h5>
                  </Typography>
                </Col>
                <Col>
                  <Typography variant="body2" component="div">
                    <h5>注文日　:{orderaddressinfo.ChouDate}</h5>
                  </Typography>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Typography variant="body2" component="div">
                    <h5>出荷予定日:{orderaddressinfo.EstimatedShippingDate}</h5>
                  </Typography>
                </Col>
                <Col>
                  <Typography variant="body2" component="div">
                    <h5>出荷日　:{orderaddressinfo.ShipDate}</h5>
                  </Typography>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Typography variant="body2" component="div">
                    <h5>納品予定日:{orderaddressinfo.DeliveryYtDate}</h5>
                  </Typography>
                </Col>
                <Col>
                  <Typography variant="body2" component="div">
                    <h5>納品日　:{orderaddressinfo.DeliveryDate}</h5>
                  </Typography>
                </Col>
              </Row>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
      <BootstrapTable
        bootstrap4
        keyField="id"
        caption={<CaptionElement />}
        data={orderinfo}
        columns={columns}
      />
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="spanning table">
          <></>
          <TableBody>
            <TableRow>
              <TableCell rowSpan={4} />
              <TableCell colSpan={2}>製品代金合計（税抜）</TableCell>
              <TableCell colSpan={2} align="right">{invoiceSubtotal}円
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2}>消費税（10%）</TableCell>
              <TableCell colSpan={2} align="right">{invoiceFax}円</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2}>送料 </TableCell>
              <TableCell colSpan={2} align="right">{invoiceTotal}円</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2}>ご注文金額合計（税込）</TableCell>
              <TableCell colSpan={2} align="right">{invoicePayTotal}円</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <div hidden={flg}></div>
      <ArToast open={toast.open} message={toast.message} severity={toast.severity} handleClose={() => {
        toast.open = false;
        setToast(toast)
      }} />

    </Container>
  );
}

export default OrderConfirmation