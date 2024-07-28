import { css } from '@emotion/react';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { getIndianMoneyFormat } from '../../helper';

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
        fontSize: 11,
        // lineHeight: 1.5,
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

export const downloadInvoicePDF = (currData, type) => {

    let materialHeaders = ['Description', 'Quantity', 'Unit Rate', 'Amount'];
    let laborHeaders = ['Labor', 'Hours', 'Unit Rate', 'Amount'];

    materialHeaders = materialHeaders.map(o => {
        return { text: o, alignment: 'center', style: styles.tableHeader, bold: true, margin: [3, 3, 3, 3] }
    });

    laborHeaders = laborHeaders.map(o => {
        return { text: o, alignment: 'center', style: styles.tableHeader, bold: true, margin: [3, 3, 3, 3] }
    });

    let currItemList = (type === 'purchase') ? currData?.purchaseItems : (type === 'sale') ? currData?.saleItems : [];

    let matItems = currItemList?.map(o => {
        if (o.category === 'material') {
            return [
                { style: styles.tableData, text: o.description, alignment: 'center' },
                { style: styles.tableData, text: o.quantity, alignment: 'center' },
                { style: styles.tableData, text: `₹ ${getIndianMoneyFormat(o.unitOrHourPrice)}`, alignment: 'center' },
                { style: styles.tableData, text: `₹ ${getIndianMoneyFormat(o.amount)}`, alignment: 'center' }
            ];
        }
    }).filter(d => d !== undefined);

    let laborItems = currItemList?.map(o => {
        if (o.category === 'labor') {
            return [
                { style: styles.tableData, text: o.description, alignment: 'center' },
                { style: styles.tableData, text: o.hours, alignment: 'center' },
                { style: styles.tableData, text: `₹ ${getIndianMoneyFormat(o.unitOrHourPrice)}`, alignment: 'center' },
                { style: styles.tableData, text: `₹ ${getIndianMoneyFormat(o.amount)}`, alignment: 'center' }
            ];
        }
    }).filter(d => d !== undefined);

    let initialContent, tableList, subTotalTableBody = [];

    if (type === 'purchase') {
        initialContent = [
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
                            { text: currData?.purchaseOrderName, fontSize: 10 },
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
                            { text: currData?.purchaseOrderNumber ? currData?.purchaseOrderNumber : 'N/A', fontSize: 10 },
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
                            { text: new Date(currData?.PODate).toDateString(), fontSize: 10 },
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
                            { text: new Date(currData?.expireDate).toDateString(), fontSize: 10 },
                            { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 100, y2: 5, lineWidth: 0.5 }] },
                        ],
                    },
                ]
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
                            { text: currData?.workStartDate ? new Date(currData?.workStartDate).toDateString() : 'N/A', fontSize: 10 },
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
                            { text: currData?.workEndDate ? new Date(currData?.workEndDate).toDateString() : 'N/A', fontSize: 10 },
                            { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 100, y2: 5, lineWidth: 0.5 }] },
                        ],
                    },
                ],
            },
        ];

        tableList = [
            {
                table: {
                    headerRows: 1,
                    widths: materialHeaders.map(() => '25%'),
                    body: [materialHeaders, ...matItems],
                    alignment: "center"
                },
                layout: {
                    fillColor: function (i, node) {
                        // return i % 2 === 0 ? '#cfe0ff' : null;
                        return i === 0 ? '#263042' : null;
                    },
                },
            }
        ];

        subTotalTableBody = [
            [{ text: 'Item Total :', style: styles.tableData }, { text: `₹ ${getIndianMoneyFormat(currData?.materialAmount)}`, style: styles.tableData }],
            [{ text: 'Subtotal :', style: styles.tableData }, { text: `₹ ${getIndianMoneyFormat(currData?.materialAmount)}`, style: styles.tableData }],
            [{ text: 'Item Tax :', style: styles.tableData }, { text: currData?.materialTax, style: styles.tableData }],
            [{ text: 'Total Tax :', style: styles.tableData }, { text: `₹ ${getIndianMoneyFormat(currData?.totalTax)}`, style: styles.tableData }]
        ];
    }

    if (type === 'sale') {
        initialContent = [
            '\n\n',
            {
                columns: [
                    {
                        fontSize: 10,
                        text: 'Invoice Number :',
                        bold: true
                    },
                    {
                        stack: [
                            { text: currData?.saleInvoiceNumber ? currData?.saleInvoiceNumber : 'N/A', fontSize: 10 },
                            { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 100, y2: 5, lineWidth: 0.5 }] },
                        ],
                    },
                    {
                        width: 50,
                        text: ''
                    },
                    {
                        fontSize: 10,
                        text: 'Invoice Date :',
                        bold: true
                    },
                    {
                        stack: [
                            { text: new Date(currData?.invoiceDate).toDateString(), fontSize: 10 },
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
                        text: 'Issue Date :',
                        bold: true
                    },
                    {
                        stack: [
                            { text: new Date(currData?.expireDate).toDateString(), fontSize: 10 },
                            { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 100, y2: 5, lineWidth: 0.5 }] },
                        ],
                    },
                    {
                        width: 50,
                        text: ''
                    },
                    {
                        fontSize: 10,
                        text: 'Work Start Date :',
                        bold: true
                    },
                    {
                        stack: [
                            { text: currData?.workStartDate ? new Date(currData?.workStartDate).toDateString() : 'N/A', fontSize: 10 },
                            { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 100, y2: 5, lineWidth: 0.5 }] },
                        ],
                    },
                ]
            },
            '\n',
            {
                columns: [
                    {
                        fontSize: 10,
                        text: 'Work End Date:',
                        bold: true,
                        fillColor: 'red'
                    },
                    {
                        stack: [
                            { text: currData?.workEndDate ? new Date(currData?.workEndDate).toDateString() : 'N/A', fontSize: 10 },
                            { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 100, y2: 5, lineWidth: 0.5 }] },
                        ],
                    },
                    {
                        width: 50,
                        text: ''
                    },
                    {},
                    {}
                ],
            }
        ];

        tableList = [
            {
                table: {
                    headerRows: 1,
                    widths: materialHeaders.map(() => '25%'),
                    body: [materialHeaders, ...matItems],
                    alignment: "center"
                },
                layout: {
                    fillColor: function (i, node) {
                        // return i % 2 === 0 ? '#cfe0ff' : null;
                        return i === 0 ? '#263042' : null;
                    },
                },
            },
            '\n\n',
            {
                table: {
                    headerRows: 1,
                    widths: laborHeaders.map(() => '25%'),
                    body: [laborHeaders, ...laborItems],
                    alignment: "center"
                },
                layout: {
                    fillColor: function (i, node) {
                        // return i % 2 === 0 ? '#cfe0ff' : null;
                        return i === 0 ? '#263042' : null;
                    },
                },
            }
        ];

        subTotalTableBody = [
            [{ text: 'Item Total :', style: styles.tableData }, { text: `₹ ${getIndianMoneyFormat(currData?.materialAmount)}`, style: styles.tableData }],
            [{ text: 'Labor Total :', style: styles.tableData }, { text: `₹ ${getIndianMoneyFormat(currData?.laborAmount)}`, style: styles.tableData }],
            [{ text: 'Subtotal :', style: styles.tableData }, { text: `₹ ${getIndianMoneyFormat(Number(currData?.materialAmount) + Number(currData?.laborAmount))}`, style: styles.tableData }],
            [{ text: 'Item Tax :', style: styles.tableData }, { text: currData?.materialTax, style: styles.tableData }],
            [{ text: 'Labor Tax :', style: styles.tableData }, { text: currData?.laborTax, style: styles.tableData }],
            [{ text: 'Total Tax :', style: styles.tableData }, { text: `₹ ${getIndianMoneyFormat(currData?.totalTax)}`, style: styles.tableData }],
        ];
    };

    const documentDefinition = {
        header: {
            table: {
                headerRows: 0,
                widths: ['50%', '50%'],
                body: [
                    [
                        { text: 'LOGO', style: styles.mainHeader, bold: true, alignment: 'left', margin: [65, 10, 0, 10] },
                        { text: `${(type === 'purchase') ? 'Purchase Order' : (type === 'sale') ? 'Sale Invoice' : 'Invoice'}`, style: styles.mainHeader, alignment: 'right', margin: [0, 10, 65, 10] },
                    ],
                ],
            },
            layout: 'noBorders',
            absolutePosition: { x: 0, y: 0 },
            // fillColor: '#cfe0ff',
            // fillColor: '#263042',
        },
        // footer: {
        //     columns: [ 
        //         '',
        //         { 
        //             alignment: 'center',
        //             text: 'Thank you for your business!'
        //         }
        //     ],
        //     margin: [10, 0]
        // },
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
        pageMargins: [40, 60, 40, 60],
        pageBreakBefore: function(currentNode, followingNodesOnPage, nodesOnNextPage, previousNodesOnPage) {
            return currentNode.headlineLevel === 1 && followingNodesOnPage.length === 0;
        },
        content: [
            ...initialContent,
            '\n\n',
            {
                columns: [
                    {
                        style: 'header',
                        table: {
                            widths: '85%',
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
                    {
                        style: 'header',
                        table: {
                            widths: '95%',
                            body: [
                                [{
                                    border: [false, false, false, false],
                                    text: `${(type === 'sale') ? 'Contractor Details' : 'Ship To Details'}`,
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
            //             text: `Name : ${currData.companyName}\n Address : ${currData.companyAddress}`,
            //             style: styles.detailsColumn,
            //         },
            //         {
            //             text: `Name : ${currData.vendorName}\n Address : ${currData.vendorAddress}`,
            //             style: styles.detailsColumn,
            //             margin: [40, 0, 0, 10],
            //         },
            //     ],
            //     margin: [0, 0, 0, 20],
            // },
            {
                columns: [
                    {
                        width: 55,
                        text: 'Name : ',
                        bold: true,
                        fontSize: 11,
                    },
                    {
                        width: '*',
                        text: `${currData.companyName}`,
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
                        text: `${(type === 'sale') ? currData?.contractorName : currData?.vendorName}`,
                        fontSize: 11,
                    },
                ],
                margin: [0, 0, 0, 5],
            },
            {
                columns: [
                    {
                        width: 55,
                        text: 'Address : ',
                        bold: true,
                        fontSize: 11,
                    },
                    {
                        width: '*',
                        text: `${currData.companyAddress}`,
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
                        text: `${(type === 'sale') ? currData?.contractorAddress : currData?.vendorAddress}`,
                        fontSize: 11,
                    },
                ],
                margin: [0, 0, 0, 20],
            },
            // '\n',
            // {
            //     table: {
            //         headerRows: 1,
            //         widths: materialHeaders.map(() => '25%'),
            //         body: [materialHeaders, ...matItems],
            //         alignment: "center"
            //     },
            //     layout: {
            //         fillColor: function (i, node) {
            //             // return i % 2 === 0 ? '#cfe0ff' : null;
            //             return i === 0 ? '#263042' : null;
            //         },
            //     },
            // },
            ...tableList,
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
                    // ...tableList,
                    {
                        style: 'header',
                        table: {
                            widths: '95%',
                            body: [
                                [{
                                    border: [false, false, false, false],
                                    text: `${(type === 'sale') ? 'Invoice Summary' : 'Order Summary'}`,
                                    fillColor: '#263042',
                                    fontSize: 14,
                                    style: styles.subheader,
                                }],
                            ],
                        },
                        margin: [290, 10, 0, 0]
                    },
                    {
                        table: {
                            widths: ['50%', '50%'],
                            body: [
                                // [{ text: 'Item Total :', style: styles.tableData }, { text: `₹ ${getIndianMoneyFormat(currData.materialAmount)}`, style: styles.tableData }],
                                // [{ text: 'Subtotal :', style: styles.tableData }, { text: `₹ ${getIndianMoneyFormat(currData.materialAmount)}`, style: styles.tableData }],
                                // [{ text: 'Item Tax :', style: styles.tableData }, { text: currData.materialTax, style: styles.tableData }],
                                // [{ text: 'Total Tax :', style: styles.tableData }, { text: `₹ ${getIndianMoneyFormat(currData.totalTax)}`, style: styles.tableData }],
                                ...subTotalTableBody
                                // ['Total Amount:', currData.totalAmount],
                            ],
                        },
                        layout: 'noBorders',
                        margin: [300, 15, 0, 0],
                    },
                    { canvas: [{ type: 'line', x1: 298, y1: 5, x2: 595 - 2 * 40, y2: 5, lineWidth: 1 }] },
                    {
                        table: {
                            widths: ['50%', '50%'],
                            body: [
                                [{ text: 'Total Amount:', style: styles.tableData }, { text: `₹ ${getIndianMoneyFormat(currData?.totalAmount)}`, style: styles.tableData }],
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
                        margin: [298, 10, 0, 0],
                    },
                ]
            },
            {
                text: '* Thank you for your business! *',
                margin: [150, 40, 0, 0],
                bold: true
            },
        ],
        styles: {
            ...styles,
            tableHeader: { ...styles.tableHeader, bold: true },
        },
    };


    pdfMake.createPdf(documentDefinition).open();
};