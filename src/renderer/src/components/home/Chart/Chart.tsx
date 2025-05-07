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
      right: 30,
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
    }
  }

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
    </div>
  )
}

export default Chart
