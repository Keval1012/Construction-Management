import { UserOutlined } from '@ant-design/icons';
import { Col, Divider, Row } from 'antd';
import React, { useEffect } from 'react'
import { employeeJobTitleList } from '../../constants';

const EmployeeListModal = ({
    setTeamModalOpen,
    allEmployeeList,
    uniqueEmployeeList
}) => {

    return (
        <div className='modal'>
            <Row>
                <Col xl={{ span: 24 }} lg={{ span: 24 }}>
                    <div className="modal-header">
                        <Row align='middle' justify='space-between'>
                            <h2>All Team Members</h2>
                        </Row>
                    </div>
                    <Divider />

                    <div className='modal-body'>
                        {uniqueEmployeeList.map((list) => (
                            <>
                                <Row align='middle' key={list._id}>
                                    <UserOutlined className='avatarIcon' />
                                    <div>
                                        <div className='secondaryTitle'>{list?.assignToDetails?.name} {list?.assignToDetails?.surname}</div>
                                        <div className='secondaryTitle'>{employeeJobTitleList.find(o => o._id === list?.assignToDetails?.jobTitle)?.name}</div>
                                    </div>
                                </Row><br />
                            </>
                        ))}
                    </div>
                </Col>
            </Row>
        </div>
    );
}

export default EmployeeListModal;