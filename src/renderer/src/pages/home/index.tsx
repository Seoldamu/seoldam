const Home = () => {
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  return (
    <div>
      홈 페이지 입니다. 다들 방가방가 ping 한번 넣어봄.
      <div className="action">
        <a target="_blank" rel="noreferrer" onClick={ipcHandle}>
          Send IPC
        </a>
      </div>
    </div>
  )
}

export default Home
