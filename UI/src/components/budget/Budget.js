import { Col, Modal, Row, Table, Tag, message } from 'antd';
import React, { useEffect, useState } from 'react'
import AppButton from '../AppButton';
import AppModal from '../AppModal';
import { DeleteOutlined, DownOutlined, EditOutlined, RightOutlined } from '@ant-design/icons';
import Collapsible from '../Collapsible';
import AppTable from '../AppTable';
import FilterBox from '../FilterBox';
import { addBudget, deleteBudget, getAllBudgetCategory, getBudget, updateBudget } from '../../API/Api';
import AddEditBudget from './AddEditBudget';
import dayjs from 'dayjs';
import Selectable from '../Selectable';
import { budgetStatusList } from '../../constants';

const Budget = ({ defaultProject }) => {

    const initialColumns = [
        {
            key: "name",
            title: "Category",
            dataIndex: "name",
            sorter: false,
            render: (val) => val ? <div>{val}</div> : <div>-</div>
        },
    ];

    const initialColumnsForBudget = [
        {
            key: "budgetName",
            title: "Budget Name",
            dataIndex: "budgetName",
            sorter: false,
            width: '5%',
            render: (val) => val ? <div>{val}</div> : <div>-</div>
        },
        {
            key: "description",
            title: "Description",
            dataIndex: "description",
            sorter: false,
            width: '5%',
            render: (val) => val ? <div>{val}</div> : <div>-</div>
        },
        {
            key: "totalAmount",
            title: "Total Amount",
            dataIndex: "totalAmount",
            sorter: false,
            width: '5%',
            render: (val) => val ? <div>₹{val}</div> : <div>-</div>
        },
        {
            key: "startDate",
            title: "Start Date",
            dataIndex: "startDate",
            sorter: false,
            width: '5%',
            render: (val) => val ? <div>{dayjs(new Date(val)).format('DD/MM/YYYY')}</div> : <div>-</div>
        },
        {
            key: "endDate",
            title: "End Date",
            dataIndex: "endDate",
            sorter: false,
            width: '5%',
            render: (val) => val ? <div>{dayjs(new Date(val)).format('DD/MM/YYYY')}</div> : <div>-</div>
        },
        {
            key: "status",
            title: "Status",
            dataIndex: "status",
            sorter: false,
            width: '5%',
            render: (val) => val ? <Tag bordered={true} color={val === 'draft' ? 'processing' : val === 'approved' ? 'success' : 'default'}>{val}</Tag> : <div>-</div>
        },
        {
            key: "actions",
            title: "Actions",
            dataIndex: "action",
            width: '0.1%',
            render: (index, record) => <div className='d-flex-between'>
                <EditOutlined className='tableEditIcon' onClick={() => onEditRow(record)} />
                <DeleteOutlined className='tableDeleteIcon' onClick={() => onEditRow(record, true)} />
            </div>
        }
    ];

    const [budgetModalOpen, setBudgetModalOpen] = useState(false);
	const [defaultBudget, setDefaultBudget] = useState(null);
	const [isEditBudget, setIsEditBudget] = useState(false);
    const [pageCount, setPageCount] = useState(5);
    const [currentPage, setCurrentPage] = useState(0);
    const [paginationTotal, setPaginationTotal] = useState(0);
    const [skipCount, setSkipCount] = useState(0);
    const [filterInputValue, setFilterInputValue] = useState('');
    const [budgetCategoryList, setBudgetCategoryList] = useState([]);
    const [budgetList, setBudgetList] = useState([]);
    const [formatedBudgetList, setFormatedBudgetList] = useState([]);

    const showDeleteConfirm = (record) => {
        Modal.confirm({
          content: 'Are you sure you want to remove this Budget?',
          okText: 'Remove',
          okType: 'danger',
          onOk: async () => {
            try {
              const res = await deleteBudget(record._id);
              if (res.data?.success) {
                message.success('Budget deleted successfully');
                fetchBudget();
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
          fetchBudget();
        }
    }, [skipCount]);
    
    useEffect(() => {
        fetchBudget();
        fetchBudgetCategoryList();
    }, []);

    useEffect(() => {
        extractCategoryArray();
    }, [JSON.stringify(budgetList)]);

    const extractCategoryArray = () => {
        const newArray = budgetList.map((o) => {
            return { ...o, ...o.categoryDetails, key: o._id };
        });
        setFormatedBudgetList(newArray);
    };
    
    const fetchBudgetCategoryList = async () => {
        const res = await getAllBudgetCategory();
        if (res?.data?.status === 200) {
            setBudgetCategoryList(res?.data?.data);
        }
    };

    const fetchBudget = async () => {
        let res = await getBudget(defaultProject?._id, null, pageCount, skipCount);
        if (res?.data?.success) {
            setBudgetList(res.data?.data);
            setPaginationTotal(res.data?.totalLength);
        }
    };

    const fetchFilterList = async (status) => {
        let res = await getBudget(defaultProject?._id, [status], pageCount, skipCount);
        if (res?.data?.success) {
            setBudgetList(res.data?.data);
        }
    };

    const extraFilter = <>
        <Col xl={{ span: 6 }} lg={{ span: 6 }} md={{ span: 6 }} sm={{ span: 6 }} xs={{ span: 6 }}>
            <Selectable
                allowClear
                name="status"
                requiredMsg='Status is required'
                placeholder='By Status'
                firstName='name'
                data={budgetStatusList}
                width={400}
                showSearch={false}
                handleSelectChange={(status) => {
                    if (status) fetchFilterList(status);
                    else fetchBudget();
                }}
            />
        </Col>
    </>;

    const onEditRow = async (record, isDelete = false) => {
        if (!isDelete) {
            setDefaultBudget(record);
            setIsEditBudget(true);
            setBudgetModalOpen(true);
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
            let res = await getBudget(defaultProject?._id, null, pageCount, skipCount, filterInputValue);
            if (res?.data?.success) {
                setBudgetList(res.data?.data);
                setPaginationTotal(res.data?.totalLength);
            }
            return;
        }
        fetchBudget();
    };

    const handleSizeChange = (currentPage, size) => {
        setPageCount(size);
        fetchBudget();
    };

    const handleBudgetModal = () => {
		setBudgetModalOpen(!budgetModalOpen);
	};

    const handleBudgetFormValues = async (form) => {
        const values = form.getFieldsValue();
        const { budgetName, budgetCategory, budgetDescription, totalAmount, budgetStartDate, budgetEndDate, budgetStatus } = values;

        if (budgetName && budgetCategory && budgetDescription && totalAmount && budgetStartDate && budgetEndDate && budgetStatus) {
            if (form.getFieldsError().filter(x => x.errors.length > 0).length > 0) {
                return;
            }

            let data = {
                projectId: defaultProject?._id,
                budgetName: budgetName,
                category: budgetCategory,
                description: budgetDescription,
                totalAmount: totalAmount ? totalAmount : 0,
                startDate: budgetStartDate,
                endDate: budgetEndDate,
                status: budgetStatus,
            };

            if (isEditBudget) {
                try {
                    const res = await updateBudget(defaultBudget?._id, data);
                    if (res.data?.success) {
                        setBudgetModalOpen(false);
                        message.success('Budget Updated Successfully');
                        fetchBudget();
                    } else message.error(res.data?.message);
                } catch (error) {
                    message.error('Something went wrong' + error);
                }
            }

            if (!isEditBudget) {
                try {
                    const res = await addBudget(data);
                    if (res?.data?.success) {
                        setBudgetModalOpen(false);
                        message.success('Budget Added Successfully')
                        fetchBudget();
                        return;
                    } else {
                        message.error(res.data?.message);
                    }
                } catch (error) {
                    message.error(error.response.data.error);
                }
            }

        } else {
            message.error('Please add required fields');
        }
    };

    return (
        <div>
            <Row align='middle' justify='space-between'>
                <Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }}>
                    <h2 className='allPageHeader'>Budget</h2>
                </Col>
                <Col>
                    <AppButton
                        label='+ Add Budget' 
                        onClick={() => {
                            setIsEditBudget(false);
                            setBudgetModalOpen(true);
                            setDefaultBudget(null);
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
                    extraFilter={true}
                    extraFilterBox={extraFilter}
                />}
            />
            <Collapsible
                label='List'
                children={<AppTable
                    bordered={false}
                    rowClass="nestedTableRow"
                    expandable={{
                        expandedRowRender: (record) => {
                            if (record) {
                                return (
                                    <Table
                                        bordered={false}
                                        size='small'
                                        // showHeader={false}
                                        columns={initialColumnsForBudget}
                                        dataSource={record.budgetList}
                                        pagination={false}
                                    />
                                );
                            }
                            return null;
                        },
                        defaultExpandAllRows: false,
                        defaultExpandedRowKeys: [],
                        expandRowByClick: true,
                        expandIcon: ({ expanded, onExpand, record }) => {
                            return expanded ? (
                                <DownOutlined
                                    onClick={(e) => {
                                        onExpand(record, e);
                                    }}
                                />
                                ) : (
                                <RightOutlined
                                    onClick={(e) => {
                                        onExpand(record, e);
                                    }}
                                />
                            );
                        },
                    }}

                    handleSort={handleSort}
                    dataSource={formatedBudgetList}
                    columns={initialColumns}
                    pageSize={pageCount}
                    currentPage={currentPage}
                    handlePageChange={handlePageChange}
                    paginationTotal={paginationTotal}
                    showSizeChanger={true}
                    onShowSizeChange={handleSizeChange}
                ></AppTable>}
            />
            
            <AppModal
                open={budgetModalOpen}
                children={
                    <AddEditBudget
                        defaultBudget={defaultBudget}
                        isEditBudget={isEditBudget}
                        setBudgetModalOpen={setBudgetModalOpen}
                        handleBudgetFormValues={handleBudgetFormValues}
                        budgetCategoryList={budgetCategoryList}
                    />}
                width='65%'
                onOk={handleBudgetModal}
                onCancel={handleBudgetModal}
            />
        </div>
    );
}

export default Budget;