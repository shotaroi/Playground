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
  const [title, setTitle] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [updatingId, setUpdatingId] = useState<number | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

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
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [])

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return
    try {
      setError(null)
      const res = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: trimmed }),
      })
      if (!res.ok) {
        setError(`${res.status} ${res.statusText}`)
        return
      }
      const created: Todo = await res.json()
      setTodos((prev) => [...prev, created])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create')
    }
  }

  async function handleToggleComplete(todo: Todo) {
    const next = !todo.completed
    try {
      setError(null)
      const res = await fetch(`/api/todos/${todo.id}`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({completed: next}),
      })
      if (!res.ok) {
        setError(`${res.status} ${res.statusText}`)
        return
      }
      const updated: Todo = await res.json()
      setTodos((prev) => 
        prev.map((t) => t.id === updated.id ? updated : t))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update')
    }
  }

  return (
    <>
     
    </>
  )
}

export default App
