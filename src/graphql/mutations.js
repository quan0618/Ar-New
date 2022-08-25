/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createArInventory = /* GraphQL */ `
  mutation CreateArInventory(
    $input: CreateArInventoryInput!
    $condition: ModelArInventoryConditionInput
  ) {
    createArInventory(input: $input, condition: $condition) {
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
export const updateArInventory = /* GraphQL */ `
  mutation UpdateArInventory(
    $input: UpdateArInventoryInput!
    $condition: ModelArInventoryConditionInput
  ) {
    updateArInventory(input: $input, condition: $condition) {
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
      TempInventoryQuantity
      lastupdate
      updatedAt
      createdAt
    }
  }
`;
export const deleteArInventory = /* GraphQL */ `
  mutation DeleteArInventory(
    $input: DeleteArInventoryInput!
    $condition: ModelArInventoryConditionInput
  ) {
    deleteArInventory(input: $input, condition: $condition) {
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
export const createArAgency = /* GraphQL */ `
  mutation CreateArAgency(
    $input: CreateArAgencyInput!
    $condition: ModelArAgencyConditionInput
  ) {
    createArAgency(input: $input, condition: $condition) {
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
export const updateArAgency = /* GraphQL */ `
  mutation UpdateArAgency(
    $input: UpdateArAgencyInput!
    $condition: ModelArAgencyConditionInput
  ) {
    updateArAgency(input: $input, condition: $condition) {
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
export const deleteArAgency = /* GraphQL */ `
  mutation DeleteArAgency(
    $input: DeleteArAgencyInput!
    $condition: ModelArAgencyConditionInput
  ) {
    deleteArAgency(input: $input, condition: $condition) {
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
// export const createArCampaign = /* GraphQL */ `
//   mutation CreateArCampaign(
//     $input: CreateArCampaignInput!
//     $condition: ModelArCampaignConditionInput
//   ) {
//     createArCampaign(input: $input, condition: $condition) {
//       id
//       Title
//       TermFrom
//       TermTo
//       Text
//       updatedAt
//       createdAt
//     }
//   }
// `;
export const createArCampaign = /* GraphQL */ `
  mutation CreateArCampaign(
    $input: CreateArCampaignInput!
    $condition: ModelArCampaignConditionInput
  ) {
    createArCampaign(input: $input, condition: $condition) {
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
  }
`;
export const deleteArCampaign = /* GraphQL */ `
  mutation DeleteArCampaign(
    $input: DeleteArCampaignInput!
    $condition: ModelArCampaignConditionInput
  ) {
    deleteArCampaign(input: $input, condition: $condition) {
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
  }
`;

// export const updateArCampaign = /* GraphQL */ `
//   mutation UpdateArCampaign(
//     $input: UpdateArCampaignInput!
//     $condition: ModelArCampaignConditionInput
//   ) {
//     updateArCampaign(input: $input, condition: $condition) {
//       id
//       Title
//       TermFrom
//       TermTo
//       Text
//       updatedAt
//       createdAt
//     }
//   }
// `;


export const updateArCampaign = /* GraphQL */ `
  mutation UpdateArCampaign(
    $input: UpdateArCampaignInput!
    $condition: ModelArCampaignConditionInput
  ) {
    updateArCampaign(input: $input, condition: $condition) {
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
  }
`;

export const createArOrder = /* GraphQL */ `
  mutation CreateArOrder(
    $input: CreateArOrderInput!
    $condition: ModelArOrderConditionInput
  ) {
    createArOrder(input: $input, condition: $condition) {
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
      comments
    }
  }
`;
export const updateArOrder = /* GraphQL */ `
  mutation UpdateArOrder(
    $input: UpdateArOrderInput!
    $condition: ModelArOrderConditionInput
  ) {
    updateArOrder(input: $input, condition: $condition) {
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
    }
  }
`;
export const deleteArOrder = /* GraphQL */ `
  mutation deleteArOrder(
    $input: DeleteArOrderInput!
    $condition: ModelArOrderConditionInput
  ) {
    deleteArOrder(input: $input, condition: $condition) {
      id
      QuoteNumber
    }
  }
`;
export const createArAgencyOrderInfo = /* GraphQL */ `
  mutation CreateArAgencyOrderInfo(
    $input: CreateArAgencyOrderInfoInput!
    $condition: ModelArAgencyOrderInfoConditionInput
  ) {
    createArAgencyOrderInfo(input: $input, condition: $condition) {
      id
      Agency_id
      QuoteNumber
      Product_Code
      Product_Name_j
      OrderQuantity
      Wholes_Rate
      Wholes_Price
      Campaign_price
      Product_id
      Quantity
      delflg
      DetailNo
    }
  }
`;
export const updateArAgencyOrderInfo = /* GraphQL */ `
  mutation UpdateArAgencyOrderInfo(
    $input: UpdateArAgencyOrderInfoInput!
    $condition: ModelArAgencyOrderInfoConditionInput
  ) {
    updateArAgencyOrderInfo(input: $input, condition: $condition) {
      id
      Agency_id
      QuoteNumber
      Product_Code
      Product_Name_j
      OrderQuantity
      Wholes_Rate
      Wholes_Price
      Campaign_price
      Product_id
      Quantity
      delflg
      DetailNo
    }
  }
`;
export const deleteArAgencyOrderInfo = /* GraphQL */ `
  mutation deleteArAgencyOrderInfo(
    $input: DeleteArAgencyOrderInfoInput!
    $condition: ModelArAgencyOrderInfoConditionInput
  ) {
    deleteArAgencyOrderInfo(input: $input, condition: $condition) {
      id
      Agency_id
      QuoteNumber
    }
  }
`;
export const createArAddress = /* GraphQL */ `
  mutation createArAddress(
    $input: CreateArAddressInput!
    $condition: ModelArAddressConditionInput
  ) {
    createArAddress(input: $input, condition: $condition) {
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
      createdAt
    }
  }
`;
export const deleteArAddress = /* GraphQL */ `
  mutation DeleteArAddress(
    $input: DeleteArAddressInput!
    $condition: ModelArAddressConditionInput
  ) {
    deleteArAddress(input: $input, condition: $condition) {
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
      createdAt
    }
  }
`;

export const updateArAddress = /* GraphQL */ `
  mutation UpdateArAddress(
    $input: UpdateArAddressInput!
    $condition: ModelArAddressConditionInput
  ) {
    updateArAddress(input: $input, condition: $condition) {
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
      createdAt
    }
  }
`;

export const createArCustomer = /* GraphQL */ `
  mutation createArCustomer(
    $input: CreateArCustomerInput!
    $condition: ModelArCustomerConditionInput
  ) {
    createArCustomer(input: $input, condition: $condition) {
      id
      CustomerCodeKey
      AccounKey
      CustomerCode
      CustomerAccountGroup
      HonorificTitleKey
      Name1
      Name2
      Name3
      SearchTerm1
      PlaceName
      PostCode
      CountryCode
      Area
      AddressTmeZone
      LanguageCode
      FirstPhoneNumber
      AccountingCode
      InternationalPart1
      InternationalPart2
      InternationalCheckDigit
      AllocationTohierarchy
      AnnualSales
      SalesYear
      NumberOfEmployees
      Registrationyear
      NonMilitaryUse
      ExportControlTDODate
      ExportControlSDNCheckDate
      ExportControlListConfirmationDate
      TransactionClassification
      
    }
  }
`;
export const deleteArCustomer = /* GraphQL */ `
  mutation DeleteArCustomer(
    $input: DeleteArCustomerInput!
    $condition: ModelArCustomerConditionInput
  ) {
    deleteArCustomer(input: $input, condition: $condition) {
      id
      CustomerCodeKey
      AccounKey
      CustomerCode
      CustomerAccountGroup
      HonorificTitleKey
      Name1
      Name2
      Name3
      SearchTerm1
      PlaceName
      PostCode
      CountryCode
      Area
      AddressTmeZone
      LanguageCode
      FirstPhoneNumber
      AccountingCode
      InternationalPart1
      InternationalPart2
      InternationalCheckDigit
      AllocationTohierarchy
      AnnualSales
      SalesYear
      NumberOfEmployees
      Registrationyear
      NonMilitaryUse
      ExportControlTDODate
      ExportControlSDNCheckDate
      ExportControlListConfirmationDate
      TransactionClassification
      
    }
  }
`;

export const updateArCustomer = /* GraphQL */ `
  mutation updateArCustomer(
    $input: UpdateArCustomerInput!
    $condition: ModelArCustomerConditionInput
  ) {
    updateArCustomer(input: $input, condition: $condition) {
      id
      CustomerCodeKey
      AccounKey
      CustomerCode
      CustomerAccountGroup
      HonorificTitleKey
      Name1
      Name2
      Name3
      SearchTerm1
      PlaceName
      PostCode
      CountryCode
      Area
      AddressTmeZone
      LanguageCode
      FirstPhoneNumber
      AccountingCode
      InternationalPart1
      InternationalPart2
      InternationalCheckDigit
      AllocationTohierarchy
      AnnualSales
      SalesYear
      NumberOfEmployees
      Registrationyear
      NonMilitaryUse
      ExportControlTDODate
      ExportControlSDNCheckDate
      ExportControlListConfirmationDate
      TransactionClassification      
    }
  }
`;
// export const updateArAZCustomerCode = /* GraphQL */ `
//   mutation updateArAZCustomerCode(
//     $input: UpdateArAZCustomerCodeInput!
//   ) {
//     updateArAZCustomerCode(input: $input) {
//       id
//       CustomerCodeNumber
//     }
//   }
// `;