import './App.css'
import BookList, { type Book } from './components/BookList'

const mockBooks: Book[] = [
  {
    id: 'atomic-habits',
    title: 'Atomic Habits',
    description: 'An actionable guide to building better habits and breaking bad ones using tiny behavior changes.',
    imageUrl: 'https://images.unsplash.com/photo-1529480786901-98cda847b5e0?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'design-of-everyday-things',
    title: 'The Design of Everyday Things',
    description: 'A classic exploration into human-centered design that still informs modern product thinking.',
    imageUrl: '',
  },
  {
    id: 'refactoring-ui',
    title: 'Refactoring UI',
    imageUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=200&q=80',
  },
]

function App() {
  return (
    <main className="app-shell">
      <BookList initialBooks={mockBooks} heading="Team Picks Reading List" />
    </main>
  )
}

export default App
