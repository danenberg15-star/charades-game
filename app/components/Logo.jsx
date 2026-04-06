import React from 'react';
import Image from 'next/image';

const Logo = () => {
  return (
    <div className="flex items-center justify-center w-full">
      <Image 
        src="/logo.webp" 
        alt=" SAME SAME: The Red Carpet Version" 
        width={400} 
        height={150} 
        style={{ width: 'auto', height: '128px' }} 
        className="object-contain" 
        priority // גורם ללוגו להיטען מיד עם פתיחת הדף
        quality={100} // שומר על האיכות המקסימלית של הקובץ המכווץ
      />
    </div>
  );
};

export default Logo;