import { randomInt } from 'node:crypto'
import { adminClient, runScript } from './_admin'

// No 0/O/1/I so codes survive being read aloud or typed from a text message.
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

/** 8 characters from 32 is ~10^12 codes: not guessable through the signup endpoint. */
function makeCode(): string {
  const tail = Array.from({ length: 8 }, () => ALPHABET[randomInt(ALPHABET.length)]).join('')
  return `GAPPA-${tail}`
}

runScript(async () => {
  const [usesArg, ...noteParts] = process.argv.slice(2)
  const uses = usesArg ? Number(usesArg) : 1
  if (!Number.isInteger(uses) || uses < 1) throw new Error('Usage: npm run invite -- [uses] [note]')
  const code = makeCode()
  const { error } = await adminClient()
    .from('invite_codes')
    .insert({ code, uses_left: uses, note: noteParts.join(' ') || null })
  if (error) throw new Error('Could not save the invite code. Is the database set up?')
  console.log(code)
})
