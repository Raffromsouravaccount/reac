const BulkDashboardConstant = {
  searchText: "Search By External Id",
  tableHeadArr: [
    "Job Id",
    "No. of Content",
    "Action Type",
    "Content Type",
    "Created By",
    "Job Status",
    "Created On",
    "Created Time"
  ],
  limitArr:[5, 10, 15, 20, 50, 100],
  rowKeys: [
    "jobId",
    "NumOfContent",
    "actionType",
    "contentType",
    "created_by.user",
    "jobState",
    "createdOn",
    "createdTime"
  ]
};

export { BulkDashboardConstant };
