import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import AboutPage from './pages/AboutPage'
import SkillsPage from './pages/SkillsPage'
import ProjectsPage from './pages/ProjectsPage'
import InternshipsPage from './pages/InternshipsPage'
import ContactPage from './pages/ContactPage'
import Admin from './pages/Admin'
import BlogPost from './pages/BlogPost'

function App() {
    const location = useLocation()

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="about" element={<AboutPage />} />
                    <Route path="skills" element={<SkillsPage />} />
                    <Route path="projects" element={<ProjectsPage />} />
                    <Route path="internships" element={<InternshipsPage />} />
                    <Route path="contact" element={<ContactPage />} />
                    <Route path="admin" element={<Admin />} />
                    <Route path="blog/:slug" element={<BlogPost />} />
                </Route>
            </Routes>
        </AnimatePresence>
    )
}

export default App
