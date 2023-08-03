'use client';

import Image from "next/image";

interface AvatarProps {
    src:string | null | undefined
};

const Avatar: React.FC<AvatarProps> = ({
    src
}) => {
    return (
        <Image
        alt="Avatar" 
        width="120"
        height="120"
        src={src || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"} />
    )
}

export default Avatar;