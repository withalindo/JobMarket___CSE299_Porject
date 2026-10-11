import React from 'react'
import "./PostSignupCom.css"
import PostSignupHeader from '../../Components/PostSignupHeader/PostSignupHeader'
import PostSignupComBody from '../../Components/PostSignupComBody/PostSignupComBody'

const PostSignupCom = () => {
  return (
    <div className='postSignupCom'>
        <PostSignupHeader />
        <PostSignupComBody />
    </div>
  )
}

export default PostSignupCom
