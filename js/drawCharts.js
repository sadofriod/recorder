var myChart = echarts.init(document.getElementById('charts'));
var option = {
    title: {
        text: '语音时长与正确量'
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
    	left:'200px',
        data:['语音时长','正确量'],
        selected:{
        	'语音时长':true,
        	'正确量':false
        }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    toolbox: {
        feature: {
            saveAsImage: {}
        }
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['周一','周二','周三','周四','周五','周六','周日']
    },
    yAxis: {
        type: 'value'
    },
    series: [
        {
            name:'语音时长',
            type:'line',
            stack: '总时长',
            data:[120, 132, 101, 134, 90, 230, 210]
        },
        {
            name:'正确量',
            type:'line',
            stack: '总量',
            data:[220, 182, 191, 234, 290, 330, 310]
        },
    ]
};
myChart.setOption(option)