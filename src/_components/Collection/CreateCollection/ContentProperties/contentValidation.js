import moment from 'moment';

import { constantText } from '../../../../_helpers/constants.text';

export const manageDropDownValidation = (stepName, name, value) => {
  if (name == "primaryGenre" || name == "secondaryGenre") {
    let updatedKey = (name == "primaryGenre") ? "secondaryGenre" : "primaryGenre";
    stepName.map(obj => obj.name == updatedKey ?
      (obj["data"] = obj["data"]?.filter(dataVal => !value.some(el => el.DisplayName === dataVal.DisplayName) && dataVal)):
      obj);
  }
  if (name == "isMultiAudio") {
    stepName.map(obj => (obj.label == "Audio Language") ? value ?
      ((obj.multiple = true), (obj.value = obj.value ? [obj.value] : [])) :
      ((obj.multiple = false), (obj.value = null)) : obj);

    stepName.map(obj => ((obj.label == "Primary Language") || (obj.label == "Dubbed Language Title")) ? value ?
      (obj.required = true) : (obj.required = false) : obj);
  }
  if (name == "dubbedLanguageTitle") {
    stepName.map(obj => obj.label == "Original Language" ? value.length > 0 ? (obj.required = true) :
      (obj.required = false) : obj);
  }
  return stepName;
};

export const manageValidationForTime= (stepNameArr, name, value) => {
  let startTime = null, endTime = null;
  let data = stepNameArr.map(obj => {
    if (obj.label == 'Intro Start Time')
      startTime = obj.value;

    if (!startTime && (name == 'Intro Start Time') && (obj.label == 'Intro End Time' || obj.label == 'Recap End Time')) {
      obj.errorMsg = null;
      obj.value = null;
    }
    if (!startTime && (obj.label == name) && (name == 'Intro End Time' || name == 'Recap End Time')) {
      obj.errorMsg = constantText.intro_start_time_select_validate_msg;
      obj.value = null;
    }
    if (name == 'Intro Start Time' && startTime && (obj.label == 'Intro End Time' || obj.label == 'Recap End Time')) {
      obj.errorMsg = null;
    }
    if (startTime && (obj.label == name) && (name == 'Intro End Time' || name == 'Recap End Time')) {
      let valueTimeMillSeconds = new Date(moment(value, "hh:mm:ss").toString()).getTime();
      let startTimeMillSeconds = new Date(moment(startTime, "hh:mm:ss").toString()).getTime();
      let ifGrater = valueTimeMillSeconds > startTimeMillSeconds;
      obj.value = ifGrater ? null : value;
      obj.errorMsg = ifGrater ? `${name} ${constantText.can_not_greater_then_intro_start_time_msg}` : null;
      endTime = (!ifGrater && name == 'Intro End Time') ? value : endTime;
    }
    return obj;
  });
  return {data, startTime, endTime};
};

export const manageValidationForDuration= (videoDuration, player, name, value) => {
  let dataArr = player.map(data => {
    if (!videoDuration && (data.label == name) && (data.label == 'End Credit Start Time')) {
      data.errorMsg = constantText.video_duration_select_validation_msg;
      data.value = null;
    }
    if (!videoDuration && (name == 'Video Duration') && (data.label == 'End Credit Start Time')) {
      data.errorMsg = null;
      data.value = null;
    }
    if (name == 'Video Duration' && videoDuration && (data.label == 'End Credit Start Time')) {
      data.errorMsg = null;
    }
    if (videoDuration && (data.label == name) && (name == 'End Credit Start Time')) {
      let valueTimeMillSeconds = new Date(moment(value, "hh:mm:ss").toString()).getTime();
      let startTimeMillSeconds = new Date(moment(videoDuration, "hh:mm:ss").toString()).getTime();
      let ifGrater = valueTimeMillSeconds > startTimeMillSeconds;
      data.value = ifGrater ? null : value;
      data.errorMsg = ifGrater ? `${name} ${constantText.can_not_greater_video_duration_msg}` : null;
    }
    return data;
  });
  return dataArr;
}

export const manageValidationForSkipSong= (rootArr, startTime, name, value) => {
  let dataArr = rootArr.map(data => {
    if (!startTime && (data.label == name) && (data.label == 'Skip Song Start Time' ||
      data.label == 'Skip Song End Time')) {
      data.errorMsg = constantText.intro_start_time_select_validate_msg;
      data.value = null;
    }
    if (startTime && (data.label == 'Skip Song Start Time' ||
      data.label == 'Skip Song End Time')) {
      data.errorMsg = null;
    }
    if (startTime && (data.label == name) && (name == 'Skip Song Start Time' || data.label == 'Skip Song End Time')) {
      let valueTimeMillSeconds = new Date(moment(value, "hh:mm:ss").toString()).getTime();
      let startTimeMillSeconds = new Date(moment(startTime, "hh:mm:ss").toString()).getTime();
      let ifGrater = valueTimeMillSeconds > startTimeMillSeconds;
      data.value = ifGrater ? null : value;
      data.errorMsg = ifGrater ? `${name} ${constantText.can_not_greater_then_intro_start_time_msg}` : null;
    }
    return data;
  });
  return dataArr;
}
