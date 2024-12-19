import React, { Component } from 'react';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';

//Components
import ContentProperties from './ContentProperties/ContentProperties';
import CastAndCrew from './CastNCrew/CastNCrew';
import CreateEditVideo from './../CreateMovie/CreateEditVideo/CreateEditVideo';
import LicenseModule from '../CreateMovie/LicenseModule/LicenseModule';
import ManualLicense from './LicenseModule/SubComponents/ManualLicense';
import Images from './Images/Images';
import SeoDetails from './SeoDetails/SeoDetails';
import MapContent from './MapContent/MapContent';
import CheckList from './CheckList/CheckList';

//Common Component
import LeftTab from '../Common/LeftTab/CommonLeftTab';
import BreadCrumbs from '../Common/BreadCrumbs/BreadCrumbs';
import QuickLinks from '../Common/QuickLinks/QuickLinks';

//Services
import { apiCalls } from '../../_services/common.service';

//Helper Files
import { history } from '../../_helpers/history';
import { permissionObj } from '../../_helpers/permission';
import Config from '../../Config/config';
import { getLocalData } from "../../_helpers/util";
import { showSuccessErrorMsg } from "../../_actions/alertMessages.action";

//Constant files
import { breadCrumbs, quickLinks, quickLinksForQuickFiling } from './breadCrumbs';
import { constantText } from '../../_helpers/constants.text';

//Images
import AngleLeftArrow from "images/angle-left-arrow.svg";

//css
import "../../../public/css/Common/CreateTabHead.css";

class CreateMovie extends Component {
  constructor(props) {
    super(props);
    let { state } = props;
    let filterKey = state ? (state == "quick-filing") ? "quickFiling" : "singleLanding" : "properties";
    this.state = {
      userData: getLocalData("userData"),
      jsonData: {}, selectedTab: 0, movieId: null, language: 'EN',
      stage: { title: "Draft" },
      leftTab: constantText?.movie_left_tab_options_arr?.filter(data => (data[filterKey])) || [],
      createLicenseForm: false,
      editLicenseForm: 0,
      licenceData: '',
      externalId: null,
    };
  }

  componentDidMount = () => {
    let { match } = this.props;
    let { leftTab } = this.state;
    leftTab.map(item => item.isDone = false);
    const defaultTab = { ...this.props?.location?.state }
    if (match?.params?.id) {
      this.setState(prevState => ({ movieId: match.params.id, defaultTab }), () => this.handlePermission());
    }
    else {
      this.getMovieId();
    }
  }

  getMovieId = async () => {
    let { state } = this.props;
    let journeyType = state ? (state == "quick-filing") ? "2" : "3" : "1";
    let response = await apiCalls(Config.movieProperties, 'POST', { movie: { journeyType } });
    let { movieId } = response;
    this.setMovieId(movieId);
  }

  setMovieId = movieId => {
    let { state } = this.props;
    this.setState(prevState => ({ movieId }), () => this.handlePermission());
    let route = state ? (state == "quick-filing") ? `/quick/movie/edit/${movieId}` :
      `/single/movie/edit/${movieId}` : `/movie/edit/${movieId}`;
    history.push(route);
  }

  getJsonData = async () => {
    let { state } = this.props;
    const type = state ? (state == "quick-filing") ? 'movie_QuickFilling_Structure' : 'movie_SingleLanding_Structure' :
      'movie_frontend_structure';
    const response = await apiCalls(`${Config.metaDataUrl}/${type}`, 'GET', {}, null, true, null, this.autoSaveError);
    if (response) {
      const { data } = response;
      this.setState(prevState => ({ jsonData: data || {} }));
    }
  }

