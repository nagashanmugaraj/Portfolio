import { motion } from 'framer-motion'
import Hero from '../components/sections/Hero'
import About from '../components/sections/About'
import Timeline from '../components/sections/Timeline'
import Achievements from '../components/sections/Achievements'

function AboutPage() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Hero />
            <About />
            <Timeline />
            <Achievements />
        </motion.div>
    )
}

export default AboutPage
