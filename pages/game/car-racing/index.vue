<template>
    <div class="main-div-car-racing">
        <canvas id="canvas" class="wrbgl"></canvas>

        <div class="top-items">
            <button :disabled="isShowGuidMenu"
                :class="`pause-btn ${stepGuidMenu == `pause` || !isShowGuidMenu ? `` : `fade`}`"
                @click="setPlayingStatus(false)">
                <v-icon class="highligth" large color="white">
                    mdi-pause
                </v-icon>

                <div class="description-guid" v-if="stepGuidMenu == `pause`">
                    You Can Stop The Game

                    <button class="btn-next-guid btn" @click="changeStepGuid($event, `questionBox`)">Next</button>
                </div>
            </button>
            <div
                :class="['question-box', questionStatus, stepGuidMenu == `questionBox` || !isShowGuidMenu ? `` : `fade`]">
                {{ questions[currentQuestionIndex].text }}

                <div class="description-guid" v-if="stepGuidMenu == `questionBox`">
                    You Can See The Current Question

                    <button class="btn-next-guid btn" @click="changeStepGuid($event, `timerScore`)">Next</button>
                </div>
            </div>

            <div :class="`container-timer-score ${stepGuidMenu == `timerScore` || !isShowGuidMenu ? `` : `fade`}`">
                <div class="score-div">
                    <span class="score-text">{{ score }}</span>
                    <v-icon class="icon-score highligth" color="#ed8a19">
                        mdi-star
                    </v-icon>
                </div>
                <div :class="['timer-box', { 'danger': timerDanger }]">
                    {{ Math.ceil(timer) }}
                </div>
                <button :disabled="isShowGuidMenu" class="camera-btn btn" @click="changeCameraMode">
                    <v-icon class="highligth" large color="white" v-if="cameraMode == `default`">
                        mdi-webcam
                    </v-icon>

                    <v-icon class="highligth" large color="white" v-if="cameraMode == `close`">
                        mdi-camera
                    </v-icon>
                </button>


                <div class="description-guid score-time" v-if="stepGuidMenu == `timerScore`">
                    You Can See The Remainin time , Score and changing Mode Camera.

                    <button class="btn-next-guid btn" @click="changeStepGuid($event, `play`)">Next</button>
                </div>
            </div>

        </div>

        <div :class="`overlay-pause ${isShowGuidMenu ? `zindex-less` : ``}`"
            v-if="!isPlayingGame && resultGame == `pending`">
            <button :disabled="isShowGuidMenu"
                :class="`play-btn btn ${stepGuidMenu == `play` || !isShowGuidMenu ? `` : `fade`}`"
                @click="setPlayingStatus(true)">
                <v-icon class="highligth" large color="white">
                    mdi-play
                </v-icon>
            </button>

            <div class="description-guid play-game" v-if="stepGuidMenu == `play`">
                You Can see Play the game

                <button class="btn-next-guid btn" @click="changeStepGuid($event, `ChangeLaneBtn`)">Next</button>
            </div>
        </div>

        <div class="overlay-result-game" v-if="resultGame != `pending`">
            <div :class="`modal-status ${resultGame}-modal`">
                <span :class="`status-text ${resultGame}-text`">
                    {{ resultGame == "failed" ? "Game Over!" : "Great!" }}
                </span>

                <button class="reset-btn btn" @click="resetGame">
                    <v-icon class="highligth" large color="white">
                        mdi-refresh
                    </v-icon>
                </button>
            </div>
        </div>


        <div class="overlay-loading" v-if="isLoading">
            Loading ...
        </div>

        <div class="counter-container" v-if="showCounterFirstPlay">
            <transition name="zoom-fade" @after-enter="nextCount">
                <div class="counter-number" v-if="currentCountFirstPlay !== 0" :key="currentCountFirstPlay">
                    {{ currentCountFirstPlay }}
                </div>
            </transition>
        </div>

        <div :class="`buttons-div ${stepGuidMenu == `ChangeLaneBtn` || !isShowGuidMenu ? `` : `fade`}`">
            <button :disabled="isShowGuidMenu" @click="changeLane(-1)" class="change-lane-btn btn">
                <v-icon class="highligth" large color="white">
                    mdi-arrow-left-bold
                </v-icon>
            </button>
            <button :disabled="isShowGuidMenu" @click="changeLane(1)" class="change-lane-btn btn">
                <v-icon class="highligth" large color="white">
                    mdi-arrow-right-bold
                </v-icon>
            </button>

            <div class="description-guid guid-btn-change-lane" v-if="stepGuidMenu == `ChangeLaneBtn`">
                You Can Change Lane the car

                <button class="btn-next-guid btn" @click="changeStepGuid($event, `Finish`)">Finish</button>
            </div>
        </div>
    </div>
