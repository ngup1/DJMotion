import React from 'react';

type Props = {
  onGestureDetected: (gesture: string) => void;
};

const WebcamFeed: React.FC<Props> = ({ onGestureDetected }) => {
  return <div className="bg-gray-800 p-4">Webcam goes here</div>;
};

export default WebcamFeed;