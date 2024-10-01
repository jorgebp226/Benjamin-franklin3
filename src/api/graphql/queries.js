/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getVirtueRecord = /* GraphQL */ `
  query GetVirtueRecord($id: ID!) {
    getVirtueRecord(id: $id) {
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
export const listVirtueRecords = /* GraphQL */ `
  query ListVirtueRecords(
    $filter: ModelVirtueRecordFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listVirtueRecords(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const virtueRecordsByUser = /* GraphQL */ `
  query VirtueRecordsByUser(
    $userId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelVirtueRecordFilterInput
    $limit: Int
    $nextToken: String
  ) {
    virtueRecordsByUser(
      userId: $userId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const virtueRecordsByDateVirtue = /* GraphQL */ `
  query VirtueRecordsByDateVirtue(
    $dateVirtueID: String!
    $sortDirection: ModelSortDirection
    $filter: ModelVirtueRecordFilterInput
    $limit: Int
    $nextToken: String
  ) {
    virtueRecordsByDateVirtue(
      dateVirtueID: $dateVirtueID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
