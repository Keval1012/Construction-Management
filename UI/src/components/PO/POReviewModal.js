import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AppButton from '../AppButton';
import { Alert, Badge, Col, Drawer, Modal, Row, Table, Typography, message } from 'antd';
import { CloseOutlined, DownloadOutlined, LeftOutlined } from '@ant-design/icons';
import { getIndianMoneyFormat } from '../../helper';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import dayjs from 'dayjs';
import { css } from '@emotion/react';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { downloadInvoicePDF } from './createPDF';

export const TableFooter = ({ totalAmount, record }) => {
    return (
        <Row justify='end' className='tableFooter'>
            <Col xl={8} lg={8} md={8} sm={8} xs={8}>
                {/* <Row justify='start'>
                    <Col xl={12} lg={12} md={12} style={{ margin: '0 4%' }}>Amount Paid: </Col>
                    <Col>₹ {getIndianMoneyFormat(record?.amountPaid ? record?.amountPaid : 0)}</Col>
                </Row> */}
                <Row justify='start'>
                    <Col xl={12} lg={12} md={12} style={{ margin: '0 4%' }}>Cost Items: </Col>
                    <Col>₹ {getIndianMoneyFormat(record?.materialAmount)}</Col>
                </Row>
                <Row justify='start'>
                    <Col xl={12} lg={12} md={12} style={{ margin: '0 4%' }}>Item Tax: </Col>
                    <Col>{record?.materialTax}</Col>
                </Row>
                <Row justify='start'>
                    <Col xl={12} lg={12} md={12} style={{ margin: '0 4%' }}>Total Tax: </Col>
                    <Col>₹ {getIndianMoneyFormat(record?.totalTax)}</Col>
                </Row>
                <Row justify='start'>
                    <Col xl={12} lg={12} md={12} style={{ margin: '0 4%' }}><h4>Grand Total: </h4></Col>
                    <Col><h4>₹ {getIndianMoneyFormat(record?.totalAmount)}</h4></Col>
                </Row>
                {/* <h4>Amount Paid: ₹ {getIndianMoneyFormat(record?.amountPaid ? record?.amountPaid : 0)}</h4>
                <h4>Total Items: ₹ {getIndianMoneyFormat(record?.materialAmount)}</h4>
                <h4>Total Tax: ₹ {getIndianMoneyFormat(record?.totalTax)}</h4>
                <h3>Grand Total: ₹ {getIndianMoneyFormat(totalAmount)}</h3> */}
            </Col>
        </Row>
    )
}

