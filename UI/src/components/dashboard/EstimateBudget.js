import React from 'react';
import { Bar } from 'react-chartjs-2';

const EstimateBudget = ({ receivedAmount, estimatedBudget}) => {

    const estBarChartOptions = {
        plugins: {
            title: {
                display: true,
                text: 'Budget Variance'
            }
        }
    };

    const estimateBudgetBarChartData = {
        // labels: UserData.map(o => o.year),
        labels: ['est'],
        datasets: [
            {
                label: 'actual budget',
                backgroundColor: 'rgba(0, 255, 0, 0.2)',
                borderColor: 'rgb(0, 255, 0)',
                borderWidth: 1,
                // data: [200]
                data: [receivedAmount]
            },
            {
                label: 'estimated budget',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
                borderColor: 'rgba(53, 162, 235, 0)',
                borderWidth: 1,
                // data: [300]
                data: [estimatedBudget]
            }
        ]
    };

    return (
        <div>
            <Bar
                data={estimateBudgetBarChartData}
                options={estBarChartOptions}
            />
        </div>
    )
}

export default EstimateBudget;