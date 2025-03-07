/* eslint-disable max-lines-per-function */
import PropTypes from "prop-types";
import Skeleton from "@mui/material/Skeleton";

import React from "react";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import Checkbox from "@mui/material/Checkbox";
import { makeStyles, styled } from "@mui/styles";

const StyledTextField = styled(TextField)({
  "& label.Mui-focused": {
    color: "white"
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "white"
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "white"
    },
    "&:hover fieldset": {
      borderColor: "white"
    },
    "&.Mui-focused fieldset": {
      borderColor: "white"
    }
  }
});

const useStyles = makeStyles(() => ({
  inputRoot: {
    color: "white !important"
  },
  inputBase: {
    color: "white !important"
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "white"
    }
  },
  input: {
    fontSize: "1.2rem",
    color: "white"
  },
  chip: {
    ".MuiChip-label": {
      fontSize: "16px"
    }
  },
  formLabel: {
    color: "#000",
    "&.Mui-focused": {
      color: "#000"
    }
  },
  "& .MuiSvgIcon-root": {
    color: "white"
  }
}));

const GLAutocomplete = ({
  loading,
  value,
  options,
  getOptionLabel,
  getOptionSelected,
  helperText,
  label,
  variant,
  name,
  onChange,
  onBlur,
  disabled,
  error,
  classes,
  freeSolo,
  disableCloseOnSelect,
  getOptionDisabled,
  inputColor,
  inputType,
  limitTags,
  multiple,
  showCheckbox,
  chipColor,
  restrictCharacters,
  chipsOptionsDisabled,
  inputPropsTextField,
  onInputChange,
  chipLabel,
  textFieldDataTest,
  margin,
  option_name,
  ...otherProps
}) => {
  const default_classes = useStyles();
  const icon = <CheckBoxOutlineBlankIcon fontSize="medium" />;
  const checkedIcon = <CheckBoxIcon fontSize="medium" />;
  return (
    <div>
      {loading ? (
        <Autocomplete
          disabled={disabled}
          value={value}
          size="small"
          classes={default_classes}
          color={inputColor}
          freeSolo={freeSolo}
          disableCloseOnSelect={disableCloseOnSelect}
          limitTags={limitTags}
          multiple={multiple}
          onInputChange={onInputChange}
          options={options}
          getOptionLabel={getOptionLabel}
          getOptionSelected={getOptionSelected}
          getOptionDisabled={chipsOptionsDisabled}
          {...otherProps}
          renderInput={params => (
            <StyledTextField
              {...params}
              className={classes.textField}
              InputLabelProps={{
                style: { color: "#fff" }
              }}
              inputProps={{ ...params.inputProps, onKeyDown: restrictCharacters, ...inputPropsTextField, color: "white" }}
              name={name}
              margin={margin}
              data-test={textFieldDataTest}
              type={inputType}
              label={label}
              variant={variant}
              error={error}
              helperText={helperText}
            />
          )}
          renderTags={
            chipsOptionsDisabled
              ? (tagValue, getTagProps) =>
                  tagValue.map((option, index) => (
                    <Chip
                      key={option}
                      style={{ fontSize: "1.6rem" }}
                      classes={classes.chip}
                      label={!chipLabel ? option : option[chipLabel]}
                      {...getTagProps({ index })}
                      disabled={chipsOptionsDisabled ? chipsOptionsDisabled(option) : false}
                      color={!chipLabel ? "" : chipColor === "function" ? chipColor(option) : chipColor}
                      size="medium"
                    />
                  ))
              : false
          }
          renderOption={(props, option, { selected }) => {
            return showCheckbox ? (
              <li {...props}>
                <Checkbox icon={icon} size="medium" checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected} />
                {option[option_name] || option.name}
              </li>
            ) : (
              <li {...props}>
                {/* {option[option_name] || option.name} */}
                {typeof option_name === "function" ? option_name(option) : option[option_name] || option.name}
              </li>
            );
          }}
          onChange={onChange}
          onBlur={onBlur}
        />
      ) : (
        <Skeleton variant="text" height={80} className={classes.skeleton} animation="wave" />
      )}
    </div>
  );
};

GLAutocomplete.defaultProps = {
  loading: true,
  chipLabel: "name",
  freeSolo: false,
  multiple: false,
  showCheckbox: false,
  margin: "normal",
  // textFieldDataTest: "",
  disableCloseOnSelect: false,
  chipsOptionsDisabled: () => false
  // value: [],
  // options: []
  // getOptionLabel: option => option.name
  // getOptionSelected: (option, value) => option === value,
  // getOptionDisabled: x => x,
  // restrictCharacters: x => x,
  // onInputChange: x => x,
  // helperText: "",
  // label: "",
  // variant: "outlined",
  // name: "",
  // onChange: x => x,
  // onBlur: x => x,
  // disabled: false,
  // error: null,
  // classes: {},
  // inputColor: "default",
  // chipColor: x => x,
  // inputType: "text",
  // limitTags: 5,
  // inputPropsTextField: {}
};

GLAutocomplete.propTypes = {
  loading: PropTypes.bool,
  freeSolo: PropTypes.bool,
  multiple: PropTypes.bool,
  chipLabel: PropTypes.string,
  disableCloseOnSelect: PropTypes.bool,
  textFieldDataTest: PropTypes.string,
  showCheckbox: PropTypes.bool,
  chipsOptionsDisabled: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  value: PropTypes.oneOfType([PropTypes.array, PropTypes.object, PropTypes.string, PropTypes.number]),
  options: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
  getOptionLabel: PropTypes.func,
  getOptionSelected: PropTypes.func,
  restrictCharacters: PropTypes.func,
  getOptionDisabled: PropTypes.func,
  onInputChange: PropTypes.func,
  helperText: PropTypes.string,
  label: PropTypes.string,
  variant: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  disabled: PropTypes.bool,
  margin: PropTypes.bool,
  error: PropTypes.array,
  classes: PropTypes.object,
  inputColor: PropTypes.string,
  chipColor: PropTypes.func,
  inputType: PropTypes.string,
  limitTags: PropTypes.number,
  inputPropsTextField: PropTypes.object
};

export default GLAutocomplete;
