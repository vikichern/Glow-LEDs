import { Checkbox, FormControlLabel } from "@mui/material";
import React, { useState } from "react";
import ReactTooltip from "react-tooltip";

const GLCheckboxV2 = ({ children, onChecked, value, label, ...otherProps }) => {
  return (
    <FormControlLabel
      style={{ color: "white" }}
      control={
        <Checkbox
          checked={value}
          onChange={onChecked}
          color="info"
          size="large"
          sx={{
            color: "white"
          }}
          {...otherProps}
          inputProps={{ "aria-label": "controlled" }}
        />
      }
      label={label}
    />
  );
};

export default GLCheckboxV2;
