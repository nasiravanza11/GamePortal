import '../style.css'
import {
  setupContactForm,
  setupFooter,
  setupSiteMenu,
  setupResumeLink,
  setupScrollEffects,
} from '../effects'
import { mountPage } from '../layout'
import { contactSection } from '../sections'

mountPage('contact', contactSection())

setupResumeLink()
setupFooter()
setupSiteMenu()
setupContactForm()
setupScrollEffects('contact')
