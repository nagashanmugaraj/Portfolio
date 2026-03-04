import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { initializeApp } from 'firebase/app'
import {
    getFirestore,
    doc,
    collection,
    onSnapshot,
    setDoc,
    deleteDoc,
    getDocs,
    serverTimestamp
} from 'firebase/firestore'
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'

// Firebase configuration (same as original)
const FIREBASE_CONFIG = {
    apiKey: "AIzaSyA-pvYsgpkWXhhK9zQi77ymbnabaFsWUpI",
    authDomain: "naga-portfolio-4513e.firebaseapp.com",
    projectId: "naga-portfolio-4513e",
    storageBucket: "naga-portfolio-4513e.firebasestorage.app",
    messagingSenderId: "700114474637",
    appId: "1:700114474637:web:50e9d6016b2a411808b4c4",
    measurementId: "G-DRXMSMDBVD"
}

const ADMIN_EMAIL = 'nagashanmugaraj27@gmail.com'
const STORAGE_KEY = 'portfolio:data:v1'

// Initialize Firebase
const app = initializeApp(FIREBASE_CONFIG)
const db = getFirestore(app)
const auth = getAuth(app)
const storage = getStorage(app)
const googleProvider = new GoogleAuthProvider()

// Default portfolio data
const defaultData = {
    name: 'Naga Shanmuga Raj S',
    headline: '',
    about: '',
    stats: [],
    projects: [],
    skills: {
        technical: [],
        soft: []
    },
    achievements: [],
    internships: [],
    testimonials: [],
    timeline: [],
    blog: [],
    profile: {
        image: '/img/Naga Shanmuga Raj S.jpeg',
        caption: ''
    },
    resume: '',
    contact: {
        email: 'nagashanmugaraj27@gmail.com',
        phone: '',
        linkedin: '',
        github: '',
        instagram: '',
        twitter: '',
        discord: ''
    },
    lastUpdate: Date.now()
}

const DataContext = createContext()

