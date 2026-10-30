import { contactInfo, linkedInProfileUrl } from './site-config'

function envUrl(...keys: (keyof ImportMetaEnv)[]): string {
  for (const key of keys) {
    const value = import.meta.env[key]?.trim()
    if (value) return value
  }
  return ''
}

function telDigits(href: string): string {
  return href.replace(/^tel:/i, '').replace(/\D/g, '')
}

export const whatsappUrl =
  envUrl('VITE_WHATSAPP_URL', 'NEXT_PUBLIC_WHATSAPP_URL') ||
  (telDigits(contactInfo.phoneHref) ? `https://wa.me/${telDigits(contactInfo.phoneHref)}` : '')

export const linkedinUrl =
  envUrl('VITE_LINKEDIN_URL', 'NEXT_PUBLIC_LINKEDIN_URL') || linkedInProfileUrl
export const upworkUrl = envUrl('VITE_UPWORK_URL', 'NEXT_PUBLIC_UPWORK_URL')

const ICONS = {
  discord: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.3 4.4A17.2 17.2 0 0 0 15.5 3c-.2.4-.5 1-.7 1.4a15.8 15.8 0 0 0-6.8 0C7.8 4 7.5 3.4 7.3 3a17.2 17.2 0 0 0-4.8 1.4C.6 8.6-.1 12.6 0 16.6c2 1.5 4 2.4 5.9 3a12.2 12.2 0 0 0 1.1-1.8 7.9 7.9 0 0 1-1.7-.8l.4-.3c3.2 1.5 6.7 1.5 9.8 0l.4.3c-.5.3-1.1.6-1.7.8.3.7.7 1.3 1.1 1.8 1.9-.6 3.9-1.5 5.9-3 .2-4.6-.8-8.5-3.1-12.2ZM8.7 14.2c-1.1 0-2-.9-2-2.1s.9-2.1 2-2.1 2 1 2 2.1-.9 2.1-2 2.1Zm6.6 0c-1.1 0-2-.9-2-2.1s.9-2.1 2-2.1 2 1 2 2.1-.9 2.1-2 2.1Z"/></svg>`,
  x: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.9 2H22l-6.8 7.8L23 22h-6.7l-5.2-6.8L5.2 22H2l7.3-8.4L1 2h6.9l4.7 6.2L18.9 2Zm-1.2 18h1.8L7.1 3.9H5.2L17.7 20Z"/></svg>`,
  instagram: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Zm0 2a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H7Zm5 3.5A5.5 5.5 0 1 1 6.5 14 5.5 5.5 0 0 1 12 8.5Zm0 2A3.5 3.5 0 1 0 15.5 14 3.5 3.5 0 0 0 12 10.5ZM17.8 6.6a1 1 0 1 1-1 1 1 1 0 0 1 1-1Z"/></svg>`,
  youtube: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18 5 12 5 12 5s-6 0-7.8.4a2.5 2.5 0 0 0-1.8 1.8C2 9 2 12 2 12s0 3 .4 4.8a2.5 2.5 0 0 0 1.8 1.8C6 19 12 19 12 19s6 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8c.4-1.8.4-4.8.4-4.8s0-3-.4-4.8ZM10 15.5v-7l6 3.5-6 3.5Z"/></svg>`,
  whatsapp: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`,
  linkedin: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 114.126 0 2.063 2.063 0 01-2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`,
  upwork: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.561 13.158c-1.098 0-1.914.448-2.385 1.037l-1.344-1.008c.728-.966 1.858-1.587 3.12-1.587 2.214 0 4.008 1.794 4.008 4.008 0 .672-.166 1.305-.458 1.863l-1.312-.984c.154-.366.242-.769.242-1.188 0-1.324-1.074-2.398-2.398-2.398zM9.018 9.386H6.092v9.228h2.926V9.386zm-1.463-3.018a1.692 1.692 0 100 3.384 1.692 1.692 0 000-3.384zM15.284 9.15c-1.262 0-2.392.621-3.12 1.587l1.344 1.008c.471-.589 1.287-1.037 2.385-1.037 1.324 0 2.398 1.074 2.398 2.398 0 .419-.088.822-.242 1.188l1.312.984c.292-.558.458-1.191.458-1.863 0-2.214-1.794-4.008-4.008-4.008z"/></svg>`,
} as const

type SocialEntry = {
  label: string
  url: string
  icon: keyof typeof ICONS
}

function socialEntries(): SocialEntry[] {
  return [
    { label: 'WhatsApp', url: whatsappUrl, icon: 'whatsapp' },
    { label: 'LinkedIn', url: linkedinUrl, icon: 'linkedin' },
    { label: 'Upwork', url: upworkUrl, icon: 'upwork' },
    { label: 'Discord', url: '', icon: 'discord' },
    { label: 'X', url: '', icon: 'x' },
    { label: 'Instagram', url: '', icon: 'instagram' },
    { label: 'YouTube', url: '', icon: 'youtube' },
  ]
}

function linkAttrs(entry: SocialEntry): string {
  if (entry.url) {
    return `href="${entry.url}" target="_blank" rel="noopener noreferrer"`
  }
  const soon = entry.label === 'Discord' || entry.label === 'X' || entry.label === 'Instagram' || entry.label === 'YouTube'
  return soon ? 'href="#" aria-disabled="true"' : 'href="#" aria-disabled="true"'
}

function ariaLabel(entry: SocialEntry): string {
  if (entry.url) return entry.label
  if (entry.icon === 'whatsapp' || entry.icon === 'linkedin' || entry.icon === 'upwork') {
    return `${entry.label} (add URL in .env)`
  }
  return `${entry.label} (coming soon)`
}

export function renderSocialLinks(listClass: string): string {
  const items = socialEntries()
    .map(
      (entry) =>
        `<li><a ${linkAttrs(entry)} aria-label="${ariaLabel(entry)}">${ICONS[entry.icon]}</a></li>`,
    )
    .join('\n            ')

  return `<ul class="${listClass}" aria-label="Social links">
            ${items}
          </ul>`
}
