import moment from 'moment';
import { checkFileSize } from '../../../_helpers/validation';

import { constantText } from './../../../_helpers/constants.text';

export const manageDropDownValidation = (stepName, name, value) => {
  let shallowArr = [...stepName];
  if (name == "isMultiAudio") {
    shallowArr.map(obj => (obj.name == "audioLanguages") ? value ?
      ((obj.multiple = true), (obj.value = obj.value ? [obj.value] : [])) :
      ((obj.multiple = false), (obj.value = null)) : obj);

    shallowArr.map(obj => ((obj.name == "primaryLanguage") || (obj.name == "dubbedLanguageTitle")) ? value ?
      (obj.validation.required = true) : (obj.validation.required = false) : obj);
  }
  if (name == "dubbedLanguageTitle") {
    shallowArr.map(obj => (obj.name == "originalLanguage") ? (value.length > 0) ? (obj.validation.required = true) :
      (obj.validation.required = false) : obj);
  }
  return shallowArr;
};

export const manageValidationForTime = (stepNameArr, name, value, skipSongArr) => {
  try {
    let timeValues = {}
    stepNameArr.forEach(item => {
      timeValues[item.name] = item.value
    })
    if (name == 'introStartTime') {
      skipSongArr = clearSkipSong(skipSongArr)
    }
    let data = stepNameArr.map(obj => {

      obj.errorText = null;
      // set introEndtime to null if introStartTime is empty
      if (!timeValues.introStartTime && (name == 'introStartTime') && (obj.name == 'introEndTime')) {
        obj.errorText = null;
        obj.value = null;
      }
      // show error on introEndtime if introStartTime is empty
      if (!timeValues.introStartTime && (obj.name == name) && (name == 'introEndTime')) {
        obj.errorText = constantText.intro_start_time_select_validate_msg;
        obj.value = null;
      }

      // set recapEndtime to null if recapStartTime is empty
      if (!timeValues.recapStartTime && (name == 'recapStartTime') && (obj.name == 'recapEndTime')) {
        obj.errorText = null;
        obj.value = null;
      }
      // show error on recapEndtime if recapStartTime is empty
      if (!timeValues.recapStartTime && (obj.name == name) && (name == 'recapEndTime')) {
        obj.errorText = constantText.recap_start_time_select_validate_msg;
        obj.value = null;
      }

      if (timeValues.recapStartTime && name === 'recapStartTime' && obj.name === 'recapEndTime' && obj.errorText === null) {
        obj.value = null
      }

      if (timeValues.introStartTime && name === 'introStartTime' && obj.name === 'introEndTime' && obj.errorText === null) {
        obj.value = null
      }

      if (timeValues.introStartTime && (obj.name == name) && (name == 'introEndTime') && obj.errorText === null) {
        let valueTimeMilliSeconds = new Date(moment(value, "hh:mm:ss").toString()).getTime();
        let startTimeMilliSeconds = new Date(moment(timeValues.introStartTime, "hh:mm:ss").toString()).getTime();
        let ifLess = (valueTimeMilliSeconds <= startTimeMilliSeconds) ? true : false;
        obj.value = ifLess ? null : value;
        obj.errorText = ifLess ? `${obj.label} ${constantText.can_not_less_then_intro_start_time_msg}` : obj.errorText;
      }

      if (timeValues.recapStartTime && (obj.name == name) && (name == 'recapEndTime') && obj.errorText === null) {
        let valueTimeMilliSeconds = new Date(moment(value, "hh:mm:ss").toString()).getTime();
        let startTimeMilliSeconds = new Date(moment(timeValues.recapStartTime, "hh:mm:ss").toString()).getTime();
        let ifLess = valueTimeMilliSeconds <= startTimeMilliSeconds;
        obj.value = ifLess ? null : value;
        obj.errorText = ifLess ? `${obj.label} ${constantText.can_not_less_then_recap_start_time_msg}` : obj.errorText;
      }

      // Recap time overlap validation
      if (timeValues.introStartTime && (obj.name === name) && (name === 'recapStartTime') && obj.errorText === null) {
        let overlap = false
        let recapStartTimeMilliSeconds = new Date(moment(value, "hh:mm:ss").toString()).getTime();
        let introStartTimeMilliSeconds = new Date(moment(timeValues.introStartTime, "hh:mm:ss").toString()).getTime();
        if (timeValues.introEndTime) {
          let introEndTimeMilliSeconds = new Date(moment(timeValues.introEndTime, "hh:mm:ss").toString()).getTime();
          overlap = (recapStartTimeMilliSeconds >= introStartTimeMilliSeconds && recapStartTimeMilliSeconds <= introEndTimeMilliSeconds) ? true : false;
        } else {
          overlap = (recapStartTimeMilliSeconds === introStartTimeMilliSeconds) ? true : false;
        }
        obj.value = overlap ? null : value;
        obj.errorText = overlap ? `${obj.label} ${constantText.recap_time_overlap_validate_msg}` : obj.errorText;
      }

      if (timeValues.introStartTime && (obj.name === name) && (name === 'recapEndTime') && obj.errorText === null) {
        let overlap = false
        let recapEndTimeMilliSeconds = new Date(moment(value, "hh:mm:ss").toString()).getTime();
        let recapStartTimeMilliSeconds = new Date(moment(timeValues.recapStartTime, "hh:mm:ss").toString()).getTime();
        let introStartTimeMilliSeconds = new Date(moment(timeValues.introStartTime, "hh:mm:ss").toString()).getTime();
        if (timeValues.introEndTime) {
          let introEndTimeMilliSeconds = new Date(moment(timeValues.introEndTime, "hh:mm:ss").toString()).getTime();
          overlap = checkIntroRecapOverlap(introStartTimeMilliSeconds, introEndTimeMilliSeconds, recapStartTimeMilliSeconds, recapEndTimeMilliSeconds)
        } else {
          overlap = (introStartTimeMilliSeconds >= recapStartTimeMilliSeconds && introStartTimeMilliSeconds <= recapEndTimeMilliSeconds) ? true : false;
        }
        obj.value = overlap ? null : value;
        obj.errorText = overlap ? `${obj.label} ${constantText.recap_time_overlap_validate_msg}` : obj.errorText;
      }

      // Intro time overlap validation
      if (timeValues.recapStartTime && (obj.name === name) && (name === 'introStartTime') && obj.errorText === null) {
        let overlap = false
        let introStartTimeMilliSeconds = new Date(moment(value, "hh:mm:ss").toString()).getTime();
        let recapStartTimeMilliSeconds = new Date(moment(timeValues.recapStartTime, "hh:mm:ss").toString()).getTime();
        if (timeValues.recapEndTime) {
          let recapEndTimeMilliSeconds = new Date(moment(timeValues.recapEndTime, "hh:mm:ss").toString()).getTime();
          overlap = (introStartTimeMilliSeconds >= recapStartTimeMilliSeconds && recapStartTimeMilliSeconds <= recapEndTimeMilliSeconds) ? true : false;
        } else {
          overlap = (introStartTimeMilliSeconds === recapStartTimeMilliSeconds) ? true : false;
        }
        obj.value = overlap ? null : value;
        obj.errorText = overlap ? `${obj.label} ${constantText.intro_time_overlap_validate_msg}` : obj.errorText;
      }

      if (timeValues.recapStartTime && (obj.name === name) && (name === 'introEndTime') && obj.errorText === null) {
        let overlap = false
        let introEndTimeMilliSeconds = new Date(moment(value, "hh:mm:ss").toString()).getTime();
        let introStartTimeMilliSeconds = new Date(moment(timeValues.introStartTime, "hh:mm:ss").toString()).getTime();
        let recapStartTimeMilliSeconds = new Date(moment(timeValues.recapStartTime, "hh:mm:ss").toString()).getTime();
        if (timeValues.recapEndTime) {
          let recapEndTimeMilliSeconds = new Date(moment(timeValues.recapEndTime, "hh:mm:ss").toString()).getTime();
          overlap = checkIntroRecapOverlap(introStartTimeMilliSeconds, introEndTimeMilliSeconds, recapStartTimeMilliSeconds, recapEndTimeMilliSeconds)
   
        } else {
          overlap = (recapStartTimeMilliSeconds >= introStartTimeMilliSeconds && recapStartTimeMilliSeconds <= introEndTimeMilliSeconds) ? true : false;
        }
        obj.value = overlap ? null : value;
        obj.errorText = overlap ? `${obj.label} ${constantText.intro_time_overlap_validate_msg}` : obj.errorText;
      }

      return obj;
    });
    return { data, introStartTime: timeValues.introStartTime, skipSongArr };
  } catch (e) {
    console.log(e)
    return false
  }
};