  getMovieStatus = async () => {
    let { userData, leftTab, movieId } = this.state;
    const response = await apiCalls(`${Config.movieAction}/${movieId}`, "GET", null, null, false);
    if (response) {
      let shallowArr = [...leftTab];
      response?.map(data => {
        const { sectionName, isDone, isLocked, lockedByUser } = data;
        const { id, firstName, lastName } = lockedByUser || {};
        const index = shallowArr?.findIndex(obj => (obj?.permissionSubKey == sectionName));
        shallowArr[index] = {
          ...shallowArr[index],
          isDone,
          isLocked: (isLocked && (id != userData?.userID)) ? true : false,
          lockedBy: isLocked ? `${firstName} ${lastName}` : ""
        }
      });
      const checkIsDone = shallowArr.find(item => (item.permissionSubKey !== 'checklistModule' && item.isDone === false));
      if (!checkIsDone) {
        shallowArr.forEach(item => {
          if (item.permissionSubKey === 'checklistModule') {
            item.isDone = true;
          }
        })
      }
      this.setState((prevState) => ({ leftTab: shallowArr }), () => {
        this.setChecklistCheck();
      });
    } else {
      this.setChecklistCheck();
    }
  }

  setCheckListIsDone = (flag) => {
    let {leftTab} = this.state;
    let shallowArr = [...leftTab];
    shallowArr.forEach((item) => {
      if (item.permissionSubKey === "checklistModule") {
        item.isDone = flag;
      }
    });
    this.setState({leftTab: shallowArr})
  }

  setChecklistCheck = () => {
    let {leftTab} = this.state;
    let shallowArr = [...leftTab];
    const checkIsDone = shallowArr.find(
      (item) =>
        item.permissionSubKey !== "checklistModule" && item.isDone === false
    );
    if (!checkIsDone) {
      this.setCheckListIsDone(true);
    } else {
      this.setCheckListIsDone(false);
    }
  }

  handlePermission = () => {
    let { leftTab } = this.state;
    let selectedTab = leftTab?.findIndex(data => (!data?.permissionKey || (
      data?.permissionSubKey ?
        permissionObj?.[data?.permissionKey]?.[data.permissionSubKey]?.[data.permissionName]() :
        permissionObj?.[data?.permissionKey]?.[data.permissionName]()
    )));
    this.setState(prevState => ({ selectedTab }), () => {
      this.getMovieStatus();
      this.getJsonData();
    });
  }

  markAsDone = async (index, isDone) => {
    let { movieId, leftTab } = this.state;
    let shallowArr = [...leftTab];
    if (isDone) {
      let data = {
        movieId, isDone,
        sectionName: shallowArr[index]?.permissionSubKey
      };
      const response = await this.markAsDoneNLockedAction(data);
      if (response) {
        shallowArr[index] = { ...shallowArr[index], isDone };
      }
    }
    else {
      shallowArr[index] = { ...shallowArr[index], isDone };
    }
    this.setState(prevState => ({ leftTab: shallowArr }));
  }

  unLockedSession = async index => {
    let { movieId, leftTab } = this.state;
    let shallowArr = [...leftTab];
    let data = {
      movieId, isLocked: true,
      sectionName: shallowArr[index]?.permissionSubKey
    };
    const response = await this.markAsDoneNLockedAction(data);
    if (response) {
      shallowArr[index] = { ...shallowArr[index], isLocked: false };
      this.setState(prevState => ({ leftTab: shallowArr }));
    }
  }

  markAsDoneNLockedAction = async data => {
    const response = await apiCalls(Config.movieAction, "POST", data, null, true, null, this.autoSaveError);
    return response;
  }

  handleTab = (event, selectedTab) => this.setState({ selectedTab, createLicenseForm: false }, () => this.getMovieStatus());

  handleRoute = route => {
    history.push(route);
  }

  linksClickHandler = (data) => {
    const { stage } = this.state;
    history.push(this.props?.match?.url + data?.path, stage);
  }

  openCreateLicenseForm = () => {
    this.setState(prevState => ({
      editLicenseForm: 0,
      createLicenseForm: !this.state.createLicenseForm,
      licenceData: ''
    }));
  }

  openEditForm = (data) => {
    this.setState(prevState => ({
      editLicenseForm: 1,
      createLicenseForm: !this.state.createLicenseForm,
      licenceData: data
    }));
  }

