import React, { Component, Fragment } from 'react';
import moment from 'moment';

//Helper files
import BreadCrumbs from "../../Common/BreadCrumbs/BreadCrumbs";
import { apiCalls } from "../../../_services/common.service";
import { constantText } from "../../../_helpers/constants.text";
import { history } from "../../../_helpers/history";
import Config from "../../../Config/config";
import { breadCrumbs } from "../breadCrumbs";

//Icons
import AngleLeftArrow from "images/angle-left-arrow.svg";

class TranscodingHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      historyData: {},
      orderWiseSectionName: constantText.transcoding_section_order_arr
    }
  }

  componentDidMount = () => {
    this.getHistoryData();
  }

  getHistoryData = async () => {
    const { id } = this.props.match?.params;
    const url = `${Config.transcodingHistoryList}?id=${id}`;
    const response = await apiCalls(url, 'GET', {}, this.props.match.location, true);
    if (response) {
      const { rows } = response;
      this.setState({
        historyData: rows?.[0] || {}
      }, ()=> this.setOrderForSection())
    }
  }

  setOrderForSection= ()=> {
    let { historyData, orderWiseSectionName }= this.state;
    let { transcodingChange }= historyData;
    let orderObj= {};
    for(const section of orderWiseSectionName) {
      if(!!transcodingChange[section]) {
        orderObj[section]= transcodingChange[section]
      }
    }
    for(const section in transcodingChange) {
      if(!orderWiseSectionName.includes(section)) {
        orderObj[section]= transcodingChange[section]
      }
    }
    this.setState(prevState=> ({
      historyData: {
        ...historyData,
        transcodingChange: orderObj
      }
    }));
  }

  formatData = (sectionName, data) => {
    data = (data || typeof(data)== 'boolean')? (sectionName== 'castAndCrew') ?
      data? (data?.map(obj => obj.cast_name).join(", ") || "NA"): 'NA':
      Array.isArray(data) ? (data.map(obj => obj.title).join(", ") || "NA") : (typeof (data) == 'object') ?
        Object.keys(data).join(", ") : (typeof (data) == 'boolean') ? !!data ? 'True' : 'False' : data: 'NA';

    return data;
  }

  formatSectionName= sectionName => {
    return (sectionName== 'contentProperties') ? 'Content Properties' : (sectionName== 'castAndCrew')?
      'Cast And Crew': (sectionName== 'video')? 'Video': (sectionName== 'licenseModule')? 'License Module':
      (sectionName== 'images')? 'Images': (sectionName== 'seo')? 'Seo': (sectionName== 'translation')?
      'Translation': (sectionName== 'tvShow')? 'Tv Show': sectionName;
  }

  handleRoute = route => {
    history.push(route, {selectedTab: 1});
  }

  render() {
    const { historyData } = this.state;
    const { transcodingChange } = historyData;
    return (
      <div className="d-wrap c-n">
        <BreadCrumbs
          className=""
          links={breadCrumbs.links}
          typography={breadCrumbs.historyTypography()}
        />
        <div className="user-head profile-head flex align-items-center justify-content-between">
          <div className="back-user-btn">
            <div className="text">
              <span
                data-test="handleRouteBtn"
                onClick={() => this.handleRoute("/transcoding")}
              >
                <AngleLeftArrow />
              </span>
              <strong>{constantText.uid_mapping_text}</strong>
            </div>
          </div>
        </div>
        <div className="status-table uid-map-table scrollBar scroll-X">
          <table>
            <thead>
              <tr>
                {constantText.transcodingHistory_header_arr.map((data, index) => (
                  <th key={index} className="uid-sec-name">{data}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transcodingChange && constantText.transcodingHistory_section_arr.map((data, index) => {
                if (typeof (transcodingChange[data])== 'object' && Object.keys(transcodingChange || {}).includes(data)) {
                  if (Object.keys(transcodingChange[data]).length > 1) {
                    return (
                      <tr key={index}>
                        <td className="uid-sec-name">{this.formatSectionName(data)}</td>
                        <td className="listing" colSpan="4">
                          <table>
                            <tbody>
                              {Object.keys(transcodingChange?.[data]).map((sectionData, sectionIndex) => {
                                let odData = this.formatData(data, transcodingChange?.[`old_${data}`]?.[sectionData])
                                let updatedData = this.formatData(data, transcodingChange?.[data]?.[sectionData])
                                return (
                                  <tr key={sectionIndex}>
                                    <td className="uid-f-name">{sectionData}</td>
                                    <td className="uid-data">{odData}</td>
                                    <td className="uid-data">{updatedData}</td>
                                    <td className="uid-time">
                                      <div className="flex">
                                        <span className="p-r-10">
                                          {moment(historyData.modifiedOn).format(constantText.date_format_with_month_time)}
                                        </span>
                                      </div>
                                    </td>
                                  </tr>
                                )
                              })}
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    )
                  }
                  else {
                    return (
                      <tr key={index}>
                        <td className="uid-sec-name">{this.formatSectionName(data)}</td>
                        {Object.keys(transcodingChange?.[data]).map((sectionData, sectionIndex) => {
                          let odData = this.formatData(data, transcodingChange?.[`old_${data}`]?.[sectionData])
                          let updatedData = this.formatData(data, transcodingChange?.[data]?.[sectionData])
                          return (
                            <Fragment key={sectionIndex}>
                              <td className="uid-f-name">{sectionData}</td>
                              <td className="uid-data">{odData}</td>
                              <td className="uid-data">{updatedData}</td>
                              <td className="uid-time">
                                <div className="flex">
                                  <span className="p-r-10">
                                    {moment(historyData.modifiedOn).format(constantText.date_format_with_month_time)}
                                  </span>
                                </div>
                              </td>
                            </Fragment>
                          )
                        })}
                      </tr>
                    )
                  }
                }
              })}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
};

export default TranscodingHistory;