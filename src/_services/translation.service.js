import Config from "../Config/config";
import axiosInstance from "../_helpers/axiosInstance";
import { requiredValidate } from "../_helpers/validation";
import { apiCalls } from "./common.service";
import { showSuccessErrorMsg } from '../_actions/alertMessages.action';
import { constantText } from '../_helpers/constants.text';
import { breadCrumbs } from './../_components/Translation/breadCrumbs';
import { permissionObj } from './../_helpers/permission';

class TranslationService {

    constructor() { }

    /**
     * function to fetch movie translation details
     * @param {*} contentId contentId of movie
     * @param {*} language language for details
     * @param {*} listing section of movie (ex. properties, videos etc)
     */

    get_movie_details(contentId, language, listing) {
        const url = listing === "properties" ? `${Config.movieTranslation}/${contentId}?langCode=${language}` : `${Config.movieTranslationCastCrew}/${contentId}?langCode=${language}`;
        return axiosInstance.get(url)
            .then(response => {
                return response.data;
            })
            .catch(error => {
                showSuccessErrorMsg(error.response.data.message, '', constantText.error);
                return false;
            });
    }

    getVideoDetails(contentId, language, listing) {
        const url = listing === "properties" ? `${Config.video.translation}/${contentId}?langCode=${language}` : `${Config.video.translationCastCrew}/${contentId}?langCode=${language}`;
        return axiosInstance.get(url)
            .then(response => {
                return response.data;
            })
            .catch(error => {
                showSuccessErrorMsg(error.response.data.message, '', constantText.error);
                return false;
            });
    }

    getShowDetails(showType, contentId, language, section, subTypeId) {
        let url = '';
        switch (section) {
            case 'properties':
                url = `${Config[showType].translation}/${contentId}?langCode=${language}`;
                break;
            case 'castAndCrew':
                url = `${Config[showType].translationCastCrew}/${contentId}?langCode=${language}`;
                break;
            case 'globalFields':
                url = `${Config[showType].globalTranslation}/${contentId}?langCode=${language}`;
                break;
            case 'template':
                url = `${Config.templateTranslation}/${contentId}?subtypeId=${subTypeId}&langCode=${language}`;
                break;

        }
        return axiosInstance.get(url)
            .then(response => {
                return response.data;
            })
            .catch(error => {
                showSuccessErrorMsg(error.response.data.message, '', constantText.error);
                return false;
            });
    }

    getContentType = (type) => {
        let url = `${Config.masterUrl}/${type ? type : 'CastType'}${type === 'EpisodeSubType' ? '?status=all' : ''}`;
        return axiosInstance.get(url)
            .then(response => {
                return response.data;
            })
            .catch(error => {
                showSuccessErrorMsg(error.response.data.message, '', constantText.error);
                return false;
            });
    }

    masterData = {};
    getMasterData(url) {
        const finalUrl = url + "?translation=yes";
        if (!this.masterData[`${finalUrl}`]) {
            this.masterData[`${finalUrl}`] = apiCalls(finalUrl, 'GET', {});
        }
        return this.masterData[`${finalUrl}`];
    }

    formatData = (data, checkLength) => {
        let formattedData = {};
        for (let obj of data) {
            let { name, value, multiple } = obj;
            if (
                typeof value == "boolean" ||
                !checkLength ||
                (checkLength && (multiple ? value.length > 0 : value))
            ) {
                formattedData[name] = value;
            } else if(value === "") {
                formattedData[name] = value;
            }
        }
        return formattedData;
    };

    formatNestedData = (dataArr) => {
        let formattedData = dataArr.filter((nestedObj) => {
            let hasValue = false;
            for (let key in nestedObj) {
                if (nestedObj[key]) hasValue = true;
            }
            if (hasValue) return nestedObj;
        });
        return formattedData;
    };

    checkError = (dataArr, checkRequired) => {
        let error = null;
        for (let obj of dataArr) {
            let { name, required, multiple, errorMsg } = obj;
            let value = obj["value"];
            if (errorMsg) return (error = name);
            if (
                checkRequired &&
                required &&
                requiredValidate(multiple ? !!value.length : value)
            )
                return (error = name);
        }
        return error;
    };

