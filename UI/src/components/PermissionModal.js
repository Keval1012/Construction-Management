import { Form, Row, Tree } from 'antd';
import React, { useEffect, useState } from 'react';
import { getAllAccessPermissionsByRoleId, getAllModulePermissions } from '../API/Api';
import AppButton from './AppButton';

const PermissionModal = ({ defaultRole, setPermissionModalOpen, handlePemissionFormValues }) => {

    // const { Panel } = Collapse;
    const [rolePermissionForm] = Form.useForm();

    const [modulePermissions, setModulePermissions] = useState([]);
    const [listingModulePermissions, setListingModulePermissions] = useState([]);
    const [allCheckedPermissions, setAllCheckedPermissions] = useState([]);
    const [defaultAccessPermissions, setDefaultAccessPermissions] = useState([]);
    const [grantedPermissions, setGrantedPermissions] = useState([]);

    useEffect(() => {
        fetchModulePermissions();
        if (defaultRole) {
            fetchAllAccessPermissions();
        }
    }, []);

    useEffect(() => {
        if (modulePermissions?.length > 0) {
            let temp = [];
            for (let i = 0; i < modulePermissions.length; i++) {
                const ele = modulePermissions[i];
                let splitName0 = ele?.name?.split('.')[0];
                let splitName1 = ele?.name?.split('.')[1];
                let isExist = temp.find(o => o.title === splitName0);

                if (i === 0) {
                    temp.push({
                        title: splitName0,
                        key: i,
                        children: [{
                            title: splitName1,
                            // key: Date.now() + Math.floor(Math.random() * 10000),
                            key: ele?.name,
                            // disabled: false,
                            checked: true
                        }]
                    });
                }
                if ((i > 0) && (isExist)) {
                    temp.filter(o => {
                        if (o.title === splitName0) {
                            o.children.push({
                                title: splitName1,
                                // key: Date.now() + Math.floor(Math.random()*10000),
                                key: ele?.name,
                                // disabled: false,
                                checked: true
                            });
                        }
                        return o;
                    });
                }
                if ((i > 0) && (!isExist)) {
                    temp.push({
                        title: splitName0,
                        key: i,
                        children: [{
                            title: splitName1,
                            // key: Date.now() + Math.floor(Math.random()*10000),
                            key: ele?.name,
                            // disabled: false,
                            checked: true
                        }]
                    });
                }
            }
            setListingModulePermissions(temp);
        }
    }, [modulePermissions]);

    useEffect(() => {
        if (defaultAccessPermissions?.length > 0) {
            let temp = [];
            defaultAccessPermissions.forEach(o => {
                temp.push(o.name);
            });
            setGrantedPermissions(temp);
        }
    }, [defaultAccessPermissions]);

    const fetchModulePermissions = async () => {
        const res = await getAllModulePermissions();
        setModulePermissions(res.data?.data);
    };

    const fetchAllAccessPermissions = async () => {
        const res = await getAllAccessPermissionsByRoleId(defaultRole._id);
        setDefaultAccessPermissions(res.data?.data);
    };

    const onCheckPermission = (val, info) => {
        setAllCheckedPermissions(val);
        let list = [];
        val.forEach(o => {
            if (isNaN(o)) {
                list.push(o);
            }
        });
        setGrantedPermissions(list);
    };

    return (
        <Form
            preserve={false}
            form={rolePermissionForm}
            name="rolePermissionForm"
            className="rolePermissionForm"
            // onFinish={(values) => handleCategoryFormValues(values, imageFile, categoryAddForm)}
            scrollToFirstError
        >
            <h2 className='marginVertical'>{defaultRole?.displayName} Permissions</h2>
            <div className='treeNodesDiv'>
                <Tree
                    checkable
                    onCheck={onCheckPermission}
                    // defaultSelectedKeys={grantedPermissions}
                    // defaultCheckedKeys={['Category.Delete', 'Category.Read']}
                    checkedKeys={grantedPermissions}
                    // defaultExpandAll 
                    treeData={listingModulePermissions}
                    // showIcon={false}
                    // showLine
                    blockNode={false}
                />
            </div>
            <Row style={{ width: '35%', marginLeft: 'auto', marginTop: '10%' }} justify="end" className="formBtnRow" >
                {/* <Col xl={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }} className="formBtnCol" > */}
                <AppButton
                    label='Cancel'
                    className="appButton formWidth"
                    onClick={() => {
                        setPermissionModalOpen(false);
                    }}
                />
                <AppButton
                    // htmlType='submit'
                    onClick={() => {
                        handlePemissionFormValues(allCheckedPermissions);
                    }}
                    className='appPrimaryButton formWidth'
                    label='Save Changes'
                />
                {/* </Col> */}
            </Row>
        </Form>
    )
}

export default PermissionModal;