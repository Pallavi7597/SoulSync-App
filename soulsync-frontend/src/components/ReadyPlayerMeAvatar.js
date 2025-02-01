import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

const ReadyPlayerMeAvatar = () => {
  const { scene } = useGLTF('https://models.readyplayer.me/678c00f4487bd5e753970fa9.glb');

  return (
    <Canvas>
      <ambientLight intensity={1} />
      <directionalLight position={[0, 10, 5]} />
      <primitive object={scene} scale={1} />
      <OrbitControls />
    </Canvas>
  );
};

export default ReadyPlayerMeAvatar;
