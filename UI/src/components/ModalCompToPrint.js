import React from "react";

const ModalCompToPrint = React.forwardRef((props, ref) => {
  const {
    selectedData,
    printTitle = '',
    childrenToRender
  } = props;

  return (
    <div ref={ref} style={{ padding: "50px" }}>
      {/* <style type="text/css" media="print">
        {" @page {size : landscape}"}
      </style> */}
      <style type="text/css" media="print">
        {"@page { size: auto;  margin: 0mm; }"}
      </style>
      <h3 style={{ textAlign: "center" }}>
        <b>{printTitle}</b>
      </h3>
      {childrenToRender}
    </div>
  );
});

export default ModalCompToPrint;