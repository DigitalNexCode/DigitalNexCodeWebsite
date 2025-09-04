import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../cors.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, password, fullName } = await req.json()

    // 1. Validate input
    if (!email || !password || !fullName) {
      return new Response(JSON.stringify({ error: 'Missing required fields.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    // 2. Create Supabase Admin client to create user
    // This uses the project's URL and service_role key, which are available
    // automatically as environment variables in the Supabase Edge Function runtime.
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    // 3. Create the user
    const { data: { user }, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Send a confirmation email to the user
      user_metadata: {
        full_name: fullName,
      },
    })

    if (error) {
      console.error('Supabase user creation error:', error.message)
      const friendlyMessage = error.message.includes('unique constraint')
        ? 'A user with this email already exists.'
        : `Failed to create user: ${error.message}`
      return new Response(JSON.stringify({ error: friendlyMessage }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    return new Response(JSON.stringify({ message: 'Signup successful! Please check your email to verify your account.', user }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
