export const manageDropDownValidation = (stepName, name, value) => {
  let shallowArr= [...stepName];
  if (name == "isMultiAudio") {
    shallowArr.map(obj => (obj.name == "audioLanguages") ? value ?
      ((obj.multiple = true), (obj.value = obj.value ? [obj.value] : []), (obj.isChanged= true)) :
      ((obj.multiple = false), (obj.value = null), (obj.isChanged= true)) : obj);

    shallowArr.map(obj => ((obj.name == "primaryLanguage") || (obj.name == "dubbedLanguageTitle")) ? value ?
      (obj.validation.required = true) : (obj.validation.required = false) : obj);
  }
  if (name == "dubbedLanguageTitle") {
    shallowArr.map(obj => (obj.name == "originalLanguage") ? (value.length > 0) ? (obj.validation.required = true) :
      (obj.validation.required = false) : obj);
  }
  return shallowArr;
};

export const manageValidationForGenre= rootArr=> {

  let primaeryGenreIndex= rootArr?.findIndex(data=> (data?.name== "primaryGenre"));
  let secondryGenreIndex= rootArr?.findIndex(data=> (data?.name== "secondaryGenre"));

  let primaeryGenreValue= rootArr[primaeryGenreIndex]?.value;
  let primaeryGenreData= rootArr[primaeryGenreIndex]?.data;

  let secondryGenreValue= rootArr[secondryGenreIndex]?.value;
  let secondryGenreData= rootArr[secondryGenreIndex]?.data;

  secondryGenreData= (primaeryGenreValue?.length> 0)?
    secondryGenreData?.filter(data=> !primaeryGenreValue?.map(obj=> obj?.id).includes(data?.id)): secondryGenreData;

  primaeryGenreData= (secondryGenreValue?.length> 0)?
    primaeryGenreData?.filter(data=> !secondryGenreValue?.map(obj=> obj?.id).includes(data?.id)): primaeryGenreData;

  let shallowArr= [...rootArr];
  shallowArr[primaeryGenreIndex]= {...shallowArr[primaeryGenreIndex], data: primaeryGenreData};
  shallowArr[secondryGenreIndex]= {...shallowArr[secondryGenreIndex], data: secondryGenreData};

  return shallowArr;
}

export const manageValidationForSpacialCat= (rootArr, name, inputVal)=> {

  let fromIndex= rootArr?.findIndex((data, index)=> (data?.name== "specialCategoryFrom"));
  let toIndex= rootArr?.findIndex((data, index)=> (data?.name== "specialCategoryTo"));

  let fromValue= (name== "specialCategoryFrom")? inputVal: rootArr[fromIndex]?.value;
  let toValue= (name== "specialCategoryTo")? inputVal: rootArr[toIndex]?.value;
  let fromError= (fromValue== "" || toValue== "" || name=="specialCategoryTo" ||
    (new Date(toValue).getTime()> new Date(fromValue).getTime()))? "":
    `specialCategoryFrom date must be smaller than specialCategoryTo`;

  let toError= (fromValue== "" || toValue== "" || name=="specialCategoryFrom" ||
    (new Date(toValue).getTime()> new Date(fromValue).getTime()))? "":
    `specialCategoryTo date must be greater than specialCategoryFrom`;

  let shallowArr= [...rootArr];
  shallowArr[fromIndex]= {...shallowArr[fromIndex], errorText: fromError};
  shallowArr[toIndex]= {...shallowArr[toIndex], errorText: toError};

  return shallowArr;
}

export const manageValidationForLanguage= rootArr=> {

  let primaeryLangIndex= rootArr?.findIndex(data=> (data?.name== "primaryLanguage"));
  let dubbedLangIndex= rootArr?.findIndex(data=> (data?.name== "dubbedLanguageTitle"));

  let primaeryLangValue= rootArr[primaeryLangIndex]?.value;
  let primaeryLangData= rootArr[primaeryLangIndex]?.data;

  let dubbedLangValue= rootArr[dubbedLangIndex]?.value;
  let dubbedLangData= rootArr[dubbedLangIndex]?.data;

  dubbedLangData= primaeryLangValue? dubbedLangData?.filter(data=> (data?.id!= primaeryLangValue?.id)): dubbedLangData;
  primaeryLangData= (dubbedLangValue?.length> 0)?
    primaeryLangData?.filter(data=> !dubbedLangValue?.map(obj=> obj?.id).includes(data?.id)): primaeryLangData;

  let shallowArr= [...rootArr];
  shallowArr[primaeryLangIndex]= {...shallowArr[primaeryLangIndex], data: primaeryLangData};
  shallowArr[dubbedLangIndex]= {...shallowArr[dubbedLangIndex], data: dubbedLangData};

  return shallowArr;
}

export const manageValidationForSubType= (name, value, classification)=> {
  let channelIndex= classification?.findIndex(data=> (data?.name== "channel"));
  if(name== "subtype" && channelIndex> -1) {
    classification[channelIndex]= {...classification[channelIndex], validation: {
      ...classification[channelIndex]["validation"], required: (value?.["title"].toLowerCase().trim()== "tv show")? true: false
    }}
  }
  return classification;
}
