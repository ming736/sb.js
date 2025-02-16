type HTTPMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD"

interface RequestOptions {
    method?: HTTPMethod,
    body?: any,
    auth?: boolean,
}

export default class Requester {
    language: string;
    private csrfToken: string;
    private token: string;
    private sessionId: string;
    constructor(sessionId?: string, language?: string) {
        this.language = language ?? "en"
        this.sessionId = sessionId 
    }
    setSessionId(newSessionId: string) {
        this.sessionId = newSessionId;
    }
    generateHeaders(csrf?: string) {
        return {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36",
            "X-Requested-With": "XMLHttpRequest",
            "X-Csrftoken": csrf ?? "a",
            "Referer": "https://scratch.mit.edu"
        }
    }
    generateCookieHeader(csrf?: string) {
        return `scratchcsrftoken=${csrf ?? "a"};scratchlanguage=${this.language}`
    }
    async generateCsrfToken(): Promise<string> {
        let response = await fetch("https://scratch.mit.edu/csrf_token/")
        let { json, csrf } = await this.parseResponse(response)
        this.csrfToken = csrf
        return csrf
    }
    async generateToken(): Promise<string> {
        let csrf = await this.generateCsrfToken()
        let headers = this.generateHeaders(csrf)
        headers["Cookie"] = this.generateCookieHeader(csrf)
        let response = await fetch("https://scratch.mit.edu/session/", {
            headers
        })
        let { json } = await this.parseResponse(response)
        let token = (json as Record<any, any>).user.token
        this.token = token
        return token
    }
    async parseResponse(response: Response): Promise<{json: Record<any, any> | any[], csrf: string | null}> {
        let setCookie: string | string[] = response.headers.get('set-cookie');
        let result = {
            json: await response.json(),
            csrf: null
        }
        if (setCookie) {
            const cookieArray = setCookie.split(',');
            const csrfToken = cookieArray.find(cookie => cookie.trim().startsWith('scratchcsrftoken='));
            if (csrfToken) {
                const tokenValue = csrfToken.split('=')[1].split(';')[0];
                result.csrf = tokenValue
                this.csrfToken = tokenValue
            }
        }
        return result
    }
    /**
     * Not intended for regular use, but is exposed in case.
     */
    async convertRequestOptions(options: RequestOptions): Promise<Record<string, any>> {
        options.method = options.method.toUpperCase() as HTTPMethod
        let result: Record<string, any> = {
            headers: this.generateHeaders()
        }
        result.headers["Cookie"] = this.generateCookieHeader()
        if (options.auth) {
            result.headers["X-Token"] = await this.generateToken()
        }
        if (options.method !== "GET") {
            let csrf = await this.generateCsrfToken()
            result.headers["X-Csrftoken"] = csrf
            result.headers["Cookie"] = this.generateCookieHeader(csrf)
        }
        if (options.body) {
            if (typeof options.body == "object") {
                try {
                    options.body = JSON.stringify(options.body)
                } catch (error) {}
            }
            result.body = options.body
        }
        return result
    }
    /**
     * Not intended for regular use, but is exposed in case.
     */
    async request(url: string, options?: RequestOptions): Promise<Response> {
        if (options) {
            return await fetch(url, await this.convertRequestOptions(options))
        } else {
            return await fetch(url)
        }
    }
}