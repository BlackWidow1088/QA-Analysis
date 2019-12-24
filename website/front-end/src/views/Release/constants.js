import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
export const brandPrimary = getStyle('--primary')
export const brandSuccess = getStyle('--success')
export const brandInfo = getStyle('--info')
export const brandDanger = getStyle('--danger')
export const brandPurple = getStyle('--purple')
// Card Chart 1
export const cardChartData1 = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
        {
            label: 'My First dataset',
            backgroundColor: brandDanger,
            borderColor: 'rgba(255,255,255,.55)',
            data: [65, 59, 84, 84, 51, 55, 40],
        },
    ],
};

export const cardChartOpts1 = {
    tooltips: {
        enabled: false,
        custom: CustomTooltips
    },
    maintainAspectRatio: false,
    legend: {
        display: false,
    },
    scales: {
        xAxes: [
            {
                gridLines: {
                    color: 'transparent',
                    zeroLineColor: 'transparent',
                },
                ticks: {
                    fontSize: 2,
                    fontColor: 'transparent',
                },

            }],
        yAxes: [
            {
                display: false,
                ticks: {
                    display: false,
                    min: Math.min.apply(Math, cardChartData1.datasets[0].data) - 5,
                    max: Math.max.apply(Math, cardChartData1.datasets[0].data) + 5,
                },
            }],
    },
    elements: {
        line: {
            borderWidth: 1,
        },
        point: {
            radius: 4,
            hitRadius: 10,
            hoverRadius: 4,
        },
    }
}

// Card Chart 2
export const cardChartData2 = {
    labels: ['02 Dec 2019', '09 Dec 2019', '16 Dec 2019', '23 Dec 2019', '30 Dec 2019'],
    datasets: [
        {
            label: 'Weekly Progress',
            backgroundColor: 'transparent',
            // borderColor: 'rgba(255,255,255,.55)',
            borderColor: brandInfo,
            borderWidth: 5,
            data: [1, 18, 9, 17, 34],
        },
    ],
};
export const cardChartDataPurple = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
        {
            label: 'Weekly Progress',
            backgroundColor: brandPurple,
            borderColor: 'rgba(255,255,255,.55)',
            data: [1, 18, 9, 17, 34, 22, 11],
        },
    ],
};
export const cardChartOpts2 = {
    tooltips: {
        enabled: false,
        custom: CustomTooltips
    },
    maintainAspectRatio: false,
    legend: {
        display: false,
        // display: true
    },
    scales: {
        xAxes: [
            {
                gridLines: {},
                // gridLines: {
                //     color: '#00742b',
                //     zeroLineColor: '#00742b',
                // },
                ticks: {
                    fontSize: 2,
                    fontColor: '#00742b',
                },

            }],
        yAxes: [
            {
                gridLines: {},
                // gridLines: {
                //     color: '#00742b',
                //     zeroLineColor: '#00742b',
                // },
                // display: false,
                ticks: {
                    display: true,
                    min: 0,
                    max: Math.max.apply(Math, cardChartData2.datasets[0].data) + 5,
                    fontColor: '#00742b',
                },
            }],
    },
    elements: {
        line: {
            tension: 0.00001,
            borderWidth: 1,
        },
        point: {
            radius: 4,
            hitRadius: 10,
            hoverRadius: 4,
        },
    },
};


// Card Chart 4
export const cardChartData4 = {
    labels: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    datasets: [
        {
            label: 'My First dataset',
            backgroundColor: 'rgba(255,255,255,.3)',
            borderColor: 'transparent',
            data: [78, 81, 80, 45, 34, 12, 40, 75, 34, 89, 32, 68, 54, 72, 18, 98],
        },
    ],
};

export const cardChartOpts4 = {
    tooltips: {
        enabled: false,
        custom: CustomTooltips
    },
    maintainAspectRatio: false,
    legend: {
        display: false,
    },
    scales: {
        xAxes: [
            {
                display: false,
                barPercentage: 0.6,
            }],
        yAxes: [
            {
                display: false,
            }],
    },
};
// Card Chart 3
export const cardChartData3 = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
        {
            label: 'My First dataset',
            backgroundColor: 'rgba(255,255,255,.2)',
            borderColor: 'rgba(255,255,255,.55)',
            data: [78, 81, 80, 45, 34, 12, 40],
        },
    ],
};

export const cardChartOpts3 = {
    tooltips: {
        enabled: false,
        custom: CustomTooltips
    },
    maintainAspectRatio: false,
    legend: {
        display: false,
    },
    scales: {
        xAxes: [
            {
                display: false,
            }],
        yAxes: [
            {
                display: false,
            }],
    },
    elements: {
        line: {
            borderWidth: 2,
        },
        point: {
            radius: 0,
            hitRadius: 10,
            hoverRadius: 4,
        },
    },
};