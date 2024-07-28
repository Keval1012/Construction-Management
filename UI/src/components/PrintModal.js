import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import ModalCompToPrint from "./ModalCompToPrint";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const PrintModal = ({
    selectedData,
    modalType,
    printTitle,
    childrenToRender,
    setOpenPrintModal,
}) => {
  const componentRef = useRef();

  const [element, setElement] = useState(null);

  useEffect(() => {
    console.log('called');
    if (element) {
      downloadAfterImageLoad();
    }
  // }, [componentRef.current]);
  }, [element]);

  const downloadDoc = () => {
    debugger
    console.log(componentRef);
    const ele = componentRef.current;
    
    setTimeout(() => {
      // const ele = componentRef.current;

      downloadAfterImageLoad();
      
      // html2canvas(ele, {
      //   // scale: 5,
      // }).then(function (canvas) {
      //   let data = canvas.toDataURL("image/png");
      //   // downloadAfterImageLoad(data);
      //   const pdf = new jsPDF();
      //   // const pdfWidth = pdf.internal.pageSize.getWidth();
      //   // const pdfHeight = pdf.internal.pageSize.getHeight();
      //   pdf.addImage(data, "PNG", 0, 0);
      //   pdf.save("label.pdf");
      // });
    }, 2000);

  };

  const downloadAfterImageLoad = (data) => {
    setTimeout(() => {
      debugger
      // const ele = componentRef.current;
      const ele = element;

      if (element) {
        html2canvas(ele, {
          // scale: 5,
        }).then(function (canvas) {
          debugger
          let data = canvas.toDataURL("image/png");
          // downloadAfterImageLoad(data);
          const pdf = new jsPDF();
          // const pdfWidth = pdf.internal.pageSize.getWidth();
          // const pdfHeight = pdf.internal.pageSize.getHeight();
          pdf.addImage(data, "PNG", 0, 0);
          pdf.save("new label.pdf");
        });
      }

      // const pdf = new jsPDF();
      // // const pdfWidth = pdf.internal.pageSize.getWidth();
      // // const pdfHeight = pdf.internal.pageSize.getHeight();
      // pdf.addImage(data, "PNG", 0, 0);
      // pdf.save("label.pdf");
    }, 1000);
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    // pageStyle: `@page { size: 5in 8in }`
    // pageStyle: `@page { 
    //         margin: 150px !important;
    //     }`
    // pageStyle: `
    // @page {
    //   @bottom-left {
    //     content: counter(page) ' of ' counter(pages);
    //   }
    // }
  
    // `
  });

  useEffect(() => {
    setOpenPrintModal(false);
    // handlePrint();
    downloadDoc();
  }, []);

  return (
    <div>
      <h1>Hello</h1>
      <ModalCompToPrint
        // selectedData={selectedData}
        modalType={modalType}
        printTitle={printTitle}
        // ref={componentRef}
        ref={setElement}
        childrenToRender={childrenToRender}
      />
    </div>
  );
};

export default PrintModal;