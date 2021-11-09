import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import { CREATE_BOOK, ALL_AUTHORS  } from '../queries'

const NewBook = (props) => {
  const [title, setTitle] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [published, setPublished] = useState(2021)
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])
  
  const [ createBook ] = useMutation(CREATE_BOOK, {
    // If a new author is created he will be shown in authors view 
    refetchQueries: [
      { query: ALL_AUTHORS } 
    ],
    onError: (error) => {
      props.setError(error.graphQLErrors[0].message)
    },
    update: (store, response) => {
      props.updateCacheWith(response.data.addBook)
    }
  })

  if (!props.show) {
    return null
  }

  if (!props.allowed) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()

    createBook({ variables: { title, authorName, published, genres }})

    setTitle('')
    setPublished('')
    setAuthorName('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={authorName}
            onChange={({ target }) => setAuthorName(target.value)}
          />
        </div>
        <div>
          published
          <input
            type='number'
            value={published}
            onChange={({ target }) => setPublished(Number(target.value))}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">add genre</button>
        </div>
        <div>
          genres: {genres.join(' ')}
        </div>
        <button type='submit'>create book</button>
      </form>
    </div>
  )
}

export default NewBook
