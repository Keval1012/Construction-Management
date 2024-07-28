import { Col, Divider, Form, message, Row } from "antd";
import React, { useContext, useEffect, useState } from "react";
// import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUserLogin } from "../API/Api";
import Button from "../components/AppButton";
// import AppModal from "../components/AppModal";
// import Selectable from "../components/Selectable";
import TextInput from "../components/TextInput";
import { AuthContext } from "../context/AuthProvider";
// import { handlePressEnter } from "../helpers/helper";
// import { setCurrentCompanyData, setUserIdData } from "../redux/features/userDataSlice";
import '../styles/login.css';

const Login = () => {

    const [form] = Form.useForm();
    const navigate = useNavigate();
    // const dispatch = useDispatch();
    
    const { setUser, setUserId } = useContext(AuthContext)??{};
    // const dispatch = useDispatch();
    const [isLoging, setIsLoging] = useState(false);


    const handleLogin = async (val) => {
        try {
            const res = await getUserLogin({ username: val.loginUsername, password: val.loginPassword, company: val.loginCompany });
            if (res.data?.data?.token) {
                localStorage.setItem('token', res.data.data.token);
                localStorage.setItem('role', res.data.data.role);
                localStorage.setItem('userId', res.data.data.userId);
                setUser(res.data?.data?.token);
                setUserId(res.data?.data?.userId);
                // dispatch(setUserIdData(res.data?.data?.userId));
                navigate('/');
            } else message.error(res.data?.data?.message);
        } catch (error) {
            message.error('Login Error');
        }
    };

    // const handleKeyPress = async (e) => {
    //     const check = await handlePressEnter(e, form);
    //     if (check) handleLogin(form.getFieldsValue());
    //     // const { loginUsername, loginPassword, loginRole } = form.getFieldsValue();
    //     // if (loginUsername && loginPassword && loginRole) {
    //     //     if (e.key === 'Enter' || e.key === 'NumpadEnter') {
    //     //         handleLogin(form.getFieldsValue());
    //     //     }
    //     // }
    // };

    return (
        <>
            <div className="loginPage">
                <Row justify="center">
                    <Col className="loginForm addUserForm" xl={{ span: 8 }} lg={{ span: 8 }} md={{ span: 8 }} sm={{ span: 8 }} xs={{ span: 8 }}>
                        <h1>Login here!</h1>
                        <Divider />
                        <Form
                            // {...formItemLayout}
                            preserve={false}
                            form={form}
                            // onKeyPress={handleKeyPress}
                            // onKeyUp={handleKeyPress}
                            // onKeyDown={handleKeyPress}
                            name="adminLogin"
                            onFinish={(values) => handleLogin(values)}
                            scrollToFirstError
                        >
                            <Row justify='center' align='middle'>
                                <Col xl={{ span: 22 }} lg={{ span: 22 }} md={{ span: 22 }} sm={{ span: 22 }} >
                                    <TextInput
                                        name="loginCompany"
                                        type='text'
                                        className="loginInput"
                                        typeMsg='The input is not valid name!'
                                        required={false}
                                        requiredMsg='Please enter Company'
                                        label='Company'
                                    />
                                </Col>
                            </Row>
                            <Row justify='center' align='middle'>
                                <Col xl={{ span: 22 }} lg={{ span: 22 }} md={{ span: 22 }} sm={{ span: 22 }} >
                                    <TextInput
                                        name="loginUsername"
                                        type='text'
                                        className="loginInput"
                                        typeMsg='The input is not valid Number!'
                                        required={true}
                                        requiredMsg='Please enter Username'
                                        label='Username'
                                    />
                                </Col>
                            </Row>
                            <Row justify='center' align='middle'>
                                <Col xl={{ span: 22 }} lg={{ span: 22 }} md={{ span: 22 }} sm={{ span: 22 }} >
                                    <TextInput
                                        name="loginPassword"
                                        type='password'
                                        className="loginInput"
                                        typeMsg='The input is not valid Password!'
                                        required={true}
                                        requiredMsg='Please enter Password'
                                        label='Password'
                                    />
                                </Col>
                            </Row>
                            {/* <Row justify='center' align='middle'>
                                <Col xl={{ span: 22 }} lg={{ span: 22 }} md={{ span: 22 }} sm={{ span: 22 }} >
                                    <Selectable
                                        label='Role'
                                        name="loginRole"
                                        required={true}
                                        firstName='name'
                                        requiredMsg='select role'
                                        data={allRoleData}
                                        width={400}
                                        showSearch={true}
                                        handleSelectChange={handleRoleSelectChange}
                                    />
                                </Col>
                            </Row> */}
                            <Row className="loginBtn" justify="end">
                                <Button
                                    label='Continue'
                                    // onKeyPress={handleKeyPress}
                                    htmlType="submit"
                                    loading={isLoging}
                                />
                            </Row>
                        </Form>
                    </Col>
                </Row>
            </div>
        </>
    )
}

export default Login;