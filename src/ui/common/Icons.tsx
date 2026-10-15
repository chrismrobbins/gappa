import type { ReactNode } from 'react'

interface IconProps { size?: number; className?: string }

function Svg({ size = 24, className, children }: IconProps & { children: ReactNode }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  )
}

export const FlameIcon = (p: IconProps) => (
  <Svg {...p}><path d="M12 3c1 4 5 5.5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 .3 1.2 1 2 2 2 0-3-1-5 1-8z" fill="currentColor" /></Svg>
)
export const CheckIcon = (p: IconProps) => <Svg {...p}><path d="M5 12.5l4.5 4.5L19 7.5" strokeWidth={3} /></Svg>
export const LockIcon = (p: IconProps) => (
  <Svg {...p}><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></Svg>
)
export const CloseIcon = (p: IconProps) => <Svg {...p}><path d="M6 6l12 12M18 6L6 18" /></Svg>
export const BookIcon = (p: IconProps) => (
  <Svg {...p}><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z" /><path d="M4 19V5" /></Svg>
)
export const CycleIcon = (p: IconProps) => (
  <Svg {...p}><path d="M20 11a8 8 0 0 0-14-4M4 13a8 8 0 0 0 14 4" /><path d="M6 3v4h4M18 21v-4h-4" /></Svg>
)
export const UserIcon = (p: IconProps) => (
  <Svg {...p}><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></Svg>
)
export const SpeakerIcon = (p: IconProps) => (
  <Svg {...p}><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor" /><path d="M16.5 8.5a5 5 0 0 1 0 7" /></Svg>
)
export const TurtleIcon = (p: IconProps) => (
  <Svg {...p}><path d="M4 15a8 7 0 0 1 16 0z" fill="currentColor" /><path d="M20 13l2-1M6 18v2M16 18v2" /></Svg>
)
export const MicIcon = (p: IconProps) => (
  <Svg {...p}><rect x="9" y="3" width="6" height="11" rx="3" fill="currentColor" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></Svg>
)
export const SnowflakeIcon = (p: IconProps) => (
  <Svg {...p}><path d="M12 2v20M3.3 7l17.4 10M3.3 17L20.7 7" /></Svg>
)
export const StarIcon = (p: IconProps) => (
  <Svg {...p}><path d="M12 3l2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 16.8 6.6 19.7l1.1-6.1L3.2 9.4l6.1-.8z" fill="currentColor" /></Svg>
)
