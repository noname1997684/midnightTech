import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'

const layout = ({children}) => {
  return (
    <main>
        <Header/>
        {children}
        <Footer/>
    </main>
  )
}

export default layout