import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSun, FiMoon, FiMenu, FiX, FiUser } from 'react-icons/fi'
import { useTheme } from '../../context/ThemeContext'
import { useData } from '../../context/DataContext'
import styles from './Header.module.css'

function Header() {
    const { theme, setTheme, toggleTheme } = useTheme()
    const { data, user, isAdmin } = useData()
    const location = useLocation()
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false)
    }, [location])

    const navLinks = [
        { to: '/about', label: 'About' },
        { to: '/skills', label: 'Skills' },
        { to: '/projects', label: 'Projects' },
        { to: '/internships', label: 'Internships' },
        { to: '/contact', label: 'Contact' },
    ]

    const themeIcon = theme === 'dark' ? <FiSun /> : <FiMoon />

    return (
        <motion.header
            className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className={`container ${styles.container}`}>
                {/* Logo */}
                <Link to="/" className={styles.logo}>
                    <motion.span
                        className={styles.logoText}
                        whileHover={{ scale: 1.05 }}
                    >
                        {data.name || 'NAGA.S'}
                    </motion.span>
                </Link>

                {/* Desktop Navigation */}
                <nav className={styles.nav}>
                    {navLinks.map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className={`${styles.navLink} ${location.pathname === link.to ? styles.activeLink : ''}`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Actions */}
                <div className={styles.actions}>
                    {/* Theme Toggle */}
                    <motion.button
                        className={styles.iconBtn}
                        onClick={toggleTheme}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label="Toggle theme"
                    >
                        {themeIcon}
                    </motion.button>

                    {/* Theme Selector */}
                    <select
                        className={styles.themeSelect}
                        value={theme}
                        onChange={(e) => setTheme(e.target.value)}
                        aria-label="Theme selector"
                    >
                        <option value="default">Light</option>
                        <option value="dark">Dark</option>
                        <option value="warm">Warm</option>
                    </select>

                    {/* Admin Link */}
                    <Link to="/admin" className={`btn btn-secondary ${styles.adminBtn}`}>
                        <FiUser />
                        <span>Admin</span>
                    </Link>

                    {/* Mobile Menu Button */}
                    <button
                        className={styles.menuBtn}
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? <FiX /> : <FiMenu />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        className={styles.mobileMenu}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                    >
                        <nav className={styles.mobileNav}>
                            {navLinks.map((link) => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className={`${styles.mobileNavLink} ${location.pathname === link.to ? styles.activeLink : ''}`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <Link to="/admin" className={styles.mobileNavLink}>
                                Admin
                            </Link>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    )
}

export default Header