  setStage = (stage) => {
    stage = stage || { ...this.state.stage }
    const defaultTab = { ...this.state.defaultTab }
    let selectedTab = this.state.selectedTab
    if (defaultTab && defaultTab.selectedTab !== undefined && !defaultTab.redirected) {
      selectedTab = defaultTab.selectedTab
      const leftTab = [...this.state.leftTab]
      selectedTab = leftTab.findIndex(x => x.label === defaultTab.tabLabel);
      if (selectedTab == -1) {
        selectedTab = 0;
      }
      defaultTab.redirected = true
    }
    this.setState({ stage, selectedTab, defaultTab });
  };

  setTitle = (movieTitle) => {
    this.setState({ movieTitle })
  }

  autoSaveError = error => {
    if (error?.data?.message == constantText.locked_by_another_text) {
      showSuccessErrorMsg(error?.data?.message, null, "Alert", true, null, null, this.getMovieStatus);
    } else {
      showSuccessErrorMsg(error?.data?.message, null, "Error", true, null, true);
    }
  }

  getExternalId = (externalId) => {
    this.setState({ externalId })
  }

  quickLinksEnable = (links) => {
    links.map(item => item.enable = (item.key && permissionObj?.['movies'] && permissionObj?.['movies']?.[item.key] && permissionObj?.['movies']?.[item.key]) ? permissionObj?.['movies']?.[item.key]?.canUpdate() : true)
    return links;
  }

  getMovieTabsComp = () => {
    let { jsonData, leftTab, selectedTab, movieId, language, createLicenseForm, editLicenseForm, licenceData, stage,
      movieTitle, externalId } = this.state;
    return (
      <div className="mid-area">
        {(selectedTab == 0 && movieId && jsonData.ContentProperties) &&
          <ContentProperties {...this.props} language={language} movieId={movieId}
            selectedTab={selectedTab} stage={stage} jsonData={jsonData.ContentProperties || {}}
            setStage={this.setStage} autoSaveError={this.autoSaveError} setTitle={this.setTitle}
            markAsDone={this.markAsDone} unLockedSession={this.unLockedSession} currentTabData={leftTab[selectedTab]}
            getMovieStatus={this.getMovieStatus} getExternalId={this.getExternalId} />
        }
        {(selectedTab == 1 && movieId && jsonData.CastNCrew) &&
          <CastAndCrew movieId={movieId} language={language} selectedTab={selectedTab} stage={stage}
            markAsDone={this.markAsDone} getMovieStatus={this.getMovieStatus} autoSaveError={this.autoSaveError}
            unLockedSession={this.unLockedSession} currentTabData={leftTab[selectedTab]} jsonData={jsonData.CastNCrew || {}} />
        }
        {(selectedTab == 2 && movieId && jsonData.Video) &&
          <CreateEditVideo {...this.props} language={language} contentId={movieId} getMovieStatus={this.getMovieStatus}
            selectedTab={selectedTab} stage={stage} markAsDone={this.markAsDone} unLockedSession={this.unLockedSession}
            currentTabData={leftTab[selectedTab]} autoSaveError={this.autoSaveError} jsonData={jsonData.Video || []} refreshActionStatus={this.getMovieStatus}/>
        }
        {(selectedTab === 3 && jsonData.License) &&
          (createLicenseForm == true) ?
          <ManualLicense
            {...this.props} markAsDone={this.markAsDone} language={language} contentId={movieId} stage={stage} getMovieStatus={this.getMovieStatus}
            openLicenseForm={this.openCreateLicenseForm} editTab={editLicenseForm} autoSaveError={this.autoSaveError}
            licenseData={licenceData} openLicenseEditForm={this.openEditForm} currentTabData={leftTab[selectedTab]} selectedTab={selectedTab}
            jsonData={jsonData.License || []} />
          : (selectedTab === 3 && movieId && jsonData.License) &&
          <LicenseModule
            {...this.pr1ops} language={language} contentId={movieId} stage={stage} getMovieStatus={this.getMovieStatus}
            openLicenseForm={this.openCreateLicenseForm} markAsDone={this.markAsDone} openLicenseEditForm={this.openEditForm}
            currentTabData={leftTab[selectedTab]} unLockedSession={this.unLockedSession} selectedTab={selectedTab}
            autoSaveError={this.autoSaveError} jsonData={jsonData.License || []}
          />
        }
        {(selectedTab == 4 && movieId && jsonData.Images) &&
          <Images {...this.props} contentId={movieId} markAsDone={this.markAsDone} selectedTab={selectedTab} stage={stage}
            unLockedSession={this.unLockedSession} currentTabData={leftTab[selectedTab]} jsonData={jsonData.Images || {}}
            getMovieStatus={this.getMovieStatus} autoSaveError={this.autoSaveError} externalId={externalId} />
        }
        {(selectedTab == 5 && movieId && jsonData.Seo) &&
          <SeoDetails contentId={movieId} markAsDone={this.markAsDone} selectedTab={selectedTab} stage={stage} movieTitle={movieTitle}
            unLockedSession={this.unLockedSession} currentTabData={leftTab[selectedTab]} jsonData={jsonData.Seo || []}
            getMovieStatus={this.getMovieStatus} autoSaveError={this.autoSaveError} />
        }
        {(selectedTab == 6 && movieId && jsonData.MapContent) &&
          <MapContent contentId={movieId} language={language} selectedTab={selectedTab} stage={stage} getMovieStatus={this.getMovieStatus}
            markAsDone={this.markAsDone} unLockedSession={this.unLockedSession} currentTabData={leftTab[selectedTab]}
            autoSaveError={this.autoSaveError} jsonData={jsonData.MapContent || []} />
        }
        {(selectedTab == 7) &&
          <CheckList contentId={movieId} language={language} selectedTab={selectedTab} stage={stage}
            currentTabData={leftTab[selectedTab]} unLockedSession={this.unLockedSession} autoSaveError={this.autoSaveError}
            getMovieStatus={this.getMovieStatus} />
        }
      </div>
    );
  };

