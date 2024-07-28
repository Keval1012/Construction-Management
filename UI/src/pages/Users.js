import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Col, message, Modal, Row } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { addUser, deleteUser, getAllAssignEmployeeOfBuilder, getBuilder, getEmployee, getEmployeeByBuilder, getUser, updateUser } from '../API/Api';
import AddEditUserForm from '../components/AddEditUserForm';
import AppButton from '../components/AppButton';
import AppModal from '../components/AppModal';
import AppTable from '../components/AppTable';
import FilterBox from '../components/FilterBox';
import Collapsible from '../components/Collapsible';
import { AuthContext } from '../context/AuthProvider';
import { employeeJobTitleList } from '../constants';
import Selectable from '../components/Selectable';
import { useDispatch, useSelector } from 'react-redux';
import { setAllAssignCurrentEmployee } from '../redux/features/userDataSlice';

const Users = ({ screenType }) => {

  const initialColumns = [
    {
      key: "name",
      title: "Name",
      dataIndex: "name",
      // filters: data.map(o => ({ text: o.name, value: o.key })),
      // onFilter: (value, record) => record.name.indexOf(value) === 0,
      sorter: false,
      width: '5%',
      render: (val) => val ? <div>{val}</div> : <div>-</div>
    },
    {
      key: "surname",
      title: "Surname",
      dataIndex: "surname",
      sorter: false,
      width: '5%',
      render: (val) => val ? <div>{val}</div> : <div>-</div>
    },
    {
      key: "email",
      title: "Email",
      dataIndex: "email",
      sorter: false,
      width: '5%',
      render: (val) => val ? <div>{val}</div> : <div>-</div>
    },
    {
      key: "mobile",
      title: "Mobile",
      dataIndex: "mobile",
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
        {currentUserRole === 'builder' && <DeleteOutlined className='tableDeleteIcon' onClick={() => onEditRow(record, true)} />}
      </div>
    }
  ];

  const dispatch = useDispatch();
  const { userId, currentRole } = useContext(AuthContext)??{};
  const { currentUserRole, allAssignCurrentEmployee } = useSelector((state) => state.userData) ?? {};
  const [usersList, setUsersList] = useState([]);
  const [userColumns, setUserColumns] = useState(initialColumns);
  const [active, setActive] = useState(true);
  const [pageCount, setPageCount] = useState(5);
  const [currentPage, setCurrentPage] = useState(0);
  const [paginationTotal, setPaginationTotal] = useState(0);
  const [skipCount, setSkipCount] = useState(0);
  const [filterInputValue, setFilterInputValue] = useState('');
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [isEditUser, setIsEditUser] = useState(false);
  const [isAddEmployee, setIsAddEmployee] = useState(false);
  const [defaultUser, setDefaultUser] = useState(null);
  const [selectedJobTitle, setSelectedJobTitle] = useState('');

  const showDeleteConfirm = (record) => {
    Modal.confirm({
      title: `User name: ${record.name} `,
      content: 'Are you sure you want to remove this User?',
      okText: 'Remove',
      okType: 'danger',
      onOk: async () => {
        try {
          const res = await deleteUser(record._id);
          if (res.data?.success) {
            message.success(record.name + ' User deleted successfully');
            fetchUsers();
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
      fetchUsers();
    }
  }, [skipCount, active]);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchAllAssignEmployeeOfBuilder();
  }, [JSON.stringify(currentRole), JSON.stringify(userId), JSON.stringify(screenType)]);

  useEffect(() => {
    if (screenType === 'Employee' && userColumns?.length > 0) {
      let temp = userColumns;
      if (!temp?.find(o => o.key === 'jobTitle')) {
        temp.splice(2, 0, {
          key: "jobTitle",
          title: "Job Title",
          dataIndex: "jobTitle",
          sorter: false,
          width: '5%',
          render: (val) => {
            if (val) {
              const findJob = employeeJobTitleList.find(o => o._id === val);
              return <div>{findJob?.name}</div> 
            }
            else return <div>-</div>
          } 
        });
      }
      setUserColumns(temp);
    }
  }, [JSON.stringify(screenType)]);

  const fetchUsers = async () => {
    let res;
    if (screenType === 'User') res = await getUser(pageCount, skipCount);
    if (screenType === 'Employee' && currentRole === 'builder') res = await getEmployeeByBuilder(userId, null, pageCount, skipCount);
    if (screenType === 'Employee' && currentRole === 'hostAdmin') res = await getEmployee(pageCount, skipCount);
    if (screenType === 'Builder') res = await getBuilder(pageCount, skipCount);
    if (res?.data?.success) {
      setUsersList(res.data?.data);
      setPaginationTotal(res.data?.totalLength);
    }
  };

  const fetchAllAssignEmployeeOfBuilder = async () => {
    if (currentUserRole === 'builder' && userId) { 
      const res = await getAllAssignEmployeeOfBuilder(userId);
      if (res?.data?.success) {
        dispatch(setAllAssignCurrentEmployee(res?.data?.data));
      }
    }
  }; 
  
  const fetchJobTitle = async (jobTitle) => {
    if (currentRole === 'builder') {
      const res = await getEmployeeByBuilder(userId, jobTitle, pageCount, skipCount);
      if (res?.data?.status === 200)  {
        setUsersList(res?.data?.data);
      }
    }  
    if (currentRole === 'hostAdmin') {
      const res = await getEmployee(pageCount, skipCount, null, jobTitle);
      if (res?.data?.status === 200)  {
        setUsersList(res?.data?.data);
      }
    }  
  }

  const extraFilter = <>
    {(screenType === 'Employee' && (currentRole === 'builder' || currentRole === 'hostAdmin')) &&
      <Row className='firstRow extraFilterRow' justify='space-between'>
        <Col xl={{ span: 6 }} lg={{ span: 6 }} md={{ span: 6 }} sm={{ span: 6 }} xs={{ span: 6 }}>
          <Selectable
            allowClear
            name="jobTitle"
            requiredMsg='Job Title is required'
            placeholder='By Job Title'
            firstName='name'
            data={employeeJobTitleList}
            width={400}
            showSearch={false}
            handleSelectChange={(jobTitle) => {
              debugger
              fetchJobTitle(jobTitle);
              setSelectedJobTitle(jobTitle);
            }}
          />
        </Col>
      </Row>
    }
  </>; 

  const onEditRow = async (record, isDelete = false) => {
    if (!isDelete) {
      setDefaultUser(record);
      setIsEditUser(true);
      setUserModalOpen(true);
    }

    if (isDelete) {
      if ((screenType === 'Employee') && (allAssignCurrentEmployee?.find((item) => item?.assignTo === record?._id))) {
        message.error('Can not remove as long as He/She has task assigned!');
      } else {
        showDeleteConfirm(record);
        return;
      }
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
      let res;
      if (screenType === 'User') res = await getUser(pageCount, skipCount, filterInputValue);
      if (screenType === 'Employee' && currentRole === 'builder') res = await getEmployeeByBuilder(userId, null, pageCount, skipCount, filterInputValue);
      if (screenType === 'Employee' && currentRole === 'hostAdmin') res = await getEmployee(pageCount, skipCount, filterInputValue);
      if (screenType === 'Builder') res = await getBuilder(pageCount, skipCount, filterInputValue);
      if (res?.data?.success) {
        setUsersList(res.data?.data);
        setPaginationTotal(res.data?.totalLength);
      }
      return;
    }
    fetchUsers();
  };

  const handleSizeChange = (currentPage, size) => {
    setPageCount(size);
    fetchUsers();
  };

  const handleOnOkModal = () => { };

  const handleOnCancelModal = () => {
    setDefaultUser(null);
    setUserModalOpen(false);
  };

  const handleUserFormValues = async (form) => {
    // debugger
    const values = form.getFieldsValue();
    const { addUserName, addUserSurname, addUserUsername, addUserEmail, addUserJobTitle, addUserMobile, addUserRole, addUserPassword, addUserStatus } = values;

    if (!isEditUser) {
      if (addUserName && addUserSurname && addUserUsername && addUserEmail && addUserMobile && addUserRole && addUserPassword && (addUserStatus === false || addUserStatus === true)) {
    
        if (form.getFieldsError().filter(x => x.errors.length > 0).length > 0) {
          return;
        }
  
        let data = {
          name: addUserName,
          surname: addUserSurname,
          username: addUserUsername,
          role: addUserRole,
          email: addUserEmail,
          mobile: addUserMobile,
          status: addUserStatus,
          password: addUserPassword
        };
  
          // if ((isAddEmployee || screenType === 'Employee') && addUserJobTitle && currentRole === 'builder') {
          //   data['builderId'] = userId;
          //   data['jobTitle'] = addUserJobTitle;
          // } else return message.error('Please add required fields');
  
          data['builderId'] = userId;
          data['jobTitle'] = addUserJobTitle ? addUserJobTitle : '';

        if (!isEditUser) {
          try {
            // let data = { name: checkVal.addUserName }
            const res = await addUser(data);
            if (res.data?.success) {
              setUserModalOpen(false);
              message.success('User Added Successfully')
              fetchUsers();
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
    }

    if (isEditUser) {
      if (addUserName && addUserSurname && addUserUsername && addUserEmail && addUserMobile && (addUserStatus === false || addUserStatus === true)) {
    
        if (form.getFieldsError().filter(x => x.errors.length > 0).length > 0) {
          return;
        }
  
        let data = {
          name: addUserName,
          surname: addUserSurname,
          username: addUserUsername,
          email: addUserEmail,
          mobile: addUserMobile,
          status: addUserStatus
        };
  
        // if ((isAddEmployee || screenType === 'Employee') && addUserJobTitle && currentRole === 'builder') {
        //   data['builderId'] = userId;
        //   data['jobTitle'] = addUserJobTitle;
        // } else return message.error('Please add required fields');

        data['builderId'] = userId;
        data['jobTitle'] = addUserJobTitle;
  
        if (isEditUser) {
          try {
            const res = await updateUser(defaultUser?._id, data);
            if (res.data?.success) {
              setUserModalOpen(false);
              message.success(defaultUser.name + ' User Updated Successfully');
              fetchUsers();
            } else message.error(res.data?.message);
          } catch (error) {
            message.error('Something went wrong' + error);
          }
        }
      } else {
        message.error('Please add required fields');
      }
    }

    // if (addUserName && addUserSurname && addUserUsername && addUserEmail && addUserMobile && addUserRole && addUserPassword && (addUserStatus === false || addUserStatus === true)) {
    // // if (name && surname && username && email && mobile && role && password && (status === false || status === true)) {

    //   if (form.getFieldsError().filter(x => x.errors.length > 0).length > 0) {
    //     return;
    //   }

    //   let data = {
    //     name: addUserName,
    //     surname: addUserSurname,
    //     username: addUserUsername,
    //     role: addUserRole,
    //     email: addUserEmail,
    //     mobile: addUserMobile,
    //     status: addUserStatus,
    //     password: addUserPassword,
    //   };

    //   if ((isAddEmployee || screenType === 'Employee') && addUserJobTitle && currentRole === 'builder') {
    //     data['builderId'] = userId;
    //     data['jobTitle'] = addUserJobTitle;
    //   } else return message.error('Please add required fields');

    //   if (isEditUser) {
    //     try {
    //       const res = await updateUser(defaultUser?._id, data);
    //       if (res.data?.success) {
    //         setUserModalOpen(false);
    //         message.success(defaultUser.name + ' User Updated Successfully');
    //         fetchUsers();
    //       } else message.error(res.data?.message);
    //     } catch (error) {
    //       message.error('Something went wrong' + error);
    //     }
    //   }

    //   if (!isEditUser) {
    //     try {
    //       // let data = { name: checkVal.addUserName }
    //       const res = await addUser(data);
    //       if (res.data?.success) {
    //         setUserModalOpen(false);
    //         message.success('User Added Successfully')
    //         fetchUsers();
    //         return;
    //       } else {
    //         message.error(res.data?.message);
    //       }

    //     } catch (error) {
    //       // message.error('Something went wrong' + error);
    //       message.error(error.response.data.error);
    //     }
    //   }
    // } else {
    //   message.error('Please add required fields');
    // }
  };

  const handleUserRoleSelect = (val, roleList) => {
    if (roleList?.length > 0 && val) {
      if (roleList?.find(o => o._id === val)?.name === 'employee') setIsAddEmployee(true);
    }
  };

  return (
    <div>
      <Row align='middle' justify='space-between'>
        <Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }} >
          <h2 className='allPageHeader'>All {(screenType === 'User') ? 'Users' : (screenType === 'Employee' ? 'Employees' : (screenType === 'Builder') ? 'Builders' : '')}</h2>
        </Col>
        <Col>
          <AppButton
            label={`+ Add ${(screenType === 'User') ? 'User' : (screenType === 'Employee' ? 'Employee' : (screenType === 'Builder') ? 'Builder' : '')}`}
            onClick={() => {
              setIsEditUser(false);
              setDefaultUser(null);
              setUserModalOpen(true);
            }}
          />
        </Col>
      </Row>
      {/* <Space direction="vertical"> */}
      <Collapsible
        label='Advance Search'
        children={<FilterBox
          isCard={true}
          active={active}
          handleChangeFilterInput={handleChangeFilterInput}
          onFilterValues={onFilterValues}
          // onChangeActiveFilter={onChangeActiveFilter}
          onChangeActiveFilter={() => setActive(!active)}
          extraFilter={true}
          extraFilterBox={extraFilter}
        />}
      />
      <Collapsible
        label='List'
        children={<AppTable
          handleSort={handleSort}
          dataSource={usersList}
          columns={userColumns}
          pageSize={pageCount}
          currentPage={currentPage}
          handlePageChange={handlePageChange}
          paginationTotal={paginationTotal}
          showSizeChanger={true}
          onShowSizeChange={handleSizeChange}
        />}
      />
      {/* </Space> */}
      <AppModal
        open={userModalOpen}
        children={
          <AddEditUserForm
            defaultUser={defaultUser}
            setDefaultUser={setDefaultUser}
            isEditUser={isEditUser}
            screenType={screenType}
            setUserModalOpen={setUserModalOpen}
            handleUserRoleSelect={handleUserRoleSelect}
            handleUserFormValues={handleUserFormValues}
          />}
        onOk={handleOnOkModal}
        onCancel={handleOnCancelModal}
      />
    </div>
  )
}

export default Users;