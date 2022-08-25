/* ar-brown App (C) 2021 arbrown.co.jp All rights reserved.
 *******************************************************************************
 * Program ID:  Home.js
 * $Revision:   Ver1.0
 * $Modtime:    $
 *******************************************************************************
 * Author      (作成／更新年月日、担当者)
 *  2021/08/01 Rayoo)li : 新規作成
 *
 * Summary Home画面
 *
 * Instructions / Preconditions
 *  なし
 *
 *******************************************************************************
 */

import userAuth from '../components/userAuth'
import Meta from '../components/Meta'
// import * as React from 'react';
/* コンテナ（画面レイアウト）デザイン */
import { Container, Row, Col, InputGroup, FormControl } from 'react-bootstrap'
import Button from '@material-ui/core/Button';
import BootstrapTable from 'react-bootstrap-table-next';

import { Download } from 'react-bootstrap-icons';
// Form
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
// Resolvers
import { graphqlOperation } from '@aws-amplify/api';
import { API, Storage } from 'aws-amplify';
import Amplify from 'aws-amplify';
// import React, { useEffect, useReducer, useState, useRef } from 'react';
import React, { useEffect, useState } from 'react';
import { listArCampaigns } from '../graphql/queries';
// import { listArAttentions, listArCampaigns } from '../graphql/queries';
//import ToggleButton from '@material-ui/lab/ToggleButton';
// import ButtonGroup from '@material-ui/core/ButtonGroup';
// import { updateArAttention } from '../graphql/mutations';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { updateArCampaign } from '../graphql/mutations';
import { createArCampaign, deleteArCampaign } from '../graphql/mutations';
import config from '../aws-exports';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

// From
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  button: {
    '& > *': {
      margin: theme.spacing(2),
    },
    //padding: '50px 0px 50px 0px',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '30ch',
  },
  input: {
    // display: 'none',
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '100ch',

  },
  notice: {
    // 'padding-top': '0.75em',
    'padding-bottom': '0.5em',
    borderRadius: '0.25em',
    textAlign: 'center',
    'text-align': 'center',
    color: 'purple',
    border: '1px solid purple',
    padding: '0.5em',
    'fontSize': '1.5rem',
    'font-weight': 500,
    'lineHeight': '1.2',
    'margin-top': '0.5em',
    'margin-bottom': '0.5rem',
    width: '100%'
  }
}));
// const theme = createMuiTheme(
//   { palette: { primary: { main: '#1976d2' }, }, },
//   jaJP,
// );

// const QUERY = 'QUERY';
// const SET = 'SET';
// const initialInventoryState = { Title: "", Discription: "", Notification: "" };
// const reducer2 = (state, action) => {
//   switch (action.type) {
//     case QUERY:
//       return { ...state, ...action.invs };
//     case SET:
//       return { ...state, ...action.invs };
//     default:
//       return state;
//   }
// };

Amplify.configure({
  Storage: {
    AWSS3: {
      bucket: 'arbrownpdffile91116-dev', //REQUIRED -  Amazon S3 bucket name
      region: 'ap-northeast-1', //OPTIONAL -  Amazon service region
    }
  }
});

const columns = [
  { dataField: 'id', text: 'ID', hidden: true, sort: true },
  { dataField: 'Title', text: '名称', sort: true },
  { dataField: 'Term_From', text: '開始', sort: true, format: 'yyyy/mm/dd' },
  { dataField: 'Term_To', text: '終了', sort: true, format: 'yyyy/mm/dd' },
  { dataField: 'Wholes_Rate_Condision', text: '仕切率', sort: true, hidden: true },
  { dataField: 'Text', text: '内容', sort: true },
  {
    dataField: 'pdf',
    isDummyField: true,
    text: 'DL',
    formatter: (cellContent, row) => {
      if (row.filePDF) {
        return (
          <div>
            <a href={row.PDFurl} target="_blank" rel="noreferrer"><Download color="royalblue" size={20} /></a>
          </div>
        );
      }
    }
  },
  { dataField: 'filePDF', text: 'PDF', align: 'right', sort: true, hidden: true },
];
// 日本語ファイル名のURL記述方法
// Content-Disposition: attachment; filename*=UTF-8''[UTF-8のファイル名をURLエンコードしたもの]
// S3 Api referenc : response-content-language
// Sets the Content-Language header of the response.


