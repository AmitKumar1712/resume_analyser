import { useMemo } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import useResumeAnalysis from './hooks/useResumeAnalysis'

export default function App() {
  const { file, analysis, status, error, isAnalyzing, progress, history, theme, hasFile, setTheme, handleFileSelect, analyze, clearHistory } = useResumeAnalysis()

  const onToggleTheme = () => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
  }

  const pageProps = useMemo(() => ({
    file,
    analysis,
    status,
    error,
    isAnalyzing,
    progress,
    history,
    theme,
    hasFile,
    onToggleTheme,
    onFileSelect: handleFileSelect,
    onAnalyze: analyze,
    onClearHistory: clearHistory,
  }), [file, analysis, status, error, isAnalyzing, progress, theme, hasFile, handleFileSelect, analyze, clearHistory])

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home {...pageProps} />} />
      </Routes>
    </HashRouter>
  )
}
