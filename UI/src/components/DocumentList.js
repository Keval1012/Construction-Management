import { DeleteOutlined, EditOutlined, EyeOutlined, KeyOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { Row, Col, message, Modal } from 'antd';
import { deleteProjectDocument, getAttachmentsOfProject } from '../API/Api.js';
import AppModal from '../components/AppModal';
import Table from '../components/AppTable';
import Button from '../components/AppButton';
import FilterBox from '../components/FilterBox.js';
import Collapsible from '../components/Collapsible.js';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import DocViewModal from './ProjectDashboard/DocViewModal.js';

const DocumentList = ({ defaultProject }) => {

    const confirm = Modal.confirm;
    const navigate = useNavigate();
    const [docsList, setDocsList] = useState([]);
    const [pageCount, setPageCount] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [skipCount, setSkipCount] = useState(0);
    const [paginationTotal, setPaginationTotal] = useState(0);
    const [filterInputValue, setFilterInputValue] = useState('');
    const [defaultDocument, setDefaultDocument] = useState(null);
    const [docModalOpen, setDocModalOpen] = useState(false);

    useEffect(() => {
        fetchDocs();
    }, [JSON.stringify(defaultProject)]);

    useEffect(() => {
        if (filterInputValue) {
            onFilterValues();
        } else {
            fetchDocs();
        }
    }, [skipCount]);

    const showDeleteConfirm = (record) => {
        confirm({
            title: `Document name: ${record.name} `,
            content: 'Are you sure you want to remove this document?',
            okText: 'Remove',
            okType: 'danger',
            onOk: async () => {
                await deleteProjectDocument(record._id);
                setDocsList(docsList.filter(o => o._id !== record._id));
                // fetchDocs();
            },
            onCancel() { },
        });
    };

    const docsColumns = [
        {
            key: "attachment",
            title: "Document Name",
            dataIndex: "attachment",
            // filters: data.map(o => ({ text: o.name, value: o.key })),
            // onFilter: (value, record) => record.name.indexOf(value) === 0,
            sorter: false,
            width: '50%',
            render: (val) => <div>{val?.split('/')[val?.split('/').length - 1]}</div>
        },
        {
            key: "createdAt",
            title: "Attached Date",
            dataIndex: "createdAt",
            sorter: false,
            render: (val) => <div>{dayjs(new Date(val)).format('DD/MM/YYYY')}</div>
        },
        {
            key: "actions",
            title: "Actions",
            dataIndex: "action",
            width: '0.1%',
            render: (index, record) => <div className='d-flex-between'>
                <EyeOutlined className='tableEditIcon' onClick={() => onEditRow(record, false)} />
                <DeleteOutlined className='tableDeleteIcon' onClick={() => onEditRow(record, true)} />
            </div>
        }
    ];

    const fetchDocs = async () => {
        if (defaultProject) {
            const res = await getAttachmentsOfProject(defaultProject?._id, pageCount, skipCount);
            if (res?.data?.success) {
                setDocsList(res.data?.data);
                setPaginationTotal(res?.data?.totalLength);
            }
            // setDocsList(defaultProject?.attachmentList);
            // setPaginationTotal(defaultProject?.attachmentList?.length);
        }
    };

    const handleChangeFilterInput = (e) => {
        setFilterInputValue(e.target.value);
    };

    const onEditRow = async (record, isDelete = false) => {
        if (!isDelete) {
            setDefaultDocument(record);
            //   setIsEditDoc(true);
            setDocModalOpen(true);
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

    const onFilterValues = async () => {
        if (filterInputValue) {
            const res = await getAttachmentsOfProject(defaultProject?._id, pageCount, skipCount, filterInputValue);
            if (res?.data?.success) {
                setDocsList(res.data?.data);
                setPaginationTotal(res.data?.totalLength);
            }
            return;
        }
        fetchDocs();
    };

    const handleSizeChange = (currentPage, size) => {
        setPageCount(size);
        fetchDocs();
    };

    const handleDocModal = () => {
        setDocModalOpen(!docModalOpen);
    };

    return (
        <div>
            <Row align='middle' justify='space-between'>
                <Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }} >
                    <h2 className='allPageHeader'>Documents List</h2>
                </Col>
                <Col>
                    <Button
                        label='+ Add Documents'
                        onClick={() => {
                            navigate('/documents', {
                                state: {
                                    defaultDocument: null,
                                    isEditDocument: false,
                                    defaultProject: defaultProject
                                }
                            });
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
                    dataSource={docsList}
                    columns={docsColumns}
                    pageSize={pageCount}
                    currentPage={currentPage}
                    handlePageChange={handlePageChange}
                    paginationTotal={paginationTotal}
                    showSizeChanger={true}
                    onShowSizeChange={handleSizeChange}
                />}
            />
            <AppModal
                open={docModalOpen}
                closeIcon={false}
                children={
                    <DocViewModal
                        defaultDocView={defaultDocument}
                        setDocModalOpen={setDocModalOpen}
                    />}
                onOk={handleDocModal}
                onCancel={handleDocModal}
                height='35rem'
                width='80vw'
            />
        </div>
    )
}

export default DocumentList;