  getQuickFilingTabsComp = () => {
    let { jsonData, leftTab, selectedTab, movieId, language, createLicenseForm, editLicenseForm, licenceData,
      stage, movieTitle, externalId } = this.state;
    return (
      <div className="mid-area">
        {(selectedTab == 0 && movieId && jsonData.ContentProperties) &&
          <ContentProperties {...this.props} language={language} movieId={movieId} selectedTab={selectedTab} stage={stage}
            setStage={this.setStage} autoSaveError={this.autoSaveError} setTitle={this.setTitle}
            markAsDone={this.markAsDone} unLockedSession={this.unLockedSession} currentTabData={leftTab[selectedTab]}
            getMovieStatus={this.getMovieStatus} getExternalId={this.getExternalId}
            jsonData={jsonData.ContentProperties || {}} />
        }
        {(selectedTab == 1 && movieId && jsonData.Video) &&
          <CreateEditVideo {...this.props} language={language} contentId={movieId} autoSaveError={this.autoSaveError}
            selectedTab={selectedTab} stage={stage} markAsDone={this.markAsDone} getMovieStatus={this.getMovieStatus}
            unLockedSession={this.unLockedSession} currentTabData={leftTab[selectedTab]} jsonData={jsonData.Video || []} refreshActionStatus={this.getMovieStatus}/>
        }
        {(selectedTab === 2 && movieId && jsonData.License) &&
          (createLicenseForm == true) ?
          <ManualLicense
            {...this.props} markAsDone={this.markAsDone} language={language} contentId={movieId} stage={stage} getMovieStatus={this.getMovieStatus}
            openLicenseForm={this.openCreateLicenseForm} editTab={editLicenseForm} autoSaveError={this.autoSaveError}
            licenseData={licenceData} openLicenseEditForm={this.openEditForm} unLockedSession={this.unLockedSession}
            currentTabData={leftTab[selectedTab]} selectedTab={selectedTab} jsonData={jsonData.License || []}
          />
          : (selectedTab === 2 && movieId && jsonData.License) &&
          <LicenseModule
            {...this.props} language={language} contentId={movieId} getMovieStatus={this.getMovieStatus} stage={stage}
            openLicenseForm={this.openCreateLicenseForm} markAsDone={this.markAsDone} openLicenseEditForm={this.openEditForm}
            unLockedSession={this.unLockedSession} currentTabData={leftTab[selectedTab]} selectedTab={selectedTab}
            autoSaveError={this.autoSaveError} jsonData={jsonData.License || []}
          />
        }
        {(selectedTab == 3 && movieId && jsonData.Images) &&
          <Images {...this.props} contentId={movieId} markAsDone={this.markAsDone} selectedTab={selectedTab} stage={stage}
            unLockedSession={this.unLockedSession} getMovieStatus={this.getMovieStatus} jsonData={jsonData.Images || {}}
            currentTabData={leftTab[selectedTab]} autoSaveError={this.autoSaveError} externalId={externalId} />
        }
        {(selectedTab == 4 && movieId && jsonData.Seo) &&
          <SeoDetails {...this.props} contentId={movieId} markAsDone={this.markAsDone} selectedTab={selectedTab} stage={stage} movieTitle={movieTitle}
            unLockedSession={this.unLockedSession} getMovieStatus={this.getMovieStatus} jsonData={jsonData.Seo || []}
            currentTabData={leftTab[selectedTab]} autoSaveError={this.autoSaveError} />
        }
        {(selectedTab == 5 && movieId && jsonData.MapContent) &&
          <MapContent contentId={movieId} language={language} selectedTab={selectedTab} stage={stage}
            getMovieStatus={this.getMovieStatus} currentTabData={leftTab[selectedTab]} jsonData={jsonData.MapContent || []}
            markAsDone={this.markAsDone} unLockedSession={this.unLockedSession} autoSaveError={this.autoSaveError} />
        }
        {(selectedTab == 6) &&
          <CheckList {...this.props} contentId={movieId} language={language} selectedTab={selectedTab} stage={stage}
            currentTabData={leftTab[selectedTab]} unLockedSession={this.unLockedSession} autoSaveError={this.autoSaveError}
            getMovieStatus={this.getMovieStatus} />
        }
      </div>
    );
  };

