import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Slide, SlideTheme, ChatMessage, SlideAction } from '@/types'

export const useSlidesStore = defineStore('slides', () => {
  // 状态
  const slides = ref<Slide[]>([])
  const theme = ref<SlideTheme>({
    palette: 'blue',
    font: 'inter'
  })
  const chatMessages = ref<ChatMessage[]>([])
  const isGenerating = ref(false)
  const layoutMode = ref<'chat-only' | 'split-view'>('chat-only') // 布局模式：仅聊天 | 分栏视图
  const selectedTask = ref<string | null>(null) // 当前选中的任务
  const error = ref<string | null>(null) // 错误状态
  const isLoading = ref(false) // 加载状态

  // 计算属性
  const currentSlideIndex = ref(0)
  const currentSlide = computed(() => slides.value[currentSlideIndex.value])
  const totalSlides = computed(() => slides.value.length)

  // 生成唯一ID
  const generateId = () => `slide_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  // 添加聊天消息
  const addChatMessage = (type: 'user' | 'ai', content: string, jsonData?: any) => {
    const message: ChatMessage = {
      id: `msg_${Date.now()}`,
      type,
      content,
      timestamp: Date.now(),
      jsonData
    }
    chatMessages.value.push(message)
  }

  // 设置错误状态
  const setError = (errorMessage: string) => {
    error.value = errorMessage
    setTimeout(() => {
      error.value = null
    }, 5000) // 5秒后自动清除错误
  }

  // 清除错误
  const clearError = () => {
    error.value = null
  }

  // 执行幻灯片操作
  const executeSlideAction = (action: SlideAction) => {
    switch (action.action) {
      case 'add_slide':
        const newSlide: Slide = {
          id: generateId(),
          layout: action.layout,
          title: action.title || '新幻灯片',
          bullets: action.bullets || [],
          content: action.content || ''
        }
        slides.value.push(newSlide)
        currentSlideIndex.value = slides.value.length - 1
        break

      case 'edit_text':
        const slideToEdit = slides.value.find(s => s.id === action.slide_id)
        if (slideToEdit) {
          if (action.field === 'title') {
            slideToEdit.title = action.new_text
          } else if (action.field === 'content') {
            slideToEdit.content = action.new_text
          }
        }
        break

      case 'replace_image':
        const slideForImage = slides.value.find(s => s.id === action.slide_id)
        if (slideForImage) {
          slideForImage.imagePrompt = action.image_prompt
          // 模拟图片URL生成
          slideForImage.image = `https://picsum.photos/800/600?random=${Math.random()}`
        }
        break

      case 'set_theme':
        theme.value = {
          palette: action.palette,
          font: action.font
        }
        break

      case 'delete_slide':
        const indexToDelete = slides.value.findIndex(s => s.id === action.slide_id)
        if (indexToDelete !== -1) {
          slides.value.splice(indexToDelete, 1)
          if (currentSlideIndex.value >= slides.value.length) {
            currentSlideIndex.value = Math.max(0, slides.value.length - 1)
          }
        }
        break
    }
  }

  // 智能AI响应系统
  const simulateAIResponse = async (userInput: string): Promise<SlideAction> => {
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 1000)) // 模拟网络延迟

    const input = userInput.toLowerCase()
    
    // 产品介绍相关
    if (input.includes('产品') && (input.includes('介绍') || input.includes('展示'))) {
      return {
        action: 'add_slide',
        layout: 'title+bullets',
        title: '产品核心优势',
        bullets: [
          '🚀 创新技术架构，性能提升300%',
          '💡 用户体验优化，操作更简单直观',
          '🔒 企业级安全保障，数据加密存储',
          '📈 智能数据分析，助力业务增长'
        ]
      }
    }
    
    // 项目汇报相关
    if (input.includes('项目') && (input.includes('汇报') || input.includes('总结') || input.includes('报告'))) {
      return {
        action: 'add_slide',
        layout: 'title+bullets',
        title: '项目执行情况总结',
        bullets: [
          '✅ 按时完成所有里程碑节点',
          '📊 关键指标超额完成120%',
          '🤝 团队协作效率显著提升',
          '💰 成本控制在预算范围内'
        ]
      }
    }
    
    // 培训课程相关
    if (input.includes('培训') || input.includes('课程') || input.includes('教学')) {
      return {
        action: 'add_slide',
        layout: 'title+bullets',
        title: '课程学习目标',
        bullets: [
          '📚 掌握核心理论知识体系',
          '🛠️ 熟练运用实践操作技能',
          '🎯 培养问题分析解决能力',
          '🌟 提升团队协作沟通技巧'
        ]
      }
    }
    
    // 营销方案相关
    if (input.includes('营销') || input.includes('推广') || input.includes('市场')) {
      return {
        action: 'add_slide',
        layout: 'title+bullets',
        title: '营销策略执行方案',
        bullets: [
          '🎯 精准定位目标客户群体',
          '📱 多渠道整合营销推广',
          '💎 差异化品牌价值主张',
          '📈 数据驱动效果优化'
        ]
      }
    }
    
    // 标题页相关
    if (input.includes('标题页') || input.includes('封面') || input.includes('首页')) {
      return {
        action: 'add_slide',
        layout: 'title',
        title: '专业演示文稿',
        content: '基于AI智能生成的高质量内容'
      }
    }
    
    // 修改编辑相关
    if (input.includes('修改') || input.includes('编辑') || input.includes('更改')) {
      const currentSlideId = slides.value[currentSlideIndex.value]?.id
      if (currentSlideId) {
        if (input.includes('标题')) {
          return {
            action: 'edit_text',
            slide_id: currentSlideId,
            field: 'title',
            new_text: '已优化的标题内容'
          }
        } else {
          return {
            action: 'edit_text',
            slide_id: currentSlideId,
            field: 'content',
            new_text: '根据您的要求更新的内容'
          }
        }
      }
    }
    
    // 图片相关
    if (input.includes('图片') || input.includes('图像') || input.includes('照片')) {
      const currentSlideId = slides.value[currentSlideIndex.value]?.id
      if (currentSlideId) {
        return {
          action: 'replace_image',
          slide_id: currentSlideId,
          image_prompt: input
        }
      } else {
        return {
          action: 'add_slide',
          layout: 'image+text',
          title: '图文展示',
          content: '这里是图片的详细说明内容，可以描述图片的重要信息和相关背景。'
        }
      }
    }
    
    // 主题颜色相关
    if (input.includes('主题') || input.includes('颜色') || input.includes('样式')) {
      const themes = ['blue', 'green', 'purple', 'orange', 'gray'] as const
      const randomTheme = themes[Math.floor(Math.random() * themes.length)]
      return {
        action: 'set_theme',
        palette: randomTheme,
        font: 'inter'
      }
    }
    
    // 删除相关
    if (input.includes('删除') || input.includes('移除')) {
      const currentSlideId = slides.value[currentSlideIndex.value]?.id
      if (currentSlideId && slides.value.length > 1) {
        return {
          action: 'delete_slide',
          slide_id: currentSlideId
        }
      }
    }
    
    // 数据分析相关
    if (input.includes('数据') || input.includes('分析') || input.includes('统计')) {
      return {
        action: 'add_slide',
        layout: 'title+bullets',
        title: '数据分析洞察',
        bullets: [
          '📊 用户增长率达到45%，超出预期',
          '💹 转化率提升至12.5%，行业领先',
          '🎯 客户满意度评分4.8/5.0',
          '⚡ 系统响应时间优化至200ms'
        ]
      }
    }
    
    // 团队介绍相关
    if (input.includes('团队') || input.includes('成员') || input.includes('人员')) {
      return {
        action: 'add_slide',
        layout: 'title+bullets',
        title: '核心团队介绍',
        bullets: [
          '👨‍💼 项目经理：10年行业经验，PMP认证',
          '👩‍💻 技术负责人：资深架构师，技术专家',
          '👨‍🎨 设计师：用户体验设计，获奖作品',
          '👩‍📊 数据分析师：商业智能，数据驱动'
        ]
      }
    }
    
    // 时间计划相关
    if (input.includes('计划') || input.includes('时间') || input.includes('进度')) {
      return {
        action: 'add_slide',
        layout: 'title+bullets',
        title: '项目时间规划',
        bullets: [
          '📅 第一阶段：需求分析与设计（2周）',
          '🔧 第二阶段：核心功能开发（4周）',
          '🧪 第三阶段：测试与优化（2周）',
          '🚀 第四阶段：上线与维护（1周）'
        ]
      }
    }

    // 智能内容生成：基于关键词
    const keywords = input.split(/[，。！？\s]+/).filter(word => word.length > 1)
    if (keywords.length > 0) {
      const mainKeyword = keywords[0]
      return {
        action: 'add_slide',
        layout: 'title+bullets',
        title: `关于"${mainKeyword}"的深度解析`,
        bullets: [
          `🔍 ${mainKeyword}的核心概念与定义`,
          `📈 ${mainKeyword}的发展趋势与机遇`,
          `⚡ ${mainKeyword}的实际应用场景`,
          `🎯 ${mainKeyword}的未来发展方向`
        ]
      }
    }

    // 默认智能响应
    return {
      action: 'add_slide',
      layout: 'title+bullets',
      title: 'AI智能生成内容',
      bullets: [
        '🤖 基于您的输入智能分析生成',
        '💡 可以继续描述具体需求',
        '🔄 支持实时修改和优化',
        '✨ 让我们一起完善演示内容'
      ]
    }
  }

  // 处理用户输入
  const handleUserInput = async (input: string) => {
    if (!input.trim()) {
      setError('请输入有效的内容')
      return
    }

    // 清除之前的错误
    clearError()
    
    // 添加用户消息
    addChatMessage('user', input)
    isGenerating.value = true
    isLoading.value = true

    try {
      // 模拟AI处理
      const action = await simulateAIResponse(input)
      
      // 如果是添加幻灯片操作且当前是仅聊天模式，自动切换到分栏模式
      if (action.action === 'add_slide' && layoutMode.value === 'chat-only') {
        switchToSplitView('ppt-creation')
      }
      
      // 执行操作
      executeSlideAction(action)
      
      // 添加AI响应消息
      const aiResponse = generateResponseMessage(action)
      addChatMessage('ai', aiResponse, action)
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '处理请求时出现未知错误'
      setError(errorMessage)
      addChatMessage('ai', '抱歉，处理您的请求时出现了错误，请重试。')
    } finally {
      isGenerating.value = false
      isLoading.value = false
    }
  }

  // 生成响应消息
  const generateResponseMessage = (action: SlideAction): string => {
    const messages: Record<string, string> = {
      'add_slide': '已为您创建新的幻灯片',
      'edit_text': '已更新幻灯片内容',
      'replace_image': '已更换幻灯片图片',
      'set_theme': '已应用新的主题样式',
      'delete_slide': '已删除指定幻灯片'
    }
    return messages[action.action] || '操作已完成'
  }

  // 导航方法
  const goToSlide = (index: number) => {
    if (index >= 0 && index < slides.value.length) {
      currentSlideIndex.value = index
    }
  }

  const nextSlide = () => {
    if (currentSlideIndex.value < slides.value.length - 1) {
      currentSlideIndex.value++
    }
  }

  const prevSlide = () => {
    if (currentSlideIndex.value > 0) {
      currentSlideIndex.value--
    }
  }

  // 切换布局模式
  const switchToSplitView = (taskId?: string) => {
    layoutMode.value = 'split-view'
    if (taskId) {
      selectedTask.value = taskId
    }
  }

  const switchToChatOnly = () => {
    layoutMode.value = 'chat-only'
    selectedTask.value = null
  }

  // 选择任务（会自动切换到分栏模式）
  const selectTask = (taskId: string) => {
    selectedTask.value = taskId
    layoutMode.value = 'split-view'
    
    // 根据任务类型添加相应的欢迎消息
    const taskMessages: Record<string, string> = {
      'ppt-creation': '已切换到PPT制作模式，现在您可以在左侧与我对话创建幻灯片，右侧实时预览效果。',
      'document-analysis': '已切换到文档分析模式，请上传您需要分析的文档。',
      'data-visualization': '已切换到数据可视化模式，请提供您的数据或描述可视化需求。'
    }
    
    const message = taskMessages[taskId] || '已切换到分栏模式，您可以开始工作了。'
    addChatMessage('ai', message)
  }

  // 保存状态到本地存储
  const saveToLocalStorage = () => {
    try {
      const state = {
        slides: slides.value,
        theme: theme.value,
        chatMessages: chatMessages.value,
        layoutMode: layoutMode.value,
        selectedTask: selectedTask.value,
        currentSlideIndex: currentSlideIndex.value,
        timestamp: Date.now()
      }
      localStorage.setItem('pharmolix_state', JSON.stringify(state))
    } catch (error) {
      console.warn('无法保存状态到本地存储:', error)
    }
  }

  // 从本地存储恢复状态
  const loadFromLocalStorage = () => {
    try {
      const saved = localStorage.getItem('pharmolix_state')
      if (saved) {
        const state = JSON.parse(saved)
        // 检查数据是否过期（24小时）
        if (Date.now() - state.timestamp < 24 * 60 * 60 * 1000) {
          slides.value = state.slides || []
          theme.value = state.theme || { palette: 'blue', font: 'inter' }
          chatMessages.value = state.chatMessages || []
          layoutMode.value = state.layoutMode || 'chat-only'
          selectedTask.value = state.selectedTask || null
          currentSlideIndex.value = state.currentSlideIndex || 0
          return true
        }
      }
    } catch (error) {
      console.warn('无法从本地存储恢复状态:', error)
    }
    return false
  }

  // 清除本地存储
  const clearLocalStorage = () => {
    try {
      localStorage.removeItem('pharmolix_state')
    } catch (error) {
      console.warn('无法清除本地存储:', error)
    }
  }

  // 初始化示例数据
  const initializeDemo = () => {
    // 尝试从本地存储恢复状态
    const restored = loadFromLocalStorage()
    
    if (!restored) {
      // 初始化时不创建任何幻灯片，保持纯聊天模式
      slides.value = []
      chatMessages.value = []
      
      addChatMessage('ai', '您好！我是您的AI办公助手。我可以帮助您创建PPT、分析文档、制作图表等。请告诉我您需要什么帮助，或者从左侧选择一个具体任务开始。')
    }
  }

  return {
    // 状态
    slides,
    theme,
    chatMessages,
    isGenerating,
    currentSlideIndex,
    layoutMode,
    selectedTask,
    error,
    isLoading,
    
    // 计算属性
    currentSlide,
    totalSlides,
    
    // 方法
    handleUserInput,
    goToSlide,
    nextSlide,
    prevSlide,
    initializeDemo,
    executeSlideAction,
    switchToSplitView,
    switchToChatOnly,
    selectTask,
    saveToLocalStorage,
    loadFromLocalStorage,
    clearLocalStorage,
    setError,
    clearError
  }
})
