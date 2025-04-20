<template>
    <div class="math-modal">
        <v-card color="grey-darken-3" rounded="lg">
            <v-card-title>
                <h2>Math Problem</h2>
            </v-card-title>
            <v-card-subtitle class="font-weight-bold font-size-14" v-if="isMessageShow" :style="{color: isCorrect ? 'green' : 'red'}">
                {{ isCorrect ? 'Correct' : 'Incorrect' }}
            </v-card-subtitle>
            <v-card-text>
                <p>Solve the following math problem:</p>
                <v-form>
                    <v-text-field
                        v-model="problem"
                        label="Problem"
                        disabled
                        required
                    ></v-text-field>
                    <v-text-field
                        v-model="interedAnswer"
                        label="Answer"
                        required
                    ></v-text-field>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-btn variant="tonal" color="primary" @click="solveProblem">Solve</v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useDoorMathProblem } from '@/store/doorMathProblem';
import { nearDoor } from '~/store/doorStatus';

const { problem, answer } = useDoorMathProblem[nearDoor.value as keyof typeof useDoorMathProblem];
const interedAnswer = ref('');
const isCorrect = ref(false);
const isMessageShow = ref(false);

const emits = defineEmits(['closeMathModal']);

const solveProblem = () => {
    isMessageShow.value = true

    if (interedAnswer.value === answer) {
        isCorrect.value = true
        emits('closeMathModal');
        console.log('Correct');
    } else {
        isCorrect.value = false
        console.log('Incorrect');
    }
};
</script>

<style scoped>
.math-modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
}
</style>
