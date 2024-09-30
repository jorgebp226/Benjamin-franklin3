// src/api/graphql/queries.js
export const listVirtues = /* GraphQL */ `
  query ListVirtues {
    listVirtues {
      items {
        id
        name
        description
      }
    }
  }
`;

export const getVirtueRecordsByVirtueAndDate = /* GraphQL */ `
  query VirtueRecordsByVirtueAndDate(
    $virtueID: ID!
    $date: AWSDate
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
        status
        date
        weekNumber
        weekVirtueID
      }
      nextToken
    }
  }
`;
