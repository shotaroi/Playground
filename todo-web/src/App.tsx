import { useEffect, useState } from 'react'
import './App.css'

type Todo = {
  id: number
  title: string
  completed: boolean
  createdAt: string
  updatedAt: string
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        setError(null)
        const res = await fetch("/api/todos")
        if (!res.ok) {
          setError(`${res.status} ${res.statusText}`)
          return
        }
        const data: Todo[] = await res.json()
        if (!cancelled) setTodos(data)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load')
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <>
     
    </>
  )
}

export default App
