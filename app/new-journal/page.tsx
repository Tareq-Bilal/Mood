import React from 'react'

const page = () => {
  return (
    <div>
      <h1>Create a New Journal Entry</h1>
      <form>
        <textarea placeholder="What's on your mind?" />
        <button type="submit">Save</button>
      </form>
    </div>
  )
}

export default page
