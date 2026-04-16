import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  const { code, error: naverError } = req.query

  const appUrl = process.env.APP_URL || `https://${process.env.VERCEL_URL}` || 'http://localhost:5173'

  if (naverError || !code) {
    return res.redirect(`${appUrl}?error=naver_denied`)
  }

  try {
    const clientId = process.env.VITE_NAVER_CLIENT_ID
    const clientSecret = process.env.NAVER_CLIENT_SECRET

    // Exchange code for access token
    const tokenRes = await fetch(
      `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${clientId}&client_secret=${clientSecret}&code=${code}`,
      { method: 'GET' }
    )
    const tokenData = await tokenRes.json()

    if (!tokenData.access_token) {
      console.error('[Naver] Token exchange failed:', tokenData)
      return res.redirect(`${appUrl}?error=naver_token_failed`)
    }

    // Get user profile from Naver
    const profileRes = await fetch('https://openapi.naver.com/v1/nid/me', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    })
    const profileData = await profileRes.json()

    const email = profileData.response?.email
    const name = profileData.response?.name || profileData.response?.nickname || '네이버 사용자'

    if (!email) {
      console.error('[Naver] No email in profile:', profileData)
      return res.redirect(`${appUrl}?error=naver_no_email`)
    }

    const supabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    // Create user if not exists (ignore "already exists" error)
    await supabase.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: { full_name: name, avatar_url: profileData.response?.profile_image, provider: 'naver' },
    })

    // Generate a magic sign-in link (works for existing users too)
    const { data: linkData, error: linkErr } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email,
      options: { redirectTo: appUrl },
    })

    if (linkErr || !linkData?.properties?.action_link) {
      console.error('[Naver] generateLink failed:', linkErr)
      return res.redirect(`${appUrl}?error=naver_link_failed`)
    }

    // Transparent redirect: Supabase signs user in, then redirects to appUrl
    return res.redirect(linkData.properties.action_link)
  } catch (err) {
    console.error('[Naver] Callback error:', err)
    return res.redirect(`${appUrl}?error=naver_server_error`)
  }
}
