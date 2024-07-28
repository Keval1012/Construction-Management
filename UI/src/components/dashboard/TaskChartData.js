import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';

const TaskChartData = ({ projectsByAllStatus }) => {

    let taskChartData = {};

    if (projectsByAllStatus?.notStarted === 0 && projectsByAllStatus?.completed === 0 && projectsByAllStatus?.inProgress === 0) {
        taskChartData = {
            labels: ["No data found"],
            datasets: [{
            labels:'No data',
            backgroundColor: ['#D3D3D3'],
            data: [100]
            }]
        };
    } else {
        taskChartData = {
            labels: ['Not Started', 'In Progress', 'Completed'],
            datasets: [{
                label: 'Tasks',
                data: [projectsByAllStatus?.notStarted??0, projectsByAllStatus?.inProgress??0, projectsByAllStatus?.completed??0],
                backgroundColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(75, 192, 192, 1)',
                ],
                // borderColor: [
                //   'rgba(255, 99, 132, 1)',
                //   'rgba(54, 162, 235, 1)',
                //   'rgba(75, 192, 192, 1)',
                // ],
                // borderWidth: 1,        
            },]
        };
    }

    return (
        <div className='chartData'>
            <Doughnut
                height={5}
                data={taskChartData}
                options={{
                    plugins: {
                        title: {
                            display: true,
                            text: 'Tasks',
                            padding: {
                                top: 20,
                                bottom: -20
                            },
                        },
                        legend: {
                            position: 'right',  
                            labels: {
                                usePointStyle: true,
                                pointStyle: 'circle'
                            }
                        }
                    }
                }}
            />
        </div>
    )
}

export default TaskChartData;