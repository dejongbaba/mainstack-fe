import { useState, useEffect } from 'react';
import box from '@/assets/box.png';
import mouse from '@/assets/mouse.png';
import folder from '@/assets/folder.png';
import square from '@/assets/square.png';
import { cn } from '@/lib/utils';
export const Sidebar = () => {
  const [_, setIsMobile] = useState(false);

  // Handle window resize to determine if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024); // 1024px is typically tablet/small laptop
    };

    // Check on initial load
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Define sidebar items
  const sidebarItems = [
    { icon: mouse, alt: 'mouse' },
    { icon: box, alt: 'box' },
    { icon: folder, alt: 'folder' },
    { icon: square, alt: 'square' },
  ];

  return (
    <div
      className={cn(
        'fixed bg-white shadow-lg hover:shadow-2xl flex items-center z-10',
        // Mobile styles (bottom of screen, horizontal)
        ' w-full max-sm:bottom-0 max-sm:left-0 sm:py-3 sm:px-4 justify-around rounded-t-xl',
        // Desktop styles (side of screen, vertical)
        'lg:w-16 lg:translate-y-1/2 lg:mx-4 lg:rounded-full lg:flex-col lg:py-12 lg:items-center flex'
      )}
    >
      <div className={cn('flex items-center', 'lg:flex-col lg:space-y-6', 'w-full justify-around')}>
        {sidebarItems.map((item, index) => (
          <button
            key={index}
            className={cn(
              'grayscale hover:grayscale-0 rounded-lg flex items-center justify-center transition-colors',
              'w-10 h-10'
            )}
          >
            <img src={item.icon} alt={item.alt} />
          </button>
        ))}
      </div>
    </div>
  );
};
