<template>
    <div class="app">
        <AudioCon v-bind="current" @onEnd="handleEnd" />
        <div class="search">
            <div class="s-con">
                <img class="s-icon" @click="handleSearch" src="./assets/svg/search.svg" alt="">
                <input v-model="searchText" class="s-input" placeholder="请输入歌名或歌手名" type="text">
            </div>
        </div>
        <div class="typeb">
            <span v-for="(text, i) in ['站内', '站外']" :class="{ act: i === typeI }" @click="handleTypeClick(i)" :key="i">{{ text }}</span>
        </div>
        <div class="list" v-show="typeI === 0">
            <div v-for="(item, i) in searchList" :key="i" class="listI" :class="{ isSelected: item.name === current?.name }">
                <span class="name">{{ i + 1 }}、{{ item.name }}</span>
                <img @click="handleClick(item)" class="listIcon" src="./assets/svg/play.svg" alt="">
            </div>
        </div>
        <div v-show="typeI === 1" class="three">
            <div>{{ loading ? '数据加载中...' : '' }}</div>
            <div>
                <div v-for="(item, i) in wangyiList" :key="item.id ?? i" class="s-list">
                    <div>
                        <div>歌名：{{ item.name }} ({{ timeFn(item.duration) }})</div>
                        <div>
                            <span>歌手：{{ item.artists.map(o => o.name).join('、') }}</span>
                        </div>
                    </div>
                    <div class="play-btn" @click="handlePlay(item)">{{ item.fee === 1 ? '试听' : '播放' }}</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { GET, baseURL } from './api/request'
import { computed, onMounted, ref } from 'vue'
import AudioCon from './components/AudioCon.vue'

const list = ref<any[]>([])
const typeI = ref(0)
const searchText = ref('')
const wangyiList = ref<any[]>([])
const loading = ref(false)

const current = ref<any>()
const searchList = computed(() => {
    if (typeI.value === 1) return []
    return list.value.map(o => {
        if (searchText.value && o.name.indexOf(searchText.value) === -1) {
            return null
        } else {
            return o
        }
    }).filter(j => j)
})

const getList = async () => {
    const { res } = await GET('/api/mp3/list')
    if (res) {
        list.value = res.map(o => ({ ...o, url: baseURL + o.url }))
    }
}

const handleTypeClick = i => {
    typeI.value = i
}

const handlePlay = async ({ id, name }) => {
    const { res } = await GET(`/api/threedetail?id=${id}`)
    if (res) {
        current.value = { name, url: res[0].url }
    }
}

const timeFn = num => {
    const n = Math.round(num / 1000)
    const s = n % 60
    const sec = s > 10 ? s : `0${s}`
    return `${Math.floor(n / 60)}分${sec}秒`
}

const handleSearch = async () => {
    const name = searchText.value
    loading.value = true
    const { res } = await GET(`/api/threelist?keywords=${name}`)
    loading.value = false
    if (res) {
        wangyiList.value = res.songs.map(o => ({
            ...o,
            name: `${o.name}${o.fee === 1 ? '【试听】' : ''}`
        }))
    }
}

const handleClick = i => {
    current.value = i
}

const handleEnd = () => {
    const list = searchList.value
    if (typeI.value === 1) return
    let i = list.map(o => o?.name).indexOf(current.value?.name)
    if (i >= list.length || i === -1) {
        i = 0
    } else {
        i += 1
    }
    current.value = list[i]
}

onMounted(() => {
    getList()
})
</script>
<style lang="scss" scoped>
.app {
    max-width: 750px;
    padding-top: 80px;
    margin: 0 auto;
    font-size: 14px;
    .search {
        border: 1px solid orange;
        border-radius: 5px;
        padding: 2px 2px 2px 10px;
        .s-con {
            display: flex;
        }
        .s-icon {
            width: 32px;
            margin-right: 8px;
            cursor: pointer;
        }
        .s-input {
            flex: 1;
            border: none;
        }
    }
    .typeb {
        span {
            display: inline-block;
            margin: 5px 0;
            border: 1px solid orange;
            padding: 2px 8px;
            border-radius: 5px;
            cursor: pointer;
            &:first-child {
                margin-right: 5px;
            }
            &.act {
                background: orange;
                color: #fff;
            }
        }
    }
    .three {
        margin-top: 20px;
        > img {
            width: 200px;
        }
        .play-btn {
            width: 48px;
            height: 24px;
            line-height: 24px;
            text-align: center;
            color: #fff;
            background: orange;
            display: inline-block;
            border-radius: 4px;
            cursor: pointer;
            margin: 4px 0;
            &.gray {
                background: #ddd;
            }
        }
        .mv {
            .video {
                width: 100%;
            }
        }
        .s-list {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid orange;
            padding: 8px 12px;
        }
    }
    .list {
        
        .listI {
            display: flex;
            align-items: center;
            justify-content: space-between;
            border: 1px solid orange;
            border-radius: 5px;
            margin: 10px 0;
            padding: 5px 10px;
            transition: all 0.5s;
            &:hover {
                box-shadow: 0 0 10px orange;
            }
            &.isSelected {
                background-color: rgba(255, 150, 50, .2);
            }
            .name {
                font-size: 14px;
            }
            .listIcon {
                width: 25px;
                cursor: pointer;
            }
        }
    }
}
</style>./public/mp3/list