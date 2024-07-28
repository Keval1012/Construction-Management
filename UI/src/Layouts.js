import React, { useContext, useEffect, useState } from 'react';
import {
    DownOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Button, theme, ConfigProvider, Dropdown, Modal, message } from 'antd';
import SidebarMenu from './components/SidebarMenu';
import MainRoutes from './MainRoutes';
import { AuthContext } from './context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setPermissionData } from './redux/features/userDataSlice';
import { getAllAccessPermissionsByUserId } from './API/Api';

const Layouts = () => {

    const { userId, user, setUser, setUserId, currUserData, setPermissions, isDesktop, isMobile, isTablet } = useContext(AuthContext)??{};
    const navigate = useNavigate();
    const { Header, Sider, Content } = Layout;
    const dispatch = useDispatch();
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    useEffect(() => {
        if (userId) {
            fetchPermissions();
        }
    }, [userId]);

    const fetchPermissions = async () => {
        const res = await getAllAccessPermissionsByUserId(userId);
        dispatch(setPermissionData(res.data?.data));
        setPermissions(res.data?.data);
    };

    const showDeleteConfirm = () => {
        Modal.confirm({
            title: `Logout`,
            content: 'Are you sure you want to Logout?',
            okText: 'Logout',
            okType: 'danger',
            onOk: async () => {
                setUser(null);
                setUserId('');
                // dispatch(setPermissionData([]));
                // dispatch(setUserIdData(''));
                localStorage.clear();
                navigate('/login');
                message.success('You are successfully logout.');
            },
            onCancel() { },
        });
    };

    const items = [
        {
            label: (
                <p>Change Password</p>
            ),
            key: 'changePassword',
            onClick: (e) => handleMenuClick(e)
        },
        {
            label: (
                <p>Logout</p>
            ),
            key: 'logout',
            onClick: (e) => handleMenuClick(e)
        },
    ];

    const handleMenuClick = (e) => {
        if (e.key === 'logout') {
            showDeleteConfirm();
        }
        if (e.key === 'changePassword') {
            // setChangePasswordModalOpen(true);
        }
    };

    return (
        <>
            <ConfigProvider
                theme={{
                    token: {
                        colorPrimary: 'black',
                        borderRadius: 2,
                        // colorBgContainer: '#f6ffed',
                        // colorBgContainer: '#1818180f',
                    },
                    // algorithm: theme.darkAlgorithm,
                }}
            >
                <Layout className='mainLayout'>
                    {user &&
                        <Sider trigger={null} collapsible collapsed={collapsed}>
                            <div className="demo-logo-vertical" />
                            <SidebarMenu />
                        </Sider>
                    }
                    <Layout>
                        <Header style={{ padding: 0, background: colorBgContainer, display: 'flex', alignItems: 'center' }}>
                            {user &&
                                <Button
                                    type="text"
                                    icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                                    onClick={() => setCollapsed(!collapsed)}
                                    style={{
                                        fontSize: '16px',
                                        width: 64,
                                        height: 64,
                                    }}
                                />
                            }
                            <div className='navbar'>
                                <h2>LOGO</h2>
                                {user &&
                                    <Dropdown menu={{ items }} >
                                        {(isMobile && !isDesktop && !isTablet) ?
                                            <div className='userProfileDiv'>
                                                <UserOutlined className='userIcon' />
                                                {/* <span className='userTitle'>User</span> */}
                                                {/* {currUserData?.name}
                                                <DownOutlined className='userDownArrow' /> */}
                                            </div>
                                            :
                                            <div className='userProfileDiv'>
                                                <UserOutlined className='userIcon' />
                                                {/* <span className='userTitle'>User</span> */}
                                                {currUserData?.name}
                                                <DownOutlined className='userDownArrow' />
                                            </div>
                                        }
                                    </Dropdown>
                                }
                            </div>
                        </Header>
                        <Content
                            style={{
                                margin: '24px 16px',
                                padding: '24px 50px',
                                minHeight: 280,
                                height: 280,
                                overflowY: 'scroll',
                                background: colorBgContainer,
                            }}
                        >
                            <MainRoutes />
                        </Content>
                    </Layout>
                </Layout>
            </ConfigProvider>
        </>
    )
}

export default Layouts;