export const manageValidationForDuration = (videoDuration, player, name, value, skipSong) => {
  try {
    let error = false;
    if(name === 'duration') {
      skipSong = clearSkipSong(skipSong)
    }
    let dataArr = player.map(data => {
      if (!videoDuration && (data.name == name) && (data.name !== 'adMarker' && data.name !== 'skipAvailable')) {
        data.errorText = constantText.video_duration_select_validation_msg;
        error = true;
        data.value = null;
      }
      if (!videoDuration && (name == 'duration') && (data.name !== 'adMarker' && name !== 'skipAvailable')) {
        data.errorText = null;
        data.value = null;
      }
      if (name == 'duration' && videoDuration && (data.name !== 'adMarker' && data.name !== 'skipAvailable')) {
        data.errorText = null;
        data.value = null;

      }
      if (videoDuration && (data.name == name) && (data.name !== 'adMarker' && data.name !== 'skipAvailable')) {
        let valueTimeMilliSeconds = new Date(moment(value, "hh:mm:ss").toString()).getTime();
        let startTimeMilliSeconds = new Date(moment(videoDuration, "hh:mm:ss").toString()).getTime();
        let ifGreater = valueTimeMilliSeconds > startTimeMilliSeconds;
        data.value = ifGreater ? null : value;
        data.errorText = ifGreater ? `${data.label} ${constantText.can_not_greater_video_duration_msg}` : null;
        error = ifGreater || error
      }
      return data;
    });
    return { dataArr, error, skipSong };
  } catch (e) {
    console.log(e)
    return false
  }
}

