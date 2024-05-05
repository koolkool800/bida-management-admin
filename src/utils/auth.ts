import { User } from 'src/types/user'
import { USER, saveLocalStorage } from 'src/utils/localStorage'

export const authUtils = {
  handleLogin(user: User) {
    saveLocalStorage({
      data: JSON.stringify(user),
      name: USER
    })
  }
}
