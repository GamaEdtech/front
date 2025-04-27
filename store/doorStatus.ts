import { ref } from "vue"

interface Doors {
    door001: boolean;
    door002: boolean;
    door003: boolean;
    door004: boolean;
}

export interface Step {
    step1: Doors;
    step2: Doors;
    step3: Doors;
    step4: Doors;
}

interface Level {
    id: string;
    steps: Step;
}

export const openedDoors = ref<Level[]>([
    {
        id: 'level1',
        steps: {
            step1: { door001: false, door002: false, door003: false, door004: false },
            step2: { door001: false, door002: false, door003: false, door004: false },
            step3: { door001: false, door002: false, door003: false, door004: false },
            step4: { door001: false, door002: false, door003: false, door004: false }
        }
    },
    {
        id: 'level2',
        steps: {
            step1: { door001: false, door002: false, door003: false, door004: false },
            step2: { door001: false, door002: false, door003: false, door004: false },
            step3: { door001: false, door002: false, door003: false, door004: false },
            step4: { door001: false, door002: false, door003: false, door004: false }
        }
    }
]);

export const nearDoor = ref<"door001" | "door002" | "door003" | "door004" | null>(null);
