const host = 'http://localhost:5000';

export const API_URLS = {
    baseUrl: host,
    signUp: `${host}/teacher/signUp/picture`,
    signIn: `${host}/signIn`,
    updateProfile: `${host}/teacher/profile/picture`,
    updateProfileDetails: `${host}/teacher/profile`,
    getProfile: `${host}/teacher/profile`,
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