<template>
    <div class="app">
        <AudioCon v-bind="current" @onEnd="handleEnd" />
        <div class="search">
            <div class="s-con">
                <div class="s-icon-b">
                    <img class="s-icon" @click="handleSearch" src="./assets/svg/search.svg" alt="">
                </div>
                <input v-model="searchText" class="s-input" placeholder="请输入歌名或歌手名" type="text">
            </div>
        </div>
        <div class="typeb">
            <span v-for="(text, i) in ['好歌', 'Tiktok', '站外']" :class="{ act: i === typeI }" @click="handleTypeClick(i)" :key="i">{{ text }}</span>
        </div>
        <div class="loading">{{ loading ? '加载中...' : '' }}</div>
        <div class="list" v-show="[0, 1].includes(typeI)">
            <div v-for="(item, i) in searchList" :key="i" class="listI" :class="{ isSelected: item.name === current?.name }">
                <span class="name">{{ i + 1 }}、{{ item.name }}</span>
                <img @click="handleClick(item)" class="listIcon" src="./assets/svg/play.svg" alt="">
            </div>
        </div>
        <div v-show="typeI === 2" class="three">
            <div>
                <div v-for="(item, i) in wangyiList" :key="item.id ?? i" class="s-list">
                    <div class="s-list-msg">
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
    if (typeI.value === 2) return []
    return list.value.map(o => {
        if (searchText.value && o.name.indexOf(searchText.value) === -1) {
            return null
        } else {
            return o
        }
    }).filter(j => j)
})

const getList = async () => {
    list.value = []
    loading.value = true
    const { res } = await GET(`/api/music/list?type=${typeI.value}`)
    loading.value = false
    if (res) {
        list.value = res.map(o => ({ ...o, url: baseURL + o.url }))
    }
}

const handleTypeClick = i => {
    searchText.value = ''
    typeI.value = i
    i !== 2 && getList()
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
    if (typeI.value === 2) return
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
        border: 1px solid var(--theme-color);
        border-radius: 5px;
        padding: 4px 4px 4px 8px;
        .s-con {
            display: flex;
        }
        .s-icon-b {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 26px;
            height: 26px;
            background-color: var(--theme-color);
            margin-right: 8px;
            border-radius: 100%;
        }
        .s-icon {
            width: 14px;
            cursor: pointer;
            color: var(--theme-color);
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
            border: 1px solid var(--theme-color);
            padding: 2px 8px;
            border-radius: 5px;
            cursor: pointer;
            margin-right: 5px;
            &.act {
                background: var(--theme-color);
                color: #fff;
            }
        }
    }
    .loading {
        text-align: center;
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
            background: var(--theme-color);
            display: inline-block;
            border-radius: 4px;
            cursor: pointer;
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
            border-bottom: 1px solid var(--theme-color);
            padding: 8px 12px;
            .s-list-msg {
                flex: 1;
            }
        }
    }
    .list {
        
        .listI {
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid var(--theme-color);
            padding: 8px 10px;
            transition: all 0.5s;
            &:hover {
                box-shadow: 0 0 10px var(--theme-color);
            }
            &.isSelected {
                background-color: var(--selected-color);
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