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
    setCreating(true)
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
      setTitle('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create')
    } finally {
      setCreating(false)
    }
  }

  async function handleToggleComplete(todo: Todo) {
    if (updatingId !== null || deletingId !== null) return

    const next = !todo.completed
    setUpdatingId(todo.id)
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
    } finally {
      setUpdatingId(null)
    }
  }

  async function handleDelete(id: number) {
    if (deletingId !== null || updatingId !== null) return

    setDeletingId(id)
    try {
      setError(null)
      const res = await fetch(`/api/todos/${id}`, {method: 'DELETE'})
      if (!res.ok) {
        setError(`${res.status} ${res.statusText}`)
        return
      }
      setTodos((prev) => prev.filter((t) => t.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <>
     <main>
      <h1>Todos</h1>

      {error ? (
        <p role="alert" className='error'>{error}</p>
      ) : null}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <form onSubmit={handleCreate}>
            <label htmlFor="new-todo-title">New todo</label>
            <input 
              id="new-todo-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={500}
              disabled={creating}
            />
            <button type='submit' disabled={creating}>
              {creating ? 'Adding...' : 'Add'}
            </button>
          </form>

          {todos.length === 0 ? (
            <p>No todos yet.</p>
          ) : (
            <ul>
              {todos.map((todo) => {
                const busy = 
                updatingId === todo.id || deletingId === todo.id
                return (
                  <li key={todo.id}>
                    <label>
                      <input 
                        type="checkbox" 
                        checked={todo.completed}
                        disabled={busy || updatingId !== null}
                        onChange={() => handleToggleComplete(todo)}
                      />
                      <span
                        style={{
                          textDecoration: todo.completed
                          ? 'line-through'
                          : undefined,
                        }}
                      >
                        {todo.title}
                      </span>
                    </label>
                    <button
                      type='button'
                      disabled={
                        busy ||
                        deletingId !== null ||
                        updatingId !== null
                      }
                      onClick={() => handleDelete(todo.id)}
                    >
                      {deletingId === todo.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </>
      )}
     </main>
    </>
  )
}

export default App
