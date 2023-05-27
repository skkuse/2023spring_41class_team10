class Problem {
    constructor({
      slug = '',
      title = '',
      problemNumber = '',
      problemCategory = '',
      problemLevel = '',
      description = '',
      programmingLanguage = '',
      createdAt = '',
      updatedAt = '',
    }) {
      this.slug = slug
      this.title = title
      this.problemNumber = problemNumber
      this.problemCategory = problemCategory
      this.problemLevel = problemLevel
      this.description = description
      this.programmingLanguage = programmingLanguage
      this.createdAt = new Date(createdAt).toDateString()
      this.updatedAt = new Date(updatedAt).toDateString()
    }
  }
  
  export default Problem