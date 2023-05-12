class Student {
    constructor({ username = '', github = '', problemsHistory = [], lecturesHistory = []}) {
        this.username = username
        this.github = github
        this.problemsHistory = problemsHistory
        this.lecturesHistory = lecturesHistory
    }
}

export default Student