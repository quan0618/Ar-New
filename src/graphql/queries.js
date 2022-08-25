/* eslint-disable */
// this is an auto generated file. This will be overwritten
export const getArInventory = /* GraphQL */ `
  query GetArInventory($id: ID!, $Agency_Price_Group: ID!) {
    getArInventory(id: $id, Agency_Price_Group: $Agency_Price_Group) {
      id
      Agency_Price_Group
      Product_Code
      Supplier
      Product_Name_j
      Quantity
      Capacity_Display
      Catarog_Price
      Wholes_Rate
      Wholes_Price
      Delivery_Term
      Storage_Temp
      Capacity_Unit
      Capacity_Value
      Product_Name_e
      Plant_Name
      Wharehouse_Name
      Category1
      Category2
      Product_Group1
      Product_Group2
      Supplier_LotNo
      Expiration_date
      lastupdate
      updatedAt
      createdAt
    }
  }
`;
export const listArInventorys = /* GraphQL */ `
  query ListArInventorys(
    $id: ID
    $Agency_Price_Group: ModelIDKeyConditionInput
    $filter: ModelArInventoryFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listArInventorys(
      id: $id
      Agency_Price_Group: $Agency_Price_Group
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
        Agency_Price_Group
        Product_Code
        Supplier
        Product_Name_j
        Quantity
        Capacity_Display
        Catarog_Price
        Wholes_Rate
        Wholes_Price
        Delivery_Term
        Storage_Temp
        Capacity_Unit
        Capacity_Value
        Product_Name_e
        Plant_Name
        Wharehouse_Name
        Category1
        Category2
        Product_Group1
        Product_Group2
        Supplier_LotNo
        Expiration_date
        lastupdate
        updatedAt
        createdAt
      }
      nextToken
    }
  }
`;
export const getArAgency = /* GraphQL */ `
  query GetArAgency($Agency_id: ID!, $SubId: String!) {
    getArAgency(Agency_id: $Agency_id, SubId: $SubId) {
      Agency_id
      SubId
      Agency_Price_Group
      Company_Name
      eMail
      updatedAt
      createdAt
    }
  }
`;
export const listArAgencys = /* GraphQL */ `
  query ListArAgencys(
    $Agency_id: ID
    $SubId: ModelStringKeyConditionInput
    $filter: ModelArAgencyFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listArAgencys(
      Agency_id: $Agency_id
      SubId: $SubId
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        Agency_id
        SubId
        Agency_Price_Group
        Company_Name
        eMail
        updatedAt
        createdAt
      }
      nextToken
    }
  }
`;
export const getArCampaign = /* GraphQL */ `
  query GetArCampaign($Campaign_id: ID!, $Title: String!) {
    getArCampaign(Campaign_id: $Campaign_id, Title: $Title) {
      Campaign_id
      Title
      Term_From
      Term_To
      Text
      Discription
      Notification
      Remarks
      updatedAt
      createdAt
    }
  }
`;
// export const listArCampaigns = /* GraphQL */ `
//   query ListArCampaigns(
//     $Campaign_id: ID
//     $Title: ModelStringKeyConditionInput
//     $filter: ModelArCampaignFilterInput
//     $limit: Int
//     $nextToken: String
//     $sortDirection: ModelSortDirection
//   ) {
//     listArCampaigns(
//       Campaign_id: $Campaign_id
//       Title: $Title
//       filter: $filter
//       limit: $limit
//       nextToken: $nextToken
//       sortDirection: $sortDirection
//     ) {
//       items {
//         Campaign_id
//         Title
//         Term_From
//         Term_To
//         Text
//         Discription
//         Notification
//         Remarks
//         updatedAt
//         createdAt
//       }
//       nextToken
//     }
//   }
// `;
export const agencyGroupInvList = /* GraphQL */ `
  query AgencyGroupInvList(
    $Agency_Price_Group: ID
    $sortDirection: ModelSortDirection
    $filter: ModelArInventoryFilterInput
    $limit: Int
    $nextToken: String
  ) {
    AgencyGroupInvList(
      Agency_Price_Group: $Agency_Price_Group
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        Agency_Price_Group
        Product_Code
        Supplier
        Product_Name_j
        Quantity
        Capacity_Display
        Catarog_Price
        Wholes_Rate
        Wholes_Price
        Delivery_Term
        Storage_Temp
        Capacity_Unit
        Capacity_Value
        Product_Name_e
        Plant_Name
        Wharehouse_Name
        Category1
        Category2
        Product_Group1
        Product_Group2
        Supplier_LotNo
        Expiration_date
        lastupdate
        updatedAt
        createdAt
      }
      nextToken
    }
  }
`;
export const lastUpdateList = /* GraphQL */ `
  query LastUpdateList(
    $lastupdate: AWSDateTime
    $sortDirection: ModelSortDirection
    $filter: ModelArInventoryFilterInput
    $limit: Int
    $nextToken: String
  ) {
    LastUpdateList(
      lastupdate: $lastupdate
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        Agency_Price_Group
        Product_Code
        Supplier
        Product_Name_j
        Quantity
        Capacity_Display
        Catarog_Price
        Wholes_Rate
        Wholes_Price
        Delivery_Term
        Storage_Temp
        Capacity_Unit
        Capacity_Value
        Product_Name_e
        Plant_Name
        Wharehouse_Name
        Category1
        Category2
        Product_Group1
        Product_Group2
        Supplier_LotNo
        Expiration_date
        lastupdate
        updatedAt
        createdAt
      }
      nextToken
    }
  }
`;
export const customerByeMail = /* GraphQL */ `
  query customerByeMail(
    $Agency_Email: String
    $sortDirection: ModelSortDirection
    $filter: ModelArAgencyFilterInput
    $limit: Int
    $nextToken: String
  ) {
    customerByeMail(
      Agency_Email: $Agency_Email
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        Agency_id
        SubId
        Agency_Price_Group
        Agency_Name
        Company_Name
        Agency_Email
      }
      nextToken
    }
  }
`;

