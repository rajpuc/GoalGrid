import React from 'react'

const Loader = () => {
  return (
  <div 
      className="absolute block h-screen w-full top-0 left-0 bg-cm-shadow z-50"
    >
      {/* Line Progress Container */}
      <div className="bg-gradient-to-r from-orange-400 via-red-500 via-pink-500 to-purple-500">
        {/* Before pseudo element equivalent */}
        <div 
          className="fixed top-0 left-0 bottom-0 h-0.5 bg-gradient-to-r from-orange-400 via-red-500 via-pink-500 to-purple-500 animate-indeterminate"
          style={{ zIndex: -100, willChange: 'left, right' }}
        />
        {/* After pseudo element equivalent */}
        <div 
          className="fixed top-0 left-0 bottom-0 h-0.5 bg-gradient-to-r from-orange-400 via-red-500 via-pink-500 to-purple-500 animate-indeterminate-short"
          style={{ zIndex: -100, willChange: 'left, right' }}
        />
      </div>
    </div>
  )
}

export default Loader
