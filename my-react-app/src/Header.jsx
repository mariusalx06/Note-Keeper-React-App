import React from "react";
import ChecklistRtlIcon from "@mui/icons-material/ChecklistRtl";

function Header() {
  return (
    <header>
      <h1>
        <ChecklistRtlIcon
          style={{ fontSize: "2.7rem", verticalAlign: "middle" }}
        />
        Marius's Notes App
      </h1>
    </header>
  );
}

export default Header;
