import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { DEFAULT_SETTINGS } from '@/lib/cms'

type ContactFormProps = {
  apiUrl?: string
}

export default function ContactForm({ apiUrl }: ContactFormProps) {
  const { toast } = useToast()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const endpoint = useMemo(() => {
    const base = (apiUrl || DEFAULT_SETTINGS.apiUrl || '').replace(/\/$/, '')
    if (!base) return null
    return `${base}/contact/messages`
  }, [apiUrl])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!endpoint) {
      toast({ title: 'Email disabled', description: 'Contact endpoint is not configured.', variant: 'destructive' })
      return
    }

    setIsSubmitting(true)
    setStatus('idle')

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          subject: `Website contact from ${name || 'Someone'}`,
          message,
        }),
      })

      if (!response.ok) {
        const text = await response.text()
        throw new Error(text || `Request failed with status ${response.status}`)
      }

      toast({ title: 'Message sent', description: 'Thanks for reaching out! I will reply as soon as possible.' })
      setStatus('success')
      setName('')
      setEmail('')
      setMessage('')
    } catch (error) {
      console.error('Failed to submit contact form', error)
      toast({
        title: 'Failed to send message',
        description: error instanceof Error ? error.message : 'Please try again later.',
        variant: 'destructive',
      })
      setStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          placeholder="Your name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Tell me a bit about your project..."
          rows={5}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          required
        />
      </div>

      <div className="pt-2">
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="inline-block">
          <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
            {isSubmitting ? 'Sending…' : 'Send message'}
          </Button>
        </motion.div>
        {status === 'success' ? (
          <p className="mt-3 text-sm text-emerald-400">Thanks! Your message has been delivered.</p>
        ) : null}
        {status === 'error' ? (
          <p className="mt-3 text-sm text-red-400">Something went wrong. Please try again in a moment.</p>
        ) : null}
      </div>
    </form>
  )
}
