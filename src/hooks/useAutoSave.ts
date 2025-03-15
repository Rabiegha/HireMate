import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { supabase } from '../lib/supabase';
import type { RootState } from '../store';

export function useAutoSave(resumeId: string | undefined) {
  const resumeData = useSelector((state: RootState) => state.resume);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!resumeId) return;

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for auto-save
    timeoutRef.current = setTimeout(async () => {
      try {
        const { error } = await supabase
          .from('resumes')
          .update({
            content: resumeData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', resumeId);

        if (error) throw error;
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    }, 2000); // Auto-save after 2 seconds of no changes

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [resumeId, resumeData]);
}