export const manageValidationForSkipSong = (rootArr, introStartTime, name, value, player, skip_song, rootIndex) => {
  let skipSongStartTime = null;
  let skipSongEndTime = null;

  let dataArr = rootArr.map(data => {
    if (!introStartTime && (data.name == name) && (data.name == 'skipSongStartTime' || data.name == 'skipSongEndTime')) {
      data.errorText = constantText.intro_start_time_select_validate_msg;
      data.value = null;
    }
    if (introStartTime && (data.name == 'skipSongStartTime')) {
      data.errorText = null;
      skipSongStartTime = data.value
    }
    if (introStartTime && (data.name == 'skipSongEndTime')) {
      data.errorText = null;
      skipSongEndTime = data.value
    }

    if (introStartTime && (data.name == name)) {
      let valueTimeMilliSeconds = new Date(moment(value, "hh:mm:ss").toString()).getTime();
      let startTimeMilliSeconds = new Date(moment(introStartTime, "hh:mm:ss").toString()).getTime();
      let less = valueTimeMilliSeconds < startTimeMilliSeconds;
      data.value = less ? null : value;
      data.errorText = less ? `${data.label} ${constantText.can_not_less_then_intro_start_time_msg}` : null;
    }

    if (skipSongStartTime && !data.errorText && data.name === 'skipSongEndTime' && name == 'skipSongStartTime') {
      data.value = null
      data.errorText =  null
    }

    if (skipSongStartTime && !data.errorText && data.name === name && name == 'skipSongStartTime') {
      let overlap = checkStartTimeForOverlap(skipSongStartTime, skip_song, rootIndex)
      data.value = overlap ? null : value;
      data.errorText = overlap ? `${data.label} ${constantText.skip_time_overlap_validate_msg}` : null;
    }

    if (introStartTime && !data.errorText && data.name === name && name == 'skipSongEndTime') {
      if (skipSongStartTime) {
        let valueTimeMilliSeconds = new Date(moment(value, "hh:mm:ss").toString()).getTime();
        let skipStartMilliSeconds = new Date(moment(skipSongStartTime, "hh:mm:ss").toString()).getTime();
        let less = valueTimeMilliSeconds < skipStartMilliSeconds;
        data.value = less ? null : value;
        data.errorText = less ? `${data.label} ${constantText.can_not_less_then_skip_start_time_msg}` : null;
        if (!less) {
          let overlap = checkEndTimeForOverlap(skipSongStartTime, skipSongEndTime, skip_song, rootIndex)
          data.value = overlap ? null : value;
          data.errorText = overlap ? `${data.label} ${constantText.skip_time_overlap_validate_msg}` : null;
        }
      } else {
        data.value = null;
        data.errorText = !skipSongStartTime ? constantText.skip_start_time_select_validate_msg : null
      }
    }
    return data;
  });
  return dataArr;
}

