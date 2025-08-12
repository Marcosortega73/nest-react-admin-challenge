import React from 'react';
import { Book, FileText, Link, Play } from 'react-feather';

export type LessonType = 'VIDEO' | 'PDF' | 'TEXT' | 'LINK';

// Función para obtener el ícono según el tipo de lección
export const getLessonIcon = (type: LessonType, size: number = 16, className?: string) => {
  switch (type) {
    case 'VIDEO':
      return <Play className="w-4 h-4 text-blue-500" />;
    case 'PDF':
      return <FileText className="w-4 h-4 text-red-500" />;
    case 'LINK':
      return <Link className="w-4 h-4 text-green-500" />;
    case 'TEXT':
    default:
      return <Book className="w-4 h-4 text-gray-500" />;
  }
};

// Detectar tipo por contenido si no se especifica
const detectLessonType = (type?: string, content?: string): LessonType => {
  if (!type && content) {
    if (content.includes('.pdf')) return 'PDF';
    if (content.includes('http') || content.includes('www')) return 'LINK';
    if (content.includes('.mp4') || content.includes('youtube') || content.includes('vimeo')) return 'VIDEO';
  }

  return (type as LessonType) || 'TEXT';
};

export const getLessonTypeFromContent = (content?: string): LessonType => {
  if (!content) return 'TEXT';

  // Detectar por extensión o URL
  if (content.includes('.pdf')) return 'PDF';
  if (content.includes('http') || content.includes('www')) return 'LINK';
  if (content.includes('.mp4') || content.includes('youtube') || content.includes('vimeo')) return 'VIDEO';

  return 'TEXT';
};

// Función para abrir contenido de lección
export const openLessonContent = (content?: string, title?: string) => {
  if (!content) return;

  const detectedType = detectLessonType('', content);

  if (detectedType === 'LINK' || detectedType === 'PDF') {
    window.open(content, '_blank');
  } else {
    console.warn(`Opening ${detectedType} lesson: ${title}`, content);
  }
};
