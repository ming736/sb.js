import Requester from "./Requester";
import User from "./User";

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

/**
 * @warn Not yet complete.
 * @since 1.0.0-alpha.1
 */
export default class API {
    private _authenticated: boolean = false;
    private _authenticatedUser: User;
    sessionId: string;
    private requester: Requester;
    readonly language: string = "en";
    get isAuthenticated() {
        return this._authenticated
    }
    get authenticatedUser() {
        return this._authenticatedUser
    }
    constructor(language?: string) {
        this.language = language ?? "en"
        this.requester = new Requester()
    }
    async login(sessionToken: string): Promise<LoginResult>;
    async login(username: string, password?: string): Promise<LoginResult>;
    async login(usernameOrToken: string, password?: string): Promise<LoginResult> {
        if (!usernameOrToken) {
            throw new Error("Missing credentials in login function")
        }
        if (password) {
            let headers = this.requester.generateHeaders()
            headers["Cookie"] = this.requester.generateCookieHeader()
            let response = await fetch("https://scratch.mit.edu/accounts/login/", {
                method: "POST",
                body: JSON.stringify({
                    username: usernameOrToken.toLowerCase(),
                    password: password,
                    useMessages: true
                }),
                headers: headers
            })
            let { json, csrf } = await this.requester.parseResponse(response)
            if (response.ok) {
                let usrres = await this.requester.request(`https://api.scratch.mit.edu/users/${json[0].username}`)
                let usr = await this.requester.parseResponse(usrres)
                this._authenticated = true
                // @ts-expect-error
                this._authenticatedUser = new User(usr.json)
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