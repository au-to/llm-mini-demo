<template>
  <div class="h-screen bg-gray-900 flex overflow-hidden">
    <!-- 左侧边栏 -->
    <Sidebar />
    
    <!-- 主要内容区域 -->
    <div class="flex-1 flex">
      <!-- 中间：对话面板 -->
      <div class="flex-1 max-w-2xl">
        <ChatPanel />
      </div>

      <!-- 右侧：幻灯片预览 -->
      <div class="flex-1 min-w-0">
        <SlidePreview />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Sidebar from '@/components/Sidebar.vue'
import ChatPanel from '@/components/ChatPanel.vue'
import SlidePreview from '@/components/SlidePreview.vue'
import { useKeyboardShortcuts } from '@/composables/useKeyboardShortcuts'

// 启用快捷键支持
useKeyboardShortcuts()
</script>
