const host = 'http://localhost:5000';

export const API_URLS = {
    signUp: `${host}/signUp`,
    signIn: `${host}/signIn`,
    signOut: `${host}/signOut`,
    classes: `${host}/class`,
    addClass: `${host}/class`,
    deleteClass: `${host}/class`,
    updateClass: `${host}/class`,
    getQuizzes: `${host}/quiz/getQuizzesForTeacher`,
    updateQuiz: `${host}/quiz`,
    getQuestionsByQuizId: `${host}/question/getQuestionsByQuizId`,
    createQuestion: `${host}/question/createQuestionsByQuizId`,
    updateQuestion: `${host}/question/updateQuestion`,
} as const;