export const listArCampaigns = /* GraphQL */ `
  query ListArCampaigns(
    $id: ID
    $filter: ModelArCampaignFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listArCampaigns(
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
        Title
        Term_From
        Term_To
        Wholes_Rate_Condision
        Text
        Discription
        Notification
        Remarks
        filePDF
        PDFurl
        updatedAt
        createdAt
      }
      nextToken
    }
  }
`;

// export const listArCampaigns = /* GraphQL */ `
// query listArCampaigns {
//   listArCampaigns(limit: 10) {
//     items {
//       id
//       Title
//       TermFrom
//       TermTo
//       Text
//     }
//   }
// }
// `;
export const agencyGroupSortList = /* GraphQL */ `
  query AgencyGroupSortList(
    $Agency_Price_Group: ID
    $lastupdate: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelArInventoryFilterInput
    $limit: Int
    $nextToken: String
  ) {
    AgencyGroupSortList(
      Agency_Price_Group: $Agency_Price_Group
      lastupdate: $lastupdate
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        Product_Code
        Supplier
        Product_Name_j
        Quantity
        Capacity_Display
        Catarog_Price
        Wholes_Rate
        Wholes_Price
        Delivery_Term
        Storage_Temp
        Capacity_Unit
        Capacity_Value
        Product_Name_e
        Plant_Name
        Wharehouse_Name
        Category1
        Category2
        Product_Group1
        Product_Group2
        Supplier_LotNo
        Expiration_date
        lastupdate
        updatedAt
        createdAt
        Campaign_partition_rate
        Campaign_price
        LawsRegulations
        OrderQuantity
        TempInventoryQuantity
        SalesGroup
      }
      nextToken
    }
  }
`;

export const agencyGroupSortLastupdate = /* GraphQL */ `
  query AgencyGroupSortList(
    $Agency_Price_Group: ID
    $lastupdate: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelArInventoryFilterInput
    $limit: Int
    $nextToken: String
  ) {
    AgencyGroupSortList(
      Agency_Price_Group: $Agency_Price_Group
      lastupdate: $lastupdate
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        lastupdate
      }
      nextToken
    }
  }
`;

export const AdminAgencyPriceGroupSortList = /* GraphQL */ `
  query AdminAgencyPriceGroupSortList(
    $Admin_Group: String
    $sortDirection: ModelSortDirection
    $filter: ModelArInventoryFilterInput
    $limit: Int
    $nextToken: String
  ) {
    AdminAgencyPriceGroupSortList(
      Admin_Group: $Admin_Group
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        Admin_Agency_Price_Group
      }
      nextToken
    }
  }
`;

export const orderByQuoteNumber = /* GraphQL */ `
  query orderByQuoteNumber(
    $QuoteNumber: String
    $sortDirection: ModelSortDirection
    $filter: ModelArOrderFilterInput
    $limit: Int
    $nextToken: String
  ) {
    orderByQuoteNumber(
      QuoteNumber: $QuoteNumber
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
      Status
      QuoteNumber
      AgencyID
      Insertperson
      OrderNumber
      DesiredDeliveryDate
      ChouNumber
      OrderPerson
      RegistrationDate
      ChouDate
      CompanyName
      EstimatedShippingDate
      ShipDate
      GroupName
      ARBSalesRepresentative
      DeliveryYtDate
      DeliveryDate
      TelNo
      Email
      InvoicePayTotal
      Contractor
      ShippingDestination
      ContractorNm
      ShippingDestinationNm
      comments
      ShippingBlock
      }
      nextToken
    }
  }
`;

