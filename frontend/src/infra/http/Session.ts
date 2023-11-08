import Cookie from 'js-cookie'

export class Session {
  private sessionKey = 'session'
  private timer: any
  private expireMinutes = 15

  constructor() {
    if (typeof window === "undefined") return
    this.initSession()
    this.initEvents()
  }

  private initSession() {
    if (!this.getCookie()) {
      this.createSessionCookie()
    }
  }

  private initEvents() {
    window.addEventListener('load', this.resetCookie.bind(this))
    window.addEventListener('mousemove', this.resetCookie.bind(this))
    window.addEventListener('keydown', this.resetCookie.bind(this))
  }

  private resetCookie() {
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      this.createSessionCookie()
    }, 1000)
  }

  private getCookie() {
    return Cookie.get(this.sessionKey)
  }

  private createSessionCookie() {
    const uuid = window.crypto.randomUUID()
    const expires = new Date(new Date().getTime() + this.expireMinutes * 60 * 1000)
    Cookie.set(this.sessionKey, uuid, { expires })
  }
}
