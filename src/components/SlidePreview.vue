<template>
  <div class="h-full flex flex-col bg-gray-900 border-l border-gray-800">
    <!-- 预览标题栏 -->
    <div class="p-6 border-b border-gray-800 flex items-center justify-between">
      <div>
        <h2 class="text-xl font-semibold text-white">项目总结报告(修改版1)</h2>
        <p class="text-sm text-gray-400 mt-1">
          {{ totalSlides > 0 ? `第 ${currentSlideIndex + 1} 页，共 ${totalSlides} 页` : '暂无幻灯片' }}
        </p>
      </div>
      
      <!-- 工具栏 -->
      <div class="flex items-center space-x-2">
        <button class="toolbar-btn" title="编辑" @click="openEditor">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
          </svg>
        </button>
        <button class="toolbar-btn" title="下载" @click="exportSlides">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
        </button>
        <button class="toolbar-btn" title="分享" @click="shareSlides">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
          </svg>
        </button>
        <button class="toolbar-btn" title="复制" @click="duplicateSlide">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
          </svg>
        </button>
        
        <!-- 导航按钮 -->
        <div class="flex items-center space-x-1 ml-4" v-if="totalSlides > 1">
          <button
            @click="slidesStore.prevSlide()"
            :disabled="currentSlideIndex === 0"
            class="toolbar-btn disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
          <button
            @click="slidesStore.nextSlide()"
            :disabled="currentSlideIndex === totalSlides - 1"
            class="toolbar-btn disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- 幻灯片内容区域 -->
    <div class="flex-1 p-6 bg-gray-850">
      <div class="h-full bg-white rounded-xl shadow-2xl overflow-hidden">
        <div v-if="currentSlide" class="h-full p-12 flex flex-col justify-center" :class="getSlideTheme()">
          <!-- 标题布局 -->
          <div v-if="currentSlide.layout === 'title'" class="text-center">
            <div class="mb-8">
              <div class="text-6xl font-bold text-blue-600 mb-4">abc</div>
              <div class="w-16 h-1 bg-blue-600 mx-auto mb-8"></div>
            </div>
            <h1 class="text-4xl font-bold text-gray-800 mb-6">{{ currentSlide.title }}</h1>
            <p v-if="currentSlide.content" class="text-xl text-gray-600 leading-relaxed">{{ currentSlide.content }}</p>
            <div class="mt-12 text-sm text-gray-500">
              <p>主要人员团队：请输入团队名称</p>
              <p>日期：2025年3月</p>
            </div>
          </div>

          <!-- 标题+要点布局 -->
          <div v-else-if="currentSlide.layout === 'title+bullets'" class="h-full flex flex-col">
            <div class="mb-8">
              <h2 class="text-3xl font-bold text-gray-800 mb-2">{{ currentSlide.title }}</h2>
              <div class="w-12 h-1 bg-blue-600"></div>
            </div>
            
            <div class="flex-1 grid grid-cols-1 gap-6">
              <div 
                v-for="(bullet, index) in currentSlide.bullets" 
                :key="index"
                class="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500"
              >
                <div class="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {{ String(index + 1).padStart(2, '0') }}
                </div>
                <div class="flex-1">
                  <p class="text-lg text-gray-800 font-medium">{{ bullet }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 图片+文字布局 -->
          <div v-else-if="currentSlide.layout === 'image+text'" class="grid grid-cols-2 gap-12 items-center h-full">
            <div>
              <h2 class="text-3xl font-bold text-gray-800 mb-6">{{ currentSlide.title }}</h2>
              <div class="w-12 h-1 bg-blue-600 mb-6"></div>
              <p class="text-lg text-gray-600 leading-relaxed">{{ currentSlide.content }}</p>
            </div>
            <div class="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl h-80 flex items-center justify-center border border-blue-200">
              <img 
                v-if="currentSlide.image" 
                :src="currentSlide.image" 
                :alt="currentSlide.imagePrompt || '幻灯片图片'"
                class="w-full h-full object-cover rounded-2xl"
              />
              <div v-else class="text-blue-400 text-center">
                <svg class="w-20 h-20 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <p class="text-lg font-medium">{{ currentSlide.imagePrompt || '图片占位符' }}</p>
              </div>
            </div>
          </div>

          <!-- 全图布局 -->
          <div v-else-if="currentSlide.layout === 'full-image'" class="relative h-full rounded-2xl overflow-hidden">
            <img 
              v-if="currentSlide.image" 
              :src="currentSlide.image" 
              :alt="currentSlide.imagePrompt || '全屏图片'"
              class="w-full h-full object-cover"
            />
            <div v-else class="bg-gradient-to-br from-blue-100 to-indigo-200 h-full flex items-center justify-center">
              <div class="text-blue-500 text-center">
                <svg class="w-32 h-32 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <p class="text-2xl font-bold">{{ currentSlide.imagePrompt || '全屏图片占位符' }}</p>
              </div>
            </div>
            
            <!-- 标题覆盖层 -->
            <div v-if="currentSlide.title" class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white p-8">
              <h2 class="text-3xl font-bold">{{ currentSlide.title }}</h2>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-else class="h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
          <div class="text-center text-gray-400">
            <div class="w-24 h-24 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <p class="text-xl font-medium text-gray-600 mb-2">开始创建您的演示文稿</p>
            <p class="text-gray-500">在左侧对话框中描述您的需求</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 幻灯片缩略图导航 -->
    <div v-if="totalSlides > 1" class="p-6 border-t border-gray-800">
      <div class="flex space-x-3 overflow-x-auto pb-2">
        <button
          v-for="(slide, index) in slides"
          :key="slide.id"
          @click="slidesStore.goToSlide(index)"
          class="slide-thumbnail flex-shrink-0 w-20 h-14 relative group"
          :class="{ active: index === currentSlideIndex }"
        >
          <div class="w-full h-full bg-white rounded-lg flex items-center justify-center text-xs font-medium text-gray-600 shadow-sm">
            {{ index + 1 }}
          </div>
          
          <!-- 悬浮预览 -->
          <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <div class="bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              {{ slide.title || `幻灯片 ${index + 1}` }}
            </div>
            <div class="w-2 h-2 bg-gray-800 transform rotate-45 mx-auto -mt-1"></div>
          </div>
        </button>
      </div>
    </div>

    <!-- 幻灯片编辑器 -->
    <SlideEditor 
      :is-editing="isEditing" 
      :slide="currentSlide" 
      @close="isEditing = false" 
    />

    <!-- 导出选项弹窗 -->
    <div v-if="showExportModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="showExportModal = false">
      <div class="bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4" @click.stop>
        <h3 class="text-xl font-semibold text-white mb-4">导出演示文稿</h3>
        <div class="space-y-3">
          <button @click="exportAsPDF" class="w-full p-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-left transition-colors duration-200">
            <div class="flex items-center space-x-3">
              <svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
              </svg>
              <div>
                <div class="text-white font-medium">PDF 文件</div>
                <div class="text-gray-400 text-sm">适合打印和分享</div>
              </div>
            </div>
          </button>
          <button @click="exportAsImages" class="w-full p-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-left transition-colors duration-200">
            <div class="flex items-center space-x-3">
              <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <div>
                <div class="text-white font-medium">图片文件</div>
                <div class="text-gray-400 text-sm">每页单独保存为图片</div>
              </div>
            </div>
          </button>
          <button @click="exportAsJSON" class="w-full p-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-left transition-colors duration-200">
            <div class="flex items-center space-x-3">
              <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
              </svg>
              <div>
                <div class="text-white font-medium">JSON 数据</div>
                <div class="text-gray-400 text-sm">保存为结构化数据</div>
              </div>
            </div>
          </button>
        </div>
        <button @click="showExportModal = false" class="w-full mt-4 btn-secondary">
          取消
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useSlidesStore } from '@/stores/slides'
import SlideEditor from './SlideEditor.vue'

