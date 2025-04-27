<template>
    <div class="main-div-car-racing">
        <canvas id="canvas" class="wrbgl"></canvas>

        <div class="top-items">
            <button class="pause-btn btn" @click="setPlayingStatus(false)">
                <img class="icon-pause highligth" src="@/assets/images/pause-icon.svg" alt="Pause">
            </button>
            <div :class="['question-box', questionStatus]">
                {{ questions[currentQuestionIndex].text }}
            </div>

            <div :class="['timer-box', { 'danger': timerDanger }]">
                {{ Math.ceil(timer) }}
            </div>
        </div>

        <div class="overlay-loading-pause" v-if="!isPlayingGame">
            <button class="play-btn btn" @click="setPlayingStatus(true)">
                <img class="icon-play highligth" src="@/assets/images/play-icon.svg" alt="Play">
            </button>
        </div>

        <div class="buttons-div">
            <button @click="changeLane(-1)" class="change-lane-btn btn">
                <img class="icon-play highligth" src="@/assets/images/left-arrow-icon.svg" alt="Left Arrow">
            </button>
            <button @click="changeLane(1)" class="change-lane-btn btn">
                <img class="icon-play highligth" src="@/assets/images/right-arrow-icon.svg" alt="Right Arrow">
            </button>
        </div>
    </div>
</template>


<script>
import Experience from "@/threeJsExperience/car-racing/Experience.js";


export default {
    auth: false,
    data() {
        return {
            experience: null,
            questionStatus: 'normal',
            questions: [
                {
                    text: "10 - 2 =",
                    choices: ["4", "22", "45", "8"],
                    indexAnswer: 3
                },
                {
                    text: "22 * 2 =",
                    choices: ["4", "44", "81", "95"],
                    indexAnswer: 1
                },
                {
                    text: "1 + 1 =",
                    choices: ["2", "15", "56", "64"],
                    indexAnswer: 0
                },
                {
                    text: "9 * 8 =",
                    choices: ["21", "35", "72", "64"],
                    indexAnswer: 2
                },
                // {
                //     text: "6 * 5 =",
                //     choices: ["20", "30", "44", "81"],
                //     indexAnswer: 1
                // },
                // {
                //     text: "10 / 2 =",
                //     choices: ["5", "11", "1", "0"],
                //     indexAnswer: 0
                // },
                // {
                //     text: "1 + 11 =",
                //     choices: ["28", "17", "22", "64"],
                //     indexAnswer: 2
                // },
                // {
                //     text: "9 * 8 =",
                //     choices: ["21", "35", "72", "64"],
                //     indexAnswer: 2
                // },
            ],
            currentQuestionIndex: 0,
            timer: 30,
            timerDanger: false,
            isPlayingGame: false
        };
    },
    mounted() {
        this.experience = new Experience(document.getElementById("canvas"), this.questions,
            {
                onQuestionChange: this.onQuestionChange,
                onQuestionStatusChange: (status) => this.onQuestionStatusChange(status),
                onTimerUpdate: (delta) => this.onTimerUpdate(delta)
            }
        )
    },
    onUnmounted() {
        this.experience.destroy()
    },
    methods: {
        changeLane(direction) {
            this.experience.changeLane(direction)
        },

        setPlayingStatus(status) {
            this.isPlayingGame = status
            this.experience.setPlayingStatus(status)
        },
        onQuestionChange() {
            if (this.currentQuestionIndex < this.questions.length - 1) {
                this.currentQuestionIndex += 1
            }
        },
        onQuestionStatusChange(status) {
            this.questionStatus = status
            setTimeout(() => {
                this.questionStatus = 'normal'
            }, 3000)
        },
        onTimerUpdate(delta) {
            if (this.timer > 0) {
                this.timer -= delta;

                if (this.timer <= 10 && !this.timerDanger) {
                    this.timerDanger = true;
                }
            } else {
                this.timer = 0;
                this.timerDanger = false
            }
        }
    }
};
</script>


<style scoped>
.main-div-car-racing {
    width: 100%;
    height: 100%;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
}

.wrbgl {
    position: absolute;
    top: 0;
    left: 0;
    outline: none;
    z-index: 2;
}


