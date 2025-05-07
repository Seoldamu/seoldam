import { color } from '@renderer/design/styles'
import ReactECharts from 'echarts-for-react'

const Chart = () => {
  const writtenCount = 1000

  const option = {
    title: {
      text: `오늘 쓴 글자\n{num|${writtenCount}자}`,
      left: 0,
      top: 0,
      textStyle: {
        fontFamily: 'Paperlogy',
        fontWeight: 500,
        fontSize: 14,
        lineHeight: 20,
        letterSpacing: 1,
        color: `${color.G300}`,
        rich: {
          num: {
            fontFamily: 'Paperlogy',
            fontWeight: 700,
            fontSize: 30,
            lineHeight: 36,
            letterSpacing: -1,
            color: `${color.G900}`
          }
        }
      }
    },
    legend: {
      data: ['이번 달 쓴 글자 수', '저번 달 쓴 글자 수'],
      top: 0,
      right: 0,
      orient: 'vertical',
      itemGap: 4,
      icon: 'circle',
      itemWidth: 10,
      itemHeight: 10,
      textStyle: {
        fontFamily: 'Paperlogy',
        fontWeight: 500,
        fontSize: 12,
        lineHeight: 16.8,
        letterSpacing: 0.12,
        color: `${color.G900}`
      }
    },
    series: [
      {
        name: '이번 달 쓴 글자 수',
        type: 'line',
        data: [3200, 3000, 3200, 3000, 3200, 3000, 3200, 3000], // 후에 동적인 값
        smooth: true,
        showSymbol: false,
        emphasis: {
          focus: 'series',
          showSymbol: true,
          itemStyle: {
            color: '#344BFD',
            borderColor: `${color.G0}`,
            borderWidth: 3
          },
          label: {
            show: true,
            position: 'top',
            fontFamily: 'Paperlogy',
            fontWeight: 700,
            fontSize: 13,
            lineHeight: 13,
            letterSpacing: 0.13,
            color: '#001DFF'
          }
        },
        itemStyle: {
          color: '#001DFF'
        },
        lineStyle: {
          color: '#001DFF',
          width: 1.32
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#ADB7F9' },
              { offset: 1, color: 'rgba(177,185,248,0)' }
            ]
          }
        }
      },
      {
        name: '저번 달 쓴 글자 수',
        type: 'line',
        data: [2100, 2500, 2400, 2100, 2500, 2400, 2100, 2500, 2400], // 후에 동적인 값
        smooth: true,
        showSymbol: false,
        emphasis: {
          focus: 'series',
          showSymbol: true,
          itemStyle: {
            color: '#F00000',
            borderColor: '#fff',
            borderWidth: 3
          },
          label: {
            show: true,
            position: 'top',
            fontFamily: 'Paperlogy',
            fontWeight: 700,
            fontSize: 13,
            lineHeight: 13,
            letterSpacing: 0.13,
            color: '#F00000'
          }
        },
        itemStyle: {
          color: '#F00000'
        },
        lineStyle: {
          color: '#F00000',
          width: 1.32
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#F4A79D' },
              { offset: 1, color: 'rgba(244,167,157,0)' }
            ]
          }
        }
      }
    ],
    grid: {
      left: 0,
      right: 0,
      top: `76px`,
      bottom: 0,
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['10', '11', '12', '13', '14', '15', '1', '123', '123123'], // 날짜
      axisLabel: {
        fontFamily: 'Paperlogy',
        fontWeight: 700,
        fontSize: 13,
        color: `${color.G600}`,
        lineHeight: 13,
        letterSpacing: 0.13,
        interval: 0
      }
    },
    yAxis: {
      type: 'value'
    }
  }

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
    </div>
  )
}

export default Chart
