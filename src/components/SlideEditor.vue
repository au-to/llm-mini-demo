<template>
  <div v-if="isEditing" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="closeEditor">
    <div class="bg-gray-800 rounded-xl p-6 w-full max-w-2xl mx-4" @click.stop>
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-semibold text-white">编辑幻灯片</h3>
        <button @click="closeEditor" class="toolbar-btn">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <div class="space-y-4">
        <!-- 布局选择 -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">布局类型</label>
          <div class="grid grid-cols-4 gap-2">
            <button
              v-for="layout in layoutOptions"
              :key="layout.value"
              @click="editData.layout = layout.value"
              class="p-3 rounded-lg border-2 transition-all duration-200 text-center"
              :class="{
                'border-blue-500 bg-blue-500/20': editData.layout === layout.value,
                'border-gray-600 bg-gray-700 hover:border-gray-500': editData.layout !== layout.value
              }"
            >
              <component :is="layout.icon" class="w-6 h-6 mx-auto mb-1 text-gray-300" />
              <div class="text-xs text-gray-300">{{ layout.label }}</div>
            </button>
          </div>
        </div>

        <!-- 标题编辑 -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">标题</label>
          <input
            v-model="editData.title"
            type="text"
            class="input-field w-full"
            placeholder="输入幻灯片标题..."
          />
        </div>

        <!-- 内容编辑 -->
        <div v-if="editData.layout === 'title' || editData.layout === 'image+text'">
          <label class="block text-sm font-medium text-gray-300 mb-2">内容</label>
          <textarea
            v-model="editData.content"
            rows="4"
            class="input-field w-full resize-none"
            placeholder="输入幻灯片内容..."
          ></textarea>
        </div>

        <!-- 要点编辑 -->
        <div v-if="editData.layout === 'title+bullets'">
          <label class="block text-sm font-medium text-gray-300 mb-2">要点列表</label>
          <div class="space-y-2">
            <div
              v-for="(bullet, index) in editData.bullets"
              :key="index"
              class="flex items-center space-x-2"
            >
              <input
                v-model="editData.bullets[index]"
                type="text"
                class="input-field flex-1"
                :placeholder="`要点 ${index + 1}...`"
              />
              <button
                @click="removeBullet(index)"
                class="toolbar-btn text-red-400 hover:text-red-300"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>
            <button
              @click="addBullet"
              class="w-full p-2 border-2 border-dashed border-gray-600 rounded-lg text-gray-400 hover:border-gray-500 hover:text-gray-300 transition-colors duration-200"
            >
              + 添加要点
            </button>
          </div>
        </div>

        <!-- 图片设置 -->
        <div v-if="editData.layout === 'image+text' || editData.layout === 'full-image'">
          <label class="block text-sm font-medium text-gray-300 mb-2">图片描述</label>
          <input
            v-model="editData.imagePrompt"
            type="text"
            class="input-field w-full"
            placeholder="描述您需要的图片内容..."
          />
          <button
            @click="generateImage"
            class="mt-2 btn-secondary text-sm"
          >
            生成图片
          </button>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="flex items-center justify-end space-x-3 mt-6 pt-6 border-t border-gray-700">
        <button @click="closeEditor" class="btn-secondary">
          取消
        </button>
        <button @click="saveChanges" class="btn-primary">
          保存更改
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, h } from 'vue'
import { useSlidesStore } from '@/stores/slides'
import type { Slide } from '@/types'

const props = defineProps<{
  isEditing: boolean
  slide: Slide | null
}>()

const emit = defineEmits<{
  close: []
}>()

const slidesStore = useSlidesStore()

const editData = ref<Partial<Slide>>({
  layout: 'title+bullets',
  title: '',
  content: '',
  bullets: [''],
  imagePrompt: ''
})

const layoutOptions = [
  {
    value: 'title',
    label: '标题页',
    icon: h('svg', { class: 'w-6 h-6', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M4 6h16M4 12h16M4 18h7' })
    ])
  },
  {
    value: 'title+bullets',
    label: '要点列表',
    icon: h('svg', { class: 'w-6 h-6', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M4 6h16M4 10h16M4 14h16M4 18h16' })
    ])
  },
  {
    value: 'image+text',
    label: '图文混排',
    icon: h('svg', { class: 'w-6 h-6', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' })
    ])
  },
  {
    value: 'full-image',
    label: '全屏图片',
    icon: h('svg', { class: 'w-6 h-6', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' })
    ])
  }
]

// 监听编辑状态变化
watch(() => props.isEditing, (newVal) => {
  if (newVal && props.slide) {
    editData.value = {
      layout: props.slide.layout,
      title: props.slide.title || '',
      content: props.slide.content || '',
      bullets: props.slide.bullets?.length ? [...props.slide.bullets] : [''],
      imagePrompt: props.slide.imagePrompt || ''
    }
  }
})

const addBullet = () => {
  if (!editData.value.bullets) editData.value.bullets = []
  editData.value.bullets.push('')
}

const removeBullet = (index: number) => {
  if (editData.value.bullets && editData.value.bullets.length > 1) {
    editData.value.bullets.splice(index, 1)
  }
}

const generateImage = () => {
  if (editData.value.imagePrompt) {
    // 模拟图片生成
    const imageUrl = `https://picsum.photos/800/600?random=${Math.random()}`
    editData.value.image = imageUrl
  }
}

const saveChanges = () => {
  if (!props.slide) return

  // 清理空的要点
  if (editData.value.bullets) {
    editData.value.bullets = editData.value.bullets.filter(bullet => bullet.trim())
  }

  // 更新幻灯片数据
  const slideIndex = slidesStore.slides.findIndex(s => s.id === props.slide!.id)
  if (slideIndex !== -1) {
    Object.assign(slidesStore.slides[slideIndex], editData.value)
  }

  slidesStore.addChatMessage('ai', `已更新幻灯片"${editData.value.title}"的内容。`)
  closeEditor()
}

const closeEditor = () => {
  emit('close')
}
</script>
