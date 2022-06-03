import React, { useState } from 'react'

import { CopyToClipboard } from "react-copy-to-clipboard";
import { LinkedinShareButton, TwitterShareButton, RedditShareButton, FacebookShareButton, PinterestShareButton, FacebookMessengerIcon, InstapaperShareButton, InstapaperIcon, WhatsappShareButton, WhatsappIcon } from "react-share";
import { RedditIcon,FacebookIcon,LinkedinIcon,TwitterIcon,EmailIcon,PinterestIcon } from "react-share";

const Share = ({ title, id, imageUrl,setShowShareModal }) => {

    const [isCopied, setIsCopied] = useState(false);
    const sharingURL = `https://imagedash.vercel.app/pindetails/${id}`;
    const iconClass = `rounded-full h-12 w-12 md:h-16 md:w-16 hover:scale-125`;
  return (
      <>

          
<input type="checkbox" id="my-modal" className="modal-toggle"/>
<div className="modal">
  <div className="modal-box">
    
                  <div className="flex items-center">
<h3 className="font-bold text-xl flex-1">Share</h3>

                          <label htmlFor="my-modal"
                              className="btn"
                          onClick={()=>setShowShareModal(false)}><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
</svg></label>
                 
                  </div>
                  <div className="flex justify-around gap-2 py-2">
<RedditShareButton
title={title}
url={sharingURL}>
    <RedditIcon className={iconClass}/>
</RedditShareButton>
  <LinkedinShareButton
    title={title}
    source="ImageDash"
    url={sharingURL}>
    <LinkedinIcon className={iconClass}/>
</LinkedinShareButton>
<FacebookShareButton url={sharingURL}>
  <FacebookIcon className={iconClass}/>
  </FacebookShareButton>
  <PinterestShareButton 
    media={imageUrl}
    description={title}
    url={sharingURL}>
    <PinterestIcon className={iconClass}/>
  </PinterestShareButton>
<TwitterShareButton
                          title={title}
                          url={sharingURL}>
    <TwitterIcon className={iconClass}/>
                      </TwitterShareButton>
                      <WhatsappShareButton
                          url={sharingURL}
                          title={title}
                      >
                          <WhatsappIcon className={iconClass}/>
                      </WhatsappShareButton>
                  </div>
                  <div className='divider'>OR</div>
                  <div>
                      <h1>Copy the URL</h1>
                      <div className='flex items-center gap-2 mt-2'>
                          <div className='overflow-x-hidden border-2 border-dashed p-2'>{sharingURL}</div>
                          
                          {isCopied ?
                              <button className='btn btn-success'>Copied</button>
                              :
                              <CopyToClipboard text={sharingURL} onCopy={() => setIsCopied(true)}>
                              <button className='btn btn-info'>Copy</button>
                              </CopyToClipboard> }
                      </div>
                  </div>
  </div>
</div>
    </>
  )
}

export default Share;

{/*  

 <div className="modal-box">



</div> */}