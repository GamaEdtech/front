import { Levels } from "@/interfaces/levels.interface"
import { ref } from "vue"

export const levels = ref<Levels>({
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
