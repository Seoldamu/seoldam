import { useRef, useState } from 'react'
import styled, { CSSProperties } from 'styled-components'
import Text from '../Text/Text'
import { color } from '@renderer/design/styles'

interface Props {
  width?: CSSProperties['width']
  height?: CSSProperties['height']
  borderRadius?: CSSProperties['borderRadius']
  value: string
  onChange?: (file: File) => void
}

const ImageUploader = ({
  width = '160px',
  height = '220px',
  borderRadius = '12px',
  value,
  onChange
}: Props) => {
  const [isHover, setIsHover] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const defaultImage = '/DefaultSeriesCover.png'
  const imageSrc = preview || value || defaultImage

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setPreview(url)
    onChange && onChange(file)
  }

  const handleClick = () => {
    inputRef.current?.click()
  }

  return (
    <StyledImageUploader
      style={{ width, height, borderRadius }}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onClick={handleClick}
    >
      <Image src={imageSrc} alt="cover" draggable={false} />
      {isHover && (
        <HoverOverlay>
          <Text fontType="L1" color={color.G0}>
            표지 변경
          </Text>
        </HoverOverlay>
      )}
      <HiddenInput type="file" accept="image/*" ref={inputRef} onChange={handleFileChange} />
    </StyledImageUploader>
  )
}

export default ImageUploader

const StyledImageUploader = styled.div`
  overflow: hidden;
  position: relative;
  cursor: pointer;
  border: 1px solid #eee;
  background: #f8f8f8;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
  user-select: none;
`

const HoverOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
`

const HiddenInput = styled.input`
  display: none;
`
