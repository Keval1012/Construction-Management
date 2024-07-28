import { Col, Row } from 'antd';
import React from 'react';

const DefectsCard = () => {
    return (
        <div className='cardHeight'>
            <Row>
                <Col xl={{ span: 11 }} lg={{ span: 11 }} md={{ span: 11 }} sm={{ span: 11 }} xs={{ span: 11 }} >
                    <h4>Minor Defects</h4>
                    <h4>0</h4>
                </Col>
                <Col xl={{ span: 2 }} lg={{ span: 2 }} md={{ span: 2 }} sm={{ span: 2 }} xs={{ span: 2 }} >
                    <div className='defectLine'><div className='defectVerticalLine'></div></div>
                </Col>
                <Col xl={{ span: 11 }} lg={{ span: 11 }} md={{ span: 11 }} sm={{ span: 11 }} xs={{ span: 11 }} >
                    <h4>Major Defects</h4>
                    <h4>0</h4>
                </Col>
            </Row>
        </div>
    )
}

export default DefectsCard;