import React, { useState, useEffect } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Recommendations from './components/Recommendations'
import {
  useQuery, useLazyQuery, useSubscription, useApolloClient
} from '@apollo/client'
import { ALL_BOOKS, ALL_AUTHORS, ME, BOOK_ADDED } from './queries'

const App = () => {
  const [page, setPage] = useState('authors')
  const [errorMessage, setErrorMessage] = useState(null)
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)
  const result = useQuery(ALL_AUTHORS)
  const result2 = useQuery(ALL_BOOKS)
  const [getUser] = useLazyQuery(ME, {
    fetchPolicy: 'network-only',
    // nextFetchPolicy: "cache-first",
    onCompleted: (data) => { 
      console.log('completion data: ', data)
      setUser(data.me) 
    },
    onError: (error) => {
      notify(error.graphQLErrors[0].message)
    },
  })
  const client = useApolloClient()

  // Get the token of the logged user if there's any
  useEffect(() => {
    const savedToken = localStorage.getItem('phonenumbers-user-token')
    if (savedToken) {
      setToken(`bearer ${savedToken}`)
    }
  }, [])

  useEffect(() => {
    console.log('Query ME refetched')
    // It seems like the user is not readily available in the server context
    // so this was the solution I came up with to set the user immediately after login,
    // that is waiting one second to fetch the query ME
    if (!user) {
      setTimeout(() => {
        getUser()
    }, 1000);
    }getUser()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  const updateCacheWith = (addedBook) => {
    const includedIn = (set, object) => 
      set.map(p => p.id).includes(object.id)  

    const dataInStore = client.readQuery({ query: ALL_BOOKS })
    if (!includedIn(dataInStore.allBooks, addedBook)) {
      client.writeQuery({
        query: ALL_BOOKS,
        data: { allBooks : dataInStore.allBooks.concat(addedBook) }
      })
    }   
  }

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const addedBook = subscriptionData.data.bookAdded
      notify(`${addedBook.title} added`)
      console.log(subscriptionData)
      alert(`New book: '${addedBook.title}' added!`)
      updateCacheWith(addedBook)
    }
  })

  // Without this if the app crashes, because the query must be finished before trying to acess its data
  if (result.loading || result2.loading)  {
    return <div>loading...</div>
  }

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.clear()
    client.resetStore()
  }

  return (
    <div>
      <Notify errorMessage={errorMessage} />
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        
        {token ? 
          <>
            <button onClick={() => setPage('add')}>add book</button>
            <button onClick={() => setPage('recommend')}>recommend</button>
            <button onClick={logout}>
              logout
            </button>
          </> :
          <button onClick={() => setPage('login')}>login</button>
        }
      </div>

      <Authors
        show={page === 'authors'}
        authors={result.data.allAuthors}
        setError={notify}
        token={token}
      />

      <Books
        show={page === 'books'}
        books={result2.data.allBooks}
      />

      <NewBook
        show={page === 'add'}
        setError={notify}
        allowed={token !== null}
        favoriteGenre={user? user.favoriteGenre : null}
        updateCacheWith={updateCacheWith}
      />

      {user ? <Recommendations
        show={page === 'recommend'}
        books={result2.data.allBooks}
        favoriteGenre={user? user.favoriteGenre : null}
        setError={notify}
      /> : null}

      <LoginForm
        show={page === 'login'}
        setToken={setToken}
        setError={notify}
        setPage={setPage}
        setUser={setUser}
      />

    </div>
  )
}

const Notify = ({errorMessage}) => {
  if ( !errorMessage ) {
    return null
  }
  return (
    <div style={{color: 'red'}}>
    {errorMessage}
    </div>
  )
}

export default App