import React from 'react';
import moment from 'moment';

//Helper files
import Config from '../../../Config/config';

//Service
import { apiCalls } from "../../../_services/common.service";

export const removeCastRelation = (params, removeRelationId) => {
  let section = params, indexId;
  if (section && section.length > 0) {
    for (let subIndex = 0; subIndex < section.length; subIndex++) {
      if (Array.isArray(section[subIndex])) {
        if (section[subIndex] && section[subIndex].length > 0) {
          for (let childIndex = 0; childIndex < section[subIndex].length; childIndex++) {
            if (section[subIndex][childIndex] && section[subIndex][childIndex].type === 'removeIcon') {
              indexId = section[subIndex][childIndex] && section[subIndex][childIndex].castRelationId
            }
          }
          if (removeRelationId == indexId) {
            if (section.indexOf(section[subIndex]) !== -1) {
              section.splice(section.indexOf(section[subIndex]), 1);
            }

          }

        }
      }
    }
  }
  return section;
}

export const removeAllDynamicAddfields = (params) => {
  for (let index = 0; index < params.length; index++) {
    if (params[index].sectionKey === "relationShip") {
      let section = params[index].section, removed = false
      if (section && section.length > 0) {
        for (let subIndex = 0; subIndex < section.length; subIndex++) {
          removed = false

          if (section[subIndex] && section[subIndex].length > 0) {
            for (let childIndex = 0; childIndex < section[subIndex].length; childIndex++) {
              if (section[subIndex][childIndex] && section[subIndex][childIndex].type === 'removeIcon') {
                removed = true
                break;
              }

            }
            if (removed) {
              if (section.indexOf(section[subIndex]) !== -1) {
                section.splice(section.indexOf(section[subIndex]), 1);
              }
            }
          }


        }
      }
      return section;
    }
  }
}




export const addCastRelation = (params) => {
  let section = params, id = 10;
  for (let subIndex = 0; subIndex < section?.length; subIndex++) {
    if (Array.isArray(section[subIndex])) {
      for (let childIndex = 0; childIndex < section[subIndex].length; childIndex++) {
        if (section[subIndex][childIndex] && section[subIndex][childIndex].type === 'removeIcon') {
          id = section[subIndex][childIndex] && section[subIndex][childIndex].id

        }
      }
    }
  }
  section?.push([
    {
      "id": id + 1,
      "castRelationId": id,
      "name": "castRelatedTo" + id,
      "type": "textRelation",
      "placeHolder": "Related To",
      "options": [],
      "required": false,
      "minLength": 0,
      "maxLengths": 500,
    },
    {
      "id": id + 2,
      "castRelationId": id,
      "name": "castRelation" + id,
      "type": "selectRelation",
      "placeHolder": "Relation",
      "required": false,
      "options": []
    },

    {
      "id": id + 3,
      "castRelationId": id,
      "name": "decrement",
      "relation": 'custom',
      "type": "removeIcon",
      "placeHolder": "-"
    }
  ])
  return section
}

export const removeEmptyKeys = obj => {
  for (var propName in obj) {
    if (obj[propName] === null || obj[propName] === undefined || obj[propName] === "") {
      delete obj[propName];
    }
  }
  return obj;
};


