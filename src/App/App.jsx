import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";

import Loader from '../_components/Common/ContentLoader/ContentLoader';
import { history } from "../_helpers/history";
import { PrivateRouteWithHeaderAndTabs } from "../_components/PrivateRoute";
import { LoginPage } from "../_components/LoginPage/LoginPage";
import UserListing from "../_components/User/UserListing";
import ViewUser from "../_components/User/ViewUser";
import CreateUser from "../_components/User/CreateUser/CreateUser";
import EditUser from "../_components/User/EditUser/EditUser";
import { Callback } from "../_components/Common/Callback/Callback";
import Dashboard from "../_components/Dashboard/Dashboard";
import RoleListing from "../_components/RoleManagement/RoleListing";
import CreateEditRole from "../_components/RoleManagement/CreateRole/CreateEditRole";

//Cast and crew Route
import CastAndCrewManagement from "../_components/CastAndCrewManagement/CastAndCrewManagement";
import ViewCastNCrew from "../_components/CastAndCrewManagement/ViewCastNCrew";
import CreateProfile from "../_components/CastAndCrewManagement/CreateProfile/CreateProfile";
import DragDropImage from "../_components/CastAndCrewManagement/DragDropImage/DragDropImage";
import ImageListing from "../_components/CastAndCrewManagement/DragDropImage/ImageListing/ImageListing";
import PhotoDetails from "../_components/CastAndCrewManagement/PhotoDetails/PhotoDetails";
import CreateFaqs from "../_components/CastAndCrewManagement/CreateFaqs/CreateFaqs";
import ListProfile from "../_components/CastAndCrewManagement/ListProfile/ListProfile";
import ViewFaqs from "../_components/CastAndCrewManagement/ViewFaqs/ViewFaqs";
import ManageMasters from "../_components/Masters/ManageMasters";
import Masters from "../_components/Masters/Masters";
import ManageGroup from "../_components/Masters/ManageGroup/ManageGroup";
import ManageTemplate from "../_components/Masters/ManageTemplate/ManageTemplate";
import ManageTranslation from "../_components/Masters/Translation/ManageTranslation";
//Movie Route
import MovieList from '../_components/MovieManagement/MovieList/MovieList';
import LinkedMovies from '../_components/MovieManagement/LinkMovies/LinkMovies';
import CollectionAssignment from '../_components/CreateMovie/CollectionAssignment/CollectionAssignment';
import RelatedContent from '../_components/CreateMovie/RelatedContent/RelatedContent';
import CreateMovie from '../_components/CreateMovie/CreateMovie';
import ViewMovie from '../_components/CreateMovie/ViewMovie';
import Translation from "../_components/Translation/Translation";
import Collection from "../_components/Collection/CreateCollection/Collection";
import ListCollection from "../_components/Collection/ListCollection/ListCollection";
import PublishedHistoryMovie from '../_components/MovieManagement/PublishHistory/PublishedHistory';
import PublishedHistoryCollection from '../_components/Collection/PublishHistory/Published_HistoryCollection';
import PublishedHistoryCastCrew from '../_components/CastAndCrewManagement/PublishHistory/PublishHistory_Castncrew';
import ViewCollection from '../_components/Collection/CreateCollection/ViewCollection';
import LinkCollection from "../_components/Collection/ListCollection/LinkCollection/LinkCollection";
//Video Route
import VideoList from '../_components/Video/VideoList/VideoList';
import LinkedVideos from '../_components/Video/LinkVideos/LinkVideos';
import Video from '../_components/Video/Video';
import ViewVideos from '../_components/Video/ViewVideos';
import VideoCollectionAssignment from '../_components/Video/CollectionAssignment/CollectionAssignment';
import VideoRelatedContent from "../_components/Video/RelatedContent/RelatedContent";
import PublishedHistoryVideo from "../_components/Video/PublishHistory/PublishedHistory";

//Video Route
import LinkedShows from "../_components/TvShow/LinkedShows/LinkedShows";
import TvShow from "../_components/TvShow/TvShow/TvShow";
import TvShowList from "../_components/TvShow/TvShowList/TvShowList";
import ViewTvShow from "../_components/TvShow/TvShow/ViewTvShow";
import TvShowCollectionAssignment from '../_components/TvShow/CollectionAssignment/CollectionAssignment';
import TvShowRelatedContent from "../_components/TvShow/RelatedContent/RelatedContent";
import PublishedHistoryTvShow from '../_components/TvShow/PublishedHistory/PublishedHistoryTvShow';

//Permission Components
import NoPermission from "../_components/Common/NoPermission/NoPermission";

//Season components
import Season from "../_components/Season/SeasonList/Season";
import CreateSeason from "../_components/Season/CreateSeason/CreateSeason";
import ViewSeason from "../_components/Season/CreateSeason/ViewSeason";
import SeasonRelatedContent from "../_components/Season/CreateSeason/RelatedContent/RelatedContent";
import SeasonCollectionAssignment from "../_components/Season/CreateSeason/CollectionAssignment/CollectionAssignment";
import SeasonTemplate from "../_components/Season/CreateSeason/Template/AddTemplate/addTemplate";
import PublishedHistorySeason from '../_components/Season/PublishHistory/PublishHistory';

//Episode Route
import EpisodeList from "../_components/Episode/EpisodeList/Episode";
import EpisodeCollectionAssignment from "../_components/Episode/CollectionAssignment/CollectionAssignment";
import EpisodeRelatedContent from "../_components/Episode/RelatedContent/RelatedContent";
import CreateEpisode from "../_components/Episode/CreateEpisode/CreateEpisode";
import ViewEpisode from "../_components/Episode/CreateEpisode/ViewEpisode";
import Placeholder from '../_components/Episode/Placeholder/Placeholder';
import PublishedHistoryEpisode from '../_components/Episode/PublishedHistory/PublishedHistory';

//Default Route
import Page404 from "../_components/Common/ErrorPage/Page404";

//Transcoding Management
import Transcoding from '../_components/TranscodingManagement/Transcoding/Transcoding';
import TranscodingHistory from '../_components/TranscodingManagement/Transcoding/TranscodingHistory';
import MapContent from '../_components/TranscodingManagement/MapContent/MapContent';

//BeforeTv
import BeforeTv from '../_components/Season/BeforeTv/BeforeTv'

//BulksOps
import BulkOps from '../_components/BulkOps/BulkOps';
import BulkDashboard from '../_components/BulkDashboard/BulkDashboard';
import ViewJob from "../_components/BulkDashboard/ViewJob/ViewJob";
import BulkUpload from '../_components/BulkOps/BulkUpload/ViewJob/ViewJob';

