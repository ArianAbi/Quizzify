import { useEffect, useState } from "react";

interface ProgressiveImage {
  className: string;
  placeholderImg: string;
  img: string;
  alt?: string;
}

export default function ProgressiveImage({
  className,
  img,
  placeholderImg,
  alt,
}: ProgressiveImage) {
  const [currentImg, setCurrentImg] = useState(placeholderImg);

  useEffect(() => {
    const hqImg = new Image();
    hqImg.src = img;
    hqImg.onload = () => {
      setCurrentImg(hqImg.src);
    };
  }, []);

  return <img className={className} src={currentImg} alt={alt} />;
}
