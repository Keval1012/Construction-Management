import { Card, Col, Progress, Row, Space } from 'antd';
import dayjs from 'dayjs';
import React from 'react';

const ProjectCompletionCards = ({ projectPercentage, startDate, projectDays }) => {
    return (
        <Row align='bottom' justify='space-between'>
            <Col
                xl={12} lg={12} md={12} sm={12} xs={12}
                className=''
                >
                <Card
                    className='dashboardCard completionCard rateStyle'
                    // style={{ height: '17rem' }}
                    bordered={false}
                    >
                    <div className='progressHeight'>
                        <h3 className='cardInsideHeader'>Project Completion Rate</h3>
                        <Space wrap>
                            <Progress type='circle' percent={projectPercentage} />
                        </Space>
                    </div>
                </Card>
            </Col>

            <Col
                xl={12} lg={12} md={12} sm={12} xs={12}
                className='completionCardCol'
            >
                <Card
                    className='dashboardCard completionCard cardMargin'
                    bordered={false}
                >
                    <div className='progressHeight'>
                        <h3>Utilized Duration</h3>
                        <Space wrap>
                            <Progress type='circle' percent={projectDays} format={(percent) => `${percent} Days`} />
                        </Space><br /><br />
                        <h4>Started On : {startDate ? dayjs(new Date(startDate)).format('DD/MM/YYYY') : 0}</h4>
                    </div>
                </Card>
            </Col>
        </Row>
    )
}

export default ProjectCompletionCards;