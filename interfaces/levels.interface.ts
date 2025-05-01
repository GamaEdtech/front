export interface Step {
    door001: {
        problem: string;
        answer: string;
    };
    door002: {
        problem: string;
        answer: string;
    };
    door003: {
        problem: string;
        answer: string;
    };
    door004: {
        problem: string;
        answer: string;
    };
}

export interface Level {
    step1: Step;
    step2: Step;
    step3: Step;
    step4: Step;
}

export interface Levels {
    [key: string]: Level;
}
