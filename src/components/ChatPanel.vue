<template>
  <div class="flex-1 flex flex-col bg-gray-900">
    <!-- 顶部工具栏 -->
    <div class="border-b border-gray-800 p-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <h2 class="text-xl font-semibold text-white">思考过程</h2>
          <div class="flex items-center space-x-2">
            <button class="toolbar-btn">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
              </svg>
            </button>
            <button class="toolbar-btn">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
            </button>
            <button class="toolbar-btn">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
              </svg>
            </button>
          </div>
        </div>
        
        <div class="flex items-center space-x-2">
          <button class="btn-secondary text-sm">
            实时预览
          </button>
          <button @click="savePresentation" class="btn-secondary text-sm">
            保存
          </button>
          <button @click="showCollaboration = true" class="btn-secondary text-sm">
            协作
          </button>
          <button class="btn-secondary text-sm">
            流式文档
          </button>
        </div>
      </div>
    </div>

    <!-- 错误提示 -->
    <Transition name="slide-down">
      <div v-if="error" class="mx-6 mt-4 p-4 bg-red-900/50 border border-red-700 rounded-lg flex items-center space-x-3 error-slide-in">
      <svg class="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <span class="text-red-300 flex-1">{{ error }}</span>
      <button @click="slidesStore.clearError()" class="text-red-400 hover:text-red-300">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
      </div>
    </Transition>

    <!-- 聊天消息区域 -->
    <div class="flex-1 overflow-y-auto p-6 space-y-6" ref="messagesContainer">
      <!-- 初始提示 -->
      <div v-if="chatMessages.length === 0" class="text-center py-12">
        <div class="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
          </svg>
        </div>
        
        <!-- 根据布局模式显示不同的欢迎内容 -->
        <div v-if="layoutMode === 'chat-only'">
          <h3 class="text-2xl font-bold text-white mb-4">pharmolix，您的 AI 办公助手</h3>
          <p class="text-gray-400 mb-8 text-lg">我可以帮助您创建PPT、分析文档、制作图表等。请告诉我您需要什么帮助，或者从左侧选择一个具体任务开始。</p>
          
          <!-- 功能卡片 - 全屏模式下显示更大的卡片 -->
          <div class="grid grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div 
              v-for="suggestion in quickSuggestions" 
              :key="suggestion.title"
              class="template-card text-left group cursor-pointer transform hover:scale-105 transition-all duration-200"
              @click="handleSuggestionClick(suggestion)"
            >
              <div class="flex items-start space-x-4">
                <div class="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <component :is="suggestion.icon" class="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 class="font-semibold text-white mb-2 text-lg">{{ suggestion.title }}</h4>
                  <p class="text-gray-400 leading-relaxed">{{ suggestion.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else>
          <h3 class="text-lg font-medium text-white mb-2">开始您的 AI 创作</h3>
          <p class="text-gray-400 mb-6">在下方输入您的需求，我会帮您生成内容并在右侧实时预览</p>
        </div>
      </div>

      <!-- 聊天消息 -->
      <div
        v-for="message in chatMessages"
        :key="message.id"
        class="animate-slide-up"
      >
        <div class="flex items-start space-x-3 mb-4">
          <div class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
               :class="message.type === 'user' ? 'bg-blue-600' : 'bg-gray-700'">
            <svg v-if="message.type === 'user'" class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
            <svg v-else class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
            </svg>
          </div>
          
          <div class="flex-1 min-w-0">
            <div class="flex items-center space-x-2 mb-2">
              <span class="text-sm font-medium text-white">
                {{ message.type === 'user' ? '您' : 'PPT 制作专家' }}
              </span>
              <span class="text-xs text-gray-500">
                {{ formatTime(message.timestamp) }}
              </span>
            </div>
            
            <div class="chat-message" :class="message.type === 'user' ? 'user-message' : 'ai-message'">
              <div class="text-sm leading-relaxed">{{ message.content }}</div>
              
              <!-- AI 响应的 JSON 数据展示 -->
              <div v-if="message.type === 'ai' && message.jsonData" class="mt-4 p-4 bg-gray-900 rounded-lg border border-gray-600">
                <div class="flex items-center space-x-2 mb-2">
                  <svg class="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                  </svg>
                  <span class="text-xs font-medium text-blue-400">执行的操作指令</span>
                </div>
                <pre class="text-xs text-gray-300 font-mono overflow-x-auto">{{ JSON.stringify(message.jsonData, null, 2) }}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 加载状态 -->
      <div v-if="isGenerating || isLoading" class="flex items-start space-x-3 animate-pulse">
        <div class="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
          </svg>
        </div>
        <div class="flex-1">
          <div class="flex items-center space-x-2 mb-2">
            <span class="text-sm font-medium text-white">PPT 制作专家</span>
            <span class="text-xs text-gray-500">正在思考中...</span>
          </div>
          <div class="ai-message">
            <div class="flex items-center space-x-2">
              <div class="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
              <span class="text-sm text-gray-300">正在分析您的需求并生成幻灯片...</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 输入区域 -->
    <div class="border-t border-gray-800 p-6">
      <div class="flex items-end space-x-4">
        <div class="flex-1">
          <div class="flex items-center space-x-2 mb-2">
            <button class="toolbar-btn">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
              </svg>
            </button>
            <button class="toolbar-btn">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
              </svg>
            </button>
          </div>
          
          <div class="relative">
            <textarea
              v-model="inputText"
              @keydown.enter.exact.prevent="handleSend"
              @keydown.enter.shift.exact="inputText += '\n'"
              @input="handleInput"
              :disabled="isGenerating"
              :maxlength="2000"
              placeholder="给我布置一个任务..."
              rows="3"
              class="input-field w-full resize-none pr-12"
              :class="{ 'border-red-500': inputText.length > 1800 }"
              aria-label="输入您的任务或问题"
              aria-describedby="input-help"
            ></textarea>
            
            <button
              @click="handleSend"
              :disabled="!inputText.trim() || isGenerating"
              class="absolute bottom-3 right-3 p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200"
              :aria-label="isGenerating ? '正在处理中...' : '发送消息'"
            >
              <svg v-if="!isGenerating" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
              </svg>
              <div v-else class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            </button>
          </div>
        </div>
      </div>
      
      <!-- 模型选择 -->
      <div class="flex items-center justify-between mt-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2 text-sm text-gray-400">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
            </svg>
            <select v-model="selectedModel" class="bg-transparent text-gray-400 text-sm focus:outline-none">
              <option value="gpt-4">GPT-4 演示专家</option>
              <option value="claude">Claude 创意助手</option>
              <option value="gemini">Gemini 分析师</option>
            </select>
          </div>
          
          <div class="flex items-center space-x-4">
            <div class="text-xs text-gray-500">
              快捷键：Ctrl+N 新建，← → 导航
            </div>
            <button @click="showHelp = !showHelp" class="toolbar-btn">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </button>
          </div>
        </div>
        
        <div id="input-help" class="text-xs text-gray-500">
          Shift + Enter 换行，Enter 发送 | {{ inputText.length }}/2000 字符
        </div>
      </div>
    </div>

    <!-- 帮助面板 -->
    <div v-if="showHelp" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="showHelp = false">
      <div class="bg-gray-800 rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto" @click.stop>
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-semibold text-white">使用帮助</h3>
          <button @click="showHelp = false" class="toolbar-btn">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div class="space-y-6">
          <!-- 快捷键 -->
          <div>
            <h4 class="text-lg font-medium text-white mb-3">快捷键</h4>
            <div class="grid grid-cols-2 gap-3">
              <div class="flex items-center justify-between p-2 bg-gray-700 rounded">
                <span class="text-gray-300">新建幻灯片</span>
                <kbd class="px-2 py-1 bg-gray-600 rounded text-xs">Ctrl+N</kbd>
              </div>
              <div class="flex items-center justify-between p-2 bg-gray-700 rounded">
                <span class="text-gray-300">复制幻灯片</span>
                <kbd class="px-2 py-1 bg-gray-600 rounded text-xs">Ctrl+D</kbd>
              </div>
              <div class="flex items-center justify-between p-2 bg-gray-700 rounded">
                <span class="text-gray-300">上一页</span>
                <kbd class="px-2 py-1 bg-gray-600 rounded text-xs">←</kbd>
              </div>
              <div class="flex items-center justify-between p-2 bg-gray-700 rounded">
                <span class="text-gray-300">下一页</span>
                <kbd class="px-2 py-1 bg-gray-600 rounded text-xs">→</kbd>
              </div>
              <div class="flex items-center justify-between p-2 bg-gray-700 rounded">
                <span class="text-gray-300">全屏演示</span>
                <kbd class="px-2 py-1 bg-gray-600 rounded text-xs">F5</kbd>
              </div>
              <div class="flex items-center justify-between p-2 bg-gray-700 rounded">
                <span class="text-gray-300">删除幻灯片</span>
                <kbd class="px-2 py-1 bg-gray-600 rounded text-xs">Del</kbd>
              </div>
            </div>
          </div>

          <!-- 语音指令 -->
          <div>
            <h4 class="text-lg font-medium text-white mb-3">常用指令</h4>
            <div class="space-y-2">
              <div class="p-3 bg-gray-700 rounded">
                <div class="text-blue-400 font-medium mb-1">创建内容</div>
                <div class="text-gray-300 text-sm">
                  "创建一个产品介绍PPT" | "添加标题页" | "新建团队介绍幻灯片"
                </div>
              </div>
              <div class="p-3 bg-gray-700 rounded">
                <div class="text-green-400 font-medium mb-1">编辑修改</div>
                <div class="text-gray-300 text-sm">
                  "修改当前标题" | "编辑第一页内容" | "更换主题颜色"
                </div>
              </div>
              <div class="p-3 bg-gray-700 rounded">
                <div class="text-purple-400 font-medium mb-1">添加元素</div>
                <div class="text-gray-300 text-sm">
                  "添加图片" | "插入数据图表" | "添加团队成员介绍"
                </div>
              </div>
            </div>
          </div>

          <!-- 模板类型 -->
          <div>
            <h4 class="text-lg font-medium text-white mb-3">支持的演示类型</h4>
            <div class="grid grid-cols-3 gap-3">
              <div class="text-center p-3 bg-gray-700 rounded">
                <div class="text-blue-400 font-medium">商务汇报</div>
                <div class="text-gray-400 text-xs mt-1">项目总结、业绩展示</div>
              </div>
              <div class="text-center p-3 bg-gray-700 rounded">
                <div class="text-green-400 font-medium">产品介绍</div>
                <div class="text-gray-400 text-xs mt-1">功能特性、优势对比</div>
              </div>
              <div class="text-center p-3 bg-gray-700 rounded">
                <div class="text-purple-400 font-medium">培训教学</div>
                <div class="text-gray-400 text-xs mt-1">课程内容、知识点</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 协作面板 -->
    <CollaborationPanel 
      :show-collaboration="showCollaboration" 
      @close="showCollaboration = false" 
    />
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, h } from 'vue'
import { storeToRefs } from 'pinia'
import { useSlidesStore } from '@/stores/slides'
import CollaborationPanel from './CollaborationPanel.vue'

const slidesStore = useSlidesStore()
const { chatMessages, isGenerating, layoutMode, error, isLoading } = storeToRefs(slidesStore)

const inputText = ref('')
const messagesContainer = ref<HTMLElement>()
const selectedModel = ref('gpt-4')
const showHelp = ref(false)
const showCollaboration = ref(false)

// 快捷建议
const quickSuggestions = [
  {
    title: '产品介绍演示',
    description: '创建专业的产品展示PPT',
    prompt: '帮我创建一个产品介绍的演示文稿，包含产品特点、优势和市场定位',
    icon: h('svg', { class: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' })
    ])
  },
  {
    title: '项目汇报PPT',
    description: '生成项目进展汇报幻灯片',
    prompt: '制作一个项目汇报PPT，包含项目概述、进展情况、遇到的问题和下一步计划',
    icon: h('svg', { class: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' })
    ])
  },
  {
    title: '培训课程PPT',
    description: '设计教学培训演示文稿',
    prompt: '创建一个培训课程PPT，主题是团队协作技巧，包含理论介绍、实践案例和互动环节',
    icon: h('svg', { class: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' })
    ])
  },
  {
    title: '营销方案展示',
    description: '制作营销策略演示PPT',
    prompt: '帮我制作一个营销方案PPT，包含市场分析、目标客户、营销策略和预期效果',
    icon: h('svg', { class: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' })
    ])
  }
]

const formatTime = (timestamp: number) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('zh-CN', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const handleInput = () => {
  // 自动调整输入框高度
  const textarea = event?.target as HTMLTextAreaElement
  if (textarea) {
    textarea.style.height = 'auto'
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px'
  }
}

const handleSend = async () => {
  if (!inputText.value.trim() || isGenerating.value) return
  
  const message = inputText.value
  inputText.value = ''
  
  // 添加模型信息到消息中
  const enhancedMessage = `[${selectedModel.value}] ${message}`
  await slidesStore.handleUserInput(enhancedMessage)
  
  // 自动保存状态
  slidesStore.saveToLocalStorage()
  
  // 滚动到底部
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

// 处理建议卡片点击
const handleSuggestionClick = (suggestion: any) => {
  // 根据建议类型切换到对应的任务模式
  const taskMapping: Record<string, string> = {
    '产品介绍演示': 'ppt-creation',
    '项目汇报PPT': 'ppt-creation',
    '培训课程PPT': 'ppt-creation',
    '营销方案展示': 'ppt-creation'
  }
  
  const taskId = taskMapping[suggestion.title]
  if (taskId) {
    slidesStore.selectTask(taskId)
  }
  
  // 设置输入框内容
  inputText.value = suggestion.prompt
}

const savePresentation = () => {
  const data = {
    slides: slidesStore.slides,
    theme: slidesStore.theme,
    saveTime: new Date().toISOString()
  }
  localStorage.setItem('presentation_backup', JSON.stringify(data))
  // 注意：这里应该使用 store 内部的方法，暂时移除直接调用
}

onMounted(() => {
  slidesStore.initializeDemo()
  
  // 自动保存功能
  setInterval(savePresentation, 30000) // 每30秒自动保存
})
</script>