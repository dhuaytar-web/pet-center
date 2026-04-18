type NotifyResult = {
  ok: boolean
  reason?: string
}

function normalizePhone(raw: string) {
  const digits = raw.replace(/\D/g, '')
  if (!digits) return ''
  return digits.startsWith('51') ? `+${digits}` : `+51${digits}`
}

async function sendWhatsAppViaTwilio(to: string, body: string): Promise<NotifyResult> {
  const sid = process.env.TWILIO_ACCOUNT_SID
  const token = process.env.TWILIO_AUTH_TOKEN
  const from = process.env.TWILIO_WHATSAPP_FROM

  if (!sid || !token || !from) {
    return { ok: false, reason: 'twilio-env-missing' }
  }

  const target = normalizePhone(to)
  if (!target) return { ok: false, reason: 'invalid-phone' }

  const endpoint = `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`
  const auth = Buffer.from(`${sid}:${token}`).toString('base64')

  const params = new URLSearchParams()
  params.set('To', `whatsapp:${target}`)
  params.set('From', from)
  params.set('Body', body)

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  })

  if (!response.ok) {
    const text = await response.text()
    return { ok: false, reason: `twilio-failed:${text.slice(0, 120)}` }
  }

  return { ok: true }
}

async function sendEmailViaSendgrid(to: string, subject: string, text: string): Promise<NotifyResult> {
  const apiKey = process.env.SENDGRID_API_KEY
  const from = process.env.NEXT_PUBLIC_OWNER_EMAIL

  if (!apiKey || !from) {
    return { ok: false, reason: 'sendgrid-env-missing' }
  }

  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: to }] }],
      from: { email: from },
      subject,
      content: [{ type: 'text/plain', value: text }],
    }),
  })

  if (!response.ok) {
    const bodyText = await response.text()
    return { ok: false, reason: `sendgrid-failed:${bodyText.slice(0, 120)}` }
  }

  return { ok: true }
}

export async function notifyOwnerNewOrder(payload: {
  numeroPedido: string
  cliente: string
  telefono: string
  total: number
  metodoPago: string
  itemsText: string
}) {
  const ownerPhone = process.env.NEXT_PUBLIC_OWNER_PHONE_DISPLAY ?? process.env.NEXT_PUBLIC_STORE_PHONE
  const ownerEmail = process.env.NEXT_PUBLIC_OWNER_EMAIL

  const message = [
    `Nuevo pedido ${payload.numeroPedido}`,
    `Cliente: ${payload.cliente}`,
    `Telefono: ${payload.telefono}`,
    `Total: S/ ${payload.total.toFixed(2)}`,
    `Pago: ${payload.metodoPago}`,
    `Items: ${payload.itemsText}`,
  ].join('\n')

  const waResult = ownerPhone ? await sendWhatsAppViaTwilio(ownerPhone, message) : { ok: false, reason: 'owner-phone-missing' }

  if (waResult.ok) return waResult

  if (ownerEmail) {
    await sendEmailViaSendgrid(ownerEmail, `Nuevo pedido ${payload.numeroPedido}`, message)
  }

  return waResult
}

export async function notifyCustomerOrderStatus(payload: {
  telefono: string
  numeroPedido: string
  estado: string
}) {
  const message = `Tu pedido ${payload.numeroPedido} ahora esta: ${payload.estado}. PET CENTER te contactara para coordinar el recojo.`

  const waResult = await sendWhatsAppViaTwilio(payload.telefono, message)
  if (waResult.ok) return waResult

  return waResult
}