export function DataProvider({ children }) {
    // Always start with defaultData, then try to merge saved data
    const [data, setData] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY)
            if (saved) {
                const parsed = JSON.parse(saved)
                // Only use saved data if it has actual content
                return {
                    ...defaultData,
                    ...parsed,
                    // Ensure defaults for arrays if saved is empty
                    projects: parsed?.projects?.length > 0 ? parsed.projects : defaultData.projects,
                    skills: {
                        technical: parsed?.skills?.technical?.length > 0 ? parsed.skills.technical : defaultData.skills.technical,
                        soft: parsed?.skills?.soft?.length > 0 ? parsed.skills.soft : defaultData.skills.soft,
                    },
                    achievements: parsed?.achievements?.length > 0 ? parsed.achievements : defaultData.achievements,
                    internships: parsed?.internships?.length > 0 ? parsed.internships : defaultData.internships,
                    testimonials: parsed?.testimonials?.length > 0 ? parsed.testimonials : defaultData.testimonials,
                    timeline: parsed?.timeline?.length > 0 ? parsed.timeline : defaultData.timeline,
                    profile: { ...defaultData.profile, ...parsed?.profile },
                    contact: { ...defaultData.contact, ...parsed?.contact },
                }
            }
            return defaultData
        } catch {
            return defaultData
        }
    })

    const [user, setUser] = useState(null)
    const [isAdmin, setIsAdmin] = useState(false)
    const [loading, setLoading] = useState(true)
    const [syncing, setSyncing] = useState(false)

    // Auth state listener
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser)
            setIsAdmin(firebaseUser?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase())
            setLoading(false)
        })
        return () => unsubscribe()
    }, [])

    // Firestore realtime listener for portfolio meta
    useEffect(() => {
        const unsubscribe = onSnapshot(
            doc(db, 'portfolio_meta', 'main'),
            (snapshot) => {
                if (snapshot.exists()) {
                    const firebaseData = snapshot.data()
                    // Deep merge: use defaultData as base, then apply Firebase data
                    const merged = {
                        ...defaultData,
                        ...firebaseData,
                        // Ensure nested objects merge properly
                        profile: { ...defaultData.profile, ...firebaseData?.profile },
                        contact: { ...defaultData.contact, ...firebaseData?.contact },
                        skills: {
                            technical: firebaseData?.skills?.technical?.length > 0
                                ? firebaseData.skills.technical
                                : defaultData.skills.technical,
                            soft: firebaseData?.skills?.soft?.length > 0
                                ? firebaseData.skills.soft
                                : defaultData.skills.soft,
                        },
                        achievements: firebaseData?.achievements?.length > 0
                            ? firebaseData.achievements
                            : defaultData.achievements,
                        internships: firebaseData?.internships?.length > 0
                            ? firebaseData.internships
                            : defaultData.internships,
                        testimonials: firebaseData?.testimonials?.length > 0
                            ? firebaseData.testimonials
                            : defaultData.testimonials,
                        timeline: firebaseData?.timeline?.length > 0
                            ? firebaseData.timeline
                            : defaultData.timeline,
                    }
                    setData(prev => ({ ...prev, ...merged }))
                    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...data, ...merged }))
                }
            },
            (error) => {
                console.warn('Firestore listener error:', error)
            }
        )
        return () => unsubscribe()
    }, [])

    // Firestore realtime listener for portfolio_project collection
    useEffect(() => {
        const unsubscribe = onSnapshot(
            collection(db, 'portfolio_projects'),
            (snapshot) => {
                const projects = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }))
                console.log('Fetched projects from collection:', projects.length)
                // Only overwrite local projects if Firestore actually has data
                if (projects.length > 0) {
                    setData(prev => {
                        const updated = { ...prev, projects }
                        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
                        return updated
                    })
                }
            },
            (error) => {
                console.warn('Projects collection listener error (using local data):', error)
            }
        )
        return () => unsubscribe()
    }, [])

    // Save data locally and to Firebase
    const saveData = useCallback(async (newData) => {
        let updated
        setData(prev => {
            updated = { ...prev, ...newData, lastUpdate: Date.now() }
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
            return updated
        })

        if (isAdmin && user) {
            setSyncing(true)
            try {
                // Exclude projects from portfolio_meta sync - they're saved in portfolio_projects collection
                const toSync = { ...(updated || newData) }
                delete toSync.projects
                await setDoc(doc(db, 'portfolio_meta', 'main'), toSync, { merge: true })
            } catch (error) {
                console.warn('Failed to sync to Firebase (saved locally):', error)
            }
            setSyncing(false)
        }
    }, [isAdmin, user])

    // Auth methods
    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider)
            return result.user
        } catch (error) {
            console.error('Sign in error:', error)
            throw error
        }
    }

    const signOutUser = async () => {
        try {
            await signOut(auth)
        } catch (error) {
            console.error('Sign out error:', error)
        }
    }

    // Upload image to Firebase Storage
    const uploadImage = async (file, path) => {
        if (!file || !storage) return null
        try {
            const storageRef = ref(storage, path)
            await uploadBytes(storageRef, file)
            const url = await getDownloadURL(storageRef)
            return url
        } catch (error) {
            console.error('Upload error:', error)
            return null
        }
    }

    // Helper to generate unique IDs
    const generateId = () => Math.random().toString(36).slice(2, 9)

    // CRUD operations for portfolio_project collection
    const saveProject = async (projectData) => {
        if (!isAdmin || !user) return null

        const projectId = projectData.id || generateId()
        const projectWithId = { ...projectData, id: projectId, updatedAt: Date.now() }

        // Always save locally first
        setData(prev => {
            const existingIndex = (prev.projects || []).findIndex(p => p.id === projectId)
            let updatedProjects
            if (existingIndex >= 0) {
                updatedProjects = prev.projects.map(p => p.id === projectId ? projectWithId : p)
            } else {
                updatedProjects = [...(prev.projects || []), projectWithId]
            }
            const updated = { ...prev, projects: updatedProjects }
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
            return updated
        })

        // Then try to sync to Firestore
        try {
            await setDoc(doc(db, 'portfolio_projects', projectId), projectWithId, { merge: true })
        } catch (error) {
            console.warn('Firestore sync failed (saved locally):', error)
        }
        return projectId
    }

    const deleteProject = async (projectId) => {
        if (!isAdmin || !user) return false

        // Always remove locally first
        setData(prev => {
            const updated = { ...prev, projects: (prev.projects || []).filter(p => p.id !== projectId) }
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
            return updated
        })

        // Then try to remove from Firestore
        try {
            await deleteDoc(doc(db, 'portfolio_projects', projectId))
        } catch (error) {
            console.warn('Firestore delete failed (removed locally):', error)
        }
        return true
    }

    // Upload file (image or video) to Firebase Storage
    const uploadFile = async (file, path) => {
        if (!file || !storage || !isAdmin) return null
        try {
            const storageRef = ref(storage, path)
            await uploadBytes(storageRef, file)
            const url = await getDownloadURL(storageRef)
            return url
        } catch (error) {
            console.error('Upload error:', error)
            return null
        }
    }

    const addBlogPost = (post) => {
        const newPost = { ...post, id: generateId(), date: Date.now() }
        saveData({ blog: [...(data.blog || []), newPost] })
    }

    const addTestimonial = (testimonial) => {
        const newTestimonial = { ...testimonial, id: generateId() }
        saveData({ testimonials: [...(data.testimonials || []), newTestimonial] })
    }

    const value = {
        data,
        setData,
        saveData,
        user,
        isAdmin,
        loading,
        syncing,
        signInWithGoogle,
        signOutUser,
        uploadImage,
        uploadFile,
        generateId,
        saveProject,
        deleteProject,
        addBlogPost,
        addTestimonial,
    }

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    )
}

export function useData() {
    const context = useContext(DataContext)
    if (!context) {
        throw new Error('useData must be used within a DataProvider')
    }
    return context
}

export default DataContext
