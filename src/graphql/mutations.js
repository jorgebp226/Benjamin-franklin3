/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const updateVirtueRecordStatus = /* GraphQL */ `
  mutation UpdateVirtueRecordStatus(
    $id: ID!
    $dayIndex: Int!
    $newStatus: Int!
  ) {
    updateVirtueRecordStatus(
      id: $id
      dayIndex: $dayIndex
      newStatus: $newStatus
    ) {
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
export const createVirtueRecord = /* GraphQL */ `
  mutation CreateVirtueRecord(
    $input: CreateVirtueRecordInput!
    $condition: ModelVirtueRecordConditionInput
  ) {
    createVirtueRecord(input: $input, condition: $condition) {
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
export const updateVirtueRecord = /* GraphQL */ `
  mutation UpdateVirtueRecord(
    $input: UpdateVirtueRecordInput!
    $condition: ModelVirtueRecordConditionInput
  ) {
    updateVirtueRecord(input: $input, condition: $condition) {
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
export const deleteVirtueRecord = /* GraphQL */ `
  mutation DeleteVirtueRecord(
    $input: DeleteVirtueRecordInput!
    $condition: ModelVirtueRecordConditionInput
  ) {
    deleteVirtueRecord(input: $input, condition: $condition) {
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
export const updateVirtueStatusCustom = /* GraphQL */ `
  mutation UpdateVirtueStatusCustom($input: UpdateVirtueStatusInput!) {
    updateVirtueStatusCustom(input: $input) {
      id
      userId
      weekId
      weekVirtueId
      days
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
