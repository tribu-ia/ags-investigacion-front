'use client'

import { useState, useEffect } from 'react'

interface VoiceButtonProps {
  onTranscript: (text: string) => void
}

const WaveAnimation = ({ isListening }: { isListening: boolean }) => (
  <div className="flex items-center justify-center space-x-1 h-12">
    {[...Array(5)].map((_, i) => (
      <div
        key={i}
        className={`
          w-1.5 h-8 bg-[#4fc3f7] rounded-full transform origin-bottom
          transition-all duration-75
          ${isListening ? 'animate-wave' : 'h-2'}
        `}
        style={{
          animationDelay: `${i * 0.1}s`,
          opacity: isListening ? '1' : '0.5'
        }}
      />
    ))}
  </div>
)

export function VoiceButton({ onTranscript }: VoiceButtonProps) {
  const [isListening, setIsListening] = useState(false)
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognition = new SpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = 'es-ES'

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        onTranscript(transcript)
        setIsListening(false)
      }

      recognition.onerror = () => {
        setIsListening(false)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      setRecognition(recognition)
    }
  }, [onTranscript])

  const toggleListening = () => {
    if (!recognition) return

    if (isListening) {
      recognition.stop()
    } else {
      recognition.start()
      setIsListening(true)
    }
  }

  return (
    <button
      onClick={toggleListening}
      className="relative group"
      aria-label="Voice Input"
    >
      <div className={`
        absolute -inset-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500
        rounded-full opacity-75 group-hover:opacity-100 blur-lg transition
        animate-gradient-xy
        ${isListening ? 'scale-125' : 'scale-100'}
      `} />
      <div className={`
        relative w-32 h-32 rounded-full flex items-center justify-center
        bg-[#0d1117] border-4 border-[#4fc3f7] transition-all duration-300
        ${isListening ? 'border-red-500 animate-pulse' : ''}
      `}>
        <WaveAnimation isListening={isListening} />
      </div>
      {isListening && (
        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          <div className="w-2 h-2 bg-[#4fc3f7] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-[#4fc3f7] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-[#4fc3f7] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      )}
    </button>
  )
} 