export const listArOrders = /* GraphQL */ `
  query listArOrders(
    $AgencyID: ID
    $QuoteNumber: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelArOrderFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listArOrders(
      AgencyID: $AgencyID
      QuoteNumber: $QuoteNumber
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
      Status
      QuoteNumber
      AgencyID
      Insertperson
      OrderNumber
      DesiredDeliveryDate
      ChouNumber
      OrderPerson
      RegistrationDate
      ChouDate
      CompanyName
      EstimatedShippingDate
      ShipDate
      GroupName
      ARBSalesRepresentative
      DeliveryYtDate
      DeliveryDate
      TelNo
      Email
      InvoicePayTotal
      }
      nextToken
    }
  }
`;
export const listArAgencyOrderInfos = /* GraphQL */ `
  query listArAgencyOrderInfos(
    $QuoteNumber: String
    $sortDirection: ModelSortDirection
    $filter: ModelArAgencyOrderInfoFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listArAgencyOrderInfos(
      QuoteNumber: $QuoteNumber
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        Agency_id
        QuoteNumber
        Product_Code
        Product_Name_j
        OrderQuantity
        Wholes_Rate
        Wholes_Price
        Campaign_price
        SalesGroup
        Quantity
        Product_id
        delflg
        DetailNo
      }
      nextToken
    }
  }
`;

export const getArAddress = /* GraphQL */ `
  query getArAddress($id: ID!) {
    getArAddress(id: $id) {
        id
        Agency_id
        RegisteredPerson
        ProcurementStaff
        CompanyName
        SalesOfficeName
        ARBSalesRepresentative
        PhoneNumber
        EmailAddress
    }
  }
`;
export const arAddressByAgencyID = /* GraphQL */ `
  query arAddressByAgencyID(
    $Agency_id: ID
    $sortDirection: ModelSortDirection
    $filter: ModelArAddressFilterInput
    $limit: Int
    $nextToken: String
  ) {
    arAddressByAgencyID(
      Agency_id: $Agency_id
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        Agency_id
        RegisteredPerson
        ProcurementStaff
        CompanyName
        SalesOfficeName
        ARBSalesRepresentative
        PhoneNumber
        EmailAddress
        updatedAt
      }
      nextToken
    }
  }
`;

export const arCustomerByAgencyIDContractor = /* GraphQL */ `
  query arCustomerByAgencyID(
    $CustomerCodeKey: ID, 
    $sortDirection: ModelSortDirection
    $filter: ModelArCustomerFilterInput
    $limit: Int
    $nextToken: String
  ) {
    arCustomerByAgencyID(
      CustomerCodeKey: $CustomerCodeKey
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ){
    items {
      id
      CustomerCode
      Name1
    }
    nextToken
  }
}
`;

export const arCustomerByAgencyID = /* GraphQL */ `
  query arCustomerByAgencyID(
    $CustomerCodeKey: ID, 
    $sortDirection: ModelSortDirection
    $filter: ModelArCustomerFilterInput
    $limit: Int
    $nextToken: String
  ) {
    arCustomerByAgencyID(
      CustomerCodeKey: $CustomerCodeKey
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ){
    items {
      id
      CustomerCodeKey
      AccounKey
      AccountingCode
      AddressTmeZone
      AllocationTohierarchy
      AnnualSales
      Area
      CountryCode
      CustomerAccountGroup
      CustomerCode
      ExportControlListConfirmationDate
      ExportControlSDNCheckDate
      ExportControlTDODate
      FirstPhoneNumber
      HonorificTitleKey
      InternationalCheckDigit
      InternationalPart1
      InternationalPart2
      LanguageCode
      Name1
      Name2
      Name3
      NonMilitaryUse
      NumberOfEmployees
      PlaceName
      PostCode
      Registrationyear
      SalesYear
      SearchTerm1
      TransactionClassification
    }
    nextToken
  }
}
`;
export const getArAZCustomerCode = /* GraphQL */ `
  query getArAZCustomerCode($id: ID!) {
    getArAZCustomerCode(id: $id) {
        id
        CustomerCodeNumber
    }
  }
`;
export const getArAgencyByAgencyid = /* GraphQL */ `
  query getArAgencyByAgencyid(
    $Agency_id: String!
    $sortDirection: ModelSortDirection
    $filter: ModelArAgencyFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getArAgencyByAgencyid(
      Agency_id: $Agency_id
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        Agency_id
        SubId
        Agency_Price_Group
        Agency_Name
        Company_Name
        Agency_Email
        id
      }
      nextToken
    }
  }
`;