    formatAllData = (sectionType, fields, checkRequired = false) => {
        if (sectionType == 'properties' || sectionType == 'template') {
            let { title_summary } = fields;
            let allData = [...title_summary];
            let dataError = this.checkError([...allData], checkRequired);
            let formattedData = this.formatData(allData, true);

            let error = !!dataError;
            return { error, formattedData };

        } else if (sectionType == 'castAndCrew') {
            let { actors, others } = fields;
            let allData = [...others];
            let dataError = this.checkError([...allData], checkRequired);
            let formattedData = this.formatData(allData, true);
            let actorsError = false;
            let actorsData = [];
            actors.forEach(element => {
                actorsError ? "" : actorsError = this.checkError([...element], checkRequired);
                let formattedActorsData = this.formatData(element, false);
                if (formattedActorsData.actor) {
                    actorsData = [...actorsData, formattedActorsData];
                }
            });
            actorsData.length ? formattedData['actors'] = [...actorsData] : "";
            let error = !!dataError || !!actorsError;
            return { error, formattedData };
        } else if (sectionType == 'globalFields') {
            let allData, dataError = [], formattedData = [];
            Object.keys(fields).forEach((el, index) => {
                allData = [...fields[el]];
                dataError.push(this.checkError([...allData], checkRequired));
                const fData = this.formatData(allData, true);
                const gId = fields[el][0]?.gId;
                formattedData.push({...fData, "id": gId});
            });
            let error = !![...new Set(dataError)][0];
            return { error, formattedData };
        }

    };

    arrayToStringView = (items, keyText) => {
        items = items && JSON.parse(JSON.stringify(items));
        let str = [];
        if (keyText && keyText.length) {
            str = items.map(item => item[keyText]);
        } else {
            str = items;
        }
        return str?.length ? str.join(", ") : '';
    };

    /**
     * for getting label and its value from translation data
     * @param {*} key type of properties
     * @param {*} index index no. in properties
     * @param {*} field field at that index in a type of property
     * @param {*} langData data of selected translation language
     */
    labelAndValue(key, index, field, langData, renderView, lang) {
        let label = "", value = "";
        label = field["label"];
        if (langData && !Array.isArray(langData) && (key === "title_summary" || key === "others")) {
            if (field.name && langData) {
                if (langData[field.name] && Array.isArray(langData[field.name])) {
                    value = this.arrayToStringView(langData[field.name], field.keyText || "");
                } else if (langData[field.name] && typeof langData[field.name] === 'object' && renderView === 'objDataRender') {
                    if (field.keyText) {
                        value = field?.value || langData[field.name]?.[field.keyText];
                    } else {
                        value = field?.value;
                    }
                } else if (langData[field.name]) {
                    if (field.keyText) {
                        value = langData[field.name][field.keyText];
                    } else {
                        value = langData[field.name];
                    }
                }
            }
        } else if (langData?.length && Array.isArray(langData) && (key === "title_summary")) {
            if (field.name) {
                const langModifiedData = langData.find(lData => lData[field.name]);
                const langValue = langModifiedData && langModifiedData[field.name]?.value;
                if (langModifiedData && langModifiedData[field.name] && Array.isArray(langValue)) {
                    value = this.arrayToStringView(langValue, field.keyText || "");
                } else if (langModifiedData) {
                    if (field.keyText) {
                        value = field?.value || langValue[field.keyText];
                    } else {
                        value = field?.value;
                    }
                } else {
                    value = field?.value;
                }
            }
        } else if (key === 'actors' && langData && langData.actors && langData.actors.length) {
            const actorObj = langData.actors[index];
            if (field.keyText) {
                value = renderView !== 'actorsRender' ? actorObj && actorObj[0]['value'] || "" : field?.value || (actorObj && actorObj[0]['value'] || "");
            } else {
                value = renderView !== 'actorsRender' ? actorObj && actorObj[1]['value'] || "" : field?.value || (actorObj && actorObj[1]['value'] || "");
            }
        } else if (langData && Array.isArray(langData)) {
            let keyIndex = key?.slice(-1);
            langData.forEach((el, index) => {
                if(keyIndex == index) {
                    if (field.name) {
                        if (langData[index][field.name] && Array.isArray(langData[index][field.name])) {
                            value = this.arrayToStringView(langData[index][field.name], field.keyText || "");
                        } else if (langData[index][field.name]) {
                            if (field.keyText) {
                                value = langData[index][field.name][field.keyText];
                            } else {
                                value = langData[index][field.name];
                            }
                        }
                    }
                }
            })
        }
        return { label, value }
    };

