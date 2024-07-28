import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { Row, Col, message, Modal } from 'antd';
import { addTax, deleteTax, getTax, updateTax } from '../API/Api.js';
import AppModal from '../components/AppModal';
import Table from '../components/AppTable';
import Button from '../components/AppButton';
import FilterBox from '../components/FilterBox.js';
import Collapsible from '../components/Collapsible.js';
import AddEditTaxForm from '../components/AddEditTaxForm.js';

const Tax = () => {

    const confirm = Modal.confirm;
    const [taxList, setTaxList] = useState([]);
    const [pageCount, setPageCount] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [skipCount, setSkipCount] = useState(0);
    const [paginationTotal, setPaginationTotal] = useState(0);
    const [taxModalOpen, setTaxModalOpen] = useState(false);
    const [defaultTax, setDefaultTax] = useState(null);
    const [isEditTax, setIsEditTax] = useState(false);
    const [filterInputValue, setFilterInputValue] = useState('');

    useEffect(() => {
        fetchTaxes();
    }, []);

    useEffect(() => {
        if (filterInputValue) {
            onFilterValues();
        } else {
            fetchTaxes();
        }
    }, [skipCount]);

    const showDeleteConfirm = (record) => {
        confirm({
            title: `Tax name: ${record.name} `,
            content: 'Are you sure you want to remove this tax?',
            okText: 'Remove',
            okType: 'danger',
            onOk: async () => {
                debugger
                const res = await deleteTax(record._id);
                if (res?.data?.success) {
                    message.success(record?.name + ' Tax deleted successfully');
                    fetchTaxes();
                } else {
                    message.error(res?.data?.message);
                }
            },
            onCancel() { },
        });
    };

    const taxesColumns = [
        {
            key: "name",
            title: "Name",
            dataIndex: "name",
            // filters: data.map(o => ({ text: o.name, value: o.key })),
            // onFilter: (value, record) => record.name.indexOf(value) === 0,
            sorter: false,
            width: '25%'
        },
        {
            key: "taxPercent",
            title: "Tax Percentage (%)",
            dataIndex: "taxPercent",
            sorter: false,
            render: (val) => <div>{val}%</div>
        },
        {
            key: "actions",
            title: "Actions",
            dataIndex: "action",
            width: '10%',
            render: (index, record) => <div className='d-flex-between'>
                <EditOutlined className='tableEditIcon' onClick={() => onEditRow(record)} />
                <DeleteOutlined className='tableDeleteIcon' onClick={() => onEditRow(record, true)} />
            </div>
        }
    ];

    const fetchTaxes = async () => {
        const res = await getTax(pageCount, skipCount);
        setTaxList(res.data?.data);
        setPaginationTotal(res.data?.totalLength);
    };

    const handleChangeFilterInput = (e) => {
        setFilterInputValue(e.target.value);
    };

    const onEditRow = async (record, isDelete = false) => {
        if (!isDelete) {
            setDefaultTax(record);
            setIsEditTax(true);
            setTaxModalOpen(true);
            return;
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

    const handleOnOkModal = () => {
        setTaxModalOpen(false);
    };

    const handleOnCancelModal = () => {
        setTaxModalOpen(false);
        setDefaultTax(null);
    };

    const handleTaxFormValues = async (form) => {
        let checkVal = form.getFieldsValue();

        if (checkVal?.addTaxName && checkVal?.addTaxPercent) {

            if (form.getFieldsError().filter(x => x.errors.length > 0).length > 0) {
                return;
            }

            let data = { name: checkVal.addTaxName, taxPercent: checkVal.addTaxPercent };

            if (isEditTax) {
                try {

                    const res = await updateTax(defaultTax?._id, data);
                    if (res.data?.success) {
                        setTaxModalOpen(false);
                        message.success(defaultTax.name + 'Tax Updated Successfully');
                        fetchTaxes();
                        return;
                    } else message.error(res.data?.message);

                } catch (error) {
                    message.error('Something went wrong' + error);
                }
            }

            if (!isEditTax) {
                try {

                    const res = await addTax(data);
                    if (res.data?.success) {
                        setTaxModalOpen(false);
                        message.success('Tax Added Successfully')
                        fetchTaxes();
                        return;
                    } else {
                        message.error(res.data?.message);
                    }

                } catch (error) {
                    // message.error('Something went wrong' + error);
                    message.error(error.response.data.error);
                }
            }
        } else {
            message.error('Please add required fields');
        }
    };

    const onFilterValues = async () => {
        if (filterInputValue) {
            const res = await getTax(pageCount, skipCount, filterInputValue);
            setTaxList(res.data?.data);
            setPaginationTotal(res.data?.totalLength);
            return;
        }
        fetchTaxes();
    };

    const handleSizeChange = (currentPage, size) => {
        setPageCount(size);
        fetchTaxes();
    };

    return (
        <div>
            <Row align='middle' justify='space-between'>
                <Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }} >
                    <h2 className='allPageHeader'>Tax List</h2>
                </Col>
                <Col>
                    <Button
                        label='+ Add Tax'
                        onClick={() => {
                            setIsEditTax(false);
                            setDefaultTax(null);
                            setTaxModalOpen(true);
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
                children={<Table
                    handleSort={handleSort}
                    dataSource={taxList}
                    columns={taxesColumns}
                    pageSize={pageCount}
                    currentPage={currentPage}
                    handlePageChange={handlePageChange}
                    paginationTotal={paginationTotal}
                    showSizeChanger={true}
                    onShowSizeChange={handleSizeChange}
                />}
            />
            <AppModal
                open={taxModalOpen}
                children={
                    <AddEditTaxForm
                        defaultTax={defaultTax}
                        isEditTax={isEditTax}
                        setTaxModalOpen={setTaxModalOpen}
                        handleTaxFormValues={handleTaxFormValues}
                    />}
                onOk={handleOnOkModal}
                onCancel={handleOnCancelModal}
            />
        </div>
    )
}

export default Tax;