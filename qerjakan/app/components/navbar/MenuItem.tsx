'use client';

interface MenuItemProps {
  onClick: () => void;
  label: string;
}

const MenuItem: React.FC<MenuItemProps> = ({
  onClick,
  label
}) => {
  return ( 
    <div 
      onClick={onClick} 
      className="
        flex
         justify-start
         text-xs font-normal
        py-3 
        px-4
        hover:bg-neutral-100 
        transition
        
        rounded-box
      "
    >
      {label}
    </div>
   );
}
 
export default MenuItem;