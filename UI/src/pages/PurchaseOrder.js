import { Col, Modal, Row, Tag, message } from 'antd';
import React, { useEffect, useState } from 'react'
import AppButton from '../components/AppButton';
import Collapsible from '../components/Collapsible';
import AppTable from '../components/AppTable';
import FilterBox from '../components/FilterBox';
import { deletePurchaseOrder, getPurchaseOrder } from '../API/Api';
import '../styles/invoice.css';
import { useNavigate } from 'react-router-dom';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { getIndianMoneyFormat } from '../helper';
import POReviewModal from '../components/PO/POReviewModal';
import AppModal from '../components/AppModal';
import '../styles/purchase.css';

const PurchaseOrder = ({ defaultProject }) => {

    const navigate = useNavigate();
    const [defaultPurchaseOrder, setDefaultPurchaseOrder] = useState(null);
    const [isEditPurchaseOrder, setIsEditPurchaseOrder] = useState(false);
    const [POReviewModalOpen, setPOReviewModalOpen] = useState(false);
    const [pageCount, setPageCount] = useState(5);
    const [currentPage, setCurrentPage] = useState(0);
    const [paginationTotal, setPaginationTotal] = useState(0);
    const [skipCount, setSkipCount] = useState(0);
    const [filterInputValue, setFilterInputValue] = useState('');
    const [purchaseOrderList, setPurchaseOrderList] = useState([]);

    const initialColumns = [
        {
            key: "purchaseOrderNumber",
            title: "PO No.",
            dataIndex: "purchaseOrderNumber",
            // filters: data.map(o => ({ text: o.name, value: o.key })),
            // onFilter: (value, record) => record.name.indexOf(value) === 0,
            sorter: false,
            fixed: 'left',
            render: (val) => val ? <div>{val}</div> : <div>-</div>
        },
        {
            key: "vendorName",
            title: "Vendor Name",
            dataIndex: "vendorName",
            sorter: false,
            render: (val) => val ? <div>{val}</div> : <div>-</div>
        },
        {
            key: "PODate",
            title: "PO Dt.",
            dataIndex: "PODate",
            // filters: data.map(o => ({ text: o.name, value: o.key })),
            // onFilter: (value, record) => record.name.indexOf(value) === 0,
            sorter: false,
            render: (val) => val ? <div>{dayjs(new Date(val)).format('DD/MM/YYYY')}</div> : <div>-</div>
        },
        {
            key: "expireDate",
            title: "Delivery Deadline",
            dataIndex: "expireDate",
            sorter: false,
            render: (val) => val ? <div>{dayjs(new Date(val)).format('DD/MM/YYYY')}</div> : <div>-</div>
        },
        {
            key: "totalAmount",
            title: "Total Amount",
            dataIndex: "totalAmount",
            sorter: false,
            width: '12%',
            render: (val) => val ? <div>₹ {getIndianMoneyFormat(val)}</div> : <div>-</div>
        },
        // {
        //     key: "totalMaterial",
        //     title: "Items Amount",
        //     dataIndex: "totalMaterial",
        //     sorter: false,
        //     render: (val) => val ? <div>₹ {getIndianMoneyFormat(val)}</div> : <div>-</div>
        // },
        {
            key: "totalTax",
            title: "Total Tax",
            dataIndex: "totalTax",
            sorter: false,
            width: '12%',
            render: (val) => val ? <div>₹ {getIndianMoneyFormat(val)}</div> : <div>-</div>
        },
        // {
        //     key: "status",
        //     title: "Status",
        //     dataIndex: "status",
        //     sorter: false,
        //     // width: '10%',
        //     render: (val) => val ? <Tag bordered={true} color={val === 'approved' ? 'processing' : val === 'completed' ? 'success' : 'default'}>{val}</Tag> : <div>-</div>
        // },
        {
            key: "actions",
            title: "Actions",
            dataIndex: "actions",
            fixed: 'left',
            width: 120,
            render: (index, record) => <div className='d-flex-between'>
                <EyeOutlined className='tableEditIcon' onClick={() => handleOnReview(record)} />
                <EditOutlined className='tableEditIcon' onClick={() => onEditRow(record)} />
                <DeleteOutlined className='tableDeleteIcon' onClick={() => onEditRow(record, true)} />
            </div>
        }
    ];

    const showDeleteConfirm = (record) => {
        Modal.confirm({
            content: 'Are you sure you want to remove this Purchase Order?',
            okText: 'Remove',
            okType: 'danger',
            onOk: async () => {
                try {
                    const res = await deletePurchaseOrder(record._id);
                    if (res.data?.success) {
                        message.success('Purchase Order deleted successfully');
                        fetchPurchaseOrder();
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
            fetchPurchaseOrder();
        }
    }, [skipCount]);

    useEffect(() => {
        fetchPurchaseOrder();
    }, []);

    const fetchPurchaseOrder = async () => {
        let res = await getPurchaseOrder(defaultProject?._id, null, pageCount, skipCount);
        if (res?.data?.success) {
            setPurchaseOrderList(res.data?.data);
            setPaginationTotal(res.data?.totalLength);
        }
    };

    const handleOnReview = (record) => {
        setDefaultPurchaseOrder(record);
        setPOReviewModalOpen(true);
    };

    const onEditRow = async (record, isDelete = false) => {
        if (!isDelete) {
            setDefaultPurchaseOrder(record);
            setIsEditPurchaseOrder(true);
            navigate('/purchaseOrder/form', {
                state: {
                    isEditPurchaseOrder: true,
                    defaultPurchaseOrder: record,
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

    const onFilterValues = async () => {
        if (filterInputValue) {
            let res = await getPurchaseOrder(defaultProject?._id, null, pageCount, skipCount, filterInputValue);
            if (res?.data?.success) {
                setPurchaseOrderList(res.data?.data);
                setPaginationTotal(res.data?.totalLength);
            }
            return;
        }
        fetchPurchaseOrder();
    };

    const handleSizeChange = (currentPage, size) => {
        setPageCount(size);
        fetchPurchaseOrder();
    };

    const handleReviewPOModal = () => {
        setPOReviewModalOpen(!POReviewModalOpen);
    };

    return (
        <div>
            <Row align='middle' justify='space-between'>
                <Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }}>
                    <h2 className='allPageHeader'>Purchase Order</h2>
                </Col>
                <Col>
                    <AppButton
                        label='+ Add Purchase Order'
                        onClick={() => {
                            setIsEditPurchaseOrder(false);
                            setDefaultPurchaseOrder(null);
                            navigate('/purchaseOrder/form', {
                                state: {
                                    isEditPurchaseOrder: false,
                                    defaultPurchaseOrder: null,
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
                    dataSource={purchaseOrderList}
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
                open={POReviewModalOpen}
                width={700}
                closeIcon={false}
                // title={<h2>Purchase Order</h2>}
                children={
                <POReviewModal
                    currentPO={defaultPurchaseOrder}
                    handleReviewModalClose={handleReviewPOModal}
                />
                }
                onCancel={handleReviewPOModal}
            />
        </div>
    );
}

export default PurchaseOrder;