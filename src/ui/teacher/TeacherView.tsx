import { OpenFixesScreen } from './OpenFixesScreen'
import { ReviewContentScreen } from './ReviewContentScreen'
import type { TeacherScreen } from './screens'
import { TeachersScreen } from './TeachersScreen'

export function TeacherView({ screen, onBack }: { screen: TeacherScreen; onBack(): void }) {
  if (screen === 'teachers') return <TeachersScreen onBack={onBack} />
  if (screen === 'fixes') return <OpenFixesScreen onBack={onBack} />
  return <ReviewContentScreen onBack={onBack} />
}