  getSinglePageLandingTabsComp = () => {
    let { jsonData, leftTab, selectedTab, movieId, language, createLicenseForm, editLicenseForm, licenceData,
      stage, movieTitle, externalId } = this.state;
    return (
      <div className="mid-area">
        {(selectedTab == 0 && movieId && jsonData.ContentProperties) &&
          <ContentProperties {...this.props} language={language} movieId={movieId} selectedTab={selectedTab} stage={stage}
            setStage={this.setStage} autoSaveError={this.autoSaveError} setTitle={this.setTitle}
            markAsDone={this.markAsDone} unLockedSession={this.unLockedSession} currentTabData={leftTab[selectedTab]}
            getMovieStatus={this.getMovieStatus} getExternalId={this.getExternalId}
            jsonData={jsonData.ContentProperties || {}} />
        }
        {(selectedTab === 1 && movieId && jsonData.License) &&
          (createLicenseForm == true) ?
          <ManualLicense
            {...this.props} language={language} contentId={movieId} stage={stage} getMovieStatus={this.getMovieStatus}
            openLicenseForm={this.openCreateLicenseForm} editTab={editLicenseForm} currentTabData={leftTab[selectedTab]}
            licenseData={licenceData} openLicenseEditForm={this.openEditForm} unLockedSession={this.unLockedSession}
            markAsDone={this.markAsDone} selectedTab={selectedTab} autoSaveError={this.autoSaveError}
            jsonData={jsonData.License || []}
          />
          : (selectedTab === 1 && movieId && jsonData.License) &&
          <LicenseModule
            {...this.props} language={language} contentId={movieId} getMovieStatus={this.getMovieStatus} stage={stage}
            openLicenseForm={this.openCreateLicenseForm} markAsDone={this.markAsDone} openLicenseEditForm={this.openEditForm}
            currentTabData={leftTab[selectedTab]} unLockedSession={this.unLockedSession} selectedTab={selectedTab}
            autoSaveError={this.autoSaveError} jsonData={jsonData.License || []}
          />
        }
        {(selectedTab == 2 && movieId && jsonData.Images) &&
          <Images {...this.props} contentId={movieId} markAsDone={this.markAsDone} selectedTab={selectedTab} stage={stage}
            unLockedSession={this.unLockedSession} getMovieStatus={this.getMovieStatus} jsonData={jsonData.Images || {}}
            currentTabData={leftTab[selectedTab]} autoSaveError={this.autoSaveError} externalId={externalId} />
        }
        {(selectedTab == 3 && movieId && jsonData.Seo) &&
          <SeoDetails {...this.props} contentId={movieId} markAsDone={this.markAsDone} selectedTab={selectedTab} stage={stage} movieTitle={movieTitle}
            unLockedSession={this.unLockedSession} getMovieStatus={this.getMovieStatus} jsonData={jsonData.Seo || []}
            currentTabData={leftTab[selectedTab]} autoSaveError={this.autoSaveError} />
        }
        {(selectedTab == 4 && movieId && jsonData.MapContent) &&
          <MapContent contentId={movieId} language={language} selectedTab={selectedTab} stage={stage}
            getMovieStatus={this.getMovieStatus} currentTabData={leftTab[selectedTab]} jsonData={jsonData.MapContent || []}
            markAsDone={this.markAsDone} unLockedSession={this.unLockedSession} autoSaveError={this.autoSaveError} />
        }
        {(selectedTab == 5) &&
          <CheckList {...this.props} contentId={movieId} language={language} selectedTab={selectedTab} stage={stage}
            unLockedSession={this.unLockedSession} autoSaveError={this.autoSaveError}
            getMovieStatus={this.getMovieStatus} currentTabData={leftTab[selectedTab]} />
        }
      </div>
    );
  };