//Ingestion
import Ingestion from '../_components/Ingestion/IngestionList';
import NewIngestion from '../_components/NewIngestion/NewIngestionList';
class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Router history={history}>
        <Loader />
        <Switch>
          <Route exact path="/" component={Callback} />
          <Route path="/login" component={LoginPage} />
          <PrivateRouteWithHeaderAndTabs exact path="/dashboard" component={Dashboard} activeTab={0}
            permission="always" permissionKey="canView" />

          {/**Roles Routes */}
          <PrivateRouteWithHeaderAndTabs exact path="/roles" component={RoleListing} activeTab={1}
            permission="always" permissionKey="canView" />
          <PrivateRouteWithHeaderAndTabs exact path="/role/create" component={CreateEditRole} activeTab={1}
            permission="role" permissionKey="canCreate" />
          <PrivateRouteWithHeaderAndTabs exact path="/role/edit/:id" component={CreateEditRole} activeTab={1}
            permission="role" permissionKey="canUpdate" />

          {/**Users Route */}
          <PrivateRouteWithHeaderAndTabs exact path="/users" component={UserListing} activeTab={2}
            permission="always" permissionKey="canView" />
          <PrivateRouteWithHeaderAndTabs exact path="/user/view/:id" component={ViewUser} activeTab={2}
            permission="user" permissionKey="canView" />
          <PrivateRouteWithHeaderAndTabs path="/user/create" component={CreateUser} activeTab={2}
            permission="user" permissionKey="canCreate" />
          <PrivateRouteWithHeaderAndTabs exact path="/user/edit/:id" component={EditUser} activeTab={2}
            permission="user" permissionKey="canUpdate" />

          {/** cast Route */}
          <PrivateRouteWithHeaderAndTabs exact path="/cast" component={ListProfile} activeTab={0} permission="cast"
            permissionKey="canView" />
          <PrivateRouteWithHeaderAndTabs exact path="/cast/create" component={CastAndCrewManagement} activeTab={0}
            permission="cast" subPermission="createCast" permissionKey="canCreate" />
          <PrivateRouteWithHeaderAndTabs exact path="/cast/edit/:id" component={CastAndCrewManagement} activeTab={0}
            permission="cast" subPermission="createCast" permissionKey="canUpdate" />
          <PrivateRouteWithHeaderAndTabs exact path="/cast/view/:id" component={ViewCastNCrew} activeTab={0}
            permission="cast" permissionKey="canView" />
          <PrivateRouteWithHeaderAndTabs exact path="/cast/edit/:castId/translation" component={Translation}
            permission="cast" subPermission="translation" permissionKey="canView" activeTab={0} />
          <PrivateRouteWithHeaderAndTabs exact path="/cast/view/:castId/translation" component={Translation}
            permission="cast" subPermission="translation" permissionKey="canView" activeTab={0} />
          <PrivateRouteWithHeaderAndTabs path="/cast/edit/:id/published-history-castcrew" component={PublishedHistoryCastCrew}
            permission="cast" subPermission="publishHistory" permissionKey="canUpdate" activeTab={0} state="castandcrew" />
          <PrivateRouteWithHeaderAndTabs path="/cast/view/:id/published-history-castcrew" component={PublishedHistoryCastCrew}
            permission="cast" subPermission="publishHistory" permissionKey="canView" activeTab={0} state="view" />
          <PrivateRouteWithHeaderAndTabs exact path="/cast-and-crew-management" component={CastAndCrewManagement}
            activeTab={0} />
          <PrivateRouteWithHeaderAndTabs path="/create-profile" component={CreateProfile} activeTab={0} />
          <PrivateRouteWithHeaderAndTabs path="/image-upload" component={DragDropImage} activeTab={0} permission="cast" permissionKey="canCreate" />
          <PrivateRouteWithHeaderAndTabs path="/image-listing" component={ImageListing} activeTab={0} permission="cast" permissionKey="canView" />
          <PrivateRouteWithHeaderAndTabs path="/create-faqs" component={CreateFaqs} activeTab={0} permission="cast" permissionKey="canUpdate" />
          <PrivateRouteWithHeaderAndTabs path="/photo-details" component={PhotoDetails} activeTab={0} permission="cast" permissionKey="canUpdate" />
          <PrivateRouteWithHeaderAndTabs path="/view-faqs" component={ViewFaqs} activeTab={0} permission="cast" permissionKey="canView" />
          {/* Masters Route */}
          <PrivateRouteWithHeaderAndTabs exact path="/masters" permission="always" permissionKey="canView" component={Masters} activeTab={3} />
          <PrivateRouteWithHeaderAndTabs exact path="/manage-masters" permission="masters" permissionKey="canView" component={ManageMasters} activeTab={3} />
          <PrivateRouteWithHeaderAndTabs path="/manage-masters/translation" permission="masters" permissionKey="canView" component={ManageTranslation} activeTab={3} />
          <PrivateRouteWithHeaderAndTabs path="/manage-masters/template" permission="masters" permissionKey="canView" component={ManageTemplate} activeTab={3} />
          <PrivateRouteWithHeaderAndTabs path="/manage-masters/country-group" permission="masters" permissionKey="canView" component={ManageGroup} activeTab={3} />

          {/* Collection Route */}
          <PrivateRouteWithHeaderAndTabs exact path="/collections" component={ListCollection} activeTab={0}
            permission="collections" permissionKey="canView" />
          <PrivateRouteWithHeaderAndTabs exact path="/collection/create" component={Collection} activeTab={0}
            permission="collections" subPermission="createCollection" permissionKey="canCreate" />
          <PrivateRouteWithHeaderAndTabs exact path="/collection/edit/:id" component={Collection} activeTab={0}
            permission="collections" subPermission="createCollection" permissionKey="canUpdate" />
          <PrivateRouteWithHeaderAndTabs exact path="/collection/view/:id" component={ViewCollection} activeTab={0}
            permission="collections" permissionKey="canView" />
          <PrivateRouteWithHeaderAndTabs exact path="/collection/link-collections/:id" component={LinkCollection} activeTab={0}
            permission="collections" permissionKey="canUpdate" />
          <PrivateRouteWithHeaderAndTabs path="/collection/view/:id/published-history-collection"
            component={PublishedHistoryCollection} activeTab={0} permission="collections" subPermission="publishHistory"
            permissionKey="canView" state="view" />
          <PrivateRouteWithHeaderAndTabs path="/collection/edit/:id/published-history-collection"
            component={PublishedHistoryCollection} activeTab={0} permission="collections" subPermission="publishHistory"
            permissionKey="canUpdate" />
          <PrivateRouteWithHeaderAndTabs exact path="/collection/view/:collectionId/translation" component={Translation}
            activeTab={0} permission="collections" subPermission="translation" permissionKey="canView" />
          <PrivateRouteWithHeaderAndTabs exact path="/collection/edit/:collectionId/translation" component={Translation}
            activeTab={0} permission="collections" subPermission="translation" permissionKey="canView" />

          {/* QuickLinks Route */}
          <PrivateRouteWithHeaderAndTabs exact path="/movie/edit/:movieId/translation" component={Translation}
            permission="movies" subPermission="translation" permissionKey="canView" activeTab={0} />
          <PrivateRouteWithHeaderAndTabs exact path="/movie/view/:movieId/translation" component={Translation}
            permission="movies" subPermission="translation" permissionKey="canView" activeTab={0} />
          <PrivateRouteWithHeaderAndTabs path="/movie/view/:id/related-content" component={RelatedContent} activeTab={0}
            permission="movies" subPermission="relatedContent" permissionKey="canView" activeTab={0} />
          <PrivateRouteWithHeaderAndTabs path="/movie/edit/:id/related-content" component={RelatedContent} activeTab={0}
            permission="movies" subPermission="relatedContent" permissionKey="canUpdate" activeTab={0} />
          <PrivateRouteWithHeaderAndTabs path="/movie/edit/:id/collection-assignment" component={CollectionAssignment}
            activeTab={0} permission="movies" subPermission="collectionAssignment" permissionKey="canUpdate" activeTab={0} />
          <PrivateRouteWithHeaderAndTabs path="/movie/view/:id/collection-assignment" component={CollectionAssignment}
            activeTab={0} permission="movies" subPermission="collectionAssignment" permissionKey="canView" activeTab={0} />
          <PrivateRouteWithHeaderAndTabs path="/movie/edit/:id/published-history-movie" component={PublishedHistoryMovie}
            activeTab={0} permission="movies" subPermission="publishHistory" permissionKey="canUpdate" />
          <PrivateRouteWithHeaderAndTabs path="/movie/view/:id/published-history-movie" component={PublishedHistoryMovie}
            activeTab={0} permission="movies" subPermission="publishHistory" permissionKey="canView" state="view" />
          <PrivateRouteWithHeaderAndTabs path="/quick/movie/edit/:id/published-history-movie" component={PublishedHistoryMovie} activeTab={0}
            permission="movies" subPermission="publishHistory" permissionKey="canUpdate" state="quick-filing" />
          <PrivateRouteWithHeaderAndTabs path="/quick/movie/edit/:id/related-content" component={RelatedContent}
            activeTab={0} permission="movies" subPermission="relatedContent" permissionKey="canUpdate" activeTab={0} />
          <PrivateRouteWithHeaderAndTabs path="/quick/movie/edit/:id/collection-assignment"
            component={CollectionAssignment} activeTab={0} permission="movies" subPermission="collectionAssignment"
            permissionKey="canUpdate" activeTab={0} />
          <PrivateRouteWithHeaderAndTabs path="/single/movie/edit/:id/related-content" component={RelatedContent}
            activeTab={0} permission="movies" subPermission="relatedContent" permissionKey="canUpdate" activeTab={0} />
          <PrivateRouteWithHeaderAndTabs path="/single/movie/edit/:id/collection-assignment"
            component={CollectionAssignment} activeTab={0} permission="movies" subPermission="collectionAssignment"
            permissionKey="canUpdate" activeTab={0} />
          <PrivateRouteWithHeaderAndTabs path="/single/movie/edit/:id/published-history-movie"
            component={PublishedHistoryMovie} activeTab={0} permission="movies" subPermission="publishHistory"
            permissionKey="canUpdate" state="single-landing-page" />
          {/* Movie Route */}
          <PrivateRouteWithHeaderAndTabs exact path="/movie" component={MovieList} activeTab={0}
            permission="movies" permissionKey="canView" />
          <PrivateRouteWithHeaderAndTabs exact path="/movie/linked-movie/:id" component={LinkedMovies} activeTab={0}
            permission="movies" permissionKey="canView" />
          <PrivateRouteWithHeaderAndTabs exact path="/movie/create" component={CreateMovie} activeTab={0}
            permission="movies" subPermission="createMovie" permissionKey="canCreate" />
          <PrivateRouteWithHeaderAndTabs exact path="/movie/edit/:id" component={CreateMovie} activeTab={0}
            permission="movies" subPermission="createMovie" permissionKey="canUpdate" />
          <PrivateRouteWithHeaderAndTabs exact path="/movie/view/:id" component={ViewMovie} activeTab={0}
            permission="movies" subPermission="createMovie" permissionKey="canView" />

          {/* Translation Route */}
          <PrivateRouteWithHeaderAndTabs path="/translation/:page/:contentId" component={Translation}
            permission="movies" subPermission="translation" permissionKey="canView" activeTab={0} />
          {/* <PrivateRouteWithHeaderAndTabs path="/published-history" component={PublishedHistory} /> */}

          {/* Quick Filing Route to create movie */}
          <PrivateRouteWithHeaderAndTabs path="/quick/movie/create" component={CreateMovie} activeTab={0}
            permission="always" permissionKey="canCreate" state="quick-filing" />
          <PrivateRouteWithHeaderAndTabs path="/quick/movie/edit/:id" component={CreateMovie} activeTab={0}
            permission="always" permissionKey="canUpdate" state="quick-filing" />

          {/* Single Landing Page Route to create movie */}
          <PrivateRouteWithHeaderAndTabs path="/single/movie/create" component={CreateMovie} activeTab={0}
            permission="always" permissionKey="canCreate" state="single-landing-page" />
          <PrivateRouteWithHeaderAndTabs path="/single/movie/edit/:id" component={CreateMovie} activeTab={0}
            permission="always" permissionKey="canUpdate" state="single-landing-page" />

          {/* <Redirect from="*" to="/movie/create" /> */}

          {/* Video Route Start*/}
          <PrivateRouteWithHeaderAndTabs exact path="/video" component={VideoList} activeTab={0}
            permission="videos" permissionKey="canView" />
          <PrivateRouteWithHeaderAndTabs exact path="/video/linked-video/:id" component={LinkedVideos} activeTab={0}
            permission="videos" permissionKey="canView" />
          <PrivateRouteWithHeaderAndTabs exact path="/video/create" component={Video} activeTab={0}
            permission="videos" permissionKey="canCreate" />
          <PrivateRouteWithHeaderAndTabs exact path="/video/edit/:id" component={Video} activeTab={0}
            permission="videos" permissionKey="canUpdate" />
          <PrivateRouteWithHeaderAndTabs exact path="/video/view/:id" component={ViewVideos} activeTab={0}
            permission="videos" permissionKey="canView" />
          {/* Quick Filing Route to create video */}
          <PrivateRouteWithHeaderAndTabs exact path="/video/quick/create" component={Video} activeTab={0} permission="videos" permissionKey="canCreate" state="quick-filing" />
          <PrivateRouteWithHeaderAndTabs exact path="/video/quick/view/:id" component={ViewVideos} activeTab={0} permission="videos" permissionKey="canUpdate" state="quick-filing" />
          <PrivateRouteWithHeaderAndTabs exact path="/video/quick/edit/:id" component={Video} activeTab={0} permission="videos" permissionKey="canUpdate" state="quick-filing" />
          {/* QuickLinks Route for Video  section*/}
          <PrivateRouteWithHeaderAndTabs path="/video/edit/:id/collection-assignment" component={VideoCollectionAssignment} activeTab={0} permission="videos" subPermission="collectionAssignment" permissionKey="canUpdate" activeTab={0} />
          <PrivateRouteWithHeaderAndTabs path="/video/view/:id/collection-assignment" component={VideoCollectionAssignment} activeTab={0} permission="videos" subPermission="collectionAssignment" permissionKey="canView" activeTab={0} />
          <PrivateRouteWithHeaderAndTabs path="/video/quick/edit/:id/collection-assignment" component={VideoCollectionAssignment} activeTab={0} permission="videos" subPermission="collectionAssignment" permissionKey="canUpdate" activeTab={0} />
          <PrivateRouteWithHeaderAndTabs exact path="/video/edit/:videoId/translation" component={Translation}
            permission="videos" subPermission="translation" permissionKey="canView" activeTab={0} />
          <PrivateRouteWithHeaderAndTabs exact path="/video/view/:videoId/translation" component={Translation}
            permission="videos" subPermission="translation" permissionKey="canView" activeTab={0} />

          <PrivateRouteWithHeaderAndTabs exact path="/video/quick/edit/:videoId/translation"
            component={Translation} permission="videos" subPermission="translation" permissionKey="canView" activeTab={0} />
          <PrivateRouteWithHeaderAndTabs exact path="/video/quick/view/:videoId/translation"
            component={Translation} permission="videos" subPermission="translation" permissionKey="canView" activeTab={0} />

          <PrivateRouteWithHeaderAndTabs path="/video/edit/:id/related-content" component={VideoRelatedContent} activeTab={0} permission="videos" subPermission="relatedContent" exact permissionKey="canView" activeTab={0} />
          <PrivateRouteWithHeaderAndTabs path="/video/view/:id/related-content" component={VideoRelatedContent} activeTab={0} permission="videos" subPermission="relatedContent" exact permissionKey="canCreate" activeTab={0} />
          <PrivateRouteWithHeaderAndTabs path="/video/quick/edit/:id/related-content" component={VideoRelatedContent} activeTab={0} permission="videos" subPermission="relatedContent" exact permissionKey="canCreate" activeTab={0} />

          <PrivateRouteWithHeaderAndTabs path="/video/edit/:id/published-history-video" component={PublishedHistoryVideo}
            activeTab={0} permission="videos" subPermission="publishHistory" permissionKey="canUpdate" />
          <PrivateRouteWithHeaderAndTabs path="/video/view/:id/published-history-video" component={PublishedHistoryVideo}
            activeTab={0} permission="videos" subPermission="publishHistory" permissionKey="canView" state="view" />
          <PrivateRouteWithHeaderAndTabs path="/video/quick/edit/:id/published-history-video" component={PublishedHistoryVideo} activeTab={0}
            permission="videos" subPermission="publishHistory" permissionKey="canUpdate" state="quick-filing" />
          {/* Video Route End*/}

          {/* Transcoding Route*/}
          <PrivateRouteWithHeaderAndTabs exact path="/transcoding" component={Transcoding} activeTab={0} permission="always" permissionKey="canUpdate" />
          <PrivateRouteWithHeaderAndTabs path="/transcoding/view/:id" component={TranscodingHistory} activeTab={0}
            permission="always" permissionKey="canUpdate" />
          {/* Ingestion Route*/}
          <PrivateRouteWithHeaderAndTabs path="/ingestion" component={Ingestion} activeTab={0} permission="always" permissionKey="canUpdate" />
          <PrivateRouteWithHeaderAndTabs path="/ingestion-dashboard" component={NewIngestion} activeTab={0} permission="always" permissionKey="canUpdate" />
          <PrivateRouteWithHeaderAndTabs path="/map-content/:uuid" component={MapContent} activeTab={0} permission="always" permissionKey="canUpdate" />

          {/* tv shows */}
          <Route path="/tvshow" component={TvShowRoute} />

           {/* before Tv Route    */}

           <PrivateRouteWithHeaderAndTabs exact path="/before-tv" component={BeforeTv}
            permission="always" permissionKey="canView" />
           <PrivateRouteWithHeaderAndTabs exact path ='/bulkupdate' component={BulkOps}
            permission="always" permissionKey="canView"/>
          {/* Bulk Dashboard Route*/}
          <PrivateRouteWithHeaderAndTabs exact path="/bulkupdate/dashboard" component={BulkDashboard} activeTab={0} permission="always" permissionKey="canUpdate" />
          <PrivateRouteWithHeaderAndTabs exact path="/bulkupdate/dashboard/:viewId" component={ViewJob} activeTab={0} permission="always" permissionKey="canUpdate" />
          <PrivateRouteWithHeaderAndTabs exact path="/bulkupdate/bulkupload/:viewId" component={BulkUpload} activeTab={0} permission="always" permissionKey="canUpdate" />

          <PrivateRouteWithHeaderAndTabs path="/permission" component={NoPermission} permission="always" permissionKey="canUpdate" />
          <Route path="*" component={Page404} />
        </Switch>
      </Router>
    );
  }
}