const POReviewModal = ({
    currentPO,
    handleReviewModalClose
}) => {

    const location = useLocation();
    const navigate = useNavigate();
    const confirm = Modal.confirm;
    const { Paragraph } = Typography;
    const [allCurrPOItems, setAllCurrPOItems] = useState([]);
    const [totalAmount, setTotalAmount] = useState('0');

    useEffect(() => {
        if (currentPO && currentPO?.purchaseItems?.length > 0) {
            calculateTotalAmount();
        }
    }, [JSON.stringify(currentPO)]);

    const columns = [
        {
            title: 'Item',
            dataIndex: 'description',
            key: 'description',
            render: (val) => <div>{val}</div>
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (val) => <div>{val}</div>
        },
        {
            title: 'Unit Cost',
            dataIndex: 'unitOrHourPrice',
            key: 'unitOrHourPrice',
            width: '30%',
            render: (val) => <div className='textCenter'>₹ {getIndianMoneyFormat(val)}</div>
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            render: (val) => <div>₹ {getIndianMoneyFormat(val)}</div>
        },
    ];

    const setAmountPerItem = (defList) => {
        let list = defList?.map((o) => {
            if (o.quantity && o.rate) {
                o.amount = (parseFloat(o.quantity) * parseFloat(o.rate)).toString();
            }
            return o;
        });
        setAllCurrPOItems(list);
        calculateTotalAmount();
    };

    const calculateTotalAmount = () => {
        let temp = 0;
        // allCurrPOItems.forEach(o => {
        currentPO?.purchaseItems?.forEach(o => {
            temp += parseFloat(o.amount);
        });
        setTotalAmount(temp.toString());
    };

    pdfMake.vfs = pdfFonts.pdfMake.vfs;

    const styles = {
        page: {
            // fontFamily: 'Roboto, Arial, sans-serif',
            fontFamily: 'brandon-grotesque, Helvetica Neue, Helvetica, Arial, sans-serif',
            padding: '20px',
        },
        header: {
            fontSize: 18,
            marginBottom: 10,
            fillColor: '#aca1ff'
        },
        mainHeader: {
            fontSize: 18,
            // color: '#ffffff', // White color
            color: '#263042',
            // backgroundColor: '#3498db', // Blue color
            // padding: '10px', // Add padding to header
        },
        subheader: {
            fontSize: 14,
            marginBottom: 18,
            // color: '#aca1ff',
            // color: '#858bff',
            // color: '#669cff',
            color: 'white',
            // decoration: 'underline',
            // lineHeight: 3
        },
        container: {
            display: 'flex',
            justifyContent: 'space-between',
        },
        detailsColumn: {
            width: '30%',
        },
        table: {
            width: '100%',
            borderCollapse: 'collapse',
            marginTop: '20px',
        },
        tableHeader: {
            // backgroundColor: '#858bff',
            color: '#fff',
            padding: '10px',
            fontSize: 12
        },
        tableData: {
            fontSize: 11
        },
        tableCell: {
            border: '1px solid #ddd',
            padding: '8px',
            textAlign: 'center',
        },
        totalsTable: {
            width: '50%',
            marginTop: '20px',
        },
        underline: {
            textDecoration: 'underline',
        },
        tableHeader1: {
            // backgroundColor: '#3498db',
            // backgroundColor: 'transparent',
            // color: '#3498db', // Blue color
            color: 'white',
        },
        header1: {
            fontSize: 18,
            marginBottom: 10,
            color: '#000', // White color
            backgroundColor: '#000', // Blue color
            // padding: '10px', // Add padding to header
        },
    };

    const downloadPOWithPdfmake = () => {

        let materialHeaders = ['Description', 'Quantity', 'Unit Rate', 'Amount'];

        materialHeaders = materialHeaders.map(o => {
            return { text: o, alignment: 'center', style: styles.tableHeader, bold: true, margin: [3, 3, 3, 3] }
        });

        let items = currentPO?.purchaseItems?.map(o => {
            if (o.category === 'material') {
                return [
                    { style: styles.tableData, text: o.description, alignment: 'center', margin: [5, 5, 5, 5] },
                    { style: styles.tableData, text: o.quantity, alignment: 'center', margin: [5, 5, 5, 5] },
                    { style: styles.tableData, text: `₹ ${getIndianMoneyFormat(o.unitOrHourPrice)}`, alignment: 'center', margin: [5, 5, 5, 5] },
                    { style: styles.tableData, text: `₹ ${getIndianMoneyFormat(o.amount)}`, alignment: 'center', margin: [5, 5, 5, 5] }
                ];
            }
        }).filter(d => d !== undefined);

        items = Array(10).fill(items[0]);
        debugger

        const documentDefinition = {
            // header: function(currentPage, pageCount, pageSize) {
            //     return [
            //         // { fillColor: '#5bc0de' },
            //         { text: 'LOGO', style: styles.tableHeader, alignment: (currentPage % 2) ? 'left' : 'right' },
            //         { text: 'Purchase Order', style: styles.tableHeader, alignment: 'right' },
            //         { canvas: [ { type: 'rect', x: 170, y: 32, w: pageSize.width - 170, h: 40 } ] }
            //     ]
            // },
            header: {
                // columns: [
                //     {
                //         text: 'LOGO',
                //         style: styles.mainHeader,
                //     },
                //     {
                //         text: 'Purchase Order',
                //         style: styles.mainHeader,
                //         alignment: 'right', // Align the text to the right
                //     },
                // ],
                table: {
                    headerRows: 0,
                    widths: ['50%', '50%'],
                    body: [
                        [
                            { text: 'LOGO', style: styles.mainHeader, bold: true, alignment: 'left', margin: [65, 10, 0, 10] },
                            { text: 'Purchase Order', style: styles.mainHeader, alignment: 'right', margin: [0, 10, 65, 10] },
                        ],
                    ],
                },
                layout: 'noBorders',
                absolutePosition: { x: 0, y: 0 },
                // fillColor: '#cfe0ff',
                // fillColor: '#263042',
            },
            // background: (currentPage, pageCount) => {
            //     return {
            //         canvas: [
            //             {
            //                 type: 'rect',
            //                 x: 15, y: 15, w: 930, h: 510,
            //                 color: '#eaeaea'
            //             }
            //         ]
            //     };
            // },
            content: [
                // {
                //     text: 'Invoice',
                //     style: styles.header1,
                //     colSpan: 2, // Span header across two columns
                //   },
                //   {
                //     table: {
                //       headerRows: 1,
                //       widths: ['50%', '50%'],
                //       body: [
                //         [
                //           { text: 'Left Header', style: styles.tableHeader1, alignment: 'left' },
                //           { text: 'Right Header', style: styles.tableHeader1, alignment: 'right' },
                //         ],
                //       ],
                //     },
                //     layout: 'noBorders',
                //   },
                // { table: {
                //         headerRows: 0,
                //         widths: ['auto', '*'],
                //         body: [
                //             [
                //                 { text: 'LOGO', style: styles.tableHeader, bold: true, alignment: 'left' },
                //                 { text: 'Purchase Order', style: styles.tableHeader, bold: true, alignment: 'right' },
                //             ],
                //         ],
                //     },
                //     layout: 'noBorders',
                //     absolutePosition: { x: 0, y: 0 },
                //     fillColor: '#cfe0ff',
                //     // margin: [5, 20]
                // },
                //   {
                //     columns: [
                //         { text: 'LOGO', style: styles.header },
                //         { text: 'Purchase Order', style: styles.header },

                //     ],
                //     table: {
                //         widths:'*',
                //         body: [
                //             [{
                //                     border: [false, false, false, false],
                //                     fillColor: '#5bc0de',
                //                     text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
                //                 }]
                //         ]
                //     },
                //     // layout: {
                //     //   fillColor: function (i, node) {
                //     //     return i % 2 === 0 ? '#cfe0ff' : null;
                //     //   },
                //     // }
                //     // fillColor: '#aca1ff'
                //   },
                '\n\n',
                {
                    columns: [
                        {
                            fontSize: 10,
                            text: 'PO Name :',
                            bold: true
                        },
                        {
                            stack: [
                                { text: currentPO?.purchaseOrderName, fontSize: 10 },
                                { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 100, y2: 5, lineWidth: 0.5 }] },
                            ],
                        },
                        {
                            width: 50,
                            text: ''
                        },
                        {
                            fontSize: 10,
                            text: 'PO Number :',
                            bold: true
                        },
                        {
                            stack: [
                                { text: currentPO?.purchaseOrderNumber ? currentPO?.purchaseOrderNumber : 'N/A', fontSize: 10 },
                                { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 100, y2: 5, lineWidth: 0.5 }] },
                            ],
                        },
                    ],
                },
                '\n',
                {
                    columns: [
                        {
                            fontSize: 10,
                            text: 'PO Date :',
                            bold: true
                        },
                        {
                            stack: [
                                { text: new Date(currentPO?.PODate).toDateString(), fontSize: 10 },
                                { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 100, y2: 5, lineWidth: 0.5 }] },
                            ],
                        },
                        {
                            width: 50,
                            text: ''
                        },
                        {
                            fontSize: 10,
                            text: 'Delivery Deadline :',
                            bold: true
                        },
                        {
                            stack: [
                                { text: new Date(currentPO?.expireDate).toDateString(), fontSize: 10 },
                                { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 100, y2: 5, lineWidth: 0.5 }] },
                            ],
                        },
                    ],
                },
                '\n',
                {
                    columns: [
                        {
                            fontSize: 10,
                            text: 'Work Start Date :',
                            bold: true
                        },
                        {
                            stack: [
                                { text: currentPO?.workStartDate ? new Date(currentPO?.workStartDate).toDateString() : 'N/A', fontSize: 10 },
                                { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 100, y2: 5, lineWidth: 0.5 }] },
                            ],
                        },
                        {
                            width: 50,
                            text: ''
                        },
                        {
                            fontSize: 10,
                            text: 'Work End Date:',
                            bold: true,
                            fillColor: 'red'
                        },
                        {
                            stack: [
                                { text: currentPO?.workEndDate ? new Date(currentPO?.workEndDate).toDateString() : 'N/A', fontSize: 10 },
                                { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 100, y2: 5, lineWidth: 0.5 }] },
                            ],
                        },
                    ],
                },
                '\n\n',
                {
                    columns: [
                        { style: 'header',
                            table: {
                                widths:'85%',
                                body: [
                                    [{
                                        border: [false, false, false, false],
                                        text: 'Company Details',
                                        // fillColor: '#cfe0ff',
                                        fillColor: '#263042',
                                        fontSize: 14,
                                        style: styles.subheader,
                                    }]
                                ]
                            }
                        },
                        { style: 'header',
                            table: {
                                widths:'95%',
                                body: [
                                    [{
                                        border: [false, false, false, false],
                                        text: 'Ship To Details',
                                        // fillColor: '#cfe0ff',
                                        fillColor: '#263042',
                                        fontSize: 14,
                                        style: styles.subheader,
                                    }],
                                ],
                            },
                            margin: [40, 0, 0, 10]
                        },
                        // { stack: [
                        //         { text: 'Company Details', fontSize: 14, style: styles.subheader, fillColor: '#cfe0ff' },
                        //         { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 100, y2: 5, lineWidth: 0.5, lineColor: '#669cff', marginBottom: 5 }] },
                        //     ],
                        // },
                        // { stack: [
                        //         { text: 'Ship To Details', fontSize: 14, style: styles.subheader },
                        //         { canvas: [{
                        //             type: 'line', x1: 0, y1: 5, x2: 100, y2: 5, lineWidth: 0.5, lineColor: '#669cff' }] },
                        //     ],
                        //     margin: [40, 0, 0, 10],
                        // },
                    ],
                },
                // {
                //     columns: [
                //         {canvas: [{ type: 'line', x1: 0, y1: 5, x2: 100, y2: 5, lineWidth: 1 }]},
                //         {canvas: [{ type: 'line', x1: 250, y1: 5, x2: 350, y2: 5, lineWidth: 1 }]},
                //     ],
                // },
                // { columns: [
                //         {
                //             text: `Name : ${currentPO.companyName}\n Address : ${currentPO.companyAddress}`,
                //             style: styles.detailsColumn,
                //         },
                //         {
                //             text: `Name : ${currentPO.vendorName}\n Address : ${currentPO.vendorAddress}`,
                //             style: styles.detailsColumn,
                //             margin: [40, 0, 0, 10],
                //         },
                //     ],
                //     margin: [0, 0, 0, 20],
                // },
                { columns: [
                        {
                            width: 55,
                            text: 'Name : ',
                            bold: true,
                            fontSize: 11,
                        },
                        {
                            width: '*',
                            text: `${currentPO.companyName}`,
                            fontSize: 11,
                        },
                        {
                            width: 50,
                            text: ''
                        },
                        {
                            width: 70,
                            text: 'Name : ',
                            margin: [22, 0, 0, 0],
                            bold: true,
                            fontSize: 11,
                        },
                        {
                            width: '*',
                            text: `${currentPO.vendorName}`,
                            fontSize: 11,
                        },
                    ],
                    margin: [0, 0, 0, 5],
                },
                { columns: [
                        {
                            width: 55,
                            text: 'Address : ',
                            bold: true,
                            fontSize: 11,
                        },
                        {
                            width: '*',
                            text: `${currentPO.companyAddress}`,
                            fontSize: 11,
                        },
                        {
                            width: 50,
                            text: ''
                        },
                        {
                            width: 70,
                            text: 'Address : ',
                            margin: [22, 0, 0, 0],
                            bold: true,
                            fontSize: 11,
                        },
                        {
                            width: '*',
                            text: `${currentPO.vendorAddress}`,
                            fontSize: 11,
                        },
                    ],
                    margin: [0, 0, 0, 20],
                },
                // '\n',
                // {
                //     style: 'tableExample',
                //     color: '#444',
                //     table: {
                //         widths: [200, 'auto', 'auto'],
                //         headerRows: 2,
                //         // keepWithHeaderRows: 1,
                //         body: [
                //             [{text: 'Header with Colspan = 2', style: 'tableHeader', colSpan: 2, alignment: 'center'}, {}, {text: 'Header 3', style: 'tableHeader', alignment: 'center'}],
                //             [{text: 'Header 1', style: 'tableHeader', alignment: 'center'}, {text: 'Header 2', style: 'tableHeader', alignment: 'center'}, {text: 'Header 3', style: 'tableHeader', alignment: 'center'}],
                //             ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                //             [{rowSpan: 3, text: 'rowSpan set to 3\nLorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor'}, 'Sample value 2', 'Sample value 3'],
                //             ['', 'Sample value 2', 'Sample value 3'],
                //             ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                //             ['Sample value 1', {colSpan: 2, rowSpan: 2, text: 'Both:\nrowSpan and colSpan\ncan be defined at the same time'}, ''],
                //             ['Sample value 1', '', ''],
                //         ]
                //     }
                // },
                { table: {
                        headerRows: 1,
                        widths: materialHeaders.map(() => '25%'),
                        body: [materialHeaders, ...items],
                        // body: [materialHeaders, 
                        //     [
                        //         { style: styles.tableData, text: 'data1', alignment: 'center', margin: [5, 5, 5, 5] },
                        //         { style: styles.tableData, text: '20', alignment: 'center', margin: [5, 5, 5, 5] },
                        //         { style: styles.tableData, text: `₹ 333`, alignment: 'center', margin: [5, 5, 5, 5] },
                        //         { style: styles.tableData, text: `₹ 333`, alignment: 'center', margin: [5, 5, 5, 5] }
                        //     ],
                        //     [
                        //         { style: styles.tableData, text: 'data2', alignment: 'center', margin: [5, 5, 5, 5] },
                        //         { style: styles.tableData, text: '40', alignment: 'center', margin: [5, 5, 5, 5] },
                        //         { style: styles.tableData, text: `₹ 444`, alignment: 'center', margin: [5, 5, 5, 5] },
                        //         { style: styles.tableData, text: `₹ 444`, alignment: 'center', margin: [5, 5, 5, 5] }
                        //     ]
                        // ],
                        alignment: "center"
                    },
                    layout: {
                        fillColor: function (i, node) {
                            // return i % 2 === 0 ? '#cfe0ff' : null;
                            return i === 0 ? '#263042' : null;
                        },
                    },
                },
                // { columns : [
                //     { width: '*', text: '' },
                //     { width: 'auto', 
                //         table: {
                //             headerRows: 1,
                //             widths: materialHeaders.map(() => '25%'),
                //             body: [materialHeaders, ...items],
                //             alignment: "center"
                //         },
                //         layout: {
                //             fillColor: function (i, node) {
                //                 return i % 2 === 0 ? '#cfe0ff' : null;
                //             },
                //         },
                //     },
                //     { width: '*', text: '' },
                // ]},
                {
                    unbreakable: true,
                    stack: [
                        {
                            table: {
                                widths: ['50%', '50%'],
                                body: [
                                    [{ text: 'Item Total :', style: styles.tableData }, { text: `₹ ${getIndianMoneyFormat(currentPO.materialAmount)}`, style: styles.tableData }],
                                    [{ text: 'Subtotal :', style: styles.tableData }, { text: `₹ ${getIndianMoneyFormat(currentPO.materialAmount)}`, style: styles.tableData }],
                                    [{ text: 'Item Tax :', style: styles.tableData }, { text: currentPO.materialTax, style: styles.tableData }],
                                    [{ text: 'Total Tax :', style: styles.tableData }, { text: `₹ ${getIndianMoneyFormat(currentPO.totalTax)}`, style: styles.tableData }],
                                    // ['Total Amount:', currentPO.totalAmount],
                                ],
                            },
                            layout: 'noBorders',
                            margin: [300, 20, 0, 0],
                        },
                        { canvas: [{ type: 'line', x1: 298, y1: 5, x2: 595 - 2 * 40, y2: 5, lineWidth: 1 }] },
                        {
                            table: {
                                widths: ['50%', '50%'],
                                body: [
                                    [{ text: 'Total Amount:', style: styles.tableData }, { text: `₹ ${getIndianMoneyFormat(currentPO.totalAmount)}`, style: styles.tableData }],
                                ],
                            },
                            layout: {
                                hLineWidth: function (i, node) {
                                    return (i === 0 || i === node.table.body.length) ? 0 : 2;
                                },
                                vLineWidth: function (i, node) {
                                    return 0;
                                },
                            },
                            margin: [300, 10, 0, 0],
                        },
                    ]
                },
                {
                    text: 'Thank you for your business!',
                    margin: [200, 20, 0, 0],
                },
            ],
            styles: {
                ...styles,
                tableHeader: { ...styles.tableHeader, bold: true },
            },
        };
        
        
        pdfMake.createPdf(documentDefinition).open();
    };

    const downloadPO = () => {
        const input = document.getElementById('po-order');
        const doc = new jsPDF();

        // Set initial position
        let yPosition = 10;

        // Add header
        doc.setFontSize(14);
        // doc.setFont("Helvetica");
        doc.setFont("Times-Roman");

        // doc.setFillColor(191, 184, 255); // RGB color for background
        doc.setFillColor(75, 78, 242); // RGB color for background
        doc.rect(0, 0, 240, 20, 'F'); // Full-width rectangle as background
        // Add text on the top left
        doc.setFontSize(20);
        // doc.setTextColor(255, 255, 255); // Text color (white)
        // doc.setTextColor(75, 78, 242); 
        doc.setTextColor(0, 0, 0);
        
        doc.setFont(undefined, 'bold').text('LOGO', 20, yPosition);
        doc.text('Purchase Order', 150, yPosition).setFont(undefined, 'normal');
        
        doc.setTextColor(0, 0, 0);
        yPosition += 25;
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text(`PO Name: `, 17, yPosition);
        doc.text(`PO Date: `, 17, yPosition + 5);
        doc.text(`Work Start Date: `, 17, yPosition + 10);
        
        doc.setFont(undefined, 'normal');
        doc.text(`${currentPO?.purchaseOrderName}`, 55, yPosition);
        doc.text(`${dayjs(new Date(currentPO?.PODate)).format('DD/MM/YYYY')}`, 55, yPosition + 5);
        doc.text(`${currentPO?.workStartDate ? dayjs(new Date(currentPO?.workStartDate)).format('DD/MM/YYYY') : 'N/A'}`, 55, yPosition + 10);

        doc.setFont(undefined, 'bold');
        doc.text(`PO Number: `, 130, yPosition);
        doc.text(`Delivery Deadline: `, 130, yPosition + 5);
        doc.text(`Work End Date: `, 130, yPosition + 10);
        doc.setFont(undefined, 'normal');
        doc.text(`${currentPO?.purchaseOrderNumber ? currentPO?.purchaseOrderNumber : 'N/A'}`, 170, yPosition);
        doc.text(`${dayjs(new Date(currentPO?.expireDate)).format('DD/MM/YYYY')}`, 170, yPosition + 5);
        doc.text(`${currentPO?.workEndDate ? dayjs(new Date(currentPO?.workEndDate)).format('DD/MM/YYYY') : 'N/A'}`, 170, yPosition + 10);

        // Move the cursor down
        yPosition += 25;

        // Add company details
        // doc.setFillColor(191, 184, 255); // RGB color
        // doc.rect(15, yPosition + 1, 50, -6, 'F'); // Filled rectangle as background
        
        doc.setTextColor(75, 78, 242);
        doc.setFontSize(14);
        doc.text('Company Details', 17, yPosition);
        const textWidth = doc.getStringUnitWidth('Company Details') * 14 / doc.internal.scaleFactor;
        doc.setLineWidth(0.5); // Underline thickness
        doc.line(15, yPosition + 2, 20 + textWidth, yPosition + 2);
        
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        yPosition += 2;
        doc.setFont(undefined, 'bold');
        doc.text(`Name: `, 17, yPosition + 5);
        doc.setFont(undefined, 'normal');
        doc.text(`${currentPO?.companyName}`, 30, yPosition + 5);
        doc.setFont(undefined, 'bold');
        doc.text('Address: ', 17, yPosition + 10);
        doc.setFont(undefined, 'normal');
        let line1 = doc.splitTextToSize(`${currentPO?.companyAddress}`, 30)
        doc.text(line1, 17, yPosition + 15);
        // yPosition += 10;
        // doc.text(lines, 20, yPosition + 5, lines);
        // doc.text('Phone: (123) 456-7890', 20, yPosition + 10);

        // Move the cursor down again
        // yPosition -= 10;

        // Add vendor details
        // doc.setFillColor(191, 184, 255); // RGB color
        // doc.rect(138, yPosition + 1, 50, -6, 'F'); // Filled rectangle as background

        doc.setTextColor(75, 78, 242);
        doc.setFontSize(14);
        doc.text('Ship To Details', 140, yPosition);
        const textWidth1 = doc.getStringUnitWidth('Ship To Details') * 14 / doc.internal.scaleFactor;
        doc.setLineWidth(0.5);
        doc.line(138, yPosition + 2, 145 + textWidth1, yPosition + 2);
        
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        yPosition += 2;
        doc.setFont(undefined, 'bold');
        doc.text(`Name: `, 140, yPosition + 5);
        doc.setFont(undefined, 'normal');
        doc.text(`${currentPO?.vendorName}`, 155, yPosition + 5);
        doc.setFont(undefined, 'bold');
        doc.text(`Address: `, 140, yPosition + 10);
        doc.setFont(undefined, 'normal');
        // let line2 = doc.splitTextToSize(`Address: ${currentPO?.vendorAddress}`, 140)
        let line3 = doc.splitTextToSize(`${currentPO?.vendorAddress}`, 140)
        doc.text(line3, 140, yPosition + 15);
        // doc.text('Phone: (987) 654-3210', 140, yPosition + 15);

        // Move the cursor down again
        yPosition += 30;

        let items = currentPO?.purchaseItems?.map(o => {
            if (o.category === 'material') {
                return [o.description, o.quantity, getIndianMoneyFormat(o.unitOrHourPrice), getIndianMoneyFormat(o.amount)];
            }
        }).filter(d => d !== undefined);

        // items = Array(48).fill(items[0]);

        // Add item list (Table 1)
        doc.autoTable({
            head: [['Description', 'Quantity', 'Unit Price', 'Total']],
            body: items,
            startY: yPosition,
            theme: 'grid',
            headStyles: {
                fillColor: [75, 78, 242],
                textColor: [0, 0, 0],
                cellPadding: 2,
                // rowHeight: 10,
                valign: 'middle',
                halign: 'center',
                // lineWidth: 0.2,
            },
            styles: {
                fontSize: 12,
                // textColor: [44, 62, 80],
                textColor: [0, 0, 0],
                cellPadding: 2,
                // rowHeight: 20,
                valign: 'middle',
                halign: 'center',
                // lineWidth: 0.2,
            },
        });

        // Move the cursor down again
        // debugger
        yPosition = doc.autoTable.previous.finalY + 15;
        // yPosition += 30;

        // Add total amounts
        doc.setFont(undefined, 'bold');
        doc.text(`Item Total: `, 140, yPosition);
        doc.text(`Item Tax: `, 140, yPosition + 5);
        doc.text(`Total Tax: `, 140, yPosition + 10);
        doc.text(`Total: `, 140, yPosition + 17);
        doc.setFont(undefined, 'normal');
        doc.text(`${getIndianMoneyFormat(currentPO?.materialAmount)} Rs.`, 165, yPosition);
        doc.text(`${currentPO?.materialTax}`, 165, yPosition + 5);
        doc.text(`${getIndianMoneyFormat(currentPO?.totalTax)} Rs.`, 165, yPosition + 10);
        const totalTextWidth = doc.getStringUnitWidth('Total Details') * 14 / doc.internal.scaleFactor;
        doc.setLineWidth(0.5); // Underline thickness
        doc.line(138, yPosition + 12, 167 + totalTextWidth, yPosition + 12);
        doc.text(`${getIndianMoneyFormat(currentPO?.totalAmount)} Rs.`, 165, yPosition + 17);

        yPosition += 10;

        // Set the position for the subtotal, tax, and total details
        const detailsPosition = {
        //   x: doc.internal.pageSize.width - 500, // Adjust as needed
          x: doc.internal.pageSize.width - doc.lastAutoTable.finalWidth - 10, // Adjust as needed
          y: doc.internal.pageSize.height - 40, // Adjust as needed
        };
      
        // Create a separate table for displaying details without borders
        const detailsTable = [
          [{ content: `Subtotal: $ 654213`, styles: { cellWidth: 40 } }],
          [{ content: `Tax: $ 54232`, styles: { cellWidth: 40 } }],
          [{ content: `Total: $ 7212332`, styles: { cellWidth: 40 } }],
        ];
      
        // doc.autoTable({
        //   theme: 'plain', // Use 'plain' theme for no borders
        //   body: detailsTable,
        //   startY: detailsPosition.y,
        //   startX: detailsPosition.x,
        //   styles: { cellPadding: 2, fontSize: 10 },
        // });

        // Save the PDF
        doc.save(`${currentPO?.purchaseOrderName}-po.pdf`);
    }

    return (
        <div id='po-order'>
            <Row justify='space-between' align='middle'>
                <Col><h2>Purchase Order</h2></Col>
                <Col xl={3} lg={3} md={3}>
                    {/* <DownloadOutlined className='appIcon' onClick={() => downloadPOWithPdfmake()} /> */}
                    <DownloadOutlined className='appIcon' onClick={() => downloadInvoicePDF(currentPO, 'purchase')} />
                    {/* <DownloadOutlined className='appIcon' onClick={() => downloadPO()} /> */}
                    <CloseOutlined className='appIcon' onClick={() => handleReviewModalClose()} />
                </Col>
            </Row>
            <Row className='poDetailHeader'>
                <Col xl={11} lg={11} md={11} sm={11} xs={11}>
                    <Row>
                        <Col xl={11} lg={11} md={11} sm={11} xs={11}>PO Name: </Col>
                        <Col>{currentPO?.purchaseOrderName??'-'}</Col>
                    </Row>
                </Col>
                <Col xl={11} lg={11} md={11} sm={11} xs={11}>
                    <Row>
                        <Col xl={11} lg={11} md={11} sm={11} xs={11}>PO Number: </Col>
                        <Col>{currentPO?.purchaseOrderNumber ? currentPO?.purchaseOrderNumber:'N/A'}</Col>
                    </Row>
                </Col>
                <Col xl={11} lg={11} md={11} sm={11} xs={11}>
                    <Row>
                        <Col xl={11} lg={11} md={11} sm={11} xs={11}>PO Date: </Col>
                        <Col>{new Date(currentPO?.createdAt).toDateString()}</Col>
                    </Row>
                </Col>
                <Col xl={11} lg={11} md={11} sm={11} xs={11}>
                    <Row>
                        <Col xl={11} lg={11} md={11} sm={11} xs={11}>Delivery Deadline: </Col>
                        <Col>{new Date(currentPO?.expireDate).toDateString()}</Col>
                    </Row>
                </Col>
                <Col xl={11} lg={11} md={11} sm={11} xs={11}>
                    <Row>
                        <Col xl={11} lg={11} md={11} sm={11} xs={11}>Work Start Date: </Col>
                        <Col>{currentPO?.workStartDate ? new Date(currentPO?.workStartDate).toDateString() : 'N/A'}</Col>
                    </Row>
                </Col>
                <Col xl={11} lg={11} md={11} sm={11} xs={11}>
                    <Row>
                        <Col xl={11} lg={11} md={11} sm={11} xs={11}>Work End Date: </Col>
                        <Col>{currentPO?.workEndDate ? new Date(currentPO?.workEndDate).toDateString() : 'N/A'}</Col>
                    </Row>
                </Col>
                {/* <div>
                    <p>PO Name: {currentPO?.purchaseOrderName??'-'}</p>
                    <p>PO Number: {currentPO?.purchaseOrderNumber ? currentPO?.purchaseOrderNumber:'-'}</p>
                    <p>PO Date: {new Date(currentPO?.createdAt).toDateString()}</p>
                </div> */}
                {/* <div>
                    <p>Delivery Deadline: {new Date(currentPO?.expireDate).toDateString()}</p>
                    <p>Work Start Date: {currentPO?.workStartDate ? new Date(currentPO?.workStartDate).toDateString() : '-'}</p>
                    <p>Work End Date: {currentPO?.workEndDate ? new Date(currentPO?.workEndDate).toDateString() : '-'}</p>
                </div> */}
            </Row>
            <div className='poDetailHeader'>
                <div>
                    <h3>Company Details</h3>
                    <p>Company: {currentPO?.companyName}</p>
                    <p>Address: {currentPO?.companyAddress}</p>
                </div>
                <div>
                    <h3>Ship to Details</h3>
                    <p>Vendor: {currentPO?.vendorName}</p>
                    <p>Address: {currentPO?.vendorAddress}</p>
                </div>
            </div>
            <div className='itemDetailTable'>
                <Table
                    dataSource={currentPO?.purchaseItems ?? []}
                    columns={columns}
                    size='small'
                    // style={{ height: '200px' }}
                    scroll={{ y: 200 }}
                    pagination={false}
                    // scroll={{ x: 700 }}
                    footer={() => <TableFooter totalAmount={totalAmount} record={currentPO} />}
                />
            </div>
        </div>
    )
}

export default POReviewModal;