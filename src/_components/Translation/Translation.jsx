import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { history } from "../../_helpers/history";
import { constantText } from "../../_helpers/constants.text";

import { userActions } from "../../_actions/user.action";

import AngleLeftArrow from "images/angle-left-arrow.svg";
import BreadCrumbs from "../Common/BreadCrumbs/BreadCrumbs";
import TranslationStatus from "./Layout/TranslationStatus";
import LeftTab from "../Common/LeftTab/CommonLeftTab";
import TranslationMovie from "./TranslationMovie/TranslationMovie";
import OtherLangDialog from "./Layout/OtherLangDialog";

import { getLocalData } from "../../_helpers/util";

import "../../../public/css/Common/Translation.css";

import Config from "../../Config/config";
import { CommonModel } from "../Common/Model/CommonModel";
import { translationService } from './../../_services/translation.service';
import TranslationCollection from './TranslationCollection/TranslationCollection';
import TranslationCastProfile from './TranslationCastProfile/TranslationCastProfile';
import TranslationVideo from './TranslationVideo/TranslationVideo';
import TranslationTvshow from './TranslationTvshow/TranslationTvshow';
import TranslationSeason from './TranslationSeason/TranslationSeason';
import TranslationEpisode from "./TranslationEpisode/TranslationEpisode";

