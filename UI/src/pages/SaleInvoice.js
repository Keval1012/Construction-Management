import { Col, Modal, Row, message } from 'antd';
import React, { useEffect, useState } from 'react';
import AppButton from '../components/AppButton';
import Collapsible from '../components/Collapsible';
import AppTable from '../components/AppTable';
import FilterBox from '../components/FilterBox';
import { deleteSaleInvoice, getSaleInvoice } from '../API/Api';
import { useNavigate } from 'react-router-dom';
import '../styles/invoice.css';
import dayjs from 'dayjs';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { getIndianMoneyFormat } from '../helper';
import AppModal from '../components/AppModal';
import InvoiceReviewModal from '../components/PO/InvoiceReviewModal';

const SaleInvoice = ({ defaultProject }) => {

    const navigate = useNavigate();
    const [saleInvoiceModalOpen, setSaleInvoiceModalOpen] = useState(false);
    const [defaultSaleInvoice, setDefaultSaleInvoice] = useState(null);
    const [isEditSaleInvoice, setIsEditSaleInvoice] = useState(false);
    const [pageCount, setPageCount] = useState(5);
    const [currentPage, setCurrentPage] = useState(0);
    const [paginationTotal, setPaginationTotal] = useState(0);
    const [skipCount, setSkipCount] = useState(0);
    const [filterInputValue, setFilterInputValue] = useState('');
    const [saleInvoiceList, setSaleInvoiceList] = useState([]);
    const [SIReviewModalOpen, setSIReviewModalOpen] = useState(false);

    const initialColumns = [
        {
            key: "saleInvoiceNumber",
            title: "Invoice No.",
            dataIndex: "saleInvoiceNumber",
            // filters: data.map(o => ({ text: o.name, value: o.key })),
            // onFilter: (value, record) => record.name.indexOf(value) === 0,
            sorter: false,
            fixed: 'left',
            render: (val) => val ? <div>{val}</div> : <div>-</div>
        },
        {
            key: "contractorName",
            title: "Contractor Name",
            dataIndex: "contractorName",
            sorter: false,
            render: (val) => val ? <div>{val}</div> : <div>-</div>
        },
        {
            key: "invoiceDate",
            title: "Invoice Dt.",
            dataIndex: "invoiceDate",
            // filters: data.map(o => ({ text: o.name, value: o.key })),
            // onFilter: (value, record) => record.name.indexOf(value) === 0,
            sorter: false,
            render: (val) => val ? <div>{dayjs(new Date(val)).format('DD/MM/YYYY')}</div> : <div>-</div>
        },
        {
            key: "expireDate",
            title: "Expire Dt.",
            dataIndex: "expireDate",
            sorter: false,
            render: (val) => val ? <div>{dayjs(new Date(val)).format('DD/MM/YYYY')}</div> : <div>-</div>
        },
        {
            key: "totalAmount",
            title: "Total Amount",
            dataIndex: "totalAmount",
            sorter: false,
            render: (val) => val ? <div>₹ {getIndianMoneyFormat(val)}</div> : <div>-</div>
        },
        {
            key: "totalLabor",
            title: "Labor Amount",
            dataIndex: "laborAmount",
            sorter: false,
            render: (val) => val ? <div>₹ {getIndianMoneyFormat(val)}</div> : <div>-</div>
        },
        {
            key: "totalMaterial",
            title: "Material Amount",
            dataIndex: "materialAmount",
            sorter: false,
            render: (val) => val ? <div>₹ {getIndianMoneyFormat(val)}</div> : <div>-</div>
        },
        {
            key: "totalTax",
            title: "Total Tax",
            dataIndex: "totalTax",
            sorter: false,
            width: '10%',
            render: (val) => val ? <div>₹ {getIndianMoneyFormat(val)}</div> : <div>-</div>
        },
        {
            key: "actions",
            title: "Actions",
            dataIndex: "action",
            width: '10%',
            render: (index, record) => <div className='d-flex-between'>
                <EyeOutlined className='tableEditIcon' onClick={() => onReviewInvoice(record)} />
                <EditOutlined className='tableEditIcon' onClick={() => onEditRow(record)} />
                <DeleteOutlined className='tableDeleteIcon' onClick={() => onEditRow(record, true)} />
            </div>
        }
    ];

    const showDeleteConfirm = (record) => {
        Modal.confirm({
            content: 'Are you sure you want to remove this Sale Invoice?',
            okText: 'Remove',
            okType: 'danger',
            onOk: async () => {
                try {
                    const res = await deleteSaleInvoice(record._id);
                    if (res.data?.success) {
                        message.success('Sale Invoice deleted successfully');
                        fetchSaleInvoice();
                    } else {
                        message.error(res.data?.message);
                    }
                } catch (error) {
                    message.error('Something went wrong' + error);
                }
            },
            onCancel() { },
        });
    };

    useEffect(() => {
        if (filterInputValue) {
            onFilterValues();
        } else {
            fetchSaleInvoice();
        }
    }, [skipCount]);

    useEffect(() => {
        fetchSaleInvoice();
    }, []);

    const fetchSaleInvoice = async () => {
        let res = await getSaleInvoice(defaultProject?._id, pageCount, skipCount);
        if (res?.data?.success) {
            setSaleInvoiceList(res.data?.data);
            setPaginationTotal(res.data?.totalLength);
        }
    };

    const onEditRow = async (record, isDelete = false) => {
        debugger
        if (!isDelete) {
            setDefaultSaleInvoice(record);
            setIsEditSaleInvoice(true);
            navigate('/saleInvoice/form', {
                state: {
                    isEditSaleInvoice: true,
                    defaultSaleInvoice: record,
                    defaultProject: defaultProject
                }
            });
        }

        if (isDelete) {
            showDeleteConfirm(record);
            return;
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        let count = 0;
        for (let i = 1; i < page; i++) {
            count = count + pageCount;
        }
        setSkipCount(count);
    };

    const handleSort = () => { };

    const handleChangeFilterInput = async (e) => {
        setFilterInputValue(e.target.value);
    };

    const onReviewInvoice = (record) => {
        setDefaultSaleInvoice(record);
        setSIReviewModalOpen(true);
    };

    const onFilterValues = async () => {
        if (filterInputValue) {
            let res = await getSaleInvoice(defaultProject?._id, pageCount, skipCount, filterInputValue);
            if (res?.data?.success) {
                setSaleInvoiceList(res.data?.data);
                setPaginationTotal(res.data?.totalLength);
            }
            return;
        }
        fetchSaleInvoice();
    };

    const handleSizeChange = (currentPage, size) => {
        setPageCount(size);
        fetchSaleInvoice();
    };

    const handleReviewModal = () => {
        setSIReviewModalOpen(!SIReviewModalOpen);
    };

    return (
        <div>
            <Row align='middle' justify='space-between'>
                <Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }}>
                    <h2 className='allPageHeader'>Sale Invoice</h2>
                </Col>
                <Col>
                    <AppButton
                        label='+ Add Sale Invoice'
                        onClick={() => {
                            // setIsEditSaleInvoice(false);
                            // setSaleInvoiceModalOpen(true);
                            // setDefaultSaleInvoice(null);
                            navigate('/saleInvoice/form', {
                                state: {
                                    isEditSaleInvoice: false,
                                    defaultSaleInvoice: null,
                                    defaultProject: defaultProject
                                }
                            });
                        }}
                    />
                </Col>
            </Row>
            <Collapsible
                label='Advance Search'
                children={<FilterBox
                    isCard={true}
                    handleChangeFilterInput={handleChangeFilterInput}
                    onFilterValues={onFilterValues}
                />}
            />
            <Collapsible
                label='List'
                children={<AppTable
                    handleSort={handleSort}
                    dataSource={saleInvoiceList}
                    columns={initialColumns}
                    pageSize={pageCount}
                    currentPage={currentPage}
                    handlePageChange={handlePageChange}
                    paginationTotal={paginationTotal}
                    showSizeChanger={true}
                    onShowSizeChange={handleSizeChange}
                />}
            />
            <AppModal
                open={SIReviewModalOpen}
                width={700}
                // header={false}
                closeIcon={false}
                // title={<h2>Sale Invoice</h2>}
                children={
                <InvoiceReviewModal
                    currentSI={defaultSaleInvoice}
                    handleReviewModalClose={handleReviewModal}
                />
                }
                onCancel={handleReviewModal}
            />
            {/* <AppModal
                open={saleInvoiceModalOpen}
                children={
                    <AddEditSaleInvoice
                        defaultSaleInvoice={defaultSaleInvoice}
                        isEditSaleInvoice={isEditSaleInvoice}
                        setSaleInvoiceModalOpen={setSaleInvoiceModalOpen}
                        defaultProject={defaultProject}
                    />}
                width='65%'
                // width='90%'
                onOk={handlePurchaseOrderModal}
                onCancel={handlePurchaseOrderModal}
            /> */}
        </div>
    );
}

export default SaleInvoice;