const Lab = () => {
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  return (
    <div>
      <div>실험실 페이지 입니다.</div>
      <a target="_blank" rel="noreferrer" onClick={ipcHandle}>
        Send IPC
      </a>
    </div>
  )
}

export default Lab