const TvShowRoute = ({ match }) => {
  return (
    <Switch>
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}`} component={TvShowList} activeTab={0} permission="tvShows"
        subPermission="createShow" permissionKey="canView" />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/create`} component={TvShow} activeTab={0} permission="tvShows"
        subPermission="createShow" permissionKey="canCreate" />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/linked-shows/:id`} component={LinkedShows} activeTab={0} permission="tvShows"
        subPermission="createShow" permissionKey="canView" />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/edit/:id`} component={TvShow} activeTab={0}
        permission="tvShows" subPermission="createShow" permissionKey="canUpdate" />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/view/:id`} component={ViewTvShow} activeTab={0}
        permission="tvShows" subPermission="createShow" permissionKey="canView" />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/quick/create`} component={TvShow} activeTab={0}
        permission="tvShows" subPermission="quickFiling" permissionKey="canCreate" state="quick-filing" />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/quick/edit/:id`} component={TvShow} activeTab={0}
        permission="tvShows" subPermission="quickFiling" permissionKey="canCreate" state="quick-filing" />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/quick/view/:id`} component={ViewTvShow} activeTab={0}
        permission="tvShows" subPermission="quickFiling" permissionKey="canView" state="quick-filing" />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/single/create`} component={TvShow} activeTab={0}
        permission="tvShows" permissionKey="canCreate" state="single-landing" />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/single/edit/:id`} component={TvShow} activeTab={0}
        permission="tvShows" permissionKey="canCreate" state="single-landing" />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/single/view/:id`} component={ViewTvShow} activeTab={0}
        permission="tvShows" permissionKey="canView" state="single-landing" />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/edit/:tvshowId/translation`} component={Translation}
        permission="tvShows" subPermission="translation" permissionKey="canUpdate" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/view/:tvshowId/translation`} component={Translation}
        permission="tvShows" subPermission="translation" permissionKey="canView" activeTab={0} />

      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/view/:id/collection-assignment`} component={TvShowCollectionAssignment}
        permission="tvShows" subPermission="collectionAssignment" permissionKey="canView" />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/edit/:id/collection-assignment`} component={TvShowCollectionAssignment}
        permission="tvShows" subPermission="collectionAssignment" permissionKey="canUpdate" />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:quickSingle/edit/:id/collection-assignment`} component={TvShowCollectionAssignment}
        permission="tvShows" subPermission="collectionAssignment" permissionKey="canUpdate" />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/view/:id/related-content`} component={TvShowRelatedContent}
        permission="tvShows" subPermission="relatedContent" permissionKey="canView" />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/edit/:id/related-content`} component={TvShowRelatedContent}
        permission="tvShows" subPermission="relatedContent" permissionKey="canUpdate" />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:quickSingle/edit/:id/related-content`} component={TvShowRelatedContent}
        permission="tvShows" subPermission="relatedContent" permissionKey="canUpdate" />

      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/view/:id`} component={TvShow} activeTab={0}
        permission="tvShows" permissionKey="canUpdate" />

      <PrivateRouteWithHeaderAndTabs path={`${match.url}/view/:id/published-history`} component={PublishedHistoryTvShow}
        permission="tvShows" subPermission="publishHistory" permissionKey="canView" activeTab={0} state="view" />
      <PrivateRouteWithHeaderAndTabs path={`${match.url}/quick/view/:id/published-history`} component={PublishedHistoryTvShow}
        permission="tvShows" subPermission="publishHistory" permissionKey="canView" activeTab={0} state="quick-filing" />
      <PrivateRouteWithHeaderAndTabs path={`${match.url}/single/view/:id/published-history`} component={PublishedHistoryTvShow}
        permission="tvShows" subPermission="publishHistory" permissionKey="canView" activeTab={0} state="single-landing-page" />
      <PrivateRouteWithHeaderAndTabs path={`${match.url}/edit/:id/published-history`} component={PublishedHistoryTvShow}
        permission="tvShows" subPermission="publishHistory" permissionKey="canUpdate" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs path={`${match.url}/quick/edit/:id/published-history`} component={PublishedHistoryTvShow}
        permission="tvShows" subPermission="publishHistory" permissionKey="canUpdate" activeTab={0} state="quick-filing" />
      <PrivateRouteWithHeaderAndTabs path={`${match.url}/single/edit/:id/published-history`} component={PublishedHistoryTvShow}
        permission="tvShows" subPermission="publishHistory" permissionKey="canUpdate" activeTab={0} state="single-landing-page" />

      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/view/:id/season`} component={Season} permission="season"
        permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/view/:id/season/create`} component={CreateSeason}
        permission="season" permissionKey="canView" activeTab={0} journeyType="1" />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/view/:id/season/:seasonId`} component={CreateSeason}
        permission="season" permissionKey="canView" activeTab={0} journeyType="1" />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/view/:id/season/view/:seasonId`} component={ViewSeason}
        permission="season" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/view/:id/season/quick/create`} component={CreateSeason}
        permission="season" permissionKey="canView" activeTab={0} journeyType="2" />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/view/:id/season/quick/edit/:seasonId`} component={CreateSeason}
        permission="season" permissionKey="canView" activeTab={0} journeyType="2" />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/view/:id/season/single/create`} component={CreateSeason}
        permission="season" permissionKey="canView" activeTab={0} journeyType="3" />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/view/:id/season/single/edit/:seasonId`} component={CreateSeason}
        permission="season" permissionKey="canView" activeTab={0} journeyType="3" />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/view/:id/season/:singleQuick/edit/:seasonId/related-content`}
        component={SeasonRelatedContent} permission="season" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/view/:id/season/view/:seasonId/related-content`}
        component={SeasonRelatedContent} permission="season" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/view/:id/season/:seasonId/related-content`}
        component={SeasonRelatedContent} permission="season" permissionKey="canView" activeTab={0} />

            {/* published-history-season-route */}
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/view/:id/season/:singleQuick/edit/:seasonId/published-history`}
        component={PublishedHistorySeason} permission="season" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/view/:id/season/view/:seasonId/published-history`}
        component={PublishedHistorySeason} permission="season" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/view/:id/season/:seasonId/published-history`}
        component={PublishedHistorySeason} permission="season" permissionKey="canView" activeTab={0} />


      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/view/:id/season/:seasonId/collection-assignment`}
        component={SeasonCollectionAssignment} permission="season" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/view/:id/season/view/:seasonId/collection-assignment`}
        component={SeasonCollectionAssignment} permission="season" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/view/:id/season/:singleQuick/edit/:seasonId/collection-assignment`}
        component={SeasonCollectionAssignment} permission="season" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/view/:id/season/:seasonId/template`}
        component={SeasonTemplate} permission="season" permissionKey="canView" activeTab={0} />
 <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/view/:id/season/view/:seasonId/template`}
        component={SeasonTemplate} permission="season" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/view/:id/season/:singleQuick/edit/:seasonId/template`} component={SeasonTemplate} permission="season" permissionKey="canView" activeTab={0} />

      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/edit/:id/season`} component={Season} permission="season"
        permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/edit/:id/season/create`} component={CreateSeason}
        permission="season" permissionKey="canView" activeTab={0} journeyType="1" />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/edit/:id/season/:seasonId`} component={CreateSeason}
        permission="season" permissionKey="canView" activeTab={0} journeyType="1" />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/edit/:id/season/view/:seasonId`} component={ViewSeason}
        permission="season" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/edit/:id/season/quick/create`} component={CreateSeason}
        permission="season" permissionKey="canView" activeTab={0} journeyType="2" />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/edit/:id/season/quick/edit/:seasonId`} component={CreateSeason}
        permission="season" permissionKey="canView" activeTab={0} journeyType="2" />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/edit/:id/season/single/create`} component={CreateSeason}
        permission="season" permissionKey="canView" activeTab={0} journeyType="3" />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/edit/:id/season/single/edit/:seasonId`} component={CreateSeason}
        permission="season" permissionKey="canView" activeTab={0} journeyType="3" />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/edit/:id/season/:seasonId/related-content`}
        component={SeasonRelatedContent} permission="season" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/edit/:id/season/view/:seasonId/related-content`}
        component={SeasonRelatedContent} permission="season" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/edit/:id/season/:singleQuick/edit/:seasonId/related-content`}
        component={SeasonRelatedContent} permission="season" permissionKey="canView" activeTab={0} />

    <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/edit/:id/season/:seasonId/published-history`}
        component={PublishedHistorySeason} permission="season" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/edit/:id/season/view/:seasonId/published-history`}
        component={PublishedHistorySeason} permission="season" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/edit/:id/season/:singleQuick/edit/:seasonId/published-history`}
        component={PublishedHistorySeason} permission="season" permissionKey="canView" activeTab={0} />

      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/edit/:id/season/:seasonId/collection-assignment`}
        component={SeasonCollectionAssignment} permission="season" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/edit/:id/season/view/:seasonId/collection-assignment`}
        component={SeasonCollectionAssignment} permission="season" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/edit/:id/season/:singleQuick/edit/:seasonId/collection-assignment`}
        component={SeasonCollectionAssignment} permission="season" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/edit/:id/season/view/:seasonId/template`} component={SeasonTemplate} permission="season" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/edit/:id/season/:seasonId/template`} component={SeasonTemplate} permission="season" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/edit/:id/season/:singleQuick/edit/:seasonId/template`} component={SeasonTemplate} permission="season" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/single/edit/:id/season/single/edit/:seasonId/template`} component={SeasonTemplate} permission="season" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/single/edit/:id/season/:seasonId/template`} component={SeasonTemplate} permission="season" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/single/edit/:id/season/view/:seasonId/template`} component={SeasonTemplate} permission="season" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/quick/edit/:id/season/quick/:seasonId/template`} component={SeasonTemplate} permission="season" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/quick/edit/:id/season/quick/:seasonId/template`} component={SeasonTemplate} permission="season" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/quick/edit/:id/season/view/:seasonId/template`} component={SeasonTemplate} permission="season" permissionKey="canView" activeTab={0} />


      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/edit/:tvshowId/season/:seasonId/translation`} component={Translation} permission="season" subPermission="translation" permissionKey="canUpdate" activeTab={0}/>
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/edit/:tvshowId/season/view/:seasonId/translation`} component={Translation} permission="season" subPermission="translation" permissionKey="canView" activeTab={0}/>
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/single/edit/:tvshowId/season/:seasonId/translation`} component={Translation} permission="season" subPermission="translation" permissionKey="canUpdate" activeTab={0}/>
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/single/edit/:tvshowId/season/view/:seasonId/translation`} component={Translation} permission="season" subPermission="translation" permissionKey="canView" activeTab={0}/>
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/quick/edit/:tvshowId/season/:seasonId/translation`} component={Translation} permission="season" subPermission="translation" permissionKey="canUpdate" activeTab={0}/>
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/quick/edit/:tvshowId/season/view/:seasonId/translation`} component={Translation} permission="season" subPermission="translation" permissionKey="canView" activeTab={0}/>
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/view/:tvshowId/season/:seasonId/translation`} component={Translation} permission="season" subPermission="translation" permissionKey="canUpdate" activeTab={0}/>
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/view/:tvshowId/season/view/:seasonId/translation`} component={Translation} permission="season" subPermission="translation" permissionKey="canView" activeTab={0}/>


      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/quick/edit/:id/season`} component={Season}
        permission="season" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/quick/edit/:id/season/create`} component={CreateSeason}
        permission="season" permissionKey="canView" activeTab={0} journeyType="1" />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/quick/edit/:id/season/:seasonId`} component={CreateSeason}
        permission="season" permissionKey="canView" activeTab={0} journeyType="1" />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/quick/edit/:id/season/view/:seasonId`} component={ViewSeason}
        permission="season" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/quick/edit/:id/season/quick/create`} component={CreateSeason}
        permission="season" permissionKey="canView" activeTab={0} journeyType="2" />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/quick/edit/:id/season/quick/edit/:seasonId`} component={CreateSeason}
        permission="season" permissionKey="canView" activeTab={0} journeyType="2" />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/quick/edit/:id/season/single/create`} component={CreateSeason}
        permission="season" permissionKey="canView" activeTab={0} journeyType="3" />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/quick/edit/:id/season/single/edit/:seasonId`} component={CreateSeason}
        permission="season" permissionKey="canView" activeTab={0} journeyType="3" />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/quick/edit/:id/season/:seasonId/related-content`}
        component={SeasonRelatedContent} permission="season" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/quick/edit/:id/season/view/:seasonId/related-content`}
        component={SeasonRelatedContent} permission="season" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/quick/edit/:id/season/:singleQuick/edit/:seasonId/related-content`}
        component={SeasonRelatedContent} permission="season" permissionKey="canView" activeTab={0} />

      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/quick/edit/:id/season/:seasonId/published-history`}
        component={PublishedHistorySeason} permission="season" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/quick/edit/:id/season/view/:seasonId/published-history`}
        component={PublishedHistorySeason} permission="season" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/quick/edit/:id/season/:singleQuick/edit/:seasonId/published-history`}
        component={PublishedHistorySeason} permission="season" permissionKey="canView" activeTab={0} />

      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/quick/edit/:id/season/:seasonId/collection-assignment`}
        component={SeasonCollectionAssignment} permission="season" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/quick/edit/:id/season/view/:seasonId/collection-assignment`}
        component={SeasonCollectionAssignment} permission="season" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/quick/edit/:id/season/:singleQuick/edit/:seasonId/collection-assignment`}
        component={SeasonCollectionAssignment} permission="season" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/quick/edit/:id/season/:seasonId/template`} component={SeasonTemplate} permission="season" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/quick/edit/:id/season/:singleQuick/edit/:seasonId/template`} component={SeasonTemplate} permission="season" permissionKey="canView" activeTab={0} />


      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/single/edit/:id/season`} component={Season}
        permission="season" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/single/edit/:id/season/create`} component={CreateSeason}
        permission="season" permissionKey="canView" activeTab={0} journeyType="1" />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/single/edit/:id/season/:seasonId`} component={CreateSeason}
        permission="season" permissionKey="canView" activeTab={0} journeyType="1" />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/single/edit/:id/season/view/:seasonId`} component={ViewSeason}
        permission="season" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/single/edit/:id/season/quick/create`} component={CreateSeason}
        permission="season" permissionKey="canView" activeTab={0} journeyType="2" />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/single/edit/:id/season/quick/edit/:seasonId`} component={CreateSeason}
        permission="season" permissionKey="canView" activeTab={0} journeyType="2" />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/single/edit/:id/season/single/create`} component={CreateSeason}
        permission="season" permissionKey="canView" activeTab={0} journeyType="3" />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/single/edit/:id/season/single/edit/:seasonId`} component={CreateSeason}
        permission="season" permissionKey="canView" activeTab={0} journeyType="3" />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/single/edit/:id/season/:seasonId/related-content`}
        component={SeasonRelatedContent} permission="season" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/single/edit/:id/season/view/:seasonId/related-content`}
        component={SeasonRelatedContent} permission="season" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/single/edit/:id/season/:singleQuick/edit/:seasonId/related-content`}
        component={SeasonRelatedContent} permission="season" permissionKey="canView" activeTab={0} />

      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/single/edit/:id/season/:seasonId/published-history`}
        component={PublishedHistorySeason} permission="season" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/single/edit/:id/season/view/:seasonId/published-history`}
        component={PublishedHistorySeason} permission="season" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/single/edit/:id/season/:singleQuick/edit/:seasonId/published-history`}
        component={PublishedHistorySeason} permission="season" permissionKey="canView" activeTab={0} />

      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/single/edit/:id/season/:seasonId/collection-assignment`}
        component={SeasonCollectionAssignment} permission="season" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/single/edit/:id/season/view/:seasonId/collection-assignment`}
        component={SeasonCollectionAssignment} permission="season" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/single/edit/:id/season/:singleQuick/edit/:seasonId/collection-assignment`}
        component={SeasonCollectionAssignment} permission="season" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}single/edit/:id/season/singleQuick/edit/:seasonId/template`} component={SeasonTemplate} permission="tvShows" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}single/edit/:id/season/:seasonId/template`} component={SeasonTemplate} permission="tvShows" permissionKey="canView" activeTab={0} />



      {/* Episode Route */}
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:viewEdit/:tvshowId/season/:seasonId/episode/:episodeId/translation`} component={Translation} permission="episode" subPermission="translation" permissionKey="canUpdate" activeTab={0}/>
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:viewEdit/:tvshowId/season/:seasonId/episode/view/:episodeId/translation`} component={Translation} permission="episode" subPermission="translation" permissionKey="canView" activeTab={0}/>
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:viewEdit/:tvshowId/season/:quickSingle/edit/:seasonId/episode/:episodeId/translation`} component={Translation} permission="episode" subPermission="translation" permissionKey="canUpdate" activeTab={0}/>
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:viewEdit/:tvshowId/season/:quickSingle/edit/:seasonId/episode/view/:episodeId/translation`} component={Translation} permission="episode" subPermission="translation" permissionKey="canView" activeTab={0}/>
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:viewEdit/:tvshowId/season/view/:seasonId/episode/:episodeId/translation`} component={Translation} permission="episode" subPermission="translation" permissionKey="canUpdate" activeTab={0}/>
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:viewEdit/:tvshowId/season/view/:seasonId/episode/view/:episodeId/translation`} component={Translation} permission="episode" subPermission="translation" permissionKey="canView" activeTab={0}/>

      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:quickSingle/edit/:tvshowId/season/:seasonId/episode/:episodeId/translation`} component={Translation} permission="episode" subPermission="translation" permissionKey="canUpdate" activeTab={0}/>
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:quickSingle/edit/:tvshowId/season/:seasonId/episode/view/:episodeId/translation`} component={Translation} permission="episode" subPermission="translation" permissionKey="canView" activeTab={0}/>
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:quickSingle/edit/:tvshowId/season/:quickSingle/edit/:seasonId/episode/:episodeId/translation`} component={Translation} permission="episode" subPermission="translation" permissionKey="canUpdate" activeTab={0}/>
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:quickSingle/edit/:tvshowId/season/:quickSingle/edit/:seasonId/episode/view/:episodeId/translation`} component={Translation} permission="episode" subPermission="translation" permissionKey="canView" activeTab={0}/>
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:quickSingle/edit/:tvshowId/season/view/:seasonId/episode/:episodeId/translation`} component={Translation} permission="episode" subPermission="translation" permissionKey="canUpdate" activeTab={0}/>
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:quickSingle/edit/:tvshowId/season/view/:seasonId/episode/view/:episodeId/translation`} component={Translation} permission="episode" subPermission="translation" permissionKey="canView" activeTab={0}/>

      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:viewEdit/:id/season/:seasonId/episode/placeholder`}
        component={Placeholder} permission="episode" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:viewEdit/:id/season/view/:seasonId/episode/placeholder`}
        component={Placeholder} permission="episode" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:viewEdit/:id/season/single/edit/:seasonId/episode/placeholder`}
        component={Placeholder} permission="episode" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:viewEdit/:id/season/quick/edit/:seasonId/episode/placeholder`}
        component={Placeholder} permission="episode" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:quickSingle/:viewEdit/:id/season/:seasonId/episode/placeholder`}
        component={Placeholder} permission="episode" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:quickSingle/:viewEdit/:id/season/view/:seasonId/episode/placeholder`}
        component={Placeholder} permission="episode" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:quickSingle/:viewEdit/:id/season/single/edit/:seasonId/episode/placeholder`}
        component={Placeholder} permission="episode" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:quickSingle/:viewEdit/:id/season/quick/edit/:seasonId/episode/placeholder`}
        component={Placeholder} permission="episode" permissionKey="canView" activeTab={0} />

      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:viewEdit/:id/season/:seasonId/episode`}
        component={EpisodeList} permission="episode" permissionKey="canView" activeTab={0} />
      {/* episode type 1 */}
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:viewEdit/:id/season/:seasonId/episode/:episodeId`} // for create and id both
        component={CreateEpisode} permission="episode" permissionKey="canUpdate" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:viewEdit/:id/season/:seasonId/episode/:episodeId/collection-assignment`} // for create and id both
        component={EpisodeCollectionAssignment} permission="episode" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:viewEdit/:id/season/:seasonId/episode/:episodeId/related-content`} // for create and id both
        component={EpisodeRelatedContent} permission="episode" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:viewEdit/:id/season/:seasonId/episode/:episodeId/published-history`} // for create and id both
        component={PublishedHistoryEpisode} permission="episode" permissionKey="canView" activeTab={0} />

      {/* episode type 2 */}
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:viewEdit/:id/season/:seasonId/episode/view/:episodeId`} // for view
        component={ViewEpisode} permission="episode" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:viewEdit/:id/season/:seasonId/episode/view/:episodeId/collection-assignment`} // for view
        component={EpisodeCollectionAssignment} permission="episode" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:viewEdit/:id/season/:seasonId/episode/view/:episodeId/related-contentt`} // for view
        component={EpisodeRelatedContent} permission="episode" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:viewEdit/:id/season/:seasonId/episode/:episodeId/published-history`} // for view
        component={PublishedHistoryEpisode} permission="episode" permissionKey="canView" activeTab={0} />

      {/* episode type 3 */}
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:viewEdit/:id/season/:seasonId/episode/:quickSingle/:episodeId`} // for quick and single
        component={CreateEpisode} permission="episode" permissionKey="canUpdate" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:viewEdit/:id/season/:seasonId/episode/:quickSingle/:episodeId/collection-assignment`} // for quick and single
        component={EpisodeCollectionAssignment} permission="episode" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:viewEdit/:id/season/:seasonId/episode/:quickSingle/:episodeId/related-content`} // for quick and single
        component={EpisodeRelatedContent} permission="episode" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:viewEdit/:id/season/:seasonId/episode/:quickSingle/:episodeId/published-history`} // for quick and single
        component={PublishedHistoryEpisode} permission="episode" permissionKey="canView" activeTab={0} />


      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:viewEdit/:id/season/view/:seasonId/episode`}
        component={EpisodeList} permission="episode" permissionKey="canView" activeTab={0} />
      {/* episode type 4 */}
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:viewEdit/:id/season/view/:seasonId/episode/:episodeId`} // for create and id both
        component={CreateEpisode} permission="episode" permissionKey="canUpdate" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:viewEdit/:id/season/view/:seasonId/episode/:episodeId/collection-assignment`} // for create and id both
        component={EpisodeCollectionAssignment} permission="episode" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:viewEdit/:id/season/view/:seasonId/episode/:episodeId/related-content`} // for create and id both
        component={EpisodeRelatedContent} permission="episode" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:viewEdit/:id/season/view/:seasonId/episode/:episodeId/published-history`} // for create and id both
        component={PublishedHistoryEpisode} permission="episode" permissionKey="canView" activeTab={0} />

      {/* episode type 5 */}
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:viewEdit/:id/season/view/:seasonId/episode/view/:episodeId`} // for view
        component={ViewEpisode} permission="episode" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:viewEdit/:id/season/view/:seasonId/episode/view/:episodeId/collection-assignment`} // for view
        component={EpisodeCollectionAssignment} permission="episode" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:viewEdit/:id/season/view/:seasonId/episode/view/:episodeId/related-content`} // for view
        component={EpisodeRelatedContent} permission="episode" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:viewEdit/:id/season/view/:seasonId/episode/view/:episodeId/published-history`} // for view
        component={PublishedHistoryEpisode} permission="episode" permissionKey="canView" activeTab={0} />

      {/* episode type 6 */}
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:viewEdit/:id/season/view/:seasonId/episode/:quickSingle/:episodeId`} // for quick and single
        component={CreateEpisode} permission="episode" permissionKey="canUpdate" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:viewEdit/:id/season/view/:seasonId/episode/:quickSingle/:episodeId/collection-assignment`} // for quick and single
        component={EpisodeCollectionAssignment} permission="episode" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:viewEdit/:id/season/view/:seasonId/episode/:quickSingle/:episodeId/related-content`} // for quick and single
        component={EpisodeRelatedContent} permission="episode" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:viewEdit/:id/season/view/:seasonId/episode/:quickSingle/:episodeId/published-history`} // for quick and single
        component={PublishedHistoryEpisode} permission="episode" permissionKey="canView" activeTab={0} />


      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:viewEdit/:id/season/:quickSingle/edit/:seasonId/episode`}
        component={EpisodeList} permission="episode" permissionKey="canView" activeTab={0} />
      {/* episode type 7 */}
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:viewEdit/:id/season/:quickSingle/edit/:seasonId/episode/:episodeId`} // for create and id both
        component={CreateEpisode} permission="episode" permissionKey="canUpdate" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:viewEdit/:id/season/:quickSingle/edit/:seasonId/episode/:episodeId/collection-assignment`} // for create and id both
        component={EpisodeCollectionAssignment} permission="episode" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:viewEdit/:id/season/:quickSingle/edit/:seasonId/episode/:episodeId/related-content`} // for create and id both
        component={EpisodeRelatedContent} permission="episode" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:viewEdit/:id/season/:quickSingle/edit/:seasonId/episode/:episodeId/published-history`} // for create and id both
        component={PublishedHistoryEpisode} permission="episode" permissionKey="canView" activeTab={0} />
      {/* episode type 8 */}
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:viewEdit/:id/season/:quickSingle/edit/:seasonId/episode/view/:episodeId`} // for view
        component={ViewEpisode} permission="episode" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:viewEdit/:id/season/:quickSingle/edit/:seasonId/episode/view/:episodeId/collection-assignment`} // for view
        component={EpisodeCollectionAssignment} permission="episode" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:viewEdit/:id/season/:quickSingle/edit/:seasonId/episode/view/:episodeId/related-content`} // for view
        component={EpisodeRelatedContent} permission="episode" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:viewEdit/:id/season/:quickSingle/edit/:seasonId/episode/view/:episodeId/published-history`} // for create and id both
        component={PublishedHistoryEpisode} permission="episode" permissionKey="canView" activeTab={0} />
      {/* episode type 9 */}
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:viewEdit/:id/season/:quickSingle/edit/:seasonId/episode/:quickSingle/:episodeId`} // for quick and single
        component={CreateEpisode} permission="episode" permissionKey="canUpdate" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:viewEdit/:id/season/:quickSingle/edit/:seasonId/episode/:quickSingle/:episodeId/collection-assignment`} // for quick and single
        component={EpisodeCollectionAssignment} permission="episode" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:viewEdit/:id/season/:quickSingle/edit/:seasonId/episode/:quickSingle/:episodeId/related-content`} // for quick and single
        component={EpisodeRelatedContent} permission="episode" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:viewEdit/:id/season/:quickSingle/edit/:seasonId/episode/:quickSingle/:episodeId/published-history`} // for quick and single
        component={PublishedHistoryEpisode} permission="episode" permissionKey="canView" activeTab={0} />



      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:quickSingle/edit/:id/season/:seasonId/episode`}
        component={EpisodeList} permission="episode" permissionKey="canView" activeTab={0} />
      {/* episode type 10 */}
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:quickSingle/edit/:id/season/:seasonId/episode/:episodeId`} // for create and id both
        component={CreateEpisode} permission="episode" permissionKey="canUpdate" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:quickSingle/edit/:id/season/:seasonId/episode/:episodeId/collection-assignment`} // for create and id both
        component={EpisodeCollectionAssignment} permission="episode" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:quickSingle/edit/:id/season/:seasonId/episode/:episodeId/related-content`} // for create and id both
        component={EpisodeRelatedContent} permission="episode" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:quickSingle/edit/:id/season/:seasonId/episode/:episodeId/published-history`} // for create and id both
        component={PublishedHistoryEpisode} permission="episode" permissionKey="canView" activeTab={0} />
      {/* episode type 11 */}
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:quickSingle/edit/:id/season/:seasonId/episode/view/:episodeId`} // for view
        component={ViewEpisode} permission="episode" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:quickSingle/edit/:id/season/:seasonId/episode/view/:episodeId/collection-assignment`} // for view
        component={EpisodeCollectionAssignment} permission="episode" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:quickSingle/edit/:id/season/:seasonId/episode/view/:episodeId/related-content`} // for view
        component={EpisodeRelatedContent} permission="episode" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:quickSingle/edit/:id/season/:seasonId/episode/view/:episodeId/published-history`} // for view
        component={PublishedHistoryEpisode} permission="episode" permissionKey="canView" activeTab={0} />
      {/* episode type 12 */}
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:quickSingle/edit/:id/season/:seasonId/episode/:quickSingle/:episodeId`} // for quick and single
        component={CreateEpisode} permission="episode" permissionKey="canUpdate" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:quickSingle/edit/:id/season/:seasonId/episode/:quickSingle/:episodeId/collection-assignment`} // for quick and single
        component={EpisodeCollectionAssignment} permission="episode" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:quickSingle/edit/:id/season/:seasonId/episode/:quickSingle/:episodeId/related-content`} // for quick and single
        component={EpisodeRelatedContent} permission="episode" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:quickSingle/edit/:id/season/:seasonId/episode/:quickSingle/:episodeId/published-history`} // for quick and single
        component={PublishedHistoryEpisode} permission="episode" permissionKey="canView" activeTab={0} />


      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:quickSingle/edit/:id/season/view/:seasonId/episode`}
        component={EpisodeList} permission="episode" permissionKey="canView" activeTab={0} />
      {/* episode type 13 */}
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:quickSingle/edit/:id/season/view/:seasonId/episode/:episodeId`} // for create and id both
        component={CreateEpisode} permission="episode" permissionKey="canUpdate" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:quickSingle/edit/:id/season/view/:seasonId/episode/:episodeId/collection-assignment`} // for create and id both
        component={EpisodeCollectionAssignment} permission="episode" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:quickSingle/edit/:id/season/view/:seasonId/episode/:episodeId/related-content`} // for create and id both
        component={EpisodeRelatedContent} permission="episode" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:quickSingle/edit/:id/season/view/:seasonId/episode/:episodeId/published-history`} // for create and id both
        component={PublishedHistoryEpisode} permission="episode" permissionKey="canView" activeTab={0} />
      {/* episode type 14 */}
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:quickSingle/edit/:id/season/view/:seasonId/episode/view/:episodeId`} // for view
        component={ViewEpisode} permission="episode" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:quickSingle/edit/:id/season/view/:seasonId/episode/view/:episodeId/collection-assignment`} // for view
        component={EpisodeCollectionAssignment} permission="episode" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:quickSingle/edit/:id/season/view/:seasonId/episode/view/:episodeId/related-content`} // for view
        component={EpisodeRelatedContent} permission="episode" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:quickSingle/edit/:id/season/view/:seasonId/episode/view/:episodeId/published-history`} // for create and id both
        component={PublishedHistoryEpisode} permission="episode" permissionKey="canView" activeTab={0} />
      {/* episode type 15 */}
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:quickSingle/edit/:id/season/view/:seasonId/episode/:quickSingle/:episodeId`} // for quick and single
        component={CreateEpisode} permission="episode" permissionKey="canUpdate" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:quickSingle/edit/:id/season/view/:seasonId/episode/:quickSingle/:episodeId/collection-assignment`} // for quick and single
        component={EpisodeCollectionAssignment} permission="episode" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:quickSingle/edit/:id/season/view/:seasonId/episode/:quickSingle/:episodeId/related-content`} // for quick and single
        component={EpisodeRelatedContent} permission="episode" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:quickSingle/edit/:id/season/view/:seasonId/episode/:quickSingle/:episodeId/published-history`} // for create and id both
        component={PublishedHistoryEpisode} permission="episode" permissionKey="canView" activeTab={0} />


      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:quickSingle/edit/:id/season/:quickSingle/edit/:seasonId/episode`}
        component={EpisodeList} permission="episode" permissionKey="canView" activeTab={0} />
      {/* episode type 16 */}
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:quickSingle/edit/:id/season/:quickSingle/edit/:seasonId/episode/:episodeId`} // for create and id both
        component={CreateEpisode} permission="episode" permissionKey="canUpdate" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:quickSingle/edit/:id/season/:quickSingle/edit/:seasonId/episode/:episodeId/collection-assignment`} // for create and id both
        component={EpisodeCollectionAssignment} permission="episode" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:quickSingle/edit/:id/season/:quickSingle/edit/:seasonId/episode/:episodeId/related-content`} // for create and id both
        component={EpisodeRelatedContent} permission="episode" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:quickSingle/edit/:id/season/:quickSingle/edit/:seasonId/episode/:episodeId/published-history`} // for create and id both
        component={PublishedHistoryEpisode} permission="episode" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:viewEdit/:id/season/:seasonId/published-history`} // for create and id both
        component={PublishedHistoryEpisode} permission="episode" permissionKey="canView" activeTab={0} />
      {/* episode type 17 */}
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:quickSingle/edit/:id/season/:quickSingle/edit/:seasonId/episode/view/:episodeId`} // for view
        component={ViewEpisode} permission="episode" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:quickSingle/edit/:id/season/:quickSingle/edit/:seasonId/episode/view/:episodeId/collection-assignment`} // for view
        component={EpisodeCollectionAssignment} permission="episode" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:quickSingle/edit/:id/season/:quickSingle/edit/:seasonId/episode/view/:episodeId/related-content`} // for view
        component={EpisodeRelatedContent} permission="episode" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:quickSingle/edit/:id/season/:quickSingle/edit/:seasonId/episode/view/:episodeId/published-history`} // for create and id both
        component={PublishedHistoryEpisode} permission="episode" permissionKey="canView" activeTab={0} />
      {/* episode type 18 */}
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:quickSingle/edit/:id/season/:quickSingle/edit/:seasonId/episode/:quickSingle/:episodeId`} // for quick and single
        component={CreateEpisode} permission="episode" permissionKey="canUpdate" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:quickSingle/edit/:id/season/:quickSingle/edit/:seasonId/episode/:quickSingle/:episodeId/collection-assignment`} // for quick and single
        component={EpisodeCollectionAssignment} permission="episode" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:quickSingle/edit/:id/season/:quickSingle/edit/:seasonId/episode/:quickSingle/:episodeId/related-content`} // for quick and single
        component={EpisodeRelatedContent} permission="episode" permissionKey="canView" activeTab={0} />
      <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:quickSingle/edit/:id/season/:quickSingle/:seasonId/episode/:quickSingle/:episodeId/published-history`} // for create and id both
          component={PublishedHistoryEpisode} permission="episode" permissionKey="canView" activeTab={0} />



      {/* <PrivateRouteWithHeaderAndTabs exact path={`${match.url}/:viewEdit/:id/season/:seasonId/episode/create/placeholder`} component={Placeholder} permission="episode" subPermission="translation" permissionKey="canView" activeTab={0}/> */}

      <Route path="*" component={Page404} />
    </Switch>
  )
}

export default connect(null, {})(App);
