import React from 'react';

const EmptyUrls = () => {
  return (
    <div className="recent-urls-empty text-center">
      <h4>No URLs shortened yet!</h4> 
      <img src="/images/empty-results.png" />
    </div>
  )
}

export default EmptyUrls;