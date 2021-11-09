import React, { useState, useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'
import { BOOKS_BY_GENRE } from '../queries'

const Books = (props) => {
  const [books, setBooks] = useState([])
  const [getBooks, result] = useLazyQuery(BOOKS_BY_GENRE, {
    fetchPolicy: 'cache-and-network',
    onCompleted: (data) => { setBooks(data.allBooks) },
    onError: (error) => {
      props.setError(error.graphQLErrors[0].message)
    },
  })

  useEffect(
    () => {
      getBooks({ variables: {genre: props.favoriteGenre} })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [props.show],
  )

  if (!props.show) {
    return null
  }

  if (result.loading) {
    return <div>...loading</div>
  }

  const favoriteGenre = props.favoriteGenre

  if(books) {
    return (
      <div>
        <h2>Recommendations</h2>
        {<p>Based in your favorite genre: <strong>{favoriteGenre}</strong> </p>}
  
        <table>
          <tbody>
            <tr>
              <th>title</th>
              <th>
                author
              </th>
              <th>
                published
              </th>
            </tr>
            {books.map(b => 
              <tr key={b.title}>
                <td>{b.title}</td>
                <td>{b.author.name}</td>
                <td>{b.published}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    )
  }
}

export default Books