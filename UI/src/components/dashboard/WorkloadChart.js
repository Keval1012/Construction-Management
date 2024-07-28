import { Card, Checkbox, Col, Row, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import AppModal from '../AppModal';
import AppButton from '../AppButton';

const WorkloadChart = ({ workloadData, plugins, module, projectShow }) => {

    const [workloadLabels, setWorkloadLabels] = useState([]);
    const [completedData, setCompletedData] = useState([]);
    const [overdueData, setOverdueData] = useState([]);
    const [listModalOpen, setListModalOpen] = useState(false);

    useEffect(() => {
        if (workloadData?.length > 0 && workloadData?.length < 5) {
            if (module === 'Project') setWorkloadLabels(workloadData.filter(o => o.status === 'onGoing').map(d => d.projectName));
            if (module === 'Task') setWorkloadLabels(workloadData.filter(o => o.status === 'onGoing').map(d => d.taskName));
            setCompletedData(workloadData.filter(o => o.status === 'onGoing').map(d => (module === 'Project') ? d.completionPercentage : d.completionPercent));
            setOverdueData(workloadData.filter(o => o.status === 'onGoing').map(d => 100 - ((module === 'Project') ? d.completionPercentage : d.completionPercent)));
        }
        if (workloadData?.length >= 5) {
            if (module === 'Project') setWorkloadLabels(workloadData.filter(o => o.status === 'onGoing').map(d => d.projectName).slice(0, 5));
            if (module === 'Task') setWorkloadLabels(workloadData.filter(o => o.status === 'onGoing').map(d => d.taskName).slice(0, 5));
            setCompletedData(workloadData.filter(o => o.status === 'onGoing').map(d => d.completionPercentage).slice(0, 5));
            setOverdueData(workloadData.filter(o => o.status === 'onGoing').map(d => 100 - d.completionPercentage).slice(0, 5));
        }
    }, [JSON.stringify(workloadData)]);
    console.log(workloadData)
    useEffect(() => {
        if (workloadLabels?.length > 0) {
            let temp = [];
            workloadLabels?.forEach(o => {
                if (module === 'Project') temp.push(workloadData.find(p => p.projectName === o)?.completionPercentage);
                if (module === 'Task') temp.push(workloadData.find(p => p.taskName === o)?.completionPercent);
            });
            setCompletedData(temp);
            temp = [];
            workloadLabels?.forEach(o => {
                if (module === 'Project') temp.push(100 - workloadData.find(p => p.projectName === o)?.completionPercentage);
                if (module === 'Task') temp.push(100 - workloadData.find(p => p.taskName === o)?.completionPercent);
            });
            setOverdueData(temp);
        }
    }, [JSON.stringify(workloadLabels)]);

    const projectWorkloadOptions = {
        indexAxis: "y",
        scales: {
            x: {
                stacked: true,
                // display: false
            },
            y: {
                stacked: true
            },
        },
        elements: {
            bar: {
                borderWidth: 1
            },
        },
        responsive: true,
        plugins: {
            legend: {
                position: "bottom",
            },
            title: {
                display: true,
                text: "Workload"
            }
        },
        // width: 200,
        // height: 200
    };

    const projectWorkloadData = {
        labels: workloadLabels,
        datasets: [
            {
                label: "Completed",
                data: completedData,
                borderColor: "rgb(53, 162, 235)",
                backgroundColor: "rgba(53, 162, 235, 0.5)"
            },
            {
                label: "Overdue",
                data: overdueData,
                borderColor: "rgb(255, 99, 132)",
                backgroundColor: "rgba(255, 99, 132, 0.5)"
            }
        ]
    };

    const handleModal = () => {
        setListModalOpen(!listModalOpen);
    };

    const onApplyChartValues = (val) => {
        setWorkloadLabels(val);
    };

    const ListModal = ({ handleChartValues, list }) => {

        const [checked, setChecked] = useState([]);
        const { Text } = Typography;

        useEffect(() => {
            if (list?.length > 0) {
                setChecked(list.filter((o, i) => i < 5));
            }
        }, [JSON.stringify(list)]);

        const onChange = (checkedValues) => {
            setChecked(checkedValues);
        };

        const isDisabled = (id) => {
            return checked.length > 4 && checked.indexOf(id) === -1;
        };

        return (
            <>
                <h2 className='m-0'>Select Project List</h2>
                <Text type="secondary">(Select any 5)</Text>
                <Checkbox.Group onChange={onChange} defaultValue={list.filter((o, i) => i < 5)}>
                    <Row>
                        {list && list?.length > 0 && list.map((o, i) => {
                            return (
                                <Col style={{ margin: '2% 0' }} xl={12} lg={12} md={12} sm={12} xs={12}>
                                    <Checkbox value={o} disabled={isDisabled(o)}>
                                        {o}
                                    </Checkbox>
                                </Col>
                            )
                        })}
                    </Row>
                </Checkbox.Group>
                <Row justify='end'>
                    <AppButton className='appPrimaryButton applyBtn' label='Apply' onClick={() => onApplyChartValues(checked)} />
                </Row>
            </>
        )
    };

    return (
        <div>
            {/* <Card className='dashboardCard workloadproject' bordered={false}> */}
            <Card className={!projectShow ? 'dashboardCard workloadprojectshow' : 'dashboardCard workloadproject workloadMargin'} bordered={false}>
                <div className='workloadChartEditBtn'>{workloadLabels && workloadLabels?.length > 4 && <a onClick={handleModal}>Edit</a>}</div>
                <Bar options={projectWorkloadOptions} plugins={plugins} data={projectWorkloadData} />
            </Card>
            <AppModal
                open={listModalOpen}
                children={
                    <ListModal
                        list={workloadLabels}
                    // handleChartValues={handleChartValues}
                    />}
                onOk={handleModal}
                onCancel={handleModal}
            />
        </div>
    )
}

export default WorkloadChart;