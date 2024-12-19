import moment from "moment";
import { constantText } from "../_helpers/constants.text";
import { getLocalData, removeLocalData, setLocalData } from "../_helpers/util"

class FilterService {

  pages = constantText.filterHistoryPages

  async saveFilterData(filterData) {
    let {
      page,
      contentState,
      contentStateName,
      searchString,
      sortingFilters,
      statusTypes,
      filterByDate,
      selectFilters,
      selectedContentType,
      currentSortkey,
      currentSortValue,
      indexSortType,
      blankDate,
      filterDatakey,
      sortDatakey,
      formValidity,
      appliedFilters
    } = filterData;
    (selectFilters || []).forEach(item => {
      if (Array.isArray(item.value) ? item.value.length : item.value) {
        if(item?.data?.length) {
          item.data = []
        }
      }
    })
    const data = {
      contentStateName: contentStateName || "",
      contentState: contentState || "",
      searchString: searchString || "",
      selectedContentType,
      sortingFilters: sortingFilters,
      statusTypes: statusTypes,
      filterByDate,
      selectFilters: selectFilters,
      currentSortkey,
      currentSortValue,
      indexSortType,
      blankDate,
      filterDatakey,
      sortDatakey,
      formValidity,
      appliedFilters
    }
    setLocalData(`${page}_filter`, data)
  }

  getSavedFilterData(filterData) {
    let {
      page,
      searchString,
      sortingFilters,
      statusTypes,
      filterByDate,
      selectFilters,
      selectedContentType,
      currentSortkey,
      currentSortValue,
      indexSortType
    } = filterData;
    if (page == this.pages.tvShowListing) {
      removeLocalData(`${this.pages.seasonListing}_filter`)
      removeLocalData(`${this.pages.episodeListing}_filter`)
    } else if (page == this.pages.seasonListing) {
      removeLocalData(`${this.pages.episodeListing}_filter`)
    }
    const savedFilterData = getLocalData(`${page}_filter`)
    const defaultEnd = moment().add(10, 'days').format(constantText?.placeholder_date_Format);
    const defaultStart = moment(defaultEnd).subtract(3, "months").format(constantText?.placeholder_date_Format);
    if (filterByDate?.length) {
      filterByDate.forEach((item) => {
        item.date.endDate = defaultEnd;
        item.date.startDate = defaultStart;
      })
    }
    return {
      contentState: savedFilterData?.contentState || "",
      contentStateName: savedFilterData?.contentStateName || "",
      searchString: savedFilterData?.searchString || searchString,
      sortingFilters: savedFilterData?.sortingFilters || sortingFilters,
      statusTypes: savedFilterData?.statusTypes || statusTypes,
      selectFilters: savedFilterData?.selectFilters?.length ? savedFilterData?.selectFilters : selectFilters,
      filterByDate: savedFilterData?.filterByDate || filterByDate,
      selectedContentType: savedFilterData?.selectedContentType || selectedContentType,
      defaultStart,
      defaultEnd,
      currentSortkey: savedFilterData?.currentSortkey || currentSortkey,
      currentSortValue: savedFilterData?.currentSortValue || currentSortValue,
      indexSortType: savedFilterData?.indexSortType || indexSortType,
      blankDate: typeof (savedFilterData?.blankDate) == 'boolean' ? !!savedFilterData?.blankDate : false,
      filterDatakey: typeof (savedFilterData?.filterDatakey) == 'boolean' ? !!savedFilterData?.filterDatakey : true,
      sortDatakey: typeof (savedFilterData?.sortDatakey) == 'boolean' ? !!savedFilterData?.sortDatakey : true,
      formValidity: !!savedFilterData?.formValidity,
      appliedFilters: savedFilterData?.appliedFilters
    }
  }

  async removeSavedFilterData(contentType) {
    removeLocalData(contentType)
  }

}

export const filterService = new FilterService();

