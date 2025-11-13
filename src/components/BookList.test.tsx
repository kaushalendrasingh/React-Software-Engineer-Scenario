import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BookList, type Book } from './BookList'

const baseBooks: Book[] = [
  {
    id: 'test-id',
    title: 'Test Driven Development',
    description: 'A book about writing tests before production code.',
  },
]

const extendedBooks: Book[] = [
  ...baseBooks,
  {
    id: 'refactoring',
    title: 'Refactoring',
    description: 'Improve existing code in safe, incremental steps.',
  },
]

describe('BookList', () => {
  it('reveals the description for a book when toggled', async () => {
    const user = userEvent.setup()
    render(<BookList initialBooks={baseBooks} heading="Test Shelf" />)

    expect(screen.queryByText(baseBooks[0].description!)).not.toBeInTheDocument()

    const toggle = screen.getByRole('button', { name: /show description for test driven development/i })
    await user.click(toggle)

    expect(screen.getByText(baseBooks[0].description!)).toBeVisible()
  })

  it('adds a new book when the add button is clicked', async () => {
    const user = userEvent.setup()
    render(<BookList initialBooks={baseBooks} heading="Test Shelf" />)

    const addButton = screen.getByRole('button', { name: /^add book$/i })
    await user.click(addButton)

    expect(await screen.findByRole('heading', { level: 2, name: /untitled book 2/i })).toBeVisible()
  })

  it('filters books based on the search input', async () => {
    const user = userEvent.setup()
    render(<BookList initialBooks={extendedBooks} heading="Test Shelf" />)

    const searchBox = screen.getByRole('searchbox', { name: /search/i })
    await user.type(searchBox, 'refactoring')

    expect(screen.getByRole('heading', { level: 2, name: /refactoring/i })).toBeVisible()
    expect(screen.queryByRole('heading', { level: 2, name: /test driven development/i })).not.toBeInTheDocument()
  })
})
