import request from '@/utils/request'

export async function refreshCode() {
  return request({
    url: 'http://124.71.225.17:8000/user/login_by_qrcode/',
    method: 'GET'
  })
    .then((res) =>
      res.data.uid
    )
}

export async function codeQuery(uid) {
  return request({
    url: 'http://124.71.225.17:8000/user/login_by_qrcode/',
    method: 'POST',
    data: { uid }
  })
    .then((res) =>
      ({
        expired: res.data.msg === '二维码已失效!',
        waiting: res.data.msg === '请等待客户端登录!',
        scanned: res.data.msg === '请等待客户端确认!',
        token: res.data.token || undefined
      })
    )
}
