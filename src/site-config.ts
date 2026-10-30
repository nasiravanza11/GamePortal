export const heroSubtext =
  'Credits loaded. No install. No wait. Hit play and chase the high score.'

export const contactInfo = {
  phone: '+92 300 000 0000',
  phoneHref: 'tel:+923000000000',
  email: 'hello@raoarcade.com',
  emailHref: 'mailto:hello@raoarcade.com',
  address: 'Karachi, Pakistan',
}

/** Default profile; override with VITE_LINKEDIN_URL in .env if needed. */
export const linkedInProfileUrl = 'https://www.linkedin.com/in/nasir-jamil-b62a19102/'

const resumeModules = import.meta.glob<string>('../Resume/*.pdf', {
  eager: true,
  query: '?url',
  import: 'default',
})

const resumeGlobPath = Object.keys(resumeModules).find((path) =>
  path.toLowerCase().endsWith('.pdf'),
)

export const resumePdfUrl = resumeGlobPath ? resumeModules[resumeGlobPath] : ''
export const resumeFileName = resumeGlobPath?.split('/').pop() ?? 'resume.pdf'

export const portfolioUrl = (
  import.meta.env.VITE_PORTFOLIO_URL ?? import.meta.env.NEXT_PUBLIC_PORTFOLIO_URL ?? ''
).trim()

export const portfolioLinkAttrs = portfolioUrl
  ? `href="${portfolioUrl}" target="_blank" rel="noopener noreferrer"`
  : 'href="#" aria-disabled="true"'

export const arrowIcon = `
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6"/>
  </svg>
`