</template>


<script>
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
                    choices: ["72", "35", "12", "64"],
                    indexAnswer: 0
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
            timer: 40,
            timerDanger: false,
            isPlayingGame: false,
            score: 0,
            resultGame: 'pending',
            isLoading: true,
            currentCountFirstPlay: 3,
            showCounterFirstPlay: false,
            isFirstTimePlayingGame: true,
            cameraMode: 'default',
            isShowGuidMenu: false,
            stepGuidMenu: "Finish",
            isUpdateTimer: true,
        };
    },
    mounted() {
        const hasSeenGuide = localStorage.getItem('hasSeenGuideMenu')
        if (!hasSeenGuide) {
            this.stepGuidMenu = "pause"
            this.isShowGuidMenu = true
            localStorage.setItem('hasSeenGuideMenu', 'true')
        }
        import('@/threeJsExperience/car-racing/Experience.js').then((module) => {
            const Experience = module.default;
            this.experience = new Experience(document.getElementById("canvas"), this.questions, {
                onQuestionChange: this.onQuestionChange,
                onQuestionStatusChange: (status) => this.onQuestionStatusChange(status),
                onTimerUpdate: (delta) => this.onTimerUpdate(delta),
                onScoreChange: (bonus) => this.onScoreChange(bonus),
                onResultGameChange: (result) => this.onResultGameChange(result),
                onChangeSceneReady: this.onChangeSceneReady,
                onChangeIsUpdateTimer: (state) => this.onChangeIsUpdateTimer(state),
            });
        });
    },
    destroyed() {
        this.experience.destroy()
        this.experience = null
    },
    methods: {
        onChangeSceneReady() {
            this.isLoading = false
        },
        changeStepGuid(event, step) {
            event.stopImmediatePropagation()
            this.stepGuidMenu = step
            if (step == "Finish") {
                this.isShowGuidMenu = false
            }
        },
        changeLane(direction) {
            this.experience.changeLane(direction)
        },

        setPlayingStatus(status) {
            if (this.isFirstTimePlayingGame) {
                this.isFirstTimePlayingGame = false
                this.showCounterFirstPlay = true
                this.nextCount()
                this.isPlayingGame = status

                setTimeout(() => {
                    this.experience.setPlayingStatus(status)
                }, 3000);
            } else {
                this.isPlayingGame = status
                this.experience.setPlayingStatus(status)
            }
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
        onChangeIsUpdateTimer(state) {
            this.isUpdateTimer = state
        },
        onTimerUpdate(delta) {
            if (this.timer > 0) {
                if (this.isUpdateTimer) {
                    this.timer -= delta;

                    if (this.timer <= 10 && !this.timerDanger) {
                        this.timerDanger = true;
                    }
                }
            } else {
                this.timer = 0;
                this.timerDanger = false

                this.setPlayingStatus(false)
                this.resultGame = "failed"
            }
        },
        onScoreChange(bonus) {
            this.score += bonus
        },
        onResultGameChange(result) {
            if (result.status == "success") {
                this.setPlayingStatus(false)
                this.resultGame = "success"
            }
        },
        resetGame() {
            this.isUpdateTimer = true
            this.isLoading = true
            this.experience.resetGame()
            this.currentQuestionIndex = 0
            this.timer = 40
            this.questionStatus = "normal"
            this.timerDanger = false
            this.score = 0
            this.resultGame = 'pending'
            this.setPlayingStatus(true)
            this.currentCountFirstPlay = 3

            setTimeout(() => {
                this.setPlayingStatus(false)
                this.isLoading = false
                this.isFirstTimePlayingGame = true
            }, 1000);
        },

        nextCount() {
            if (this.currentCountFirstPlay > 1) {
                setTimeout(() => {
                    this.currentCountFirstPlay--;
                }, 500);
            } else {
                setTimeout(() => {
                    this.currentCountFirstPlay = 0;
                    this.showCounterFirstPlay = false;
                }, 500);
            }
        },
        changeCameraMode() {
            if (this.cameraMode == "default") {
                this.experience.changeCameraMode("close")
                this.cameraMode = "close"
            } else {
                this.experience.changeCameraMode("default")
                this.cameraMode = "default"
            }
        }

    }
};
</script>


