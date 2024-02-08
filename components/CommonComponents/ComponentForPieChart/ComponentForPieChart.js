import React, { useEffect } from 'react';
import 'chart.js';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables)

const ComponentForPieChart = ({ data }) => {

    useEffect(() => {
        renderChart();
    }, []);

    const renderChart = () => {
        const ctx = document.getElementById(data.chartId).getContext(data.context);
        const myPieChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: data.labels,
                datasets: [{
                    label: data?.datasets?.label,
                    data: data?.datasets?.data,
                    backgroundColor: data?.datasets?.backgroundColor,
                    fill: data?.datasets?.fill,
                    borderColor: data?.datasets?.borderColor,
                    tension: data?.datasets?.tension,
                    hoverOffset: data?.datasets?.hoverOffset,
                }],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: data?.datasets?.display,
                        position: data?.datasets?.position,
                    },
                },
                cutout: data?.datasets?.cutout,
            },
        });
        return myPieChart;
    }
    return (
        <canvas id={data.chartId} height={data?.datasets?.height} width={data?.datasets?.width}></canvas>
    )
}

export default ComponentForPieChart