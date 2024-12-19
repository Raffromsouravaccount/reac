
export const requiredValidate = value => (value ? undefined : 'Please enter the required field.');

export const maxLength = (max, value) =>
  value && value.length > max ? `Must be ${max} characters or less` : undefined;

export const minLength = (min, value) =>
  value && value.length < min ? `Must be ${min} characters or more` : undefined;

export const maxWords = (max, value) => {
  const countWords = (value) => {
    let Str;
    Str = value.replace(/(^\s*)|(\s*$)/gi, "");
    Str = Str.replace(/[ ]{2,}/gi, " ");
    Str = Str.replace(/\n /, "\n");
    return Str.split(" ").length;
  };
  return value && countWords(value) > max ? `Must be ${max} words or less` : undefined;
}


export const numberValidate = value =>
  value && !Number(value) ? 'Must be a number' : undefined;

export const numberWithCommaValidate = value =>
  value && !/^\d+(,\d+)*$/.test(value) ? 'Must be a number with comma seperated' : undefined;

export const minValueValidate = (min, value) =>
  value && Number(value) < Number(min) ? `Must be at least ${min}` : undefined;

export const maxValueValidate = (max, value) =>
  value && value > max ? `Must be at most ${max}` : undefined;

export const characterValidate = value =>
  value && !/^[a-zA-Z ]*$/g.test(value)
    ? 'Please enter alphabetic values only'
    : undefined;

export const characterValidateAllLang = value =>
  value && !/[\p{L}-]+/ug.test(value)
    ? 'Please enters alphabetic characters  only'
    : undefined;

export const alphanumericValidate = value =>
  value && !/^[0-9a-zA-Z ]+$/.test(value)
    ? 'Please enter alphanumeric values only'
    : undefined;

export const alphanumericValidateWithComma = value =>
  value && !/^[0-9a-zA-Z, ]+$/.test(value)
    ? 'Please enter alphanumeric and special character (Comma) only'
    : undefined;

export const alphaUnderscoreValidate = value =>
  value && !/^([a-zA-Z_])*[a-zA-Z_]+$/.test(value)
    ? 'Must be characters and underscore only'
    : undefined;

export const emailValidate = value =>
  value && !/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(value)
    ? 'Please enter valid email address'
    : undefined;

export const urlValidate = value =>
  value && !/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi.test(value)
    ? 'Please enter valid URL'
    : undefined;

export const charactersWithoutSpaceValidate = value =>
  value && !/^[A-Za-z]+$/i.test(value)
    ? 'Only Characters are allowed'
    : undefined;

export const charactersWithSpacialValidate = (value) =>
  value && !/^[a-zA-Z& ]*$/.test(value)
    ? 'Only Characters and & are allowed'
    : undefined;

export const phoneNumberValidate = value =>
  value && !/^(0|[1-9][0-9]{9})$/i.test(value)
    ? 'Please enter 10 digit mobile number starting with non zero digit.'
    : undefined;

export const objectRequiredFieldValidation = data => {
  let error = null;
  for (let key in data) {
    if (!data[key] || data[key].length == 0) {
      return `${key} is required`;
    }
  }
  return error;
};

export const checkFileSize = (bytes) => {
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes == 0) return 0;
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return { size: Math.round(bytes / Math.pow(1024, i), 2), type: sizes[i] };
};

