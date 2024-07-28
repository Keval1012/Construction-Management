import { DeleteOutlined, EditOutlined, KeyOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { Row, Col, message, Modal } from 'antd';
import { addRole, addUpdateAccessPermissions, deleteRole, getRoles, updateRole } from '../API/Api.js';
import AppModal from '../components/AppModal';
import Table from '../components/AppTable';
import Button from '../components/AppButton';
import AddEditRoleForm from '../components/AddEditRoleForm';
import FilterBox from '../components/FilterBox.js';
import PermissionModal from '../components/PermissionModal';
import Collapsible from '../components/Collapsible.js';

const Roles = () => {

  const confirm = Modal.confirm;
  const [rolesList, setRolesList] = useState([]);
  const [pageCount, setPageCount] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [skipCount, setSkipCount] = useState(0);
  const [paginationTotal, setPaginationTotal] = useState(0);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [defaultRole, setDefaultRole] = useState(null);
  const [isEditRole, setIsEditRole] = useState(false);
  const [filterInputValue, setFilterInputValue] = useState('');
  const [permissionModalOpen, setPermissionModalOpen] = useState(false);

  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    if (filterInputValue) {
      onFilterValues();
    } else {
      fetchRoles();
    }
  }, [skipCount]);


  const showDeleteConfirm = (record) => {
    confirm({
        title: `Role name: ${record.name} `,
        content: 'Are you sure you want to remove this role?',
        okText: 'Remove',
        okType: 'danger',
        onOk: async () => {
            const res = await deleteRole(record._id);
            if (res?.data?.success) {
              message.success(record?.name + ' Role deleted successfully');
              fetchRoles();
            } else {
              message.error(res?.data?.message);
            }
        },
        onCancel() { },
    });
  };

  const rolesColumns = [
    {
      key: "name",
      title: "Role",
      dataIndex: "name",
      // filters: data.map(o => ({ text: o.name, value: o.key })),
      // onFilter: (value, record) => record.name.indexOf(value) === 0,
      sorter: false,
      width: '25%'
    },
    {
      key: "displayName",
      title: "Display Name",
      dataIndex: "displayName",
      sorter: false,
    },
    {
      key: "actions",
      title: "Actions",
      dataIndex: "action",
      width: '10%',
      render: (index, record) => <div className='d-flex-between'>
        <EditOutlined className='tableEditIcon' onClick={() => onEditRow(record)} />
        <KeyOutlined className='tableEditIcon' onClick={() => onEditPermissions(record)} />
        <DeleteOutlined className='tableDeleteIcon' onClick={() => onEditRow(record, true)} />
      </div>
    }
  ];

  const fetchRoles = async () => {
    const res = await getRoles(pageCount, skipCount);
    setRolesList(res.data?.data);
    setPaginationTotal(res.data?.totalLength);
  };

  const handleChangeFilterInput = (e) => {
    setFilterInputValue(e.target.value);
  };

  const onEditPermissions = async (record) => {
    setDefaultRole(record);
    setPermissionModalOpen(true);
  };

  const onEditRow = async (record, isDelete = false) => {
    if (!isDelete) {
      setDefaultRole(record);
      setIsEditRole(true);
      setRoleModalOpen(true);
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

  const handleOnOkModal = () => {
    setRoleModalOpen(false);
  };

  const handleOnCancelModal = () => {
    setRoleModalOpen(false);
    setDefaultRole(null);
  };

  const handleRoleFormValues = async (form) => {
    let checkVal = form.getFieldsValue();
    
    if (checkVal?.addRoleName && checkVal?.addRoleDisplayName) {

      if(form.getFieldsError().filter(x => x.errors.length > 0).length > 0){
        return;
      }

      let data = { name: checkVal.addRoleName, displayName: checkVal.addRoleDisplayName };

      if (isEditRole) {
        try {

          const res = await updateRole(defaultRole?._id, data);
          if (res.data?.success) {
              setRoleModalOpen(false);
              message.success(defaultRole.name + 'Role Updated Successfully');
              fetchRoles();
              return;
          } else message.error(res.data?.message);

        } catch (error) {
          message.error('Something went wrong' + error);
        }
      }

      if (!isEditRole) {
        try {

          const res = await addRole(data);
          if (res.data?.success) {
            setRoleModalOpen(false);
            message.success('Role Added Successfully')
            fetchRoles();
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
      const res = await getRoles(pageCount, skipCount, filterInputValue);
      setRolesList(res.data?.data);
      setPaginationTotal(res.data?.totalLength);
      return;
    }
    fetchRoles();
  };

  const handleSizeChange = (currentPage, size) => {
    setPageCount(size);
    fetchRoles();
  };

  const handleOnCancelPermissionModal = () => {
    setPermissionModalOpen(false);
  };

  const handleOnSavePermission = async (list) => {

    let temp = [];

    list.forEach(o => {
      if (isNaN(o)) {
        temp.push(o);
      }
    });

    const res = await addUpdateAccessPermissions({ roleId: defaultRole._id, permissionList: temp });
    if (res.data?.status === 200) {
      message.success('Permissions Saved.');
      setPermissionModalOpen(false);
    } else {
      message.error('Something went wrong');
    }
  };

  return (
    <div>
      <Row align='middle' justify='space-between'>
        <Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }} >
          <h2 className='allPageHeader'>Roles List</h2>  
        </Col>
        <Col>
            <Button
              label='+ Add Role' 
              onClick={() => { 
                setIsEditRole(false); 
                setDefaultRole(null);
                setRoleModalOpen(true);
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
          dataSource={rolesList}
          columns={rolesColumns}
          pageSize={pageCount}
          currentPage={currentPage}
          handlePageChange={handlePageChange}
          paginationTotal={paginationTotal}
          showSizeChanger={true}
          onShowSizeChange={handleSizeChange}
        />}
      />
      <AppModal
        open={roleModalOpen}
        children={
          <AddEditRoleForm
            defaultRole={defaultRole}
            isEditRole={isEditRole}
            setRoleModalOpen={setRoleModalOpen} 
            handleRoleFormValues={handleRoleFormValues}
          />}
        onOk={handleOnOkModal}
        onCancel={handleOnCancelModal}
      />
      <AppModal 
        open={permissionModalOpen}
        width={700}
        children={
          <PermissionModal
            defaultRole={defaultRole}
            // defaultPermissionsList={allPermissions}
            // defaultModulesList={allModules}
            setPermissionModalOpen={setPermissionModalOpen}
            handlePemissionFormValues={handleOnSavePermission}
          />
        }
        // onOk={handleOnSavePermission}
        onCancel={handleOnCancelPermissionModal}
      />
    </div>
  )
}

export default Roles;