const slidesStore = useSlidesStore()
const { slides, currentSlide, currentSlideIndex, totalSlides, theme } = storeToRefs(slidesStore)

const isEditing = ref(false)
const showExportModal = ref(false)

const getSlideTheme = () => {
  const paletteClasses = {
    blue: 'bg-gradient-to-br from-blue-50 to-blue-100',
    green: 'bg-gradient-to-br from-green-50 to-green-100',
    purple: 'bg-gradient-to-br from-purple-50 to-purple-100',
    orange: 'bg-gradient-to-br from-orange-50 to-orange-100',
    gray: 'bg-gradient-to-br from-gray-50 to-gray-100'
  }
  
  return paletteClasses[theme.value.palette] || paletteClasses.blue
}

// 编辑功能
const openEditor = () => {
  if (currentSlide.value) {
    isEditing.value = true
  }
}

// 复制幻灯片
const duplicateSlide = () => {
  if (currentSlide.value) {
    const newSlide = {
      ...currentSlide.value,
      id: `slide_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: `${currentSlide.value.title} (副本)`
    }
    slidesStore.slides.push(newSlide)
    slidesStore.addChatMessage('ai', `已复制幻灯片"${currentSlide.value.title}"`)
  }
}

// 导出功能
const exportSlides = () => {
  showExportModal.value = true
}

const exportAsPDF = () => {
  // 模拟PDF导出
  const link = document.createElement('a')
  link.href = 'data:application/pdf;base64,JVBERi0xLjQKJdPr6eEKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFszIDAgUl0KL0NvdW50IDEKPD4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgovTWVkaWFCb3ggWzAgMCA2MTIgNzkyXQovUmVzb3VyY2VzIDw8Ci9Gb250IDw8Ci9GMSA0IDAgUgo+Pgo+PgovQ29udGVudHMgNSAwIFIKPj4KZW5kb2JqCjQgMCBvYmoKPDwKL1R5cGUgL0ZvbnQKL1N1YnR5cGUgL1R5cGUxCi9CYXNlRm9udCAvSGVsdmV0aWNhCj4+CmVuZG9iago1IDAgb2JqCjw8Ci9MZW5ndGggNDQKPj4Kc3RyZWFtCkJUCi9GMSAxMiBUZgoxMDAgNzAwIFRkCihIZWxsbyBXb3JsZCkgVGoKRVQKZW5kc3RyZWFtCmVuZG9iagp4cmVmCjAgNgowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMDkgMDAwMDAgbiAKMDAwMDAwMDA1OCAwMDAwMCBuIAowMDAwMDAwMTE1IDAwMDAwIG4gCjAwMDAwMDAyNDUgMDAwMDAgbiAKMDAwMDAwMDMxMiAwMDAwMCBuIAp0cmFpbGVyCjw8Ci9TaXplIDYKL1Jvb3QgMSAwIFIKPj4Kc3RhcnR4cmVmCjQwNgolJUVPRgo='
  link.download = '演示文稿.pdf'
  link.click()
  showExportModal.value = false
  slidesStore.addChatMessage('ai', '已导出PDF文件到下载文件夹')
}

const exportAsImages = () => {
  // 模拟图片导出
  slides.value.forEach((slide, index) => {
    const canvas = document.createElement('canvas')
    canvas.width = 1920
    canvas.height = 1080
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = '#000000'
      ctx.font = '48px Arial'
      ctx.fillText(slide.title || `幻灯片 ${index + 1}`, 100, 200)
    }
    
    canvas.toBlob((blob) => {
      if (blob) {
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = `幻灯片_${index + 1}.png`
        link.click()
      }
    })
  })
  showExportModal.value = false
  slidesStore.addChatMessage('ai', `已导出${slides.value.length}张图片到下载文件夹`)
}

const exportAsJSON = () => {
  const data = {
    slides: slides.value,
    theme: theme.value,
    exportTime: new Date().toISOString()
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = '演示文稿数据.json'
  link.click()
  showExportModal.value = false
  slidesStore.addChatMessage('ai', '已导出JSON数据文件')
}

// 分享功能
const shareSlides = async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: '我的演示文稿',
        text: `查看我创建的演示文稿，共${totalSlides.value}页`,
        url: window.location.href
      })
      slidesStore.addChatMessage('ai', '已通过系统分享功能分享演示文稿')
    } catch (error) {
      copyToClipboard()
    }
  } else {
    copyToClipboard()
  }
}

const copyToClipboard = () => {
  const shareText = `我创建了一个演示文稿，共${totalSlides.value}页幻灯片。标题：${currentSlide.value?.title || '未命名演示'}`
  navigator.clipboard.writeText(shareText).then(() => {
    slidesStore.addChatMessage('ai', '已复制分享文本到剪贴板')
  }).catch(() => {
    slidesStore.addChatMessage('ai', '分享功能暂时不可用')
  })
}
</script>