<style scoped>
.main-div-car-racing {
    width: 100%;
    height: 100vh;
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
    position: relative;
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



.container-timer-score {
    display: flex;
    align-items: center;
    justify-content: center;
    column-gap: 6px;
    position: relative;
}

/* score section */
.score-div {
    width: 70px;
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;

}

.score-text {
    font-size: 24px;
    font-weight: 800;
    color: white;
    position: absolute;
    transform: translate(-2px, 2px);
    z-index: 2;
}

.icon-score {
    font-size: 86px;
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


/* mode camera */
.camera-btn {
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
    border: none;
    outline: none;
    -webkit-tap-highlight-color: transparent;
    -webkit-user-select: none;
    /* Safari */
    -ms-user-select: none;
    /* IE 10 and IE 11 */
    user-select: none;
    /* Standard syntax */
    border: none;
}

.btn {
    -webkit-tap-highlight-color: transparent;
    -webkit-user-select: none;
    /* Safari */
    -ms-user-select: none;
    /* IE 10 and IE 11 */
    user-select: none;
    /* Standard syntax */
    border: none;
    border: none;
    outline: none;
}

.btn:active {
    transform: scale(0.9);
}

/* overlay menu  */
.overlay-pause {
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

.zindex-less {
    z-index: 2;
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

.highligth {
    -webkit-tap-highlight-color: transparent;
    -webkit-user-select: none;
    /* Safari */
    -ms-user-select: none;
    /* IE 10 and IE 11 */
    user-select: none;
    /* Standard syntax */
}



/* overlay result game */
.overlay-result-game {
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

.modal-status {
    width: 90%;
    max-width: 260px;
    height: 90%;
    max-height: 260px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    row-gap: 10px;
    background-color: white;
    border-radius: 16px;
}

.failed-modal {
    border: 4px solid red;
}

.success-modal {
    border: 4px solid rgb(88, 233, 88);
}

.status-text {
    font-size: 24px;
    font-weight: bold;
}

.failed-text {
    color: red;
}

.success-text {
    color: rgb(88, 233, 88);
}

.reset-btn {
    background: linear-gradient(135deg, #ffeaa7, #ff8400);
    border-radius: 50%;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.5s;
}


/* overlay loading */
.overlay-loading {
    position: absolute;
    z-index: 4;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: black;
    font-weight: bold;
    color: white;
    font-size: 30px;
    transition: all 0.5s;
}


/* counter start */
.counter-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100%;
    z-index: 4;
}

.counter-number {
    font-size: 10rem;
    color: #ff3c00;
    font-weight: bold;
}

.zoom-fade-enter-active {
    animation: zoomFade 0.5s ease;
}

.zoom-fade-leave-active {
    opacity: 0;
}

@keyframes zoomFade {
    0% {
        transform: scale(0.5);
        opacity: 0;
    }

    50% {
        transform: scale(1.2);
        opacity: 1;
    }

    100% {
        transform: scale(1);
        opacity: 1;
    }
}



/* guid overlay */
.guid-overlay {
    position: absolute;
    z-index: 4;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}

.fade {
    opacity: 0.5;
}

.description-guid {
    border-radius: 12px;
    background-color: white;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    flex-direction: column;
    font-size: 16px;
    font-weight: bold;
    color: black;
    position: absolute;
    top: 100px;
    padding: 10px;
    left: 40px;
    row-gap: 20px;
    z-index: 10;
}

.btn-next-guid {
    width: 80px;
    height: 30px;
    background-color: #ff9e00;
    border: none;
    font-size: 14px;
    font-weight: bold;
    color: white;
    cursor: pointer;
    border-radius: 10px;
}

.play-game {
    top: unset;
    left: unset;
    transform: translateY(100px);
}

.guid-btn-change-lane {
    top: unset;
    left: unset;
    transform: translateY(-100px);
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

    .camera-btn {
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

    .container-timer-score {
        column-gap: 6px;
        flex-direction: column;
        row-gap: 10px;
    }

    .top-items {
        align-items: flex-start;
    }

    .score-time {
        left: -100px;
        top: 220px;
    }

    .buttons-div {
        bottom: 60px;
    }
}
</style>