
import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useState } from 'react';

export default function CameraShift() {

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {

    const handleMouseMove = (event) => {
      setMousePosition({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };

  }, []);


  const { camera } = useThree();

  useFrame(() => {

    camera.position.z += (mousePosition.x - camera.position.z * 20) * 0.01;
    camera.position.y += (mousePosition.y - camera.position.y * 20) * 0.01;

  });

  return null;
}

