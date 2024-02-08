import React, { useEffect } from 'react';
import 'chart.js';
import { Chart, LinearScale, LineController, CategoryScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

const ComponentForLineChart = ({ data }) => {

    useEffect(() => {
        renderChart();
    }, [data]);

    const renderChart = () => {
        const canvas = document.getElementById(data?.chartId);
        if (!canvas) {
            console.error(`Canvas element with ID '${data?.chartId}' not found.`);
            return;
        }
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            console.error('Unable to retrieve 2D rendering context.');
            return;
        }
        if (canvas.chart) {
            canvas.chart.destroy();
        }

        Chart.register(LinearScale, LineController, CategoryScale, PointElement, LineElement, Title, Tooltip, Legend);
        const myLineChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data?.labels,
                datasets: [{
                    label: data?.datasets?.label,
                    data: data?.datasets?.data,
                    fill: data?.datasets?.fill,
                    borderColor: data?.datasets?.borderColor,
                    tension: data?.datasets?.tension,
                }],
            },
            options: {
                responsive: true,
                // scales: {
                //     y: {
                //         beginAtZero: true
                //     }
                // }
                // scales: {
                //     y: {
                //         title: {
                //             display: true,
                //             text: 'Total Earnings'
                //         }
                //     }
                // }
            }
        });

        canvas.chart = myLineChart;

        return myLineChart;
    };


    return (
        <canvas id={data?.chartId}></canvas>
    )
}

export default ComponentForLineChart