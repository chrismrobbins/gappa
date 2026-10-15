import { PASSWORD_MIN } from '../src/config'
import { usernameToEmail } from '../src/lib/username'
import { adminClient, runScript } from './_admin'

runScript(async () => {
  const [username, password] = process.argv.slice(2)
  if (!username || !password) throw new Error('Usage: npm run reset-password -- <username> <newPassword>')
  if (password.length < PASSWORD_MIN) throw new Error(`Passwords need at least ${PASSWORD_MIN} characters.`)
  const admin = adminClient()
  const { data: profile } = await admin
    .from('profiles')
    .select('id')
    .eq('username', username.toLowerCase())
    .maybeSingle()
  if (!profile) throw new Error(`No account found for "${username}" (${usernameToEmail(username)}).`)
  const { error } = await admin.auth.admin.updateUserById(profile.id, { password })
  if (error) throw new Error('Could not change the password.')
  console.log(`Password updated for ${username}.`)
})
