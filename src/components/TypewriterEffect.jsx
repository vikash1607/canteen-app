import { useEffect, useState } from 'react';

export default function TypewriterEffect() {
  const [text, setText] = useState('');
  const [index, setIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const phrases = ["EAT.....", "CODE.....", "SLEEP.....", "REPEAT....."];

  useEffect(() => {
    const currentPhrase = phrases[index];
    
    const type = () => {
      if (isDeleting) {
        setText(currentPhrase.substring(0, text.length - 1));
        if (text === '') {
          setIsDeleting(false);
          setIndex((index + 1) % phrases.length);
        }
      } else {
        setText(currentPhrase.substring(0, text.length + 1));
        if (text === currentPhrase) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      }
    };

    const timer = setTimeout(type, isDeleting ? 100 : 200);
    return () => clearTimeout(timer);
  }, [text, index, isDeleting]);

  return (
    <div className="typewriter">
      <span>{text}</span>
      <span className="cursor">|</span>
    </div>
  );
}