// Ezpand row data
// Textのパターンを複数記述しよう！
// Text_h3_1, Text_h3_2, Text_h4_1, Text_h4_2, Text_h5_1, Text_h5_2, Text_h6_1, Text_h6_2
// 常時表示の際はExpand Managment にて記述要
// const expandRow = () => {
//   row => (
//     <div>
//       <h3>{`【${row.Title}】`}</h3>
//       <h3>{`${row.Text_h3_1}`}</h3>
//       <h4>{`${row.Text_h4_1}`}</h4>
//       <h5>{`${row.Text_h5_1}`}</h5>
//       <h6>{`キャンペーン詳細: ${row.Text_h6_1}`}</h6>
//       <div>{`${row.Text}`}</div>
//     </div>
//   )
// };


const CaptionElement = () =>
  <h4
    style={{
      borderRadius: '0.25em',
      textAlign: 'center',
      color: 'purple',
      border: '1px solid purple',
      padding: '0.5em'
    }}>
    お知らせ／キャンペーン
  </h4>;
let select_row = [];
const Home = () => {
  // class Home extends React.Component {
  // page content
  const pageTitle = 'お知らせ・キャンペーン情報｜ARB-SIP（在庫・価格照会システム）'
  const classes = useStyles();
  // const [inventories, setInv] = useReducer(reducer2, initialInventoryState);
  const [campaign, setCampaign] = useState([]);
  useEffect(() => {
    // 非同期型（async）で在庫情報をagencyGroupInvListからAgency_Price_GroupをKeyに取得
    // 1) Auth.currentUserInfo() から、email情報を取得して、customerByeMailからeMailをKeyにAgent情報を取得
    //  ※ agencyGroupIDはAgent.jsで一度取得しているから再利用可能なはず！
    // 2) agencyGroupIDを取得して、これをKeyにagencyGroupInvListから在庫情報を取得
    fetchPDFs();
  }, []);

  async function fetchPDFs() {
    const userAuths = await userAuth();
    handleSetLoaddisabledflg(true);
    if (userAuths === '1') {
      handleSetAuthFlg(true);
    } else {
      handleSetAuthFlg(false);
    }
    // const Attentions = await API.graphql(graphqlOperation(listArAttentions));
    // setInv({ type: QUERY, invs: Attentions.data.listArAttentions.items[0] });

    const apiData = await API.graphql({ query: listArCampaigns });
    const CampaignFromAPI = apiData.data.listArCampaigns.items;
    await Promise.all(CampaignFromAPI.map(async campaign => {

      if (campaign.filePDF) {
        const pdfurl = await Storage.get(campaign.filePDF);
        campaign.PDFurl = pdfurl;

        await API.graphql({ query: updateArCampaign, variables: { input: campaign } });
      }
      campaign.Term_From = moment(campaign.Term_From).utcOffset(0).format('YYYY-MM-DD HH:mm:ss');
      campaign.Term_To = moment(campaign.Term_To).utcOffset(0).format('YYYY-MM-DD HH:mm:ss');
      return campaign;
    }))
    setCampaign(apiData.data.listArCampaigns.items);
    handleSetLoaddisabledflg(false);
    select_row = [];
  }
  async function fetchPDFsNoclear() {
    handleSetLoaddisabledflg(true);
    const apiData = await API.graphql({ query: listArCampaigns });
    const CampaignFromAPI = apiData.data.listArCampaigns.items;
    await Promise.all(CampaignFromAPI.map(async campaign => {

      if (campaign.filePDF) {
        const pdfurl = await Storage.get(campaign.filePDF);
        campaign.PDFurl = pdfurl;

        await API.graphql({ query: updateArCampaign, variables: { input: campaign } });
      }
      campaign.Term_From = moment(campaign.Term_From).utcOffset(0).format('YYYY-MM-DD HH:mm:ss');
      campaign.Term_To = moment(campaign.Term_To).utcOffset(0).format('YYYY-MM-DD HH:mm:ss');
      return campaign;
    }))
    setCampaign(apiData.data.listArCampaigns.items);
    handleSetLoaddisabledflg(false);
  }
  // const loginGroup = useRef(null);
  // useEffect(() => {
  //   // 1) Auth.currentSession() から、Cogniteのユーザグループ情報を取得
  //   async function getLoginGroup() {
  //     // get the Login User Group from the top of the cognito groups list
  //     const { accessToken } = await Auth.currentSession();
  //     const cognitogroups = accessToken.payload['cognito:groups'];
  //     loginGroup.current = cognitogroups[0];
  //   }
  //   getLoginGroup();
  // }, []);

  function addClick() {
    handleClickOpen1();
    handleSetNameText('');
    handleSetError('');
    handleSetErrorFlg(true);
    let format = "";
    let nTime = new Date();
    format += nTime.getFullYear() + "-";
    format += (nTime.getMonth() + 1) < 10 ? "0" + (nTime.getMonth() + 1) : (nTime.getMonth() + 1);
    format += "-";
    format += nTime.getDate() < 10 ? "0" + (nTime.getDate()) : (nTime.getDate());
    format += "T";
    format += nTime.getHours() < 10 ? "0" + (nTime.getHours()) : (nTime.getHours());
    format += ":";
    format += nTime.getMinutes() < 10 ? "0" + (nTime.getMinutes()) : (nTime.getMinutes());
    format += "";
    handleSetDisabled(false);
    handleSetTerm_From(format);
    handleSetTerm_To(format);
    //handleSetDL('');
    handleSetText('');
    handleSetOperflg(1);

  }
  const selectRow = {
    mode: 'checkbox',
    clickToSelect: true,
    bgColor: '#87CEFA',
    onSelect: (row, isSelect, rowIndex) => {
      if (isSelect) {
        select_row.push(rowIndex);
      } else {
        let find = select_row.findIndex(function (item) {
          return item === rowIndex
        })
        select_row.splice(find, 1);
      }
    },
    onSelectAll: (isSelect) => {
      if (isSelect) {
        for (let i = 0; i < campaign.length; i++) {
          select_row.push(i);
        }
      } else {
        select_row = [];
      }
    }
  };
  function searchClick() {

    if (select_row === '' || select_row.length !== 1) {

      handleSetMsgId("警告");
      handleSetMsgText("データを一つだけ選択してください");
      handleSetMsgBtnOK("はい");
      handleClickOpen2();
      return;
    }
    setOpen1(true);
    handleSetDisabled(true);
    handleSetError('');
    handleSetErrorFlg(true);
    let index = select_row[0];
    let Term_From = "";
    Term_From = campaign[index].Term_From.replace(' ', 'T');
    let Term_To = "";
    Term_To = campaign[index].Term_To.replace(' ', 'T');
    handleSetNameText(campaign[index].Title)
    handleSetTerm_From(Term_From)
    handleSetTerm_To(Term_To)
    //handleSetDL(campaign[index].Wholes_Rate_Condision)
    handleSetText(campaign[index].Text)
    handleSetOperflg(2);

  }
  function addupdateClick() {

    if (select_row.length !== 1) {
      handleSetMsgId("更新警告");
      handleSetMsgText("データを一つだけ選択してください");
      handleSetMsgBtnOK("はい");
      handleClickOpen2();
      return;
    }
    setOpen1(true);
    handleSetDisabled(false);
    handleSetError('');
    handleSetErrorFlg(true);
    let index = select_row[0];
    let Term_From = "";
    Term_From = campaign[index].Term_From.replace(' ', 'T');
    let Term_To = "";
    Term_To = campaign[index].Term_To.replace(' ', 'T');
    handleSetNameText(campaign[index].Title)
    handleSetTerm_From(Term_From)
    handleSetTerm_To(Term_To)
    //handleSetDL(campaign[index].Wholes_Rate_Condision)
    handleSetText(campaign[index].Text)
    handleSetOperflg(2);
  }

  // function arAttentionsClick() {
  //   let vid = inventories.id;
  //   let vtitile = inventories.Title
  //   let vNotification = inventories.Notification;
  //   let vDiscription = inventories.Discription;
  //   API.graphql(graphqlOperation(updateArAttention, { input: { id: vid, Title: vtitile, Notification: vNotification, Discription: vDiscription } }));

  // }

  const [nameText, setNameText] = React.useState(Object);
  const handleSetNameText = (Object) => {
    setNameText(Object);
  };

  const [loaddisabledflg, setLoaddisabledflg] = React.useState(Object);
  const handleSetLoaddisabledflg = (Object) => {
    setLoaddisabledflg(Object);
  };
  const [authFlg, setAuthFlg] = React.useState(Object);
  const handleSetAuthFlg = (Object) => {
    setAuthFlg(Object);
  };

  const [disabledflg, setDisabled] = React.useState(Object);
  const handleSetDisabled = (Object) => {
    setDisabled(Object);
  };

  function txtChangedText(e) {
    handleSetNameText(e.target.value)
  }
  const [Term_FromText, setTerm_From] = React.useState(Object);
  const handleSetTerm_From = (Object) => {
    setTerm_From(Object);
  };
  function txtChangedTerm_From(e) {
    handleSetTerm_From(e.target.value)
  }
  const [Term_ToText, setTerm_To] = React.useState(Object);
  const handleSetTerm_To = (Object) => {
    setTerm_To(Object);
  };
  function txtChangedTerm_To(e) {
    handleSetTerm_To(e.target.value)
  }
  // const [DLText, setDL] = React.useState(Object);
  // const handleSetDL = (Object) => {
  //   setDL(Object);
  // };
  // function txtChangedDL(e) {
  //   handleSetDL(e.target.value)
  // }

  const [texttext, setText] = React.useState(Object);
  const handleSetText = (Object) => {
    setText(Object);
  };
  function txtChangedtext2(e) {
    handleSetText(e.target.value)
  }
  const [operflg, setOperflg] = React.useState(Object);
  const handleSetOperflg = (Object) => {
    setOperflg(Object);
  };

  const [msg1, setMsgId] = React.useState(Object);
  const handleSetMsgId = (Object) => {
    setMsgId(Object);
  };
  const [error, setError] = React.useState(Object);
  const handleSetError = (Object) => {
    setError(Object);
  };
  const [errorFlg, setErrorFlg] = React.useState(Object);
  const handleSetErrorFlg = (Object) => {
    setErrorFlg(Object);
  };
  const [msgText, setMsgText] = React.useState(Object);
  const handleSetMsgText = (Object) => {
    setMsgText(Object);
  };
  const [msgbtnOK, setMsgBtnOK] = React.useState(Object);
  const handleSetMsgBtnOK = (Object) => {
    setMsgBtnOK(Object);
  };
  const [msgbtnNG, setMsgBtnNG] = React.useState(Object);
  const handleSetMsgBtnNG = (Object) => {
    setMsgBtnNG(Object);
  };


  const [fileData, setfileData] = React.useState(Object);
  const handleSetfileData = (Object) => {
    setfileData(Object);
  };

  const fileinputChange = (event) => {
    handleSetfileData(event.target.files[0]);
  }
  function updateClick() {
    createArCampaign1(fileData);
  }
  const { aws_user_files_s3_bucket: bucket } = config;
  const createArCampaign1 = async (file) => {

    let name = document.getElementById('name').value;
    if (name === ''){
      handleSetErrorFlg(false);
      handleSetError("　※名称を入力してください");
      return;
    }
    let Term_From2 = document.getElementById('Term_From').value;
    if (Term_From2.length > 17) {
      Term_From2 = Term_From2 + ".000Z";
    } else {
      Term_From2 = Term_From2 + ":00.000Z";
    }
    let Term_To2 = document.getElementById('Term_To').value;
    if (Term_To2.length > 17) {
      Term_To2 = Term_To2 + ".000Z";
    } else {
      Term_To2 = Term_To2 + ":00.000Z";
    }
    //let DL = document.getElementById('DL').value;
    let text = document.getElementById('text').value;
    if (text === ''){
      handleSetErrorFlg(false);
      handleSetError("　※内容を入力してください");
      return;
    }
    if (operflg === 1) {
      const region = 'ap-northeast-1';
      if (file.name === undefined) {
        handleSetErrorFlg(false);
        handleSetError("　※ファイルを入力してください");
        return;
      }
      const extension = file.name.split('.')[1];
      const imgName = file.name.split('.')[0] + uuidv4();
      if (file) {
        const { type: mimeType } = file;
        const key = `${imgName}.${extension}`;
        const url = `https://${bucket}.s3.${region}.amazonaws.com/public/${key}`;
        try {
          await Storage.put(key, file, {
            contentType: mimeType
          });

          await API.graphql(
            graphqlOperation(createArCampaign, { input: { id: uuidv4(), filePDF: key, Term_From: Term_From2, Term_To: Term_To2, Title: name, PDFurl: url, Text: text } })
          );
          fetchPDFsNoclear();
        } catch (err) {
          console.log('error: ', err);
        }
      }
    } else {
      if (file.name !== undefined) {
        try {
          const region = 'ap-northeast-1';
          const extension = file.name.split('.')[1];
          const imgName = file.name.split('.')[0] + + uuidv4();
          const { type: mimeType } = file;
          const key = `${imgName}.${extension}`;
          const url = `https://${bucket}.s3.${region}.amazonaws.com/public/${key}`;
          // OLD削除
          await Storage.remove(campaign[select_row[0]].filePDF, campaign[select_row[0]].PDFurl);
          await Storage.put(key, file, {
            contentType: mimeType
          });
          await API.graphql(
            graphqlOperation(updateArCampaign, { input: { id: campaign[select_row[0]].id, filePDF: key, Term_From: Term_From2, Term_To: Term_To2, Title: name, PDFurl: url, Text: text } })
          );
          fetchPDFsNoclear();
        } catch (err) {
          console.log('error: ', err);
        }

      } else {
        try {
          await API.graphql(
            graphqlOperation(updateArCampaign, { input: { id: campaign[select_row[0]].id, Term_From: Term_From2, Term_To: Term_To2, Title: name, Text: text } })
          );
          fetchPDFsNoclear();
        } catch (err) {
          console.log('error: ', err);
        }
      }
    }
    handleSetError('');
    handleSetErrorFlg(true);
    setOpen1(false);
  };

  function deleteClick() {

    if (select_row.length === 0) {
      handleSetMsgId("削除警告");
      handleSetMsgText("削除データを選択してください");
      handleSetMsgBtnOK("はい");

      handleClickOpen2();
      return;
    }
    handleSetMsgId("削除確認");
    handleSetMsgText("本当に削除しましたか");
    handleSetMsgBtnOK("はい");
    handleSetMsgBtnNG("いいえ");
    handleClickOpen();
  }

  const deleteArCampaigns = async () => {
    for (let i = 0; i < select_row.length; i++) {
      try {
        await Storage.remove(campaign[select_row[i]].filePDF, campaign[select_row[i]].PDFurl);
        await API.graphql(
          graphqlOperation(deleteArCampaign, { input: { id: campaign[select_row[i]].id } })
        );
        handleSetMsgId("削除正常");
        handleSetMsgText("削除実行成功しました！");
        handleSetMsgBtnOK("はい");
        handleClickOpen2();
        fetchPDFs();
      } catch (err) {
        console.log('error: ', err);
      }
    }
  };
  const [open, setOpen] = React.useState(false);
  const [open1, setOpen1] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClickOpen1 = () => {
    setOpen1(true);
  };
  const handleClickOpen2 = () => {
    setOpen2(true);
  };
  const handleCloseNG2 = () => {
    setOpen2(false);
  };
  const handleClose1 = () => {
    updateClick();
  };
  const handleClose2 = () => {
    setOpen1(false);
  };
  const handleCloseNG = () => {
    setOpen(false);
  };
  const handleCloseOK = () => {
    deleteArCampaigns();
    setOpen(false);
  };
  const handleCloseOK2 = () => {

    setOpen2(false);
  };
  // function txtChanged1(e) {
  //   inventories.Title = e.target.value
  //   setInv({ type: SET, invs: inventories })
  // }
  // function txtChanged2(e) {
  //   inventories.Discription = e.target.value
  //   setInv({ type: SET, invs: inventories })
  // }
  // function txtChanged3(e) {
  //   inventories.Notification = e.target.value
  //   setInv({ type: SET, invs: inventories })
  // }

  return (
    <Container style={{ backgroundColor: '', 'minWidth': '85vw', 'minHeight': '74vh' }}>
      <div>
        <Meta title={pageTitle} />
      </div>
      <Row>
        {/* <Col>
          <div className={classes.notice} >お知らせ</div>
          <div hidden={authFlg} className={classes.root}>
            <TextField
              id="standard-full-width"
              name="Title"
              label="お知らせ"
              //autoComplete="off"
              // id="margin-none"
              defaultValue="Default Value"
              style={{ margin: 10 }}
              //className={classes.textField}
              //color="secondary"
              //placeholder=""
              fullWidth
              multiline
              //margin="normal"
              value={inventories.Title}
              required="true"
              variant="outlined"
              onChange={(e) => { txtChanged1(e) }}
              rows={3}
            />
            <TextField
              id="standard-full-width"
              label="日時"
              name="Discription"
              defaultValue="Default Value"
              //className={classes.textField}
              style={{ margin: 10 }}
              //helperText="Some important text"
              fullWidth
              //margin="None"
              value={inventories.Discription}
              // disabled="true"
              type="string"
              multiline
              variant="outlined"
              onChange={(e) => { txtChanged2(e) }}
            />


            <TextField
              id="standard-full-width"
              label="ご紹介"
              name="Notification"
              defaultValue="Default Value"
              //className={classes.textField}
              //helperText="Some important text"
              fullWidth
              // margin="dense"
              multiline
              style={{ margin: 10 }}
              value={inventories.Notification}
              type="string"
              rows={6}
              variant="outlined"
              onChange={(e) => { txtChanged3(e) }}
            />
            <Button variant="contained" color="primary" size='medium' onClick={() => { arAttentionsClick() }}>更新</Button>
          </div>
          <div hidden={!authFlg} className={classes.root}>
            <TextField
              id="standard-full-width"
              label="お知らせ"
              name="Title"
              //autoComplete="off"
              // id="margin-none"
              defaultValue="Default Value"
              style={{ margin: 10 }}
              //className={classes.textField}
              //color="secondary"
              //placeholder=""
              fullWidth
              multiline
              variant="outlined"
              //margin="normal"
              value={inventories.Title}
              required="true"
              InputProps={{
                readOnly: true
              }}
              onChange={(e) => { txtChanged1(e) }}
              rows={3}
            />
            <TextField
              id="standard-full-width"
              label="日時"
              name="Discription"
              defaultValue="Default Value"
              variant="outlined"
              //className={classes.textField}
              style={{ margin: 10 }}
              //helperText="Some important text"
              fullWidth
              //margin="None"
              value={inventories.Discription}
              // disabled="true"
              InputProps={{
                readOnly: true
              }}
              type="string"
              multiline
              onChange={(e) => { txtChanged2(e) }}
            />
            <TextField
              id="standard-full-width"
              label="ご紹介"
              name="Notification"
              defaultValue="Default Value"
              //className={classes.textField}
              //helperText="Some important text"
              fullWidth
              // margin="dense"
              multiline
              InputProps={{
                readOnly: true
              }}
              variant="outlined"
              style={{ margin: 10 }}
              value={inventories.Notification}
              type="string"
              rows={6}
              onChange={(e) => { txtChanged3(e) }}
            />
          </div>
        </Col> */}
        <Col>
          <div className={classes.root}>
            <BootstrapTable
              bootstrap4
              keyField="id"
              caption={<CaptionElement />}
              data={campaign}
              columns={columns}
              //expandRow={expandRow}
              striped
              hover
              condensed
              selectRow={selectRow}
            />
          </div>
          <div hidden={authFlg} className={classes.button}>
            {/* <ButtonGroup variant="contained" color="primary" aria-label="contained primary button group"> */}
            <Row>
              <Button variant="contained" color="primary" size='medium' disabled={loaddisabledflg} onClick={() => { addClick() }}> 新規</Button>
              <Button variant="contained" color="primary" size='medium' disabled={loaddisabledflg} onClick={() => { addupdateClick() }}>更新</Button>
              <Button variant="contained" color="primary" size='medium' disabled={loaddisabledflg} onClick={() => { deleteClick() }} >削除</Button>
              <Button variant="contained" color="primary" size='medium' disabled={loaddisabledflg} onClick={() => { searchClick() }}>詳細参照</Button>
            </Row>
          </div>
          <div hidden={!authFlg} className={classes.button}>
            {/* <ButtonGroup variant="contained" color="primary" aria-label="contained primary button group"> */}
            <Row>
              <Button variant="contained" color="primary" size='medium' disabled={loaddisabledflg} onClick={() => { searchClick() }}>詳細参照</Button>
            </Row>
            {/* </ButtonGroup> */}
          </div>
          <Dialog
            open={open1}
            onClose={handleClose1}
            fullWidth="lg"
            maxWidth="lg"
            aria-labelledby="max-width-dialog-title"
            disableEscapeKeyDown="true"
            disableBackdropClick="true"
          >
            <DialogTitle id="alert-dialog-title">お知らせ／キャンペーン画面</DialogTitle>
            <DialogContent>
              <Row>

                <Col>
                   <div hidden={errorFlg} >
                   <span style={{ color: 'red' }}>{error}</span>
                   </div>
                  <InputGroup className="mb-3">
                    <InputGroup.Text className={classes.textField} id="basic-name">名称<span style={{ color: 'red' }}>［必須］  </span></InputGroup.Text>
                    <FormControl
                      placeholder="名称"
                      aria-label="name"
                      aria-describedby="basic-name"
                      id="name"
                      className={classes.textField}
                      value={nameText}
                      onChange={(e) => { txtChangedText(e) }}
                      disabled={disabledflg}
                    />
                  </InputGroup>

                  <InputGroup className="mb-3">
                    <InputGroup.Text className={classes.textField} id="basic-from">開始<span style={{ color: 'red' }}>［必須］  </span></InputGroup.Text>
                    {/* <FormControl
                    placeholder="開始時間"
                    aria-label="Term_From"
                    aria-describedby="basic-from"
                    id="Term_From"
                  /> */}
                    <TextField
                      id="Term_From"
                      label="Next appointment"
                      type="datetime-local"
                      defaultValue=""
                      className={classes.textField}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      value={Term_FromText}
                      onChange={(e) => { txtChangedTerm_From(e) }}
                      disabled={disabledflg}
                    />
                  </InputGroup>
                  <InputGroup className="mb-3">
                    <InputGroup.Text className={classes.textField} id="basic-To">終了<span style={{ color: 'red' }}>［必須］  </span></InputGroup.Text>
                    {/* <FormControl
                    placeholder="終了時間"
                    aria-label="Term_To"
                    aria-describedby="basic-To"
                    id="Term_To"
                  /> */}
                    <TextField
                      id="Term_To"
                      label="Next appointment"
                      type="datetime-local"
                      defaultValue="2021-08-01T10:30"
                      className={classes.textField}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      value={Term_ToText}
                      onChange={(e) => { txtChangedTerm_To(e) }}
                      disabled={disabledflg}
                    />
                  </InputGroup>
                  {/* <InputGroup>
                    <InputGroup className="mb-3">
                      <InputGroup.Text className={classes.textField} id="basic-text">	仕切率<span style={{ color: 'red' }}>［必須］</span></InputGroup.Text>
                      <FormControl
                        placeholder="詳細内容"
                        aria-label="name"
                        aria-describedby="basic-name"
                        id="DL"
                        className={classes.textField}
                        value={DLText}
                        onChange={(e) => { txtChangedDL(e) }}
                        disabled={disabledflg}
                      />
                    </InputGroup>
                  </InputGroup> */}
                  <InputGroup className="mb-3">
                    <InputGroup>
                      <InputGroup.Text className={classes.textField} id="basic-text">ファイル<span style={{ color: 'red' }}>      </span></InputGroup.Text>
                      <input
                        accept=".pdf"
                        className={classes.input}
                        id="contained-button-file"
                        // multiple
                        type="file"
                        onChange={fileinputChange}
                        disabled={disabledflg}
                      />
                    </InputGroup>
                  </InputGroup>
                  <InputGroup>
                    <InputGroup.Text className={classes.textField} id="basic-text">内容<span style={{ color: 'red' }}>［必須］</span></InputGroup.Text>
                    <FormControl placeholder="詳細内容" as="textarea" value={texttext} className={classes.textField} rows="6" aria-label="With textarea" id="text"
                      onChange={(e) => { txtChangedtext2(e) }} disabled={disabledflg}>
                    </FormControl>
                  </InputGroup>
                </Col>
              </Row>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose1} disabled={disabledflg} variant="contained" color="primary" autoFocus>
                更新
              </Button>
              <Button onClick={handleClose2} variant="contained" color="primary">
                キャンセル
              </Button>
            </DialogActions>
          </Dialog>

        </Col>
      </Row>
      <Dialog
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
      </Dialog>
      <Dialog
        open={open2}
        onClose={handleCloseNG2}
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
          <Button onClick={handleCloseOK2} color="primary" autoFocus>
            {msgbtnOK}
          </Button>
        </DialogActions>
      </Dialog>
    </Container >

  )
}

export default Home