import '../style.css'
import {
  setupFooter,
  setupSiteMenu,
  setupGamesToolbarGlass,
  setupResumeLink,
  setupScrollEffects,
} from '../effects'
import { initGamesPage } from '../games-ui'
import { mountPage } from '../layout'
import { gamesSection } from '../sections'

mountPage('games', gamesSection({ showFloorIndex: false, showLibraryTools: true }))

document.body.classList.add('is-games-page')

setupResumeLink()
setupFooter()
setupSiteMenu()
setupGamesToolbarGlass()
void initGamesPage().then(() => setupScrollEffects('games'))
