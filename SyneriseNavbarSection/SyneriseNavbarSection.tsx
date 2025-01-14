import Navbar from './Navbar/Navbar'
import styles from './section.module.scss'

type PageLinks = {
    url: string
    text: string
}
export interface NavbarProps {
    logo: {
        alt: string
        src: string
        link: {
            url: string
            title: string
        }
    }
    searchInput: {
        placeholder?: string
        apiHost: string
        trackerKey: string
        productsIndex: string
        suggestionsIndex: string
        articlesIndex: string
    }
    signInButton: {
        icon: {
            alt: string
            icon: string
        }
        label: string
        myAccountLabel: string
    }
    cartIcon: {
        alt: string
        icon: string
    }
    navigation: {
        regionalization: {
            enabled: boolean
            icon: {
                alt: string
                icon: string
            }
            label: string
        }
        pageLinks: PageLinks[]
        menu: {
            icon: {
                alt: string
                icon: string
            }
        }
        home: {
            label: string
        }
    }
}

function SyneriseNavbarSection({
    logo,
    searchInput,
    cartIcon,
    signInButton,
    navigation: {
        menu,
        home,
        pageLinks,
        regionalization: {
            label: regionLabel,
            icon: { icon: regionIcon },
            enabled: shouldDisplayRegion,
        },
    },
}: NavbarProps) {
    return (
        <section className={`section ${styles.section} section-navbar`}>
            <Navbar
                home={home}
                menu={menu}
                logo={logo}
                searchInput={searchInput}
                cart={cartIcon}
                links={pageLinks}
                signIn={{ button: signInButton }}
                region={{
                    icon: regionIcon,
                    label: regionLabel,
                    shouldDisplayRegion,
                }}
            />
        </section>
    )
}

export default SyneriseNavbarSection
