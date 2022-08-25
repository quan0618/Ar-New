/* eslint-disable no-irregular-whitespace */
/* ar-brown App (C) 2021 arbrown.co.jp All rights reserved.
 *******************************************************************************
 * Program ID:  Order.js
 * $Revision:   Ver1.0
 * $Modtime:    $
 *******************************************************************************
 * Author      (作成／更新年月日、担当者)
 *  2022/03/30 Rayoo)li : 新規作成
 *
 * Summary Order画面
 *
 * Instructions / Preconditions
 *  なし
 *
 *******************************************************************************
 */
import { Container, Row, Col, InputGroup, FormControl } from 'react-bootstrap'
import moment from 'moment';
import React, { useEffect, useReducer, useState } from 'react';
// import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import BootstrapTable from 'react-bootstrap-table-next';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
const TAX_RATE = 0.1;
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Radio from '@material-ui/core/Radio';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import { useLocation } from 'react-router-dom';
import { orderByQuoteNumber, listArAgencyOrderInfos, arCustomerByAgencyIDContractor, arCustomerByAgencyID, getArAZCustomerCode } from '../graphql/queries';
import API, { graphqlOperation } from '@aws-amplify/api';
import { updateArOrder, updateArAgencyOrderInfo } from '../graphql/mutations';
import { useHistory } from "react-router-dom";
import DialogContentText from '@material-ui/core/DialogContentText';
import { createArCustomer, updateArCustomer } from '../graphql/mutations';
import { customerByeMail } from '../graphql/queries';
import { Auth } from 'aws-amplify';
import { v4 as uuidv4 } from 'uuid';
import { Select, MenuItem, InputLabel, OutlinedInput } from '@material-ui/core';
import { FormControl as FormControlsk } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';

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
  textFieldP: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    // width: '20ch',
    'text-align': 'right',
    align: 'right'
  },
  textFieldOrderQuantity: {
    align: 'right',
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
}));
function getStyles(name, contractorGroup, theme) {
  return {
    fontWeight:
      contractorGroup.indexOf(name) === -1
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
      width: 400,
    },
  },
};
const headerStyle = { backgroundColor: '#D3D3D3' }

