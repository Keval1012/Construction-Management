import React, { useContext, useEffect, useState } from 'react';
import { Checkbox, Col, Divider, Form, message, Radio, Row } from "antd";
import TextInput from "./TextInput";
import Button from "./AppButton";
import "../styles/addUserForm.css";
import { getAllRoles, getAllUserRole } from '../API/Api';
import Selectable from './Selectable';
import { employeeJobTitleList } from '../constants';
import { AuthContext } from '../context/AuthProvider';
// import { handlePressEnter } from '../helpers/helper';
// import { getAllUnitUQC } from '../API/Api';

const AddEditUserForm = ({
  isEditUser,
  handleUserFormValues,
  setUserModalOpen,
  defaultUser,
  screenType,
  handleUserRoleSelect,
  setDefaultUser,
}) => {

    const [userAddForm] = Form.useForm();
    const { currentRole } = useContext(AuthContext)??{};
    const [allRoleData, setAllRoleData] = useState([]);
    // const [defaultUserRole, setDefaultUserRole] = useState('');

    useEffect(() => {
        fetchRoles();
    }, []);

    const fetchRoles = async () => {
        const res = await getAllRoles();
        setAllRoleData(res.data?.data);
    };

    const checkConfirmPassword = (e) => {
        let { addUserPassword } = userAddForm.getFieldsValue();
        if (addUserPassword !== e.target.value) {
            userAddForm.setFields([{ name: 'addUserConfirmPassword', errors: ['not matched with password']} ])
            return;
        } else {
            userAddForm.setFields([{ name: 'addUserConfirmPassword', errors: []} ]);
        }
    };

    const handleUserRoleSelectChange = (val) => {
        handleUserRoleSelect(val, allRoleData);
    };

    const getDefaultRoleValue = () => {
        if (screenType === 'Employee') {
            const findRole = allRoleData?.find(o => o.name === 'employee');
            userAddForm.setFieldValue('addUserRole', findRole?._id);
            return 'employee';
        }
        if (screenType === 'Builder') {
            const findRole = allRoleData?.find(o => o.name === 'builder');
            userAddForm.setFieldValue('addUserRole', findRole?._id);
            return 'builder';
        }
        return defaultUser?.userRoleDetails?.roleDetails?._id;
    };

    const isDisabledRole = () => {
        if (screenType === 'Employee' || screenType === 'Builder') return true;
        else return false;
    };

    return (
    <Form
        preserve={false}
        form={userAddForm}
        name="addUserForm"
        className="addUserForm"
        // onKeyDown={handleFormKeyDown}
        // onFinish={(values) => handleUserFormValues(userAddForm)}
        scrollToFirstError
    >
        <Row>
            {(isEditUser) ?
                <h2 className="modalHeader">Update {(screenType === 'User') ? 'User' : (screenType === 'Employee') ? 'Employee' : (screenType === 'Builder') ? 'Builder' : ''}</h2> 
                :
                <h2 className="modalHeader">Add New {(screenType === 'User') ? 'User' : (screenType === 'Employee') ? 'Employee' : (screenType === 'Builder') ? 'Builder' : ''}</h2>
            }
        </Row>
        <Divider />
        <div className='userFormContent'>
            <Row>
                <Col xl={{ span: 23 }} lg={{ span: 23 }} md={{ span: 23 }} sm={{ span: 23 }} xs={{ span: 23 }}>
                    <TextInput
                        name="addUserName"
                        defaultVal={defaultUser?.name}
                        className="createUserTextInput"
                        type='text'
                        required={true}
                        requiredMsg='Name is required'
                        max={40}
                        maxMsg="cannot be longer than 40 characters"
                        typeMsg="Enter a valid name!"
                        label="Name"
                    />
                </Col>
            </Row>
            <Row>
                <Col xl={{ span: 23 }} lg={{ span: 23 }} md={{ span: 23 }} sm={{ span: 23 }} xs={{ span: 23 }}>
                    <TextInput
                        name="addUserSurname"
                        defaultVal={defaultUser?.surname}
                        className="createUserTextInput"
                        type='text'
                        required={true}
                        requiredMsg='Surname is required'
                        max={40}
                        maxMsg="cannot be longer than 40 characters"
                        typeMsg="Enter a valid name!"
                        label="Surname"
                    />
                </Col>
            </Row>
            <Row>
                <Col xl={{ span: 23 }} lg={{ span: 23 }} md={{ span: 23 }} sm={{ span: 23 }} xs={{ span: 23 }}>
                    <TextInput
                        name="addUserUsername"
                        defaultVal={defaultUser?.username}
                        className="createUserTextInput"
                        type='text'
                        required={true}
                        requiredMsg='Username is required'
                        max={40}
                        maxMsg="cannot be longer than 40 characters"
                        typeMsg="Enter a valid username!"
                        label="Username"
                    />
                </Col>
            </Row>
            <Row>
                <Col xl={{ span: 23 }} lg={{ span: 23 }} md={{ span: 23 }} sm={{ span: 23 }} xs={{ span: 23 }}>
                    <TextInput
                        name="addUserEmail"
                        defaultVal={defaultUser?.email}
                        className="createUserTextInput"
                        type='email'
                        required={true}
                        requiredMsg='Email is required'
                        max={40}
                        maxMsg="cannot be longer than 40 characters"
                        typeMsg="Enter a valid email!"
                        label="Email"
                    />
                </Col>
            </Row>
            <Row>
                <Col xl={{ span: 23 }} lg={{ span: 23 }} md={{ span: 23 }} sm={{ span: 23 }} xs={{ span: 23 }}>
                    <TextInput
                        name="addUserMobile"
                        defaultVal={defaultUser?.mobile}
                        className="createUserTextInput"
                        type='text'
                        onKeyPress={(event) => {
                            if (!/[0-9]/.test(event.key)) {
                                event.preventDefault();
                            }
                        }}
                        required={true}
                        requiredMsg='Mobile is required'
                        min={10}
                        max={10}
                        maxMsg="cannot be longer than 10 characters"
                        typeMsg="Enter a valid mobile!"
                        label="Mobile"
                    />
                </Col>
            </Row>
            {!isEditUser &&
                <>
                    <Row>
                        <Col xl={{ span: 23 }} lg={{ span: 23 }} md={{ span: 23 }} sm={{ span: 23 }} xs={{ span: 23 }}>
                            <TextInput
                                name="addUserPassword"
                                defaultVal={defaultUser?.password}
                                className="createUserTextInput"
                                type='password'
                                required={true}
                                requiredMsg='Password is required'
                                max={40}
                                maxMsg="cannot be longer than 40 characters"
                                typeMsg="Enter a valid password!"
                                label="Password"
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col xl={{ span: 23 }} lg={{ span: 23 }} md={{ span: 23 }} sm={{ span: 23 }} xs={{ span: 23 }}>
                            <TextInput
                                name="addUserConfirmPassword"
                                defaultVal={defaultUser?.confirmPassword}
                                className="createUserTextInput"
                                type='password'
                                // dependencies={['addUserPassword']}
                                required={true}
                                onBlur={checkConfirmPassword}
                                requiredMsg='Confirm Password is required'
                                max={40}
                                maxMsg="cannot be longer than 40 characters"
                                typeMsg="Enter a valid password!"
                                label="Confirm Password"
                            />
                        </Col>
                    </Row>
                </>
            }
            {!(isEditUser && screenType === 'Employee') &&
                <Row>
                    <Col xl={{ span: 23 }} lg={{ span: 23 }} md={{ span: 23 }} sm={{ span: 23 }} xs={{ span: 23 }}>
                        <Selectable
                            label='Role'
                            name="addUserRole"
                            required={true}
                            // defaultVal={defaultUser?.userRoleDetails?.roleDetails?._id}
                            defaultVal={getDefaultRoleValue()}
                            disabled={isDisabledRole()}
                            // defaultVal={defaultUserRole}
                            firstName='name'
                            requiredMsg='select user role'
                            data={allRoleData}
                            width={400}
                            showSearch={true}
                            handleSelectChange={handleUserRoleSelectChange}
                        />
                    </Col>
                </Row>
            }
            {screenType === 'Employee' &&
                <Row>
                    <Col xl={{ span: 23 }} lg={{ span: 23 }} md={{ span: 23 }} sm={{ span: 23 }} xs={{ span: 23 }}>
                        <Selectable
                            label='Job Title'
                            name="addUserJobTitle"
                            required={true}
                            defaultVal={defaultUser?.jobTitle}
                            // defaultVal={defaultUserRole}
                            firstName='name'
                            requiredMsg='select job title'
                            data={employeeJobTitleList}
                            width={400}
                            showSearch={true}
                            handleSelectChange={handleUserRoleSelectChange}
                        />
                    </Col>
                </Row>
            }
            <Row>
                <Col xl={{ span: 23 }} lg={{ span: 23 }} md={{ span: 23 }} sm={{ span: 23 }} xs={{ span: 23 }}>
                    <Form.Item
                        name='addUserStatus' 
                        initialValue={defaultUser?.status} 
                        label='Is Active'
                        rules={[ { required: true, message: 'Status is Required' } ]}
                    >
                        <Radio.Group>
                            <Radio.Button value={true}>Yes</Radio.Button>
                            <Radio.Button value={false}>No</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                </Col>
            </Row>
        </div>
        <Divider />
        <Row justify="end" className="formBtnRow" >
            <Col xl={{ span: 12 }} lg={{ span: 12 }} md={{ span: 12 }} sm={{ span: 12 }} xs={{ span: 12 }} className="formBtnCol" >
                <Button
                    // htmlType='submit'
                    onClick={() => {
                        handleUserFormValues(userAddForm);
                    }}
                    className='appPrimaryButton formWidth'
                    label='Save'
                />
                <Button 
                    label='Cancel'
                    className="appButton formWidth"
                    onClick={() => {
                        userAddForm.resetFields();
                        setUserModalOpen(false);
                    }}
                />
            </Col>
        </Row>
    </Form>
    )
}

export default AddEditUserForm;