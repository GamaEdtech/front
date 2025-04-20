import { reactive, ref } from "vue"

// is Doors open or close
export const openedDoors = reactive<{door001: boolean, door002: boolean, door003: boolean}>({
    door001: false,
    door002: false,
    door003: false
})

export const nearDoor = ref<"door001" | "door002" | "door003" | null>(null)