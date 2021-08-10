import request from '@/utils/request'

export function ffetchList(query) {
  console.log('ffetchList()')
  return request({
    url: 'http://124.71.225.17:8000/book/bookinfo/',
    method: 'get'
  })
}

export function dataTranFormer(oldVal) {
  console.log('oldVal')
  console.log(oldVal)
  var newVal = []
  for (var i = 0; i < oldVal.length; i++) {
    newVal.push({
      author: oldVal[i].author,
      comment_disabled: true,
      // content: "<p>I am testing data, I am testing data.</p><p><img src=\"https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943\"></p>",
      content: oldVal[i].summary,
      content_short: 'mock data',
      display_time: oldVal.create_time,
      forecast: Number(oldVal.price),
      id: oldVal[i].book_id,
      image_uri: 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3',
      // image_uri: oldVal.pic
      importance: 3,
      pageviews: 1505,
      platforms: Array(1),
      reviewer: oldVal[i].category,
      status: oldVal[i].isbn,
      timestamp: 1614634668386,
      title: oldVal[i].title
    })
  }
  return newVal
}

export function dataTest(oldVal) {
  return [{
    author: "Christopher",
    comment_disabled: true,
    content: "<p>I am testing data, I am testing data.</p><p><img src=\"https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943\"></p>",
    content_short: "mock data",
    display_time: "2008-03-03 18:02:29",
    forecast: 95.16,
    id: 1,
    image_uri: "https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3",
    importance: 3,
    pageviews: 1505,
    platforms: Array(1),
    reviewer: "Carol",
    status: "published",
    timestamp: 1614634668386,
    title: "Tkmswlwic Nkjhmgn Rdxphihs Merkm Fhxzsdk Alo Myntrnu Kudqhiiudk"
  }]

}
