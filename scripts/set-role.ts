import { adminClient, runScript } from './_admin'

const ROLES = ['learner', 'teacher', 'admin']

runScript(async () => {
  const [username, role] = process.argv.slice(2)
  if (!username || !ROLES.includes(role)) throw new Error('Usage: npm run set-role -- <username> <learner|teacher|admin>')
  const { data, error } = await adminClient()
    .from('profiles').update({ role }).eq('username', username.trim().toLowerCase()).select('username')
  if (error) throw new Error('Could not change the role. Has supabase/migrations/0002_teachers.sql been applied?')
  if (!data?.length) throw new Error(`No user called "${username}".`)
  console.log(`${data[0].username} is now ${role}.`)
})
