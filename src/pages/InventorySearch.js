/* ar-brown App (C) 2021 arbrown.co.jp All rights reserved.
 *******************************************************************************
 * Program ID:  InventorySearch.js
 * $Revision:   Ver1.0
 * $Modtime:    $
 *******************************************************************************
 * Author      (作成／更新年月日、担当者)
 *  2021/08/01 Rayoo)li : 新規作成
 *
 * Summary InventorySearch画面
 *
 * Instructions / Preconditions
 *  なし
 *
 *******************************************************************************
 */
import './style/ar.css';
import Meta from '../components/Meta'
import userAuth from '../components/userAuth'
import React, { useEffect, useReducer, useState } from 'react';
import { useLocation } from "react-router-dom"
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
/*コンテナ（画面レイアウト）デザイン*/
import { Container, Row, Col } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
//フィルター
import filterFactory, { textFilter, selectFilter, Comparator } from 'react-bootstrap-table2-filter';
//検索
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { Select, MenuItem, FormControl, InputLabel, OutlinedInput } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
/*  GraphQL API Acess */
import API, { graphqlOperation } from '@aws-amplify/api';
import { agencyGroupSortList, customerByeMail, AdminAgencyPriceGroupSortList, listArAgencyOrderInfos } from '../graphql/queries';
import { createArOrder, createArAgencyOrderInfo, updateArAgencyOrderInfo } from '../graphql/mutations';//,updateArOrder
/*  AWS標準設定 with Login Auth. */
import Amplify, { Auth } from 'aws-amplify';
import awsconfig from '../aws-exports';
Amplify.configure(awsconfig);
import { useHistory } from "react-router-dom";
// page content
const pageTitle = 'ARB-SIP（在庫・価格照会システム）'
const { SearchBar, ClearSearchButton } = Search;
import { v4 as uuidv4 } from 'uuid';
import { InputGroup } from 'react-bootstrap'
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import cellEditFactory from 'react-bootstrap-table2-editor';
import '../components/ArGlobal';
// import { PanoramaSharp } from '@material-ui/icons';
const QUERY = 'QUERY';
const initialInventoryState = { Invs: [] };
const reducer = (state, action) => {
  switch (action.type) {
    case QUERY:
      return { ...state, Invs: action.Invs };
    default:
      return state;
  }
};
// const initialSupplier = {Invs:{}};
const reducerSupplier = (state, action) => {
  let obj = {};
  switch (action.type) {
    case QUERY:
      for (let i = 0; i < action.Invs.length; i++) {
        let cur = action.Invs[i];
        let curn = action.Invs[i];
        obj[cur] = curn;
      }
      return { ...state, ...obj };
    default:
      return state;
  }
};

