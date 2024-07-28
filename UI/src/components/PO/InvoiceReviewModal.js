import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AppButton from '../AppButton';
import { Alert, Badge, Col, Drawer, Modal, Row, Table, Typography, message } from 'antd';
import { CloseOutlined, DownloadOutlined, LeftOutlined } from '@ant-design/icons';
import { getIndianMoneyFormat } from '../../helper';
import jsPDF from 'jspdf';
import dayjs from 'dayjs';
import { downloadInvoicePDF } from './createPDF';
// import latoFont from '../../fonts/Lato-Regular.ttf';

export const TableFooter = ({ totalAmount, record }) => {
    return (
        <Row justify='end' className='tableFooter'>
            <Col xl={8} lg={8} md={8} sm={8} xs={8}>
                {/* <Row justify='start'>
                    <Col xl={12} lg={12} md={12} style={{ margin: '0 4%' }}>Amount Paid: </Col>
                    <Col>₹ {getIndianMoneyFormat(record?.amountPaid ? record?.amountPaid : 0)}</Col>
                </Row> */}
                <Row justify='start'>
                    <Col xl={12} lg={12} md={12} style={{ margin: '0 4%' }}>Material Total: </Col>
                    <Col>₹ {getIndianMoneyFormat(record?.materialAmount)}</Col>
                </Row>
                <Row justify='start'>
                    <Col xl={12} lg={12} md={12} style={{ margin: '0 4%' }}>Labor Total: </Col>
                    <Col>₹ {getIndianMoneyFormat(record?.laborAmount)}</Col>
                </Row>
                <Row justify='start'>
                    <Col xl={12} lg={12} md={12} style={{ margin: '0 4%' }}>Material Tax: </Col>
                    <Col>{record?.materialTax}</Col>
                </Row>
                <Row justify='start'>
                    <Col xl={12} lg={12} md={12} style={{ margin: '0 4%' }}>Labor Tax: </Col>
                    <Col>{record?.laborTax}</Col>
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

const InvoiceReviewModal = ({
    currentSI,
    handleReviewModalClose
}) => {

    const location = useLocation();
    const navigate = useNavigate();
    const confirm = Modal.confirm;
    const { Paragraph } = Typography;
    const [allCurrPOItems, setAllCurrPOItems] = useState([]);
    const [totalAmount, setTotalAmount] = useState('0');

    useEffect(() => {
        if (currentSI && currentSI?.purchaseItems?.length > 0) {
            calculateTotalAmount();
        }
    }, [JSON.stringify(currentSI)]);

    const itemColumns = [
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

    const laborColumns = [
        {
            title: 'Labor',
            dataIndex: 'description',
            key: 'description',
            render: (val) => <div>{val}</div>
        },
        {
            title: 'Hours',
            dataIndex: 'hours',
            key: 'hours',
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

    const calculateTotalAmount = () => {
        let temp = 0;
        // allCurrPOItems.forEach(o => {
        currentSI?.purchaseItems?.forEach(o => {
            temp += parseFloat(o.amount);
        });
        setTotalAmount(temp.toString());
    };

    const downloadInvoice = () => {
        const doc = new jsPDF();

        // doc.printHeaderRow = true;
        // doc.addFileToVFS('lato_regular.ttf', latoFont);
        // doc.addFont('lato_regular.ttf', 'lato', 'normal');

        // Set initial position
        let yPosition = 10;

        // Add header
        doc.setFontSize(14);
        doc.setFont("Times-Roman");
        doc.setFont(undefined, 'bold').text('LOGO', 20, yPosition);
        doc.text('Sale Invoice', 150, yPosition).setFont(undefined, 'normal');

        // Move the cursor down
        yPosition += 25;
        doc.setFontSize(12);
        doc.text(`Invoice Number: `, 17, yPosition);
        doc.text(`Issue Date: `, 17, yPosition + 5);
        doc.text(`Work End Date: `, 17, yPosition + 10);
        doc.text(`${currentSI?.saleInvoiceNumber ? currentSI?.saleInvoiceNumber : 'N/A'}`, 55, yPosition);
        doc.text(`${dayjs(new Date(currentSI?.expireDate)).format('DD/MM/YYYY')}`, 55, yPosition + 5);
        doc.text(`${currentSI?.workEndDate ? dayjs(new Date(currentSI?.workEndDate)).format('DD/MM/YYYY') : 'N/A'}`, 55, yPosition + 10);

        doc.text(`Invoice Date: `, 130, yPosition);
        doc.text(`Work Start Date: `, 130, yPosition + 5);
        doc.text(`${dayjs(new Date(currentSI?.invoiceDate)).format('DD/MM/YYYY')}`, 170, yPosition);
        doc.text(`${currentSI?.workStartDate ? dayjs(new Date(currentSI?.workStartDate)).format('DD/MM/YYYY') : 'N/A'}`, 170, yPosition + 5);

        yPosition += 25;

        // Add company details
        doc.setFillColor(118,181,197); // RGB color
        doc.rect(15, yPosition + 1, 50, -6, 'F'); // Filled rectangle as background
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(14);
        // doc.setFillColor('lightblue');
        doc.text('Company Details ', 17, yPosition);
        doc.setFontSize(12);
        yPosition += 1;
        // doc.rect(100, 20, 10, 10, 'F').text('Company Details ', 20, yPosition);
        doc.text(`Name: ${currentSI?.companyName}`, 17, yPosition + 5);
        // doc.text('Address: 456 Business St, Citytown', 20, yPosition + 5);
        let line1 = doc.splitTextToSize(`Address: ${currentSI?.companyAddress}`, 30)
        doc.text(line1, 17, yPosition + 10);
        // yPosition += 10;
        // doc.text(lines, 20, yPosition + 5, lines);
        // doc.text('Phone: (123) 456-7890', 20, yPosition + 10);

        // Move the cursor down again
        // yPosition -= 10;

        // Add vendor details
        doc.setFillColor(118,181,197); // RGB color
        doc.rect(138, yPosition + 1, 50, -6, 'F'); // Filled rectangle as background
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(14);
        // doc.setFillColor('lightblue').text('Ship To Details', 140, yPosition);
        doc.text('Ship To Details', 140, yPosition);
        doc.setFontSize(12);
        yPosition += 1;
        doc.text(`Name: ${currentSI?.contractorName}`, 140, yPosition + 5);
        // doc.text(`Address: ${currentSI?.vendorAddress}`, 140, yPosition + 10);
        let line2 = doc.splitTextToSize(`Address: ${currentSI?.contractorAddress}`, 140)
        doc.text(line2, 140, yPosition + 10);
        // doc.text('Phone: (987) 654-3210', 140, yPosition + 15);

        // Move the cursor down again
        yPosition += 30;

        let items = currentSI?.saleItems?.map(o => {
            if (o.category === 'material') {
                return [o.description, o.quantity, getIndianMoneyFormat(o.unitOrHourPrice), getIndianMoneyFormat(o.amount)];
            }
        }).filter(d => d !== undefined);
        let labours = currentSI?.saleItems?.map(o => {
            if (o.category === 'labor') {
                return [o.description, o.hours, getIndianMoneyFormat(o.unitOrHourPrice), getIndianMoneyFormat(o.amount)];
            }
        }).filter(d => d !== undefined);

        // Add item list (Table 1)
        doc.autoTable({
        head: [['Description', 'Quantity', 'Unit Price', 'Total']],
        body: items,
        startY: yPosition,
        });

        // Move the cursor down again
        // yPosition += doc.autoTable.previous.finalY + 10;
        yPosition += 30;

        // Add additional table (Table 2)
        doc.autoTable({
        head: [['Labor', 'Hours', 'Rate', 'Total']],
        body: labours,
        startY: yPosition,
        });

        // Move the cursor down again
        yPosition = doc.autoTable.previous.finalY + 20;

        // Add total amounts
        // doc.setCharSpace(0.4).text(`Item Total: ${<p>&#8377; {getIndianMoneyFormat(currentSI?.materialAmount)}</p>}`, 150, yPosition);
        // doc.add
        // doc.setFont('lato').text(`Item Total: ₹ ${getIndianMoneyFormat(currentSI?.materialAmount)}`, 150, yPosition);
        doc.text(`Item Total: `, 140, yPosition);
        doc.text(`Labor Total: `, 140, yPosition + 5);
        doc.text(`Item Tax: `, 140, yPosition + 10);
        doc.text(`Labor Tax: `, 140, yPosition + 15);
        doc.text(`Total Tax: `, 140, yPosition + 20);
        doc.text(`Total: `, 140, yPosition + 25);
        doc.text(`${getIndianMoneyFormat(currentSI?.materialAmount)} Rs.`, 165, yPosition);
        doc.text(`${getIndianMoneyFormat(currentSI?.laborAmount)} Rs.`, 165, yPosition + 5);
        doc.text(`${currentSI?.materialTax}`, 165, yPosition + 10);
        doc.text(`${currentSI?.laborTax}`, 165, yPosition + 15);
        doc.text(`${getIndianMoneyFormat(currentSI?.totalTax)} Rs.`, 165, yPosition + 20);
        doc.text(`${getIndianMoneyFormat(currentSI?.totalAmount)} Rs.`, 165, yPosition + 25);

        doc.save(`invoice-${dayjs(new Date(currentSI?.invoiceDate)).format('DD/MM/YYYY')}.pdf`);
    };

    return (
        <div>
            <Row justify='space-between' align='middle'>
                <Col><h2>Sale Invoice</h2></Col>
                <Col xl={3} lg={3} md={3}>
                    {/* <DownloadOutlined className='appIcon' onClick={() => downloadInvoice()} /> */}
                    <DownloadOutlined className='appIcon' onClick={() => downloadInvoicePDF(currentSI, 'sale')} />
                    <CloseOutlined className='appIcon' onClick={handleReviewModalClose} />
                </Col>
            </Row>
            <Row className='poDetailHeader'>
                {/* <Col xl={11} lg={11} md={11} sm={11} xs={11}>
                    <Row>
                        <Col xl={11} lg={11} md={11} sm={11} xs={11}>Invoice Name: </Col>
                        <Col>{currentSI?.saleInvoiceName??'-'}</Col>
                    </Row>
                </Col> */}
                <Col xl={11} lg={11} md={11} sm={11} xs={11}>
                    <Row>
                        <Col xl={11} lg={11} md={11} sm={11} xs={11}>Invoice Number: </Col>
                        <Col>{currentSI?.saleInvoiceNumber ? currentSI?.saleInvoiceNumber:'N/A'}</Col>
                    </Row>
                </Col>
                <Col xl={11} lg={11} md={11} sm={11} xs={11}>
                    <Row>
                        <Col xl={11} lg={11} md={11} sm={11} xs={11}>Invoice Date: </Col>
                        <Col>{new Date(currentSI?.invoiceDate).toDateString()}</Col>
                    </Row>
                </Col>
                <Col xl={11} lg={11} md={11} sm={11} xs={11}>
                    <Row>
                        <Col xl={11} lg={11} md={11} sm={11} xs={11}>Issue Date: </Col>
                        <Col>{new Date(currentSI?.expireDate).toDateString()}</Col>
                    </Row>
                </Col>
                <Col xl={11} lg={11} md={11} sm={11} xs={11}>
                    <Row>
                        <Col xl={11} lg={11} md={11} sm={11} xs={11}>Work Start Date: </Col>
                        <Col>{currentSI?.workStartDate ? new Date(currentSI?.workStartDate).toDateString() : 'N/A'}</Col>
                    </Row>
                </Col>
                <Col xl={11} lg={11} md={11} sm={11} xs={11}>
                    <Row>
                        <Col xl={11} lg={11} md={11} sm={11} xs={11}>Work End Date: </Col>
                        <Col>{currentSI?.workEndDate ? new Date(currentSI?.workEndDate).toDateString() : 'N/A'}</Col>
                    </Row>
                </Col>
            </Row>
            <div className='poDetailHeader'>
                <div className='insideDetailDiv'>
                    <h3>Seller Details</h3>
                    <p>Vendor: {currentSI?.contractorName}</p>
                    {/* <p>Address: {currentSI?.contractorAddress}</p> */}
                    <p>Address:</p>
                    <p>{currentSI?.contractorAddress}</p>
                </div>
                <div className='insideDetailDiv'>
                    <h3>Company Details</h3>
                    <p>Company: {currentSI?.companyName}</p>
                    <p>Address: </p>
                    <p>{currentSI?.companyAddress}</p>
                </div>
            </div>
            <div className='itemDetailTable'>
                <Table
                    dataSource={currentSI?.saleItems?.filter(o => o.category === 'material') ?? []}
                    columns={itemColumns}
                    size='small'
                    // style={{ height: '200px' }}
                    scroll={{ y: 200 }}
                    pagination={false}
                    // scroll={{ x: 700 }}
                    // footer={() => <TableFooter totalAmount={totalAmount} record={currentSI} />}
                />
            </div>
            <div className='itemDetailTable'>
                <Table
                    dataSource={currentSI?.saleItems?.filter(o => o.category === 'labor') ?? []}
                    columns={laborColumns}
                    size='small'
                    // style={{ height: '200px' }}
                    scroll={{ y: 200 }}
                    pagination={false}
                    // scroll={{ x: 700 }}
                    footer={() => <TableFooter totalAmount={totalAmount} record={currentSI} />}
                />
            </div>
        </div>
    )
}

export default InvoiceReviewModal;