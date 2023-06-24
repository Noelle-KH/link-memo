const formatObject = (data, type) => {
  const { _id, ...item } = data
  return {
    id: _id,
    type,
    attributes: {
      ...item
    }
  }
}

const formatArray = (data, type) => {
  if (Array.isArray(data)) {
    return data.map((element) => {
      const { _id, ...item } = element
      return {
        id: _id,
        type,
        attributes: {
          ...item
        }
      }
    })
  }
}

const formatMessage = (message) => {
  return {
    data: null,
    meta: {
      message
    }
  }
}

module.exports = {
  formatObject,
  formatArray,
  formatMessage
}
