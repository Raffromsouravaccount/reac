const ingestionConstant = {
  searchText: "Search By External Id",
  passText: "Pass",
  failText: "Fail",
  publishText: "Publish",
  unpublishText: "Unpublish",
  blankText: "NA",
  tableHeadArr: [
    "External Id",
    "Updated On",
    "OTT Status",
    "Axinom Status",
    "Middleware Status",
    "SQSTracker Status"
  ],
  limitArr:[5, 10, 15, 20, 50],
  rowKeys: [
    "externalId",
    "modifiedOn",
    "ottStatus",
    "axinomStatus",
    "middlewareStatus",
    "sqsContentStatus"
  ]
};

export { ingestionConstant };
