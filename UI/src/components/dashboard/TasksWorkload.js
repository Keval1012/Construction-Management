import { Card } from 'antd';
import React, { useEffect } from 'react';
import { Bar } from 'react-chartjs-2';

const TaskWorkload = ({ taskWorkloadLabels, completedData, overdueData }) => {

    // useEffect(() => {}, []);

    const taskWorkloadOptions = {
        indexAxis: "y",
        scales: {
            x: {
                stacked: true,
                display: false
            },
            y: {
                stacked: true
            }
        },
        elements: {
            bar: {
                borderWidth: 1
            }
        },
        // maintainAspectRatio: false,
        responsive: true,
        plugins: {
            legend: {
                labels: {
                    font: {
                        size: 1
                    },
                },
                position: "bottom",
            },
            title: {
                display: true,
                text: "Workload"
            }
        },
        // animation: {
        //     onComplete: function () {
        //         var sourceCanvas = chartFuelSpend.chart.canvas;
        //         var copyWidth = chartFuelSpend.scales['y-axis-0'].width - 10;
        //         var copyHeight = chartFuelSpend.scales['y-axis-0'].height + chartFuelSpend.scales['y-axis-0'].top + 10;
        //         var targetCtx = document.getElementById("axis-FuelSpend").getContext("2d");
        //         targetCtx.canvas.width = copyWidth;
        //         targetCtx.drawImage(sourceCanvas, 0, 0, copyWidth, copyHeight, 0, 0, copyWidth, copyHeight);
        //     }
        // }
    };

    const taskWorkloadData = {
        labels: ['tasdk1', 'tasdk2', 'tasdk3', 'tasdk4', 'tasdk5', 'tasdk6', 'tasdk7', 'tasdk8', 'tasdk9', 'tasdk10'],
        // labels: taskWorkloadLabels,
        datasets: [
            {
                label: "Completed",
                // data: labels.map(() => faker.datatype.number({ min: 100, max: 1000 })),
                data: [10, 20, 10, 20, 10, 20, 10, 20, 10, 20],
                // data: completedData,
                borderColor: "rgb(53, 162, 235)",
                backgroundColor: "rgba(53, 162, 235, 0.5)"
            },
            {
                label: "Overdue",
                // data: labels.map(() => faker.datatype.number({ min: 100, max: 1000 })),
                data: [90, 80, 90, 80, 90, 80, 90, 80, 90, 80],
                // data: overdueData,
                borderColor: "rgb(255, 99, 132)",
                backgroundColor: "rgba(255, 99, 132, 0.5)"
            }
        ]
    };

    return (
        <div>
            <Card className='dashboardCard' bordered={false}>
                <Bar options={taskWorkloadOptions} data={taskWorkloadData} />
            </Card>
        </div>
    )
}

export default TaskWorkload;