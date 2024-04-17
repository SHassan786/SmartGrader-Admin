import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'overview', title: 'Overview', href: paths.dashboard.overview, icon: 'chart-pie' },
  { key: 'course', title: 'Course', href: paths.dashboard.course, icon: 'users' },
  // { key: 'question', title: 'Question', href: paths.dashboard.question, icon: 'users' },
  { key: 'quiz', title: 'Quiz', href: paths.dashboard.quiz, icon: 'users' },
  // { key: 'settings', title: 'Settings', href: paths.dashboard.settings, icon: 'gear-six' },
  // { key: 'account', title: 'Account', href: paths.dashboard.account, icon: 'user' },
  // { key: 'error', title: 'Error', href: paths.errors.notFound, icon: 'x-square' },
] satisfies NavItemConfig[];
