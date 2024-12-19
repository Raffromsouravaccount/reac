import React, { Component } from "react";
import { MenuItem } from "@material-ui/core";
import Radio from "@material-ui/core/Radio";
//Common
import DropDown from "../../../Common/DropDown/DropDown";
import RadioButton from "../../../Common/RadioButton/RadioButton";
//helpers
import { constantText } from "../../../../_helpers/constants.text";
import { permissionObj } from "../../../../_helpers/permission";

//Icons
import EditIcon from "images/edit.svg";
import OrderSetIcon from "images/orderbysort.svg";
import DeleteIcon from "images/delete.svg";

class OrderSets extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLockPopup: false,
      markAsDoneStatus: 1,
      expanded: 0,
      imageItem: null,
      viewEditModalState: false,
      viewEditModalMode: "",
      model: {
        showModel: false,
        type: "",
        title: "",
        des: "",
      },
      setItem: null,
      contentData: {},
      updatedImageItem: null,
      copyImageItem: null,
    };
  }

  componentDidMount() {}

  handleAccordian = (setIndex) => {
    this.setState({
      expanded: this.state.expanded === setIndex ? false : setIndex,
    });
  };

  handelSetOperations(set, mode) {
    const { editHandler, deleteHandler } = this.props;
    if (mode == "edit") {
      editHandler(set);
    } else if (mode == "remove") {
      deleteHandler(set);
    }
  }

  render() {
    let {
      OrderSets,
      handleOpenClose,
      handleMenuClick,
      toggleMorePopup,
    } = this.props;
    let { canUpdate } = permissionObj?.movies?.imagesModule;

    return (
      <div className="set-order-wrap">
        {OrderSets.map((set, setIndex) => {

          const ShowLicensesCountries = set?.countryId ? set?.countryId?.map(e => e?.title) : [];
          return (
          <div
            key={setIndex}
            className="data-list flex justify-content-between m-t-20"
          >
            <div className="left-sec">
              <div className="set-title">{set?.setName}</div>
              <div className="flex country-group">
                <span className="g-cou-l-name">
                  {constantText.create_movie_images_gc_text}
                </span>
                <span className="g-cou-r-name loc">
                  {ShowLicensesCountries?.length > 0
                    ? ShowLicensesCountries?.length > 2
                      ? ShowLicensesCountries[0] +
                        ", " +
                        ShowLicensesCountries[1]
                      : ShowLicensesCountries.join(", ")
                    : "N/A"}
                  {ShowLicensesCountries?.length > 2 ? (
                    <a onClick={() => toggleMorePopup(ShowLicensesCountries)}>
                      {` +${ShowLicensesCountries.length - 2}`}
                    </a>
                  ) : null}
                </span>
              </div>
            </div>
            <div className="flex right-sec justify-content-end">
              <div className="icon edit auto-orderby">
                <OrderSetIcon />
                <DropDown
                  open={set?.openIndex || false}
                  handleOpenClose={() => handleOpenClose(setIndex)}
                  handleClose={() => handleOpenClose(setIndex)}
                  className="link-dropdown"
                >
                  <MenuItem className="label-text" disabled={true}>{"Sort by Index No"}</MenuItem>
                  <MenuItem
                    className="zee-radio-field status-field align-items-center"
                    onClick={() => handleMenuClick(setIndex, "ASC")}
                  >
                    <Radio
                      checked={set?.indexSortType === "ASC" || false}
                      onChange={() => {}}
                      value="ASC"
                      name="Ascending"
                    />
                    {"Ascending"}
                  </MenuItem>
                  <MenuItem
                    className="zee-radio-field status-field align-items-center"
                    onClick={() => handleMenuClick(setIndex, "DESC")}
                  >
                    <Radio
                      checked={set?.indexSortType === "DESC" || false}
                      onChange={() => {}}
                      value="DESC"
                      name="Descending"
                    />
                    {"Descending"}
                  </MenuItem>
                </DropDown>
              </div>
              <div
                className="icon edit auto-edit"
                onClick={() => this.handelSetOperations(set, "edit")}
              >
                <EditIcon />
              </div>
              <div
                className="icon remove auto-remove"
                onClick={() => this.handelSetOperations(set, "remove")}
              >
                <DeleteIcon />
              </div>
            </div>
          </div>
        )})}
      </div>
    );
  }
}

export default OrderSets;
