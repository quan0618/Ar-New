/* ar-brown App (C) 2021 arbrown.co.jp All rights reserved.
 *******************************************************************************
 * Program ID:  Agent.js
 * $Revision:   Ver1.0
 * $Modtime:    $
 *******************************************************************************
 * Author      (作成／更新年月日、担当者)
 *  2021/08/01 Rayoo)li : 新規作成
 *
 * Summary Agent画面
 *
 * Instructions / Preconditions
 *  なし
 *
 *******************************************************************************
 */
// pages
import Meta from '../components/Meta'
import userAuth from '../components/userAuth'
import LoginAgent from '../components/LoginAgent'
import React, { useEffect, useReducer, useState } from 'react';
/*  GraphQL API Acess */
import API, { graphqlOperation } from '@aws-amplify/api';
import { customerByeMail, arCustomerByAgencyID, getArAZCustomerCode } from '../graphql/queries';
/*  AWS標準設定 with Login Auth. */
import Amplify, { Auth } from 'aws-amplify';
import awsconfig from '../aws-exports';
Amplify.configure(awsconfig);
import Grid from '@material-ui/core/Grid';
import { Container, Row, Col, InputGroup, FormControl } from 'react-bootstrap'
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';
import { v4 as uuidv4 } from 'uuid';
import { createArCustomer, updateArCustomer } from '../graphql/mutations';
import BootstrapTable from 'react-bootstrap-table-next';
// import DialogContentText from '@material-ui/core/DialogContentText';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { useHistory } from "react-router-dom";
import FileSaver from "file-saver"
/* Login時 下記取得するための初期化処理
    1) Auth.currentSession() から、Cogniteのユーザグループ情報を取得
    2) Auth.currentUserInfo() から、Agent情報を取得して、agencyGroupをSet
*/
const eMailQUERY = 'eMailQUERY';
const initialAgentState = { Agent: [] };
const reducer = (state, action) => {
  switch (action.type) {
    case eMailQUERY:
      return { ...state, Agent: action.Agent };
    default:
      return state;
  }
};
let agencyId = '';
let addressId = '';
const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 200,
  },
  rootl: {
    maxWidth: '100%'
  },
  card1: {
    maxWidth: '50%',
    minWidth: '50%',
    width: '50%',
  },
  card2: {
    maxWidth: '100%'
  },
  table: {
    minWidth: 700,
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '20ch',
  },
  textFieldNm: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '60ch',
  },
  textKField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '60ch',
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
  // avatar: {
  //   backgroundColor: red[500],
  // },
  backButton: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));
