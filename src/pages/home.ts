import '../style.css'
import {
  setupContactForm,
  setupFooter,
  setupSiteMenu,
  setupHeroTypewriter,
  setupResumeLink,
  setupScrollEffects,
} from '../effects'
import { initGamesPage } from '../games-ui'
import { mountPage } from '../layout'
import { aboutSection, contactSection, gamesSection, heroSection } from '../sections'

mountPage(
  'home',
  `
  ${heroSection()}
  ${gamesSection()}
  ${aboutSection()}
  ${contactSection()}
`,
)

setupHeroTypewriter()
setupResumeLink()
setupFooter()
setupSiteMenu()
setupContactForm()
setupScrollEffects('home')
void initGamesPage()
