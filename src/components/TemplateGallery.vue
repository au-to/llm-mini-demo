<template>
  <div class="p-6 bg-gray-900">
    <div class="mb-6">
      <h3 class="text-lg font-semibold text-white mb-2">网站选择</h3>
      <div class="grid grid-cols-5 gap-4">
        <div 
          v-for="category in templateCategories" 
          :key="category.id"
          class="template-card text-center group"
          @click="selectCategory(category.id)"
        >
          <div class="w-full h-24 bg-gradient-to-br rounded-lg mb-3 flex items-center justify-center"
               :class="category.gradient">
            <component :is="category.icon" class="w-8 h-8 text-white" />
          </div>
          <h4 class="text-sm font-medium text-white">{{ category.name }}</h4>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-4 gap-4">
      <div 
        v-for="template in templates" 
        :key="template.id"
        class="template-card group"
        @click="selectTemplate(template)"
      >
        <div class="w-full h-32 bg-gradient-to-br rounded-lg mb-3 flex items-center justify-center"
             :class="template.preview">
          <div class="text-center text-white">
            <div class="text-xs font-bold mb-1">{{ template.title }}</div>
            <div class="text-xs opacity-75">{{ template.subtitle }}</div>
          </div>
        </div>
        <h4 class="text-sm font-medium text-white mb-1">{{ template.name }}</h4>
        <p class="text-xs text-gray-400">{{ template.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, h } from 'vue'
import { useSlidesStore } from '@/stores/slides'

const slidesStore = useSlidesStore()

const templateCategories = [
  {
    id: 'work',
    name: '工作汇报',
    icon: h('svg', { class: 'w-8 h-8', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' })
    ]),
    gradient: 'from-blue-500 to-blue-600'
  },
  {
    id: 'education',
    name: '教学分析',
    icon: h('svg', { class: 'w-8 h-8', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' })
    ]),
    gradient: 'from-green-500 to-green-600'
  },
  {
    id: 'tech',
    name: '视觉艺术',
    icon: h('svg', { class: 'w-8 h-8', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4 4 4 0 004-4V5z' })
    ]),
    gradient: 'from-purple-500 to-purple-600'
  },
  {
    id: 'marketing',
    name: '现代科技',
    icon: h('svg', { class: 'w-8 h-8', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' })
    ]),
    gradient: 'from-orange-500 to-orange-600'
  },
  {
    id: 'personal',
    name: '个人生活',
    icon: h('svg', { class: 'w-8 h-8', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' })
    ]),
    gradient: 'from-pink-500 to-pink-600'
  }
]

const templates = [
  {
    id: 'project-summary',
    name: '一元二次方程学习',
    description: '交互网站制作',
    title: 'PROJECT',
    subtitle: 'SUMMARY',
    preview: 'from-blue-400 to-blue-600',
    slides: [
      {
        layout: 'title',
        title: '一元二次方程学习交互网站',
        content: '创新教学方法与实践应用'
      },
      {
        layout: 'title+bullets',
        title: '项目概述与执行过程',
        bullets: ['01项目概述与执行过程', '02核心成果展示', '03问题反思与改进', '04未来规划与展望']
      }
    ]
  },
  {
    id: 'quarterly-review',
    name: '四年级运算律复习',
    description: '网页',
    title: 'Q4',
    subtitle: 'REVIEW',
    preview: 'from-green-400 to-green-600',
    slides: [
      {
        layout: 'title',
        title: '四年级运算律复习网页',
        content: '系统化复习与巩固练习'
      }
    ]
  },
  {
    id: 'research-report',
    name: '研究教师备课资源',
    description: '整合网页',
    title: 'RESEARCH',
    subtitle: 'REPORT',
    preview: 'from-purple-400 to-purple-600',
    slides: [
      {
        layout: 'title',
        title: '研究教师备课资源整合',
        content: '提升教学效率的数字化解决方案'
      }
    ]
  }
]

const selectCategory = (categoryId: string) => {
  console.log('Selected category:', categoryId)
}

const selectTemplate = (template: any) => {
  // 应用模板到当前演示文稿
  template.slides.forEach((slideData: any) => {
    const action = {
      action: 'add_slide' as const,
      layout: slideData.layout,
      title: slideData.title,
      bullets: slideData.bullets,
      content: slideData.content
    }
    slidesStore.executeSlideAction(action)
  })
  
  slidesStore.addChatMessage('ai', `已应用"${template.name}"模板，为您生成了${template.slides.length}张幻灯片。`)
}
</script>
