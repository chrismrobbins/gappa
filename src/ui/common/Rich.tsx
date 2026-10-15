import { parseRich } from './parseRich'

export function Rich({ text }: { text: string }) {
  return (
    <>
      {parseRich(text).map((part, i) =>
        part.bold ? <strong key={i} className="native-inline" lang="mr">{part.text}</strong> : <span key={i}>{part.text}</span>,
      )}
    </>
  )
}
