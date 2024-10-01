/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateVirtueRecord = /* GraphQL */ `
  subscription OnCreateVirtueRecord(
    $filter: ModelSubscriptionVirtueRecordFilterInput
    $owner: String
  ) {
    onCreateVirtueRecord(filter: $filter, owner: $owner) {
      id
      userId
      dateVirtueID
      virtueID
      status
      date
      weekNumber
      weekVirtueID
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const onUpdateVirtueRecord = /* GraphQL */ `
  subscription OnUpdateVirtueRecord(
    $filter: ModelSubscriptionVirtueRecordFilterInput
    $owner: String
  ) {
    onUpdateVirtueRecord(filter: $filter, owner: $owner) {
      id
      userId
      dateVirtueID
      virtueID
      status
      date
      weekNumber
      weekVirtueID
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const onDeleteVirtueRecord = /* GraphQL */ `
  subscription OnDeleteVirtueRecord(
    $filter: ModelSubscriptionVirtueRecordFilterInput
    $owner: String
  ) {
    onDeleteVirtueRecord(filter: $filter, owner: $owner) {
      id
      userId
      dateVirtueID
      virtueID
      status
      date
      weekNumber
      weekVirtueID
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
