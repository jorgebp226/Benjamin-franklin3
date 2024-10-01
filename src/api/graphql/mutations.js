/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createVirtueRecord = /* GraphQL */ `
  mutation CreateVirtueRecord(
    $input: CreateVirtueRecordInput!
    $condition: ModelVirtueRecordConditionInput
  ) {
    createVirtueRecord(input: $input, condition: $condition) {
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
export const updateVirtueRecord = /* GraphQL */ `
  mutation UpdateVirtueRecord(
    $input: UpdateVirtueRecordInput!
    $condition: ModelVirtueRecordConditionInput
  ) {
    updateVirtueRecord(input: $input, condition: $condition) {
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
export const deleteVirtueRecord = /* GraphQL */ `
  mutation DeleteVirtueRecord(
    $input: DeleteVirtueRecordInput!
    $condition: ModelVirtueRecordConditionInput
  ) {
    deleteVirtueRecord(input: $input, condition: $condition) {
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
