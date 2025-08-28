<template>
  <div class="w-64 bg-gray-900 border-r border-gray-800 flex flex-col h-full">
    <!-- Logo 区域 -->
    <div class="p-6 border-b border-gray-800">
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
        </div>
        <div>
          <h1 class="text-white font-semibold">扣子空间</h1>
          <p class="text-xs text-gray-400">BETA</p>
        </div>
      </div>
      
      <button class="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        <span>新任务</span>
      </button>
    </div>

    <!-- AI 专家区域 -->
    <div class="flex-1 overflow-y-auto">
      <div class="p-4">
        <div class="flex items-center space-x-2 mb-4">
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
          </svg>
          <span class="text-gray-300 font-medium">AI 专家</span>
        </div>
        
        <div class="space-y-2">
          <div 
            v-for="expert in aiExperts" 
            :key="expert.id"
            class="sidebar-item"
            :class="{ active: currentExpert === expert.id }"
            @click="selectExpert(expert.id)"
          >
            <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
                 :class="expert.color">
              {{ expert.avatar }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium truncate">{{ expert.name }}</p>
              <p class="text-xs text-gray-400 truncate">{{ expert.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 任务区域 -->
      <div class="p-4 border-t border-gray-800">
        <div class="flex items-center space-x-2 mb-4">
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
          </svg>
          <span class="text-gray-300 font-medium">任务</span>
        </div>
        
        <div class="sidebar-item" :class="{ active: currentView === 'current' }" @click="currentView = 'current'">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
          </svg>
          <span>项目总结工作</span>
        </div>
      </div>
    </div>

    <!-- 用户信息 -->
    <div class="p-4 border-t border-gray-800">
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center">
          <span class="text-white text-sm font-medium">U</span>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-white truncate">RootUser_2110368801</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const currentExpert = ref('ppt')
const currentView = ref('current')

const aiExperts = [
  {
    id: 'deeptrip',
    name: 'DeepTrip 旅行专家',
    description: '旅行规划助手',
    avatar: 'D',
    color: 'bg-orange-500 text-white'
  },
  {
    id: 'video',
    name: '华美AI视频解说手',
    description: '视频内容创作',
    avatar: 'V',
    color: 'bg-red-500 text-white'
  },
  {
    id: 'analysis',
    name: '舆情分析专家',
    description: '数据分析助手',
    avatar: 'A',
    color: 'bg-green-500 text-white'
  },
  {
    id: 'ppt',
    name: 'PPT 制作专家',
    description: '演示文稿生成',
    avatar: 'P',
    color: 'bg-blue-500 text-white'
  }
]

const selectExpert = (expertId: string) => {
  currentExpert.value = expertId
}
</script>
