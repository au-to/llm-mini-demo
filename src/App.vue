<template>
  <div class="h-screen bg-gray-900 flex overflow-hidden">
    <!-- 移动端遮罩层 -->
    <div 
      v-if="isSidebarOpen && isMobile" 
      class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
      @click="closeSidebar"
    ></div>
    
    <!-- 左侧边栏 -->
    <Sidebar 
      :is-open="isSidebarOpen" 
      :is-mobile="isMobile"
      @toggle="toggleSidebar"
      @close="closeSidebar"
    />
    
    <!-- 主要内容区域 -->
    <div class="flex-1 flex flex-col lg:flex-row min-w-0">
      <!-- 移动端顶部工具栏 -->
      <div v-if="isMobile" class="lg:hidden bg-gray-800 border-b border-gray-700 p-4 flex items-center justify-between">
        <button @click="toggleSidebar" class="toolbar-btn">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
        <h1 class="text-white font-semibold">pharmolix</h1>
        <div class="w-8"></div> <!-- 占位符保持居中 -->
      </div>

      <!-- 仅聊天模式：全屏聊天 -->
      <div v-if="layoutMode === 'chat-only'" class="flex-1 flex items-center justify-center p-4">
        <div class="w-full max-w-4xl mx-auto">
          <ChatPanel />
        </div>
      </div>

      <!-- 分栏模式：左侧聊天，右侧预览 -->
      <template v-else>
        <!-- 左侧：对话面板 -->
        <div class="flex-1 lg:max-w-2xl min-h-0">
          <ChatPanel />
        </div>

        <!-- 右侧：幻灯片预览 -->
        <div class="flex-1 min-w-0 min-h-0 lg:border-l lg:border-gray-800">
          <SlidePreview />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import Sidebar from '@/components/Sidebar.vue'
import ChatPanel from '@/components/ChatPanel.vue'
import SlidePreview from '@/components/SlidePreview.vue'
import { useKeyboardShortcuts } from '@/composables/useKeyboardShortcuts'
import { storeToRefs } from 'pinia'
import { useSlidesStore } from '@/stores/slides'
import { ref, onMounted, onUnmounted } from 'vue'

// 获取布局模式状态
const slidesStore = useSlidesStore()
const { layoutMode } = storeToRefs(slidesStore)

// 响应式设计状态
const isMobile = ref(false)
const isSidebarOpen = ref(false)

// 检测屏幕尺寸
const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 1024 // lg断点
  if (!isMobile.value) {
    isSidebarOpen.value = false // 桌面端自动关闭侧边栏遮罩
  }
}

// 侧边栏控制
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const closeSidebar = () => {
  isSidebarOpen.value = false
}

// 生命周期
onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
})

// 启用快捷键支持
useKeyboardShortcuts()
</script>