const customTotal = (from, to, size) => (
  <span className="react-bootstrap-table-pagination-total">
    Showing {from} to {to} of {size} Results
  </span>
);
const options = {
  paginationSize: 10,
  pageStartIndex: 1,
  showTotal: true,
  withFirstAndLast: true,
  firstPageText: 'First',
  prePageText: 'Back',
  nextPageText: 'Next',
  lastPageText: 'Last',
  nextPageTitle: 'First page',
  prePageTitle: 'Pre page',
  firstPageTitle: 'Next page',
  lastPageTitle: 'Last page',
  paginationTotalRenderer: customTotal,
  disablePageTitle: true,
  sizePerPageList: [{
    text: '10', value: 10
  }, {
    text: '20', value: 20
  }, {
    text: '30', value: 30
  }]
};
export const Agent = () => {
  const [agentGroupID, getAgent] = useReducer(reducer, initialAgentState);
  const classes = useStyles();
  const [addressList, setAddress] = useState([]);
  const [contractorList, setContractor] = useState([]);
  const history = useHistory();
  useEffect(() => {
    // 1) Auth.currentSession() から、Cogniteのユーザグループ情報を取得
    async function getLoginGroup() {
      // get the Login User Group from the top of the cognito groups list
      const user = await Auth.currentUserInfo();
      const agencyPriceGroup = await API.graphql(graphqlOperation(customerByeMail, { Agency_Email: user.attributes.email }));
      const agentinfo = agencyPriceGroup.data.customerByeMail['items'];
      const userAuths = await userAuth();
      if (userAuths === '1') {
        if (agentinfo.length > 0) {
          getAgent({ type: eMailQUERY, Agent: agentinfo });
        }
      } else {
        let items = { Agency_id: "‐", SubId: "‐", Company_Name: "‐", Agency_Name: "管理者" }
        let itemALL = []
        itemALL.push(items);
        getAgent({ type: eMailQUERY, Agent: itemALL });
      }
      agencyId = agentinfo[0].Agency_id;
      getAddressList();
      getContractorList();
    }
    getLoginGroup();

  }, []);
  function addClick(Object) {
    handleClickOpen1(Object);
    history.push({ pathname: '/AddAddress', state: { CustomerCodeKey: agencyId } });
  }
  const handleClickOpen1 = (direct) => {
    if (direct === 'add') {
      handleSetTitle("出荷先追加");
    } else {
      handleSetTitle("出荷先編集");
    }
    handleSetButtonText("登録");
    setOpen1(true);
    handleSetError('');
    handleSetErrorFlg(true);
    txtChangedCustomerAccountGroup('');
    txtChangedHonorificTitleKeyDialog('');
    txtChangedName1Dialog('');
    txtChangedName2Dialog('');
    txtChangedName3Dialog('');
    txtChangedSearchTerm1Dialog('');
    txtChangedPlaceNameDialog('');
    txtChangedPostCodeDialog('');
    txtChangedCountryCodeDialog('');
    txtChangedAreaDialog('');
    txtChangedLanguageCodeDialog('');
    txtChangedFirstPhoneNumberDialog('');
  };
  const [title, setTitle] = React.useState(Object);
  const handleSetTitle = (Object) => {
    setTitle(Object);
  };
  const handleClose2 = () => {
    setOpen1(false);
  };
  const [buttonText, setButtonText] = React.useState(Object);
  const handleSetButtonText = (Object) => {
    setButtonText(Object);
  };

  const [error, setError] = React.useState(Object);
  const handleSetError = (Object) => {
    setError(Object);
  };
  const [errorFlg, setErrorFlg] = React.useState(Object);
  const handleSetErrorFlg = (Object) => {
    setErrorFlg(Object);
  };
  // dialog
  const [open1, setOpen1] = React.useState(false);
  const [open3, setOpen3] = React.useState(false);
  const handleClose1 = () => {
    createArAddressFunction();
  };
  const handleClose4 = () => {
    updateArAddressFunction();
  };
  const handleClose3 = () => {
    setOpen3(false);
  };

  // dialog 項目 Start
  const [CustomerAccountGroup, setCustomerAccountGroup] = React.useState(Object);
  const txtChangedCustomerAccountGroup = (Object) => {
    setCustomerAccountGroup(Object);
  };
  const [HonorificTitleKeyDialog, setHonorificTitleKeyDialog] = React.useState(Object);
  const txtChangedHonorificTitleKeyDialog = (Object) => {
    setHonorificTitleKeyDialog(Object);
  };
  const [Name1Dialog, setName1Dialog] = React.useState(Object);
  const txtChangedName1Dialog = (Object) => {
    setName1Dialog(Object);
  };
  const [Name2Dialog, setName2Dialog] = React.useState(Object);
  const txtChangedName2Dialog = (Object) => {
    setName2Dialog(Object);
  };
  const [Name3Dialog, setName3Dialog] = React.useState(Object);
  const txtChangedName3Dialog = (Object) => {
    setName3Dialog(Object);
  };
  const [SearchTerm1Dialog, setSearchTerm1Dialog] = React.useState(Object);
  const txtChangedSearchTerm1Dialog = (Object) => {
    setSearchTerm1Dialog(Object);
  };
  const [PlaceNameDialog, setPlaceNameDialog] = React.useState(Object);
  const txtChangedPlaceNameDialog = (Object) => {
    setPlaceNameDialog(Object);
  };
  const [PostCodeDialog, setPostCodeDialog] = React.useState(Object);
  const txtChangedPostCodeDialog = (Object) => {
    setPostCodeDialog(Object);
  };

  const [CountryCodeDialog, setCountryCodeDialog] = React.useState(Object);
  const txtChangedCountryCodeDialog = (Object) => {
    setCountryCodeDialog(Object);
  };

  const [AreaDialog, setAreaDialog] = React.useState(Object);
  const txtChangedAreaDialog = (Object) => {
    setAreaDialog(Object);
  };

  const [LanguageCodeDialog, setLanguageCodeDialog] = React.useState(Object);
  const txtChangedLanguageCodeDialog = (Object) => {
    setLanguageCodeDialog(Object);
  };

  const [FirstPhoneNumberDialog, setFirstPhoneNumberDialog] = React.useState(Object);
  const txtChangedFirstPhoneNumberDialog = (Object) => {
    setFirstPhoneNumberDialog(Object);
  };
  // dialog 項目 END
  const defaultSorted = [{
    dataField: 'Status',
    order: 'asc'
  }];
  // dialog 項目 END
  const createArAddressFunction = async () => {

    if (CustomerAccountGroup === '') {
      handleSetErrorFlg(false);
      handleSetError("　※得意先勘定グループ を入力してください");
      return;
    }
    if (HonorificTitleKeyDialog === '') {
      handleSetErrorFlg(false);
      handleSetError("　※敬称キーを入力してください");
      return;
    }
    if (Name1Dialog === '') {
      handleSetErrorFlg(false);
      handleSetError("　※名称1を入力してください");
      return;
    }
    if (Name2Dialog === '') {
      handleSetErrorFlg(false);
      handleSetError("　※名称2を入力してください");
      return;
    }
    if (Name3Dialog === '') {
      handleSetErrorFlg(false);
      handleSetError("　※名称3を入力してください");
      return;
    }
    if (SearchTerm1Dialog === '') {
      handleSetErrorFlg(false);
      handleSetError("　※検索語句1を入力してください");
      return;
    }
    if (PlaceNameDialog === '') {
      handleSetErrorFlg(false);
      handleSetError("　※地名を入力してください");
      return;
    }
    if (PostCodeDialog === '') {
      handleSetErrorFlg(false);
      handleSetError("　※郵便番号を入力してください");
      return;
    }
    if (CountryCodeDialog === '') {
      handleSetErrorFlg(false);
      handleSetError("　※国コードを入力してください");
      return;
    }
    if (AreaDialog === '') {
      handleSetErrorFlg(false);
      handleSetError("　※地域を入力してください");
      return;
    }
    if (LanguageCodeDialog === '') {
      handleSetErrorFlg(false);
      handleSetError("　※言語コードを入力してください");
      return;
    }
    if (FirstPhoneNumberDialog === '') {
      handleSetErrorFlg(false);
      handleSetError("　※電話番号を入力してください");
      return;
    }
    let ArAzInfo = await API.graphql(graphqlOperation(getArAZCustomerCode,{id:'1'}));
    console.log("ArAzInfo",ArAzInfo)
    let codeNumber = ArAzInfo.data.getArAZCustomerCode['CustomerCodeNumber'];
    let initialCode = 'AZ00000001';
    initialCode = initialCode.slice(0,initialCode.length - codeNumber.toString().length) + codeNumber
    await API.graphql(graphqlOperation(createArCustomer, {
      input: {
        id: uuidv4(),
        CustomerCodeKey: agencyId,
        AccounKey: 'SH',
        CustomerCode: initialCode,
        CustomerAccountGroup: CustomerAccountGroup,
        HonorificTitleKey: HonorificTitleKeyDialog,
        Name1: Name1Dialog,
        Name2: Name2Dialog,
        Name3: Name3Dialog,
        SearchTerm1: SearchTerm1Dialog,
        PlaceName: PlaceNameDialog,
        PostCode: PostCodeDialog,
        CountryCode: CountryCodeDialog,
        Area: AreaDialog,
        LanguageCode: LanguageCodeDialog,
        FirstPhoneNumber: FirstPhoneNumberDialog
      }
    }));
    await API.graphql(graphqlOperation(arCustomerByAgencyID, { CustomerCodeKey: agencyId, filter: { AccounKey: { eq: "SH" } } }));
    handleSetError('');
    handleSetErrorFlg(true);
    setOpen1(false);
    getAddressList();
    getContractorList();
  };


  // dialog 項目 END
  const updateArAddressFunction = async () => {
    if (Name1Dialog === '') {
      handleSetErrorFlg(false);
      handleSetError("　※名称1を入力してください");
      return;
    }
    if (Name2Dialog === '') {
      handleSetErrorFlg(false);
      handleSetError("　※名称2を入力してください");
      return;
    }
    if (Name3Dialog === '') {
      handleSetErrorFlg(false);
      handleSetError("　※名称3を入力してください");
      return;
    }
    await API.graphql(graphqlOperation(updateArCustomer, {
      input: {
        id: addressId,
        CustomerCodeKey: agencyId,
        Name1: Name1Dialog,
        Name2: Name2Dialog,
        Name3: Name3Dialog
      }
    }));
    await API.graphql(graphqlOperation(arCustomerByAgencyID, { CustomerCodeKey: agencyId, filter: { AccounKey: { eq: "SH" } } }));
    handleSetError('');
    handleSetErrorFlg(true);
    setOpen3(false);
    getAddressList();
    getContractorList();
  };
  const getAddressList = async () => {
    let listAddressInfo = await API.graphql(graphqlOperation(arCustomerByAgencyID, { CustomerCodeKey: agencyId, filter: { AccounKey: { eq: "SH" } } }));
    const address = listAddressInfo.data.arCustomerByAgencyID['items'];
    setAddress(address);
  }
  const getContractorList = async () => {
    const ContractorList = await API.graphql(graphqlOperation(arCustomerByAgencyID, { CustomerCodeKey: agencyId, filter: { AccounKey: { eq: "SP" } } }));
    const address = ContractorList.data.arCustomerByAgencyID['items'];
    setContractor(address);
  }
  const editClick = (direct) => {

    setOpen3(true);
    handleSetError('');
    handleSetErrorFlg(true);
    handleSetTitle("出荷先編集");
    handleSetButtonText("更新");
    addressId = direct;
    for (let j = 0; j < addressList.length; j++) {
      if (addressList[j].id === direct) {
        txtChangedName1Dialog(addressList[j].Name1);
        txtChangedName2Dialog(addressList[j].Name2);
        txtChangedName3Dialog(addressList[j].Name3);
        break;
      }
    }
  };
  const editClick2 = (direct) => {

    setOpen3(true);
    handleSetError('');
    handleSetErrorFlg(true);
    handleSetTitle("受注先編集");
    handleSetButtonText("更新");
    addressId = direct;
    for (let j = 0; j < contractorList.length; j++) {
      if (contractorList[j].id === direct) {
        txtChangedName1Dialog(contractorList[j].Name1);
        txtChangedName2Dialog(contractorList[j].Name2);
        txtChangedName3Dialog(contractorList[j].Name3);
        break;
      }
    }
  };
  // const [msg1, setMsgId] = React.useState(Object);
  // const [open, setOpen] = React.useState(false);
  // const handleSetMsgId = (Object) => {
  //   setMsgId(Object);
  // };
  // const [msgText, setMsgText] = React.useState(Object);
  // const handleSetMsgText = (Object) => {
  //   setMsgText(Object);
  // };
  // const [msgbtnOK, setMsgBtnOK] = React.useState(Object);
  // const handleSetMsgBtnOK = (Object) => {
  //   setMsgBtnOK(Object);
  // };
  // const [msgbtnNG, setMsgBtnNG] = React.useState(Object);
  // const handleSetMsgBtnNG = (Object) => {
  //   setMsgBtnNG(Object);
  // };
  // const handleCloseNG = () => {
  //   setOpen(false);
  // };
  // const handleCloseOK = () => {
  //   deleteArAddressFunction();
  //   setOpen(false);
  // };
  // const handleClickOpen = () => {
  //   setOpen(true);
  // };
  // function handleDeleteClick(direct) {
  //   addressId = direct;
  //   handleSetMsgId("削除確認");
  //   handleSetMsgText("本当に削除しましたか");
  //   handleSetMsgBtnOK("はい");
  //   handleSetMsgBtnNG("いいえ");
  //   handleClickOpen();
  // }
  // const deleteArAddressFunction = async () => {
  //   await API.graphql(graphqlOperation(deleteArAddress, { input: { id: addressId, Agency_id: agencyId } }));
  //   getAddressList();
  // }

  //ファイルを書込み
  function outFile() {
    function getSpaceStr(count) {
      let result = '';
      for (let index = 0; index < count; index++) {
        result += '\t';
      }
      return result
    }
    for(let item in addressList){
     for(let info in addressList[item]){
      if(addressList[item][info] === null){
        console.log("info",addressList[item][info])
        addressList[item][info] = '';
      }
     }
    }

    // 受注アップロード連携ファイルフォーマット(取込用/結果用 共用)
    let str = '';
    str +=
      'ステータス' + "\t" +
      '得意先コード ' + "\t" +
      '得意先勘定グループ ' + "\t" +
      '敬称キー' + "\t" +
      '名称 1' + "\t" +
      '名称 2' + "\t" +
      '名称 3' + "\t" +
      '名称 4' + "\t" +
      '検索語句 1' + "\t" +
      '検索語句 2' + "\t" +
      '建物 (番号またはコード)' + "\t" +
      '部屋/アパート番号' + "\t" +
      '建物の階 ' + "\t" +
      '気付 ' + "\t" +
      '地名 2' + "\t" +
      '地名 3' + "\t" +
      '地名 ' + "\t" +
      '番地-号' + "\t" +
      '番地-号の補足' + "\t" +
      '地名 4' + "\t" +
      '地名 5' + "\t" +
      '所在地' + "\t" +
      '市区町村 (郵便用市区町村と異なる場合)' + "\t" +
      '市区町村の郵便番号' + "\t" +
      '市区町村 ' + "\t" +
      '国コード ' + "\t" +
      '地域 (都道府県)' + "\t" +
      'アドレスタイムゾーン' + "\t" +
      '税管轄 ' + "\t" +
      '商品の納入区域 ' + "\t" +
      '地域構造グループ化' + "\t" +
      '地名住所配達不可フラグ' + "\t" +
      '私書箱' + "\t" +
      'フラグ: 番号のない私書箱' + "\t" +
      '郵便サービスのタイプ ' + "\t" +
      '郵便サービス番号' + "\t" +
      '私書箱郵便局' + "\t" +
      '私書箱/郵便番号' + "\t" +
      '私書箱住所' + "\t" +
      '私書箱の国指定 ' + "\t" +
      '私書箱の地域 (国、都道府県、地域、...)' + "\t" +
      '会社郵便番号 (大規模なユーザ用)' + "\t" +
      '私書箱住所配達不可フラグ' + "\t" +
      '言語コード ' + "\t" +
      '第一電話番号: ダイヤルコード + 番号' + "\t" +
      '第 1 電話番号: 内線 ' + "\t" +
      '最初の携帯電話番号: 局番 + 番号' + "\t" +
      '第一 FAX 番号: ダイヤルコード + 番号' + "\t" +
      '第一 FAX 番号: 内線 ' + "\t" +
      '電子メールアドレス' + "\t" +
      '通信方法 (キー) (ビジネスアドレスサービス)' + "\t" +
      '拡張子 (データ変換専用) (例: データ行)' + "\t" +
      '拡張子 (データ変換専用) (例: テレボックス)' + "\t" +
      '住所注記 ' + "\t" +
      '仕入先または債権者の勘定コード ' + "\t" +
      '権限グループ ' + "\t" +
      '取引先の会社 ID' + "\t" +
      'グループキー' + "\t" +
      '国際企業コード (パート１)' + "\t" +
      '国際企業コード (ILN) - パート 2' + "\t" +
      '国際企業コードのチェックディジット' + "\t" +
      '産業分類 ' + "\t" +
      '通常納入使用駅 ' + "\t" +
      '緊急出荷使用駅 ' + "\t" +
      '場所コード ' + "\t" +
      '税番号 1' + "\t" +
      'フラグ: 平等税対象の取引先' + "\t" +
      '税番号 2' + "\t" +
      '個人' + "\t" +
      '消費税課税対象' + "\t" +
      '本社住所を持つマスタの勘定コード ' + "\t" +
      '地域コード ' + "\t" +
      '消費税登録番号 (VAT)' + "\t" +
      '市区町村コード ' + "\t" +
      '税番号 5' + "\t" +
      '代表者氏名' + "\t" +
      '事業のタイプ ' + "\t" +
      '産業タイプ ' + "\t" +
      '代理支払人の勘定コード ' + "\t" +
      'DME 用のレポートキー' + "\t" +
      '銀行手数料負担コード ' + "\t" +
      'フラグ: 伝票に代理支払人の入力可能' + "\t" +
      '銀行国コード ' + "\t" +
      '銀行コード ' + "\t" +
      '口座番号' + "\t" +
      '口座名義人名 ' + "\t" +
      '預金種別' + "\t" +
      'パートナ銀行タイプ ' + "\t" +
      '振込先銀行情報の参照詳細' + "\t" +
      'フラグ: 回収権限 ' + "\t" +
      'ニ－ルセン区分 ' + "\t" +
      '地域市場' + "\t" +
      '得意先分類 ' + "\t" +
      '階層への割当 ' + "\t" +
      '産業コード 1' + "\t" +
      '年間売上高 ' + "\t" +
      '販売通貨' + "\t" +
      '販売年度' + "\t" +
      '年間従業員数' + "\t" +
      '従業員数が登録されている年度' + "\t" +
      '会計年度バリアント ' + "\t" +
      '法的ステータス' + "\t" +
      '荷渡ポイント ' + "\t" +
      '荷渡ポイント初期値' + "\t" +
      '得意先稼働日カレンダ' + "\t" +
      '区分: 軍事以外の用途 ' + "\t" +
      '区分: 主に軍事目的 ' + "\t" +
      '区分: 生化学兵器 - 法令管理 ' + "\t" +
      '区分: 核拡散防止 - 法令管理 ' + "\t" +
      '区分: 国家安全保障 - 法令管理 ' + "\t" +
      '区分: ミサイル技術 - 法令管理 ' + "\t" +
      '輸出管理: 得意先マスタの国キー' + "\t" +
      '輸出管理の前回 TDO 一覧確認日' + "\t" +
      '区分: 輸出管理 - ボイコットリスト (TDO)' + "\t" +
      '輸出管理: SDN 一覧最終チェック日付 ' + "\t" +
      '区分: 輸出管理 - ボイコットリスト (SDN)' + "\t" +
      '輸出管理 - 内部ボイコットリストの最終確認日付' + "\t" +
      '区分: 輸出管理 - 得意先ボイコットリスト ' + "\t" +
      '名称 1' + "\t" +
      '名前' + "\t" +
      '取引先担当者の部門' + "\t" +
      '取引先担当者機能' + "\t" +
      '共通転記ブロック' + "\t" +
      '得意先受注ブロック (共通)' + "\t" +
      '得意先の共通出荷ブロック' + "\t" +
      '得意先に共通の請求ブロック' + "\t" +
      '得意先に対する会計共通販売ブロック' + "\t" +
      'マスタレコード削除フラグ (共通)' + "\t" +
      'マスタレコードの共通削除ブロック' + "\t" +
      '属性 1' + "\t" +
      '属性 2' + "\t" +
      '属性 3' + "\t" +
      '属性 4' + "\t" +
      '属性 5' + "\t" +
      '属性 6' + "\t" +
      '属性 7' + "\t" +
      '属性 8' + "\t" +
      '属性 9' + "\t" +
      '属性 10' + "\t" +
      '得意先条件グループ１ ' + "\t" +
      '得意先条件グループ２ ' + "\t" +
      '得意先条件グループ３ ' + "\t" +
      '得意先条件グループ４ ' + "\t" +
      '得意先条件グループ５ ' + "\t" +
      '区分: 競合他社' + "\t" +
      '区分: 販売取引先' + "\t" +
      '区分: 販売見込' + "\t" +
      'ID: 受注先 (デフォルト)' + "\t" +
      'キストシンボル用テキスト入力項目' + "\t" +
      'キストシンボル用テキスト入力項目' + "\t" +
      'オブジェクト転送時の実行メソッド' + "\t" +
      '最終結果処理のステータスアイコン' + "\t" +
      'ソリューションマップ: 内容説明 (外部)' + "\t" +
      '相殺区分 ' + "\t" +
      '取引区分 ' + "\t" +
      '名称（英語） ' + "\t" +
      '地域（英語） ';
    // データ
    for (let index = 0; index < addressList.length; index++) {
      str += '\n' +
      getSpaceStr(1) +
      addressList[index].CustomerCode + "\t" +
      addressList[index].CustomerAccountGroup + "\t" +
      addressList[index].HonorificTitleKey + "\t" +
      addressList[index].Name1 + "\t" +
      addressList[index].Name2 + "\t" +
      addressList[index].Name3 + "\t" +
      getSpaceStr(1) +
      addressList[index].SearchTerm1 + "\t" +
      getSpaceStr(7) +
      addressList[index].PlaceName + "\t" +
      getSpaceStr(6) +
      addressList[index].PostCode + "\t" +
      getSpaceStr(1) +
      addressList[index].CountryCode + "\t" +
      addressList[index].Area + "\t" +
      getSpaceStr(16) +
      addressList[index].LanguageCode + "\t" +
      addressList[index].FirstPhoneNumber + "\t" +
      getSpaceStr(9) +
      addressList[index].AccountingCode + "\t" +
      getSpaceStr(3) +
      addressList[index].InternationalPart1 + "\t" +
      addressList[index].InternationalPart2 + "\t" +
      addressList[index].InternationalCheckDigit + "\t" +
      getSpaceStr(32) +
      addressList[index].AllocationTohierarchy + "\t" +
      getSpaceStr(1) +
      addressList[index].AnnualSales + "\t" +
      getSpaceStr(1) +
      addressList[index].SalesYear + "\t" +
      addressList[index].NumberOfEmployees + "\t" +
      addressList[index].Registrationyear + "\t" +
      getSpaceStr(5) +
      addressList[index].NonMilitaryUse + "\t" +
      getSpaceStr(6) +
      addressList[index].ExportControlTDODate + "\t" +
      getSpaceStr(1) +
      addressList[index].ExportControlSDNCheckDate + "\t" +
      getSpaceStr(1) +
      addressList[index].ExportControlListConfirmationDate + "\t" +
      getSpaceStr(38) +
      addressList[index].TransactionClassification + "\t" +
      getSpaceStr(1);
    }
    console.log(addressList)
    // エンコード
    str.replace(/\s+/g, '');
    let exportContent = "\uFEFF";
    let blob = new Blob([exportContent + str], {
      type: "text/plain;charset=utf-8"
    });
    // ファイルを作成
    FileSaver.saveAs(blob, "出荷先データ.TXT");
  }
  const headerStyle = { backgroundColor: '#D3D3D3' }
  let columns1 = [
    { dataField: 'id', text: 'ID', hidden: true, },
    { dataField: 'CustomerCode', text: '出荷先コード', headerStyle },
    { dataField: 'CustomerAccountGroup', text: '出荷先勘定グループ', headerStyle },
    { dataField: 'Name1', text: '名称', headerStyle },
    { dataField: 'PlaceName', text: '地名', headerStyle },
    { dataField: 'PostCode', text: '郵便番号', headerStyle },
    { dataField: 'CountryCode', text: '国コード', headerStyle },
    { dataField: 'Area', text: '地域 (都道府県)', headerStyle },
    { dataField: 'FirstPhoneNumber', text: '電話番号', headerStyle },
    {
      dataField: 'edit', text: '操作', headerStyle, formatter: (cellContent, row) => {
        return (
          <span>
            <div>
              <Button variant="contained" color="primary" onClick={() => { editClick(row.id); }}>
                編集
              </Button>
              {/* <Button variant="contained" color="secondary" onClick={() => { handleDeleteClick(row.id); }}>
                削除
              </Button> */}
            </div></span>
        );
      }
    },
    { dataField: 'updatedAt', text: '更新日', hidden: true },
  ];
  let columns2 = [
    { dataField: 'id', text: 'ID', hidden: true, },
    { dataField: 'CustomerCode', text: '受注先コード', headerStyle },
    { dataField: 'CustomerAccountGroup', text: '受注先勘定グループ', headerStyle },
    { dataField: 'Name1', text: '名称', headerStyle },
    { dataField: 'PlaceName', text: '地名', headerStyle },
    { dataField: 'PostCode', text: '郵便番号', headerStyle },
    { dataField: 'CountryCode', text: '国コード', headerStyle },
    { dataField: 'Area', text: '地域 (都道府県)', headerStyle },
    { dataField: 'FirstPhoneNumber', text: '電話番号', headerStyle },
    {
      dataField: 'edit', text: '操作', headerStyle, formatter: (cellContent, row) => {
        return (
          <span>
            <div>
              <Button variant="contained" color="primary" onClick={() => { editClick2(row.id); }}>
                編集
              </Button>
              {/* <Button variant="contained" color="secondary" onClick={() => { handleDeleteClick(row.id); }}>
                削除
              </Button> */}
            </div></span>
        );
      }
    },
    { dataField: 'updatedAt', text: '更新日', hidden: true },
  ];
  // dialog 項目 END
  const pageTitle = '代理店情報｜ARB-SIP（在庫・価格照会システム）'

  return (
    <Container style={{ backgroundColor: '', 'minWidth': '85vw', 'minHeight': '74vh' }}>
      <Grid>
        <Grid>
          <Row style={{
            borderRadius: '0.25em',
            color: 'purple',
            //textAlign: 'center',
            padding: '0.5em'
          }}>
            <Col align="center"><h3>登録情報</h3> </Col>
          </Row>
        </Grid>
        <Grid>
          <Meta title={pageTitle} />
          {agentGroupID.Agent.length > 0 ?
            agentGroupID.Agent.map((email) =>
              <LoginAgent
                key={email.Agency_Email}
                Agency_Name={email.Agency_Name}
                CompanyName={email.Company_Name}
                AgencyID={email.Agency_id}
                SubID={email.SubId}
              // AgencyPG={email.Agency_Price_Group}
              // Mail={email.Agency_Group}
              />
            ) :
            <p>loading...!</p>
          }
        </Grid>
      </Grid>
      <Grid>
        <Grid>
          <Row style={{
            borderRadius: '0.25em',
            color: 'purple',
            //textAlign: 'center',
            padding: '0.5em'
          }}>
            <Col>
              <h3>
                出荷先管理
              </h3>
            </Col>
            <Col align="right" >
              <Button style={{ width: '10%', marginRight:'10px' }} variant="contained" size='medium'color="primary" onClick={() => { outFile(); }}>書出</Button>
              <Button variant="outlined" onClick={() => { addClick('add') }}><AddIcon />Add New Address</Button>
            </Col>
          </Row>
        </Grid>
        <Grid>
          <BootstrapTable
            bootstrap4
            keyField="id"
            data={addressList}
            columns={columns1}
            noDataIndication={'no results found'}
            defaultSorted={defaultSorted}
            pagination={paginationFactory(options)}
          />
        </Grid>
      </Grid>
      <Grid>
        <Grid>
          <Row style={{
            borderRadius: '0.25em',
            color: 'purple',
            //textAlign: 'center',
            padding: '0.5em'
          }}>
            <Col>
              <h3>
                受注先管理
              </h3>
            </Col>
            {/* <Col align="right" ><Button variant="outlined" onClick={() => { addClick('add') }}><AddIcon />Add New Address</Button>
            </Col> */}
          </Row>
        </Grid>
        <Grid>
          <BootstrapTable
            bootstrap4
            keyField="id"
            data={contractorList}
            columns={columns2}
            noDataIndication={'no results found'}
            defaultSorted={defaultSorted}
            pagination={paginationFactory(options)}
          />
        </Grid>
      </Grid>
      <Dialog
        open={open1}
        onClose={handleClose1}
        fullWidth="md"
        disableEscapeKeyDown="true"
        disableBackdropClick="true"
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <div hidden={errorFlg} >
            <span style={{ color: 'red' }}>{error}</span>
          </div>
          <InputGroup className="mb-3">
            <InputGroup.Text className={classes.textField} id="basic-name">得意先勘定グループ</InputGroup.Text>
            <FormControl
              placeholder=""
              aria-label=" "
              aria-describedby="basic-name"
              id="CustomerAccountGroup"
              className={classes.textField}
              value={CustomerAccountGroup}
              onChange={(e) => { txtChangedCustomerAccountGroup(e.target.value) }}
              maxLength="4"
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text className={classes.textField} id="basic-name">敬称キー</InputGroup.Text>
            <FormControl
              placeholder=""
              aria-label=""
              aria-describedby="basic-name"
              id="HonorificTitleKeyDialog"
              className={classes.textField}
              value={HonorificTitleKeyDialog}
              onChange={(e) => { txtChangedHonorificTitleKeyDialog(e.target.value) }}
              maxLength="4"
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text className={classes.textField} id="basic-name">名称1</InputGroup.Text>
            <FormControl
              placeholder=""
              aria-label=""
              aria-describedby="basic-name"
              id="Name1Dialog"
              className={classes.textField}
              value={Name1Dialog}
              onChange={(e) => { txtChangedName1Dialog(e.target.value) }}
              maxLength="40"
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text className={classes.textField} id="basic-name">名称2</InputGroup.Text>
            <FormControl
              placeholder=""
              aria-label=""
              aria-describedby="basic-name"
              id="Name2Dialog"
              className={classes.textField}
              value={Name2Dialog}
              onChange={(e) => { txtChangedName2Dialog(e.target.value) }}
              maxLength="40"
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text className={classes.textField} id="basic-name">名称3</InputGroup.Text>
            <FormControl
              placeholder=""
              aria-label=""
              aria-describedby="basic-name"
              id="Name3Dialog"
              className={classes.textField}
              value={Name3Dialog}
              onChange={(e) => { txtChangedName3Dialog(e.target.value) }}
              maxLength="40"
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text className={classes.textField} id="basic-name">検索語句1</InputGroup.Text>
            <FormControl
              placeholder=""
              aria-label=""
              aria-describedby="basic-name"
              id="SearchTerm1Dialog"
              className={classes.textField}
              value={SearchTerm1Dialog}
              onChange={(e) => { txtChangedSearchTerm1Dialog(e.target.value) }}
              maxLength="20"
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text className={classes.textField} id="basic-name">地名</InputGroup.Text>
            <FormControl
              placeholder=""
              aria-label=""
              aria-describedby="basic-name"
              id="PlaceNameDialog"
              className={classes.textField}
              value={PlaceNameDialog}
              onChange={(e) => { txtChangedPlaceNameDialog(e.target.value) }}
              maxLength="60"
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text className={classes.textField} id="basic-name">市区町村の郵便番号</InputGroup.Text>
            <FormControl
              placeholder=""
              aria-label=""
              aria-describedby="basic-name"
              id="PostCodeDialog"
              className={classes.textField}
              value={PostCodeDialog}
              onChange={(e) => { txtChangedPostCodeDialog(e.target.value) }}
              maxLength="10"
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text className={classes.textField} id="basic-name">国コード</InputGroup.Text>
            <FormControl
              placeholder=""
              aria-label=""
              aria-describedby="basic-name"
              id="CountryCodeDialog"
              className={classes.textField}
              value={CountryCodeDialog}
              onChange={(e) => { txtChangedCountryCodeDialog(e.target.value) }}
              maxLength="3"
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text className={classes.textField} id="basic-name">地域 (都道府県)</InputGroup.Text>
            <FormControl
              placeholder=""
              aria-label=""
              aria-describedby="basic-name"
              id="AreaDialog"
              className={classes.textField}
              value={13}
              readOnly={true}
              onChange={(e) => { txtChangedAreaDialog(e.target.value) }}
              maxLength="20"
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text className={classes.textField} id="basic-name">言語コード</InputGroup.Text>
            <FormControl
              placeholder=""
              aria-label=""
              aria-describedby="basic-name"
              id="LanguageCodeDialog"
              className={classes.textField}
              value={LanguageCodeDialog}
              onChange={(e) => { txtChangedLanguageCodeDialog(e.target.value) }}
              maxLength="1"
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text className={classes.textField} id="basic-name">電話番号</InputGroup.Text>
            <FormControl
              placeholder=""
              aria-label=""
              aria-describedby="basic-name"
              id="FirstPhoneNumberDialog"
              className={classes.textField}
              value={FirstPhoneNumberDialog}
              onChange={(e) => { txtChangedFirstPhoneNumberDialog(e.target.value) }}
              maxLength="30"
            />
          </InputGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose1} variant="contained" color="primary" autoFocus>{buttonText}</Button>
          <Button onClick={handleClose2} variant="contained" color="primary">キャンセル</Button>
        </DialogActions>
      </Dialog>
      {/* <Dialog
        open={open}
        onClose={handleCloseNG}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{msg1}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {msgText}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseOK} color="primary" autoFocus>
            {msgbtnOK}
          </Button>
          <Button onClick={handleCloseNG} color="primary" autoFocus>
            {msgbtnNG}
          </Button>
        </DialogActions>
      </Dialog> */}
      <Dialog
        open={open3}
        onClose={handleClose1}
        fullWidth="md"
        disableEscapeKeyDown="true"
        disableBackdropClick="true"
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <div hidden={errorFlg} >
            <span style={{ color: 'red' }}>{error}</span>
          </div>
          <InputGroup className="mb-3">
            <InputGroup.Text className={classes.textField} id="basic-name">名称1</InputGroup.Text>
            <FormControl
              placeholder=""
              aria-label=""
              aria-describedby="basic-name"
              id="Name1Dialog"
              className={classes.textFieldNm}
              value={Name1Dialog}
              onChange={(e) => { txtChangedName1Dialog(e.target.value) }}
              maxLength="40"
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text className={classes.textField} id="basic-name">名称2</InputGroup.Text>
            <FormControl
              placeholder=""
              aria-label=""
              aria-describedby="basic-name"
              id="Name2Dialog"
              className={classes.textFieldNm}
              value={Name2Dialog}
              onChange={(e) => { txtChangedName2Dialog(e.target.value) }}
              maxLength="40"
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text className={classes.textField} id="basic-name">名称3</InputGroup.Text>
            <FormControl
              placeholder=""
              aria-label=""
              aria-describedby="basic-name"
              id="Name3Dialog"
              className={classes.textFieldNm}
              value={Name3Dialog}
              onChange={(e) => { txtChangedName3Dialog(e.target.value) }}
              maxLength="40"
            />
          </InputGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose4} variant="contained" color="primary" autoFocus>{buttonText}</Button>
          <Button onClick={handleClose3} variant="contained" color="primary">キャンセル</Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default Agent