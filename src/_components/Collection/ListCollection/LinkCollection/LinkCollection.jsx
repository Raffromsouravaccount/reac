import React, { Component } from "react";
import { connect } from "react-redux";

import moment from "moment";


import { history } from "../../../../_helpers/history";
import { permissionObj } from "../../../../_helpers/permission";
import {collectionActions} from './../../../../_actions/collection.actions';


import BreadcrumbsComp from "../../../../_components/Common/BreadCrumbs/BreadCrumbs";

import AngleLeftArrow from "images/angle-left-arrow.svg";
import TimetableIcon from "images/timetable-icon.svg";
import MovieGrayIcon from "images/movie-gray-icon.svg";
import WorldIcon from "images/world-icon.svg";
import ViewIcon from "images/view-icon.svg";
import CopyIcon from "images/copy-icon.svg";
import MovieIcon from "images/movie-icon.svg";
import LinkIcon from "images/link-icon.svg";

import {collectionConstants} from '../Constants/collection.constants';
import { constantText } from "../../../../_helpers/constants.text";



class LinkedCollection extends Component {
  state = {
    collectionList: [],
    links: [
      {
        color: "inherit",
        text: collectionConstants.dashBoard_text,
        route: "/dashboard",
      },
      {
        color: "inherit",
        text: collectionConstants.collection_list_text,
        route: "/collections",
      },
    ],
    typography: [
      {
        color: "textPrimary",
        text: collectionConstants.collection_linked_text,
        label: "primary",
      },
    ],
  }

  componentDidMount() {
    if (!this.props?.match?.params?.id) {
      history.push('/collections');
    }
    this.getCollection();
  }

  componentWillReceiveProps(nextProps) {
    let { collectionList } = nextProps;
    const newCollection = this.setCollectionListData(collectionList);
    this.setState({
      collectionList: newCollection?.data?.contentData || {},
    });
  }

  setCollectionListData = (collectionList) => {
    collectionList?.data?.contentData?.mainContent?.map(item => {
      item['licenceExpDays'] = [];
      item['collectionCountry'] = [];
      item.showDetails = false;
      if (item?.licence?.contentData?.licence?.length > 0) {
        item.licence.contentData.licence.map(licenceItem => {
          if (licenceItem?.template?.length > 0) {
            licenceItem?.template.map(tempItem => {
              if (tempItem.CurrentStatus === 'Active') {
                let days = Math.sign(moment(tempItem.toDate).diff(Date(), "days"));
                let expDays = moment(tempItem.toDate).diff(Date(), "days") <= 5;
                if (days == 1 && expDays) {
                  item['licenceExpDays'].push(expDays);
                }
                if (tempItem?.Country?.length > 0) {
                  tempItem?.Country.map(countryItem => {
                    let index = countryItem['DisplayName'].indexOf();
                    if (index === -1) {
                      item['collectionCountry'].push(countryItem['DisplayName']);
                    }
                  })
                }
              }
            })
          }
        })
      }
    })
    return collectionList;
  }

  getCollection = async() => {
    const data = await {
      contentId: this.props.match.params.id,
      type: 'mainContent'
    }
    await this.props?.getAllLinkedCollections(data);
  }

  handleRoute = (route) => {
    history.push(route);
  };

  viewCollectionHandler = (id) => {
    history.push(`/collection/view/${id}`)
  }

