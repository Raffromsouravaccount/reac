import React, { Component } from "react";
import moment from "moment";

//Services
import { apiCalls } from "../../../_services/common.service";

//Common Components
import QuickLinks from "../../Common/QuickLinks/QuickLinks";
import FormRender from "../../Common/FormHelper/FormRender";
import checkValidity from "../../Common/FormHelper/FieldValidator";
import ButtonField from "../../Common/ButtonField/ButtonField";
import { formValidityCheck } from "../../Common/FormHelper/FormValidSetter";
import { CommonModel } from "../../Common/Model/CommonModel";
import BreadcrumbsComp from "../../Common/BreadCrumbs/BreadCrumbs";
import SelectWithSearch from '../../Common/SelectWithSearch/SelectWithSearch'
import CheckBox from "../../Common/CheckBox/CheckBox";

import TextField from "@material-ui/core/TextField";

// Helpers
import { breadCrumbs } from "./breadCrumbs";
import { getSelectedGroup } from "../../../_helpers/util";
import { history, episodeBreadcrumbUrls } from "../../../_helpers/history";
import { constantText } from "../../../_helpers/constants.text";
import Config from "../../../Config/config";
import { showSuccessErrorMsg } from "../../../_actions/alertMessages.action";
import { CharactersWithNumbers } from "../../../_helpers/validation";

//Icons
import AngleLeftArrow from "images/angle-left-arrow.svg";
import Delete from "images/delete.svg";

//CSS
import "../../../../public/css/Common/GlobalField.css";

import {
  placeholderProperties,
  placeholderGlobalFields,
  placeholderGlobalFieldsArr,
} from "./placeholder.json";

