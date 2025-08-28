<template>
  <div v-if="showCollaboration" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="$emit('close')">
    <div class="bg-gray-800 rounded-xl p-6 w-full max-w-4xl mx-4 max-h-[80vh] overflow-y-auto" @click.stop>
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-semibold text-white">协作与版本管理</h3>
        <button @click="$emit('close')" class="toolbar-btn">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- 版本历史 -->
        <div>
          <h4 class="text-lg font-medium text-white mb-4">版本历史</h4>
          <div class="space-y-3 max-h-96 overflow-y-auto">
            <div 
              v-for="version in versions" 
              :key="version.id"
              class="p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200 cursor-pointer"
              @click="previewVersion(version)"
            >
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center space-x-2">
                  <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span class="text-white font-medium">{{ version.name }}</span>
                  <span v-if="version.id === currentVersionId" class="px-2 py-1 bg-blue-600 text-white text-xs rounded">当前</span>
                </div>
                <span class="text-gray-400 text-sm">{{ formatTime(version.timestamp) }}</span>
              </div>
              <p class="text-gray-300 text-sm mb-2">{{ version.description }}</p>
              <div class="flex items-center space-x-4 text-xs text-gray-400">
                <span>{{ version.slideCount }} 张幻灯片</span>
                <span>{{ version.author }}</span>
              </div>
            </div>
          </div>
          
          <button @click="createVersion" class="w-full mt-4 btn-primary">
            创建新版本
          </button>
        </div>

        <!-- 协作者 -->
        <div>
          <h4 class="text-lg font-medium text-white mb-4">协作者</h4>
          <div class="space-y-3">
            <div 
              v-for="collaborator in collaborators" 
              :key="collaborator.id"
              class="flex items-center justify-between p-3 bg-gray-700 rounded-lg"
            >
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
                     :class="collaborator.avatarColor">
                  {{ collaborator.name.charAt(0) }}
                </div>
                <div>
                  <div class="text-white font-medium">{{ collaborator.name }}</div>
                  <div class="text-gray-400 text-sm">{{ collaborator.role }}</div>
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <div class="w-2 h-2 rounded-full" :class="collaborator.online ? 'bg-green-500' : 'bg-gray-500'"></div>
                <span class="text-gray-400 text-sm">{{ collaborator.online ? '在线' : '离线' }}</span>
              </div>
            </div>
          </div>

          <div class="mt-4">
            <div class="flex space-x-2">
              <input
                v-model="inviteEmail"
                type="email"
                placeholder="输入邮箱邀请协作者..."
                class="input-field flex-1"
              />
              <button @click="inviteCollaborator" class="btn-primary">
                邀请
              </button>
            </div>
          </div>

          <!-- 实时活动 -->
          <div class="mt-6">
            <h5 class="text-md font-medium text-white mb-3">实时活动</h5>
            <div class="space-y-2 max-h-48 overflow-y-auto">
              <div 
                v-for="activity in recentActivities" 
                :key="activity.id"
                class="p-2 bg-gray-700 rounded text-sm"
              >
                <div class="flex items-center space-x-2">
                  <div class="w-4 h-4 rounded-full" :class="activity.userColor"></div>
                  <span class="text-gray-300">
                    <span class="text-white font-medium">{{ activity.userName }}</span>
                    {{ activity.action }}
                  </span>
                  <span class="text-gray-500 text-xs ml-auto">{{ formatTime(activity.timestamp) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 分享设置 -->
      <div class="mt-6 pt-6 border-t border-gray-700">
        <h4 class="text-lg font-medium text-white mb-4">分享设置</h4>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="p-4 bg-gray-700 rounded-lg text-center">
            <svg class="w-8 h-8 mx-auto mb-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
            </svg>
            <div class="text-white font-medium mb-1">分享链接</div>
            <div class="text-gray-400 text-sm mb-3">生成可访问的分享链接</div>
            <button @click="generateShareLink" class="btn-secondary text-sm">生成链接</button>
          </div>
          
          <div class="p-4 bg-gray-700 rounded-lg text-center">
            <svg class="w-8 h-8 mx-auto mb-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
            <div class="text-white font-medium mb-1">访问权限</div>
            <div class="text-gray-400 text-sm mb-3">设置查看和编辑权限</div>
            <select class="bg-gray-600 text-white text-sm rounded px-2 py-1">
              <option>仅查看</option>
              <option>可编辑</option>
              <option>管理员</option>
            </select>
          </div>
          
          <div class="p-4 bg-gray-700 rounded-lg text-center">
            <svg class="w-8 h-8 mx-auto mb-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a4 4 0 118 0v4m-4 6v6m-4-6h8m-8 0H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2v-6a2 2 0 00-2-2h-4"></path>
            </svg>
            <div class="text-white font-medium mb-1">密码保护</div>
            <div class="text-gray-400 text-sm mb-3">为分享链接设置密码</div>
            <button @click="setPassword" class="btn-secondary text-sm">设置密码</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useSlidesStore } from '@/stores/slides'

defineProps<{
  showCollaboration: boolean
}>()

defineEmits<{
  close: []
}>()

const slidesStore = useSlidesStore()
const inviteEmail = ref('')
const currentVersionId = ref('v1')

// 模拟版本数据
const versions = ref([
  {
    id: 'v3',
    name: '版本 3.0',
    description: '添加了数据分析章节和团队介绍',
    timestamp: Date.now() - 1000 * 60 * 30,
    slideCount: 8,
    author: '张三'
  },
  {
    id: 'v2',
    name: '版本 2.1',
    description: '优化了产品介绍部分的布局和内容',
    timestamp: Date.now() - 1000 * 60 * 60 * 2,
    slideCount: 6,
    author: '李四'
  },
  {
    id: 'v1',
    name: '版本 1.0',
    description: '初始版本，包含基础的项目概述',
    timestamp: Date.now() - 1000 * 60 * 60 * 24,
    slideCount: 4,
    author: '王五'
  }
])

// 模拟协作者数据
const collaborators = ref([
  {
    id: '1',
    name: '张三',
    role: '项目经理',
    online: true,
    avatarColor: 'bg-blue-500 text-white'
  },
  {
    id: '2',
    name: '李四',
    role: '设计师',
    online: true,
    avatarColor: 'bg-green-500 text-white'
  },
  {
    id: '3',
    name: '王五',
    role: '开发者',
    online: false,
    avatarColor: 'bg-purple-500 text-white'
  }
])

// 模拟实时活动
const recentActivities = ref([
  {
    id: '1',
    userName: '张三',
    action: '编辑了第3页幻灯片',
    timestamp: Date.now() - 1000 * 60 * 5,
    userColor: 'bg-blue-500'
  },
  {
    id: '2',
    userName: '李四',
    action: '添加了新的图片',
    timestamp: Date.now() - 1000 * 60 * 15,
    userColor: 'bg-green-500'
  },
  {
    id: '3',
    userName: '王五',
    action: '创建了版本 2.1',
    timestamp: Date.now() - 1000 * 60 * 60,
    userColor: 'bg-purple-500'
  }
])

const formatTime = (timestamp: number) => {
  const now = Date.now()
  const diff = now - timestamp
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  return `${days}天前`
}

const previewVersion = (version: any) => {
  slidesStore.addChatMessage('ai', `正在预览版本 ${version.name}`)
}

const createVersion = () => {
  const newVersion = {
    id: `v${versions.value.length + 1}`,
    name: `版本 ${versions.value.length + 1}.0`,
    description: '基于当前内容创建的新版本',
    timestamp: Date.now(),
    slideCount: slidesStore.slides.length,
    author: '当前用户'
  }
  versions.value.unshift(newVersion)
  currentVersionId.value = newVersion.id
  slidesStore.addChatMessage('ai', `已创建新版本：${newVersion.name}`)
}

const inviteCollaborator = () => {
  if (inviteEmail.value) {
    slidesStore.addChatMessage('ai', `已向 ${inviteEmail.value} 发送协作邀请`)
    inviteEmail.value = ''
  }
}

const generateShareLink = () => {
  const shareLink = `${window.location.origin}/share/${Math.random().toString(36).substr(2, 9)}`
  navigator.clipboard.writeText(shareLink).then(() => {
    slidesStore.addChatMessage('ai', '分享链接已复制到剪贴板')
  })
}

const setPassword = () => {
  slidesStore.addChatMessage('ai', '密码保护功能已启用')
}
</script>
