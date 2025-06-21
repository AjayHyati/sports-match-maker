import type { LucideIcon } from 'lucide-react';
import { Dribbble, Goal, CircleDot } from 'lucide-react';
import type { Sport } from '@/lib/types';

export const SportIcons: Record<Sport, LucideIcon> = {
  Basketball: Dribbble,
  Soccer: Goal,
  Tennis: CircleDot,
};
