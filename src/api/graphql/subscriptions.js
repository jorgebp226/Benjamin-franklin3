/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateVirtue = /* GraphQL */ `
  subscription OnCreateVirtue(
    $filter: ModelSubscriptionVirtueFilterInput
    $owner: String
  ) {
    onCreateVirtue(filter: $filter, owner: $owner) {
      id
      name
      description
      records {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const onUpdateVirtue = /* GraphQL */ `
  subscription OnUpdateVirtue(
    $filter: ModelSubscriptionVirtueFilterInput
    $owner: String
  ) {
    onUpdateVirtue(filter: $filter, owner: $owner) {
      id
      name
      description
      records {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const onDeleteVirtue = /* GraphQL */ `
  subscription OnDeleteVirtue(
    $filter: ModelSubscriptionVirtueFilterInput
    $owner: String
  ) {
    onDeleteVirtue(filter: $filter, owner: $owner) {
      id
      name
      description
      records {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const onCreateVirtueRecord = /* GraphQL */ `
  subscription OnCreateVirtueRecord(
    $filter: ModelSubscriptionVirtueRecordFilterInput
    $owner: String
  ) {
    onCreateVirtueRecord(filter: $filter, owner: $owner) {
      id
      virtueID
      date
      weekNumber
      status
      weekVirtueID
      virtue {
        id
        name
        description
        createdAt
        updatedAt
        owner
        __typename
      }
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
      virtueID
      date
      weekNumber
      status
      weekVirtueID
      virtue {
        id
        name
        description
        createdAt
        updatedAt
        owner
        __typename
      }
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
      virtueID
      date
      weekNumber
      status
      weekVirtueID
      virtue {
        id
        name
        description
        createdAt
        updatedAt
        owner
        __typename
      }
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
