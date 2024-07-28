import { AppstoreOutlined, BorderOuterOutlined, CalendarOutlined, FileOutlined, HomeOutlined, MailOutlined, SettingOutlined, StarOutlined, UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const SidebarMenu = () => {

    const navigate = useNavigate();
    const { currentUserRole, permissions } = useSelector((state) => state.userData)??{};
    const [menuItems, setMenuItems] = useState([]);

    useEffect(() => { setSiderMenuItems(); }, []);
    useEffect(() => { setSiderMenuItems(); }, [JSON.stringify(permissions)]);

    const getItem = (label, key, icon, children) => {
        return { key, icon, children, label };
    };

    const handleOnClick = (e) => {
        navigate(e.key);
    };

    const setSiderMenuItems = () => {

        let masterSubItems = [
            getItem('Employees', 'employees'),
        ];

        if (permissions?.find(o => o.name === 'Builder.Read')) masterSubItems.splice(1, 0, getItem('Builders', 'builders'));
        if (permissions?.find(o => o.name === 'User.Read')) masterSubItems.splice(0, 0, getItem('User', 'users'));
        if (permissions?.find(o => o.name === 'Role.Read')) masterSubItems.push(getItem('Roles', 'roles'));
        if (currentUserRole === 'builder') masterSubItems.push(getItem('Budget Category', 'budgetCategory'));
        if (currentUserRole === 'builder') masterSubItems.push(getItem('Tax', 'taxes'));
        
        let items = [
            getItem('Dashboard', '', <HomeOutlined />),
            getItem('Overview', 'overview', <MailOutlined />),
            // getItem('Projects', 'projects', <CalendarOutlined />),
            // getItem('EmployeeProjects', 'projects-list', <CalendarOutlined />),
            // getItem('Site Inspection', 'siteInspection', <CalendarOutlined />),
            getItem('Settings', 'sub2', <SettingOutlined />, [
                getItem('Option 7', '7'),
                getItem('Option 8', '8'),
                getItem('Option 9', '9'),
                getItem('Option 10', '10'),
            ]),
        ];

        if (permissions?.find(o => o.name === 'Project.Read') && currentUserRole === 'hostAdmin') items.splice(2, 0, getItem('Projects', 'projects', <CalendarOutlined />))
        if (permissions?.find(o => o.name === 'Project.Read') && currentUserRole === 'builder') items.splice(2, 0, getItem('Projects', 'projects', <CalendarOutlined />))
        if (permissions?.find(o => o.name === 'Project.Read') && currentUserRole === 'employee') items.splice(2, 0, getItem('Projects', 'projects-list', <CalendarOutlined />))

        if (permissions?.find(o => o.name === 'Equipment.Read') && currentUserRole !== 'employee') items.splice(3, 0, getItem('Equipments', 'equipmentsMaster', <BorderOuterOutlined />, [
            getItem('Equipments', 'equipments'),
            getItem('Equipment Names', 'equipmentNames'),
            // getItem('Submenu', 'sub1-2', null, [getItem('Option 5', '5'), getItem('Option 6', '6')]),
        ]));

        if (currentUserRole && currentUserRole !== 'hostAdmin') items.splice(3, 0, getItem('Daily Status', 'dailyStatus', <StarOutlined />));

        if (currentUserRole && currentUserRole !== 'hostAdmin') items.splice(3, 0, getItem('Document', 'documents', <FileOutlined />));

        if (currentUserRole && currentUserRole !== 'employee') items.splice(3, 0, getItem('Masters', 'sub1', <AppstoreOutlined />, masterSubItems));

        setMenuItems(items);

    };

    return (
        <Menu
            // theme="dark"
            mode="inline"
            style={{ height: 'inherit' }}
            defaultSelectedKeys={['1']}
            items={menuItems}
            onClick={handleOnClick}
        />
    )
}

export default SidebarMenu;