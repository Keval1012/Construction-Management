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

        // doc.autoTable();
        const bottomDetailsData = [
            ['Payment Method', 'Credit Card'],
            // ['Due Date', '2023-02-01'],
            ['Thank you for your business!', ''],
        ];
      
        // Add bottom details table without borders
        const rightMargin = 140; // Adjust the right margin as needed
        // const rightTableStartX = leftTableStartX + leftTableWidth + rightMargin;
        const rightTableStartX = rightMargin;

        let wantedTableWidth = 50;
        let pageWidth = doc.internal.pageSize.width;
        let margin = (pageWidth - wantedTableWidth) / 2;

        // Draw borders around the subtotal lines
        // doc.setDrawColor(44, 62, 80); // Border color (dark gray)
        // doc.setLineWidth(0.5); // Border thickness
        // doc.line(rightTableStartX, yPosition, rightTableStartX, yPosition + 60); // Vertical line for Subtotal
        // doc.line(rightTableStartX, yPosition, 210, yPosition); // Horizontal line above Subtotal
        // doc.line(rightTableStartX, yPosition + 20, 210, yPosition + 20);
    
        // Add total amounts using autoTable without borders
        const totalAmountsData = [
            [{ content: 'Subtotal:', colSpan: 2, styles: { halign: 'left' } }, '', '$59.00'],
            [{ content: 'Tax (10%):', colSpan: 2, styles: { halign: 'left' } }, '', '$5.90'],
            [{ content: 'Total:', colSpan: 2, styles: { halign: 'left' } }, '', '$64.90'],
          ];

        // doc.autoTable({
        //     // head: [['Name', 'Country']],
        //     // body: [
        //     //     ['Leon', 'Sweden'],
        //     //     ['Magnus', 'Norway'],
        //     //     ['Juan', 'Argentina'],
        //     // ],
        //     body: totalAmountsData,
        //     margin: {left: margin, right: margin},
        //     theme: 'plain', // Use plain theme for no borders
        //     styles: {
        //         fontSize: 10, // Reduced font size
        //         textColor: [44, 62, 80],
        //         cellPadding: 2,
        //         rowHeight: 10,
        //         valign: 'middle',
        //         halign: 'left', // Align to the left for total amounts
        //         lineWidth: 0, // Set line width for borders
        //     },
        // });
    
        // // Add total amounts table using autoTable without borders
        // doc.autoTable({
        //   body: totalAmountsData,
        //   startY: yPosition + 5, // Adjust startY to align with the borders
        //   theme: 'plain', // Use plain theme for no borders
        //   styles: {
        //     fontSize: 10, // Reduced font size
        //     textColor: [44, 62, 80],
        //     cellPadding: 2,
        //     rowHeight: 15,
        //     valign: 'middle',
        //     halign: 'left', // Align to the left for total amounts
        //     lineWidth: 0.2, // Set line width for borders
        //   },
        // });

        // Save the PDF
        doc.save(`${currentPO?.purchaseOrderName}-po.pdf`);
        // html2canvas(input)
        //     .then((canvas) => {
        //         const imgData = canvas.toDataURL('image/png');
        //         const pdf = new jsPDF();
        //         pdf.autoTable({html: '#my-table'});

        //         // Or JavaScript:
        //         pdf.autoTable({
        //             head: [['Name', 'Email', 'Country']],
        //             body: [
        //                 ['David', 'david@example.com', 'Sweden'],
        //                 ['Castille', 'castille@example.com', 'Norway'],
        //             ],
        //             columnStyles: { europe: { halign: 'center' } },
        //             startY: 35,
        //         });

        //         pdf.addImage(imgData, 'JPEG', 0, 0);
        //         pdf.save(`${currentPO?.name}.pdf`);
        //     })
    }

    return (
        <div id='po-order'>
            <Row justify='space-between' align='middle'>
                <Col><h2>Purchase Order</h2></Col>
                <Col xl={3} lg={3} md={3}>
                    <DownloadOutlined className='appIcon' onClick={() => downloadPO()} />
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