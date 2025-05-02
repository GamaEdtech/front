<template>
    <div class="math-modal">
        <v-card color="primary" rounded="lg">
            <v-card-title class="title">
                Math Problem 
                <v-icon class="close-icon" @click="closeModal">mdi-close</v-icon>
            </v-card-title>
            <v-card-title>

            </v-card-title>
            <v-card-subtitle class="font-weight-bold font-size-14" v-if="isMessageShow"
                :style="{ color: isCorrect ? 'green' : 'red' }">
                {{ isCorrect ? 'Correct' : 'Incorrect' }}
            </v-card-subtitle>
            <v-card-text>
                <p>Solve the following math problem:</p>
                <v-form>
                    <v-text-field v-model="problem" label="Problem" disabled required></v-text-field>
                    <v-text-field v-model="interedAnswer" label="Answer" required></v-text-field>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-btn variant="flat" color="white" class="mt-2 text-grey-darken-3 font-weight-bold"
                    @click="solveProblem">Solve</v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
// import { levels } from '@/store/doorMathProblem';
import type { Step } from "@/interfaces/levels.interface"
import { Levels } from "@/interfaces/levels.interface"


const props = defineProps<{
    nearDoor: "door001" | "door002" | "door003" | "door004" | null,
    level: number,
    step: number
}>()

const nearDoor = computed(() => props.nearDoor)
const level = computed(() => props.level)
const step = computed(() => props.step)
const stepKey = `step${step.value}` as keyof Step;
const levelKey = `level${level.value}` as keyof Step;


const levels = ref<Levels>({
    level1: {
        step1: {
            door001: { problem: "2 + 3", answer: `${2 + 3}` },
            door002: { problem: "5 + 7", answer: `${5 + 7}` },
            door003: { problem: "10 + 8", answer: `${10 + 8}` },
            door004: { problem: "4 + 6", answer: `${4 + 6}` }
        },
        step2: {
            door001: { problem: "10 - 3", answer: `${10 - 3}` },
            door002: { problem: "9 - 5", answer: `${9 - 5}` },
            door003: { problem: "15 - 6", answer: `${15 - 6}` },
            door004: { problem: "20 - 7", answer: `${20 - 7}` }
        },
        step3: {
            door001: { problem: "10 / 2", answer: `${10 / 2}` },
            door002: { problem: "18 / 3", answer: `${18 / 3}` },
            door003: { problem: "20 / 4", answer: `${20 / 4}` },
            door004: { problem: "16 / 2", answer: `${16 / 2}` }
        },
        step4: {
            door001: { problem: "2 * 3", answer: `${2 * 3}` },
            door002: { problem: "4 * 5", answer: `${4 * 5}` },
            door003: { problem: "6 * 2", answer: `${6 * 2}` },
            door004: { problem: "3 * 7", answer: `${3 * 7}` }
        }
    }
});


console.log(nearDoor.value);


const { problem, answer } = levels.value[levelKey][stepKey as 'step1' | "step2" | "step3" | "step4"][nearDoor.value as "door001" | "door002" | "door003"]

const interedAnswer = ref('');
const isCorrect = ref(false);
const isMessageShow = ref(false);

const emits = defineEmits(['closeMathModal']);

const solveProblem = () => {
    isMessageShow.value = true

    if (interedAnswer.value === answer) {
        isCorrect.value = true
        emits('closeMathModal', true);
        console.log('Correct');
    } else {
        isCorrect.value = false
        console.log('Incorrect');
    }
};

const closeModal = () => {
    emits("closeMathModal", false)
}
</script>

<style scoped>
.math-modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
}

.title {
    background-color: rgba(0, 0, 0, 0.2);
    padding: 16px;
    font-weight: 600;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.close-icon {
    cursor: pointer;
    opacity: 0.7;
    transition: opacity 0.3s;
}
</style>
