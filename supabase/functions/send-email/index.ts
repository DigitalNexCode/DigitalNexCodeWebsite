import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { corsHeaders } from '../cors.ts'
import { Resend } from 'https://esm.sh/resend@3.2.0'

const ADMIN_EMAIL = 'osetshedi1900@gmail.com'

// --- Email Templates ---
const adminNotificationTemplate = (type: string, data: any) => {
    if (type === 'contact') {
        return {
            subject: `New Contact Form Message from ${data.name}`,
            body: `
                <h2>New Contact Message</h2>
                <p><strong>Name:</strong> ${data.name}</p>
                <p><strong>Email:</strong> ${data.email}</p>
                <p><strong>Subject:</strong> ${data.subject}</p>
                <hr>
                <p><strong>Message:</strong></p>
                <p>${data.message}</p>
            `
        }
    }
    if (type === 'consultation') {
        return {
            subject: `New Consultation Booking from ${data.name}`,
            body: `
                <h2>New Consultation Booking</h2>
                <p><strong>Name:</strong> ${data.name}</p>
                <p><strong>Email:</strong> ${data.email}</p>
                <p><strong>Phone:</strong> ${data.phone || 'N/A'}</p>
                <hr>
                <h3>Consultation Details</h3>
                <p><strong>Type:</strong> ${data.consultationType}</p>
                <p><strong>Preferred Date:</strong> ${data.preferredDate || 'N/A'}</p>
                <p><strong>Preferred Time:</strong> ${data.preferredTime || 'N/A'}</p>
                <hr>
                <h3>Project Overview</h3>
                <p>${data.projectDescription}</p>
            `
        }
    }
    return { subject: 'New Form Submission', body: '<p>A new form was submitted.</p>' }
}

const clientConfirmationTemplate = (type: string, data: any) => {
    const subject = type === 'contact' 
        ? 'Thank you for contacting DigitalNexCode!'
        : 'Your consultation request has been received!'

    const body = `
        <div style="font-family: sans-serif; line-height: 1.6;">
            <h2>Hello ${data.name},</h2>
            <p>Thank you for reaching out to DigitalNexCode. We have successfully received your message and will get back to you as soon as possible.</p>
            <p>If your query is urgent, please feel free to call us at <strong>078 056 2868</strong>.</p>
            <br>
            <p>Best regards,</p>
            <p><strong>The DigitalNexCode Team</strong></p>
            <hr>
            <p style="font-size: 0.8em; color: #666;">This is an automated message. Please do not reply directly to this email.</p>
        </div>
    `
    return { subject, body }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Check for Resend API Key first to prevent timeouts
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    if (!RESEND_API_KEY) {
      throw new Error('Server configuration error: RESEND_API_KEY is not set.')
    }
    
    const resend = new Resend(RESEND_API_KEY)
    const { type, ...formData } = await req.json()

    // 1. Prepare emails
    const adminEmail = adminNotificationTemplate(type, formData)
    const clientEmail = clientConfirmationTemplate(type, formData)
    
    // Using Resend's default "from" address for better deliverability on free plans.
    // Replace with your own verified domain (e.g., 'info@digitalnexcode.co.za') once configured in Resend.
    const fromAddress = 'DigitalNexCode <onboarding@resend.dev>'

    // 2. Send both emails concurrently
    const [adminResult, clientResult] = await Promise.allSettled([
        resend.emails.send({
            from: fromAddress,
            to: [ADMIN_EMAIL],
            subject: adminEmail.subject,
            html: adminEmail.body,
            reply_to: formData.email,
        }),
        resend.emails.send({
            from: fromAddress,
            to: [formData.email],
            subject: clientEmail.subject,
            html: clientEmail.body,
        })
    ])

    if (adminResult.status === 'rejected') {
        console.error('Failed to send admin email:', adminResult.reason)
        throw new Error(`Failed to send notification to administrator. Reason: ${adminResult.reason.message}`)
    }
     if (clientResult.status === 'rejected') {
        console.error('Failed to send client confirmation:', clientResult.reason)
        // Log this error, but don't fail the request for it.
    }


    return new Response(JSON.stringify({ message: 'Message sent successfully!' }), {
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
