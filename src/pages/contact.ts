import '../style.css'
import { setupContactHub } from '../contact-hub'
import {
  setupContactForm,
  setupFooter,
  setupSiteMenu,
  setupResumeLink,
  setupScrollEffects,
} from '../effects'
import { mountPage } from '../layout'
import { contactSection } from '../sections'

mountPage('contact', contactSection({ includeArcadeHub: true }))

setupResumeLink()
setupFooter()
setupSiteMenu()
setupContactForm()
setupContactHub()
setupScrollEffects('contact')
