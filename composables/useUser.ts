import {useState} from 'nuxt/app'
export const useUser = () => {
    const user = useState('user', () => null)
  
    const setUser = (data: any) => {
      user.value = data
    }

    const cleanUser = () =>{
        user.value = null
    }
  
    return {
      user,
      setUser,
      cleanUser,
    }
  }