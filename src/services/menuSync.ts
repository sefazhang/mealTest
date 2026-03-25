import { ref, push, onValue, set } from 'firebase/database'
import { db } from './firebase'

// 添加菜单
export const addMenu = async (menu: any) => {
  const menusRef = ref(db, 'menus')
  await push(menusRef, menu)
}

// 监听菜单变化
export const onMenusChange = (callback: (menus: any[]) => void) => {
  const menusRef = ref(db, 'menus')
  onValue(menusRef, (snapshot) => {
    const data = snapshot.val()
    const menus = data ? Object.values(data) : []
    callback(menus)
  })
}
