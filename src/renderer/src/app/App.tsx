import { Home, Editor, Plot, Lab, Memo, Character } from '@renderer/pages'
import { Route, Routes } from 'react-router-dom'
import AppLayout from './AppLayout'

const App = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/editor" element={<Editor />} />
        <Route path="/plot" element={<Plot />} />
        <Route path="/lab" element={<Lab />} />
        <Route path="/memo" element={<Memo />} />
        <Route path="/character" element={<Character />} />
      </Route>
    </Routes>
  )
}

export default App
