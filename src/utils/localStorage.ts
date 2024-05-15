import { User } from 'src/types/user'

type SaveLocalStorageType = {
  data: any
  name: string
}

export const USER = 'user'
export const MODE = 'dark'

export const localHandler = {
  getLocal: (key: string) => {
    return localStorage.getItem(key)
  },
  setLocal: (key: string, value: any) => {
    localStorage.setItem(key, value)
  },

  resetStorage: () => {
    localStorage.clear()
  },
  deleteKey: (name: string) => {
    return localStorage.removeItem(name)
  }
}

export const saveLocalStorage = ({ data, name }: SaveLocalStorageType) => {
  localHandler.setLocal(name, data)
}

export const getUserLocal = (): User | null => {
  let user: User | null = null
  try {
    user = JSON.parse(localHandler.getLocal(USER) || '')
  } catch (err) {
    /* empty */
  }

  return user
}