export default class Placeholder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tvShowId: null,
      seasonId: null,
      dayPartOptions: constantText.placeholderConstant.dayPartsOptions,
      placeholderGlobalFields,
      placeholderGlobalFieldsArr,
      nextReleaseDate: null,
      isFormValid: false,
      showCreatedPopup: false,
      allDays: false,
      weekDays: false,
      weekEnd: false,
      urReleaseDate: null,
      allCountry: [],
      anyOtherDays: [],
      allLicenseCountries: [],
      allTemplateSet: [],
      allTemplateSetCopy: [],
      selectedTemplateSet: null,
      totalEpisode: null,
      nextAssetNumber: null,
      nextAssetStartNumber: null,
      episodeProperties: JSON.parse(JSON.stringify(placeholderProperties)),
      telecastDate: null,
      allDuplicateSet: null,
      subtype: "",
      model: {
        detail: "",
        open: false,
        disableBackdropClick: true,
        desc: "",
        showBtn1: true,
        showBtn2: true,
        btn1: constantText.tvShowsConstants.yes,
        btn2: constantText.tvShowsConstants.no,
      },
      releaseDateArray: [],
      xmlPreFixError:''
    };
  }
  componentDidMount = async () => {
    await this.getTemplateSet();
    this.setState(
      (prevState) => ({
        seasonId: this.props?.match?.params?.seasonId,
        tvShowId: this.props?.match?.params?.id,
      }),
      async () => {
        this.fetchSeasonData();
      }
    );
    const { episodeProperties, placeholderGlobalFields, dayPartOptions, allTemplateSetCopy } =
      this.state;
    const copyPropertyJSON = [...episodeProperties];
    const copyPlaceholderGlobalFields = [...placeholderGlobalFields];
    dayPartOptions.map((item) => {
      if (item.id === "saturday" || item.id === "sunday") {
        item["group"] = "Weekend";
      }
      if (
        item.id === "monday" ||
        item.id === "tuesday" ||
        item.id === "wednesday" ||
        item.id === "thursday" ||
        item.id === "friday"
      ) {
        item["group"] = "Weekdays";
      }
    });
    copyPropertyJSON.map((item) => {
      item.value = "";
      if(item.name === 'templateSet') {
        item.data = allTemplateSetCopy
      }
      if (item.name === "dayPart") {
        item.data = dayPartOptions;
      }
      if (item.name === "telecastDate") {
        item.errorText = "";
        item.helperText = item?.value ? item.helperText : "";
        item.value = item?.value
          ? item?.value
          : new Date()
      }
      if (item.name === "episodeNoStartFrom") {
        item.errorText = "";
      }
      if (item.name === "generateXml") {
        item.value = false;
      }
      if (item.name === "assetType") {
        item.errorText = "";
      }
    });
    copyPlaceholderGlobalFields[0].map((item) => {
      if (item.name === "dayPart") {
        item.data = dayPartOptions;
      }
    });
    this.setState(
      {
        episodeProperties: copyPropertyJSON,
        placeholderGlobalFields: copyPlaceholderGlobalFields,
      },
      () => {
        this.fetchTvShowData();
      }
    );
  };


  getTemplateSet = async () => {
    let response = await apiCalls(
      `${Config.masterLicenceTemplate}`,
      "GET",
      {},
      null,
      true,
      null,
      this.autoSaveError
    );
    if (response) {
      response.map(item => item.setName = '');
      this.setState({
        allTemplateSet: response,
        allTemplateSetCopy: response,
      })
    }
  }

  autoSaveError = (error) => {
    if (error?.data?.message == constantText.locked_by_another_text) {
      showSuccessErrorMsg(
        error?.data?.message,
        null,
        "Alert",
        true,
        null,
        null,
        this.getTvShowStatus
      );
    } else {
      showSuccessErrorMsg(
        error?.data?.message,
        null,
        "Error",
        true,
        null,
        true
      );
    }
  };

  fetchSeasonData = async () => {
    const { seasonId, id } = this.props?.match?.params;
    let response = await apiCalls(
      `${Config.season.seasonProperties}/${seasonId}?tvShowId=${id}`,
      "GET",
      {},
      null,
      true,
      null,
      this.autoSaveError
    );
    if (response) {
      let { telecastDate } = response;
      this.setState({ telecastDate: telecastDate?.value || null });
    }
  };

  fetchTvShowData = async () => {
    const { id } = this.props?.match?.params;
    let { episodeProperties } = this.state;
    let response = await apiCalls(
      `${Config.tvShowProperties}/${id}`,
      "GET",
      {},
      null,
      true,
      null,
      this.autoSaveError
    );
    if (response) {
      const { subtype, channel, audioLanguages, xmlTitle } = response;
      episodeProperties?.map((data) => {
        data.value = "";
        if (
          subtype &&
          subtype?.title == "TV Show" &&
          channel &&
          (Array.isArray(audioLanguages) ? audioLanguages.length : audioLanguages) &&
          xmlTitle &&
          data.name == "generateXml"
        ) {
          data.value = true;
          data.disabled = false;
          data.helperText = "";
        } else if (data.name == "generateXml" ) {
          data.value = false;
          data.disabled = true;
          data.helperText = constantText.placeholderConstant.xmlDisabledMsg;
        } else {
          data.value = "";
        }
      });
        this.setState((prevState) => ({
          episodeProperties,
          subtype: response?.subtype,
          channel: response?.channel,
        }));
    }
  };

  getLicenseSets = async () => {
    let { tvShowId, episodeProperties, seasonId } = this.state;
    let response = await apiCalls(
      `${Config.season.licenseCountries}/${seasonId}/${tvShowId}`,
      "GET",
      {},
      null,
      true,
      null,
      this.autoSaveError
    );
    if (response) {
      this.setState(
        (prevState) => ({ allLicenseCountries: response }),
        () => {
          const licenseElement = episodeProperties.find(
            (item) => item.name === "setName"
          );
        }
      );
    }
  };

  getPlaceholderData = async (assetValue, selectedValue) => {
    let {
      seasonId,
      episodeProperties,
      subtype,
      channel,
      nextReleaseDate,
      weekEnd,
      weekDays,
      telecastDate,
    } = this.state;
    const copyJSON = [...episodeProperties];
     let episodeDateElement= copyJSON.find(item => item.name =='telecastDate');
     let episodeStartElement= copyJSON.find( item => item.name == 'episodeNoStartFrom');
     let dayPartElement= copyJSON.find( item => item.name == 'dayPart');
     dayPartElement.value='';
    if(assetValue?.id){
      let url = `${Config.placeholderSeason}/${seasonId}/${assetValue?.id}`;
      let response = await apiCalls(
        url,
        "GET",
        null,
        null,
        false,
        false,
        this.autoSaveError
      );
      if (response && Object.keys(response).length > 0) {
        let nextDate = new Date(response?.lastDate);
        nextDate.setHours(0, 0, 0, 0);
        let currentDate = new Date();
        let tDate = new Date(telecastDate);
        tDate.setHours(0, 0, 0, 0);
        let myToday = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate(),
          0,
          0,
          0
        );
        let newDate;
        if (response?.lastDate && nextDate < myToday.getTime()) {
          newDate = new Date();
        }
        if (response?.lastDate && nextDate >= myToday.getTime()) {
          let date = new Date(response?.lastDate);
          newDate = date.setDate(date.getDate() + 1);
        }
        if (response?.lastDate && telecastDate && tDate > nextDate) {
          newDate = tDate;
        }
        if(telecastDate && (newDate < tDate)) {
          newDate = tDate
        }
        let nextNumber = Number(response.totalEpisode) + 1;
        this.setState({
          nextAssetNumber: nextNumber,
          nextReleaseDate: response?.lastDate,
          nextAssetStartNumber: nextNumber,
        });
        episodeStartElement.value = response?.totalEpisode
          ? nextNumber.toString()
          : "1";
        // episodeDateElement.minDateValue = new Date(); // Commenting as per requirement
        episodeStartElement.helperText =
          constantText.placeholderConstant.nextAssestNumber +
          (response?.totalEpisode ? " " + nextNumber : " " + 1);

        if (dayPartElement?.value?.length > 0) {
          episodeDateElement.value = telecastDate ? telecastDate : new Date();
          episodeStartElement.validation.minValue = response?.totalEpisode
            ? nextNumber.toString()
            : 1;
        } else {
          episodeDateElement.value = new Date();
        }
      } else {
        episodeStartElement.value = 1;
        episodeStartElement.helperText =
          constantText.placeholderConstant.nextAssestNumber + 1;
        episodeDateElement.errorText = "";
        episodeStartElement.validation.minValue = "1";
        if (dayPartElement?.value?.length > 0) {
          const newDate = nextReleaseDate
            ? nextReleaseDate
            : new Date();
          const localUpdateValue = dayPartElement?.value;
          const sortedArr = dayPartElement?.value?.sort((a, b) =>
            b.sortId > a.sortId ? 1 : -1
          );
          let newRDate =
            sortedArr?.length > 0
              ? this.getNextDate(newDate, sortedArr[0].id)
              : null;
          // episodeDateElement.minDateValue = moment(newRDate)
          //   .utc()
          //   .format(constantText.placeholder_date_Format); // Commenting as per requirement

          episodeDateElement.helperText = `${
            constantText.placeholderConstant.nextReleaseDate
          } ${moment(newRDate).format(constantText.date_format_placeholder)}`;
        } else {
          let selReleaseDate;
          if (!telecastDate) {
            selReleaseDate = new Date();
          } else {
            let cDate = new Date();
            let teleDate = new Date(telecastDate);
            let selectedReleaseDate = selectedValue
              ? new Date(selectedValue)
              : null;
            if (selectedReleaseDate && selectedReleaseDate > teleDate) {
              selReleaseDate = selectedReleaseDate;
            }
            if (telecastDate && teleDate > cDate) {
              selReleaseDate = teleDate;
            } else {
              selReleaseDate = new Date();
            }
          }
          episodeDateElement.value = selReleaseDate;
          episodeDateElement.minDateValue = "";
        }
      }

      this.setState({
        episodeProperties: copyJSON,
        urReleaseDate: episodeDateElement.minDateValue,
        totalEpisode: response.totalEpisode,
        nextReleaseDate: response?.lastDate,
        releaseDateArray: response?.episodeData,
      });
    } else {
      episodeStartElement.helperText =
        constantText.placeholderConstant.blank_msg;
      episodeDateElement.helperText = "";

      episodeProperties?.map((data) => {
        data.value = "";
        if (
          subtype &&
          subtype?.title == "Original" &&
          data.name == "generateXml"
        ) {
          data.value = false;
          data.disabled = true;
        } else if (
          subtype &&
          subtype?.title == "Tv Show" &&
          channel &&
          data.name == "generateXml"
        ) {
          this.setState({
            episodeProperties: DEFAULT_JSON(episodeProperties),
          });
        }
      });
    }
  };

  formatData = (sectionName, shallowArr) => {
    let updateData = [];
    shallowArr?.filter((nestedArr) => {
      let hasValue = false;
      for (let obj of nestedArr) {
        let { name, value } = obj;
        if (
          (name == "episodeProperties" && !!value?.castName) ||
          (name != "episodeProperties" && value?.length > 0)
        )
          hasValue = true;
      }
      if (hasValue) {
        let updatedObj = {};
        for (let obj of nestedArr) {
          updatedObj[obj?.name] =
            obj?.name == "groupCountry"
              ? obj?.value?.map((data) => data?.id)
              : obj?.value;
        }
        updateData.push(updatedObj);
      }
    });
    return sectionName == "episodeProperties"
      ? { episodeProperties: updateData }
      : { "3bb64421-f15f-4dda-adec-03c324c140a3": updateData };
  };

  handleBlur = async (rootIndex, index, sectionName) => {
    let { episodeProperties, nextAssetNumber } = this.state;
    const copyJSON = [...episodeProperties];
    let shallowArr = [...this.state[sectionName]] || [];
    let field =
      rootIndex != null ? shallowArr[rootIndex][index] : shallowArr[index];
    let updatedData =
      rootIndex != null
        ? this.formatData(sectionName, shallowArr)
        : { [field?.name]: field.value };
    let { errorText } = field;
    if (!rootIndex) {
      let assetElement = copyJSON[index];
      if (
        assetElement.name === "episodeNoStartFrom" &&
        nextAssetNumber &&
        assetElement.value > nextAssetNumber
      ) {
        const alertData = {
          title: constantText.placeholderConstant.changeIndex,
          desc: constantText.placeholderConstant.changeIndexDesc,
        };
        this.showModelAlert(alertData, null, "changeIndex");
      }
    }
  };

  addRemoveMultipleFields = async (index) => {
    let { episodeProperties, allTemplateSet } = this.state;
    let allDuplicateSetCopy = JSON.parse(JSON.stringify(allTemplateSet));
    let selectedTemplateSet = JSON.parse(JSON.stringify(this.state.selectedTemplateSet));
    let shallowArr = this.state?.allDuplicateSet || [];
    let templateSetElement = episodeProperties.find(item => item.name == 'templateSet');

    if (index || index == 0) {
      shallowArr.splice(index, 1);
      templateSetElement.validation.required = false;
      templateSetElement.value = null;
      templateSetElement.display = false;
      selectedTemplateSet = null
    } else {
      if(shallowArr.length == 0){
        const duplicateObj = { xmlPrefix: '', selectedDupSet: '', templateSet: []  }
        if(templateSetElement && templateSetElement.value) {
          let setIndex = allDuplicateSetCopy.findIndex(setItem => setItem.id == templateSetElement.value.id)
          allDuplicateSetCopy.splice(setIndex, 1)
          duplicateObj['templateSet'] = allDuplicateSetCopy;
        }
        templateSetElement.validation.required = true;
        templateSetElement.display = true;
        shallowArr.push(duplicateObj);
      }
    }
    if(shallowArr.length == 0) {
      let templateSetElement = episodeProperties.find(item => item.name == 'templateSet');
      if(templateSetElement) {
        templateSetElement.data = allDuplicateSetCopy
      }
    }
    this.setState(
      (prevState) => ({
        episodeProperties,
        allDuplicateSet: shallowArr,
        selectedTemplateSet,
        isFormValid: this.checkBothFormValidation(),
      }), () => {
        this.checkJSONFieldValidation()
      });
  };

  setSelectDataArr = (name, globalIndex, index, res) => {
    const copyJSON = [...this.state[name]];
    let updatedElement;
    if (globalIndex || globalIndex == 0) {
      const updatedGroup = copyJSON[globalIndex];
      updatedElement = updatedGroup[index];
    } else {
      updatedElement = copyJSON[index];
    }
    if (updatedElement) {
      if (updatedElement?.name === "country") {
        const GroupName = [];
        res.forEach((group) => {
          group?.countries.forEach((item) => {
            const obj = { ...item };
            obj.group = group?.title;
            GroupName.push(obj);
          });
        });
        let allCountryCopy = [...GroupName];
        this.setState({ allCountry: allCountryCopy });

        const selectedCountry = [];
        copyJSON?.map((fItem) => {
          let countryItem = fItem?.find((item) => item.name === "country");
          if (countryItem?.value.length > 0) {
            countryItem?.value.map((countryItem) => {
              selectedCountry.push(countryItem);
            });
          }
        });

        updatedElement.data = this.filterCountry(selectedCountry);
      } else {
        updatedElement.data = res;
      }
    }
    this.setState({ [name]: copyJSON });
  };

  selectCountryGroup = async (name, event, group, globalIndex, globalField) => {
    const copyJSON = [...this.state[name]];
    const copySelect = copyJSON[globalIndex];

    const findIndex = copySelect.findIndex((e) => e.name === globalField?.name);
    const copyElement = copySelect[findIndex];
    const options = [...copyElement.data];
    copyElement.value = getSelectedGroup(
      event,
      group,
      options,
      copyElement?.value
    );

    this.setState({ [name]: copyJSON });
    await this.releaseDateValidation(copyElement?.value);
  };

  selectDayPartGroup = async (name, event, group) => {
    const { nextReleaseDate, telecastDate } = this.state;
    const copyJSON = [...this.state[name]];
    const findDayIndex = copyJSON.findIndex((e) => e.name === "dayPart");
    const copyElement = copyJSON[findDayIndex];
    const options = [...copyElement.data];
    copyElement.value = getSelectedGroup(event, group, options, copyElement.value ?copyElement.value :[]);
    await this.releaseDateValidation(copyElement?.value)
    const findIndex = copyJSON.findIndex((e) => e.name === "telecastDate");
    if (copyElement.name === 'dayPart'){
      const findAssetsPerDayIndex = copyJSON.findIndex((e) => e.name === "assetsPerDay");
      let copyAssetPerDay = copyJSON[findAssetsPerDayIndex];
      if(copyElement.value.length > 0){
        copyAssetPerDay.value = 1;
        copyAssetPerDay.disabled = false,
        copyAssetPerDay.errorText = '';
        copyAssetPerDay.validation.required = true;
      }else{
        copyAssetPerDay.value = '';
        copyAssetPerDay.disabled = true;
        copyAssetPerDay.validation.required = false;
        copyAssetPerDay.errorText = '';
      }
    }
    if (findIndex !== -1) {
      const localUpdateValue = [...copyElement?.value];
      let copyDaysGroupElement = copyJSON[findIndex];
      let sortedDayPartArr = this.getSortedArr(localUpdateValue);
      let newDate = this.getDate();
      let newRDate =
        sortedDayPartArr?.length > 0
          ? this.getNextDate(newDate, sortedDayPartArr[0].id)
          : null;

      copyDaysGroupElement.errorText = "";
      copyDaysGroupElement.helperText = `${
        constantText.placeholderConstant.nextReleaseDate
      } ${moment(moment(newRDate, "YYYY-MM-DD")).format("DD/MM/YYYY")}`;
      copyDaysGroupElement.value = newRDate;
      // copyDaysGroupElement.minDateValue = newRDate; // Commenting as per requirement
    }
    this.setState({
      [name]: copyJSON,
      isFormValid: this.checkBothFormValidation(),
    });
  };
  nextWeekDays = (day) => {
    switch (day) {
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
        return 1;
      case 5:
        return 3;
      case 6:
        return 2;
    }
  };
  currentWeekDays = (day) => {
    switch (day) {
      case 0:
        return 1;
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
        return 0;
      case 6:
        return 2;
    }
  };
  nextWeekendDays = (day) => {
    switch (day) {
      case 0:
        return 6;
      case 1:
        return 5;
      case 2:
        return 4;
      case 3:
        return 3;
      case 4:
        return 2;
      case 5:
      case 6:
        return 1;
    }
  };

  currentWeekendDays = (day) => {
    switch (day) {
      case 0:
        return 0;
      case 1:
        return 5;
      case 2:
        return 4;
      case 3:
        return 3;
      case 4:
        return 2;
      case 5:
        return 1;
      case 6:
        return 0;
    }
  };

  releaseDateValidation = (daysData) => {
    let findWeekEnd = [];
    let findWeekDays = [];
    let normalDays = [];
    daysData?.map((weekItem) => {
      if (
        weekItem.id === "monday" ||
        weekItem.id === "tuesday" ||
        weekItem.id === "wednesday" ||
        weekItem.id === "thursday" ||
        weekItem.id === "friday"
      ) {
        findWeekDays.push(weekItem.id);
        normalDays.push(this.normalDaysNum(weekItem.id));
      } else if (weekItem.id === "sunday" || weekItem.id === "saturday") {
        findWeekEnd.push(weekItem.id);
        normalDays.push(this.normalDaysNum(weekItem.id));
      }
    });

    if (
      normalDays.length === 7 ||
      (findWeekDays?.length > 0 &&
        !findWeekDays.includes("monday") &&
        !findWeekDays.includes("tuesday") &&
        !findWeekDays.includes("wednesday") &&
        !findWeekDays.includes("thursday") &&
        !findWeekDays.includes("friday"))
    ) {
      findWeekDays = [];
    }
    if (
      normalDays.length === 7 ||
      (findWeekEnd?.length > 0 &&
        !findWeekEnd.includes("sunday") &&
        !findWeekEnd.includes("saturday"))
    ) {
      findWeekEnd = [];
    }
    if (findWeekDays.length === 5 && normalDays.length !== 7) {
      this.setState({
        weekDays: true,
        weekEnd: false,
        anyOtherDays: false,
        normalDays: [],
      });
    }
    if (findWeekEnd.length === 2 && normalDays.length !== 7) {
      this.setState({
        weekEnd: true,
        weekDays: false,
        anyOtherDays: false,
        normalDays: [],
      });
    }
    if (
      (findWeekDays.length !== 5 && findWeekEnd.length !== 2) ||
      normalDays.length === 7
    ) {
      this.setState({
        weekEnd: false,
        weekDays: false,
        normalDays: normalDays,
        anyOtherDays: true,
      });
    } else if (
      (findWeekDays.length < 5 &&
        findWeekDays.length > 0 &&
        findWeekEnd.length == 2) ||
      normalDays.length === 7
    ) {
      this.setState({
        weekEnd: false,
        weekDays: false,
        normalDays: normalDays,
        anyOtherDays: true,
      });
    } else if (
      (findWeekDays.length == 5 && findWeekEnd.length == 1) ||
      normalDays.length === 7
    ) {
      this.setState({
        weekEnd: false,
        weekDays: false,
        normalDays: normalDays,
        anyOtherDays: true,
      });
    }
  };

  normalDaysNum = (day) => {
    switch (day) {
      case "sunday":
        return 0;
      case "monday":
        return 1;
      case "tuesday":
        return 2;
      case "wednesday":
        return 3;
      case "thursday":
        return 4;
      case "friday":
        return 5;
      case "saturday":
        return 6;
    }
  };

  normalNumToDays = (day) => {
    switch (day) {
      case 0:
        return "sunday";
      case 1:
        return "monday";
      case 2:
        return "tuesday";
      case 3:
        return "wednesday";
      case 4:
        return "thursday";
      case 5:
        return "friday";
      case 6:
        return "saturday";
    }
  };

  setReleaseDateError = (date, dayPartElement) => {
    if(dayPartElement?.value?.length > 0) {
      const dateDay = new Date(date).getDay();
      let findDay = dayPartElement.value.find(item => item.day == dateDay);
      if(!findDay) {
        return constantText.placeholderConstant.telecastDateError
      }
    }
  };

  getNextDate = (givenDate, selectDayPart, index = 0) => {
    const { nextReleaseDate, weekDays, weekEnd } = this.state;
    const dateDay = new Date(givenDate).getDay();
    let ind = index,
      nextReleaseDateFromAPI = moment(nextReleaseDate);
    if (this.normalNumToDays(dateDay) !== selectDayPart) {
      let date = new Date(givenDate);
      let new_date = date.setDate(date.getDate() + 1);
      return this.getNextDate(new_date, selectDayPart, ind);
    } else if (
      nextReleaseDate &&
      moment(nextReleaseDateFromAPI).isSame(moment(givenDate)) &&
      this.normalNumToDays(dateDay) == selectDayPart
    ) {
      let nDate = new Date(nextReleaseDate);
      let new_date = nDate.setDate(nDate.getDate() + 1);
      return new_date;
    } else {
      return new Date(givenDate);
    }
  };

  getDate = () => {
    let { nextReleaseDate, telecastDate } = this.state;
    let cDate = new Date();
    let rDate = new Date(nextReleaseDate);
    let tDate = new Date(telecastDate);
    cDate.setHours(0, 0, 0, 0);
    rDate.setHours(0, 0, 0, 0);
    tDate.setHours(0, 0, 0, 0);
    let newDate = new Date();
    if (telecastDate && tDate > cDate) {
      newDate = tDate;
    }
    if ((telecastDate && tDate < cDate) || (nextReleaseDate && rDate < cDate)) {
      newDate = cDate;
    }
    if (nextReleaseDate && rDate >= cDate) {
      let nextRDate = rDate.setDate(rDate.getDate() + 1);
      newDate = nextRDate;
    }
    if (nextReleaseDate && telecastDate && tDate > rDate) {
      newDate = tDate;
    }
    if(telecastDate && (newDate < tDate)) {
      newDate = tDate
    }
    return newDate;
  };

  getSortedArr = (dayPartArr) => {
    let dayPartOptionsCopy = [...this?.state?.dayPartOptions];
    let newDate = this.getDate();
    let todayDay = new Date(newDate).getDay();
    if (dayPartArr?.length > 0) {
      if (dayPartArr.length == 1) return dayPartArr;
      let sortVal = dayPartArr.filter((item) => item.day === todayDay);
      if (sortVal?.length > 0) return sortVal;
      return dayPartOptionsCopy.filter(
        (item) => item.day === this.getSelectedDay(dayPartArr, todayDay)
      );
    }
  };

  getSelectedDay = (dayPartArr, todayDay) => {
    let checkMatch = dayPartArr.filter((item) => item.day === todayDay);
    if (checkMatch?.length > 0) {
      return todayDay;
    } else {
      let newDay = todayDay + 1;
      if (newDay === 7) {
        newDay = 0;
      }
      return this.getSelectedDay(dayPartArr, newDay);
    }
  };

  handleStateChangeTemplate = (event, index, name) => {
    let templateSetCopy = this.state[name];
    let licenseTemplate = templateSetCopy.licenceTemplateDetails;
    let selectedElement = licenseTemplate[index];
    selectedElement['setName'] = event?.target?.value;
    this.setState(
      (prevState) => ({
        name: templateSetCopy,
        isFormValid: this.checkBothFormValidation(),
    }), () => {
      this.checkJSONFieldValidation()
    });
  }

  handleStateChangeDupTemplate = async (event, index) => {
    if(!CharactersWithNumbers(event.target.value)){
    let allDuplicateSetCopy = this.state.allDuplicateSet;
    allDuplicateSetCopy[index].xmlPrefix = event?.target?.value
    const { errorText } = checkValidity(event?.target?.value, { isAlphaNumeric: true, maxLength: constantText.xml_title_length })
    allDuplicateSetCopy[index].errorText = errorText
    this.setState(
      (prevState) => ({
        xmlPreFixError : '',
        allDuplicateSet: allDuplicateSetCopy,
        isFormValid: this.checkBothFormValidation(),
    }), () => {
      this.checkJSONFieldValidation()
    });
  }else{
    this.setState({
      xmlPreFixError: CharactersWithNumbers(event.target.value)
    })
  }
  }

  handleStateChangeDupInnerTemplate = async (event, globalIndex, setIndex) => {
    let allDuplicateSetCopy = this.state.allDuplicateSet;
    allDuplicateSetCopy[globalIndex]['licenceTemplateDetails'][setIndex].setName = event?.target?.value;
    this.setState(
      (prevState) => ({
        allDuplicateSet: allDuplicateSetCopy,
        isFormValid: this.checkBothFormValidation(),
    }), () => {
      this.checkJSONFieldValidation()
    });
  }



  handleDuplicateSetSelect = (value, globalIndex) => {
    let { episodeProperties, allDuplicateSet, allTemplateSet } = this.state;
    let allTemplateSetCopy = JSON.parse(JSON.stringify(allTemplateSet));
    let allDuplicateSetClone = this.state?.allDuplicateSet;
    allDuplicateSetClone[globalIndex].licenceTemplateDetails = value?.licenceTemplateDetails || [];
    allDuplicateSetClone[globalIndex].selectedDupSet = value || [];

    let templateSetElement = episodeProperties.find(item => item.name == 'templateSet');
    if(templateSetElement && value) {
      let setIndex = allTemplateSetCopy.findIndex(setItem => setItem.id == value.id)
      allTemplateSetCopy.splice(setIndex, 1)
      templateSetElement['data'] = allTemplateSetCopy
    } else {
      templateSetElement['data'] = allTemplateSet
    }

    this.setState(
      (prevState) => ({
        episodeProperties,
        allDuplicateSet: allDuplicateSetClone,
        isFormValid: this.checkBothFormValidation(),
    }), () => {
      this.checkJSONFieldValidation()
    });
  }

  deleteLicenseSet = (index, type) => {
    const alertData = {
      title: "Delete Set",
      desc: "Are you sure you want to delete this set ?",
    };
    const data = {
      index: index
    }
    this.showModelAlert(alertData, data, type);
  }


  handleStateChange = async (event, globalIndex, index, name) => {
    let {
      nextReleaseDate,
      releaseDateArray,
      nextAssetStartNumber,
      telecastDate,
      allDuplicateSetCopy,
      allTemplateSet,
      allDuplicateSet,
    } = this.state;
    let copyJSON = [...this.state[name]];
    let updatedElement;
    let updatedGroup;
    let updatedValue = event?.target?.value;
    if (globalIndex || globalIndex == 0) {
      updatedGroup = copyJSON[globalIndex];
      updatedElement = updatedGroup[index];
    } else {
      updatedElement = copyJSON[index];
    }
    if (updatedElement) {
      if(updatedElement.name === 'assetType'){
        const findIndex = copyJSON.findIndex((e) => e.name === "telecastDate");
        let copyElement = copyJSON[findIndex];
        let releaseDateValue = copyElement.value ? copyElement.value : null;
        await this.getPlaceholderData(updatedValue, releaseDateValue);
        if (findIndex !== -1) {
          copyElement = copyJSON[findIndex];
          copyElement.helperText = "";
        }
        const episodeNoStartFromElement = copyJSON.find(
          (item) => item.name === "episodeNoStartFrom"
        );
        if (episodeNoStartFromElement) {
          if (
            updatedValue &&
            episodeNoStartFromElement.value &&
            Number(episodeNoStartFromElement.value) <
              Number(episodeNoStartFromElement.validation.minValue)
          ) {
            episodeNoStartFromElement.errorText =
              constantText.placeholderConstant.errorMsg;
          } else {
            episodeNoStartFromElement.errorText = "";
          }
        }
      }

      if(updatedElement.name === 'templateSet') {
        this.setState({ selectedTemplateSet: event?.target?.value })
        if(allDuplicateSet?.length > 0 && event?.target?.value) {
          let allDuplicateSetClone = JSON.parse(JSON.stringify(allDuplicateSet));
          let allTemplateSetClone = JSON.parse(JSON.stringify(allTemplateSet));
          let tempIndex = allTemplateSetClone.findIndex(itemSet => itemSet.id == event?.target?.value.id);
          allTemplateSetClone.splice(tempIndex, 1);
          allDuplicateSetClone[0]['templateSet'] = allTemplateSetClone;
          this.setState({ allDuplicateSet:allDuplicateSetClone })
        }
      }

      if (updatedElement.name === 'dayPart'){
        this.releaseDateValidation(event?.target?.value)
        const findIndex = copyJSON.findIndex((e) => e.name === "telecastDate");
        const findAssetsPerDayIndex = copyJSON.findIndex((e) => e.name === "assetsPerDay");
        let copyAssetPerDay = copyJSON[findAssetsPerDayIndex];
        if(updatedValue.length > 0){
        copyAssetPerDay.value = 1;
        copyAssetPerDay.disabled = false,
        copyAssetPerDay.errorText = '';
        copyAssetPerDay.validation.required = true;
        }else{
        copyAssetPerDay.value = '';
        copyAssetPerDay.disabled = true;
        copyAssetPerDay.validation.required = false;
        copyAssetPerDay.errorText = '';
        }
        if (findIndex !== -1) {
          let newRDate;
          let copyElement = copyJSON[findIndex];
          const selectedDayPart = [...updatedValue];
          let newDate = this.getDate();
          let sortedDayPartArr = this.getSortedArr(selectedDayPart);
          newRDate =
            sortedDayPartArr?.length > 0
              ? this.getNextDate(newDate, sortedDayPartArr[0].id)
              : null;

          copyElement.helperText = newRDate
            ? `${constantText.placeholderConstant.nextReleaseDate} ${moment(
              newRDate
            ).format("DD/MM/YYYY")}`
            : null;
          copyElement.value = newRDate ? newRDate : "";
          // copyElement.minDateValue = newRDate ? newRDate : ""; // Commenting as per requirement
          copyElement.errorText = "";
        }
        if (updatedGroup && updatedGroup.length > 0) {
          const findIndex = updatedGroup.findIndex(
            (e) => e.name === "globalEpisodeReleaseDate"
          );
          if (findIndex !== -1) {
            let copyElement = updatedGroup[findIndex];
            copyElement.value = "";
          }
        }
      }
      if (updatedElement.name === "country") {
      }
      updatedElement.value = updatedValue;
    }
    const { errorText, isValid } = checkValidity(
      updatedElement?.value,
      updatedElement?.validation
    );
    const dayPartElement = copyJSON.find(
      (jsonItem) => jsonItem.name === "dayPart"
    );
    if (updatedElement) {
      const date = new Date(updatedValue);
      updatedElement.errorText = errorText;
      if(updatedElement.name==="assetsPerDay"){
        if(updatedValue>updatedElement.validation.maxValue){
        updatedElement.errorText=constantText.placeholderConstant.assetPerDayErrorMessage
        }
      }
      if(updatedElement.name==="numberOfAssets"){
        const assetsPerDay = copyJSON.find(
          (jsonItem) => jsonItem.name === "assetsPerDay"
        );
       const numberOfAssets = copyJSON.find(
        (jsonItem) => jsonItem.name === "numberOfAssets"
       )
        if(Number(assetsPerDay.value) <= Number(numberOfAssets.value)){
         assetsPerDay.errorText = '';
         assetsPerDay.validation.maxValue = Number(numberOfAssets.value);
        }else{
         assetsPerDay.errorText = constantText.placeholderConstant.assetPerDayErrorMessage
         assetsPerDay.validation.maxValue = Number(numberOfAssets.value);
        }

      }
      if (updatedElement.name === "episodeNoStartFrom") {
        let nextNum = nextAssetStartNumber
          ? nextAssetStartNumber
          : updatedElement.value;
        if (updatedValue && Number(updatedElement.value) < Number(nextNum)) {
          updatedElement.errorText = constantText.placeholderConstant.errorMsg;
        }
      }
      if (updatedElement.name ==='telecastDate' || updatedElement.name === 'globalEpisodeReleaseDate') {
        const dayPartElement = copyJSON.find((jsonItem) => jsonItem.name === "dayPart");
        const checkError = await this.setReleaseDateError(date, dayPartElement);
        const releaseDateSame =
          releaseDateArray &&
          releaseDateArray.some((item) => {
            let previousReleaseDate = moment(item.dateZee5Published).format(
              "YYYY-MM-DD"
            );
            return moment(previousReleaseDate).isSame(
              moment(updatedValue).format("YYYY-MM-DD")
            );
          });
        if (checkError && dayPartElement?.value?.length > 0) {
          updatedElement.errorText = checkError;
          updatedElement.value = "";
        }
        if(dayPartElement?.value?.length == 0) {
            let teleDate  = new Date(telecastDate);
            teleDate.setHours(0,0,0,0);
            let releaseDate  = new Date(updatedValue);
            releaseDate.setHours(0,0,0,0);
            if(telecastDate && (releaseDate < teleDate) && !nextReleaseDate) {
              updatedElement.touched = 1;
              updatedElement.errorText = constantText.placeholderConstant.telecastDateErrorMsg;
              updatedElement.value = '';
              updatedValue = '';
            }
          }
      }
      updatedElement.touched = 1;
    }
    let newJSON = await this.getNewJSON(copyJSON, globalIndex);
    this.setState(
      (prevState) => ({
        [name]: newJSON.copyJSONData,
        isFormValid: this.checkBothFormValidation(),
      }), () => {
        this.checkJSONFieldValidation()
      });
  };

  checkJSONFieldValidation = () => {
    let { selectedTemplateSet, allDuplicateSet } = this.state;
    if(allDuplicateSet?.length > 0) {
      let checkLicenseSet = allDuplicateSet.find(item => !item.selectedDupSet);
      let checkSetName = allDuplicateSet.find(item => !item.xmlPrefix);
      if(checkLicenseSet || checkSetName) {
        this.setState({ isFormValid: false })
      };
    }
  }

  checkBothFormValidation = () => {
    let { episodeProperties } = this.state;
    let propertyFieldsValidity = formValidityCheck(episodeProperties).formValidity;
    return propertyFieldsValidity;
  };

  filterCountry = (selectedCountry) => {
    let allCountry = [...this.state.allCountry];
    if (allCountry.length === selectedCountry.length) {
      return [];
    }
    selectedCountry.map((item) => {
      let index = allCountry.findIndex((aItem) => aItem.id == item.id);
      if (index !== -1) {
        allCountry.splice(index, 1);
      }
    });
    return allCountry;
  };

  getNewJSON = (copyJSONData, globalIndex, newField) => {
    let selectedCountry = [];
    let newJSONData = [...JSON.parse(JSON.stringify(copyJSONData))];
    newJSONData?.map((copyItem) => {
      if (copyItem?.length > 0) {
        copyItem?.map((copyChildItem) => {
          if (copyChildItem.name === "country") {
            if (copyChildItem.value.length > 0) {
              copyChildItem?.value?.map((countryItem) => {
                selectedCountry.push(countryItem);
              });
            }
          }
        });
      }
    });
    if (newField) {
      let newFieldItem = newField.find((item) => item.name === "country");
      newFieldItem.data = this.filterCountry(selectedCountry);
    }

    newJSONData.map((fItem, fIndex) => {
      if (fIndex !== globalIndex) {
        if (fItem?.length > 0) {
          let countryItem = fItem?.find(
            (countryItem) => countryItem.name === "country"
          );
          let allNewCountry = [];
          allNewCountry = this.filterCountry(selectedCountry);
          allNewCountry.sort((a, b) => (a.group > b.group ? 1 : -1));
          countryItem.data = allNewCountry;
        }
      }
    });
    return {
      dataArr: newField,
      copyJSONData: newJSONData,
    };
  };

  createBulkEpisode = () => {
    let { episodeProperties, seasonId, tvShowId, allDuplicateSet, selectedTemplateSet } = this.state;
    let license = [];
    let duplicateLicense = [];
    if(selectedTemplateSet?.licenceTemplateDetails.length > 0) {
      selectedTemplateSet?.licenceTemplateDetails.map(item => {
        let countriesId = [];
        let platformId = [];
        if(item?.countryId.length > 0) {
          item?.countryId.map(item => { countriesId.push(item.id) })
        }
        if(item?.platformId.length > 0) {
          item?.platformId.map(item => { platformId.push(item.id) })
        }
        license.push({
          setName: item.setName || null,
          countriesId: countriesId || [],
          platformId: platformId || [],
          billingTypeId: item?.BillingType?.id || null,
          tvodTierId: item?.TVODTier?.id || null,
          businessTypeId: item?.BusinessType?.id || null,
        })
      })
    }
    if(allDuplicateSet?.length > 0) {
      allDuplicateSet.map(item => {
        if(item?.licenceTemplateDetails?.length> 0) {
          let licenseData = []
          item?.licenceTemplateDetails.map(licenseItem => {
            let countriesId = [];
            let platformId = [];
            if(licenseItem?.countryId?.length > 0) {
              licenseItem?.countryId?.map(cItem => { countriesId.push(cItem.id) })
            }
            if(licenseItem?.platformId?.length > 0) {
              item?.platformId?.map(pItem => { platformId.push(pItem.id) })
            }
            licenseData.push({
              setName: licenseItem.setName || null,
              countriesId: countriesId || [],
              platformId: platformId || [],
              billingTypeId: licenseItem?.BillingType?.id || null,
              tvodTierId: licenseItem?.TVODTier?.id || null,
              businessTypeId: licenseItem?.BusinessType?.id || null,
            })
          })
          duplicateLicense.push({ xmlPrefix: item.xmlPrefix,  license: licenseData, isBeforetvApplicable: !!item.isBeforetvApplicable })
        }
      })
    }

    const dayParts = episodeProperties?.find((item) => item.name === "dayPart");
    let dayPartsArr = [];
    if (dayParts && dayParts?.value?.length > 0) {
      dayParts.value.map((item) => {
        dayPartsArr.push(this.normalDaysNum(item.id));
      });
    }
    let releaseDateEle = episodeProperties?.find(item => item.name ==='telecastDate')?.value;
    const data = {
      license,
      duplicateLicense,
      assetType: episodeProperties?.find((item) => item.name === "assetType")
        ?.value?.id,
      startFrom: episodeProperties?.find(
        (item) => item.name === "episodeNoStartFrom"
      )?.value,
      dayPart: dayPartsArr,
      noOfAssets: episodeProperties?.find(item => item.name === 'numberOfAssets')?.value,
      telecastDate: moment(releaseDateEle).format('YYYY-MM-DD'),
      seasonId: seasonId,
      tvShowId: tvShowId,
      generateXML: episodeProperties?.find(
        (item) => item.name === "generateXml"
      )?.value
        ? episodeProperties?.find((item) => item.name === "generateXml")?.value
        : false,
      duplicate: episodeProperties?.find((item) => item.name === "duplicate")
        ?.value
        ? episodeProperties?.find((item) => item.name === "duplicate")?.value
        : false,
      isBeforetvApplicable: episodeProperties?.find(
        (item) => item.name === "isBeforetvApplicable"
      )?.value
        ? episodeProperties?.find(
            (item) => item.name === "isBeforetvApplicable"
          )?.value
        : false,
      assetsPerDay:episodeProperties?.find((item)=>item.name==='assetsPerDay')?.value? episodeProperties?.find((item)=>item.name==='assetsPerDay')?.value :''
    };
    const alertData = {
      title: "Create Assets",
      desc: "Are you sure you want to create assets ?",
    };
    this.showModelAlert(alertData, data);
  };

  serverCallsAction = async (data, alertData) => {
    let response = await apiCalls(
      `placeholder`,
      "POST",
      data,
      null,
      true,
      null,
      this.autoSaveError,
      Config.BackendPlaceholderApiURL
    );
    if (response) {
      this.showConfirmModal(alertData, null, "placeholderCreated");
    } else {
      this.closeModel();
    }
  };

  showModelAlert = (alertData, data, type = "create") => {
    const { model } = this.state;
    let shallowModel = { ...model };
    shallowModel.open = true;
    shallowModel.showBtn1 = true;
    shallowModel.showBtn2 = true;
    shallowModel.title = alertData?.title;
    shallowModel.desc = alertData?.desc;
    shallowModel.detail = {
      type: type,
      data: data,
    };
    this.setState({ model: shallowModel });
  };

  closeModel = (type) => {
    const { model, tvShowId, seasonId} = this.state;
    const { tvShowUrl, seasonUrl } = episodeBreadcrumbUrls(location);
    let shallowModel = { ...model };
    shallowModel.open = false;
    shallowModel.showBtn1 = true;
    shallowModel.showBtn2 = true;
    shallowModel.title = "";
    shallowModel.desc = "";
    shallowModel.detail = "";
    this.setState({ model: shallowModel });
    if (type) {
      this.handleRoute(`/tvshow${tvShowUrl}/${tvShowId}/season${seasonUrl}/${seasonId}/episode`);
    }
  };

  showConfirmModal = (alertData) => {
    const { model } = this.state;
    let shallowModel = { ...model };
    shallowModel.open = true;
    shallowModel.showBtn1 = true;
    shallowModel.showBtn2 = false;
    shallowModel.btn1 = constantText.tvShowsConstants.ok;
    shallowModel.title = alertData?.title;
    shallowModel.desc = alertData?.desc;
    shallowModel.detail = {
      type: "confirmed",
    };
    this.setState({ model: shallowModel });
  };

  handleModel = (flag, modelAction) => {
    const { tvShowId, seasonId, episodeProperties } = this.state;
    const { tvShowUrl, seasonUrl } = episodeBreadcrumbUrls(location);
    if (!flag) {
      this.closeModel();
      return;
    }
    if (modelAction?.detail?.type === "confirmed") {
      this.closeModel("confirmed");
      this.handleRoute(`/tvshow${tvShowUrl}/${tvShowId}/season${seasonUrl}/${seasonId}/episode`);
      return;
    }
    if(modelAction?.detail?.type === 'deleteProTempSet'){
      let templateSetCopy = this.state?.selectedTemplateSet;
      let licenseTemplate = templateSetCopy?.licenceTemplateDetails;
      licenseTemplate.splice(modelAction?.detail?.data?.index, 1);
      this.setState(
        (prevState) => ({
          selectedTemplateSet: templateSetCopy,
          isFormValid: this.checkBothFormValidation(),
        }), () => {
          this.checkJSONFieldValidation()
        });
      this.closeModel();
    }
    if(modelAction?.detail?.type === 'deleteDupTempSet'){
      let duplicateFieldCopy = this.state?.allDuplicateSet[0];
      let licenseTemplate = duplicateFieldCopy?.licenceTemplateDetails;
      licenseTemplate.splice(modelAction?.detail?.data?.index, 1);
      this.setState(
        (prevState) => ({
          duplicateField: duplicateFieldCopy,
          isFormValid: this.checkBothFormValidation(),
        }), () => {
          this.checkJSONFieldValidation()
        });
      this.closeModel();
    }
    if (modelAction?.detail?.type === "placeholderCreated") {
      this.handleRoute(`/tvshow${tvShowUrl}/${tvShowId}/season${seasonUrl}/${seasonId}/episode`);
      return;
    }
    if (modelAction?.detail?.type === "create") {
      let generateXMLCopy = episodeProperties.find(epItem => epItem.name == 'generateXml');
      let createdMsg = generateXMLCopy.value ? `${constantText.placeholderConstant.episodeCreatedText}${constantText.placeholderConstant.generateXMLText}` : `${constantText.placeholderConstant.episodeCreatedText}`
      const alertData = {
        title: constantText.placeholderConstant.episodeCreated,
        desc: createdMsg,
      };
      this.serverCallsAction(modelAction?.detail?.data, alertData);
    }
    if (modelAction?.detail?.type === "changeIndex") {
      this.closeModel();
    }
  };

  handleRoute = (route) => {
    history.push(route);
  };

  render() {
    let { tvShowId, seasonId, episodeProperties, isFormValid, model, selectedTemplateSet, allTemplateSetCopy, allDuplicateSet, xmlPreFixError } =
      this.state;
    const { location } = this.props;
    if(allDuplicateSet && allDuplicateSet.length && allDuplicateSet.filter(item => item.errorText?.length).length) {
      isFormValid = false
    }
    let { tvShowUrl, seasonUrl } = episodeBreadcrumbUrls(location);
    return (
      <div data-test="placeholderWrapper" className="d-wrap c-n">
        <BreadcrumbsComp
          links={breadCrumbs.links(tvShowUrl, seasonUrl, tvShowId, seasonId)}
          typography={breadCrumbs.typography}
        />

        <div
          className="profile-head flex align-items-center justify-content-between"
          data-test="headingWrapper"
        >
          <div className="back-user-btn">
            <span
              onClick={() =>
                this.handleRoute(
                  `/tvshow${tvShowUrl}/${tvShowId}/season${seasonUrl}/${seasonId}/episode`
                )
              }
            >
              <AngleLeftArrow />
            </span>
            <strong>
              <span data-test="placeholderHeading">
                {constantText.placeholderConstant.placeholder}
              </span>
            </strong>
          </div>
        </div>

        <div className="col-12" data-test="episodePropertyWrapper">
          <div className="row">
            <div className="whitebox col-md-12 col-lg-12 col-xl-12">
              <div className="row">
                <div className="ccm-head w-100 flex align-items-center justify-content-between m-b-30">
                  <h4 data-test="episodePropertiesHeading">
                    {constantText.placeholderConstant.assetProperties}
                  </h4>
                </div>
              </div>

              <div className="episode-properties">
                <div className="row input-space-35">
                  <FormRender
                    form={episodeProperties}
                    data-test="episodePropertiesForm"
                    setSelectDataArr={(value, index) =>
                      this.setSelectDataArr(
                        "episodeProperties",
                        null,
                        index,
                        value
                      )
                    }
                    onChange={(event, index, id, value, name) =>
                      this.handleStateChange(
                        event,
                        null,
                        index,
                        "episodeProperties",
                        id,
                        value,
                        name
                      )
                    }
                    handleAutoCreateInput={(value, index) =>
                      this.handleSearchableInput(
                        value,
                        null,
                        index,
                        "episodeProperties"
                      )
                    }
                    selectGroup={(ev, group) =>
                      this.selectDayPartGroup("episodeProperties", ev, group)
                    }
                    handleBlur={(index) =>
                      this.handleBlur(null, index, "episodeProperties")
                    }
                    isDisable={false}
                  />
                </div>

                <div className="lice-list">

                  { selectedTemplateSet &&
                    selectedTemplateSet?.licenceTemplateDetails?.map((itemSet, setIndex) =>
                    <div key={setIndex} className="lice-box flex justify-content-between m-b-30">
                      <div className="left-area">
                        <div className="row">
                          <div className="col-md-6 input-area">
                            <TextField
                              className="zee-input-field"
                              variant="outlined"
                              label={"License Set Name"}
                              required={false}
                              value={itemSet.setName}
                              onChange={(event) =>
                                this.handleStateChangeTemplate(
                                  event,
                                  setIndex,
                                  "selectedTemplateSet",
                                )
                              }
                              placeholder={"License Set Name"}
                            />
                          </div>
                        </div>
                        <div className="text-data flex">
                          <div className="label">
                            {constantText.licensing_country_text}
                          </div>
                          <div className="text">
                            <span className="p-r-20">
                              {itemSet.countryId.map(country => country.title).join(', ')}
                            </span>
                          </div>
                        </div>
                        <div className="text-data flex">
                          <div className="label">
                            {constantText.business_type}
                          </div>
                          <div className="text">{itemSet?.BusinessType?.title || 'NA'}</div>
                        </div>
                        <div className="text-data flex">
                          <div className="label">
                            {constantText.license_platform}
                          </div>
                          <div className="text">
                            {itemSet.platformId.map(platform => platform.title).join(', ')}
                          </div>
                        </div>
                        <div className="text-data flex">
                          <div className="label">{constantText.billing_type}</div>
                          <div className="text">{itemSet?.BillingType?.title || 'NA'}</div>
                        </div>
                        <div className="text-data flex">
                          <div className="label">
                            {constantText.tvod_tier_text}
                          </div>
                          <div className="text">{itemSet?.TVODTier?.title || 'NA'}</div>
                        </div>
                      </div>
                      <div className="right-area">
                      <div className="edit-btn-row flex align-items-center justify-content-end">
                        <div className="right-area">
                          <div className="edit-btn-row flex align-items-center justify-content-end">
                              {
                                selectedTemplateSet?.licenceTemplateDetails.length > 1 &&
                                <div onClick={() => this.deleteLicenseSet(setIndex, 'deleteProTempSet')} className="default-delete-btn">
                                  <Delete />
                                </div>
                              }
                          </div>
                        </div>
                      </div>
                    </div>
                    </div>
                    )
                  }

                </div>

                <div className="global-wrap">
                  <div className="placeholder-title add-more-row">
                    Number of Duplicates
                    {!allDuplicateSet?.length && <div className="add-another-f-btn create-btn">
                        <div className={`add-btn-field flex align-items-center`}
                          onClick={() => this.addRemoveMultipleFields()}>
                          <span className="plush-icon-btn"></span>
                        </div>
                      </div>}
                  </div>
                  {
                  allDuplicateSet?.map((duplicateField, globalIndex) => (

                  <div key={globalIndex} className="global-row">
                    <div className="add-plush-row top-title">
                      <div className="top-text">Duplicate Set {globalIndex + 1}</div>
                      <div className="add-another-f-btn create-btn">
                        <div className={`remove-btn auto-delete-1 remove-btn flex align-items-center add-btn-field flex align-items-center`}
                          onClick={() => this.addRemoveMultipleFields(globalIndex)}>
                          <span className="plush-icon-btn"></span>
                        </div>
                      </div>
                    </div>

                    <div className="row input-space-35">
                      <div className="col-md-6">
                      <SelectWithSearch
                          name={`name${globalIndex}`}
                          className="zee-SelectWSearch-field"
                          label={'Template Set'}
                          limitTags={1}
                          moreText={"more"}
                          multiple={false}
                          value={duplicateField.selectedDupSet}
                          data={duplicateField.templateSet}
                          required={true}
                          keyText={"title"}
                          onBlur={()=>{}}
                          onChange={(event, id, name, value) =>
                            this.handleDuplicateSetSelect(
                              value, globalIndex
                            )
                          }
                        />

                      </div>
                      <div className="col-md-6">
                      <TextField
                          className="zee-input-field"
                          variant="outlined"
                          required={true}
                          label={"XML Prefix"}
                          helperText={xmlPreFixError}
                          error={xmlPreFixError.length > 0 ? true : false}
                          value={duplicateField.xmlPrefix}
                          onChange={(event) =>
                            this.handleStateChangeDupTemplate(
                              event,
                              globalIndex,
                            )
                          }
                          placeholder={"Template  Set"}
                          error={!!duplicateField.errorText}
                          helperText={duplicateField.errorText}
                        />
                      </div>
                      <div className="col-md-6">
                        <CheckBox
                          id={`auto-d-isBeforetvApplicable-${globalIndex}`}
                          className="zee-checkbox-field"
                          label={"Apply Before TV Setting"}
                          name={`d-isBeforetvApplicable-${globalIndex}`}
                          handleCheckBox={(e, value) => {
                            allDuplicateSet[globalIndex].isBeforetvApplicable = value;
                            this.setState(allDuplicateSet)
                          }}
                          checked={duplicateField.isBeforetvApplicable}
                        />
                      </div>
                    </div>

                    <div className="lice-list">
                      { duplicateField?.licenceTemplateDetails?.map((itemSet, setIndex) =>
                        <div key={setIndex} className="lice-box flex justify-content-between m-b-30">
                          <div className="left-area">
                            <div className="row">
                              <div className="col-md-6 input-area">
                                <TextField
                                  className="zee-input-field"
                                  variant="outlined"
                                  label={"License Set Name"}
                                  required={false}
                                  value={itemSet.setName}
                                  onChange={(event) =>
                                    this.handleStateChangeDupInnerTemplate(
                                      event,
                                      globalIndex,
                                      setIndex,
                                    )
                                  }
                                  placeholder={"License Set Name"}
                                />
                              </div>
                            </div>
                            <div className="text-data flex">
                              <div className="label">
                                {constantText.licensing_country_text}
                              </div>
                              <div className="text">
                                <span className="p-r-20">
                                  {itemSet.countryId.map(country => country.title).join(', ')}
                                </span>
                              </div>
                            </div>
                            <div className="text-data flex">
                              <div className="label">
                                {constantText.business_type}
                              </div>
                              <div className="text">{itemSet?.BusinessType?.title || 'NA'}</div>
                            </div>
                            <div className="text-data flex">
                              <div className="label">
                                {constantText.license_platform}
                              </div>
                              <div className="text">
                                {itemSet.platformId.map(platform => platform.title).join(', ')}
                              </div>
                            </div>
                            <div className="text-data flex">
                              <div className="label">{constantText.billing_type}</div>
                              <div className="text">{itemSet?.BillingType?.title || 'NA'}</div>
                            </div>
                            <div className="text-data flex">
                              <div className="label">
                                {constantText.tvod_tier_text}
                              </div>
                              <div className="text">{itemSet?.TVODTier?.title || 'NA'}</div>
                            </div>
                          </div>
                          <div className="right-area">
                          <div className="edit-btn-row flex align-items-center justify-content-end">
                            <div className="right-area">
                              <div className="edit-btn-row flex align-items-center justify-content-end">
                                {
                                duplicateField?.licenceTemplateDetails.length > 1 &&
                                <div onClick={() => this.deleteLicenseSet(setIndex, 'deleteDupTempSet')} className="default-delete-btn">
                                  <Delete />
                                </div>
                                }
                              </div>
                            </div>
                          </div>
                        </div>
                        </div>
                        )
                      }
                    </div>
                  </div>
                  ))
                  }
                </div>

                <div className="row input-space-35">
                  <div className="col-md-6 col-lg-6">
                    <br/>
                    <ButtonField
                      onClick={this.createBulkEpisode}
                      className="zee-btn-field zee-full"
                      variant="contained"
                      color="primary"
                      disabled={!isFormValid}
                      buttonText={"Save"}
                    />
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        <CommonModel
          className="popup-wrap status-popup"
          state={model.open}
          showIcon={false}
          showTitle={true}
          title={model.title}
          showDes={true}
          des={model.desc}
          showBtn1={model.showBtn1}
          btn1Text={model.btn1}
          btn1Action={() => this.handleModel(true, model)}
          showBtn2={model.showBtn2}
          btn2Action={() => this.handleModel(false, model)}
        />
      </div>
    );
  }
}
