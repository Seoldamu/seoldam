import { Row } from '@renderer/components/common'
import { color } from '@renderer/design/styles'
import { flex } from '@renderer/utils'
import { styled } from 'styled-components'
import Toolbar from './Toolbar/Toolbar'
import SavePanel from './SavePanel/SavePanel'

const FileEditor = () => {
  return (
    <StyledFileEditor>
      <Row width="72%" justifyContent="space-between">
        <Toolbar />
        <SavePanel />
      </Row>
    </StyledFileEditor>
  )
}

export default FileEditor

const StyledFileEditor = styled.div`
  ${flex({ flexDirection: 'column' })}
  width: 100%;
  padding: 40px 0px 0px 72px;
  gap: 19px;
  background: ${color.G0};
`
