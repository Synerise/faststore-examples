import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { useFadeEffect, useUI } from '@faststore/ui'

import { ButtonSignInFallback } from 'src/components/ui/Button'
import Link from 'src/components/ui/Link'
import Logo from 'src/components/ui/Logo'

import type { NavbarProps } from './Navbar'
import NavbarLinks from './NavbarLinks'

import styles from '../section.module.scss'

interface NavbarSliderProps {
    logo: NavbarProps['logo']
    home: NavbarProps['home']
    links: NavbarProps['links']
    region: NavbarProps['region']
    signIn: NavbarProps['signIn']
}

const ButtonSignIn = dynamic(() =>
    import(
        /* webpackChunkName: "ButtonSignIn" */ 'src/components/ui/Button'
        ).then((module) => module.ButtonSignIn)
)

const UINavbarSlider = dynamic(() =>
    import(/* webpackChunkName: "UINavbarSlider" */ '@faststore/ui').then(
        (module) => module.NavbarSlider
    )
)
const UINavbarSliderHeader = dynamic(() =>
    import(/* webpackChunkName: "UINavbarSliderHeader" */ '@faststore/ui').then(
        (module) => module.NavbarSliderHeader
    )
)
const UINavbarSliderContent = dynamic(() =>
    import(/* webpackChunkName: "UINavbarSliderContent" */ '@faststore/ui').then(
        (module) => module.NavbarSliderContent
    )
)
const UINavbarSliderFooter = dynamic(() =>
    import(/* webpackChunkName: "UINavbarSliderFooter" */ '@faststore/ui').then(
        (module) => module.NavbarSliderFooter
    )
)

function NavbarSlider({
    logo,
    links,
    region,
    home: { label: homeLabel },
    signIn: { button: signInButton },
}: NavbarSliderProps) {
    const { closeNavbar } = useUI()
    const { fade, fadeOut } = useFadeEffect()

    return (
        <UINavbarSlider
            fade={fade}
            onDismiss={fadeOut}
            overlayProps={{
                className: `section ${styles.section} section-navbar-slider`,
            }}
            onTransitionEnd={() => fade === 'out' && closeNavbar()}
        >
            <UINavbarSliderHeader onClose={fadeOut}>
                <Link
                    data-fs-navbar-slider-logo
                    href={logo.link ? logo.link.url : '/'}
                    title={logo.link ? logo.link.title : homeLabel}
                    onClick={fadeOut}
                >
                    <Logo alt={logo.alt} src={logo.src} />
                </Link>
            </UINavbarSliderHeader>
            <UINavbarSliderContent>
                <NavbarLinks onClickLink={fadeOut} links={links} region={region} />
            </UINavbarSliderContent>
            <UINavbarSliderFooter>
                <Suspense fallback={<ButtonSignInFallback />}>
                    <ButtonSignIn {...signInButton} />
                </Suspense>
            </UINavbarSliderFooter>
        </UINavbarSlider>
    )
}

export default NavbarSlider
