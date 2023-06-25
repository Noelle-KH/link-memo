const DEFAULT_PAGE_NUMBER = 1
const DEFAULT_PAGE_LIMIT = 20

const getPagination = (query) => {
  const currPage = Math.abs(query) || DEFAULT_PAGE_NUMBER
  const limit = DEFAULT_PAGE_LIMIT
  const skip = (currPage - 1) * limit

  return { limit, skip, currPage }
}

module.exports = { getPagination }