export const createQuery = (queryData) => {
  let uri = '';
  const { filters, sort, paramQuery, filterByDate } = queryData;
  if (paramQuery && Object.keys(paramQuery).length !== 0) {
    const ret = [];
    const params = removeEmptyKeys(paramQuery)
    for (let d in params) {
      ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(params[d]));
    }
    uri += (uri + '?' + ret.join('&') + '&');
  }
  if (sort) {
    sort.map(sortItem => {
      if (sortItem?.display) {
        uri += sortItem.value ? `${sortItem.name}=${sortItem.value}&` : '';
        if (sortItem?.value && sortItem?.sortKey) {
          uri += sortItem?.sortValue ? `${sortItem.sortKey}=${sortItem.sortValue}&` : '';
        }
      }
    })
  }
  if (filters) {
    filters.map(filterItem => {
      if (filterItem.value && filterItem.value.length > 0 && filterItem.value instanceof Array) {
        let allValues = []
        filterItem.value.map(item => {
          if(filterItem?.name === "translationLanguage"){
            allValues.push(item?.code ? item?.code : '');
          }
          else if(filterItem?.name === "actor"){
            allValues.push(item?.castName ? item?.castName : '');
          }
          else if(filterItem?.name === "tags"){
            allValues.push(item?.title ? item?.title : '');
          }
          else{
            allValues.push(item.id ? item.id : '');
          }
        })
      
        uri += `${filterItem.name}=${allValues.join(',')}&`
      }
      if (filterItem.value && !filterItem.value.length && filterItem?.value?.id ) {
        if(filterItem?.name === "translationLanguage"){
          uri += `${filterItem.name}=${filterItem?.value?.code}&`
        }
        else if (filterItem?.name === "actor") {
          uri += `${filterItem.name}=${filterItem?.value?.castName}&`;
        }
        else if (filterItem?.name === "tags") {
          uri += `${filterItem.name}=${filterItem?.value?.title}&`;
        }
        else{
          uri += `${filterItem.name}=${filterItem.value.id}&`
        }
      }
      else if(filterItem.value && !filterItem.value.length && filterItem?.name === "actionType"){
        uri += `${filterItem.name}=${filterItem.value.id}&`
      }
      if (filterItem.value !== '' && (typeof filterItem.value === 'string' || filterItem.value instanceof String)) {
        uri += `${filterItem.name}=${filterItem.value}&`
      }

    }).join('&')
  }
 
  if (filterByDate && filterByDate.length > 0) {
    filterByDate.map(dateItem => {
      if (dateItem?.withoutDate && dateItem?.display){
        uri +=
          (dateItem.date.startDate && dateItem.date.endDate) ?
            `${dateItem.date.startDateKey}=${dateItem.date.startDate}&${dateItem.date.endDateKey}=${dateItem.date.endDate}&` : ''
      }
      else if (dateItem?.display) {
        uri +=
          (dateItem.date.startDate && dateItem.date.endDate) ?
            `date=${dateItem.name}&${dateItem.date.startDateKey}=${dateItem.date.startDate}&${dateItem.date.endDateKey}=${dateItem.date.endDate}&` : ''
      }
    }).join('&')
  }
  uri = uri.substring(0, uri.length);

  return uri;
}

export const getStageColour = (stage) => {
  let colour;
  switch (stage) {
    case 'Draft':
      colour = 'orange'
      break;
    case 'Need Work':
      colour = 'gray'
      break;
    case 'Submitted to Review':
      colour = 'brown'
      break;
    case 'Unpublished':
      colour = 'red'
      break;
    case 'Published':
      colour = 'green'
      break;
    case 'Scheduled':
      colour = 'blue'
      break;
    case 'Changed':
      colour = 'purple'
      break;
    case 'Archived':
      colour = 'darkRed'
      break;
    default:
      colour = 'orange'
  }
  return colour
}

export const processLicenceCountries = (item) => {
  if(item) { 
  item.licenceExpDays = [];
  item.movieCountry = [];
  }
  item?.licence?.contentData?.licence?.map(licenceItem => {
    licenceItem.template?.map(tempItem => {
      if (tempItem.CurrentStatus === 'Active') {
        let days = Math.sign(moment(tempItem.toDate).diff(Date(), "days"));
        let expDays = moment(tempItem.toDate).diff(Date(), "days") <= 5;
        if (days == 1 && expDays) {
          item.licenceExpDays.push(expDays);
        }
        if (tempItem?.Country?.length > 0) {
          tempItem?.Country.map(countryItem => {
            let index = countryItem.DisplayName.indexOf();
            if (index === -1) {
              item.movieCountry.push(countryItem.DisplayName);
            }
          })
        }
      }
    })
  })
}

