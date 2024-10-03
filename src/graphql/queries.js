/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getVirtueRecordByUserAndWeek = /* GraphQL */ `
  query GetVirtueRecordByUserAndWeek($userId: ID!, $weekId: String!) {
    getVirtueRecordByUserAndWeek(userId: $userId, weekId: $weekId) {
      id
      userId
      weekId
      weekNumber
      year
      weekVirtueId
      days
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
      weekNumber
      year
      weekVirtueId
      days
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
        weekNumber
        year
        weekVirtueId
        days
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
export const virtueRecordsByUserIdAndWeekId = /* GraphQL */ `
  query VirtueRecordsByUserIdAndWeekId(
    $userId: ID!
    $weekId: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelVirtueRecordFilterInput
    $limit: Int
    $nextToken: String
  ) {
    virtueRecordsByUserIdAndWeekId(
      userId: $userId
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
        weekNumber
        year
        weekVirtueId
        days
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
