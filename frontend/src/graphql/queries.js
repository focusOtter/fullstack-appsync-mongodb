/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const listApplicants = /* GraphQL */ `
  query ListApplicants($limit: Int, $skip: Int) {
    listApplicants(limit: $limit, skip: $skip) {
      id
      name
      email
      phoneNumber
      employmentStatus
      startDate
      focusArea
      createdAt
      updatedAt
    }
  }
`;
