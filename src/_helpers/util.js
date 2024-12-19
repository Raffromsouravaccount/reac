import { constantText } from "./constants.text";
import moment from "moment";

export const setLocalData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};
export const getCopyObj = (Obj) => {
  return JSON.parse(JSON.stringify(Obj));
}
export const getLocalData = (key) => {
  let data;
  const storageData = localStorage?.getItem(key);
  try {
    data = JSON.parse(storageData);
   } catch(e) {
     data = storageData;
   }
  return data ? data : null;
};

export const removeLocalData = (key) => {
  localStorage.removeItem(key);
};

export const deleteLocalData = () => {
  localStorage.clear();
};

export const titleCase = (str) => {
  const splitStr = str.split(" ");
  const titleCaseStr = splitStr.map(
    (item) => item.charAt(0).toUpperCase() + item.substring(1)
  );
  return titleCaseStr.join(" ");
};

export const filterActivatedData = (data, activatedKey, activatedValue) => {
  let filterData = data?.filter((obj) => obj[activatedKey] == activatedValue);
  return filterData || [];
};

export const formatCountryGroup = (groupData) => {
  const GroupName = [];
  groupData?.map((group) => {
    group?.countries?.map((item) => {
      const obj = { ...item };
      obj.group = group?.title;
      GroupName.push(obj);
    });
  });
  return GroupName;
};

export const DEFAULT_JSON = (json) => {
  if (json && json.length) {
    return json.map((item) => {
      item.value =
        item.type === "checkbox"
          ? false
          : item.type === "time"
          ? null
          : item.type === "dropdown" ||
            item.type === "autocreate" ||
            item.type === "dropdownAsync" ||
            item.type === "SearchableWithCreate"
          ? item.multiple
            ? []
            : null
          : "";
      item.data = (item.type === "dropdownAsync")? []: item.data;
      item.errorText = "";
      return item;
    });
  }
};

export const makeStringObjectOption = (value = [], keyText = "title") => {
  return value?.map(obj => {
    if(typeof obj === "string"){
      return { [keyText] : obj};
    }
    else {
      return obj;
    }
  });
}
export const dateDiffDayCount = (toDate) => {
  let diffDays = moment(toDate).diff(Date(), "days");
  if (diffDays == 0) {
    if (moment(toDate).isSame(Date(), "d")) {
      diffDays = 0;
    } else {
      diffDays = 1;
    }
  } else if (diffDays > 0) {
    diffDays = diffDays + 1;
  }
  return diffDays;
};

export const checkValidationForMarkAsDoneForLicense = (
  licenseList,
  getRequiredLicenseFields
) => {
  let markAsDoneValue = false
  for (let licenseListData of licenseList) {
    getRequiredLicenseFields.forEach((requiredLicenseFields, index) => {
      if (requiredLicenseFields === constantText.contentAgeRatingId) {
        requiredLicenseFields = constantText.contentAgeRating
      }
      const checkValueExist =
        requiredLicenseFields && requiredLicenseFields === constantText.contentAgeRating
          ? licenseListData[requiredLicenseFields]?.title
          : licenseListData[requiredLicenseFields]
      if (!checkValueExist) {
        return (markAsDoneValue = true)
      }
    })
  }
  return markAsDoneValue
}


export const getTextFromHtml = (html) => {
  let temporalDivElement = document.createElement("div");
  temporalDivElement.innerHTML = html;
  return temporalDivElement.textContent || temporalDivElement.innerText || "";
};

export const capitalizeFirstLetter=(string)=> {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const getImageResolution = (type) => {
  let { resolutionObj } = constantText;
  let {
    coverText,
    appCoverText,
    listText,
    squareText,
    tvCoverText,
    portraitText,
    listCleanText,
    portraitCleanText,
    telcoSquareText,
    pasportText,
  } = resolutionObj;
  return type == coverText
    ? "1920x770"
    : type == appCoverText
    ? "1440x810"
    : type == listText
    ? "1170x658"
    : type == squareText
    ? "374x374"
    : type == tvCoverText
    ? "1920x522"
    : type == portraitText
    ? "630x945"
    : type == listCleanText
    ? "1170x658"
    : type == portraitCleanText
    ? "630x945"
    : type == telcoSquareText
    ? "750x750"
    : type == pasportText
    ? "750x1000"
    : null;
};
export const getSelectedGroup = (event, selectedgroup, countriesArr, value) => {
  const getMergeArrayOfObject = (origArr, updatingArr) => {
    let origLength = origArr?.length;
    let updatingLength = updatingArr?.length;
    if (origLength > 0) {
      for (let i = origLength - 1; i >= 0; i--) {
        for (let j = updatingLength - 1; j >= 0; j--) {
          if (origArr[i].code === updatingArr[j].code) {
            origArr[i] = updatingArr[j];
          }
        }
      }
      return origArr;
    } else {
      return updatingArr;
    }
  }
  let selectedValue = value;
  const filterOptions = countriesArr?countriesArr.filter(
    (item) => item.group === selectedgroup
  ):null;
  selectedValue?.map((p) => {
    if (p.hasOwnProperty("group")) {
      return p;
    } else {
      getMergeArrayOfObject(selectedValue, filterOptions)
    }
  });

  if (event?.target?.checked) {
    if(selectedgroup == constantText.selectAllDropdownText){
      selectedValue = countriesArr;
    }
    else{
      selectedValue = (selectedValue?.length > 0)
          ? [...new Map([...selectedValue, ...filterOptions].map(item => [item["title"], item])).values()]
          : filterOptions;
    }
  }
  else{
    if(selectedgroup == constantText.selectAllDropdownText){
      selectedValue = [];
    }
    else{
      const copyValues =selectedValue?[...selectedValue]:null;
      const filterValues = copyValues?copyValues.filter((item) => item.group !== selectedgroup):null;
      selectedValue = filterValues;

    }
  }
  return selectedValue;
}
export const isAuthenticated = () => !!getLocalData("token");
