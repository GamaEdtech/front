export const strict = false;

export const state = () => ({
  boards: [],
  isLoadingBoards: false,
  grades: [],
  isLoadingGrades: false,
  currentBoardId: null,
  subjects: [],
  isLoadingSubjects: false,
  currentGradeId: null,
});

export const mutations = {
  SET_BOARDS(state, boards) {
    state.boards = boards;
  },
  SET_LOADING_BOARDS(state, isLoading) {
    state.isLoadingBoards = isLoading;
  },
  SET_GRADES(state, grades) {
    state.grades = grades;
  },
  SET_LOADING_GRADES(state, isLoading) {
    state.isLoadingGrades = isLoading;
  },
  SET_CURRENT_BOARD_ID(state, boardId) {
    state.currentBoardId = boardId;
  },
  SET_SUBJECTS(state, subjects) {
    state.subjects = subjects;
  },
  SET_LOADING_SUBJECTS(state, isLoading) {
    state.isLoadingSubjects = isLoading;
  },
  SET_CURRENT_GRADE_ID(state, gradeId) {
    state.currentGradeId = gradeId;
  },
};

export const actions = {
  async fetchBoards({ commit, state }) {
    if (state.boards && state.boards.length > 0) {
      return state.boards;
    }

    try {
      commit('SET_LOADING_BOARDS', true);

      const response = await this.$axios.get("api/v1/types/list/?type=section");

      if (response.data && Array.isArray(response.data.data)) {
        commit('SET_BOARDS', response.data.data);
      }

      return response.data.data;
    } catch (error) {
      return [];
    } finally {
      commit('SET_LOADING_BOARDS', false);
    }
  },

  async fetchGrades({ commit, state }, boardId) {
    if (!boardId) {
      return [];
    }

    if (state.currentBoardId === boardId && state.grades && state.grades.length > 0) {
      return state.grades;
    }

    try {
      commit('SET_LOADING_GRADES', true);

      const response = await this.$axios.get(`api/v1/types/list/?type=base&section_id=${boardId}`);

      if (response.data && Array.isArray(response.data.data)) {
        commit('SET_GRADES', response.data.data);
        commit('SET_CURRENT_BOARD_ID', boardId);
      }

      return response.data.data;
    } catch (error) {
      commit('SET_GRADES', []);
      return [];
    } finally {
      commit('SET_LOADING_GRADES', false);
    }
  },

  async fetchSubjects({ commit, state }, gradeId) {
    if (!gradeId) {
      return [];
    }

    if (state.currentGradeId === gradeId && state.subjects && state.subjects.length > 0) {
      return state.subjects;
    }

    try {
      commit('SET_LOADING_SUBJECTS', true);

      const response = await this.$axios.get(`api/v1/types/list/?type=lesson&base_id=${gradeId}`);

      if (response.data && Array.isArray(response.data.data)) {
        commit('SET_SUBJECTS', response.data.data);
        commit('SET_CURRENT_GRADE_ID', gradeId);
      }

      return response.data.data;
    } catch (error) {
      commit('SET_SUBJECTS', []);
      return [];
    } finally {
      commit('SET_LOADING_SUBJECTS', false);
    }
  }
};

export const getters = {
  getAllBoards: state => state.boards,
  getBoardById: state => id => state.boards.find(board => board.id === id),
  isBoardsLoading: state => state.isLoadingBoards,

  getAllGrades: state => state.grades,
  getGradeById: state => id => state.grades.find(grade => grade.id === id),
  isGradesLoading: state => state.isLoadingGrades,

  getAllSubjects: state => state.subjects,
  getSubjectById: state => id => state.subjects.find(subject => subject.id === id),
  isSubjectsLoading: state => state.isLoadingSubjects,
};