export const filterItemProperties = (properties, arrayOfObject) => {
  if (properties?.length <= 0) {
    return;
  }
  return arrayOfObject?.map(object => {
    let newObject = {}
    properties?.forEach(propertyName => {
      newObject[propertyName] = object[propertyName]
    })
    return newObject
  })
}

export const manageDropDownValidation = (stepName, name, value) => {
  if (name == "primaryGenre" || name == "secondaryGenre") {
    let updatedKey = (name == "primaryGenre") ? "secondaryGenre" : "primaryGenre";
    stepName?.map(obj => obj.name == updatedKey ?
      (obj["data"] = obj["data"]?.filter(dataVal => !value.some(el => el.DisplayName === dataVal.DisplayName) && dataVal)):
      obj);
  }
  if (name == "isMultiAudio") {
    stepName?.map(obj => (obj.label == "Audio Language") ? value ?
      ((obj.multiple = true), (obj.value = obj.value ? [obj.value] : [])) :
      ((obj.multiple = false), (obj.value = null)) : obj);

    stepName?.map(obj => ((obj.label == "Primary Language") || (obj.label == "Dubbed Language")) ? value ?
      (obj.required = true) : (obj.required = false) : obj);
  }
  if (name == "dubbedLanguageTitle") {
    stepName?.map(obj => obj.label == "Original Language" ? value.length > 0 ? (obj.required = true) :
      (obj.required = false) : obj);
  }
  return stepName;
};

export const validateReleaseAndTelecastDate= (rootArr, name, inputVal)=> {
  let fromIndex= rootArr?.findIndex((data, index)=> (data?.name== "telecastDate"));
  let toIndex= rootArr?.findIndex((data, index)=> (data?.name== "dateZee5Published"));

  let fromValue= (name== "telecastDate")? inputVal: rootArr[fromIndex]?.value;
  let toValue= (name== "dateZee5Published")? inputVal: rootArr[toIndex]?.value;
  let fromError= (fromValue== "" || toValue== "" || name=="dateZee5Published" || (fromIndex< 0) || (toIndex< 0) ||
    (new Date(toValue).getTime()>= new Date(fromValue).getTime()))? "":
    `Original Telecast Date cannot be greater than ZEE5 Release Date.`;

  let toError= (fromValue== "" || toValue== "" || name=="telecastDate" || (fromIndex< 0) || (toIndex< 0) ||
    (new Date(toValue).getTime()>= new Date(fromValue).getTime()))? "":
    `ZEE5 Release Date cannot be smaller than Original Telecast Date. `;

  let shallowArr= [...rootArr];
  shallowArr[fromIndex]= {...shallowArr[fromIndex], errorText: fromError};
  shallowArr[toIndex]= {...shallowArr[toIndex], errorText: toError};

  return shallowArr;
}

export const completeImagePath=(externalId, key, url, resolution= null)=>{
  // resolution = resolution.replace('*', 'x')
  return resolution? `${Config.imageBaseUrl}${externalId}/${key}/${resolution}/${url}`:
    `${Config.imageBaseUrl}${externalId}/${key}/${url}`
}

const addTagToServer = async (data, contentType) => {
  const apiUrl = `${Config.masterUrl}/tag/${contentType}`
  const response = await apiCalls(apiUrl, "POST", {...data, type: 'Tags'}, null, false);
  return response;
}

export const removeTags = (str) => {
  if(str){
    return str.replace(/(<([^>]+)>)/ig, '');
  }
  else{
    return '';
  }
}

export const addTag= async (data, contentType = "")=> {
  for(let index in data) {
    if(!data[index]["id"]) {
      data.splice(index, 1, ...data?.[index]?.["title"]?.split(",")?.map(obj=> ({title: obj})));
    }
  }
  data= data.filter(obj=> !!obj.title?.trim());
  data= data.map(obj=> ({...obj, title: obj.title.trim()}));
  let serverData= {data: data.map(obj=> obj.title)}
  data= await addTagToServer(serverData, contentType)
  return data;
}
