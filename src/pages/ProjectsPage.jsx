import { motion } from 'framer-motion'
import Projects from '../components/sections/Projects'

function ProjectsPage() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Projects />
        </motion.div>
    )
}

export default ProjectsPage