function getSteps() {
   return ['受注受付', '受付処理中', '納期確定', '受注キャンセル'];
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
const QUERY = 'QUERY';
const QUERY_ZA = 'QUERY_ZA';
let orderID = '';
let agencyId = '';
let addressId = '';
let invoiceSubtotal = '';
let invoiceFax = '';
let invoiceTotal = '';
let invoicePayTotal = '';

const Order = () => {
  const location = useLocation();
  const history = useHistory();
  const classes = useStyles();
  const steps = getSteps();
  const [orderNoText, setOrderNo] = React.useState(Object);
  const handleSetOrderNoText = (Object) => {
    setOrderNo(Object);
  };
  const [orderNumber2, setOrderNumber2] = React.useState(Object);
  const handleSetOrderNumber2Text = (Object) => {
    setOrderNumber2(Object);
  };
  const [orderDataText, setOrderData] = React.useState(Object);
  const handleSetOrderDataText = (Object) => {
    setOrderData(Object);
  };
  const [mitumoriNoText, setMitumoriNo] = React.useState(Object);
  const handleSetMitumoriNoText = (Object) => {
    setMitumoriNo(Object);
  };
  const [telText, setTel] = React.useState(Object);
  const handleSetTelText = (Object) => {
    setTel(Object);
  };
  const [CompanyName, setCompanyName] = React.useState(Object);
  const handleSetCompanyName = (Object) => {
    setCompanyName(Object);
  };
  const [RegisteredPerson, setMitumoriName] = React.useState(Object);
  const handleSetRegisteredPerson = (Object) => {
    setMitumoriName(Object);
  };
  const [emailText, setEmail] = React.useState(Object);
  const handleSetEmailText = (Object) => {
    setEmail(Object);
  };
  const [shipping, setShipping] = React.useState(Object);
  const handleSetShipping = (Object) => {
    setShipping(Object);
  };
  const [shippingNm, setShippingNm] = React.useState(Object);
  const handleSetShippingNm = (Object) => {
    setShippingNm(Object);
  };
  const [contractorId, setcontractorId] = React.useState(Object);
  const[endUserId,setEndUserId] = React.useState(Object);
  const handlecontractorId = (Object) => {
    setcontractorId(Object);
  };
  const handleEndUserId = (Object) => {
    setEndUserId(Object);
  };
  const [contractorNm, setcontractorNm] = React.useState(Object);
  const handlecontractorNm = (Object) => {
    setcontractorNm(Object);
  };
  const [endUserNm,setEndUserNm] = React.useState(Object);
  const handleEndUserNm = (Object) => {
    setEndUserNm(Object);
  };
  const [SalesOfficeName, setGroupName] = React.useState(Object);
  const handleSetSalesOfficeName = (Object) => {
    setGroupName(Object);
  };
  const [ARBSalesRepresentative, setARBSalesRepresentative] = React.useState(Object);
  const handleSetARBSalesRepresentative = (Object) => {
    setARBSalesRepresentative(Object);
  };
  const [ProcurementStaff, setOrderPerson] = React.useState(Object);
  const handleSetProcurementStaff = (Object) => {
    setOrderPerson(Object);
  };
  const [error, setError] = React.useState(Object);
  const handleSetError = (Object) => {
    setError(Object);
  };
  const [errorFlg, setErrorFlg] = React.useState(Object);
  const handleSetErrorFlg = (Object) => {
    setErrorFlg(Object);
  };

  const [RegistrationDate, setRegistrationDate] = React.useState(Object);
  const handleSetRegistrationDate = (Object) => {
    setRegistrationDate(Object);
  };
  const [OrderDate, setOrderDate] = React.useState(Object);
  const handleSetOrderDate = (Object) => {
    setOrderDate(Object);
  };
  const [EstimatedShippingDate, setEstimatedShippingDate] = React.useState(Object);
  const handleSetEstimatedShippingDate = (Object) => {
    setEstimatedShippingDate(Object);
  };
  const [ShipDate, setShipDate] = React.useState(Object);
  const handleSetShipDate = (Object) => {
    setShipDate(Object);
  };
  const [DeliveryYtDate, setDeliveryYtDate] = React.useState(Object);
  const handleSetDeliveryYtDate = (Object) => {
    setDeliveryYtDate(Object);
  };
  const [DeliveryDate, setDeliveryDate] = React.useState(Object);
  const handleSetDeliveryDate = (Object) => {
    setDeliveryDate(Object);
  };
  const [flg, setInvoiceSubtotal] = React.useState(Object);
  const handleSetflg = (Object) => {
    setInvoiceSubtotal(Object);
  };

  const [msg1, setMsgId] = React.useState(Object);
  const handleSetMsgId = (Object) => {
    setMsgId(Object);
  };
  const [title, setTitle] = React.useState(Object);
  const handleSetTitle = (Object) => {
    setTitle(Object);
  };
  const [msgText, setMsgText] = React.useState(Object);
  const handleSetMsgText = (Object) => {
    setMsgText(Object);
  };
  const [buttonText, setButtonText] = React.useState(Object);
  const handleSetButtonText = (Object) => {
    setButtonText(Object);
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
  const [orderinfo, setOrderinfo] = useState([]);
  const [addressList, setAddress] = useState([]);

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
    for(let j = 0;j < orderinfo.length;j++){
      if(parseFloat(orderinfo[j].OrderQuantity) * parseFloat(moneytonum(orderinfo[j].Campaign_price)) * parseFloat(toPoint(orderinfo[j].Wholes_Rate)) > 0 && parseFloat(orderinfo[j].OrderQuantity) * parseFloat(moneytonum(orderinfo[j].Campaign_price)) * parseFloat(toPoint(orderinfo[j].Wholes_Rate)) <= 5000){
          postageSum += 1000;
      }
    }
    let sum = 0;
    for (let j = 0; j < orderinfo.length; j++) {
      sum = sum + parseFloat(orderinfo[j].OrderQuantity) * parseFloat(moneytonum(orderinfo[j].Campaign_price)) * parseFloat(toPoint(orderinfo[j].Wholes_Rate));
    }
    invoiceSubtotal = numtomoney(sum, 0);
    invoiceFax = numtomoney(Math.round(sum * TAX_RATE), 0);
    invoiceTotal = numtomoney(postageSum,0);
    invoicePayTotal = numtomoney(Math.round(sum + sum * TAX_RATE + postageSum), 0);
    handleSetflg(invoicePayTotal);
  };
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
  useEffect(() => {

    async function listInvData() {
      let QuoteNumber = location.state.QuoteNumber;
      handleSetOrderNoText('');
      handleSetOrderNumber2Text('');
      handleSetRegistrationDate('');
      handleSetOrderDate('');
      handleSetEstimatedShippingDate('');
      handleSetShipDate('');
      handleSetDeliveryYtDate('');
      handleSetDeliveryDate('');
      handleSetOrderNumber2Text('');
      handleSetMitumoriNoText(QuoteNumber);
      handleSetTelText('');
      handleSetCompanyName('');
      handleSetRegisteredPerson('');
      handleSetEmailText('');
      handleSetSalesOfficeName('');
      handleSetProcurementStaff('');
      handleSetARBSalesRepresentative('');
      const orderByQuoteNumberIngo = await API.graphql(graphqlOperation(orderByQuoteNumber, { QuoteNumber: QuoteNumber }));

      if (orderByQuoteNumberIngo.data.orderByQuoteNumber !== null) {
        const order = orderByQuoteNumberIngo.data.orderByQuoteNumber['items'];

        if (order.length > 0) {
          let aa = moment(order[0].RegistrationDate).utcOffset(0).format('YYYY-MM-DD');
          orderID = order[0].id;
          handleSetOrderDataText(aa);
        }
      }
      let listArAgencyOrderInfo = await API.graphql(graphqlOperation(listArAgencyOrderInfos, { QuoteNumber: QuoteNumber }));
      if (listArAgencyOrderInfo.data.listArAgencyOrderInfos !== null) {
        const order = listArAgencyOrderInfo.data.listArAgencyOrderInfos['items'];
        for (let i = 0; i < order.length - 1; i++) {
          for (let j = 0; j < order.length - 1 - i; j++) {
            if (order[j].Product_id < order[j + 1].Product_id) {
              let temp = order[j];
              order[j] = order[j + 1];
              order[j + 1] = temp;
            }
          }
        }
        setOrderinfo(order);
        let sum = 0;
        for (let j = 0; j < order.length; j++) {
          sum = sum + parseFloat(order[j].OrderQuantity) * parseFloat(moneytonum(order[j].Campaign_price)) * parseFloat(toPoint(order[j].Wholes_Rate));
        }
        let postageSum = 0;
        for(let j = 0;j < order.length;j++){
          if(parseFloat(order[j].OrderQuantity) * parseFloat(moneytonum(order[j].Campaign_price)) * parseFloat(toPoint(order[j].Wholes_Rate)) > 0 && parseFloat(order[j].OrderQuantity) * parseFloat(moneytonum(order[j].Campaign_price)) * parseFloat(toPoint(order[j].Wholes_Rate)) <= 5000){
              postageSum += 1000;
          }
        }
        invoiceSubtotal = numtomoney(sum, 0);
        invoiceFax = numtomoney(Math.round(sum * TAX_RATE), 0);
        invoiceTotal = numtomoney(postageSum,0);
        invoicePayTotal = numtomoney(Math.round(sum + sum * TAX_RATE + postageSum), 0);
      }
      getAddressList();
    }

    listInvData();
  }, []);

  const theme = useTheme();
  const [contractorGroup, setContractor] = React.useState('');
  const [endUserGroup, setEndUserGroup] = React.useState('');
  const initialcontractor = { Invs: [] };
  // const initialSupplicant = {Invs:[]};
  // const initialPayerList = {Invs:[]};
  const handleContractorChange = (event) => {
    setContractor(event.target.value);
    let Contractor_temp = event.target.value;
    let ContractorID = Contractor_temp.split(':');
    handlecontractorId(ContractorID[0]);
    handlecontractorNm(ContractorID[1]);
  };

  const handleEndUserChange = (event) => {
    setEndUserGroup(event.target.value);
    let EndUser_temp = event.target.value;
    let EndUserId = EndUser_temp.split(':');
    handleEndUserId(EndUserId[0]);
    handleEndUserNm(EndUserId[1]);
  };

  const reducercontractor = (state, action) => {
    let obj = [];
    switch (action.type) {
      case QUERY:
        for (let i = 0; i < action.Invs.length; i++) {
          obj.push(action.Invs[i].CustomerCode + ':' + action.Invs[i].Name1)
          if (i === 0) {
            handlecontractorId(action.Invs[0].CustomerCode);
            handlecontractorNm(action.Invs[0].Name1);
          }
        }
        setContractor(obj[0]);
        return { ...state, Invs: obj };
        case QUERY_ZA:
          for (let i = 0; i < action.Invs.length; i++) {
            obj.push(action.Invs[i].CustomerCode + ':' + action.Invs[i].Name1)
            if (i === 0) {
              handleEndUserId(action.Invs[0].CustomerCode);
              handleEndUserNm(action.Invs[0].Name1);
            }
          }
          setEndUserGroup(obj[0]);
          return { ...state, Invs: obj };
      default:
        return state;
    }
  };
  let [selectContractorOptions, setContractorGroup] = useReducer(reducercontractor, initialcontractor);
  let [endUserOptions,setEndUsersOptions] = useReducer(reducercontractor, initialcontractor);
  // let [selectSupplicantList, setSupplicantList] = useReducer(reducercontractor, initialSupplicant);
  // let [selectPayerListList, setPayerListList] = useReducer(reducercontractor, initialPayerList);
  const getAddressList = async () => {
    const user = await Auth.currentUserInfo();
    const agencyPriceGroup = await API.graphql(graphqlOperation(customerByeMail, { Agency_Email: user.attributes.email }));
    const agentinfo = agencyPriceGroup.data.customerByeMail['items'];
    if (agentinfo.length > 0) {
      agencyId = agentinfo[0].Agency_id;
      //登録者
      handleSetRegisteredPerson('');
      //会社名
      handleSetCompanyName(agentinfo[0].Agency_Name);
      //営業所名
      handleSetSalesOfficeName(agentinfo[0].Company_Name);
    }
    const ContractorList = await API.graphql(graphqlOperation(arCustomerByAgencyIDContractor, { CustomerCodeKey: agencyId, filter: { AccounKey: { eq: "SP" } } }));
    if (ContractorList.data.arCustomerByAgencyID.items.length > 0) {
      setContractorGroup({ type: QUERY, Invs: ContractorList.data.arCustomerByAgencyID.items });
    }
    const EndUseList = await API.graphql(graphqlOperation(arCustomerByAgencyIDContractor, { CustomerCodeKey: agencyId, filter: { AccounKey: { eq: "ZA" } } }));

    if (EndUseList.data.arCustomerByAgencyID.items.length > 0) {
      setEndUsersOptions({ type: QUERY_ZA, Invs: EndUseList.data.arCustomerByAgencyID.items });
    }

    //請求先BP
    const SupplicantList = await API.graphql(graphqlOperation(arCustomerByAgencyIDContractor, { CustomerCodeKey: agencyId, filter: { AccounKey: { eq: "BP" } } }));
    if (SupplicantList.data.arCustomerByAgencyID.items.length > 0) {
      // setSupplicantList({type: QUERY,Invs:SupplicantList.data.arCustomerByAgencyID.items})
    }
    //支払人PY
    const PayerList = await API.graphql(graphqlOperation(arCustomerByAgencyIDContractor, { CustomerCodeKey: agencyId, filter: { AccounKey: { eq: "PY" } } }));
    if (PayerList.data.arCustomerByAgencyID.items.length > 0) {
      // setPayerListList({type: QUERY,Invs:PayerList.data.arCustomerByAgencyID.items})
    }
    // let listAddressInfo = await API.graphql(graphqlOperation(arAddressByAgencyID, { Agency_id: agencyId, sortDirection: "DESC" }));
    let listAddressInfo = await API.graphql(graphqlOperation(arCustomerByAgencyID, { CustomerCodeKey: agencyId, filter: { AccounKey: { eq: "SH" } } }));
    if (listAddressInfo.data.arCustomerByAgencyID !== null) {
      const address = listAddressInfo.data.arCustomerByAgencyID['items'];
      setAddress(address);
      setSelectedValue(address[0].id);
      handleSetShipping(address[0].CustomerCode);
      handleSetShippingNm(address[0].Name1);
      // 調達担当者
      // handleSetProcurementStaff(address[0].ProcurementStaff);
      //ARB担当営業
      // handleSetARBSalesRepresentative(address[0].ARBSalesRepresentative);
      handleSetTelText(address[0].FirstPhoneNumber);
      // handleSetEmailText(address[0].EmailAddress);
    }
  }
  // dialog
  const [open1, setOpen1] = React.useState(false);
  const [open3, setOpen3] = React.useState(false);
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

  const handleClose1 = () => {
    createArAddressFunction();
  };
  const handleClose4 = () => {
    updateArAddressFunction();
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
  };
  const handleClose2 = () => {
    setOpen1(false);
  };
  const handleClose3 = () => {
    setOpen3(false);
  };
  const [selectedValue, setSelectedValue] = React.useState(Object);
  const GridItems = () => (
    addressList.map(address => ({...address})).map(address => (
        address.id ? <Card className={classes.card1} key={address.CustomerCode}>
          <Radio
            checked={selectedValue === address.id}
            onChange={handleChange1}
            value={address.id}
            name="radio-button-demo"
            inputProps={{ 'aria-label': 'A' }}
            color="default"
          />
          <CardHeader
            avatar={
              <Avatar aria-label="recipe" className={classes.avatar}>
                D
              </Avatar>
            }
            title={address.Name1}
            subheader={selectedValue === address.id ? "選択済み" : ''}
          />
          <CardContent>
            <Typography variant="body2" color="textSecondary" component="div">
              <h6 style={{ color: 'purple', }}>名称　　:<span style={{ color: 'black' }}>{address.Name1}</span ></h6>
              <h6 style={{ color: 'purple', }}>地名　　:<span style={{ color: 'black' }}>{address.PlaceName}</span ></h6>
              <h6 style={{ color: 'purple', }}>郵便番号:<span style={{ color: 'black' }}>{address.PostCode}</span ></h6>
              <h6 style={{ color: 'purple', }}>国コード:<span style={{ color: 'black' }}>{address.CountryCode}</span ></h6>
              <h6 style={{ color: 'purple', }}>地域　　:<span style={{ color: 'black' }}>{address.Area}</span ></h6>
              <h6 style={{ color: 'purple', }}>電話番号:<span style={{ color: 'black' }}>{address.FirstPhoneNumber}</span></h6>
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small" onClick={() => { editClick(address.id) }}>Edit</Button>
          </CardActions>
        </Card> : ''
      ))
  );
  const handleChange1 = (event) => {
    setSelectedValue(event.target.value);
    for (let j = 0; j < addressList.length; j++) {
      if (addressList[j].id === event.target.value) {
        // //登録者
        // handleSetRegisteredPerson(addressList[j].RegisteredPerson);
        // //調達担当者
        // handleSetProcurementStaff(addressList[j].ProcurementStaff);
        // //会社名
        // handleSetCompanyName(addressList[j].CompanyName);
        // //営業所名
        // handleSetSalesOfficeName(addressList[j].SalesOfficeName);
        // //ARB担当営業
        // handleSetARBSalesRepresentative(addressList[j].ARBSalesRepresentative);
        handleSetTelText(addressList[j].PhoneNumber);
        handleSetEmailText(addressList[j].EmailAddress);
        handleSetShipping(addressList[j].CustomerCode);
        handleSetShippingNm(addressList[j].Name1);
        break;
      }
    }
  };
  /**
   *
   * @param {*} pushPage ページをジャンプする必要があるかどうか
   */
  function orderClick(pushPage) {
    updateArOrders(pushPage);
  }
  const updateArOrders = async (pushPage) => {

    if (orderDataText === '' && pushPage) {
      handleSetMsgId("エラー");
      handleSetMsgText("希望納期を入力してください");
      handleSetMsgBtnOK("はい")
      handleClickOpen2();
      return;
    }

    let date2;
    if (orderDataText.length > 17) {
      date2 = orderDataText + "T00:00.000Z";
    } else if (orderDataText.length > 0) {
      date2 = orderDataText + "T00:00:00.000Z";
    } else {
      date2 = '';
    }
    let updatStatus = pushPage ? '2' : '1';//1：一時保存 2：登録完了
    await API.graphql(
      graphqlOperation(updateArOrder, {
        input: {
          id: orderID,
          Status: updatStatus,/*登録完了 一時保存*/
          QuoteNumber: location.state.QuoteNumber, /*登録番号*/
          Insertperson: RegisteredPerson, /*登録者*/
          OrderNumber: orderNoText,/*発注番号*/
          DesiredDeliveryDate: date2,/*希望納期日 */
          ChouNumber: orderNumber2,/*注文番号 */
          OrderPerson: ProcurementStaff,/*調達担当者*/
          RegistrationDate: new Date(),/*登録日*/
          ChouDate: OrderDate,/*注文日*/
          CompanyName: CompanyName,/*会社名 */
          EstimatedShippingDate: EstimatedShippingDate,/*出荷予定日 */
          ShipDate: ShipDate,/*出荷日 */
          GroupName: SalesOfficeName,/*営業所名 */
          ARBSalesRepresentative: ARBSalesRepresentative,/*ARB担当営業 */
          DeliveryYtDate: DeliveryYtDate,/*納品予定日 */
          DeliveryDate: DeliveryDate,/*納品日 */
          TelNo: telText,
          Email: emailText,
          InvoicePayTotal: invoicePayTotal,
          Contractor: contractorId,
          ContractorNm: contractorNm,
          EndUserId :endUserId,
          endUserNm:endUserNm,
          ShippingDestination: shipping,
          ShippingDestinationNm: shippingNm,
          comments: oInput
        }
      })
    );
    for (let j = 0; j < orderinfo.length; j++) {
      await API.graphql(
        graphqlOperation(updateArAgencyOrderInfo, {
          input: {
            id: orderinfo[j].id, Agency_id: orderinfo[j].Agency_id, QuoteNumber: location.state.QuoteNumber, Product_Code: orderinfo[j].Product_Code,
            OrderQuantity: parseFloat(orderinfo[j].OrderQuantity),
          }
        })
      );
    }
    if(pushPage)
    history.push({ pathname: '/OrderConfirmation', state: { QuoteNumber: location.state.QuoteNumber } });
  }
  function addClick(Object) {
    history.push({ pathname: '/AddAddress', state: { CustomerCodeKey: agencyId } });
    handleClickOpen1(Object);
  }
  function txtChangedMitumoriNo(e) {
    handleSetMitumoriNoText(e.target.value)
  }

  function txtChangedCompanyName(e) {
    handleSetCompanyName(e.target.value)
  }
  function txtChangedRegisteredPerson(e) {
    handleSetRegisteredPerson(e.target.value)
  }
  function txtChangedSalesOfficeName(e) {
    handleSetSalesOfficeName(e.target.value)
  }
  function txtChangedARBSalesRepresentative(e) {
    handleSetARBSalesRepresentative(e.target.value)
  }
  function txtChangedProcurementStaff(e) {
    handleSetProcurementStaff(e.target.value)
  }
  function txtChangedOrderNo(e) {
    handleSetOrderNoText(e.target.value)
  }
  function txtChangedOrderData(e) {
    handleSetOrderDataText(e.target.value)
  }
  const [state, setState] = React.useState({
    checkedB: true,
  });
  const [oInput, setOinput] = React.useState('');
  function changeOinput(event) {
    setOinput(event.target.value);
  }
  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };
  function toPoint(percent) {
    let str = percent.replace("%", "");
    str = str / 100;
    return str;
  }

  const columns = [
    { dataField: 'id', text: 'ID', hidden: true, sort: true, editable: false, headerStyle },
    { dataField: 'Product_Name_j', text: '製品名', sort: true, editable: false, style: { margin: '0px', width: '300px' }, headerStyle },
    { dataField: 'Campaign_price', text: '定価', sort: true, align: 'right', editable: false, headerStyle },
    { dataField: 'Wholes_Rate', text: '仕切率', sort: true, align: 'right', editable: false, headerStyle },
    {
      dataField: 'Wholes_Price', text: '提供価格', sort: true, align: 'right', editable: false, headerStyle,
      formatter: (cellContent, row) => {
        return (
          <span>
            {numtomoney(parseFloat(moneytonum(row.Campaign_price)) * parseFloat(toPoint(row.Wholes_Rate)))}
          </span>
        );
      }
    },
    {
      dataField: 'OrderQuantity', text: '数量', type: 'number', align: 'right', style: { margin: '0px', width: '100px' }, sort: true, headerStyle,
      formatter: (cellContent, row) => {
        if (row.OrderQuantity !== null) {
          return (
            <div key={`${row.id}${row.OrderQuantity}`} >
              <ButtonGroup >
                <Button
                  aria-label="reduce"
                  onClick={() => {
                    handleSetCount(row, Math.max(parseFloat(row.OrderQuantity) - 1, 0), row.Quantity);
                  }}
                >
                  <RemoveIcon fontSize="small" />
                </Button>
                <TextField
                  id={row.id}
                  color="primary"
                  style={{ width: "100px", }}
                  type="number"
                  defaultValue={row.OrderQuantity}
                  name="count"
                  variant='outlined'
                  readOnly={true}
                  className={classes.textFieldOrderQuantity}
                  // 次の2つを無効にすると、入力ボックスに一度に複数を無制限に入力できます（値の変更による再レンダリングに関連します）
                  // value={row.OrderQuantity}
                  // onChange={(e) => { handleSetCount(row, e.target.value) }}
                  // データの双方向バインディングを実装する
                  // value={row.OrderQuantity}
                  // onChange={(e)=>onchangeValue(e.target.value)}
                  onBlur={(e) => { handleSetCount(row, e.target.value, row.Quantity) }}
                  onChange={(e) => { handleSetMax(row.id, row.Quantity, e.target.value) }}
                  InputProps={{ inputProps: { min: 0, max: row.Quantity } }}
                />
                <Button
                  aria-label="increase"
                  onClick={() => {
                    handleSetCount(row, Math.max(parseFloat(row.OrderQuantity) + 1, 0), row.Quantity);
                  }}
                >
                  <AddIcon fontSize="small" />
                </Button>
              </ButtonGroup>
            </div>
          );
        }
      }
    },
  ];
  // const columns2 = [
  //   { dataField: 'id', text: 'ID', hidden: true, sort: true, editable: false, headerStyle },
  //   { dataField: 'Contractor', text: '受注先', sort: true, editable: false, headerStyle },
  //   { dataField: 'Supplicant', text: '請求先', sort: true, align: 'right', editable: false, headerStyle },
  //   { dataField: 'Paper', text: '支払先', sort: true, align: 'right', editable: false, headerStyle },]
  return (
    <Container style={{ backgroundColor: '', 'minWidth': '85vw', 'minHeight': '74vh' }}>
      <Grid>
        <Stepper activeStep={-1} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Grid>
      <Grid>
        <Grid>
          <Row style={{
            borderRadius: '0.25em',
            color: 'purple',
            padding: '0.5em'
          }}>
            <h4>
              {/* <Col>登録情報</Col>
              <Col></Col> */}
              登録情報
            </h4>
          </Row>
        </Grid>
        <Row>
          <Col>
            <InputGroup className="mb-3">
              <InputGroup.Text className={classes.textField} id="basic-name">登録番号</InputGroup.Text>
              <FormControl
                placeholder=""
                aria-label=""
                aria-describedby="basic-name"
                id="mitumoriNo"
                className={classes.textField}
                value={mitumoriNoText}
                onChange={(e) => { txtChangedMitumoriNo(e) }}
                readOnly={true}
              />
            </InputGroup>
          </Col>
          <Col>
            <InputGroup className="mb-3">
              <InputGroup.Text className={classes.textField} id="basic-name">登録者</InputGroup.Text>
              <FormControl
                placeholder=""
                aria-label=""
                aria-describedby="basic-name"
                id="mitumoriName"
                className={classes.textField}
                value={RegisteredPerson}
                onChange={(e) => { txtChangedRegisteredPerson(e) }}
                readOnly={true}
              />
            </InputGroup>
          </Col>
          <Col>
            <InputGroup className="mb-3">
              <InputGroup.Text className={classes.textField} id="basic-name">発注番号</InputGroup.Text>
              <FormControl
                placeholder=""
                aria-label=""
                aria-describedby="basic-name"
                id="orderNo"
                className={classes.textField}
                value={orderNoText}
                onChange={(e) => { txtChangedOrderNo(e) }}
                maxLength="20"
              />
            </InputGroup>
          </Col>
          <Col>
            <InputGroup className="mb-3">
              <InputGroup.Text className={classes.textField} id="basic-name">希望納期日</InputGroup.Text>
              <TextField
                id="orderData"
                label=""
                type="date"
                className={classes.textField}
                InputLabelProps={{ shrink: true, }}
                value={orderDataText}
                onChange={(e) => { txtChangedOrderData(e) }}
              />
            </InputGroup></Col>
        </Row>
        <Row>
          <Col>
            <InputGroup className="mb-3">
              <InputGroup.Text className={classes.textField} id="basic-name">注文番号</InputGroup.Text>
              <FormControl
                placeholder=""
                aria-label=""
                aria-describedby="basic-name"
                id="orderNumber2"
                className={classes.textField}
                value={orderNumber2}
                readOnly={true}
              />
            </InputGroup>
          </Col>
          <Col>
            <InputGroup className="mb-3">
              <InputGroup.Text className={classes.textField} id="basic-name">調達担当者</InputGroup.Text>
              <FormControl
                placeholder=""
                aria-label=""
                aria-describedby="basic-name"
                id="orderPerson"
                className={classes.textField}
                value={ProcurementStaff}
                onChange={(e) => { txtChangedProcurementStaff(e) }}
                readOnly={true}
              />
            </InputGroup>
          </Col>
          <Col>
            <InputGroup className="mb-3">
              <InputGroup.Text className={classes.textField} id="basic-name">登録日</InputGroup.Text>
              <FormControl
                placeholder=""
                aria-label=""
                aria-describedby="basic-name"
                id="RegistrationDate"
                className={classes.textField}
                value={RegistrationDate}
                onChange={(e) => { handleSetRegistrationDate(e.target.value) }}
                readOnly={true}
              />
            </InputGroup></Col>
          <Col>
            <InputGroup className="mb-3">
              <InputGroup.Text className={classes.textField} id="basic-name">注文日</InputGroup.Text>
              <FormControl
                placeholder=""
                aria-label=""
                aria-describedby="basic-name"
                id="OrderDate"
                className={classes.textField}
                value={OrderDate}
                onChange={(e) => { handleSetOrderDate(e.target.value) }}
                readOnly={true}
              />
            </InputGroup>
          </Col>
        </Row>
        <Row>
          <Col xs={6}>
            <InputGroup className="mb-3">
              <InputGroup.Text className={classes.textField} id="basic-name">会社名</InputGroup.Text>
              <FormControl
                placeholder=""
                aria-label=""
                aria-describedby="basic-name"
                id="CompanyName"
                className={classes.textKField}
                value={CompanyName}
                onChange={(e) => { txtChangedCompanyName(e) }}
                readOnly={true}
              />
            </InputGroup>
          </Col>
          <Col>
            <InputGroup className="mb-3">
              <InputGroup.Text className={classes.textField} id="basic-name">出荷予定日</InputGroup.Text>
              <FormControl
                placeholder=""
                aria-label=""
                aria-describedby="basic-name"
                id="EstimatedShippingDate"
                className={classes.textKField}
                value={EstimatedShippingDate}
                onChange={(e) => { handleSetEstimatedShippingDate(e.target.value) }}
                readOnly={true}
              />
            </InputGroup>
          </Col>
          <Col>
            <InputGroup className="mb-3">
              <InputGroup.Text className={classes.textField} id="basic-name">出荷日</InputGroup.Text>
              <FormControl
                placeholder=""
                aria-label=""
                aria-describedby="basic-name"
                id="shipDate"
                className={classes.textKField}
                value={ShipDate}
                onChange={(e) => { handleSetShipDate(e.target.value) }}
                readOnly={true}
              />
            </InputGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            <InputGroup className="mb-3">
              <InputGroup.Text className={classes.textField} id="basic-name">営業所名</InputGroup.Text>
              <FormControl
                placeholder=""
                aria-label=""
                aria-describedby="basic-name"
                id="groupName"
                className={classes.textField}
                value={SalesOfficeName}
                onChange={(e) => { txtChangedSalesOfficeName(e) }}
                readOnly={true}
              />
            </InputGroup>
          </Col>
          <Col>
            <InputGroup className="mb-3">
              <InputGroup.Text className={classes.textField} id="basic-name">ARB担当営業</InputGroup.Text>
              <FormControl
                placeholder=""
                aria-label=""
                aria-describedby="basic-name"
                id="groupName"
                className={classes.textField}
                value={ARBSalesRepresentative}
                onChange={(e) => { txtChangedARBSalesRepresentative(e) }}
                readOnly={true}
              />
            </InputGroup>
          </Col>
          <Col>
            <InputGroup className="mb-3">
              <InputGroup.Text className={classes.textField} id="basic-name">納品予定日</InputGroup.Text>
              <FormControl
                placeholder=""
                aria-label=""
                aria-describedby="basic-name"
                id="DeliveryDate"
                className={classes.textField}
                value={DeliveryYtDate}
                onChange={(e) => { handleSetDeliveryYtDate(e.target.value) }}
                readOnly={true}
              />
            </InputGroup>
          </Col>
          <Col>
            <InputGroup className="mb-3">
              <InputGroup.Text className={classes.textField} id="basic-name">納品日</InputGroup.Text>
              <FormControl
                placeholder=""
                aria-label=""
                aria-describedby="basic-name"
                id="DeliveryDate"
                className={classes.textField}
                value={DeliveryDate}
                onChange={(e) => { handleSetDeliveryDate(e.target.value) }}
                readOnly={true}
              />
            </InputGroup>
          </Col>
        </Row>
      </Grid>
      <Grid>
        <Row>
          <Col>
            <Grid>
              <Grid>
                <Row style={{
                  borderRadius: '0.25em',
                  color: 'purple',
                  padding: '0.5em'
                }}>
                  <Col style={{width:'20%'}}>
                    <h4>
                      出荷先管理
                    </h4>
                  </Col>
                  {/* <Box sx ={{width:200,height:50}}>
                  <MUIFormControl fullWidth variant="outlined" size='small'>
                    <InputLabel id="demo-simple-select-label"> contractor</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={contractor}
                      label="Age"
                      onChange={handleChangeContractor}
                    >
                      <MenuItem value={10}>Ten</MenuItem>
                      <MenuItem value={20}>Twenty</MenuItem>
                      <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                  </MUIFormControl>
                  </Box> */}
                  <Col style={{width:'32%'}}>
                    <FormControlsk >
                      <InputLabel id="demo-simple-select-label" >エンドユーザー</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={endUserGroup}
                        onChange={handleEndUserChange}
                        input={<OutlinedInput label="Name" />}
                        MenuProps={MenuProps}
                        autoWidth
                      >
                        {endUserOptions.Invs.map((name) => (
                          <MenuItem
                            key={name}
                            value={name}
                            style={getStyles(name, endUserGroup, theme)}
                          >
                            {name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControlsk>
                  </Col>
                  <Col style={{width:'32%'}}>
                    <FormControlsk >
                      <InputLabel id="demo-simple-select-label" >受注先</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={contractorGroup}
                        onChange={handleContractorChange}
                        input={<OutlinedInput label="Name" />}
                        MenuProps={MenuProps}
                        autoWidth
                      >
                        {selectContractorOptions.Invs.map((name) => (
                          <MenuItem
                            key={name}
                            value={name}
                            style={getStyles(name, contractorGroup, theme)}
                          >
                            {name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControlsk>
                  </Col>
                  <Col style={{width:'16%'}} sx = {1} align="right" ><Button variant="outlined" style={{height:'60px'}} onClick={() => { addClick('add') }}><AddIcon />Add New Address</Button>
                  </Col>
                </Row>
              </Grid>
              <Row style={{
                borderRadius: '0.25em',
                color: 'purple',
                padding: '0.5em'
              }}>
                <GridItems />
              </Row>
            </Grid>
            <br />
          </Col>

          <Col>
            <Grid>
              <BootstrapTable
                bootstrap4
                keyField="id"
                caption={<CaptionElement />}
                data={orderinfo}
                columns={columns}
              />
            </Grid>
            <Grid>
              <TableContainer component={Paper}>
                <Table className={classes ? classes.table : undefined} aria-label="spanning table">
                  {/* <br />
                  <br /> */}
                  <TableBody>
                    <TableRow>
                      <TableCell rowSpan={4} />
                      <TableCell colSpan={2} >製品代金合計（税抜）</TableCell>
                      <TableCell colSpan={2} align="right">{invoiceSubtotal}円
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={2}>消費税（10%）</TableCell>
                      <TableCell colSpan={2} align="right">{invoiceFax}円</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={2}>送料</TableCell>
                      <TableCell colSpan={2} align="right">{invoiceTotal}円</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={2}>ご注文金額合計（税込）</TableCell>
                      <TableCell colSpan={2} align="right">{invoicePayTotal}円</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <br />
            {/* <>
            {/* <Grid>
              <BootstrapTable
                bootstrap4
                keyField="id"
                data={orderinfo}
                columns={columns2}
              />
            </Grid>
            <Grid>
              <TableContainer component={Paper}>
                <Table className={classes ? classes.table : undefined} aria-label="spanning table">
                    <br />
                  <br />
                   <TableRow>
                      <TableCell style={{ backgroundColor: '#D3D3D3',color:'black',fontWeight:'bolder',fontSize:'16px',textAlign:'center'}}>受注先</TableCell>
                      <TableCell style={{ backgroundColor: '#D3D3D3',color:'black',fontWeight:'bolder',fontSize:'16px',textAlign:'center'}}>請求先</TableCell>
                      <TableCell style={{ backgroundColor: '#D3D3D3',color:'black',fontWeight:'bolder',fontSize:'16px',textAlign:'center'}}>支払先</TableCell>
                    </TableRow>
                    <TableRow >
                      <TableCell><span >尾崎理化株式会社</span></TableCell>
                      <TableCell style={{textAlign:'center'}}>1</TableCell>
                      <TableCell style={{textAlign:'center'}}>2</TableCell>
                    </TableRow>
                    <TableRow>
                    <TableCell ><span>郵便番号</span></TableCell>
                      <TableCell style={{textAlign:'center'}}></TableCell>
                      <TableCell style={{textAlign:'center'}}></TableCell>
                    </TableRow>
                    <TableRow>
                   < TableCell ><span>住所</span></TableCell>
                      <TableCell style={{textAlign:'center'}}></TableCell>
                      <TableCell style={{textAlign:'center'}}></TableCell>
                    </TableRow>
                    <TableRow>
                   <TableCell > <span>住所２</span> </TableCell>
                      <TableCell style={{textAlign:'center'}}></TableCell>
                      <TableCell style={{textAlign:'center'}}></TableCell>
                    </TableRow>
                    <TableRow>
                   <TableCell > <span>ビル名</span></TableCell>
                      <TableCell style={{textAlign:'center'}}></TableCell>
                      <TableCell style={{textAlign:'center'}}></TableCell>
                    </TableRow>
                    <TableRow>
                    <TableCell ><span>電話番号</span></TableCell>
                      <TableCell style={{textAlign:'center'}}></TableCell>
                      <TableCell style={{textAlign:'center'}}></TableCell>
                    </TableRow>
                </Table>
                <TableBody>
        </TableBody>
              </TableContainer>
            </Grid></>
            <br /> */}
            <Col>
              <InputGroup className="mb-3">
                <InputGroup.Text className={classes.textField} id="basic-name">出荷先詳細</InputGroup.Text>
                <FormControl
                  placeholder=""
                  className={classes.textField}
                  value={oInput} onChange={changeOinput}
                  maxLength="20"
                />
              </InputGroup>
            </Col>
            <Grid>
              <Row>
                <Col xs={12} md={8} >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={state.checkedB}
                        onChange={handleChange}
                        name="checkedB"
                        color="primary"
                      />
                    }
                    label="Admin専用ボックス与信確認しないチェックボックス"
                  />
                </Col>
                <Col xs={6} md={4} align="right">
                  <div style={{display:'flex',textAlign:'center'}}>
                  <button className='btn btn-primary' onClick={() => { orderClick(false); }}>一時保存</button>
                  <button className='btn btn-primary' style={{marginLeft: '10px'}} hidden ={addressList.length === 0} onClick={() => { orderClick(true); }}>登録依頼</button>
                  </div>
                </Col>
              </Row>
              <div hidden={flg}></div>
            </Grid>
          </Col>
        </Row>
      </Grid>
      <Dialog
        open={open1}
        onClose={handleClose1}
       fullWidth
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
              readOnly = {true}
              onChange={(e) => { txtChangedAreaDialog(e.target.value) }}
              maxLength="3"
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
      <Dialog
        open={open3}
        onClose={handleClose1}
         fullWidth
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose4} variant="contained" color="primary" autoFocus>{buttonText}</Button>
          <Button onClick={handleClose3} variant="contained" color="primary">キャンセル</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Order