<template>
    <div>
        <canvas id="canvas" class="wrbgl"></canvas>

        <div :class="['question-box', questionStatus]">
            {{ questions[currentQuestionIndex].text }}
        </div>

        <div :class="['timer-box', { 'danger': timerDanger }]">
            {{ Math.ceil(timer) }}
        </div>
        <div class="buttons-div">
            <button @click="turnLeft" class="change-lane-btn">
                Left
            </button>
            <button @click="turnRight" class="change-lane-btn">
                Right
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
                {
                    text: "6 * 5 =",
                    choices: ["20", "30", "44", "81"],
                    indexAnswer: 1
                },
                {
                    text: "10 / 2 =",
                    choices: ["5", "11", "1", "0"],
                    indexAnswer: 0
                },
                {
                    text: "1 + 11 =",
                    choices: ["28", "17", "22", "64"],
                    indexAnswer: 2
                },
                {
                    text: "9 * 8 =",
                    choices: ["21", "35", "72", "64"],
                    indexAnswer: 2
                },
            ],
            currentQuestionIndex: 0,
            timer: 30,
            timerDanger: false
        };
    },
    mounted() {
        this.experience = new Experience(document.getElementById("canvas"), this.questions,
            {
                onQuestionChange: () => {
                    if (this.currentQuestionIndex < this.questions.length - 1) {
                        this.currentQuestionIndex += 1
                    }
                },
                onQuestionStatusChange: (status) => {
                    this.questionStatus = status
                    setTimeout(() => {
                        this.questionStatus = 'normal'
                    }, 3000)
                },
                onTimerUpdate: (delta) => {
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
        )
    },
    onUnmounted() {
        this.experience.destroy()
    },
    methods: {
        turnRight() {
            this.experience.changeLane(1)
        },
        turnLeft() {
            this.experience.changeLane(-1)
        }
    }
};
</script>


<style scoped>
.wrbgl {
    position: absolute;
    top: 0;
    left: 0;
    outline: none;
    z-index: 2;
}

.buttons-div {
    display: flex;
    align-items: center;
    justify-content: center;
    column-gap: 10px;
    position: absolute;
    bottom: 20px;
    width: 100%;
    z-index: 2;
}

.change-lane-btn {
    width: 150px;
    height: 60px;
    border-radius: 6px;
    background-color: white;
    border: none;
    transition: 0.5s;
}

.change-lane-btn:active {
    transform: scale(0.96);
}


/* question box section */
.question-box {
    position: absolute;
    top: 120px;
    left: 50%;
    transform: translateX(-50%);
    padding: 15px 25px;
    border-radius: 20px;
    font-size: 40px;
    font-weight: bold;
    color: white;
    text-align: center;
    z-index: 3;
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
    position: absolute;
    top: 120px;
    right: 20px;
    z-index: 2;
    background: linear-gradient(135deg, #ffeaa7, #fab1a0);
    border-radius: 50%;
    width: 70px;
    height: 70px;
    font-size: 24px;
    font-weight: 800;
    color: #2d3436;
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
</style>