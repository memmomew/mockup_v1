const logg = require('commonlog-kb')
// const messageFunc = require('./decryptClient.func')
const constResultCode = require('../../constants/resultCode.const')
const httpResponse = require('../../utils/httpUtil').httpResponse
const stat = require('../../constants/stat.const')
const genUtil = require('../../utils/genUtil')

exports.loginByB2C = function (req, res) {
  /**  ========================== [START VALIABLE] ========================== */
  const appLog = req.logkb
  const body = req.body

  const conf = {
    nodeName: 'mockup',
    cmd: 'loginByB2C',
    requ: 'CLIENT'
  }

  // [INIT SESSION]
  const Xsession = req.id
  const Xrtid = req.xrtid
  /**  ========================== [END VALIABLE] ========================== */

  /**  ========================== [START LOG] ========================== */
  appLog.info('==========> loginByB2C proccessing <==========')
  // const identity = `${Xsession}:${Xrtid}:${Xtid}`
  const session = `${Xsession}:${Xrtid}:`
  const summary = logg.summary(session, '', conf.cmd, '')
  const detail = logg.detail(session, '', conf.cmd, '')
  /**  ========================== [END LOG] ========================== */

  // [INSERT DETAIL REQ.CLIENT]
  detail.addInputRequest(conf.requ, conf.cmd, '', JSON.stringify(body), {
    header: req.headers,
    body: '',
    url: req.originalUrl
  })

  /**  ========================== [START DETAIL LOG] ========================== */
  // const opt = {
  //   headers: {
  //     'X-Session-Id': Xsession,
  //     'X-Rtid': Xrtid
  //   }
  // }
  // appLog.info('setting header: ', opt)
  /**  ========================== [END DETAIL LOG] ========================== */
  try {
    appLog.stat(stat.recvReq(conf.cmd))
    // appLog.debug('receive deliverStatus from url : ===> ', body.callBackUrl)
    appLog.debug('raw headers : ', JSON.stringify(req.rawHeaders))

    var registerFlag = true
    var authenFlag = false
    // var registerFlag = false
    // var authenFlag = true
    const ret = {
      resultCode: '20000',
      developerMessage: 'success',
      registerFlag: registerFlag,
      authenFlag: authenFlag,
      privateId: 'zvwY6hEbL5BREEp5bgi8vAgQvtgp8NaJ',
      ptsListOfAPI: [
        'AIS Exclusive|C:password,R:no,U:password,D:0,L:token|no',
        'Push Notification|C:password,R:no,U:password,D:no,L:token|yes'
      ]
    }
    res.req = req
    appLog.stat(stat.retResSuc(conf.cmd))
    res.set(
      {
        'X-Session-Id': req.headers['x-session-id'],
        'X-App': 'AppName=AISPLAYBOX; appVersion=1.0.0',
        'X-Partner-Specific-Private-Id': genUtil.genXsession()
      }
    )
    return httpResponse(res, constResultCode[20000], conf.node, conf.cmd, ret, summary, detail)
  } catch (error) {
    if (typeof error.code === 'string') {
      appLog.warn('[messageCtrl.messages] Catch: HANDLE ERROR')
      if (error.code === 'connection_error') {
        appLog.warn('[messageCtrl.messages] Catch: ', error.code)
        return httpResponse(res, constResultCode[50000], conf.node, conf.cmd, null, summary, detail)
      } else {
        appLog.warn('[messageCtrl.messages] Catch: ', error.code)
        appLog.stat(stat.retResSysErr(conf.cmd))
        return httpResponse(res, constResultCode[50000], conf.node, conf.cmd, null, summary, detail)
      }
    } else {
      appLog.warn('[messageCtrl.messages] UNHANDLE ERROR')
      appLog.warn('[messageCtrl.messages] Catch: ', error)
      appLog.stat(stat.retResSysErr(conf.cmd))
      return httpResponse(res, constResultCode[50000], conf.node, conf.cmd, null, summary, detail)
    }
  }
}
