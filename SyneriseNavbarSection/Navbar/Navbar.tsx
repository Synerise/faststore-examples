import {useCallback, useRef, useState} from 'react'
import dynamic from 'next/dynamic'
import {
    Icon as UIIcon,
    IconButton as UIIconButton,
    Navbar as NavbarWrapper,
    NavbarButtons as UINavbarButtons,
    NavbarHeader as UINavbarHeader,
    NavbarRow as UINavbarRow,
    useScrollDirection,
    useUI
} from '@faststore/ui'

import CartToggle from 'src/components/cart/CartToggle'
import Link from 'src/components/ui/Link'
import Logo from 'src/components/ui/Logo'
import useScreenResize from 'src/sdk/ui/useScreenResize'

import type {NavbarProps as SectionNavbarProps} from '../SyneriseNavbarSection'
import SearchInput, {SearchInputRef} from './SearchInput'

const NavbarLinks = dynamic(
    () =>
        /* webpackChunkName: "NavbarLinks" */ import(
        './NavbarLinks'
        ),
    {
        ssr: false,
    }
)

const NavbarSlider = dynamic(
    () =>
        /* webpackChunkName: "NavbarSlider" */ import(
        './NavbarSlider'
        ),
    {ssr: false}
)

const ButtonSignIn = dynamic(() =>
    import(
        /* webpackChunkName: "ButtonSignIn" */ 'src/components/ui/Button'
        ).then((module) => module.ButtonSignIn)
)

export interface NavbarProps {
    /**
     * Logo props.
     */
    logo: SectionNavbarProps['logo']
    /**
     * Search Input props.
     */
    searchInput: SectionNavbarProps['searchInput']
    /**
     * Cart props.
     */
    cart: SectionNavbarProps['cartIcon']
    /**
     * Sign In props.
     */
    signIn: {
        button: SectionNavbarProps['signInButton']
    }
    /**
     * Region props.
     */
    region: {
        icon: string
        label: string
        shouldDisplayRegion: boolean
    }
    /**
     * Page links.
     */
    links: SectionNavbarProps['navigation']['pageLinks']
    /**
     * Home props.
     */
    home: SectionNavbarProps['navigation']['home']
    /**
     * Menu props.
     */
    menu: SectionNavbarProps['navigation']['menu']
}

function SyneriseNavbar({
    cart,
    logo,
    searchInput,
    home,
    links,
    signIn,
    region,
    home: {label: homeLabel},
    signIn: {button: signInButton},
    menu: {
        icon: {icon: menuIcon, alt: menuIconAlt},
    },
}: NavbarProps) {
    const scrollDirection = useScrollDirection()
    const {openNavbar, navbar: displayNavbar} = useUI()
    const {isDesktop, isMobile} = useScreenResize()

    const searchMobileRef = useRef<SearchInputRef>(null)
    const [searchExpanded, setSearchExpanded] = useState(false)

    const handlerExpandSearch = useCallback(() => {
        setSearchExpanded(true)
        searchMobileRef.current?.inputRef?.focus()
    }, [])

    const handleCollapseSearch = useCallback(() => {
        setSearchExpanded(false)
        searchMobileRef.current?.resetSearchInput()
    }, [])

    return (
        <NavbarWrapper scrollDirection={scrollDirection}>
            <UINavbarHeader>
                <UINavbarRow>
                    {!searchExpanded && (
                        <>
                            <UIIconButton
                                data-fs-navbar-button-menu
                                onClick={openNavbar}
                                icon={<UIIcon name={menuIcon} width={32} height={32}/>}
                                aria-label={menuIconAlt}
                            />
                            <Link
                                data-fs-navbar-logo
                                href={logo.link ? logo.link.url : '/'}
                                title={logo.link ? logo.link.title : homeLabel}
                                prefetch={false}
                            >
                                <Logo src={logo.src} alt={logo.alt}/>
                            </Link>
                        </>
                    )}

                    {isDesktop && (
                        <SearchInput searchInput={searchInput} placeholder={searchInput?.placeholder} />
                    )}

                    <UINavbarButtons searchExpanded={searchExpanded}>
                        {searchExpanded && (
                            <UIIconButton
                                data-fs-button-collapse
                                aria-label="Collapse search bar"
                                icon={<UIIcon name="CaretLeft" width={32} height={32}/>}
                                // Dynamic props, shouldn't be overridable
                                // This decision can be reviewed later if needed
                                onClick={handleCollapseSearch}
                            />
                        )}

                        {!isDesktop && (
                            <SearchInput
                                searchInput={searchInput}
                                placeholder=""
                                ref={searchMobileRef}
                                testId="store-input-mobile"
                                buttonTestId="store-input-mobile-button"
                                onSearchClick={handlerExpandSearch}
                                hidden={!searchExpanded}
                                aria-hidden={!searchExpanded}
                            />
                        )}

                        {!isMobile && <ButtonSignIn {...signInButton} />}

                        <CartToggle {...cart} />
                    </UINavbarButtons>
                </UINavbarRow>
            </UINavbarHeader>

            {isDesktop && <NavbarLinks links={links} region={region} />}

            {displayNavbar && (
                <NavbarSlider
                    home={home}
                    logo={logo}
                    links={links}
                    signIn={signIn}
                    region={region}
                />
            )}
        </NavbarWrapper>
    )
}

export default SyneriseNavbar
