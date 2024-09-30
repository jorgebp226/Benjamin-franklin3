// src/api/graphql/mutations.js
export const createVirtueRecord = /* GraphQL */ `
  mutation CreateVirtueRecord(
    $input: CreateVirtueRecordInput!
    $condition: ModelVirtueRecordConditionInput
  ) {
    createVirtueRecord(input: $input, condition: $condition) {
      id
      virtueID
      status
      date
      weekNumber
      weekVirtueID
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
      virtueID
      status
      date
      weekNumber
      weekVirtueID
    }
  }
`;
