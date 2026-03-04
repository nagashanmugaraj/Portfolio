import { motion } from 'framer-motion'
import Skills from '../components/sections/Skills'

function SkillsPage() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Skills />
        </motion.div>
    )
}

export default SkillsPage
