import { motion } from 'framer-motion'
import Contact from '../components/sections/Contact'

function ContactPage() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Contact />
        </motion.div>
    )
}

export default ContactPage