export const manageValidationForSpacialCat = (rootArr, name, inputLabel, inputVal) => {

  let fromIndex = rootArr?.findIndex((data, index) => (data?.name == "specialCategoryFrom"));
  let toIndex = rootArr?.findIndex((data, index) => (data?.name == "specialCategoryTo"));

  let fromValue = (name == "specialCategoryFrom") ? inputVal : rootArr[fromIndex]?.value;
  let toValue = (name == "specialCategoryTo") ? inputVal : rootArr[toIndex]?.value;
  let fromError = (fromValue == "" || toValue == "" || name == "specialCategoryTo" ||
    (new Date(toValue).getTime() > new Date(fromValue).getTime())) ? "" :
    `specialCategoryFrom date must be smaller than specialCategoryTo`;

  let toError = (fromValue == "" || toValue == "" || name == "specialCategoryFrom" ||
    (new Date(toValue).getTime() > new Date(fromValue).getTime())) ? "" :
    `specialCategoryTo date must be greater than specialCategoryFrom`;

  let shallowArr = [...rootArr];
  shallowArr[fromIndex] = { ...shallowArr[fromIndex], errorText: fromError };
  shallowArr[toIndex] = { ...shallowArr[toIndex], errorText: toError };

  return shallowArr;
}

export const manageValidationForLanguage = (rootArr, fieldName) => {
  let primaryLanguageIndex = rootArr?.findIndex(data => (data?.name == "primaryLanguage"));
  let dubbedLanguageIndex = rootArr?.findIndex(data => (data?.name == "dubbedLanguageTitle"));
  let { value: primaryLangValue, data: primaryLangData } = rootArr[primaryLanguageIndex]
  let { value: dubbedLangValue, data: dubbedLangData } = rootArr[dubbedLanguageIndex]

  if (fieldName == 'primaryLanguage') {
    dubbedLangValue = dubbedLangValue?.filter(data => (data?.id != primaryLangValue?.id))
  }
  if (primaryLangData && primaryLangData.length > 0) {
    dubbedLangData = primaryLangValue ? primaryLangData.filter(data => (data?.id != primaryLangValue?.id)) : dubbedLangData;
  }

  let shallowArr = [...rootArr];
  shallowArr[primaryLanguageIndex] = { ...shallowArr[primaryLanguageIndex], data: primaryLangData };
  shallowArr[dubbedLanguageIndex] = { ...shallowArr[dubbedLanguageIndex], data: dubbedLangData, value: dubbedLangValue };
  return shallowArr;
}

