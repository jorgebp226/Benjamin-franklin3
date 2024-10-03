/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getVirtueRecordsByUserAndWeek = /* GraphQL */ `
  query GetVirtueRecordsByUserAndWeek($userId: ID!, $weekId: String!) {
    getVirtueRecordsByUserAndWeek(userId: $userId, weekId: $weekId) {
      id
      userId
      weekId
      virtueID
      weekStatus
      weekNumber
      weekVirtueID
      year
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const getVirtueRecord = /* GraphQL */ `
  query GetVirtueRecord($id: ID!) {
    getVirtueRecord(id: $id) {
      id
      userId
      weekId
      virtueID
      weekStatus
      weekNumber
      weekVirtueID
      year
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
        weekId
        virtueID
        weekStatus
        weekNumber
        weekVirtueID
        year
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
        weekId
        virtueID
        weekStatus
        weekNumber
        weekVirtueID
        year
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
export const virtueRecordsByWeek = /* GraphQL */ `
  query VirtueRecordsByWeek(
    $weekId: String!
    $sortDirection: ModelSortDirection
    $filter: ModelVirtueRecordFilterInput
    $limit: Int
    $nextToken: String
  ) {
    virtueRecordsByWeek(
      weekId: $weekId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        userId
        weekId
        virtueID
        weekStatus
        weekNumber
        weekVirtueID
        year
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
