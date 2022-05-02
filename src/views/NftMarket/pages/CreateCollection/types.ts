export interface FormState {
    logoFile?: File
    bannerFile?: File
    featuredFile?:File
    mintable: boolean
    name?: string
    symbol?: string
    description?: string
    slug?: string
    site?: string
    discord?: string
    twitter?: string
    instagram?: string
    medium?: string
    telegram?: string
}


export interface FormErrors {
    logo?: string
    name?: string,
    symbol?: string,
    site?: string
}

export const urlReg = RegExp('^(http|https)\\://(www.)?[a-zA-Z0-9@:%._\\+~#?&//=]{1,256}.[a-z]{2,6}\\b([-a-zA-Z0-9@:%._\\+~#?&//=]*)$')
export const slugReg = RegExp('^[a-z][a-z0-9\\-]*[a-z0-9]$')
export const urlPathReg = RegExp('\\b([-a-zA-Z0-9@:%._\\+~#?&//=]*)$')