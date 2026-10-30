import '../style.css'
import { setupFooter, setupResumeLink, setupScrollEffects, setupSiteMenu } from '../effects'
import { mountPage } from '../layout'
import { aboutSection } from '../sections'

mountPage('about', aboutSection())

setupResumeLink()
setupFooter()
setupSiteMenu()
setupScrollEffects('about')
