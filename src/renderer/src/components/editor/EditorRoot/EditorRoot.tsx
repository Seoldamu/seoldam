import { EditableText, IconButton, Row, SeriesDropdown } from '@renderer/components/common'
import { color } from '@renderer/design/styles'
import { flex } from '@renderer/utils'
import { useState } from 'react'
import { styled } from 'styled-components'

const EditorRoot = () => {
  const [title, setTitle] = useState('이 세계에서 로맨스는 현실적으로 불가능하다.')

  const handleChange = (value: string) => {
    setTitle(value)
  }

  return (
    <StyledEditorRoot>
      <Row justifyContent="space-between">
        <Row gap={4}>
          <EditableText
            fontType="T2"
            color={color.G900}
            value={title}
            onChange={setTitle}
            maxWidth={300}
            ellipsis={true}
          />
          <SeriesDropdown
            name="series-title"
            value={title}
            data={[{ image: 'dummyImage1', value: '별종' }]}
            onChange={handleChange}
          />
        </Row>
        <IconButton
          onClick={() => {
            console.log('새 글 추가 버튼을 눌렀습니다.')
          }}
        >
          새 글
        </IconButton>
      </Row>
    </StyledEditorRoot>
  )
}

export default EditorRoot

const StyledEditorRoot = styled.div`
  ${flex({ justifyContent: 'center', flexDirection: 'column' })}
  width: 100%;
  padding: 68px 205px 0px 72px;
  gap: 38px;
  background: ${color.G0};
`