    getLanguageList(contentType, contentId) {
        const contentTypeName = contentType + 'LanguageListUrl';
        const url = `${Config[contentTypeName]}/${contentId}`;
        return axiosInstance.get(url)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            showSuccessErrorMsg(error.response.data.message, '', constantText.error);
            return false;
        });
    };

    getLanguageBasedValue(value, lang){
        if(value) {
          let valArr = Array.isArray(value) ? [...value] : {...value};
          let n, mappedData;
          if(Array.isArray(value)) {
            mappedData = valArr.length && valArr?.map(m => {
                const filteredName = m?.translation && m.translation.filter(t => t.Code === lang?.Code);
                if(filteredName && filteredName.length) {
                  m["title"] = filteredName[0]["title"];
                }
                return m;
            });
          } else {
            n = valArr?.translation && valArr.translation?.filter(v => {
                if(v.Code === lang?.Code) {
                  return v;
                }
            });
            if(n && n.length) {
                valArr["title"] = n[0]["title"];
            }
          }
          return Array.isArray(value) ? [...mappedData] : valArr["title"];
        } else {
          return value;
        }
    }
    mapCastAndCrewValues = async (resData, fields, masterData) => {
        const dataObj = resData;
        let contentTypeList = masterData || [];
        let arr = {};
        fields.others.map((field) => {
          contentTypeList.length && contentTypeList.map((item) => {
            for(let key in dataObj) {
              if(key === item.id && field.label === item.title) {
                arr[field.name] = dataObj[key];
              } else if (field.name === key) {
                arr[field.name] = dataObj[key];
              }
            }
          });
        });
        for (let key in dataObj) {
          if(key === 'actor' && dataObj['actor'].length > 0) {
            let actors = [];
            let demoObj = JSON.parse(JSON.stringify(fields.actors[0]));
            dataObj['actor'].forEach((element, index) => {
              let fieldObj = JSON.parse(JSON.stringify(demoObj));
              fieldObj = fieldObj.map((item) => {
                if(element.hasOwnProperty('inherited')) {
                    item['inherited'] = element?.inherited;
                }
                if(element.hasOwnProperty('canUpdate')) {
                    item['isEditDisabled'] = !element?.canUpdate;
                }
                if (element.hasOwnProperty(item.keyText) && element.hasOwnProperty('id')) {
                  item.value = element[item.keyText];
                  item['id'] = element?.id;
                } else {
                  item.value = element[item.name] || '';
                }
                return item;
              });
              actors.push(fieldObj);
            });
            arr['actors'] = actors;
          }
        }
        return arr;
    }

    renderBreadCrumb = (page, mode, mode1, mode2, params) => {
        return breadCrumbs.links(page, mode, mode1, mode2, params);
    }

    permissionHandler = (translationPage) => {
        const permissionMovie = permissionObj?.movies?.translation;
        const permissionCast = permissionObj?.cast?.translation;
        const permissionCollection = permissionObj?.collections?.translation;
        const permissionVideo = permissionObj?.videos?.translation;
        const permissionTvShows = permissionObj?.tvShows?.translation;
        const permissionSeason = permissionObj?.season?.translation;
        const permissionEpisode = permissionObj?.episode?.translation;
        
        return {
            edit: () => {
                if((permissionMovie.canCreate() && translationPage === constantText.translations.pages.movie_text) 
                || (permissionCast.canCreate() && translationPage === constantText.translations.pages.cast_text) 
                || (permissionCollection.canCreate() && translationPage === constantText.translations.pages.collection_text)
                || (permissionVideo.canCreate() && translationPage === constantText.translations.pages.video_text)
                || (permissionTvShows.canCreate() && translationPage === constantText.translations.pages.tvshow_text)
                || (permissionSeason.canCreate() && translationPage === constantText.translations.pages.season_text)
                || (permissionEpisode.canCreate() && translationPage === constantText.translations.pages.episode_text)) {
                    return true;
                }
                return false;
            },
            view: () => {
                if((permissionMovie.canView() && translationPage === constantText.translations.pages.movie_text) 
                || (permissionCast.canView() && translationPage === constantText.translations.pages.cast_text) 
                || (permissionCollection.canView() && translationPage === constantText.translations.pages.collection_text)
                || (permissionVideo.canView() && translationPage === constantText.translations.pages.video_text)
                || (permissionTvShows.canView() && translationPage === constantText.translations.pages.tvshow_text)
                || (permissionSeason.canView() && translationPage === constantText.translations.pages.season_text)
                || (permissionEpisode.canView() && translationPage === constantText.translations.pages.episode_text)) {
                    return true;
                }
                return false;
            }
        }
    }
}

export const translationService = new TranslationService();

