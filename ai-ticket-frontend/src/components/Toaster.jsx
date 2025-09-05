import React from 'react'
import {Toaster} from 'react-hot-toast'

function CustomToaster() {
  return (
     <Toaster
      position="top-center"
      reverseOrder={false}
      toastOptions={{
        duration: 4000,
        style: {
          background: '#fff',
          color: '#333',
          border: '1px solid #ddd',
        },
        success: {
          style: {
            background: '#d1fae5',
            color: '#065f46',
          },
        },
        error: {
          style: {
            background: '#fee2e2',
            color: '#991b1b',
          },
        },
      }}
    />
  )
}

export default CustomToaster