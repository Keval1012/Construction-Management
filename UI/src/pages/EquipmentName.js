import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Col, message, Modal, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { addEquipmentName, deleteEquipmentName, getEquipmentName, updateEquipmentName } from '../API/Api';
import AppButton from '../components/AppButton';
import AppModal from '../components/AppModal';
import AddEditEquipmentName from '../components/AddEditEquipmentName';
import AppTable from '../components/AppTable';
import FilterBox from '../components/FilterBox';
import Collapsible from '../components/Collapsible';

const EquipmentName = () => {

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

  const [equipmentNameList, setEquipmentNameList] = useState([]);
  const [equipmentNameColumns, setEquipmentNameColumns] = useState(initialColumns);
  const [active, setActive] = useState(true);
  const [pageCount, setPageCount] = useState(5);
  const [currentPage, setCurrentPage] = useState(0);
  const [paginationTotal, setPaginationTotal] = useState(0);
  const [skipCount, setSkipCount] = useState(0);
  const [filterInputValue, setFilterInputValue] = useState('');
  const [equipmentNameModalOpen, setEquipmentNameModalOpen] = useState(false);
  const [isEditEquipmentName, setIsEditEquipmentName] = useState(false);
  const [defaultEquipment, setDefaultEquipment] = useState(null);

  const showDeleteConfirm = (record) => {
    Modal.confirm({
      content: 'Are you sure you want to remove this Equipment?',
      okText: 'Remove',
      okType: 'danger',
      onOk: async () => {
        try {
          const res = await deleteEquipmentName(record._id);
          if (res.data?.success) {
            message.success('Equipment Name deleted successfully');
            fetchEquipmentName();
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
      fetchEquipmentName();
    }
  }, [skipCount, active]);

  useEffect(() => {
    fetchEquipmentName();
  }, []);

  const fetchEquipmentName = async () => {
    let res = await getEquipmentName(pageCount, skipCount);
    if (res?.data?.success) {
      setEquipmentNameList(res.data?.data);
      setPaginationTotal(res.data?.totalLength);
    }
  };

  const onEditRow = async (record, isDelete = false) => {
    if (!isDelete) {
      setDefaultEquipment(record);
      setIsEditEquipmentName(true);
      setEquipmentNameModalOpen(true);
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
      let res = await getEquipmentName(pageCount, skipCount, filterInputValue);
      if (res?.data?.success) {
        setEquipmentNameList(res.data?.data);
        setPaginationTotal(res.data?.totalLength);
      }
      return;
    }
    fetchEquipmentName();
  };

  const handleSizeChange = (currentPage, size) => {
    setPageCount(size);
    fetchEquipmentName();
  };

  const handleOnOkModal = () => { };

  const handleOnCancelModal = () => {
    setDefaultEquipment(null);
    setEquipmentNameModalOpen(false);
  };

  const handleEquipmentNameFormValues = async (form) => {
    const values = form.getFieldsValue();
    const { name, displayName } = values;

    if (name && displayName) {

      if (form.getFieldsError().filter(x => x.errors.length > 0).length > 0) {
        return;
      }

      let data = {
        name: name,
        displayName: displayName,
      };

      if (isEditEquipmentName) {
        try {
          const res = await updateEquipmentName(defaultEquipment?._id, data);
          if (res.data?.success) {
            setEquipmentNameModalOpen(false);
            message.success('Equipment Name Updated Successfully');
            fetchEquipmentName();
          } else message.error(res.data?.message);
        } catch (error) {
          message.error('Something went wrong' + error);
        }
      }

      if (!isEditEquipmentName) {
        try {
          const res = await addEquipmentName(data);
          if (res.data?.success) {
            setEquipmentNameModalOpen(false);
            message.success('Equipment Name Added Successfully')
            fetchEquipmentName();
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
        <Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }} >
          <h2 className='allPageHeader'>Equipment Name</h2>
        </Col>
        <Col>
          <AppButton
            label='+ Add Equipment Name'
            onClick={() => {
              setIsEditEquipmentName(false);
              setDefaultEquipment(null);
              setEquipmentNameModalOpen(true);
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
          dataSource={equipmentNameList}
          columns={equipmentNameColumns}
          pageSize={pageCount}
          currentPage={currentPage}
          handlePageChange={handlePageChange}
          paginationTotal={paginationTotal}
          showSizeChanger={true}
          onShowSizeChange={handleSizeChange}
        />}
      />
      <AppModal
        open={equipmentNameModalOpen}
        children={
          <AddEditEquipmentName
            defaultEquipment={defaultEquipment}
            setDefaultEquipment={setDefaultEquipment}
            isEditEquipmentName={isEditEquipmentName}
            setEquipmentNameModalOpen={setEquipmentNameModalOpen}
            handleEquipmentNameFormValues={handleEquipmentNameFormValues}
          />}
        onOk={handleOnOkModal}
        onCancel={handleOnCancelModal}
      />
    </div>
  )
}

export default EquipmentName;