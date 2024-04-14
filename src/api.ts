const host = 'http://localhost:5000';

export const API_URLS = {
    signUp: `${host}/signUp`,
    signIn: `${host}/signIn`,
    signOut: `${host}/signOut`,
    classes: `${host}/class`,
    addClass: `${host}/class`,
    deleteClass: `${host}/class`,
    updateClass: `${host}/class`,
} as const;