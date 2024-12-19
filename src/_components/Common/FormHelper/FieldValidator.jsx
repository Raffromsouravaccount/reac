import {
  requiredValidate,
  minLength,
  maxLength,
  minValueValidate,
  maxValueValidate,
  maxWords,
  characterValidate,
  alphanumericValidate,
  alphaUnderscoreValidate,
  numberValidate,
  emailValidate,
  urlValidate,
  alphanumericWithSpecialChars,
  numericWithComma,
  numericOnly,
  alphanumericWithComma,
  charWithComma,
  characterValidateWithComma,
  alphanumericWithCommaHyphenUnderscore,
  alphanumericValidateWithComma, rejexValidationForCharAndSpecial
} from "../../../_helpers/validation";

export function checkValidity(value = "", rules = {}, checkRequired = true) {
  let validityObj = { isValid: true, errorText: "" };
  const removeTags = (str) => {
    if(str.length>0){
      return str.replace(/(<([^>]+)>)/ig, '');
    }
    else{
      return '';
    }
  }
  if (Array.isArray(value) || typeof value === "object") {
    if (value === null) {
      value = "";
    } else {
      value = value.toString();
    }
  }

  if (Object.entries(rules).length !== 0) {
    if (rules?.required && checkRequired) {
      validityObj.isValid =
        requiredValidate(value) === undefined && validityObj.isValid;
      validityObj.errorText = requiredValidate(value)
        ? requiredValidate(value)
        : validityObj.errorText;
    }
    if (rules?.isUrl && value.trim() !== "") {
      validityObj.isValid =
        urlValidate(value) === undefined && validityObj.isValid;
      validityObj.errorText = urlValidate(value)
        ? urlValidate(value)
        : validityObj.errorText;
    }
    if (rules?.minValue && value !== "") {
      validityObj.isValid =
      minValueValidate(rules.minValue, removeTags(value)) === undefined &&
        validityObj.isValid;
      validityObj.errorText = minValueValidate(rules.minValue, removeTags(value))
        ? minValueValidate(rules.minValue, removeTags(value))
        : validityObj.errorText;
    }
    if (rules?.maxValue && value !== "") {
      validityObj.isValid =
      maxValueValidate(rules.maxValue, removeTags(value)) === undefined &&
        validityObj.isValid;
      validityObj.errorText = maxValueValidate(rules.maxValue, removeTags(value))
        ? maxValueValidate(rules.maxValue, removeTags(value))
        : validityObj.errorText;
    }
    if (rules?.minLength && value.trim() !== "") {
      validityObj.isValid =
        minLength(rules.minLength, removeTags(value.trim())) === undefined &&
        validityObj.isValid;
      validityObj.errorText = minLength(rules.minLength, removeTags(value.trim()))
        ? minLength(rules.minLength, removeTags(value.trim()))
        : validityObj.errorText;
    }
    if (rules?.maxLength && value.trim() !== "") {
    const valueCopy = value.length > rules.maxLength ? value : value.trim();
      validityObj.isValid =
        maxLength(rules.maxLength, removeTags(valueCopy)) === undefined &&
        validityObj.isValid;
      validityObj.errorText = maxLength(rules.maxLength, removeTags(valueCopy))
        ? maxLength(rules.maxLength, removeTags(valueCopy))
        : validityObj.errorText;
    }
    if (rules.isEmail && value.trim() !== "") {
      validityObj.isValid =
        emailValidate(value) === undefined && validityObj.isValid;
      validityObj.errorText = emailValidate(value)
        ? emailValidate(value)
        : validityObj.errorText;
    }
    if (rules?.isDigit && value !== "") {
      validityObj.isValid =
        numberValidate(value) === undefined && validityObj.isValid;
      validityObj.errorText = numberValidate(value)
        ? numberValidate(value)
        : validityObj.errorText;
    }
    if (rules?.isChar && value.trim() !== "") {
      validityObj.isValid =
        characterValidate(value) === undefined && validityObj.isValid;
      validityObj.errorText = characterValidate(value)
        ? characterValidate(value)
        : validityObj.errorText;
    }
    if (rules?.isCharUnderscore && value.trim() !== "") {
      validityObj.isValid = (alphaUnderscoreValidate(value) === undefined) && validityObj.isValid;
      validityObj.errorText = alphaUnderscoreValidate(value) ? alphaUnderscoreValidate(value) : validityObj.errorText;
    }
    if (rules?.isAlphaNumeric && value.trim() !== "") {
      validityObj.isValid =
        alphanumericValidate(value) === undefined && validityObj.isValid;
      validityObj.errorText = alphanumericValidate(value)
        ? alphanumericValidate(value)
        : validityObj.errorText;
    }
    if (rules?.maxWords && value.trim() !== "") {
      validityObj.isValid = (maxWords(rules?.maxWords, value.trim()) === undefined) && validityObj.isValid;
      validityObj.errorText = maxWords(rules?.maxWords, value.trim()) ? maxWords(rules?.maxWords, value.trim()) : validityObj.errorText;
    }
    if (rules?.isAlphaNumericWithSpecialChars && value.trim() !== "") {
      validityObj.isValid =
        alphanumericWithSpecialChars(value) === undefined && validityObj.isValid;
      validityObj.errorText = alphanumericWithSpecialChars(value)
        ? alphanumericWithSpecialChars(value)
        : validityObj.errorText;
    }
    if (rules?.isNumeric && value.trim() !== "") {
      validityObj.isValid =
        numericOnly(value) === undefined && validityObj.isValid;
      validityObj.errorText = numericOnly(value)
        ? numericOnly(value)
        : validityObj.errorText;
    }
    if (rules?.isNumericWithComma && value.trim() !== "") {
      validityObj.isValid =
        numericWithComma(value) === undefined && validityObj.isValid;
      validityObj.errorText = numericWithComma(value)
        ? numericWithComma(value)
        : validityObj.errorText;
    }
    if (rules?.isCharWithComma && value.trim() !== "") {
      validityObj.isValid =
        charWithComma(value) === undefined && validityObj.isValid;
      validityObj.errorText = charWithComma(value)
        ? charWithComma(value)
        : validityObj.errorText;
    }
    if (rules?.isAlphaNumericWithComma && value.trim() !== "") {
      validityObj.isValid =
        alphanumericWithComma(value) === undefined && validityObj.isValid;
      validityObj.errorText = alphanumericWithComma(value)
        ? alphanumericWithComma(value)
        : validityObj.errorText;
    }

    if (rules?.ischaracterValidateWithComma && value.trim() !== "") {
      validityObj.isValid =
        characterValidateWithComma(value) === undefined && validityObj.isValid;
      validityObj.errorText = characterValidateWithComma(value)
        ? characterValidateWithComma(value)
        : validityObj.errorText;
    }
    if (rules?.isalphanumericValidateWithComma && value.trim() !== "") {
      validityObj.isValid =
        alphanumericValidateWithComma(value) === undefined && validityObj.isValid;
      validityObj.errorText = alphanumericValidateWithComma(value)
        ? alphanumericValidateWithComma(value)
        : validityObj.errorText;
    }
    if (rules?.isalphanumericWithCommaHyphenUnderscore && value.trim() !== "") {
      validityObj.isValid =
      alphanumericWithCommaHyphenUnderscore(value) === undefined && validityObj.isValid;
      validityObj.errorText = alphanumericWithCommaHyphenUnderscore(value)
        ? alphanumericWithCommaHyphenUnderscore(value)
        : validityObj.errorText;
    }
    if (rules?.rejex && value.trim() !== "") {
      validityObj.isValid =
        rejexValidationForCharAndSpecial(rules.rejex, value) === undefined && validityObj.isValid;
      validityObj.errorText = rejexValidationForCharAndSpecial(rules.rejex, value)
        ? rejexValidationForCharAndSpecial(rules.rejex, value)
        : validityObj.errorText;
    }
  }

  return validityObj;
}

export default checkValidity;
