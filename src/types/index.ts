export interface Slide {
  id: string
  layout: 'title' | 'title+bullets' | 'image+text' | 'full-image'
  title?: string
  bullets?: string[]
  content?: string
  image?: string
  imagePrompt?: string
}

export interface SlideTheme {
  palette: 'blue' | 'green' | 'purple' | 'orange' | 'gray'
  font: 'inter' | 'roboto' | 'poppins'
}

export interface ChatMessage {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: number
  jsonData?: any
}

export type SlideAction = 
  | { action: 'add_slide'; layout: Slide['layout']; title?: string; bullets?: string[]; content?: string }
  | { action: 'edit_text'; slide_id: string; field: 'title' | 'content'; new_text: string }
  | { action: 'replace_image'; slide_id: string; image_prompt: string }
  | { action: 'set_theme'; palette: SlideTheme['palette']; font: SlideTheme['font'] }
  | { action: 'delete_slide'; slide_id: string }