/* buttons change lane */
.buttons-div {
    display: flex;
    align-items: center;
    justify-content: center;
    column-gap: 30px;
    position: absolute;
    bottom: 20px;
    width: 100%;
    z-index: 3;
}

.change-lane-btn {
    background: linear-gradient(135deg, #ffeaa7, #ff8400);
    border-radius: 50%;
    width: 70px;
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.5s;
}

.change-lane-btn:active {
    transform: scale(0.96);
}


/* top items */
.top-items {
    position: absolute;
    z-index: 3;
    top: 120px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 0 20px;
}

/* question box section */
.question-box {
    padding: 15px 25px;
    border-radius: 20px;
    font-size: 40px;
    font-weight: bold;
    color: white;
    text-align: center;
    transition: all 0.3s ease;
    -webkit-text-stroke: 1px #ffffff;
}

.question-box.normal {
    background: linear-gradient(135deg, #7ed6df, #70a1ff);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
}

.question-box.success {
    background: linear-gradient(135deg, #55efc4, #00b894);
    box-shadow: 0 4px 15px rgba(0, 255, 100, 0.5);
    animation: successBounce 0.5s;
}

.question-box.error {
    background: linear-gradient(135deg, #ff6b6b, #ff4757);
    box-shadow: 0 4px 15px rgba(255, 0, 0, 0.5);
    animation: shake 0.4s;
}

@keyframes successBounce {
    0% {
        transform: translateX(-50%) scale(1);
    }

    50% {
        transform: translateX(-50%) scale(1.1);
    }

    100% {
        transform: translateX(-50%) scale(1);
    }
}

@keyframes shake {

    0%,
    100% {
        transform: translateX(-50%) translateX(0);
    }

    20%,
    60% {
        transform: translateX(-50%) translateX(-10px);
    }

    40%,
    80% {
        transform: translateX(-50%) translateX(10px);
    }
}


/* timer section */
.timer-box {
    background: linear-gradient(135deg, #ffeaa7, #ff8400);
    border-radius: 50%;
    width: 70px;
    height: 70px;
    font-size: 24px;
    font-weight: 800;
    color: white;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
}

.timer-box.danger {
    background: linear-gradient(135deg, #ff6b6b, #ff4757);
    color: white;
    animation: blink 1s infinite;
}

@keyframes blink {
    0% {
        opacity: 1;
    }

    50% {
        opacity: 0.4;
    }

    100% {
        opacity: 1;
    }
}



/* pause icon */
.pause-btn {
    background: linear-gradient(135deg, #ffeaa7, #ff8400);
    border-radius: 50%;
    width: 70px;
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.5s;
}

.btn:active {
    transform: scale(0.9);
}

.icon-pause {
    width: 50%;
    height: 50%;
    filter: brightness(0) saturate(100%) invert(100%) sepia(99%) saturate(3%) hue-rotate(24deg) brightness(106%) contrast(100%);
}


/* overlay menu , laading */
.overlay-loading-pause {
    position: absolute;
    z-index: 4;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgb(0 0 0 / 64%);
}

.play-btn {
    background: linear-gradient(135deg, #ffeaa7, #ff8400);
    border-radius: 50%;
    width: 70px;
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.5s;
}


.icon-play {
    width: 50%;
    height: 50%;
    filter: brightness(0) saturate(100%) invert(100%) sepia(99%) saturate(3%) hue-rotate(24deg) brightness(106%) contrast(100%);
}

.highligth {
    -webkit-tap-highlight-color: transparent;
    -webkit-user-select: none;
    /* Safari */
    -ms-user-select: none;
    /* IE 10 and IE 11 */
    user-select: none;
    /* Standard syntax */
}

/* responsive mobile */
@media screen and (max-width: 480px) {
    .change-lane-btn {
        width: 80px;
        height: 80px;
    }

    .play-btn {
        width: 60px;
        height: 60px;
    }

    .pause-btn {
        width: 60px;
        height: 60px;
    }

    .timer-box {
        width: 60px;
        height: 60px;
        font-size: 16px;
    }

    .question-box {
        padding: 10px 15px;
        font-size: 30px;
    }
}
</style>