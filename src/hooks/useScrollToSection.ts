import { useEffect } from 'react';

export function useScrollToSection(sectionId: string, dependencies: any[] = []) {
  useEffect(() => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, dependencies);
}