import request from '@/utils/request'

export function transformTemp(temp) {
  var d = {
    'title': temp.title,
    'author': temp.author,
    'category': temp.categy,
    'isbn': temp.isbn,
    'press': temp.press,
    'classification_num': temp.clsify_num,
    'key_words': temp.kw,
    'publish_date': '2021-08-11',
    'price': temp.prcie,
    'summary': temp.summary,
    'total_copies': Number(temp.pageviews),
    'available_copies': Number(temp.pageviews)

    // 'title': 'string',
    // 'author': 'string',
    // 'category': 'string',
    // 'isbn': 'string',
    // 'press': 'string',
    // 'classification_num': 'string',
    // 'key_words': 'string',
    // 'publish_date': 'string',
    // 'price': '0.0',
    // 'summary': 'string',
    // 'total_copies': 0,
    // 'available_copies': 0
  }
  console.log(d)
  return d
}
export function updateBook(temp) {
  return request({
    url: 'http://124.71.225.17:8000/book/bookinfo/' + temp.id,
    method: 'put',
    params: {
      book_id: Number(temp.id)
    },
    data: transformTemp(temp)
  })
}

export function deleteBook(temp) {
  return request({
    url: 'http://124.71.225.17:8000/book/bookinfo/' + temp.id,
    method: 'delete',
    params: { book_id: Number(temp.id) }
  })
}

export function createBook(temp) {
  console.log('createBook()')
  return request({
    url: 'http://124.71.225.17:8000/book/bookinfo/',
    method: 'post',
    data: transformTemp(temp)
  })
}

export function ffetchList(query) {
  console.log('ffetchList()')
  return request({
    url: 'http://124.71.225.17:8000/book/bookinfo/',
    method: 'get',
    params: query
    // params: { category: '外国名著' }
    // params: { title: '罪与罚' }

  })
}

export function ffetchList_fuzzy(fuzzy) {
  console.log('ffetchList_fuzzy()')
  return request({
    url: 'http://124.71.225.17:8000/book/fulltext_retrieval?text=' + fuzzy,
    method: 'get'
    // params: { category: '外国名著' }
    // params: { title: '罪与罚' }
  })
}

export function dataTranFormer(oldVal) {
  console.log('oldVal')
  console.log(oldVal)
  var newVal = []
  for (var i = 0; i < oldVal.length; i++) {
    newVal.push({
      comment_disabled: true,
      // content: "<p>I am testing data, I am testing data.</p><p><img src=\"https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943\"></p>",
      content_short: 'mock data',
      forecast: Number(oldVal.price),
      image_uri: 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3',
      // image_uri: oldVal.pic
      // timestamp: oldVal[i].update_time.slice(0, 10),

      platforms: Array(1),
      display_time: oldVal[i].create_time,
      categy: oldVal[i].category,
      status: oldVal[i].isbn,
      timestamp: new Date(),
      title: oldVal[i].title,
      pub: oldVal[i].press,
      kw: oldVal[i].key_words,
      clsify_num: oldVal[i].classification_num,
      summary: oldVal[i].summary,
      author: oldVal[i].author,
      id: oldVal[i].book_id,
      pageviews: oldVal[i].available_copies,
      total_pageviews: oldVal[i].total_copies
    })
  }
  return newVal
}

export function dataTest(oldVal) {
  return [{
    author: 'Christopher',
    comment_disabled: true,
    content: '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>',
    content_short: 'mock data',
    display_time: '2008-03-03 18:02:29',
    forecast: 95.16,
    id: 1,
    image_uri: 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3',
    pageviews: 1505,
    platforms: Array(1),
    categy: 'Carol',
    status: 'published',
    timestamp: 1614634668386,
    title: 'Tkmswlwic Nkjhmgn Rdxphihs Merkm Fhxzsdk Alo Myntrnu Kudqhiiudk'
  }]
}