  render() {
    let { leftTab, selectedTab, externalId } = this.state;
    let { match, state } = this.props;
    let pageTitle = constantText.movie_text;
    if (state && state === 'quick-filing') {
      pageTitle = constantText.quick_filing_text;
    } else if (state && state === 'single-landing-page') {
      pageTitle = constantText.single_landing_page_text;
    }
    return (
      <div className="d-wrap c-n">
        <BreadCrumbs className="" links={breadCrumbs.links}
          typography={breadCrumbs.typography((match?.params?.id) ? 'edit' : 'create', state)} />
        <div className="profile-head flex align-items-center justify-content-between">
          <div className="back-user-btn">
            <span data-test="handleRoute" onClick={() => this.handleRoute('/movie')}><AngleLeftArrow /></span>
            <strong><span>{(match?.params?.id) ? pageTitle :
              constantText.movie_text}</span></strong>
          </div>
          {externalId &&
            <div className="head-external-id">
              <span className="text">{constantText.external_id_text}</span>
              <span className="num">{externalId}</span>
            </div>
          }
        </div>

        <div className="col-3-box">
          <div className="row gutter-minus-10">
            <div className="col-md-4 col-lg-3 col-xl-2 gutter-10 left-section">
              <div className="whitebox">
                <LeftTab className="leftTab-widget" orientation="vertical" variant="scrollable"
                  options={leftTab} selectedTab={selectedTab}
                  showIcon={true} Icon1={RadioButtonCheckedIcon} Icon2={CheckCircleIcon} Icon3={RadioButtonUncheckedIcon}
                  handleChange={this.handleTab} />
              </div>
            </div>
            <div className="col-md-8 col-lg-6 col-xl-8 gutter-10 mid-section">
              {state ? (state == "quick-filing") ? this.getQuickFilingTabsComp() : this.getSinglePageLandingTabsComp() :
                this.getMovieTabsComp()}
            </div>
            <div className="col-md-12 col-lg-3 col-xl-2 gutter-10 right-section">
              <QuickLinks className="" header_text={constantText.quick_links_text}
                showTips={(state && ((state == "quick-filing") || (state == "single-landing-page"))) ? true : false}
                options={state ? (state == "quick-filing") ? quickLinksForQuickFiling :
                  this.quickLinksEnable(quickLinksForQuickFiling) : this.quickLinksEnable(quickLinks)}
                clicked={this.linksClickHandler} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default CreateMovie;
