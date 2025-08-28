import { onMounted, onUnmounted } from 'vue'
import { useSlidesStore } from '@/stores/slides'

export function useKeyboardShortcuts() {
  const slidesStore = useSlidesStore()

  const handleKeydown = (event: KeyboardEvent) => {
    // 如果正在输入，忽略快捷键
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
      return
    }

    // Ctrl/Cmd + 组合键
    if (event.ctrlKey || event.metaKey) {
      switch (event.key) {
        case 'n':
          event.preventDefault()
          // 新建幻灯片
          slidesStore.executeSlideAction({
            action: 'add_slide',
            layout: 'title+bullets',
            title: '新建幻灯片',
            bullets: ['要点一', '要点二', '要点三']
          })
          slidesStore.addChatMessage('ai', '通过快捷键创建了新幻灯片')
          break
        
        case 'd':
          event.preventDefault()
          // 复制当前幻灯片
          if (slidesStore.currentSlide) {
            const newSlide = {
              ...slidesStore.currentSlide,
              id: `slide_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              title: `${slidesStore.currentSlide.title} (副本)`
            }
            slidesStore.slides.push(newSlide)
            slidesStore.addChatMessage('ai', '通过快捷键复制了当前幻灯片')
          }
          break
        
        case 's':
          event.preventDefault()
          // 保存/导出
          slidesStore.addChatMessage('ai', '快捷键保存功能已触发')
          break
        
        case 'z':
          event.preventDefault()
          // 撤销功能（简化版）
          slidesStore.addChatMessage('ai', '撤销功能暂未实现')
          break
      }
      return
    }

    // 单键快捷键
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault()
        slidesStore.prevSlide()
        break
      
      case 'ArrowRight':
        event.preventDefault()
        slidesStore.nextSlide()
        break
      
      case 'Delete':
        event.preventDefault()
        if (slidesStore.currentSlide && slidesStore.slides.length > 1) {
          slidesStore.executeSlideAction({
            action: 'delete_slide',
            slide_id: slidesStore.currentSlide.id
          })
          slidesStore.addChatMessage('ai', '通过快捷键删除了当前幻灯片')
        }
        break
      
      case 'F5':
        event.preventDefault()
        // 全屏演示模式
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen()
          slidesStore.addChatMessage('ai', '进入全屏演示模式')
        }
        break
      
      case 'Escape':
        event.preventDefault()
        // 退出全屏
        if (document.fullscreenElement) {
          document.exitFullscreen()
        }
        break
    }
  }

  onMounted(() => {
    document.addEventListener('keydown', handleKeydown)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
  })

  return {
    // 可以返回一些状态或方法供组件使用
  }
}
