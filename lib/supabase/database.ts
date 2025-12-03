import { createBrowserClient } from '@supabase/ssr'

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    }
  }
)

// Team Members
export interface TeamMember {
  id: string
  name: string
  role: string
  department: string
  email: string
  linkedin?: string
  image_url?: string
  description?: string
  created_at?: string
  updated_at?: string
}

export async function fetchTeamMembers(): Promise<TeamMember[]> {
  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching team members:', error)
    return []
  }
  
  return data || []
}

export async function createTeamMember(member: Omit<TeamMember, 'id' | 'created_at' | 'updated_at'>): Promise<TeamMember | null> {
  const { data, error } = await supabase
    .from('team_members')
    .insert(member)
    .select()
    .single()
  
  if (error) {
    console.error('Error creating team member:', error)
    return null
  }
  
  return data
}

export async function updateTeamMember(id: string, updates: Partial<TeamMember>): Promise<TeamMember | null> {
  const { data, error } = await supabase
    .from('team_members')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating team member:', error)
    return null
  }
  
  return data
}

export async function deleteTeamMember(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('team_members')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Error deleting team member:', error)
    return false
  }
  
  return true
}

// Events
export interface Event {
  id: string
  title: string
  date: string
  location: string
  description: string
  category: string
  image_url?: string
  created_at?: string
  updated_at?: string
}

export async function fetchEvents(): Promise<Event[]> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching events:', error)
    return []
  }
  
  return data || []
}

export async function createEvent(event: Omit<Event, 'id' | 'created_at' | 'updated_at'>): Promise<Event | null> {
  const { data, error } = await supabase
    .from('events')
    .insert(event)
    .select()
    .single()
  
  if (error) {
    console.error('Error creating event:', error)
    return null
  }
  
  return data
}

export async function updateEvent(id: string, updates: Partial<Event>): Promise<Event | null> {
  const { data, error } = await supabase
    .from('events')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating event:', error)
    return null
  }
  
  return data
}

export async function deleteEvent(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Error deleting event:', error)
    return false
  }
  
  return true
}

// Projects
export interface Project {
  id: string
  title: string
  description: string
  technologies: string
  github: string
  demo: string
  image_url?: string
  created_at?: string
  updated_at?: string
}

export async function fetchProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching projects:', error)
    return []
  }
  
  return data || []
}

export async function createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .insert(project)
    .select()
    .single()
  
  if (error) {
    console.error('Error creating project:', error)
    return null
  }
  
  return data
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating project:', error)
    return null
  }
  
  return data
}

export async function deleteProject(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Error deleting project:', error)
    return false
  }
  
  return true
}

// Gallery
export interface GalleryImage {
  id: string
  title: string
  image_url: string
  category: string
  description?: string
  created_at?: string
  updated_at?: string
}

export async function fetchGalleryImages(): Promise<GalleryImage[]> {
  const { data, error } = await supabase
    .from('gallery')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching gallery images:', error)
    return []
  }
  
  return data || []
}

export async function createGalleryImage(image: Omit<GalleryImage, 'id' | 'created_at' | 'updated_at'>): Promise<GalleryImage | null> {
  const { data, error } = await supabase
    .from('gallery')
    .insert(image)
    .select()
    .single()
  
  if (error) {
    console.error('Error creating gallery image:', error)
    return null
  }
  
  return data
}

export async function updateGalleryImage(id: string, updates: Partial<GalleryImage>): Promise<GalleryImage | null> {
  const { data, error } = await supabase
    .from('gallery')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating gallery image:', error)
    return null
  }
  
  return data
}

export async function deleteGalleryImage(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('gallery')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Error deleting gallery image:', error)
    return false
  }
  
  return true
}

// Announcements
export interface Announcement {
  id: string
  title: string
  content: string
  category: string
  date: string
  image_url?: string
  created_at?: string
  updated_at?: string
}

export async function fetchAnnouncements(): Promise<Announcement[]> {
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching announcements:', error)
    return []
  }
  
  return data || []
}

export async function createAnnouncement(announcement: Omit<Announcement, 'id' | 'created_at' | 'updated_at'>): Promise<Announcement | null> {
  const { data, error } = await supabase
    .from('announcements')
    .insert(announcement)
    .select()
    .single()
  
  if (error) {
    console.error('Error creating announcement:', error)
    return null
  }
  
  return data
}

export async function updateAnnouncement(id: string, updates: Partial<Announcement>): Promise<Announcement | null> {
  const { data, error } = await supabase
    .from('announcements')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating announcement:', error)
    return null
  }
  
  return data
}

export async function deleteAnnouncement(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('announcements')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Error deleting announcement:', error)
    return false
  }
  
  return true
}

// About
export interface AboutItem {
  id: string
  title: string
  description: string
  type: "section" | "item"
  image_url?: string
  created_at?: string
  updated_at?: string
}

export async function fetchAboutItems(): Promise<AboutItem[]> {
  try {
    const { data, error } = await supabase
      .from('about')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching about items:', error)
      // Fallback to localStorage
      return JSON.parse(localStorage.getItem('sccAbout') || '[]')
    }
    
    return data || []
  } catch (error) {
    console.error('Error fetching about items:', error)
    // Fallback to localStorage
    return JSON.parse(localStorage.getItem('sccAbout') || '[]')
  }
}

export async function createAboutItem(item: Omit<AboutItem, 'id' | 'created_at' | 'updated_at'>): Promise<AboutItem | null> {
  console.log('Creating about item with data:', item)
  
  try {
    const { data, error } = await supabase
      .from('about')
      .insert(item)
      .select()
      .single()
    
    if (error) {
      console.error('Error creating about item:', error)
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      // Fallback to localStorage if Supabase fails
      const newItem: AboutItem = {
        ...item,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      if (typeof window !== 'undefined') {
        const existingItems = JSON.parse(localStorage.getItem('sccAbout') || '[]')
        existingItems.push(newItem)
        localStorage.setItem('sccAbout', JSON.stringify(existingItems))
      }
      
      return newItem
    }
    
    console.log('Successfully created about item:', data)
    return data
  } catch (error) {
    console.error('Unexpected error creating about item:', error)
    // Fallback to localStorage if Supabase fails
    const newItem: AboutItem = {
      ...item,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    if (typeof window !== 'undefined') {
      const existingItems = JSON.parse(localStorage.getItem('sccAbout') || '[]')
      existingItems.push(newItem)
      localStorage.setItem('sccAbout', JSON.stringify(existingItems))
    }
    
    return newItem
  }
}

export async function updateAboutItem(id: string, updates: Partial<AboutItem>): Promise<AboutItem | null> {
  const { data, error } = await supabase
    .from('about')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating about item:', error)
    return null
  }
  
  return data
}

export async function deleteAboutItem(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('about')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Error deleting about item:', error)
    return false
  }
  
  return true
}
