import React from 'react'

const MobileScroll = () => (
  <div style={{ height: '100px', width: '100%' }} />
)

const Layout = ({ children }) => {
  return (
    <div className='layout'>
      {children}
      <MobileScroll />
    </div>
  )
}

export default Layout
