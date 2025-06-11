import { flex } from '@renderer/utils'
import { styled } from 'styled-components'
import { Text } from '@renderer/components/common'
import { IconAdd, IconDocument } from '@renderer/design/icons'
import { color } from '@renderer/design/styles'

const SeriesRoot = () => {
  return (
    <StyledSeriesRoot>
      <IconDocument
        width={24}
        height={24}
        onClick={() => {
          /*시리즈 열기 조정 */
        }}
      />
      <Text fontType="B1" color={color.G800} width="calc(100% - 58px)" ellipsis={true}>
        {/*시리즈의 제목 */}
      </Text>
      <IconAdd
        width={20}
        height={20}
        onClick={() => {
          /*콘텍스트 메뉴 띄워서 폴더 생성 또는 파일 생성 기능 연결 */
        }}
      />
    </StyledSeriesRoot>
  )
}

export default SeriesRoot

const StyledSeriesRoot = styled.div`
  ${flex({ alignItems: 'center', justifyContent: 'space-between' })}
  width: 100%;
  gap: 6px;
`
