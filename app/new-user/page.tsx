import React from 'react'

const NewUserPage = () => {
  return (
    <div>
      <h1>Create a New User</h1>
      <form>
        <input type="text" placeholder="Enter your name" />
        <input type="email" placeholder="Enter your email" />
        <button type="submit">Create User</button>
      </form>
    </div>
  )
}

export default NewUserPage
