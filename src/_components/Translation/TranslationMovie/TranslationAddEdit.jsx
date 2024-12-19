import React, { Component, Fragment } from "react";
import { connect } from "react-redux";

//Fields Component
import TranslationFormFields from "../Layout/TranslationFormFields";

class TranslationAddEdit extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {
            fieldKey,
            fieldsData,
            handleChange,
            onEditorValueChange,
            handleMultiSelect,
            handleCheckBox,
            onBlur,
            error,
            index,
            setSelectDataArr,
            lock,
            language
        } = this.props;
        return (
            <Fragment>
                {fieldsData && Array.isArray(fieldsData)
                    ?
                    <div className="row actor-info-form">
                    {/* <div className="row actor-info-form m-minus-30"> */}
                        {/* <div className="row actor-info-form"> */}
                        {fieldsData.map((field, ind) => (
                            <div key={ind} className="col-md-6 p-remove">
                                <TranslationFormFields
                                    fieldsData={field}
                                    handleChange={event => handleChange(fieldKey, ind, index, event.target.value)}
                                    onEditorValueChange={value => onEditorValueChange(fieldKey, ind, index, value)}
                                    handleMultiSelect={(event, id, name, value) => handleMultiSelect(fieldKey, ind, index, value)}
                                    handleCheckBox={(event, value) => handleCheckBox(fieldKey, ind, index, value)}
                                    onBlur={onBlur}
                                    error={error}
                                    //getMasterData={getMasterData}
                                    setSelectDataArr={value => setSelectDataArr(fieldKey, index, value)}
                                    isLocked={lock}
                                    language={language}
                                />
                            </div>
                        ))}
                    </div>
                    :
                    (<TranslationFormFields
                        fieldsData={fieldsData}
                        handleChange={event => handleChange(fieldKey, null, index, event.target.value)}
                        onEditorValueChange={value => onEditorValueChange(fieldKey, null, index, value)}
                        handleMultiSelect={(event, id, name, value) => handleMultiSelect(fieldKey, null, index, value)}
                        handleCheckBox={(event, value) => handleCheckBox(fieldKey, null, index, value)}
                        onBlur={onBlur}
                        error={error}
                        //getMasterData={getMasterData}
                        setSelectDataArr={value => setSelectDataArr(fieldKey, index, value)}
                        isLocked={lock}
                        language={language}
                    />)
                }
            </Fragment>

        );
    }
}

export default connect(null, {})(TranslationAddEdit);
