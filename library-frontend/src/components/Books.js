import React, { useState } from 'react'

const Books = (props) => {
  const [filter, setFilter] = useState('')

  if (!props.show) {
    return null
  }

  const books = props.books
  const genresSet = new Set()
  const genres = books.map(book => 
    book.genres.map(g => g))
  books.map(book => 
    book.genres.map(g => genresSet.add(g)))
  console.log('Genres: ', genres)
  console.log('Books: ', books)
  console.log('Set: ', genresSet)
  console.log('First genre: ', [...genresSet][0])

  // This causes infinite loop
  // setFilter([...genresSet][0])

  return (
    <div>
      <h2>books</h2>
      {filter ? <p>in genre <strong>{filter}</strong> </p> : <p>select a genre</p>}

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
          {books.map(b => {
            if (b.genres.find(el => el === filter)){
              return (<tr key={b.title}>
                <td>{b.title}</td>
                <td>{b.author.name}</td>
                <td>{b.published}</td>
              </tr>)
            } else return null
          })}
        </tbody>
      </table>
      <div>
        {[...genresSet].map(genre => 
          <button key={genre} onClick={() => setFilter(genre)}>
          {genre}
        </button>)}
      </div>
    </div>
  )
}

export default Books