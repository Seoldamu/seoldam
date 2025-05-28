import { Column } from '@renderer/components/common'
import { Button, IconButton, MiniDropdown, SeriesDropdown } from '@renderer/components/common'
import ContextMenu from '@renderer/components/common/ContextMenu/ContextMenu'
import { useEffect, useState } from 'react'

const Lab = () => {
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')
  const [form, setForm] = useState<{ value: string; label: string }>({ value: '', label: '' })
  const [forms, setForms] = useState<{ value: string; label: string }>({ value: '', label: '' })

  useEffect(() => {
    console.log(form)
  }, [form])

  const handleChange = (data: { value: string; label: string }) => {
    setForm(data)
  }
  const handleChange1 = (data: { value: string; label: string }) => {
    setForms(data)
  }

  return (
    <div>
      <Column gap={16}>
        <div>실험실 페이지 입니다.</div>
        <a target="_blank" rel="noreferrer" onClick={ipcHandle}>
          Send IPC
        </a>
        <Column gap={8}>
          <IconButton>새 글 작성</IconButton>
          <Button property="DEFAULT">value</Button>
          <Button property="DISABLED">취소</Button>
          <ContextMenu
            data={[
              { label: '삭제하기', value: 'delete', onClick: () => {} },
              { label: '삭제하기', value: 'delete', onClick: () => {} },
              { label: '삭제하기', value: 'delete', onClick: () => {} }
            ]}
          ></ContextMenu>
          <MiniDropdown
            name="minidropdow"
            label={form.label}
            value={form.value}
            data={[
              { label: '이 세계에서 사랑하는 방법', value: '이 세계에서 사랑하는 방법' },
              { label: '패스트라이프', value: '패스트라이프' },
              { label: '다섯 번째 계절', value: '다섯 번재 계절' },
              { label: '3분까진 필요없어', value: '3분까진 필요없어' }
            ]}
            onChange={handleChange}
          />
          <SeriesDropdown
            name="adfsaf"
            label={forms.label}
            value={forms.value}
            data={[
              { image: 'lab2.png', label: '패스트라이프', value: '패스트라이프' },
              { image: '이미지', label: 'you are my day', value: 'you are my day' },
              { image: '이미지', label: '다섯 번째 계절', value: '다섯 번째 계절' },
              { image: '이미지', label: '3분까진 필요없어', value: '3분까진 필요없어' }
            ]}
            onChange={handleChange1}
          />
        </Column>
      </Column>
    </div>
  )
}

export default Lab
