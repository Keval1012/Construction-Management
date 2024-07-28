import { Col, Row } from 'antd';
import React from 'react';

const ComplaintsCard = () => {
    return (
        <div className='cardHeight'>
            <Row align='middle' justify='space-between'>
                <Col xl={{ span: 24 }} lg={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }} xs={{ span: 24 }} >
                    <h4>Customer Complaints</h4>
                </Col>
            </Row>
            <Row>
                <Col xl={{ span: 11 }} lg={{ span: 11 }} md={{ span: 11 }} sm={{ span: 11 }} xs={{ span: 11 }} >
                    <h4>Total</h4>
                    <h4>0</h4>
                </Col>
                <Col xl={{ span: 2 }} lg={{ span: 2 }} md={{ span: 2 }} sm={{ span: 2 }} xs={{ span: 2 }} >
                    <div className='complaintLine'><div className='complaintVerticalLine'></div></div>
                </Col>
                <Col xl={{ span: 11 }} lg={{ span: 11 }} md={{ span: 11 }} sm={{ span: 11 }} xs={{ span: 11 }} >
                    <h4>Resolved</h4>
                    <h4>0</h4>
                </Col>
            </Row>
        </div>
    )
}

export default ComplaintsCard;