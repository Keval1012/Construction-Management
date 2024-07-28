import { Col, DatePicker, Modal, Row, Tag, message } from 'antd';
import React, { useEffect, useState } from 'react';
import AppButton from '../components/AppButton';
import Collapsible from '../components/Collapsible';
import FilterBox from '../components/FilterBox';
import { deleteProject, getAllEquipmentName, getEquipmentsByStatus } from '../API/Api';
import AppTable from '../components/AppTable';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import '../styles/project.css';
import { equipmentIsRentalList, equipmentStatusList, equipmentTypeList } from '../constants';
import Selectable from '../components/Selectable';
import dayjs from 'dayjs';
import TextInput from '../components/TextInput';

const Equipments = () => {
  
  const { RangePicker } = DatePicker;
  const navigate = useNavigate();
  const [equipmentsList, setEquipmentsList] = useState([]);
  const [pageCount, setPageCount] = useState(5);
  const [currentPage, setCurrentPage] = useState(0);
  const [paginationTotal, setPaginationTotal] = useState(0);
  const [skipCount, setSkipCount] = useState(0);
  const [filterInputValue, setFilterInputValue] = useState('');
  const [equipmentNameList, setEquipmemtNameList] = useState([]);

  const [selectedIsRental, setSelectedIsRental] = useState(''); 
  const [selectedStatus, setSelectedStatus] = useState(''); 

  const [selectedRentalStartDateRange, setSelectedRentalStartDateRange] = useState({ start: '', end: '' });
  const [selectedRentalEndDateRange, setSelectedRentalEndDateRange] = useState({ start: '', end: '' });

  const showDeleteConfirm = (record) => {
    Modal.confirm({
      content: 'Are you sure you want to remove this Equipment?',
      okText: 'Remove',
      okType: 'danger',
      onOk: async () => {
        try {
          const res = await deleteProject(record._id);
          if (res.data?.success) {
            message.success(record.name + ' Equipment deleted successfully');
            fetchEquipments();
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
      fetchEquipments();
    }
  }, [skipCount]);

  useEffect(() => {
    fetchEquipments();
    fetchEquipmentNameList();
  }, []);

  const fetchEquipmentNameList = async () => {
    const res = await getAllEquipmentName();
    if (res?.data?.status === 200) {
      setEquipmemtNameList(res?.data?.data);
    }
  };

  const projectColumns = [
    {
      key: "equipmentName",
      title: "Name",
      dataIndex: "equipmentName",
      sorter: false,
      fixed: 'left',
      render: (val) => val ? <div>{equipmentNameList?.find(o => o?._id === val)?.name}</div> : <div>-</div>
    },
    {
      key: "equipmentType",
      title: "Type",
      dataIndex: "equipmentType",
      sorter: false,
      width: '15%',
      render: (val) => val ? <div>{equipmentTypeList?.find(o => o?._id === val)?.name}</div> : <div>-</div>
    },
    {
      key: "totalQuantity",
      title: "Total Quantity",
      dataIndex: "totalQuantity",
      sorter: false,
      render: (val) => val ? <div>{val}</div> : <div>-</div>
    },
    {
      key: "isRental",
      title: "Is Rental",
      dataIndex: "isRental",
      sorter: false,
      render: (val) => (val === true) ? <Tag>Rental</Tag> : <Tag>Owned</Tag>
    },
    {
      key: "status",
      title: "Status",
      dataIndex: "status",
      sorter: false,
      render: (val) => val ? <Tag bordered={true} color={val === 'inUse' ? 'processing' : val === 'available' ? 'success' : 'default'}>{val}</Tag> : <div>-</div>
    },
    {
      key: "rentalPricePerDay",
      title: "Rental Price",
      dataIndex: "rentalPricePerDay",
      sorter: false,
      render: (val) => val !== '0' ? (val ? <div>₹{val}</div> : <div>-</div>) : (<div>-</div>)
    },
    {
      key: "rentalStartDate",
      title: "Rental Start Date",
      dataIndex: "rentalStartDate",
      sorter: false,
      render: (val) => val !== '1970-01-01T00:00:00.000Z' ? (val ? <div>{dayjs(new Date(val)).format('DD/MM/YYYY')}</div> : <div>-</div>) : (<div>-</div>)
    },
    {
      key: "rentalEndDate",
      title: "Rental End Date",
      dataIndex: "rentalEndDate",
      sorter: false,
      render: (val) => val !== '1970-01-01T00:00:00.000Z' ? (val ? <div>{dayjs(new Date(val)).format('DD/MM/YYYY')}</div> : <div>-</div>) : (<div>-</div>)
    },
    {
      key: "purchasePrice",
      title: "Purchase Price",
      dataIndex: "purchasePrice",
      sorter: false,
      render: (val) => val !== '0' ? (val ? <div>₹{val}</div> : <div>-</div>) : (<div>-</div>)
    },
    {
      key: "purchaseDate",
      title: "Purchase Date",
      dataIndex: "purchaseDate",
      sorter: false,
      render: (val) => val !== '1970-01-01T00:00:00.000Z' ? (val ? <div>{dayjs(new Date(val)).format('DD/MM/YYYY')}</div> : <div>-</div>) : (<div>-</div>)
    },
    {
      key: "actions",
      title: "Actions",
      dataIndex: "action",
      width: '7%',
      fixed: 'right',
      render: (index, record) => <div className='d-flex-between'>
        <EditOutlined className='tableEditIcon' onClick={() => onEditRow(record)} />
        <DeleteOutlined className='tableDeleteIcon' onClick={() => onEditRow(record, true)} />
      </div>
    },
  ];

  const fetchEquipments = async () => {
    const res = await getEquipmentsByStatus(['available', 'inUse', 'maintanance'], null, null, null, pageCount, skipCount);
    if (res?.data?.status === 200) {
      setEquipmentsList(res?.data?.data);
      setPaginationTotal(res.data?.totalLength);
    }
  };

  const fetchFilterList = async (status, isRental, rentalStartDate, rentalEndDate) => {
    const res = await getEquipmentsByStatus(status || selectedStatus, isRental || selectedIsRental, rentalStartDate || selectedRentalStartDateRange, rentalEndDate || selectedRentalEndDateRange, pageCount, skipCount);
    if (res?.data?.status === 200) {
      setEquipmentsList(res?.data?.data);
    }
  }

  const fetchFilterLists = async (status, isRental, rentalStartDate, rentalEndDate) => {
    const res = await getEquipmentsByStatus(status, isRental, rentalStartDate, rentalEndDate, pageCount, skipCount);
    if (res?.data?.status === 200) {
      setEquipmentsList(res?.data?.data);
    }
  }

  const onRangeChangeForRentalStartDate = (date, rentalStartDate) => {
    
    let obj = Object.assign({ start: rentalStartDate[0], end: rentalStartDate[1] });
    
    if ((selectedStatus && obj) || (selectedIsRental && obj) || (selectedRentalEndDateRange && obj)) {
      fetchFilterList(null, null, obj, null);
      setSelectedRentalStartDateRange({ start: rentalStartDate[0], end: rentalStartDate[1] });
    }
    if ((!selectedStatus && obj) || (!selectedIsRental && obj) || (!selectedRentalEndDateRange && obj)) {
      fetchFilterList(null, null, obj, null);
      setSelectedRentalStartDateRange({ start: rentalStartDate[0], end: rentalStartDate[1] });
    }
    if (!obj) {
      setSelectedRentalStartDateRange(null);
      if (selectedStatus) {
        if (selectedStatus || selectedIsRental || selectedRentalEndDateRange) {
          fetchFilterLists(selectedStatus, selectedIsRental, null, selectedRentalEndDateRange);
        } else fetchEquipments();
      } else {
        if (selectedStatus || selectedIsRental || selectedRentalEndDateRange) {
          fetchFilterLists(['available', 'inUse', 'maintanance'], selectedIsRental, null, selectedRentalEndDateRange);
        } else fetchEquipments();
      }
    }
  };

  const onRangeChangeForRentalEndDate = (date, rentalEndDate) => {

    let obj = Object.assign({ start: rentalEndDate[0], end: rentalEndDate[1] });
    
    if ((selectedStatus && obj) || (selectedIsRental && obj) || (selectedRentalStartDateRange && obj)) {
      fetchFilterList(null, null, null, obj);
      setSelectedRentalEndDateRange({ start: rentalEndDate[0], end: rentalEndDate[1] });
    }
    if ((!selectedStatus && obj) || (!selectedIsRental && obj) || (!selectedRentalStartDateRange && obj)) {
      fetchFilterList(null, null, null, obj);
      setSelectedRentalEndDateRange({ start: rentalEndDate[0], end: rentalEndDate[1] });
    }

    if (!obj) {
      setSelectedRentalEndDateRange(null);
      if (selectedStatus) {
        if (selectedStatus || selectedIsRental || selectedRentalStartDateRange) {
          fetchFilterLists(selectedStatus, selectedIsRental, selectedRentalStartDateRange, null);
        } else fetchEquipments();
      } else {
        if (selectedStatus || selectedIsRental || selectedRentalStartDateRange) {
          fetchFilterLists(['available', 'inUse', 'maintanance'], selectedIsRental, selectedRentalStartDateRange, null);
        } else fetchEquipments();
      }
    }
  };

  const extraFilter = <>
      <Row className='firstRow extraFilterRow' justify='space-between'>
        <Col xl={{ span: 5 }} lg={{ span: 5 }} md={{ span: 5 }} sm={{ span: 5 }} xs={{ span: 5 }}>
            <TextInput label='By Status' />
        </Col>      
        <Col xl={{ span: 5 }} lg={{ span: 5 }} md={{ span: 5 }} sm={{ span: 5 }} xs={{ span: 5 }}>
            <TextInput label='By Is Rental' />
        </Col>      
        <Col xl={{ span: 5 }} lg={{ span: 5 }} md={{ span: 5 }} sm={{ span: 5 }} xs={{ span: 5 }}>
            {/* <TextInput label='By Rental Start Date' /> */}
        </Col>      
        <Col xl={{ span: 5 }} lg={{ span: 5 }} md={{ span: 5 }} sm={{ span: 5 }} xs={{ span: 5 }}>
            {/* <TextInput label='By Rental End Date' /> */}
        </Col>      
      </Row>
      <Row className='firstRow filterMargin' justify='space-between'>
        <Col xl={{ span: 5 }} lg={{ span: 5 }} md={{ span: 5 }} sm={{ span: 5 }} xs={{ span: 5 }}>
            <Selectable
              allowClear
              name="status"
              requiredMsg='Status is required'
              placeholder='By Status'
              firstName='name'
              data={equipmentStatusList}
              width={400}
              showSearch={false}
              handleSelectChange={(status) => {
                if (status) {
                  fetchFilterList([status], null, null, null); 
                  setSelectedStatus([status]);  
                } else {
                  setSelectedStatus(null);
                  if (selectedIsRental || selectedRentalStartDateRange || selectedRentalEndDateRange) {
                    fetchFilterLists(['available', 'inUse', 'maintanance'], selectedIsRental, selectedRentalStartDateRange, selectedRentalEndDateRange);
                  } else fetchEquipments();
                }
              }}
          />
        </Col>
        <Col xl={{ span: 5 }} lg={{ span: 5 }} md={{ span: 5 }} sm={{ span: 5 }} xs={{ span: 5 }}>
            <Selectable
              allowClear
              name="isRental"
              requiredMsg='isRental is required'
              placeholder='Rental / Owned'
              firstName='name'
              data={equipmentIsRentalList}
              width={400}
              showSearch={false}
              handleSelectChange={(isRental) => {
                let rental = JSON.stringify(isRental);
                if ((selectedStatus && rental) || (selectedRentalStartDateRange && rental) || (selectedRentalEndDateRange && rental) ) {
                  fetchFilterList(null, rental, null, null);
                  setSelectedIsRental(rental);
                }
                if ((!selectedStatus && rental) || (!selectedRentalStartDateRange && rental) || (!selectedRentalEndDateRange && rental)) {
                  fetchFilterList(['available', 'inUse', 'maintanance'], rental, null, null);
                  setSelectedIsRental(rental);
                }
                if (!rental) {
                  setSelectedIsRental(null);
                  if (selectedStatus) {
                    if (selectedStatus || selectedRentalStartDateRange || selectedRentalEndDateRange) {
                      fetchFilterLists(selectedStatus, null, selectedRentalStartDateRange, selectedRentalEndDateRange);
                    } else fetchEquipments();
                  } else {
                    if (selectedStatus || selectedRentalStartDateRange || selectedRentalEndDateRange) {
                      fetchFilterLists(['available', 'inUse', 'maintanance'], null, selectedRentalStartDateRange, selectedRentalEndDateRange);
                    } else fetchEquipments();
                  }
                }
              }}
          />
        </Col>
        <Col xl={{ span: 5 }} lg={{ span: 5 }} md={{ span: 5 }} sm={{ span: 5 }} xs={{ span: 5 }}>
          {/* <RangePicker
            onChange={onRangeChangeForRentalStartDate}
          /> */}
        </Col> 
        <Col xl={{ span: 5 }} lg={{ span: 5 }} md={{ span: 5 }} sm={{ span: 5 }} xs={{ span: 5 }}>
          {/* <RangePicker
            onChange={onRangeChangeForRentalEndDate}
          /> */}
        </Col>             
      </Row> 
  </>


  const onEditRow = async (record, isDelete = false) => {

    if (!isDelete) {
      navigate('/equipments/form', {
        state: {
          defaultEquipment: record,
          isEditEquipment: true,
          equipmentNameList: equipmentNameList
        }
      });
    }

    if (isDelete) {
      showDeleteConfirm(record);
      return;
    }
  };

  const handleChangeFilterInput = async (e) => {
    setFilterInputValue(e.target.value);
  };

  const onFilterValues = async () => {
    if (filterInputValue) {
      const res = await getEquipmentsByStatus(['available', 'inUse', 'maintanance'], null, null, null, pageCount, skipCount, filterInputValue);
      setEquipmentsList(res.data?.data);
      setPaginationTotal(res.data?.totalLength);
      return;
    }
    fetchEquipments();
  };

  const handleSizeChange = (currentPage, size) => {
    setPageCount(size);
    fetchEquipments();
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

  return (
    <div>
      <Row align='middle' justify='space-between'>
        <Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }} >
          <h2 className='allPageHeader'>Equipments</h2>
        </Col>
        <Col>
          <AppButton
            label='+ Add Equipment'
            onClick={() => {
              navigate('/equipments/form', {
                state: {
                  defaultEquipment: null,
                  isEditEquipment: false,
                  equipmentNameList: equipmentNameList
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
          extraFilter={true}
          extraFilterBox={extraFilter}
        />}
      />
      <Collapsible
        label='List'
        children={<AppTable
          handleSort={handleSort}
          dataSource={equipmentsList}
          columns={projectColumns}
          pageSize={pageCount}
          currentPage={currentPage}
          handlePageChange={handlePageChange}
          paginationTotal={paginationTotal}
          showSizeChanger={true}
          onShowSizeChange={handleSizeChange}
          scroll={{ x: 'calc(700px + 50%)' }}
        />}
      />
    </div>
  )
}

export default Equipments;