import checkValidity from "./FieldValidator";
import {constantText} from '../../../_helpers/constants.text';
export const isValidatedForm = (jsonform) => {
  let formIsValid = true;
  let elementValid = true;
  let form = jsonform;
  form?.forEach((element) => {
    let { isValid, errorText } = checkValidity(
      element.value,
      element.validation
    );
    elementValid = isValid;
    formIsValid = elementValid && formIsValid;
    element.valid = isValid;
    element.errorText = errorText;
    //updated element's touched property
    element.touched = 1;
  });

  return { formValidity: formIsValid, validatedForm: form };
};
export const formValidityCheck = (jsonform) => {
  let formIsValid = true;
  let elementValid = true;
  let form = jsonform;
  form?.forEach((element) => {
    let { isValid } = checkValidity(element.value, element.validation);
    elementValid = isValid;
    formIsValid = elementValid && formIsValid;
  });

  return { formValidity: formIsValid };
};
export const checkDateValidation =(fromDate , toDate)=>{
  let dateValidation ,errorText
  if(fromDate>toDate){
     return {dateValidation:true,errorText:constantText.licence_invalid_date}
  }
  else if(fromDate==toDate){
    return {dateValidation:true,errorText:constantText.licence_same_date}
  }
  else{
    return {dateValidation:false,errorText:null}
  }

}



export const DEFAULT_JSON = (json) => {
  if (json && json.length) {
    return json.map((item) => {
      (item.value =
        item.type === "checkbox"
          ? false
          : item.type === "dropdownAsync" ||
            item.type === "dropdown" ||
            item.type === "conditionalDropdown" ||
            item.type === "SearchableWithCreate"
          ? item.multiple
            ? []
            : null
          : ""),
        (item.touched = 0);
      item.errorText = "";
      item.valid = true;
      return item;
    });
  }
};