const useStyles = makeStyles((theme) => ({

  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '30ch',
  },
  textFieldPink: {
    marginLeft: theme.spacing(0),
    marginRight: theme.spacing(0),
    width: '18ch',
    backgroundColor: 'pink'
  },
  textFieldHope: {
    marginLeft: theme.spacing(0),
    marginRight: theme.spacing(0),
    color: 'black',
    width: '18ch',
  },
  textFieldBu: {
    align: 'right',
    marginLeft: theme.spacing(0),
    marginRight: theme.spacing(0),
    width: '10ch',
    color: 'black',
    backgroundColor: 'pink',
    '&:hover': {
      backgroundColor: 'pink',
    },
  },
  //入力ボックスのセルの設定
  textFieldOrderQuantity: {
    margin: theme.spacing(0),
    position: 'relative',
    height: "100%",
  },
  resize: {
    height: "100%"
  }
}));
const headerStyle = { backgroundColor: '#D3D3D3' }
const headerSortingStyle = { backgroundColor: '#BEBEBE' };
function getStyles(name, priceGroup, theme) {
  return {
    fontWeight:
      priceGroup.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}
const ITEM_HEIGHT = 100;
const ITEM_PADDING_TOP = 9;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 200,
    },
  },
};
let orderselect_row = [];
let agencyId = '';
const checkedArr = [];
function InventorySearch() {
  const [loginDisplay, setloginDisplay] = useState(true);
  const [inventories, setInv] = useReducer(reducer, initialInventoryState);
  const [selectOptions, setSupplier] = useReducer(reducerSupplier, {});
  const [adminAuthFlg, setAdminAuthFlgFlg] = React.useState(Object);
  // const [selectOptions, setSelectOptions] = React.useState({});
  const handleSetAdminAuthFlg = (Object) => {
    setAdminAuthFlgFlg(Object);
  };
  const handleSetCount = (id, Quantity, Object) => {
    let idTemp = document.getElementById(id);
    if (Object <= 0) {
      idTemp.value = '';
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
    for (let j = 0; j < inventories.Invs.length; j++) {
      if (inventories.Invs[j].id === id) {
        inventories.Invs[j].OrderQuantity = num;
        break;
      }
    }
  }

  let localHiddenFiles = JSON.parse(localStorage.getItem('hiddenFields'))
  let hiddenFileds = localHiddenFiles ? localHiddenFiles : [
    'ID',
    'Product_Name_e',
    'Wholes_Rate',
    'Wholes_Price',
    'Campaign_price',
    'Campaign_partition_rate',
    'Storage_Temp',
    'LawsRegulations'
  ]
  let dataAll = null;
  let columnsDefault = () => {
    return [
      { dataField: "id", text: 'ID', hidden: true },
      // { dataField: 'Agency_Price_Group', text: 'Group', filter: textFilter(), sort: true, hidden: true },
      {
        dataField: 'Product_Code',
        hidden: hiddenFileds.indexOf('Product_Code') > -1 ? true : false,
        text: "製品コード", width: '200px', filter: textFilter({
          placeholder: '',
          className: '',
          defaultValue: '',
          comparator: Comparator.LIKE, // default is Comparator.LIKE
          caseSensitive: true,
          style: { backgroundColor: '', margin: '0px', width: '100px' },
          delay: 500,
        }), sort: true, headerSortingStyle, headerStyle, type: 'string', editable: false, fixed: 'left',
      },
      {
        dataField: "Supplier", text: '製造元',
        hidden: hiddenFileds.indexOf('Supplier') > -1 ? true : false,
        formatter: cell => selectOptions[cell],
        filter: selectFilter({
          options: selectOptions,
          style: { backgroundColor: '', margin: '0px', width: '150px' },
        }),
        sort: true,
        headerSortingStyle, headerStyle, type: 'string', editable: false,
      },
      { dataField: "Product_Name_j", hidden: hiddenFileds.indexOf('Product_Name_j') > -1 ? true : false, text: '製品名（和名）', filter: textFilter({ style: { backgroundColor: '', margin: '0px', width: '150px' }, }), sort: true, headerSortingStyle, headerStyle, editable: false, type: 'string' },
      { dataField: "Product_Name_e", hidden: hiddenFileds.indexOf('Product_Name_e') > -1 ? true : false, text: '製品名（英名）', headerSortingStyle, style: { margin: '0px', width: '200px' }, headerStyle, type: 'string', editable: false },
      { dataField: "Capacity_Display", hidden: hiddenFileds.indexOf('Capacity_Display') > -1 ? true : false, text: '容量', headerStyle, editable: false },
      { dataField: "Catarog_Price", hidden: hiddenFileds.indexOf('Catarog_Price') > -1 ? true : false, text: '定価', style: { margin: '0px', width: '100px' }, headerStyle, align: 'right', headerAlign: 'left', editable: false },
      { dataField: "Wholes_Rate", hidden: hiddenFileds.indexOf('Wholes_Rate') > -1 ? true : false, text: '仕切率', headerStyle, style: { margin: '0px', width: '80px' }, align: 'right', editable: false },
      { dataField: "Wholes_Price", hidden: hiddenFileds.indexOf('Wholes_Price') > -1 ? true : false, text: '仕切値', headerStyle, align: 'right', editable: false },
      {
        dataField: "Campaign_price", hidden: hiddenFileds.indexOf('Campaign_price') > -1 ? true : false, text: 'キャンペーン価格', style: { margin: '0px', width: '140px' }, headerStyle, align: 'right',
        isDummyField: true, editable: false,
        formatter: (cellContent, row) => {
          if (row.Campaign_price === null) {
            return (
              <span>―</span>
            );
          } else {
            return (
              <span>
                {row.Campaign_price}</span>
            );
          }
        }
      },
      {
        dataField: "Campaign_partition_rate", hidden: hiddenFileds.indexOf('Campaign_partition_rate') > -1 ? true : false, text: 'キャンペーン仕切率', his: false, align: 'right', style: { margin: '0px', width: '140px' }, headerStyle,
        isDummyField: true, editable: false,
        formatter: (cellContent, row) => {
          if (row.Campaign_partition_rate === null) {
            return (
              <span>―</span>
            );
          } else {
            return (
              <span>
                {row.Campaign_partition_rate}</span>
            );
          }
        }
      },
      {
        dataField: "TempInventoryQuantity", hidden: hiddenFileds.indexOf('TempInventoryQuantity') > -1 ? true : false, text: '在庫数', align: 'right', type: 'number', headerStyle,
        // filter: numberFilter({
        //   defaultValue: { number: 0, comparator: Comparator.GE },
        //   comparators: [Comparator.EQ, Comparator.GE, Comparator.LE],
        //   style: { display: 'inline-grid' },
        //   className: 'custom-numberfilter-class',
        //   comparatorStyle: { backgroundColor: 'antiquewhite', margin: '0px', width: '70px' },
        //   comparatorClassName: 'custom-comparator-class',
        //   numberStyle: { backgroundColor: 'cadetblue', margin: '0px', width: '100px' },
        //   numberClassName: 'custom-number-class'
        // }),
        editable: false,
      },
      { dataField: "Delivery_Term", hidden: hiddenFileds.indexOf('Delivery_Term') > -1 ? true : false, style: { margin: '0px', width: '120px' }, text: '欠品時目安納期', headerStyle, editable: false },
      { dataField: "Storage_Temp", hidden: hiddenFileds.indexOf('Storage_Temp') > -1 ? true : false, tyle: { margin: '0px', width: '100px' }, text: '保管温度', headerStyle, editable: false },
      { dataField: "LawsRegulations", hidden: hiddenFileds.indexOf('LawsRegulations') > -1 ? true : false, tyle: { margin: '0px', width: '60px' }, text: '法規制', headerStyle, editable: false },
      {
        dataField: "OrderQuantity",
        style: { margin: '0px', width: '100px', padding: '0px 0px', fontSize: '18px', height: "40px" },
        text: '発注数', hidden: (loginDisplay ? false : true), editable: false, type: 'number',
        // editable: (content, row) => row.Quantity > 0,
        // editCellStyle: (cell) => {
        //   const backgroundColor = cell > 1 ? '#00BFFF' : '#00FFFF';
        //   return { backgroundColor };
        // },
        headerStyle: {
          backgroundColor: 'pink'
        },
        events: {
          // onClick: (e, column, columnIndex, row, rowIndex) => {
          //   console.log(e);
          //   console.log(column);
          //   console.log(columnIndex);
          //   console.log(row);
          //   console.log(rowIndex);
          //   return false;
          // },
          // onMouseEnter: (e, column, columnIndex, row, rowIndex) => {
          //   console.log(e);
          //   console.log(column);
          //   console.log(columnIndex);
          //   console.log(row);
          //   console.log(rowIndex);
          // }
        },
        formatter: (cellContent, row) => {
          if (row.id !== null) {
            return (
              <TextField
                style={{}}
                id={row.id}
                //label="Outlined secondary"
                variant="outlined"
                color="secondary"
                type="number"
                onChange={(e) => { handleSetCount(row.id, row.TempInventoryQuantity, e.target.value) }}
                name="OrderQuantity"
                defaultValue={row.OrderQuantity}
                // InputLabelProps={{
                //   className:classes.resize
                // }}
                className={classes.textFieldOrderQuantity}
                InputProps={{
                  //  disableUnderline:true,
                  className: classes.resize
                }}
              />
            );
          }
        }
      }
    ]
  };
  const [columns, setColumns] = useState(columnsDefault());
  // eslint-disable-next-line no-unused-vars
  const location = useLocation();
  useEffect(() => {
    let btnToggleSupplier = document.getElementById('btnToggleSupplier');
    if (btnToggleSupplier !== null) {
      btnToggleSupplier.click();
    }

    // 非同期型（async）で在庫情報をagencyGroupInvListからAgency_Price_GroupをKeyに取得
    // 1) Auth.currentUserInfo() から、email情報を取得して、customerByeMailからeMailをKeyにAgent情報を取得
    //  ※agencyGroupIDはAgent.jsで一度取得しているから再利用可能なはず！
    // 2) agencyGroupIDを取得して、これをKeyにagencyGroupInvListから在庫情報を取得
    async function listInvData() {
      //   let nTime = new Date();
      //   let format = "";
      // format += nTime.getFullYear() + "-";
      // format += (nTime.getMonth() + 1) < 10 ? "0" + (nTime.getMonth() + 1) : (nTime.getMonth() + 1);
      // format += "-";
      // format += nTime.getDate() < 10 ? "0" + (nTime.getDate()) : (nTime.getDate());
      // handleSetHopedate(format);

      // get the Login user infomation. Set to user
      // const { accessToken } = await Auth.currentSession();
      // const cognitogroups = accessToken.payload['cognito:groups'];
      // const userAuth = cognitogroups[0];
      // handleSetloaddisabledflg2(true);
      const userAuths = await userAuth();
      orderselect_row = [];
      let agentGroupID;
      if (userAuths === '1') {
        handleSetAdminAuthFlg(true);
        const user = await Auth.currentUserInfo();
        const agencyPriceGroup = await API.graphql(graphqlOperation(customerByeMail, { Agency_Email: user.attributes.email }));
        const agentinfo = agencyPriceGroup.data.customerByeMail['items'];
        if (agentinfo.length > 0) {
          agentGroupID = agentinfo[0].Agency_Price_Group;
          agencyId = agentinfo[0].Agency_id;
        }
        setloginDisplay(true);
      } else {
        // admin
        handleSetAdminAuthFlg(false);
        const AdminAgencyPriceList = await API.graphql(graphqlOperation(AdminAgencyPriceGroupSortList, { Admin_Group: 'admin' }));
        //データベースから結果を取得できず、結果は空です
        if (AdminAgencyPriceList.data.AdminAgencyPriceGroupSortList.items.length > 0) {
          agentGroupID = AdminAgencyPriceList.data.AdminAgencyPriceGroupSortList.items[0].Admin_Agency_Price_Group
          setAgencyPriceGroup({ type: QUERY, Invs: AdminAgencyPriceList.data.AdminAgencyPriceGroupSortList.items });
        }
        setloginDisplay(false);
      }
      const InvData = await API.graphql(graphqlOperation(agencyGroupSortList, { Agency_Price_Group: agentGroupID, sortDirection: "DESC", limit: 10000 }));
      let nextToken = InvData.data.AgencyGroupSortList.nextToken;
      dataAll = InvData.data.AgencyGroupSortList.items;
      if (location.state && location.state.QuoteNumber !== undefined) {
        // flagPage = true
        const pageData = await API.graphql(graphqlOperation(listArAgencyOrderInfos, { QuoteNumber: location.state.QuoteNumber }));
        // delete location.state.QuoteNumber;
        let srAgencyOrderdataAll = pageData.data.listArAgencyOrderInfos.items;
        for (let item in dataAll) {
          for (let i = 0; i < srAgencyOrderdataAll.length; i++) {
            if (dataAll[item]['Product_Code'] === srAgencyOrderdataAll[i].Product_Code) {
              dataAll[item]['OrderQuantity'] = srAgencyOrderdataAll[i].OrderQuantity;
              checkedArr.push(dataAll[item]['id'])

              orderselect_row.push(dataAll[item]['id'])
              if (srAgencyOrderdataAll[i].OrderQuantity === null) {
                srAgencyOrderdataAll[i].OrderQuantity = 0;
              }
              // 画面の仮在庫数を戻る
              dataAll[item]['TempInventoryQuantity'] = dataAll[item]['TempInventoryQuantity'] + srAgencyOrderdataAll[i].OrderQuantity;
            }
          }
        }
      } else {
        // flagPage = false;
      }
      while (nextToken !== null) {
        let InvDataSec = await API.graphql(graphqlOperation(agencyGroupSortList, { Agency_Price_Group: agentGroupID, sortDirection: "DESC", limit: 10000, nextToken: nextToken }));
        nextToken = InvDataSec.data.AgencyGroupSortList.nextToken;
        for (let i = 0; i < InvDataSec.data.AgencyGroupSortList.items.length; i++) {
          dataAll.push(InvDataSec.data.AgencyGroupSortList.items[i]);
        }
      }
      let allSupplier = [];
      for (let i = 0; i < dataAll.length; i++) {
        allSupplier.push(dataAll[i].Supplier);
      }
      let distinctSupplier = []
      let hash = {}
      distinctSupplier = allSupplier.reduce((item, next) => {
        hash[next] ? '' : hash[next] = true && item.push(next)
        return item
      }, [])
      setSupplier({ type: QUERY, Invs: distinctSupplier });
      setInv({ type: QUERY, Invs: dataAll });
      handleSetAuthFlg(1);
      let btnToggleSupplier = document.getElementById('btnToggleSupplier');
      if (btnToggleSupplier !== null) {
        btnToggleSupplier.click();
      }
      // let btnToggleProduct_Name_e = document.getElementById('btnToggleProduct_Name_e');
      // if (btnToggleProduct_Name_e !== null) {
      // btnToggleProduct_Name_e.click();
      // let btnToggleWholes_Rate = document.getElementById('btnToggleWholes_Rate');
      // btnToggleWholes_Rate.click();
      //   let btnToggleWholes_Price = document.getElementById('btnToggleWholes_Price');
      //   btnToggleWholes_Price.click();
      //   let btnToggleCampaign_price = document.getElementById('btnToggleCampaign_price');
      //   btnToggleCampaign_price.click();
      //   let btnToggleCampaign_partition_rate = document.getElementById('btnToggleCampaign_partition_rate');
      //   btnToggleCampaign_partition_rate.click();
      //   let btnToggleStorage_Temp = document.getElementById('btnToggleStorage_Temp');
      //   btnToggleStorage_Temp.click();
      //   let btnToggleLawsRegulations = document.getElementById('btnToggleLawsRegulations');
      //   btnToggleLawsRegulations.click();
      // }
    }
    for (let i = 0; i < columns.length; i++) {
      if (hiddenFileds.indexOf(columns[i]['dataField']) > -1) {
        columns[i]['hidden'] = true
      }
    }
    listInvData();
  }, []);

  const customTotal = (from, to, size) => (
    <span className="react-bootstrap-table-pagination-total">
      Showing {from} to {to} of {size} Results
    </span>
  );
  const classes = useStyles();
  const options = {
    paginationSize: 5,
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
      text: '5', value: 5
    }, {
      text: '10', value: 10
    }, {
      text: '20', value: 20
    }, {
      text: '100', value: 100
    }]
  };
  //keep-alive効果を達成するために状態を維持する必要があります
  const CustomToggleList = ({
    columns,
    onColumnToggle,
    toggles
  }) => (
    <div className="btn-group btn-group-toggle btn-group-vertical" data-toggle="buttons">
      {
        <div className="v1">{
          columns.map((column) => ({
            ...column,
            //toggle：リスト名はありますか？
            toggle: toggles[column.dataField]//sessionStorage.getItem("arrstatus") ? (JSON.parse(sessionStorage.getItem("arrstatus"))[column.dataField] === false ? false : true) : toggles[column.dataField]
          })).map((column) => {
            return (
              column.dataField !== 'id' ?
                <button
                  type="button"
                  key={`${column.dataField}`}
                  //真の場合はctiveになり、そうでない場合は赤になります
                  className={`btn btn-secondary list-custom-class ${column.toggle ? 'active' : 'btn-danger'}`}
                  data-toggle="button"
                  aria-pressed={column.toggle ? 'false' : 'true'}
                  //切替
                  onClick={() => {
                    let findIndex = hiddenFileds.indexOf(column.dataField);
                    if (findIndex > -1) {
                      hiddenFileds[findIndex] = '';
                    } else {
                      hiddenFileds.push(column.dataField);
                    }
                    localStorage.setItem('hiddenFields', JSON.stringify(hiddenFileds))
                    onColumnToggle(column.dataField)
                    setColumns(columnsDefault())
                  }
                  }//!column.toggle クリック後に反対の値を取る
                  id={`btnToggle${column.dataField}`}
                >{column.text}
                </button> : ''
            )
          })
        } </div>
      }
    </div>)
  const defaultSorted = [{
    dataField: 'id',
    order: 'desc'
  }];

  // const selectRowAdmin = {
  //   mode : 'checkbox',
  //   hideSelectColumn: true,
  // }
  const selectRow = {
    mode: 'checkbox',
    clickToSelect: false,
    clickToEdit: true,
    hideSelectColumn: loginDisplay ? false : true,
    bgColor: '#FFFAFA',
    selected: orderselect_row,
    selectionHeaderRenderer: () => 'カートに入れる',
    headerColumnStyle: {
      backgroundColor: 'pink'
    },
    selectColumnPosition: 'right',
    onSelect: (row, isSelect) => {
      if (isSelect) {
        orderselect_row.push(row.id);
      } else {
        let find = orderselect_row.findIndex(function (item) {
          return item === row.id
        })
        orderselect_row.splice(find, 1);
        console.log("orderselect_row unselect", orderselect_row, "id==", row.id)
      }
    },
    onSelectAll: (isSelect) => {
      if (isSelect) {
        for (let i = 0; i < inventories.Invs.length; i++) {
          orderselect_row.push(inventories.Invs[i].id);
        }
      } else {
        orderselect_row = [];
      }
    },
  };
  const [authFlg, setAuthFlg] = React.useState(Object);
  const handleSetAuthFlg = (Object) => {
    if (Object === 1) {
      setAuthFlg({
        fileName: '商品一覧（チェックのみ）.csv',
        noAutoBOM: false,
        blobType: 'text/plain;charset=Shift-JIS',
        exportAll: false,
        onlyExportSelection: true,
      })
    } else {
      setAuthFlg({
        fileName: '商品一覧（全件）.csv',
        noAutoBOM: false,
        blobType: 'text/plain;charset=Shift-JIS',
        exportAll: true,
        onlyExportSelection: false
      })
    }
  }

  const MyExportCSV = (props) => {
    const handleBlur = () => {
      handleSetAuthFlg(1)
    };
    const handleClick = () => {
      props.onExport();
    };
    return (
      <div>
        <button className="btn btn-secondary" onMouseEnter={handleBlur} onClick={handleClick}>CSV出力（チェックのみ）</button>
      </div>
    );
  };

  const MyExportCSV2 = (props) => {
    const handleBlur = () => {
      handleSetAuthFlg(2)
    };
    const handleClick = () => {
      props.onExport();
    };
    return (
      <div>
        <button className="btn btn-secondary" onMouseEnter={handleBlur} onClick={handleClick}>CSV出力（全件）</button>
      </div>
    );
  };
  const history = useHistory();
  function orderClick() {
    createArOrders();
  }

  const [msg1, setMsgId] = React.useState(Object);
  const handleSetMsgId = (Object) => {
    setMsgId(Object);
  };
  const [msgText, setMsgText] = React.useState(Object);
  const handleSetMsgText = (Object) => {
    setMsgText(Object);
  };
  const [msgbtnOK, setMsgBtnOK] = React.useState(Object);
  const handleSetMsgBtnOK = (Object) => {
    setMsgBtnOK(Object);
  };
  const [open2, setOpen2] = React.useState(false);
  const handleClickOpen2 = () => {
    setOpen2(true);
  };
  const handleCloseNG2 = () => {
    setOpen2(false);
  };
  const handleCloseOK2 = () => {
    setOpen2(false);
  };
  //重複するオブジェクトを削除する
  function unique(arr) {
    return arr.filter((item, index) => {
      console.log(item, index);
      return arr.indexOf(item) === index;
    })
  }

  const createArOrders = async () => {
    if (orderselect_row === '' || orderselect_row.length === 0) {
      handleSetMsgId("エラー");
      handleSetMsgText("製品を選択してください");
      handleSetMsgBtnOK("はい")
      handleClickOpen2();
      return;
    }
    let hopedateValue = document.getElementById('hopedate').value;
    if (hopedateValue === null || hopedateValue.length === 0) {
      handleSetMsgId("エラー");
      handleSetMsgText("希望納期を入力してください");
      handleSetMsgBtnOK("はい");
      handleClickOpen2();
      return;
    }
    if (orderselect_row === '' || orderselect_row.length === 0) {
      handleSetMsgId("エラー");
      handleSetMsgText("1つ以上の商品をお選びください");
      handleSetMsgBtnOK("はい");
      handleClickOpen2();
      return;
    }
    let id = uuidv4();
    let format = "";
    let nTime = new Date();
    format += nTime.getFullYear();
    format += (nTime.getMonth() + 1) < 10 ? "0" + (nTime.getMonth() + 1) : (nTime.getMonth() + 1);
    format += nTime.getDate() < 10 ? "0" + (nTime.getDate()) : (nTime.getDate());
    format += nTime.getHours() < 10 ? "0" + (nTime.getHours()) : (nTime.getHours());
    format += nTime.getMinutes() < 10 ? "0" + (nTime.getMinutes()) : (nTime.getMinutes());
    format += nTime.getMilliseconds();
    let QuoteNumber = 'E' + format;
    if (hopedateValue.length > 17) {
      hopedateValue = hopedateValue + "T00:00.000Z";
    } else if (hopedateValue.length > 0) {
      hopedateValue = hopedateValue + "T00:00:00.000Z";
    } else {
      hopedateValue = '';
    }

    if (location.state) {
      console.log("orderselect_row", orderselect_row);
      // 既存のデータを削除
      let oldQuoteNumber = location.state.QuoteNumber;
      let listArAgencyOrderInfo = await API.graphql(graphqlOperation(listArAgencyOrderInfos, { QuoteNumber: oldQuoteNumber }));
      console.log("listArAgencyOrderInfo:", listArAgencyOrderInfo.data.listArAgencyOrderInfos['items']);
      let order = [];
      let order2 = [];
      if (listArAgencyOrderInfo.data.listArAgencyOrderInfos !== null) {
        order2 = listArAgencyOrderInfo.data.listArAgencyOrderInfos['items'];
        for (let j = 0; j < order2.length; j++) {
          order.push(order2[j].Product_id)
        }
      }
      // 0 del 1 insert 2 update
      // let aaa = order.concat(orderselect_row).sort(function (order, orderselect_row) { return order - orderselect_row })
      // let ind1 = 0;
      // let ind2 = 0;
      // let arr = [];
      // let arrT = [];
      // let arrF = [];
      for (let i = 0; i < order.length - 1; i++) {
        for (let j = 0; j < order.length - 1 - i; j++) {
          if (order[j] > order[j + 1]) {
            let temp = order[j];
            order[j] = order[j + 1];
            order[j + 1] = temp;
          }
        }
      }
      for (let i = 0; i < orderselect_row.length - 1; i++) {
        for (let j = 0; j < orderselect_row.length - 1 - i; j++) {

          if (orderselect_row[j] > orderselect_row[j + 1]) {
            let temp = orderselect_row[j];
            orderselect_row[j] = orderselect_row[j + 1];
            orderselect_row[j + 1] = temp;
          }
        }
      }
      orderselect_row = unique(orderselect_row)
      let count = 1;
      for (let i = 0; i < orderselect_row.length; i++) {
        let findIndex = order.indexOf(orderselect_row[i]);
        if (findIndex > -1) {
          for (let j = 0; j < inventories.Invs.length; j++) {
            if (inventories.Invs[j].id === orderselect_row[i]) {
              let arInfo = inventories.Invs[j];
              let currentId = order2[findIndex].id;
              if (arInfo.OrderQuantity !== null && arInfo.OrderQuantity !== 0) {
                //update
                await API.graphql(
                  graphqlOperation(updateArAgencyOrderInfo, {
                    input: {
                      id: currentId, Agency_id: agencyId,
                      QuoteNumber: oldQuoteNumber, Product_Code: arInfo.Product_Code,
                      Product_Name_j: arInfo.Product_Name_j, OrderQuantity: parseFloat(arInfo.OrderQuantity),
                      Wholes_Rate: arInfo.Wholes_Rate, Wholes_Price: arInfo.Wholes_Price,
                      Campaign_price: arInfo.Catarog_Price,
                      Product_id: arInfo.id,
                      Quantity: arInfo.TempInventoryQuantity,
                      SalesGroup: arInfo.SalesGroup,
                      delflg: '',
                      DetailNo: count * 10
                    }
                  }))
                count++;
              }
              else {
                // select order OrderQuantity has changed to 0
                //Cancel an order with a quantity of 0
                await API.graphql(
                  graphqlOperation(updateArAgencyOrderInfo, {
                    input: {
                      id: currentId, Agency_id: agencyId,
                      QuoteNumber: oldQuoteNumber, Product_Code: arInfo.Product_Code,
                      Product_Name_j: arInfo.Product_Name_j, OrderQuantity: 0,
                      Wholes_Rate: arInfo.Wholes_Rate, Wholes_Price: arInfo.Wholes_Price,
                      Campaign_price: arInfo.Catarog_Price,
                      Product_id: arInfo.id,
                      Quantity: arInfo.TempInventoryQuantity,
                      SalesGroup: arInfo.SalesGroup,
                      delflg: 'Z1',
                    }
                  })
                );
                count++;
              }
              order.splice(findIndex, 1);
              order2.splice(findIndex, 1)
            }
            // continue;
          }
        } else {
          for (let j = 0; j < inventories.Invs.length; j++) {
            let arCreatInfo = inventories.Invs[j];
            if (orderselect_row[i] === arCreatInfo.id) {
              //create order
              await API.graphql(
                graphqlOperation(createArAgencyOrderInfo, {
                  input: {
                    id: uuidv4(), Agency_id: agencyId,
                    QuoteNumber: oldQuoteNumber, Product_Code: arCreatInfo.Product_Code,
                    Product_Name_j: arCreatInfo.Product_Name_j, OrderQuantity: parseFloat(arCreatInfo.OrderQuantity),
                    Wholes_Rate: arCreatInfo.Wholes_Rate, Wholes_Price: arCreatInfo.Wholes_Price,
                    Campaign_price: arCreatInfo.Catarog_Price,
                    Product_id: arCreatInfo.id,
                    Quantity: arCreatInfo.TempInventoryQuantity,
                    SalesGroup: arCreatInfo.SalesGroup,
                    delflg: '',
                    DetailNo: count * 10
                  }
                })
              );
              count++;
            }
          }
        }
      }
      //delete canceled orders
      console.log("order2..", order2.length)
      for (let i = 0; i < order2.length; i++) {
        if(order2[i].OrderQuantity !== 0){
          console.log("The order is canceled, and the quantity is not 0, the email will be sent",order2[i]);
        }
        await API.graphql(
          graphqlOperation(updateArAgencyOrderInfo, {
            input: {
              id: order2[i].id, Agency_id: agencyId,
              Product_Code: order2[i].Product_Code,
              QuoteNumber: oldQuoteNumber,
              OrderQuantity: 0,
              delflg: 'Z1',
              DetailNo: count * 10
            }
          })
        );
        count++;
      }
      history.push({ pathname: '/Order', state: { QuoteNumber: oldQuoteNumber } });
    } else {
      await API.graphql(
        graphqlOperation(createArOrder, { input: { id: id, Status: '1', QuoteNumber: QuoteNumber, RegistrationDate: hopedateValue, AgencyID: agencyId } })
      );
      for (let i = 0; i < orderselect_row.length; i++) {
        // let OrderQuantity = document.getElementById(orderselect_row[i]).value;
        for (let j = 0; j < inventories.Invs.length; j++) {
          if (inventories.Invs[j].id === orderselect_row[i]) {
            await API.graphql(
              graphqlOperation(createArAgencyOrderInfo, {
                input: {
                  id: uuidv4(), Agency_id: agencyId,
                  QuoteNumber: QuoteNumber, Product_Code: inventories.Invs[j].Product_Code,
                  Product_Name_j: inventories.Invs[j].Product_Name_j, OrderQuantity: parseFloat(inventories.Invs[j].OrderQuantity),
                  Wholes_Rate: inventories.Invs[j].Wholes_Rate, Wholes_Price: inventories.Invs[j].Wholes_Price,
                  Campaign_price: inventories.Invs[j].Catarog_Price,
                  Product_id: inventories.Invs[j].id,
                  Quantity: inventories.Invs[j].TempInventoryQuantity,
                  SalesGroup: inventories.Invs[j].SalesGroup,
                  delflg: '',
                  DetailNo: 10 * (i + 1)
                }
              })
            );
            break;
          }
        }
      }
      console.log(QuoteNumber)
      history.push({ pathname: '/Order', state: { QuoteNumber: QuoteNumber } });
    }
  }
  const theme = useTheme();
  const [priceGroup, setPriceGroup] = React.useState('');
  const initialAgencyPrice = { Invs: [] };
  const reducerAgencyPrice = (state, action) => {
    let obj = [];
    switch (action.type) {
      case QUERY:
        for (let i = 0; i < action.Invs.length; i++) {
          obj.push(action.Invs[i].Admin_Agency_Price_Group)
        }
        console.log("obj[0]", obj[0])
        setPriceGroup(obj[0]);
        return { ...state, Invs: obj };
      default:
        return state;
    }
  };
  let [selectAgencyPriceOptions, setAgencyPriceGroup] = useReducer(reducerAgencyPrice, initialAgencyPrice);

  async function listInvData2(agentGroupID) {

    setInv({ type: QUERY, Invs: [] });
    const InvData = await API.graphql(graphqlOperation(agencyGroupSortList, { Agency_Price_Group: agentGroupID, sortDirection: "DESC", limit: 10000 }));
    let nextToken = InvData.data.AgencyGroupSortList.nextToken;
    let dataAll = InvData.data.AgencyGroupSortList.items
    while (nextToken !== null) {
      let InvDataSec = await API.graphql(graphqlOperation(agencyGroupSortList, { Agency_Price_Group: agentGroupID, sortDirection: "DESC", limit: 10000, nextToken: nextToken }));
      nextToken = InvDataSec.data.AgencyGroupSortList.nextToken;
      for (let i = 0; i < InvDataSec.data.AgencyGroupSortList.items.length; i++) {
        dataAll.push(InvDataSec.data.AgencyGroupSortList.items[i]);
      }
    }
    let allSupplier = [];
    for (let i = 0; i < dataAll.length; i++) {
      allSupplier.push(dataAll[i].Supplier);
    }
    let distinctSupplier = []
    let hash = {}
    distinctSupplier = allSupplier.reduce((item, next) => {
      hash[next] ? '' : hash[next] = true && item.push(next)
      return item
    }, [])
    setSupplier({ type: QUERY, Invs: distinctSupplier });
    setInv({ type: QUERY, Invs: dataAll });
  }

  const handleChange = (event) => {
    console.log("handleChange");
    setPriceGroup(event.target.value);
    listInvData2(event.target.value);
  };
  //日付を変更するには、ジャンプします
  const DateFun = () => {
    if (loginDisplay === false) {
      return ''
    }
    if (loginDisplay === true) {
      if (location.state) {
        let str = location.state.DesiredDeliveryDate.replace(/\//g, '-');
        return str
      } else {
        return "";
      }
    }
  }
  return (
    <Container style={{ backgroundColor: '', 'minWidth': '85vw', 'minHeight': '74vh' }}>
      <div>
        <Meta title={pageTitle} />
      </div>
      <br />
      <Row>
        <Col>
          <ToolkitProvider
            keyField="id"
            data={inventories.Invs}
            columns={columns}
            search
            columnToggle
            headerWrapperClasses="foo"
            wrapperClasses="boo"
            exportCSV={authFlg}
          >
            {
              props => (
                <div>
                  <div>
                    <Row>
                      <Col >
                      {/* className="form-control" style={{ backgroundColor: 'pink', 'fontSize': '18px', height: '40px', padding: '10px 16px', 'lineHeight': '1.3333333', 'borderRadius': '6px' }} */}
                        <SearchBar style = {{height:'40px',width:'300px'}} {...props.searchProps} />
                        <ClearSearchButton className="btn btn-secondary " style = {{height:'40px',padding:'5px',margin:'10px'}} {...props.searchProps} />
                      </Col>
                      <Col >
                        <MyExportCSV {...props.csvProps} ></MyExportCSV ></Col>
                      <Col >
                        <MyExportCSV2 {...props.csvProps} ></MyExportCSV2 >
                      </Col>
                      <Col>
                        <FormControl hidden={adminAuthFlg} fullWidth>
                          <InputLabel id="demo-simple-select-label">価格グループ</InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={priceGroup}
                            onChange={handleChange}
                            input={<OutlinedInput label="Name" />}
                            MenuProps={MenuProps}
                            autoWidth
                          >
                            {selectAgencyPriceOptions.Invs.map((name) => (
                              <MenuItem
                                key={name}
                                value={name}
                                style={getStyles(name, priceGroup, theme)}
                              >
                                {name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Col>
                      <Col>
                        <InputGroup className="mb-3" style={{ display: (loginDisplay ? 'block' : 'none') }}>
                          <Col align="center">
                            <InputGroup.Text className={classes.textFieldHope} id="basic-from" >希望納期<span style={{ color: 'red' }}>［必須］</span></InputGroup.Text>
                            <TextField
                              id="hopedate"
                              label=""
                              type="date"
                              className={classes.textFieldPink}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              defaultValue={DateFun()}
                            />
                          </Col><Col align="right" ><Button variant="contained" type="button" color="primary" className={classes.textFieldBu} onClick={() => { orderClick(); }} style={{ display: (loginDisplay ? 'block' : 'none') }}>登録</Button>
                          </Col>
                        </InputGroup>
                      </Col>
                    </Row>
                  </div>
                  <hr />
                  <div >
                    <BootstrapTable
                      bootstrap4
                      keyField='id'
                      data={inventories.Invs}
                      caption="表示価格は税別"
                      columns={columns}
                      {...props.baseProps}
                      pagination={paginationFactory(options)}
                      defaultSorted={defaultSorted}
                      selectRow={selectRow}
                      filter={filterFactory()}
                      defaultSortDirection="desc"
                      filterPosition='inline'
                      headerWrapperClasses="foo"
                      wrapperClasses="boo"
                      noDataIndication={'no results found'}
                      cellEdit={cellEditFactory({ mode: 'click', blurToSave: true })}
                    />
                  </div>
                  <hr />
                  <span>表記させる項目をこのアイコンでお選び頂けます</span><br />
                  <CustomToggleList {...props.columnToggleProps} />
                  <hr />
                </div>
              )
            }
          </ToolkitProvider>
        </Col>
      </Row>
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

  );

}



export default InventorySearch