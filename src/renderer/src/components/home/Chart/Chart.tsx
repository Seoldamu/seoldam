import { color } from '@renderer/design/styles'
import ReactECharts from 'echarts-for-react'
import ChangeMonthModal from './ChangeMonthModal/ChangeMonthModal'
import { useOverlay } from '@renderer/hooks'
import { Text } from '@renderer/components/common'
import { styled } from 'styled-components'
import { flex } from '@renderer/utils'
import { IconCompareArrow } from '@renderer/design/icons'
import { useMonthStore, useTodayCharCountStore } from '@renderer/stores'
import { useEffect, useState } from 'react'

const Chart = () => {
  const [compareMonthCharCountsList, setCompareMonthCharCountsList] = useState<number[]>([])
  const [comparedMonthCharCountsList, setComparedMonthCharCountsList] = useState<number[]>([])
  const { compareMonth, comparedMonth } = useMonthStore()
  const { todayCharCount } = useTodayCharCountStore()

  useEffect(() => {
    window.api.getSeriesCharCountsList(compareMonth).then((data: number[]) => {
      setCompareMonthCharCountsList(data)
    })

    window.api.getSeriesCharCountsList(comparedMonth).then((data: number[]) => {
      setComparedMonthCharCountsList(data)
    })
  }, [compareMonth, comparedMonth])

  const labels = Array.from({ length: 31 }, (_, i) => i + 1)

  const option = {
    title: {
      text: `오늘 쓴 글자\n{num|${todayCharCount}자}`,
      left: 10,
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
      data: [
        `${compareMonth.year}.${compareMonth.month}월 쓴 글자 수`,
        `${comparedMonth.year}.${comparedMonth.month}월 쓴 글자 수`
      ],
      top: 20,
      right: 10,
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
        name: `${compareMonth.year}.${compareMonth.month}월 쓴 글자 수`,
        type: 'line',
        data: compareMonthCharCountsList,
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
        name: `${comparedMonth.year}.${comparedMonth.month}월 쓴 글자 수`,
        type: 'line',
        data: comparedMonthCharCountsList,
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
      left: 10,
      right: 10,
      top: `76px`,
      bottom: 0,
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: labels, // 날짜
      boundaryGap: false,
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
    },
    dataZoom: [
      {
        type: 'inside',
        start: labels.length,
        end: labels.length > 7 ? (7 / labels.length) * 100 : 100,
        minSpan: (7 / labels.length) * 100
      }
    ]
  }

  const { handleOpen, Overlay } = useOverlay(({ isOpen, onClose }) => (
    <ChangeMonthModal isOpen={isOpen} onClose={onClose} />
  ))

  return (
    <div style={{ width: '100%', height: '300px', position: 'relative' }}>
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 6,
          zIndex: 10
        }}
      >
        <ChangeMonthButton onClick={handleOpen}>
          <IconCompareArrow />
          <Text fontType="L4" color={color.G100}>
            비교 달 변경
          </Text>
        </ChangeMonthButton>
      </div>
      <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
      {Overlay}
    </div>
  )
}

export default Chart

const ChangeMonthButton = styled.div`
  ${flex({ alignItems: 'center' })}
  gap: 4px;

  cursor: pointer;
`
