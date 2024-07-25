export type User = {
    email:string
    hash:string
    name:string
    hashRt?:string
}

export type TIdentifer = "email" | "id"