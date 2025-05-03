import './App.css'
import { ConfigProvider, Space, theme } from 'antd'
import TranslationForm from './TranslationForm'
import { useEffect, useState, ReactNode } from 'react'

function App() {
  const [particles, setParticles] = useState<ReactNode[]>([])

  useEffect(() => {
    // Create 50 particles
    const newParticles = Array.from({ length: 50 }).map((_, index) => (
      <div
        key={index}
        className="particle"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 15}s`,
          animationDuration: `${10 + Math.random() * 10}s`
        }}
      />
    ))
    setParticles(newParticles)
  }, [])

  return (
    <div className="app-container">
      <div className="floating-particles">{particles}</div>
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm
        }}
      >
        <Space style={{ margin: 'auto' }}>
          <TranslationForm />
        </Space>
      </ConfigProvider>

      <div className="floating-branding">
        <div className="brand-content">
          <div className="profile-image-container">
            <div className="profile-overlay"></div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '.625rem' }}>developed by</span>
            <a
              href="https://github.com/maheenur13"
              target="_blank"
              rel="noopener noreferrer"
              className="username-link"
            >
              maheenur13
            </a>
          </div>
          {/* <a
            href="https://github.com/maheenur13"
            target="_blank"
            rel="noopener noreferrer"
            className="github-link"
          >
            <GithubOutlined />
          </a> */}
        </div>
      </div>
    </div>
  )
}

export default App
