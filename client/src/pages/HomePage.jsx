import React from 'react'
import Sidebar from '../components/Sidebar'
import ChatContainer from '../components/ChatContainer'
import RightSidebar from '../components/RightSidebar'

const HomePage = () => {

  // creating state variables
  const [showRightInMain, setShowRightInMain] = React.useState(false);
  return (
    <div className='border w-full h-screen sm:px-[15%] sm:py-[5%]'>

      {/* in this div we are defining the states */}
      <div className={`backdrop-blur-xl border-2 border-gray-600 
      rounded-2xl overflow-hidden h-[100%] grid grid-cols-1 
      relative ${'md:grid-cols-[1fr_1.5fr] xl:grid-cols-[1fr_2fr]'}`}>
        
        {/* mounting the components , and passing the props for navigation*/}
        <Sidebar  setShowRightInMain={setShowRightInMain} />

        {showRightInMain ? (
          <RightSidebar  setShowRightInMain={setShowRightInMain} />
        ):(
          <ChatContainer  setShowRightInMain={setShowRightInMain}/>
        )} 
        
        {/*<RightSidebar selectedUser={selectedUser} setSelectedUser={setSelectedUser}/>*/}
      </div>
    </div>
  )
}

export default HomePage
