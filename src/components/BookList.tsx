import { ChangeEvent, FormEvent, useEffect, useId, useMemo, useState } from 'react'
import './BookList.css'

export type Book = {
  id: string
  title: string
  description?: string
  imageUrl?: string
}

type BookListProps = {
  initialBooks: Book[]
  heading?: string
  placeholderImage?: string
}

type BookCardProps = Book & { placeholderImage: string }

const DEFAULT_PLACEHOLDER = 'https://placehold.co/96x96?text=Book'
const EMPTY_DRAFT = { title: '', description: '', imageUrl: '' }
type Draft = typeof EMPTY_DRAFT
const createDraft = (): Draft => ({ ...EMPTY_DRAFT })

const createId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }

  return Math.random().toString(36).slice(2)
}

export function BookList({
  initialBooks,
  heading = 'Reading List',
  placeholderImage = DEFAULT_PLACEHOLDER,
}: BookListProps) {
  const [books, setBooks] = useState<Book[]>(initialBooks)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [isComposerOpen, setIsComposerOpen] = useState(false)
  const [draft, setDraft] = useState<Draft>(() => createDraft())
  const [composerError, setComposerError] = useState<string | null>(null)
  const composerId = useId()

  useEffect(() => {
    setBooks(initialBooks)
  }, [initialBooks])

  const filteredBooks = useMemo(() => {
    const normalizedTerm = searchTerm.trim().toLowerCase()

    const matchTerm = (book: Book) => {
      if (!normalizedTerm) return true
      return (
        book.title.toLowerCase().includes(normalizedTerm) ||
        (book.description ?? '').toLowerCase().includes(normalizedTerm)
      )
    }

    const sorted = [...books].sort((a, b) => {
      const comparison = a.title.localeCompare(b.title, undefined, { sensitivity: 'base' })
      return sortOrder === 'asc' ? comparison : -comparison
    })

    return sorted.filter(matchTerm)
  }, [books, searchTerm, sortOrder])

  const handleAddBook = () => {
    setBooks((prev) => {
      const nextNumber = prev.length + 1
      const fallback: Book = {
        id: createId(),
        title: `Untitled Book ${nextNumber}`,
        description: 'This is a placeholder entry. Replace it with a real recommendation.',
      }
      return [...prev, fallback]
    })
  }

  const handleComposerChange =
    (field: keyof Draft) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = event.target.value
    setDraft((prev) => ({ ...prev, [field]: value }))
  }

  const handleComposerSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!draft.title.trim()) {
      setComposerError('A title is required to add a book.')
      return
    }

    setComposerError(null)
    setBooks((prev) => [
      ...prev,
      {
        id: createId(),
        title: draft.title.trim(),
        description: draft.description.trim() || undefined,
        imageUrl: draft.imageUrl.trim() || undefined,
      },
    ])
    setDraft(createDraft())
    setIsComposerOpen(false)
  }

  const composerTitleId = `${composerId}-title`
  const composerDescriptionId = `${composerId}-description`
  const composerImageId = `${composerId}-image`

  const resultsCopy =
    filteredBooks.length === books.length && !searchTerm
      ? `${books.length} ${books.length === 1 ? 'book' : 'books'} in total`
      : `${filteredBooks.length} of ${books.length} showing`

  return (
    <section className="book-list" aria-label="Book list" aria-live="polite">
      <div className="book-list__header">
        <h1>{heading}</h1>
        <div className="book-list__header-actions">
          <button type="button" className="book-list__add-button" onClick={handleAddBook}>
            Add Book
          </button>
          <button
            type="button"
            className="book-list__composer-toggle"
            aria-pressed={isComposerOpen}
            onClick={() => setIsComposerOpen((open) => !open)}
          >
            {isComposerOpen ? 'Close Form' : 'New Entry'}
          </button>
        </div>
      </div>
      <div className="book-list__controls" role="search">
        <label className="book-list__field">
          <span>Search</span>
          <input
            type="search"
            placeholder="Find by title or description..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </label>
        <label className="book-list__field book-list__field--compact">
          <span>Sort</span>
          <select value={sortOrder} onChange={(event) => setSortOrder(event.target.value as 'asc' | 'desc')}>
            <option value="asc">Title A → Z</option>
            <option value="desc">Title Z → A</option>
          </select>
        </label>
        <p className="book-list__status" role="status">
          {resultsCopy}
        </p>
      </div>
      {isComposerOpen && (
        <form className="book-composer" onSubmit={handleComposerSubmit} aria-label="Add a custom book">
          <div className="book-composer__grid">
            <label className="book-composer__field" htmlFor={composerTitleId}>
              Title *
              <input
                id={composerTitleId}
                name="title"
                type="text"
                required
                value={draft.title}
                onChange={handleComposerChange('title')}
                placeholder="e.g., Clean Architecture"
              />
            </label>
            <label className="book-composer__field" htmlFor={composerImageId}>
              Image URL
              <input
                id={composerImageId}
                name="imageUrl"
                type="url"
                inputMode="url"
                value={draft.imageUrl}
                onChange={handleComposerChange('imageUrl')}
                placeholder="https://example.com/cover.jpg"
              />
            </label>
            <label className="book-composer__field book-composer__field--full" htmlFor={composerDescriptionId}>
              Description
              <textarea
                id={composerDescriptionId}
                name="description"
                rows={3}
                value={draft.description}
                onChange={handleComposerChange('description')}
                placeholder="Why should teammates read this?"
              />
            </label>
          </div>
          {composerError && (
            <p role="alert" className="book-composer__error">
              {composerError}
            </p>
          )}
          <div className="book-composer__actions">
            <button type="button" className="book-composer__secondary" onClick={() => setIsComposerOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="book-composer__primary">
              Save Entry
            </button>
          </div>
        </form>
      )}
      {filteredBooks.length === 0 ? (
        <p className="book-list__empty" role="status">
          {books.length === 0
            ? 'No books to display. Use the Add Book button to create your first entry.'
            : 'No books fit this search. Try adjusting your filters.'}
        </p>
      ) : (
        <ul className="book-list__items">
          {filteredBooks.map((book) => (
            <li key={book.id}>
              <BookCard {...book} placeholderImage={placeholderImage} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function BookCard({ title, description, imageUrl, placeholderImage }: BookCardProps) {
  const [showDescription, setShowDescription] = useState(false)
  const [imageError, setImageError] = useState(false)
  const descriptionId = useId()

  const imageSrc = !imageError && imageUrl ? imageUrl : placeholderImage

  const toggleDescription = () => {
    setShowDescription((visible) => !visible)
  }

  const buttonLabel = showDescription ? `Hide description for ${title}` : `Show description for ${title}`
  const imageAlt = imageError || !imageUrl ? 'Placeholder book cover art' : `${title} cover art`

  return (
    <article className="book-card" data-expanded={showDescription ? 'true' : 'false'}>
      <div className="book-card__media">
        <img
          src={imageSrc}
          alt={imageAlt}
          width={96}
          height={96}
          loading="lazy"
          onError={() => setImageError(true)}
        />
      </div>
      <div className="book-card__content">
        <h2>{title}</h2>
        <button
          type="button"
          onClick={toggleDescription}
          aria-expanded={showDescription}
          aria-controls={descriptionId}
          className="book-card__toggle"
        >
          {buttonLabel}
        </button>
        {showDescription && (
          <p id={descriptionId} className="book-card__description">
            {description ?? 'Description unavailable.'}
          </p>
        )}
      </div>
    </article>
  )
}

export default BookList
