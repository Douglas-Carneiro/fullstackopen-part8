import React, { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'

import { EDIT_BIRTH } from '../queries'

const BornForm = ({ setError, names, allowed }) => {
  const [name, setName] = useState('')
  const [birth, setBirth] = useState('')

  const [ changeBirth, result ] = useMutation(EDIT_BIRTH)

  const submit = (event) => {
    event.preventDefault()

    changeBirth({ variables: { name, birth } })

    setName('')
    setBirth('')
  }

  useEffect(() => {
    if (result.data && result.data.editAuthor === null) {
      setError('author not found')
    }
  }, [result.data]) // eslint-disable-line 

  if (!allowed) {
    return null
  }

  return (
    <div>
      <h2>Set birthyear</h2>

      <form onSubmit={submit}>
        <div>
          name
          <select value={name} onChange={({ target }) => setName(target.value)}>
            {names.map(n => 
              <option value={n} key={n}>{n}</option>)}
          </select>
        </div>
        <div>
          born <input
            type='number'
            value={birth}
            onChange={({ target }) => setBirth(Number(target.value))}
          />
        </div>
        <button type='submit'>update author</button>
      </form>
    </div>
  )
}

export default BornForm