  render() {
    let { links, typography, collectionList} = this.state;
    let { canCreate, canView } = permissionObj?.collections;

    const collection = collectionList?.mainContent?.map((collection, i) => {
      return (
        <div className="mov-l-box whitebox" key={i}>
          {/* <div className="m-tag">Main Content</div> */}
          <div className="mov-info-box flex justify-content-between">
            <div className="left-area flex">
              <div className="movie-img">
                <img src="images/demo.jpg" alt="img" />
              </div>
              <div className="info">
                <div className="mov-detail flex align-items-center">
                  <h4>{collection?.properties?.contentData?.title ? collection?.properties?.contentData?.title : 'NA'}</h4>
                    {
                      collection.properties?.contentData?.subtype?.DisplayName ?
                      <span className="s-badge dot-badge blue">{collection.properties?.contentData?.subtype?.DisplayName}</span>
                      : ''
                    }
                    {
                      collection.contentInfo?.contentData?.stage ?
                      <span className="s-badge orange">{collection.contentInfo?.contentData?.stage}</span>
                      : ''
                    }
                  {/* <span className="s-badge red invalid-text">
                    *Invalid Licensing
                  </span> */}
                  {
                        collection.licenceExpDays?.length > 0 ?
                        <span className="s-badge license red">
                            <TimetableIcon /> `License Expire in {Math.min.apply(null, collection.licenceExpDays)} days`
                        </span>
                        : ''
                    }
                </div>
                <div className="time-loc-row flex align-items-center">
                  <span className="time">
                    <MovieGrayIcon /> {collection?.properties?.contentData?.duration ? collection?.properties?.contentData?.duration : 'NA'}
                  </span>
                  <span className="loc">
                      <WorldIcon /> {collection.collectionCountry?.length > 0 ? collection.collectionCountry?.join(',') : 'NA'}
                  </span>
                </div>
                <div className="status-text flex">
                  <span className="label">Last Modified by</span>
                  <span className="text">
                    <span>
                      {collection.properties?.contentData?.updatedBy
                        ? collection.properties?.contentData?.updatedBy
                        : "NA"}
                    </span>
                    <span>
                      {collection.properties?.contentData?.dateUpdated
                        ? moment(collection.properties?.contentData?.dateUpdated).format(constantText.date_format_without_time)
                        : "NA"}
                    </span>
                    <span>
                      {collection.properties?.contentData?.dateUpdated
                        ? moment(collection.properties?.contentData?.dateUpdated).format(constantText.time_formate)
                        : "NA"}
                    </span>
                  </span>
                </div>
              </div>
            </div>
            <div className="right-area">
              <div className="mov-icon-sec flex align-items-center">
                <div className="mov-id">
                  <span className="text-id">{constantText.external_id_text}</span>
                  <span className="num-id">{collection?.contentId}</span>
                </div>
                <div data-test="view-collection-handler" onClick={() => this.viewCollectionHandler(collection?.contentId)} className="mov-icon mov-view tooltip-sec">
                  <ViewIcon />
                  <div className="tooltip-box">{collectionConstants.viewCollection}</div>
                </div>
                <div
                  disabled={canCreate() ? true : false}
                  className={
                    canCreate()
                      ? "mov-icon mov-copy tooltip-sec"
                      : "mov-icon mov-copy tooltip-sec disable-f-btn"
                  }
                  className="mov-icon mov-copy tooltip-sec"
                >
                  <CopyIcon />
                  <div className="tooltip-box">{collectionConstants.copyCollection}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    });
    return(
      <div className="d-wrap c-n">
        <div className="movie-list-sec">
          <BreadcrumbsComp className="" links={links} typography={typography} />
          <div className="user-head profile-head flex justify-content-between align-items-center">
            <div
              className="back-user-btn flex align-items-center"
              data-test="handleRoute" onClick={() => this.handleRoute("/collections")}
            >
              <span>
                <AngleLeftArrow />
              </span>
              <strong>
                <span>{collectionConstants.collection_linked_text}</span>
              </strong>
            </div>
          </div>
          <div className="movies">
            { collection }
            {
              !collection ?
              <p>No Collection Found</p> :
              ''
            }
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  let { collectionLinkedList, lastEvaluatedKey} = state.collection_reducer;
  return {
    collectionLinkedList,
    lastEvaluatedKey
  }
};

const actionCreators = dispatch => {
  return {
    getAllLinkedCollections: (query) => dispatch(collectionActions.collection_linked_list_action(query))
  }
};
export default connect(mapStateToProps, actionCreators)(LinkedCollection);