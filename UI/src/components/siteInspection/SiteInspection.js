import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthProvider';
import { Row, Col, Modal, DatePicker } from 'antd';
import { getInspectionByQuery } from '../../API/Api.js';
import Table from '../AppTable';
import Button from '../AppButton';
import FilterBox from '../FilterBox.js';
import Collapsible from '../Collapsible.js';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import '../../styles/siteInspection.css';
import { siteInspectionTypeList } from '../../constants';
import dayjs from 'dayjs';

const SiteInspection = ({ defaultProject }) => {
  
  const initialColumns = [
    {
      key: "inspectionType",
      title: "Type",
      dataIndex: "inspectionType",
      // filters: data.map(o => ({ text: o.name, value: o.key })),
      // onFilter: (value, record) => record.name.indexOf(value) === 0,
      sorter: false,
      width: '25%',
      render: (val) => val ? <div>{siteInspectionTypeList?.find(o => o._id === val)?.name}</div> : <div>-</div>,
    },
    {
      key: "description",
      title: "Inspection",
      dataIndex: "description",
      sorter: false,
    },
    {
      key: "location",
      title: "Location",
      dataIndex: "location",
      sorter: false,
    },
    {
      key: "inspectionDate",
      title: "Date",
      dataIndex: "inspectionDate",
      sorter: false,
      render: (val) => val ? <div>{dayjs(new Date(val)).format('DD/MM/YYYY')}</div> : <div>-</div>,
    },
    {
      key: "actions",
      title: "Actions",
      dataIndex: "action",
      width: '0.1%',
      render: (index, record) => <div className='d-flex-between'>
        {/* <EditOutlined className='tableEditIcon' onClick={() => onEditRow(record)} /> */}
        <DeleteOutlined className='tableDeleteIcon' onClick={() => onEditRow(record, true)} />
      </div>
    }
  ];

  const { RangePicker } = DatePicker;
  const confirm = Modal.confirm;
  const navigate = useNavigate();
  const { userId } = useContext(AuthContext)??{};
  const { currentUserRole } = useSelector((state) => state.userData)??{};
  const [inspectionsList, setInspectionsList] = useState([]);
  const [siteColumns, setSiteColumns] = useState(initialColumns);
  const [pageCount, setPageCount] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [skipCount, setSkipCount] = useState(0);
  const [paginationTotal, setPaginationTotal] = useState(0);
  const [filterInputValue, setFilterInputValue] = useState('');

  useEffect(() => {
    fetchInspections();
    fetchFilterList();
  }, []);

  useEffect(() => {
    if (filterInputValue) {
      onFilterValues();
    } else {
      fetchInspections();
    }
  }, [skipCount]);

  useEffect(() => {
    if (currentUserRole !== 'employee') {
      let temp = siteColumns;
      if (!(temp.find(o => o.key === 'inspectorDetails'))) {
        temp.splice(3, 0, {
          key: "inspectorDetails",
          title: "Inspector",
          dataIndex: "inspectorDetails",
          sorter: false,
          render: (val) => val ? <div>{val?.name}</div> : <div>-</div>
        });
        setSiteColumns(temp);
      }
    }
  }, [JSON.stringify(currentUserRole)]);

  const showDeleteConfirm = (record) => {
    confirm({
        title: `Inspection name: ${record.name} `,
        content: 'Are you sure you want to remove this inspection?',
        okText: 'Remove',
        okType: 'danger',
        onOk: async () => {
          // await deleteRole(record._id);
          fetchInspections();
        },
        onCancel() { },
    });
  };

  const fetchInspections = async () => {
    let res;
    if (currentUserRole === 'employee') res = await getInspectionByQuery(null, defaultProject?._id, userId, null, pageCount, skipCount);
    if (currentUserRole === 'builder') res = await getInspectionByQuery(null, defaultProject?._id, null, null, pageCount, skipCount);
    if (currentUserRole === 'hostAdmin') res = await getInspectionByQuery(null, defaultProject?._id, null, null, pageCount, skipCount);
    if (res?.data?.success) setInspectionsList(res.data?.data);
    if (res?.data?.success) setPaginationTotal(res.data?.totalLength);
  };

  const fetchFilterList = async (inspectionDate) => {
    const res = await getInspectionByQuery(null, null, null, inspectionDate, pageCount, skipCount);
    if (res?.data?.status === 200) {
      setInspectionsList(res?.data?.data);
    }
  }

  const onRangeChangeForInspectionDate = (date, inspectionDate) => {
    let obj = Object.assign({ start: inspectionDate[0], end: inspectionDate[1] });
    fetchFilterList(obj);
  };

  const extraFilter = <>
    <Col xl={{ span: 6 }} md={{ span: 6 }} sm={{ span: 6 }} xs={{ span: 6 }}>
        <h4 className='labelMargin'>By Inspection Date</h4>
        <RangePicker
          onChange={onRangeChangeForInspectionDate}
          placeholder={["Insp. Start", "Insp. End"]}
        />
    </Col>    
  </>

  const handleChangeFilterInput = (e) => {
    setFilterInputValue(e.target.value);
  };

  const onEditRow = async (record, isDelete = false) => {
    if (!isDelete) {
      navigate('/siteInspection/form', { state: {
        isEditInspection: true,
        defaultInspection: record,
        defaultProject: defaultProject
      }});
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

  const handleSort = () => {};

  const onFilterValues = async () => {
    if (filterInputValue) {
      const res = await getInspectionByQuery(null, null, null, null, pageCount, skipCount, filterInputValue);
      if (res?.data?.success) setInspectionsList(res.data?.data);
      if (res?.data?.success) setPaginationTotal(res.data?.totalLength);
      return;
    }
    fetchInspections();
  };

  const handleSizeChange = (currentPage, size) => {
    setPageCount(size);
    fetchInspections();
  };

  return (
    <div>
      <Row align='middle' justify='space-between'>
        <Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }} >
          <h2 className='allPageHeader'>All Inspections</h2>  
        </Col>
        <Col>
            <Button
              label='+ Add Inspection' 
              onClick={() => {
                navigate('/siteInspection/form', { state: {
                    isEditInspection: false,
                    defaultInspection: null,
                    defaultProject: defaultProject
                }});
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
          labelName={true}
        />}
      />
      <Collapsible
        label='List'
        children={<Table
          handleSort={handleSort}
          dataSource={inspectionsList}
          columns={siteColumns}
          pageSize={pageCount}
          currentPage={currentPage}
          handlePageChange={handlePageChange}
          paginationTotal={paginationTotal}
          showSizeChanger={true}
          onShowSizeChange={handleSizeChange}
        />}
      />
    </div>
  )
}

export default SiteInspection;