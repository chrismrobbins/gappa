import { useState, type FormEvent } from 'react'
import { signInError, signUpError, type Credentials } from '../../lib/username'
import { signIn, signUp } from '../../services/auth'
import { Wordmark } from '../common/Wordmark'

type Tab = 'in' | 'join'

/** Sends the form; on success the auth listener swaps this screen out, so only failure resets `busy`. */
function send(tab: Tab, c: Credentials): Promise<void> {
  return tab === 'in' ? signIn(c.username, c.password) : signUp(c.username, c.password, c.invite)
}

function useAuthForm(tab: Tab) {
  const [values, setValues] = useState<Credentials>({ username: '', password: '', invite: '' })
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const set = (field: keyof Credentials) => (value: string) => setValues((v) => ({ ...v, [field]: value }))

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const problem = tab === 'in' ? signInError(values) : signUpError(values)
    setError(problem)
    if (problem) return
    setBusy(true)
    await send(tab, values).catch((err: unknown) => {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setBusy(false)
    })
  }
  return { values, set, error, busy, submit }
}

function Field(props: { label: string; type?: string; value: string; autoComplete: string; onChange(v: string): void }) {
  return (
    <label className="field">
      <span>{props.label}</span>
      <input type={props.type ?? 'text'} value={props.value} autoComplete={props.autoComplete}
        autoCapitalize="none" autoCorrect="off" onChange={(e) => props.onChange(e.target.value)} />
    </label>
  )
}

export function AuthScreen() {
  const [tab, setTab] = useState<Tab>('in')
  const form = useAuthForm(tab)
  return (
    <main className="auth">
      <Wordmark />
      <div className="tabs" role="tablist">
        <button role="tab" type="button" aria-selected={tab === 'in'} onClick={() => setTab('in')}>Sign in</button>
        <button role="tab" type="button" aria-selected={tab === 'join'} onClick={() => setTab('join')}>Join with invite</button>
      </div>
      <form className="card auth-form" onSubmit={form.submit}>
        <Field label="Username" value={form.values.username} autoComplete="username" onChange={form.set('username')} />
        <Field label="Password" type="password" value={form.values.password}
          autoComplete={tab === 'in' ? 'current-password' : 'new-password'} onChange={form.set('password')} />
        {tab === 'join' && <Field label="Invite code" value={form.values.invite} autoComplete="off" onChange={form.set('invite')} />}
        <p className="form-error" role="alert">{form.error}</p>
        <button type="submit" className="btn btn-primary" disabled={form.busy}>
          {form.busy ? 'One moment…' : tab === 'in' ? 'Sign in' : 'Create my account'}
        </button>
      </form>
    </main>
  )
}
