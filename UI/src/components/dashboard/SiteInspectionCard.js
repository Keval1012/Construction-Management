import { Col, Row } from 'antd';
import React from 'react';

const SiteInspectionCard = ({ totalInspectionsCount, totalEmployeeIssueCount, currentRole }) => {

    return (
        <div className='cardHeight'>
            <Row align='middle' justify='space-between'>
                <Col xl={{ span: 24 }} lg={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }} xs={{ span: 24 }} >
                    <h4>Site Inspection - Success Level</h4>
                </Col>
            </Row>
            <Row align='middle' justify='space-between'>
                <Col xl={{ span: 24 }} lg={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }} xs={{ span: 24 }} >
                    <h4>0</h4>
                </Col>
            </Row>
            <Row>
                <Col xl={{ span: 11 }} lg={{ span: 11 }} md={{ span: 11 }} sm={{ span: 11 }} xs={{ span: 11 }} >
                    <h4>{currentRole === 'builder' ? 'Passed Inspections' : 'Passed Issues'}</h4>
                    <h4>0</h4>
                </Col>
                <Col xl={{ span: 2 }} lg={{ span: 2 }} md={{ span: 2 }} sm={{ span: 2 }} xs={{ span: 2 }} >
                    <div className='line'><div className='verticalLine'></div></div>
                </Col>
                <Col xl={{ span: 11 }} lg={{ span: 11 }} md={{ span: 11 }} sm={{ span: 11 }} xs={{ span: 11 }} >
                    <h4>{currentRole === 'builder' ? 'Total Inspections' : 'Total Issues'}</h4>
                    <h4>{currentRole === 'builder' ? totalInspectionsCount : totalEmployeeIssueCount}{}</h4>
                </Col>
            </Row>
        </div>
    )
}

export default SiteInspectionCard;