class Translation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      translationPage: "",
      permissionAddEdit: false,
      links: [{ color: "inherit", text: constantText.dashBoard_text, route: "/dashboard" }],
      typography: [{ color: "textPrimary", text: constantText.translation_text, label: "primary" }],
      languageListWithStatus: [],
      userLanguages: [], // assigned user languages excluding English
      languages: [], // to be show under language selection
      selectedLangTab: 0, // selected language tab, by default 0
      sections: [], // to be show under select selection
      showLangDialog: false,
      showNavToAssignedLang: false,
      markAsDoneDialogShow: false,
      permissionViewOnly: false,
      showLanguageList: false,
      langIcons: constantText.langIcons,
    };
  }

  async componentDidMount() {
    const { match: {params, path}, location } = this.props;
    const userData = getLocalData("userData");
    this.props.getUserData(userData?.userID);
    let links = this.state.links;
    let response, languageListWithStatus = [];
    let translationPage = !params?.seasonId ? path.split("/")[1] : !params?.episodeId ? 'season' : 'episode';
    let mode = path.split("/")[2];
    if(params?.tvshowId && location?.pathname?.includes("/tvshow/quick/")) {
      mode = 'quick/edit';
    } else if (params?.tvshowId && location?.pathname?.includes("/tvshow/single/")) {
      mode = 'single/edit';
    } else if (params?.tvshowId && location?.pathname?.includes("/tvshow/edit/")) {
      mode = 'edit';
    } else if (params?.tvshowId && location?.pathname?.includes("/tvshow/view/")) {
      mode = 'view';
    }
    let mode1 = params?.seasonId && path?.includes("/season/view/") && 'view';
    if(params?.seasonId && location?.pathname?.includes("/season/quick/")) {
      mode1 = 'quick/edit';
    } else if (params?.seasonId && location?.pathname?.includes("/season/single/")) {
      mode1 = 'single/edit';
    }
    let mode2 = params?.episodeId && path?.includes("/episode/view/") && 'view';
    const tsPage = translationPage?.toLowerCase();
    if(translationPage) {
      links.push(...translationService.renderBreadCrumb(tsPage, mode, mode1, mode2, params));
      response = await translationService.getLanguageList(tsPage, params?.[`${tsPage}Id`]);
      languageListWithStatus = response && response.data || [];
    }
    this.setState({ links, languageListWithStatus, translationPage: tsPage});
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.userDetails != this.props.userDetails) {
      let userLanguages = [];
      if (nextProps.userDetails && nextProps.userDetails.translationLanguages) {
        userLanguages = nextProps.userDetails.translationLanguages.map((item) => {
          item["label"] = item?.title;
          return item;
        });
      }
      userLanguages = userLanguages.filter((item) => (item?.code != Config.defaultLanguageCode));
      let languages = [], permissionAddEdit = false, permissionViewOnly = false, showLanguageList = false;
      const { path } = this.props.match;
      const translationPage = path.split("/")[1];
      if (translationService.permissionHandler(translationPage)?.edit() && userLanguages?.length > 0) {
        permissionAddEdit = true;
        languages = JSON.parse(JSON.stringify(userLanguages));
      } else if (translationService.permissionHandler(translationPage)?.view() && userLanguages?.length > 0) {
        permissionViewOnly = true;
        showLanguageList = true;
      // file deepcode ignore DuplicateIfBody: <please specify a reason of ignoring this>
      } else {
        permissionViewOnly = true;
        showLanguageList = true;
      }
      const { location: {state}} = this.props;
      if (state && state?.language) {
          const showNavToAssignedLang = true;
          const langs = state?.language?.map(lng => { lng["label"] = lng["title"]; return lng;});
          this.setState({ userLanguages, permissionAddEdit, permissionViewOnly, languages: langs || [], showNavToAssignedLang });
        } else {
          this.setState({ userLanguages, permissionAddEdit, permissionViewOnly, languages: languages || [], showLanguageList });
        }
    }
  }

  handleRoute = () => {
    const { permissionAddEdit, languages } = this.state;
    const { url } = this.props.match;
    const {location} = this.props;
    if (!permissionAddEdit && languages?.length) {
      this.setState({ languages: [], showLanguageList: true });
    } else {
      const route = url.slice(0, -12);
      history.push({pathname: route, state: {journeyType: location?.state?.journeyType, stage: location?.state?.stage}});
    }
  };

  /**
   * Will trigger when language will be change from select language
   * @param {*} event
   * @param {*} selectedLangTab selected language tab from array (ex: 0, 1, 2 , etc)
   */
  handleLangTab = (event, selectedLangTab) => {
    if (selectedLangTab != this.state.selectedLangTab) {
      this.setState({ selectedLangTab });
    }
  };

  /**
   * Will trigger when select langauge dialog open/close
   * @param {*} showLangDialog for show dialog true and for hide dialog false
   * @param {*} langDialogSubmit on submition laguage dialog (click on yes)
   */
  onLangDialogClose = (showLangDialog, langDialogSubmit = false, languageList) => {
    if (langDialogSubmit) {
      const languageListWithStatus = languageList.filter(
        (lang) => lang && lang.selectedFromDialog
      );
      if (languageListWithStatus?.length) {
        const showNavToAssignedLang = true,
          languages = languageListWithStatus,
          selectedLangTab = this.state.selectedLangTab;
        let stateParams = {
          showLangDialog,
          showNavToAssignedLang,
          languages,
          languageListWithStatus: languageList
        };
        if (!((languages[selectedLangTab] && languages[selectedLangTab]?.code)
          ==
          (this.state.languages[selectedLangTab] && this.state.languages[selectedLangTab]?.code))) {
          stateParams["selectedLangTab"] = 0;
        }
        this.setState(stateParams);
      } else {
        this.onNavToAssignedLang();
      }
    } else {
      this.setState({ showLangDialog });
    }
  };

  /**
   * On coming back after selected languages from dialog
   */
  onNavToAssignedLang = () => {
    const languageListWithStatus = this.state.languageListWithStatus,
      languages = this.state.userLanguages || [];
    languageListWithStatus.forEach((lang) => {
      lang["selectedFromDialog"] = false;
    });
    this.setState({
      showLangDialog: false,
      showNavToAssignedLang: false,
      languages,
      languageListWithStatus,
      selectedLangTab: 0,
      ...(languages?.length === 0 && {showLanguageList: true})
    });
  };

  /**
   * Triggers when select/click any language from status view
   * @param {*} language selected language from view status
   */
  onLanguageSelectionFromStatusView = (language) => {
    let { languages } = this.state;
    const lang = {...language};
    const langs = [...languages]
    const showNavToAssignedLang = true;
    lang['label'] = lang['title'];
    langs.push(lang);
    this.setState({ languages: langs || [], showNavToAssignedLang, showLanguageList: false });
  };

  /**
   * Update state for mark as done dialog confirmation if user returns after some changes
   */
  updateMarkAsDoneAction = (status) => {
    if (!status) {
      this.markAsDoneCount >= 1 ? 1 : this.markAsDoneCount = !this.markAsDoneCount ?  1 : this.markAsDoneCount + 1;
      this.unblock = history.block(targetLocation => {
        // take your action here
        this.setState({ markAsDoneDialogShow: true });
        return false;
      });
    } else {
      this.markAsDoneCount > 0 ? this.markAsDoneCount = this.markAsDoneCount - 1 : '';
      this.markAsDoneCount === 0 ? this.unblock() : '';
    }
  }

  handleMarkAsDoneConfirmationDialog = () => {
    this.unblock();
    this.setState({ markAsDoneDialogShow: false });
  }

  getAssignedLanguages = () => {
    const { userLanguages } = this.state;
    let str = "";
    userLanguages.forEach((lang, i) => {
      str = i === 0 ? lang.title : str + ', ' + lang.title;
    });
    return str;
  }

  getLangIcon = (lang) => {
    const langIcons = this.state.langIcons.filter(icon => icon == lang?.title?.replace(/\s*\(.*?\)\s*/g, ''));
    return `images/${langIcons?.length ? langIcons[0] : 'Hindi'}-icon.svg`;
  }

  goBack = () => {
    this.props.history.goBack();
  }

  render() {
    const {
      translationPage,
      links,
      typography,
      permissionAddEdit,
      permissionViewOnly,
      languageListWithStatus,
      languages,
      selectedLangTab,
      showLangDialog,
      showNavToAssignedLang,
      markAsDoneDialogShow,
      showLanguageList,
      userLanguages
    } = this.state;

    const { params } = this.props.match;
    const {location} = this.props;
    return (
      <div className="d-wrap c-n">
        {showLangDialog && <OtherLangDialog
          className="popup-wrap status-popup other-lang-poupup"
          state={showLangDialog}
          languageList={languageListWithStatus}
          languages= {userLanguages}
          btn1Action={(value) => this.onLangDialogClose(false, true, value)}
          btn2Action={() => this.onLangDialogClose(false)}
          handleClose={() => this.onLangDialogClose(false)}
        />}

        {markAsDoneDialogShow && <CommonModel
          className='popup-wrap status-popup trans-conf-popup'
          state={markAsDoneDialogShow}
          showTitle={true} title={constantText.translations.title}
          showDes={true} des={constantText.translations.confirm_msg_text}
          singleButton={true}
          showIcon = {false}
          showBtn1={true} btn1Text={constantText.translations.okay_text} btn1Action={this.handleMarkAsDoneConfirmationDialog}
        />}

        <BreadCrumbs links={links} typography={typography} journeyType={location?.state?.journeyType} stage={location?.state?.stage} />

        <div className="profile-head flex align-items-center justify-content-between">
          <div className="back-user-btn auto-back-btn">
            <span onClick={() => this.handleRoute()}>
              <AngleLeftArrow />
            </span>
            <strong>
              <span>{constantText.translation_text}</span>
            </strong>
          </div>
          {!showLanguageList && userLanguages?.length > 0 && <div className="assigned-lang">
            {constantText.translations.assigned_trans_lang_text}: {this.getAssignedLanguages()}
          </div>
          }
        </div>

        <div className="translation-wrapper">
          {(permissionViewOnly && showLanguageList) &&
            <TranslationStatus
              languageList={languageListWithStatus}
              onClick={this.onLanguageSelectionFromStatusView}
              handleLanguageIcon={this.getLangIcon}
            />
          }
          {!showLanguageList &&
            <Fragment>
              <div className="whitebox lang-select-wrap m-b-30">
                <div className="flex align-items-center justify-content-between">
                  <div className="left-area flex align-items-center">
                    {showNavToAssignedLang ? (
                      userLanguages?.length > 0 ? <div className="lang-text back-arrow assign flex align-items-center">
                        <span className="back-arrow-assign-lang" onClick={() => this.onNavToAssignedLang()}>
                          <AngleLeftArrow />
                        </span>
                        {constantText.translations.assigned_lang_text}
                      </div> : <div className="lang-text">{constantText.translations.selected_lang_text}</div>
                    ) : (
                        <div className="lang-text">
                          {constantText.translations.select_lang_text}
                        </div>
                      )}
                    <LeftTab
                      className="tabs lang-tab"
                      orientation="horizontal"
                      variant="scrollable"
                      options={languages || []}
                      selectedTab={selectedLangTab}
                      showIcon={false}
                      handleChange={this.handleLangTab}
                    />
                  </div>
                  <div
                    className="right-area other-lang-btn"
                    onClick={(e) => this.onLangDialogClose(true)}
                  >
                    {constantText.translations.other_lang_text}
                  </div>
                </div>
              </div>

              {languages?.length > 0 &&
                <div className="whitebox">
                  {translationPage === "movie" && (
                    <TranslationMovie
                      params={params}
                      language={languages[selectedLangTab]}
                      showNavToAssignedLang={showNavToAssignedLang}
                      permissionAddEdit={permissionAddEdit}
                      permissionViewOnly={permissionViewOnly}
                      updateMarkAsDoneAction={this.updateMarkAsDoneAction}
                    />
                  )}
                  {translationPage === "cast" && (
                    <TranslationCastProfile
                      params={params}
                      language={languages[selectedLangTab]}
                      showNavToAssignedLang={showNavToAssignedLang}
                      permissionAddEdit={permissionAddEdit}
                      permissionViewOnly = {permissionViewOnly}
                      updateMarkAsDoneAction={this.updateMarkAsDoneAction}
                    />
                  )}
                  {translationPage === "collection" && (
                    <TranslationCollection
                      params={params}
                      language={languages[selectedLangTab]}
                      showNavToAssignedLang={showNavToAssignedLang}
                      permissionAddEdit={permissionAddEdit}
                      permissionViewOnly={permissionViewOnly}
                      updateMarkAsDoneAction={this.updateMarkAsDoneAction}
                    />
                  )}
                  {translationPage === "tvshow" && (
                    <TranslationTvshow
                      params={params}
                      language={languages[selectedLangTab]}
                      showNavToAssignedLang={showNavToAssignedLang}
                      permissionAddEdit={permissionAddEdit}
                      permissionViewOnly={permissionViewOnly}
                      updateMarkAsDoneAction={this.updateMarkAsDoneAction}
                    />
                  )}
                  {translationPage === "video" && (
                    <TranslationVideo
                      params={params}
                      language={languages[selectedLangTab]}
                      showNavToAssignedLang={showNavToAssignedLang}
                      permissionAddEdit={permissionAddEdit}
                      permissionViewOnly={permissionViewOnly}
                      updateMarkAsDoneAction={this.updateMarkAsDoneAction}
                    />
                  )}
                  {translationPage === "season" && (
                    <TranslationSeason
                      params={params}
                      language={languages[selectedLangTab]}
                      showNavToAssignedLang={showNavToAssignedLang}
                      permissionAddEdit={permissionAddEdit}
                      permissionViewOnly={permissionViewOnly}
                      updateMarkAsDoneAction={this.updateMarkAsDoneAction}
                    />
                  )}
                  {translationPage === "episode" && (
                    <TranslationEpisode
                      params={params}
                      language={languages[selectedLangTab]}
                      showNavToAssignedLang={showNavToAssignedLang}
                      permissionAddEdit={permissionAddEdit}
                      permissionViewOnly={permissionViewOnly}
                      updateMarkAsDoneAction={this.updateMarkAsDoneAction}
                    />
                  )}
                </div>
              }
            </Fragment>
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userDetails: state.user_reducer.userdetails,
  };
};

const actionCreators = {
  getUserData: userActions.user_details_action,
};

export default connect(mapStateToProps, actionCreators)(Translation);