export const alphanumericWithSpecialChars = value =>
  value && !/^[0-9a-zA-Z,-/.();:@#&<>_'!?…\n ]+$/.test(value)
    ? "Please enter alphanumeric and special character -, /. ( ) ; : @ # &<> _ ' ! ? … only"
    : undefined;

export const alphanumericWithComma = value =>
  value && !/^[0-9a-zA-Z, ]+$/.test(value)
    ? 'Only characters, numeric and comma are allowed'
    : undefined;
export const alphanumericWithCommaHyphenUnderscore = value =>
value && !/^([0-9a-zA-Z_,-])*[0-9a-zA-Z_,-]+$/.test(value)
  ? 'Please enter alphanumeric and special character -,_ only.'
  : undefined;
export const characterValidateWithComma = value =>
  value && !/^[a-zA-Z, ]*$/g.test(value)
    ? 'Please enter alphabetic and special character (Comma) only'
    : undefined;

export const numericOnly = value =>
  value && !/^[0-9]+$/.test(value)
    ? 'Please enter numeric values only'
    : undefined;

export const numericWithComma = value =>
  value && !/^[0-9, ]+$/.test(value)
    ? 'Please enter numeric value only'
    : undefined;

export const charWithComma = value =>
  value && !/^[a-zA-Z, ]+$/.test(value)
    ? 'Please enter alphabetic and special character (Comma) only'
    : undefined;

export const charWithCommaHyphenRoundBracket = value =>
  value && !/^[a-zA-Z,()-]+$/.test(value)
    ? 'Please enter character and special characters -,() only'
    : undefined;

export const charWithCommaHyphen = value =>
  value && !/^[a-zA-Z,()-]+$/.test(value)
    ? 'Please enter characters or special character -, only'
    : undefined;
export const charWithCommaHyphenUnderscore = value =>
  value && !/^[a-zA-Z,_-]+$/.test(value)
    ? 'Please enter characters or  special character -,_ only'
    : undefined;

export const charWithCommaHyphenForwardSlash = value =>
  value && !/^[a-zA-Z,-/]+$/.test(value)
    ? 'Please enter characters or  special character /,-only'
    : undefined;

export const rejexValidationForCharAndSpecial = (rejex, value) =>
  value && !new RegExp(rejex).test(value) ?
  `The field can only include letters, numbers, and following special characters ${rejex}` :
  undefined;

export const CharactersWithNumbers = value =>
  value && !/^[a-zA-Z0-9]*$/.test(value)
  ? 'Only Characters and Numbers are allowed'
  : undefined;

/**
 * get file size unit
 * @param {*} bytes
 */
export const formatSizeUnits = (bytes) => {
  if (bytes >= 1073741824) { bytes = (bytes / 1073741824).toFixed(2) + " GB"; }
  else if (bytes >= 1048576) { bytes = (bytes / 1048576).toFixed(2) + " MB"; }
  else if (bytes >= 1024) { bytes = (bytes / 1024).toFixed(2) + " KB"; }
  else if (bytes > 1) { bytes = bytes + " bytes"; }
  else if (bytes == 1) { bytes = bytes + " byte"; }
  else { bytes = "0 bytes"; }
  return bytes;
}

/**
 *
 * @param {*} file file
 * @param {*} maxSize size in kb
 */
export const validateImageSize = (file, maxSize) => {
  return (file.size > 0 && maxSize >= file.size) ? true : false;
};

export const getImageResolution = (file) => {
  return new Promise((resolve, reject) => {
    const _URL = window.URL || window.webkitURL;
    let img = new Image();
    img.src = _URL.createObjectURL(file);
    img.onload = (ev) => {
      resolve({ h: ev.currentTarget.height, w: ev.currentTarget.width });
    }
  })
};

/**
 * For validating image resolution
 * @param {*} file selected file
 * @param {*} resolution resoluting width*height (Ex.- 750*750)
 */
export const validateImageResolution = async (file, resolution) => {
  const imageRes = resolution.split("x");
  const { h, w } = await getImageResolution(file);
  return (imageRes[0] == w && imageRes[1] == h);
};

export const checkImageType = (fileName, validFileExtensions) => {
  let fileValid = false;
  var _validFileExtensions = validFileExtensions || [".jpg", ".jpeg", ".png"];
  for (var j = 0; j < _validFileExtensions.length; j++) {
    var extension = _validFileExtensions[j];
    if (fileName.substr(fileName.length - extension.length, extension.length).toLowerCase() == extension.toLowerCase()) {
      fileValid = true;
      break;
    }
  }
  return fileValid
}

export const getFileNameAndExtension = (fileName, validFileExtensions) => {
  let file = {};
  var _validFileExtensions = validFileExtensions || [".jpg", ".jpeg", ".png"];
  for (var j = 0; j < _validFileExtensions.length; j++) {
    var extension = _validFileExtensions[j];
    if (fileName.substr(fileName.length - extension.length, extension.length).toLowerCase() == extension.toLowerCase()) {
      file.name = fileName.substr(0, fileName.length - extension.length).toLowerCase()
      file.extension = extension
      break;
    }
  }
  return file
}