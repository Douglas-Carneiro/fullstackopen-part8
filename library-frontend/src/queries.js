import { gql  } from '@apollo/client'

const BOOK_DETAILS = gql`
  fragment BookDetails on Book {
    title
    author {
      name
      born
      bookCount
      id
    }
    published
    genres
    id
  }
`

export const CREATE_BOOK = gql`
mutation createBook($title: String!, $authorName: String!, $published: Int!, $genres: [String!]!) {
  addBook(
    title: $title,
    authorName: $authorName,
    published: $published,
    genres: $genres
  ) {
    title
    author {
      name
    }
    id
    published
    genres
  }
}
`

export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      ...BookDetails
    }
  }
  
${BOOK_DETAILS}
`

export const CREATE_AUTHOR = gql`
mutation createAuthor($name: String!) {
  addAuthor( name: $name ) {
    name
    id
  }
}
`

export const ALL_AUTHORS = gql`
query {
  allAuthors  {
    name
    born
    bookCount
    id
  }
}
`

export const ME = gql`
query {
  me  {
    username
    favoriteGenre
    id
  }
}
`

export const ALL_BOOKS = gql`
query {
  allBooks {
    title
    author {
      name
      born
      bookCount
      id
    }
    published
    genres
    id
  }
}
`

export const BOOKS_BY_GENRE = gql`
query($genre: String) {
  allBooks(genre: $genre) {
    title
    author {
      name
      born
      bookCount
      id
    }
    published
    genres
    id
  }
}
`

export const FIND_AUTHOR = gql`
query findAuthorByName($nameToSearch: String!) {
  findAuthor(name: $nameToSearch) {
    name
    born 
    id
    bookCount
  }
}
`

export const EDIT_BIRTH = gql`
  mutation editBirth($name: String!, $birth: Int!) {
    editAuthor(name: $name, setBornTo: $birth)  {
      name
      born
      bookCount
      id
    }
  }
`

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
      value
    }
  }
`