import { alphanumericValidate, characterValidateAllLang, maxLength, numberValidate } from "./validation";

const updatePropertiesValue = (stateArr, updatedObj) => {
    let updatedData = stateArr?.map((data) => {
        const dataObj = {
            ...data,
            value: updatedObj[data["name"]] || "",
            errorMsg: '',
            ...(data["type"] === "dropDown" && {isEditDisabled:  updatedObj[data["name"]] ? false : true}),
        };
        return dataObj;
    });
    return updatedData;
};

const validateMarkAsDone = (fields) => {
    let validation = 1;
    const validate = (value) => {
        return value && value != null && Object.keys(value).length ? 2 : 1;
    }
    Object.keys(fields).forEach(key => {
        if (key == 'actors' || key == 'relationShip') {
            fields[key].forEach(field => {
                if (field[1].type !== 'dropDown' && validate(field[0].value) === 2 && validate(field[1].value) === 2) {
                    validation = 2;
                    return;
                }
            })
        } else {
            fields[key].forEach(field => {
                if (field.type !== 'dropDown' && validate(field.value) === 2) {
                    validation = 2;
                    return;
                }
            })
        }
    })
    return validation;
};

const checkError = (dataArr, checkRequired) => {
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

const getFormattedData = (data, checkLength) => {
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

const validateError = (text, numeric, maxTextLength, value) => {
    return ((text && numeric
        ? alphanumericValidate(value)
        : text
            ? characterValidateAllLang(value)
            : numeric
                ? numberValidate(value)
                : null) ||
        (maxTextLength && maxLength(maxTextLength, value.replace(/(<([^>]+)>)/ig, ''))) ||
        null)
}

export const translationHelper = {
    updatePropertiesValue,
    validateMarkAsDone,
    checkError,
    getFormattedData,
    validateError
};