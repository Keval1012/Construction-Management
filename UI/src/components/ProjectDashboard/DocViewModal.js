import { CloseOutlined, CloudDownloadOutlined, PrinterFilled } from '@ant-design/icons';
import { Col, Divider, Row, Tooltip } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
// import DocViewer, { DocViewerRenderers } from "react-doc-viewer";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import PrintModal from '../PrintModal';
import AppModal from '../AppModal';
import { useReactToPrint } from 'react-to-print';
import jsPDF from 'jspdf';
import { renderToString } from "react-dom/server";
import html2pdf from "html2pdf.js";
import html2canvas from 'html2canvas';
import { API_HOST } from '../../constants';

const DocViewModal = ({ defaultDocView, setDocModalOpen }) => {

    const componentRef = useRef();
    const [openPrintModal, setOpenPrintModal] = useState(false);
    const [isImage, setIsImage] = useState(false);
    const imgSrc = 'https://images.dog.ceo/breeds/mountain-swiss/n02107574_1059.jpg';

    const dynamicURI = `${API_HOST}/${defaultDocView?.path?.attachment || defaultDocView?.attachment}`;

    const docs = [
        {
            // uri: "https://images.dog.ceo/breeds/mountain-swiss/n02107574_1059.jpg"
            // uri: "https://www.africau.edu/images/default/sample.pdf"
            // uri: "https://icseindia.org/document/sample.pdf"
            // uri: "https://cdn.filestackcontent.com/wcrjf9qPTCKXV3hMXDwK"
            // uri: "http://www.pdf995.com/samples/pdf.pdf"
            // uri: "http://localhost:4002/images/aa.jpg"
            uri: dynamicURI
        },
    ];

    useEffect(() => {
        if (defaultDocView) {
            let temp = defaultDocView?.path?.attachment;
            let arr = temp?.split('.');
            let lastVal = arr?.pop();
            if (lastVal === 'png' || lastVal === 'jpg' || lastVal === 'jpeg') setIsImage(true);
        }
    }, [defaultDocView]);

    const handleImageDownload = () => {
        // const imageUrl = '/path/to/your-image.png'; // Replace with the actual image URL
        const imageUrl = dynamicURI
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = defaultDocView?.name; // The name for the downloaded file
        link.click();
      };

    const handlePrintModal = () => {
        // setOpenPrintModal(!openPrintModal);

        // const pdf = new jsPDF("p", "mm", "a4");
        // const workEffortString = renderToString(<DocViewer
        //     pluginRenderers={DocViewerRenderers}
        //     documents={docs}
        //     // documents={}
        //     config={{
        //         header: {
        //             disableHeader: true,
        //             disableFileName: false,
        //             retainURLParams: false,
        //             // overrideComponent: true,
        //         },
        //     }}
        //     style={{ height: 500 }}
        // />);
        // const element = document.createElement('div');
        // element.innerHTML = workEffortString;

        html2canvas(componentRef?.current)
        .then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF();
            pdf.addImage(imgData, 'JPEG', 0, 0);
            // pdf.output('dataurlnewwindow');
            pdf.save(defaultDocView?.name);
        });

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

    return (
        <div>
            <Row align='top' justify='space-between'>
                <Col><h2>Document: {defaultDocView?.name}</h2></Col>
                <Col xl={5} lg={5} md={5}>
                    <Row justify='end'>
                        {/* <PrinterFilled
                            className='docModalIcon'
                            onClick={() => {
                                // handlePrint();
                                handlePrintModal();
                                // window.print();
                            }}
                        /> */}
                        <CloseOutlined className='docModalIcon' />
                    </Row>
                </Col>
            </Row>
            <Divider />
            {isImage && 
                <Tooltip
                    title='download file'
                    placement='bottom'
                    arrow={false}
                >
                    <CloudDownloadOutlined
                        className='docModalIcon cloudDownloadIcon'
                        // onClick={handleImageDownload}
                        onClick={handlePrintModal}
                    />
                </Tooltip>
            }
            <div ref={componentRef}>
                <DocViewer
                    pluginRenderers={DocViewerRenderers}
                    documents={docs}
                    config={{
                        header: {
                            disableHeader: true,
                            disableFileName: false,
                            retainURLParams: false,
                            // overrideComponent: true,
                        },
                        pdfZoom: {
                            defaultZoom: 1.1, // 1 as default,
                            zoomJump: 0.1, // 0.1 as default,
                        },
                        pdfVerticalScrollByDefault: true,
                    }}
                    style={{ height: 500 }}
                />
            </div>
            {/* <AppModal
                open={openPrintModal}
                closeIcon={false}
                children={
                    <PrintModal
                        defaultDocView={defaultDocView}
                        setOpenPrintModal={setOpenPrintModal}
                        printTitle={defaultDocView?.name}
                        childrenToRender={<DocViewer
                            pluginRenderers={DocViewerRenderers}
                            documents={docs}
                            config={{
                                header: {
                                    disableHeader: false,
                                    disableFileName: false,
                                    retainURLParams: false
                                }
                            }}
                            style={{ height: 500 }}
                        />}
                        selectedData={defaultDocView}
                    />}
                onOk={handlePrintModal}
                onCancel={handlePrintModal}
            /> */}
        </div>
    )
}

export default DocViewModal;