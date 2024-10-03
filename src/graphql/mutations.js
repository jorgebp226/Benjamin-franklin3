/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const updateVirtueStatus = /* GraphQL */ `
  mutation UpdateVirtueStatus($input: UpdateVirtueStatusInput!) {
    updateVirtueStatus(input: $input) {
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
export const createVirtueRecord = /* GraphQL */ `
  mutation CreateVirtueRecord(
    $input: CreateVirtueRecordInput!
    $condition: ModelVirtueRecordConditionInput
  ) {
    createVirtueRecord(input: $input, condition: $condition) {
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
export const updateVirtueRecord = /* GraphQL */ `
  mutation UpdateVirtueRecord(
    $input: UpdateVirtueRecordInput!
    $condition: ModelVirtueRecordConditionInput
  ) {
    updateVirtueRecord(input: $input, condition: $condition) {
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
export const deleteVirtueRecord = /* GraphQL */ `
  mutation DeleteVirtueRecord(
    $input: DeleteVirtueRecordInput!
    $condition: ModelVirtueRecordConditionInput
  ) {
    deleteVirtueRecord(input: $input, condition: $condition) {
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
