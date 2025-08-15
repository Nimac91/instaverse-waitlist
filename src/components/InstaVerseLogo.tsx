
import type { FC } from 'react';

interface InstaVerseLogoProps {
  className?: string;
}

export const InstaVerseLogo: FC<InstaVerseLogoProps> = ({ className }) => {
  return (
    <a href="/" aria-label="InstaVerse Home" className={`inline-block ${className}`}>
      <img
        src="https://i.imgur.com/ea9m8az.png"
        alt="InstaVerse Logo"
        className="h-12 w-auto"
      />
    </a>
  );
};
