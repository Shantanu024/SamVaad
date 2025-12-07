import React, { useRef, useContext, useState } from 'react'
import assets from '../assets/assets'
import { ChatContext } from '../../context/ChatContext.jsx'
import { AuthContext } from '../../context/AuthContext.jsx'
import { useEffect } from 'react'

const RightSideBar = ({setShowRightInMain}) => {
  
  const scrollEnd = useRef();
  
  const { selectedChatUser, messages } = useContext(ChatContext);
  const { onlineUsers} = useContext(AuthContext);
  const [ msgImages, setMsgImages ] = useState([]);

  //Get all images from messages
  useEffect (() => {
    setMsgImages(
      messages.filter(msg => msg.image).map(msg => msg.image)
    );
  }, [messages]);

  return selectedChatUser && (
    <div className={`bg-[#8185B2]/10 p-5 text-white relative ${selectedChatUser ? 'max-md:hidden' : "" }`}>
        
        <div className='relative pb-3 mb-2 border-b border-stone-500'>
          {/* Arrow icon at top right */}
          <img onClick={() => setShowRightInMain && setShowRightInMain(false)} src={assets.arrow_icon} alt="" className='absolute top-0 right-0 max-w-5 cursor-pointer'/>
          
          {/* Main content with image on left */}
          <div className='flex gap-4 pt-4'>
            {/* Left: Profile image and name */}
            <div className='flex flex-col items-center gap-2 flex-shrink-0'>
              <img src={selectedChatUser?.profilePic || assets.avatar_icon} alt="" className='w-20 aspect-[1/1] rounded-full'/>
              <h1 className='text-sm font-medium flex items-center gap-2'>
                {onlineUsers.includes(selectedChatUser._id) && <p className='w-2 h-2 rounded-full bg-green-500'></p>}
                {selectedChatUser.fullName}
              </h1>
            </div>
            
            {/* Right: Bio in center area */}
            <div className='flex-1 flex items-center'>
              <p className='text-xs text-center'>{selectedChatUser.bio}</p>
            </div>
          </div>
        </div>

        <div className='px-5 text-xs'>
          <p>Media</p>
          <div className='mt-2 max-h-[240px] overflow-y-scroll grid grid-cols-2 gap-4 opacity-80'>
            {msgImages.map((url, index) => (
              <div key={index} onClick={()=> window.open(url)} className='cursor-pointer rounded'>
                <img src={url} alt="" className='h-full rounded-md'/>
              </div>
            ))}
            <div ref={scrollEnd}></div>
          </div>
        </div>
 
    </div>
  )
}

export default RightSideBar
