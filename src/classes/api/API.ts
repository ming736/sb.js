interface RawLoginResult {
    username: string;
    token: string;
    num_tries: number;
    success: 0 | 1;
    msg: string;
    messages: any[];
    id: number;
}

class LoginResult {
    username: string;
    id: number;
    constructor(auth: RawLoginResult) {
        this.username = auth.username;
        this.id = auth.id;
    }
}

type HTTPMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD"

interface RequestOptions {
    method?: HTTPMethod,
    body?: any,
    auth?: boolean,
}
/**
 * @warn Not yet complete.
 * @since 
 */
export default class API {
    private _authenticated: boolean = false;
    private sessionId: string;
    private csrfToken: string;
    private token: string;
    readonly language: string = "en";
    private async convertRequestOptions(options: RequestOptions): Promise<Record<string, any>> {
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
    private generateHeaders(csrf?: string) {
        return {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36",
            "X-Requested-With": "XMLHttpRequest",
            "X-Csrftoken": csrf ?? "a",
            "Referer": "https://scratch.mit.edu"
        }
    }
    private async request(url: string, options: RequestOptions): Promise<Response> {
        return await fetch(url, await this.convertRequestOptions(options))
    }
    private generateCookieHeader(csrf?: string) {
        return `scratchcsrftoken=${csrf ?? "a"};scratchlanguage=${this.language}`
    }
    private async generateCsrfToken(): Promise<string> {
        let response = await fetch("https://scratch.mit.edu/csrf_token/")
        let { json, csrf } = await this.parseResponse(response)
        this.csrfToken = csrf
        return csrf
    }
    private async generateToken(): Promise<string> {
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
    private async parseResponse(response: Response): Promise<{json: Record<any, any> | any[], csrf: string | null}> {
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
    get isAuthenticated() {
        return this._authenticated
    }
    constructor(language?: string) {
        this.language = language ?? "en"
    }
    async login(sessionToken: string): Promise<LoginResult>;
    async login(username: string, password?: string): Promise<LoginResult>;
    async login(usernameOrToken: string, password?: string): Promise<LoginResult> {
        if (!usernameOrToken) {
            throw new Error("Missing credentials in login function")
        }
        if (password) {
            let headers = this.generateHeaders()
            headers["Cookie"] = this.generateCookieHeader()
            let response = await fetch("https://scratch.mit.edu/accounts/login/", {
                method: "POST",
                body: JSON.stringify({
                    username: usernameOrToken.toLowerCase(),
                    password: password,
                    useMessages: true
                }),
                headers: headers
            })
            let { json, csrf } = await this.parseResponse(response)
            if (response.ok) {
                return new LoginResult(json[0])
            } else {
                if (json[0] && json[0].msg) {
                    throw new Error(json[0].msg)
                } else {
                    throw new Error("Unknown login error")
                }
            }
        } else {

        }
    }
}