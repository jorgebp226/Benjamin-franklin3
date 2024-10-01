// src/graphql/queries.js

export const getVirtue = /* GraphQL */ `
  query GetVirtue($id: ID!) {
    getVirtue(id: $id) {
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

export const listVirtues = /* GraphQL */ `
  query ListVirtues(
    $filter: ModelVirtueFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listVirtues(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
        name
        description
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

export const getVirtueRecord = /* GraphQL */ `
  query GetVirtueRecord($id: ID!) {
    getVirtueRecord(id: $id) {
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

export const listVirtueRecords = /* GraphQL */ `
  query ListVirtueRecords(
    $filter: ModelVirtueRecordFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listVirtueRecords(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
        virtueID
        date
        weekNumber
        status
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

export const virtueRecordsByVirtueAndDate = /* GraphQL */ `
  query VirtueRecordsByVirtueAndDate(
    $virtueID: ID!
    $date: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelVirtueRecordFilterInput
    $limit: Int
    $nextToken: String
  ) {
    virtueRecordsByVirtueAndDate(
      virtueID: $virtueID
      date: $date
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        virtueID
        date
        weekNumber
        status
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
