<template>
    <div class="aucon-b">
        <div class="aucon">
            <div class="name">{{ props.name ?? '--' }}</div>
            <div class="pro">
                <div class="progress">
                    <div class="progressIn" :style="{ width: `${proW}%` }"></div>
                </div>
                <div class="time">{{ nowTime }}/{{ allTime }}</div>
            </div>
            <div @click="handleClick" class="icon">
                <img v-if="isPlaying" class="playicon" src="../assets/svg/pause.svg" alt="">
                <img v-else class="playicon" src="../assets/svg/play.svg" alt="">
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { watch, ref, onMounted } from 'vue'

const props = defineProps({
    url: { type: String },
    name: { type: String }
})

const emits = defineEmits(['onEnd'])

const audio = ref<any>(null)
const isPlaying = ref(false)
const nowTime = ref('0:00')
const allTime = ref('0:00')
const proW = ref(0)

const timeFn = num => {
    const n = Math.round(num)
    const s = n % 60
    const sec = s > 10 ? s : `0${s}`
    return `${Math.floor(n / 60)}:${sec}`
}

const onEvent = (name, fn) => {
    audio.value.addEventListener(name, fn, false)
}

const handleClick = () => {
    isPlaying.value ? audio.value.pause() : audio.value.play()
}

const init = () => {
    const { url } = props
    if (!url) return
    if (audio.value) {
        audio.value.setAttribute('src', url)
        audio.value.load()
    } else {
        audio.value = new Audio(url)
        onEvent('play', () => {
            isPlaying.value = true
            console.log('play -----')
        })

        onEvent('pause', () => {
            isPlaying.value = false
            console.log('pause -----')
        })

        onEvent('waiting', () => {
            // isPlaying.value = false
            console.log('waiting -----')
        })

        onEvent('ended', () => {
            // isPlaying.value = false
            emits('onEnd')
            console.log('ended -----')
        })

        onEvent('timeupdate', () => {
            const { currentTime, duration } = audio.value
            const pasent = currentTime / duration * 100
            proW.value = pasent
            nowTime.value = timeFn(currentTime)
            // console.log('timeupdate -----')
        })

        onEvent('durationchange', () => {
            allTime.value = timeFn(audio.value.duration)
            console.log('durationchange -----')
        })
    }
}

onMounted(() => init())

watch(props, () => {
    if (props.url) {
        init()
        audio.value.play()
    }
})

</script>

<style scoped lang="scss">
.aucon-b {
    position: fixed;
    top: 0;
    left: 0;
    width: 94%;
    background-color: #fff;
    padding: 0 3%;
}
.aucon {
    max-width: 750px;
    margin: 10px auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 10px;
    border-radius: 8px;
    transition: all 0.5s;
    box-shadow: 0 0 10px var(--theme-color);
    .name {
        width: 40%;
        font-size: 14px;
    }
    .pro {
        width: 50%;
    }
    .playicon {
        width: 30px;
    }
    .progress {
        overflow: hidden;
        position: relative;
        width: 80%;
        height: 8px;
        border-radius: 8px;
        background-color: #ddd;
    }
    .progressIn {
        position: absolute;
        height: 8px;
        border-radius: 8px;
        background: linear-gradient(to bottom right, pink, var(--theme-color));
    }
    .time {
        font-size: 12px;
        margin-top: 5px;
    }
    .icon {
        width: 10%;
        text-align: right;
        cursor: pointer;
    }
}
</style>