const { getDictionaryList, getOptions } = require('./sqlDatabase')

module.exports = [
  {
    url: '/api/admin/systemData/dictionary/optionsByCode',
    type: 'get',
    response: config => {
      const { code } = config.query
      const dictionarys = getDictionaryList()
      const options = getOptions()

      const currentDictionary = dictionarys.find(item => item.entityCode === code)
      if (!currentDictionary) {
        return {
          code: 404,
          message: '查询的字段不存在'
        }
      }

      const list = options.filter(item => item.dictionaryId === currentDictionary.id)

      return {
        code: 200,
        data: {
          list
        }
      }
    }
  },
  {
    url: '/api/admin/systemData/dictionary/options',
    type: 'get',
    response: config => {
      const { id, keyword } = config.query
      const options = getOptions()
      let list

      if (!keyword) {
        list = options.filter(item => item.dictionaryId === id)
      } else {
        list = options.filter(item => item.dictionaryId === id && item.fullName.includes(keyword))
      }

      return {
        code: 200,
        data: {
          list
        }
      }
    }
  },
  {
    url: '/api/admin/systemData/dictionary/option',
    type: 'delete',
    response: config => {
      const { id } = config.body
      const options = getOptions()
      const currentIndex = options.findIndex(item => item.id === id)

      if (currentIndex > -1) {
        options.splice(currentIndex, 1)
        return {
          code: 200,
          message: '删除成功'
        }
      }

      return {
        code: 404,
        message: '删除失败，没有找到对应项'
      }
    }
  },
  {
    url: '/api/admin/systemData/dictionary/option',
    type: 'post',
    response: config => {
      const option = config.body
      const options = getOptions()

      const isRepeat = options.some(item => item.dictionaryId === option.dictionaryId && (item.fullName === option.fullName || item.entityCode === option.entityCode))

      if (!isRepeat) {
        option.id = Math.ceil(Math.random() * 100000000000000) + ''
        options.push(option)
        return {
          code: 200,
          message: '创建成功'
        }
      }

      return {
        code: 404,
        message: '名称或编码重复'
      }
    }
  },
  {
    url: '/api/admin/systemData/dictionary/option',
    type: 'put',
    response: config => {
      const option = config.body
      const options = getOptions()
      let isRepeat = false
      let currentOption = null

      options.some(item => {
        if (item.id !== option.id && item.dictionaryId === option.dictionaryId && (item.fullName === option.fullName || item.entityCode === option.entityCode)) {
          isRepeat = true
          return true
        }

        if (item.id === option.id) currentOption = item

        return false
      })

      if (isRepeat) {
        return {
          code: 404,
          message: '名称或编码重复'
        }
      }

      if (currentOption) {
        for (const key in option) {
          currentOption[key] = option[key]
        }

        return {
          code: 200,
          message: '更新成功'
        }
      }

      return {
        code: 404,
        message: '找不到资源'
      }
    }
  },
  {
    url: '/api/admin/systemData/dictionary/option/info',
    type: 'get',
    response: config => {
      const { id } = config.query
      const options = getOptions()
      const currentOption = options.find(item => item.id === id)

      if (currentOption) {
        return {
          code: 200,
          data: currentOption
        }
      }

      return {
        code: 404,
        message: '找不到资源'
      }
    }
  },
  {
    url: '/api/admin/systemData/dictionaryList',
    type: 'get',
    response: config => {
      const list = getDictionaryList()

      return {
        code: 200,
        data: {
          list
        }
      }
    }
  },
  {
    url: '/api/admin/systemData/dictionary/info',
    type: 'get',
    response: config => {
      const { id } = config.query
      const list = getDictionaryList()
      const currentDictionary = list.find(item => item.id === id)

      if (currentDictionary) {
        return {
          code: 200,
          data: currentDictionary
        }
      }

      return {
        code: 404,
        message: '找不到该字段'
      }
    }
  },
  {
    url: '/api/admin/systemData/dictionary',
    type: 'post',
    response: config => {
      const dictionary = config.body
      const list = getDictionaryList()
      const isRepeat = list.some(item => item.fullName === dictionary.fullName || item.entityCode === dictionary.entityCode)

      if (!isRepeat) {
        dictionary.id = Math.ceil(Math.random() * 100000000000000000000) + ''
        list.push(dictionary)
        return {
          code: 200,
          message: '创建成功'
        }
      }

      return {
        code: 404,
        message: '名称或编码重复'
      }
    }
  },
  {
    url: '/api/admin/systemData/dictionary',
    type: 'put',
    response: config => {
      const dictionary = config.body
      const list = getDictionaryList()
      let isRepeat = false
      let currentDictionary = null

      list.some(item => {
        if (item.id !== dictionary.id && (item.fullName === dictionary.fullName || item.entityCode === dictionary.entityCode)) {
          isRepeat = true
          return true
        }

        if (item.id === dictionary.id) currentDictionary = item

        return false
      })

      if (isRepeat) {
        return {
          code: 404,
          message: '名称或编码重复'
        }
      }

      if (currentDictionary) {
        for (const key in currentDictionary) {
          currentDictionary[key] = dictionary[key]
        }

        return {
          code: 200,
          message: '更新成功'
        }
      }

      return {
        code: 404,
        message: '找不到该字段'
      }
    }
  },
  {
    url: '/api/admin/systemData/dictionary',
    type: 'delete',
    response: config => {
      const { id } = config.body
      const list = getDictionaryList()
      const currentIndex = list.findIndex(item => item.id === id)

      if (currentIndex > -1) {
        list.splice(currentIndex, 1)
        return {
          code: 200,
          message: '删除成功'
        }
      }

      return {
        code: 404,
        message: '找不到该字段'
      }
    }
  }
]
