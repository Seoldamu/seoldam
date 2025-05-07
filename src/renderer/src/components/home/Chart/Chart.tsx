import { color } from '@renderer/design/styles'
import ReactECharts from 'echarts-for-react'

const Chart = () => {
  const writtenCount = 1000
  const labels = Array.from({ length: 30 }, (_, i) => i + 1)
  const data1 = [
    3123, 3984, 2501, 3765, 3410, 2999, 3840, 2674, 3902, 3005, 3280, 3100, 2874, 3690, 3560, 3300,
    3900, 3444, 3666, 3777, 2210, 3450, 3333, 3800, 2990, 3188, 3675, 3060, 2950, 3533
  ]

  const data2 = [
    1820, 2450, 1630, 1200, 2755, 1944, 2210, 2080, 1870, 1777, 2633, 1001, 1130, 1980, 2430, 1330,
    1220, 2010, 1770, 1988, 1540, 1422, 2311, 1005, 1910, 1340, 2730, 1560, 2130, 1599
  ]

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
        data: data1, // 후에 동적인 값
        smooth: 0.3,
        showSymbol: false,
        symbol: 'circle',
        symbolSize: 14,
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
        data: data2, // 후에 동적인 값
        smooth: 0.3,
        showSymbol: false,
        symbol: 'circle',
        symbolSize: 14,
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
      data: labels, // 날짜
      axisLabel: {
        fontFamily: 'Paperlogy',
        fontWeight: 700,
        fontSize: 13,
        color: `${color.G600}`,
        lineHeight: 13,
        letterSpacing: 0.13,
        interval: 0
      },
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { show: false }
    },
    yAxis: {
      type: 'value',
      axisLabel: { show: false },
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { show: false }
    },
    tooltip: {
      show: true,
      trigger: 'axis',
      axisPointer: {
        type: 'line',
        lineStyle: {
          color: '#C7C7C7',
          width: 0.5
        }
      },
      backgroundColor: `${color.G0}`,
      borderColor: `${color.G20}`,
      borderWidth: 1,
      textStyle: {
        color: '#222',
        fontSize: 13
      },
      formatter: function (params) {
        let result = `${params[0].axisValue}일<br/>`
        params.forEach((p) => {
          result += `<span style="display:inline-block;margin-right:5px;border-radius:50%;width:10px;height:10px;background:${p.color}"></span>`
          result += `${p.seriesName}: <b>${p.value}</b><br/>`
        })
        return result
      }
    }
  }

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
    </div>
  )
}

export default Chart
