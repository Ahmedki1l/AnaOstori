import React, { useEffect } from 'react';
import 'chart.js';
import { Chart, Title, Tooltip, Legend, BarController, BarElement, LinearScale, CategoryScale } from 'chart.js';

const ComponentForBarChart = ({ data }) => {

    useEffect(() => {
        renderChart();
    }, []);

    const renderChart = () => {
        const ctx = document.getElementById(data.chartId).getContext('2d');
        Chart.register(Title, Tooltip, Legend, BarController, BarElement, LinearScale, CategoryScale);
        const myBarChart = new Chart(ctx, {
            type: 'bar',
            data: data,
            options: data.options,
        });
        return myBarChart;
    };

    return (
        <canvas id={data.chartId}></canvas>
    )
}

export default ComponentForBarChart