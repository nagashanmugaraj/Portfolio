import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { FiCode, FiUsers } from 'react-icons/fi'
import Tilt from 'react-parallax-tilt'
import { useData } from '../../context/DataContext'

import Modal from '../ui/Modal'
import styles from './Skills.module.css'

function Skills() {
    const { data } = useData()
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-100px" })
    const [activeModal, setActiveModal] = useState(null)

    const technicalSkills = data.skills?.technical || []
    const softSkills = data.skills?.soft || []

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    }

    return (
        <section className={styles.skills} id="skills" ref={ref}>
            <div className="container">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                >
                    {/* Section Header */}
                    <motion.div className={styles.header} variants={itemVariants}>
                        <span className={styles.label}>My Expertise</span>
                        <h2 className={styles.title}>
                            Skills & <span className="text-gradient">Technologies</span>
                        </h2>
                        <p className={styles.subtitle}>
                            Tools and technologies I use to bring ideas to life
                        </p>
                    </motion.div>

                    {/* Skill Categories */}
                    <div className={styles.categories}>
                        {/* Technical Skills Card */}
                        <Tilt
                            tiltMaxAngleX={5}
                            tiltMaxAngleY={5}
                            scale={1.02}
                            perspective={1000}
                            transitionSpeed={1500}
                            className={styles.tiltWrapper}
                        >
                            <motion.div
                                className={styles.categoryCard}
                                variants={itemVariants}
                            >
                                <div className={styles.cardHeader}>
                                    <div className={styles.cardIcon}>
                                        <FiCode />
                                    </div>
                                    <h3 className={styles.cardTitle}>Technical Skills</h3>
                                </div>
                                <div className={styles.softSkillsGrid}>
                                    {technicalSkills.slice(0, 6).map((skill, index) => (
                                        <motion.div
                                            key={skill.name}
                                            className={styles.softSkillTag}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: index * 0.1 }}
                                            whileHover={{ scale: 1.05 }}
                                        >
                                            {skill.name}
                                        </motion.div>
                                    ))}
                                </div>
                                {technicalSkills.length > 6 && (
                                    <button
                                        className={styles.viewAllBtn}
                                        onClick={() => setActiveModal('technical')}
                                    >
                                        View All ({technicalSkills.length})
                                    </button>
                                )}
                            </motion.div>
                        </Tilt>

                        {/* Soft Skills Card */}
                        <Tilt
                            tiltMaxAngleX={5}
                            tiltMaxAngleY={5}
                            scale={1.02}
                            perspective={1000}
                            transitionSpeed={1500}
                            className={styles.tiltWrapper}
                        >
                            <motion.div
                                className={styles.categoryCard}
                                variants={itemVariants}
                            >
                                <div className={styles.cardHeader}>
                                    <div className={styles.cardIcon}>
                                        <FiUsers />
                                    </div>
                                    <h3 className={styles.cardTitle}>Soft Skills</h3>
                                </div>
                                <div className={styles.softSkillsGrid}>
                                    {softSkills.map((skill, index) => (
                                        <motion.div
                                            key={skill.name}
                                            className={styles.softSkillTag}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: index * 0.1 }}
                                            whileHover={{ scale: 1.05 }}
                                        >
                                            {skill.name}
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        </Tilt>
                    </div>
                </motion.div>
            </div>

            {/* Skills Modal */}
            <Modal
                isOpen={activeModal === 'technical'}
                onClose={() => setActiveModal(null)}
                title="Technical Skills"
            >
                <div className={styles.modalContent}>
                    {technicalSkills.map((skill, index) => (
                        <motion.div
                            key={skill.name}
                            className={styles.softSkillTag}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ scale: 1.05 }}
                        >
                            {skill.name}
                        </motion.div>
                    ))}
                </div>
            </Modal>
        </section>
    )
}

export default Skills
