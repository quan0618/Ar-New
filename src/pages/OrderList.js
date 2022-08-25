/* eslint-disable no-irregular-whitespace */
/* ar-brown App (C) 2021 arbrown.co.jp All rights reserved.
 *******************************************************************************
 * Program ID:  Orderlist.js
 * $Revision:   Ver1.0
 * $Modtime:    $
 *******************************************************************************
 * Author      (作成／更新年月日、担当者)
 *  2022/03/30 Rayoo)li : 新規作成
 *
 * Summary Orderlist画面
 *
 * Instructions / Preconditions
 *  なし
 *
 *******************************************************************************
 */
import React, { useEffect, useState } from 'react';
import userAuth from '../components/userAuth'
import BootstrapTable from 'react-bootstrap-table-next';
import { Container } from 'react-bootstrap'
import Button from '@material-ui/core/Button';
import { useHistory } from "react-router-dom";
import { listArOrders } from '../graphql/queries';
import API, { graphqlOperation } from '@aws-amplify/api';
import moment from 'moment';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import { Auth } from 'aws-amplify';
import { customerByeMail } from '../graphql/queries';
const customTotal = (from, to, size) => (
  <span className="react-bootstrap-table-pagination-total">
    Showing {from} to {to} of {size} Results
  </span>
);
const options = {
  paginationSize: 20,
  pageStartIndex: 1,
  showTotal: true,
  withFirstAndLast: true, // Hide the going to First and Last page button
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
    text: '20', value: 20
  }, {
    text: '100', value: 100
  }]
};
const { SearchBar, ClearSearchButton } = Search;
let AgencyID = '';
const OrderList = () => {
  const history = useHistory();
  const [userAuthValue, setUserAuthValue] = useState(true)
  const [orderinfo, setOrderinfo] = useState([]);
  useEffect(() => {
    async function listOrderData() {
      const userAuths = await userAuth();
      if (userAuths === '1') {
        setUserAuthValue(true);
      } else {
        setUserAuthValue(false);
      }
      const user = await Auth.currentUserInfo();
      const agencyPriceGroup = await API.graphql(graphqlOperation(customerByeMail, { Agency_Email: user.attributes.email }));
      const agentinfo = agencyPriceGroup.data.customerByeMail['items'];
      if (agentinfo.length > 0) {
        AgencyID = agentinfo[0].Agency_id;
      }
      const listArOrder = await API.graphql(graphqlOperation(listArOrders, { AgencyID: AgencyID }));
      if (listArOrder.data.listArOrders !== null) {
        const order = listArOrder.data.listArOrders['items'];
        for (let j = 0; j < order.length; j++) {
          if (order[j].RegistrationDate !== null && order[j].RegistrationDate !== '') {
            order[j].RegistrationDate = moment(order[j].RegistrationDate).utcOffset(0).format('YYYY/MM/DD');
          }
          if (order[j].OrderDate !== null && order[j].OrderDate !== '') {
            order[j].OrderDate = moment(order[j].OrderDate).utcOffset(0).format('YYYY/MM/DD');
          }
          if (order[j].DesiredDeliveryDate !== null && order[j].DesiredDeliveryDate !== '') {
            order[j].DesiredDeliveryDate = moment(order[j].DesiredDeliveryDate).utcOffset(0).format('YYYY/MM/DD');
          }
        }
        if(userAuths === '0'){
         let result = order.filter(item=>Number(item['Status']) > 2)
         console.log("result",result)
         setOrderinfo(result);
        }else{
          setOrderinfo(order);
        }
      }
    }
    listOrderData();
  }, []);

  function handleDelClick(id) {
    let allOrder = [];
    for (let i = 0; i < orderinfo.length; i++) {
      if (orderinfo[i].QuoteNumber !== id) {
        allOrder.push(orderinfo[i]);
      }
    }
    setOrderinfo(allOrder);
  }
  const defaultSorted = [{
    dataField: 'Status',
    order: 'asc'
  }];
  function handleEditClick(Status, QuoteNumber, DesiredDeliveryDate) {
    if (userAuthValue) {
      if (Status === '1') {
        history.push({ pathname: '/Order', state: { QuoteNumber: QuoteNumber } });
      } else if (Status === '2') {
        history.push({ pathname: '/OrderConfirmation', state: { QuoteNumber: QuoteNumber } });
      } else if (Status === "3") {
        history.push({ pathname: '/', state: { QuoteNumber: QuoteNumber, DesiredDeliveryDate: DesiredDeliveryDate } });
      } else {
        history.push({
          pathname: '/OrderConfirmation', state: {
            QuoteNumber: QuoteNumber,
          }
        });
      }
    } else {
      if (Status === '2') {
        history.push({ pathname: '/OrderConfirmation', state: { QuoteNumber: QuoteNumber } });
      } else if (Status === '3') {
        history.push({ pathname: '/OrderConfirmation', state: { QuoteNumber: QuoteNumber } });
      } else {
        history.push({
          pathname: '/OrderConfirmation', state: {
            QuoteNumber: QuoteNumber,
          }
        });
      }
    }
  }
  const headerStyle = { backgroundColor: '#D3D3D3' }
  let columns = [
    { dataField: 'id', text: 'ID', hidden: true, sort: true },
    {
      dataField: 'Status', text: 'ステータス', sort: true, headerStyle, formatter: (cellContent, row) => {
        if (row.Status === '1') {
          return (
            <div>
              {/* <Link to='/OrderConfirmation' component="button" variant="body2" onClick={() => { handleClick(row.QuoteNumber);}}>登録中</Link> */}
              一時保存
            </div>
          );
        } else if (row.Status === '2') {
          return (
            <div>
              {/* <Link to='/OrderConfirmation' component="button" variant="body2" onClick={() => { handleClick(row.QuoteNumber);}}></Link> */}
              一時保存(登録)
            </div>
          );
        } else if (row.Status === '3') {
          return (
            <div>
              {/* <Link to='/OrderConfirmation' component="button" variant="body2" onClick={() => { handleClick(row.QuoteNumber);}}></Link> */}
              受注受付
            </div>
          );
        } else if (row.Status === '4') {
          return (
            <div>
              {/* <Link to='/OrderConfirmation' component="button" variant="body2" onClick={() => { handleClick(row.QuoteNumber);}}></Link> */}
              受付処理中
            </div>
          );
        } else if (row.Status === '5') {
          return (
            <div>
              {/* <Link to='/OrderConfirmation' component="button" variant="body2" onClick={() => { handleClick(row.QuoteNumber);}}></Link> */}
              納期確定
            </div>
          );
        }
        else if (row.Status === '6') {
          return (
            <div>
              {/* <Link to='/OrderConfirmation' component="button" variant="body2" onClick={() => { handleClick(row.QuoteNumber);}}></Link> */}
              受注キャンセル
            </div>
          );
        }
      }
    },
    { dataField: 'QuoteNumber', text: '登録番号', sort: true, headerStyle },
    { dataField: 'ChouNumber', text: '注文番号', sort: true, headerStyle },
    { dataField: 'OrderNumber', text: '発注番号', sort: true, headerStyle },
    {
      dataField: 'InvoicePayTotal', text: '発注金額', align: 'right', sort: true, headerStyle,
    },
    { dataField: 'CompanyName', text: '納入先', sort: true, headerStyle },
    { dataField: 'RegistrationDate', text: '登録日', sort: true, headerStyle },
    { dataField: 'ChouDate', text: '注文日', sort: true, headerStyle },
    { dataField: 'DesiredDeliveryDate', text: '希望納期日', sort: true, headerStyle },
    { dataField: 'EstimatedShippingDate', text: '出荷予定日', sort: true, headerStyle },
    { dataField: 'DeliveryYtDate', text: '納品予定日', sort: true, headerStyle },
    {
      dataField: 'edit', text: '操作', headerStyle, formatter: (cellContent, row) => {
        if (row.count !== null) {
          if (userAuthValue === false) {
            // if(row.Status === '1'){
            //   return (
            //     <span></span>
            //   );
            // }else{
            //   return (
            //     <span>
            //       <div>
            //         <Button variant="contained" color="primary" onClick={() => { handleEditClick(row.Status, row.QuoteNumber, row.DesiredDeliveryDate); }}>
            //           編集
            //         </Button>
            //         <Button variant="contained" color="secondary" onClick={() => { handleDelClick(row.QuoteNumber); }}>
            //           削除
            //         </Button>
            //       </div></span>
            //   );
            // }
            return (
              <span>
                <Button variant="contained" color="primary" onClick={() => { handleEditClick(row.Status, row.QuoteNumber, row.DesiredDeliveryDate); }}>
                参照
                </Button>
              </span>
            );

          } else {
            if (row.count !== null) {
              return (
                <span>
                  <div>
                    <Button variant="contained" color="primary" onClick={() => { handleEditClick(row.Status, row.QuoteNumber, row.DesiredDeliveryDate); }}>
                      編集
                    </Button>
                    <Button variant="contained" color="secondary" onClick={() => { handleDelClick(row.QuoteNumber); }}>
                      削除
                    </Button>
                  </div></span>
              );
            }
          }
        }
      }
    }
  ];
  return (
    <Container style={{ backgroundColor: '', 'minWidth': '85vw', 'minHeight': '74vh' }}>
      <h4
        style={{
          borderRadius: '0.25em',
          textAlign: 'center',
          color: 'purple',
          border: '1px solid purple',
          padding: '0.5em'
        }}>
        発注一覧
      </h4>
      <ToolkitProvider
        keyField="id"
        data={orderinfo}
        columns={columns}
        search
        columnToggle
        headerWrapperClasses="foo"
        wrapperClasses="boo"
      >
        {
          props => (
            <div>
              <SearchBar className="form-control" style={{ backgroundColor: 'pink', 'fontSize': '18px', height: '40px', padding: '10px 16px', 'lineHeight': '1.3333333', 'borderRadius': '6px' }} {...props.searchProps} />
              <ClearSearchButton className="btn btn-success btn-lg" {...props.searchProps} />
              <BootstrapTable
                bootstrap4
                keyField="id"
                data={orderinfo}
                columns={columns}
                {...props.baseProps}
                pagination={paginationFactory(options)}
                noDataIndication={'no results found'}
                defaultSorted={defaultSorted}
              />  </div>
          )
        }
      </ToolkitProvider>
    </Container>
  );
}

export default OrderList