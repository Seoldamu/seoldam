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
    }
  }

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
    </div>
  )
}

export default Chart
