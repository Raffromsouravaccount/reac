export const userConstants = {
    languageManageTxt: "Manage Language",
    no_data_found: "Sorry, no results found. Please try with different keywords",
    no_data_filter: " 'No Match Found'. ",
    no_data_filter_text:"Please clear or change filter.",
    header: "User Management",
    searchPlaceHolderText: "Search via Name, Email",
    active: "Active",
    activate:"Activate",
    inActive: "Inactive",
    inactivate: "Deactivate",
    in_active_text: "In Active",
    viewProfile: "View Profile",
    viewUserTxt: "View User",
    createUserTxt: "Create User",
    editUserTxt: "Edit User",
    userDetailTxt: "User Details",
    profileDetailTxt: "Profile Details",
    filters_text: "Filters",
    status_text: "Status",
    role_name_text: "Role Name",
    region_text: "Country Group",
    translation_lang_text: "Translation Language",
    apply_filter_text: "Apply Filter",
    clear_text: "Clear",
    cancel_text: "Cancel",
    role_name_arr: ["Content writer", "Content Reader", "Reader", "Writer"],
    region_arr: ["India", "Dubai"],
    lang_arr: ["Hindi", "English", "Urdu"],
    limit_arr: [8, 12, 16],
    statusArr: [{label: "Active", value: "1"}, {label: "Inactive", value: "2"}],
    sortByArr: [{label: "Newest to Oldest", value: "descending"}, {label: "Oldest to Newest", value: "ascending"}],
    sort_text: "Sort",
    old_to_new: "Oldest to Newest",
    new_to_old: "Newest to Oldest",
    apply_sort_text: "Apply Sort",
    allUsers: [{
        firstName: "Tegbir",
        lastName: "Singh",
        email: "tegbir.singh@zee5.com",
        countryCode: "+91",
        phNo: "9012786864",
        role: ["Content writer"],
        region: ["India", "Dubai"],
        comments: "This user responsible for write the content",
        language: ["Hindi", "English", "Urdu"],
        createdAt: new Date().setDate(new Date().getDate() - 1),
        updatedAt: new Date().setDate(new Date().getDate() - 1),
        createdBy: "Test1",
        updatedBy: "Test2",
        lastLoginDateTime: new Date().setDate(new Date().getDate() - 1),
        active: true
      },
      {
        firstName: "Abhishek",
        lastName: "Gupta",
        email: "abhishek.gupta@zee5.com",
        countryCode: "+91",
        phNo: "9012786864",
        role: ["Content Reader", "Reader"],
        region: ["India"],
        comments: "This user responsible for write the content",
        language: ["Hindi", "English"],
        createdAt: new Date().setDate(new Date().getDate() - 2),
        updatedAt: new Date().setDate(new Date().getDate() - 2),
        createdBy: "Test1",
        updatedBy: "Test2",
        lastLoginDateTime: new Date().setDate(new Date().getDate() - 2),
        active: false
      },
      {
        firstName: "Raman",
        lastName: "Kumar",
        email: "raman.kumar@zee5.com",
        countryCode: "+91",
        phNo: "9012786864",
        role: ["Content writer", "Content Reader"],
        region: ["India", "Dubai"],
        comments: "This user responsible for write the content",
        language: ["Hindi", "English", "Urdu"],
        createdAt: new Date().setDate(new Date().getDate() - 3),
        updatedAt: new Date().setDate(new Date().getDate() - 3),
        createdBy: "Test1",
        updatedBy: "Test2",
        lastLoginDateTime: new Date().setDate(new Date().getDate() - 3),
        active: true
      },
      {
        firstName: "Abhinav",
        lastName: "Singh",
        email: "abhinav.singh@zee5.com",
        countryCode: "+91",
        phNo: "9012786864",
        role: ["Writer"],
        region: ["India", "Dubai"],
        comments: "This user responsible for write the content",
        language: ["Hindi", "English", "Urdu"],
        createdAt: new Date().setDate(new Date().getDate() - 4),
        updatedAt: new Date().setDate(new Date().getDate() - 4),
        createdBy: "Test1",
        updatedBy: "Test2",
        lastLoginDateTime: new Date().setDate(new Date().getDate() - 4),
        active: false
      },
      {
        firstName: "Ratan",
        lastName: "Singh",
        email: "ratan.singh@zee5.com",
        countryCode: "+91",
        phNo: "9012786864",
        role: ["Content writer"],
        region: ["Dubai"],
        comments: "This user responsible for write the content",
        language: ["Hindi", "English", "Urdu"],
        createdAt: new Date().setDate(new Date().getDate() - 5),
        updatedAt: new Date().setDate(new Date().getDate() - 5),
        createdBy: "Test1",
        updatedBy: "Test2",
        lastLoginDateTime: new Date().setDate(new Date().getDate() - 5),
        active: true
      }
    ]
  };