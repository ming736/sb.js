import Requester from "./Requester";

interface APIUser {
    id: number;
    username: string;
    scratchteam: boolean;
    history: {
        joined: string;
    };
    profile: {
        id: number;
        images: {
            "90x90": string;
            "60x60": string;
            "55x55": string;
            "50x50": string;
            "32x32": string;
        };
        status: string;
        bio: string;
        country: string;
    };
}

export default class User {
    static banCache: { [username: string]: boolean } = {};
    id: number;
    username: string;
    joinedAt: Date;
    bio: string;
    status: string;
    country: string;
    constructor(user: APIUser) {
        this.id = user.id;
        this.username = user.username;
        this.joinedAt = new Date(user.history.joined);
        this.bio = user.profile.bio;
        this.status = user.profile.status;
        this.country = user.profile.country;
    }
    async isBanned() {
        if (User.banCache[this.username]) {
            return User.banCache[this.username]
        }
        let requester = new Requester()
        let isBanned = (await requester.request(`https://scratch.mit.edu/users/${this.username}`)).status === 404
        User.banCache[this.username] = isBanned
        return isBanned;
    }
    /**
     * Gets the image url with the highest available quality.
     */
    getImageUrl(size: "highest");
    /**
     * Gets the image url with the lowest available quality.
     */
    getImageUrl(size: "lowest");
    getImageUrl(size: number);
    getImageUrl(size: "highest" | "lowest" | number) {
        if (size === "highest") {
            return `https://uploads.scratch.mit.edu/get_image/user/${this.id}_4096x4096.png`
        } else if (size === "lowest") {
            return `https://uploads.scratch.mit.edu/get_image/user/${this.id}_16x16.png`
        } else if (typeof size === "number" && size > 0) {
            return `https://uploads.scratch.mit.edu/get_image/user/${this.id}_${size}x${size}.png`
        }
        throw new Error(`Invalid size value ${size}`)
    }
}