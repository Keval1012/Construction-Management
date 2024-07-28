import { Col, Modal, Row, message } from 'antd';
import React, { useEffect, useState } from 'react'
import AppButton from '../AppButton';
import AppModal from '../AppModal';
import FilterBox from '../FilterBox';
import Collapsible from '../Collapsible';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import AppTable from '../AppTable';
import { addBudgetCategory, deleteBudgetCategory, getBudgetCategory, updateBudgetCategory } from '../../API/Api';
import AddEditBudgetCategory from './AddEditBudgetCategory';

const BudgetCategory = () => {

    const initialColumns = [
        {
          key: "name",
          title: "Name",
          dataIndex: "name",
          sorter: false,
          width: '5%',
          render: (val) => val ? <div>{val}</div> : <div>-</div>
        },
        {
          key: "displayName",
          title: "Display Name",
          dataIndex: "displayName",
          sorter: false,
          width: '5%',
          render: (val) => val ? <div>{val}</div> : <div>-</div>
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

    const [budgetCategoryModalOpen, setBudgetCategoryModalOpen] = useState(false);
	const [defaultBudgetCategory, setDefaultBudgetCategory] = useState(null);
	const [isEditBudgetCategory, setIsEditBudgetCategory] = useState(false);
    const [budgetCategoryColumns, setBudgetCategoryColumns] = useState(initialColumns);
    const [pageCount, setPageCount] = useState(5);
    const [currentPage, setCurrentPage] = useState(0);
    const [paginationTotal, setPaginationTotal] = useState(0);
    const [skipCount, setSkipCount] = useState(0);
    const [filterInputValue, setFilterInputValue] = useState('');
    const [budgetCategoryList, setBudgetCategoryList] = useState([]);

    const showDeleteConfirm = (record) => {
        Modal.confirm({
          content: 'Are you sure you want to remove this Budget Category?',
          okText: 'Remove',
          okType: 'danger',
          onOk: async () => {
            try {
              const res = await deleteBudgetCategory(record._id);
              if (res.data?.success) {
                message.success('Budget Category deleted successfully');
                fetchBudgetCategory();
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
            fetchBudgetCategory();
        }
    }, [skipCount]);

    useEffect(() => {
        fetchBudgetCategory();
    }, []);

    const fetchBudgetCategory = async () => {
        let res = await getBudgetCategory(pageCount, skipCount);
        if (res?.data?.success) {
            setBudgetCategoryList(res.data?.data);
            setPaginationTotal(res.data?.totalLength);
        }
    };

    const onEditRow = async (record, isDelete = false) => {
        if (!isDelete) {
            setDefaultBudgetCategory(record);
            setIsEditBudgetCategory(true);
            setBudgetCategoryModalOpen(true);
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
            let res = await getBudgetCategory(pageCount, skipCount, filterInputValue);
            if (res?.data?.success) {
                setBudgetCategoryList(res.data?.data);
                setPaginationTotal(res.data?.totalLength);
            }
            return;
        }
        fetchBudgetCategory();
    };

    const handleSizeChange = (currentPage, size) => {
        setPageCount(size);
        fetchBudgetCategory();
    };

    const handleBudgetCategoryModal = () => {
		setBudgetCategoryModalOpen(!budgetCategoryModalOpen);
	};

    const handleBudgetCategoryFormValues = async (form) => {
        const values = form.getFieldsValue();
        const { budgetName, displayName } = values;

        if (budgetName && displayName) {
            if (form.getFieldsError().filter(x => x.errors.length > 0).length > 0) {
                return;
            }

            let data = {
                name: budgetName,
                displayName: displayName,
            };

            if (isEditBudgetCategory) {
                try {
                    const res = await updateBudgetCategory(defaultBudgetCategory?._id, data);
                    if (res.data?.success) {
                        setBudgetCategoryModalOpen(false);
                        message.success('Budget Category Name Updated Successfully');
                        fetchBudgetCategory();
                    } else message.error(res.data?.message);
                } catch (error) {
                    message.error('Something went wrong' + error);
                }
            }

            if (!isEditBudgetCategory) {
                try {
                    const res = await addBudgetCategory(data);
                    if (res?.data?.success) {
                        setBudgetCategoryModalOpen(false);
                        message.success('Budget Category Name Added Successfully')
                        fetchBudgetCategory();
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
                    <h2 className='allPageHeader'>Budget Category</h2>
                </Col>
                <Col>
                    <AppButton
                        label='+ Add Budget Category' 
                        onClick={() => {
                            setIsEditBudgetCategory(false);
                            setBudgetCategoryModalOpen(true);
                            setDefaultBudgetCategory(null);
                        }} 
                    />
                </Col>
            </Row>
            <FilterBox
                handleChangeFilterInput={handleChangeFilterInput}
                onFilterValues={onFilterValues}
            />
            <Collapsible
                label='List'
                children={<AppTable
                    handleSort={handleSort}
                    dataSource={budgetCategoryList}
                    columns={budgetCategoryColumns}
                    pageSize={pageCount}
                    currentPage={currentPage}
                    handlePageChange={handlePageChange}
                    paginationTotal={paginationTotal}
                    showSizeChanger={true}
                    onShowSizeChange={handleSizeChange}
                />}
            />
            <AppModal
                open={budgetCategoryModalOpen}
                children={
                    <AddEditBudgetCategory
                        defaultBudgetCategory={defaultBudgetCategory}
                        isEditBudgetCategory={isEditBudgetCategory}
                        setBudgetCategoryModalOpen={setBudgetCategoryModalOpen}
                        handleBudgetCategoryFormValues={handleBudgetCategoryFormValues}
                    />}
                onOk={handleBudgetCategoryModal}
                onCancel={handleBudgetCategoryModal}
            />
        </div>
    );
}

export default BudgetCategory;