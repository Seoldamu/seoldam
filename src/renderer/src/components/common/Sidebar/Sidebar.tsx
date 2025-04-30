import { color } from '@renderer/design/styles'
import { css, styled } from 'styled-components'
import { Column, Text } from '@renderer/components/common'
import { flex } from '@renderer/utils'
import IconHome from '@renderer/design/icons/IconHome'
import { useLocation, useNavigate } from 'react-router-dom'

export const NAVIGATION_DATA = [
  { route: '/', name: '홈' },
  { route: '/editor', name: '편집' },
  { route: '/plot', name: '줄거리' },
  { route: '/lab', name: '실험실' },
  { route: '/memo', name: '메모' },
  { route: '/character', name: '캐릭터' }
]

const Sidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const pathname = location.pathname

  return (
    <StyledSidebar>
      <Column gap={2}>
        {NAVIGATION_DATA.map(({ route, name }) => (
          <NavigationItem
            key={`navigation ${name}`}
            $active={pathname === route}
            onClick={() => {
              navigate(route)
            }}
          >
            <IconHome width={30} height={30} selected={pathname === route} />
            <Text fontType="L1" color={color.primary}>
              {name}
            </Text>
          </NavigationItem>
        ))}
      </Column>
    </StyledSidebar>
  )
}

export default Sidebar

const StyledSidebar = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 259px;
  height: 100vh;
  padding: 58px 0px 34px 0px;
  background: ${color.G0};
  border-right: 1px solid ${color.G30};
  flex-shrink: 0;
`

const NavigationItem = styled.div<{ $active: boolean }>`
  width: 100%;
  padding: 10px 24px;
  ${flex({ flexDirection: 'row', alignItems: 'center' })}
  gap: 10px;
  border-radius: 12px;

  ${({ $active }) =>
    $active &&
    css`
      background: ${color.G20};
    `}
`
