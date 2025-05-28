import { Row } from '@renderer/components/common'
import { IconButton } from '@renderer/design/ui'
import { flex } from '@renderer/utils'
import { styled } from 'styled-components'

const Series = () => {
  const handleAddSeriesButtonClick = () => {
    console.log('새 시리즈 생성 버튼이 클릭 되었어요!')
  }

  return (
    <StyledSeries>
      <Row justifyContent="flex-end">
        <IconButton onClick={handleAddSeriesButtonClick}>새 시리즈</IconButton>
      </Row>
    </StyledSeries>
  )
}

export default Series

const StyledSeries = styled.div`
  ${flex({ flexDirection: 'column' })}
  width: 100%;
  padding-right: 10px;
  gap: 24px;
`