export const manageValidationForGenre = (rootArr, fieldName) => {
  try {
    let primaryGenreIndex = rootArr?.findIndex(data => (data?.name == "primaryGenre"));
    let secondaryGenreIndex = rootArr?.findIndex(data => (data?.name == "secondaryGenre"));
    let { value: primaryGenreValue, data: primaryGenreData } = rootArr[primaryGenreIndex]
    let { value: secondaryGenreValue, data: secondaryGenreData } = rootArr[secondaryGenreIndex] || {}

    if (fieldName == 'primaryGenre') {
      secondaryGenreValue = secondaryGenreValue?.filter(data => !primaryGenreValue?.map(obj => obj?.id).includes(data?.id))
    }
    if (primaryGenreData && primaryGenreData.length > 0) {
      secondaryGenreData = primaryGenreValue ? primaryGenreData.filter(data => !primaryGenreValue?.map(obj => obj?.id).includes(data?.id)) : secondaryGenreData;
    }

    let shallowArr = [...rootArr];
    shallowArr[primaryGenreIndex] = { ...shallowArr[primaryGenreIndex], data: primaryGenreData };
    shallowArr[secondaryGenreIndex] = { ...shallowArr[secondaryGenreIndex], data: secondaryGenreData, value: secondaryGenreValue };

    return shallowArr;
  } catch (err) {
    return err;
  }

}

const checkEndTimeForOverlap = (skipSongStartTime, skipSongEndTime, skip_song, rootIndex) => {
  let skipSongStartTimeMilliSeconds = new Date(moment(skipSongStartTime, "hh:mm:ss").toString()).getTime();
  let skipSongEndTimeMilliSeconds = new Date(moment(skipSongEndTime, "hh:mm:ss").toString()).getTime();
  let overlap = false
  skip_song.forEach((item, index) => {
    if (index !== rootIndex && !overlap) {
      let timeObj = {}
      item.forEach(obj => {
        timeObj[obj.name] = obj.value
      })
      let start = new Date(moment(timeObj.skipSongStartTime, "hh:mm:ss").toString()).getTime();
      let end = new Date(moment(timeObj.skipSongEndTime, "hh:mm:ss").toString()).getTime();
      overlap = ((start >= skipSongStartTimeMilliSeconds && start <= skipSongEndTimeMilliSeconds) ||
        (end >= skipSongStartTimeMilliSeconds && end <= skipSongEndTimeMilliSeconds)) ||
        ((skipSongEndTimeMilliSeconds >= start && skipSongEndTimeMilliSeconds <= end) ||
        (skipSongStartTimeMilliSeconds >= start && skipSongStartTimeMilliSeconds <= end))
         ? true : false;
    }
  })
  return overlap
}


const checkStartTimeForOverlap = (skipSongStartTime, skip_song, rootIndex) => {
  let skipSongStartTimeMilliSeconds = new Date(moment(skipSongStartTime, "hh:mm:ss").toString()).getTime();
  let overlap = false
  skip_song.forEach((item, index) => {
    if (index !== rootIndex && !overlap) {
      let timeObj = {}
      item.forEach(obj => {
        timeObj[obj.name] = obj.value
      })
      let start = new Date(moment(timeObj.skipSongStartTime, "hh:mm:ss").toString()).getTime();
      let end = new Date(moment(timeObj.skipSongEndTime, "hh:mm:ss").toString()).getTime();
      overlap = (skipSongStartTimeMilliSeconds >= start && skipSongStartTimeMilliSeconds <= end) ? true : false;
    }
  })
  return overlap
}


const checkIntroRecapOverlap = (introStart, introEnd, recapStart, recapEnd) => {
  const overlap = (((introEnd >= recapStart && introEnd <= recapEnd) ||
              (introStart >= recapStart && introStart <= recapEnd)) ||
             ((recapEnd >= introStart && recapEnd <= introEnd) ||
              (recapStart >= introStart && recapStart <= introEnd))) ? true : false
  return overlap;
}

const clearSkipSong = (skipSongArr) => {
  let skipSong = [[...skipSongArr[0]]]
  skipSong[0].forEach(item => {
    item.value = null;
    item.errorText = null;
  })
  return skipSong

}
