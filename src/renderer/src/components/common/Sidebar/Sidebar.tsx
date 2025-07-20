import { Column, SeriesSidebar, Text } from '@renderer/components/common'
import {
  IconCharacter,
  IconEditor,
  IconHome,
  IconLab,
  IconMemo,
  IconPlot
} from '@renderer/design/icons'
import { color } from '@renderer/design/styles'
import { useMemoStore } from '@renderer/stores'
import { flex } from '@renderer/utils'
import { useLocation, useNavigate } from 'react-router-dom'
import { css, styled } from 'styled-components'

export const NAVIGATION_DATA = [
  { route: '/', name: '홈', icon: IconHome },
  { route: '/editor', name: '편집', icon: IconEditor },
  { route: '/plot', name: '줄거리', icon: IconPlot },
  { route: '/lab', name: '실험실', icon: IconLab },
  { route: '/memo', name: '메모', icon: IconMemo },
  { route: '/character', name: '캐릭터', icon: IconCharacter }
]

const Sidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const pathname = location.pathname
  const { clearCurrentMemoPath } = useMemoStore()

  const handleNavigation = (route: string) => {
    if (route === '/memo') {
      clearCurrentMemoPath()
    }
    navigate(route)
  }

  return (
    <StyledSidebar>
      <Column gap={2}>
        {NAVIGATION_DATA.map(({ route, name, icon: Icon }) => (
          <NavigationItem
            key={`navigation ${name}`}
            $active={pathname === route}
            onClick={() => handleNavigation(route)}
          >
            <Icon width={30} height={30} active={pathname === route} />
            <Text fontType="L1" color={color.primary}>
              {name}
            </Text>
          </NavigationItem>
        ))}
      </Column>
      <SeriesSidebar />
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
  cursor: pointer;

  ${({ $active }) =>
    $active &&
    css`
      background: ${color.G20};
    `}
`
