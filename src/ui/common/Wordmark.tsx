/** The गप्पा logotype: large on sign-in, medium in the sidebar, native script only in the top bar. */
export function Wordmark({ size = 'lg' }: { size?: 'lg' | 'md' | 'sm' }) {
  return (
    <div className={`wordmark wordmark-${size}`}>
      <span className="wordmark-native" lang="mr">गप्पा</span>
      <span className="wordmark-latin">Gappa</span>
    </div>
  )
}
