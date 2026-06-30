import { Navigate, Route, Routes } from "react-router-dom"
import { HomePage } from "@/pages/HomePage"
import { GamePage } from "@/pages/GamePage"

export function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/join/:joinCode" element={<HomePage />} />
      <Route path="/play/:sessionId" element={<GamePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
