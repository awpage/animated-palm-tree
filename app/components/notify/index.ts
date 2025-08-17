import { createApp, h } from 'vue'

import Notify from "./index.vue"

let appInstance: ReturnType<typeof createApp> | null = null

const notify = {
  show(props: { type: "error" | "success", message: string }) {
    return new Promise((resolve) => {
      const container = document.createElement("div");

      const vnode = h(Notify, {
        key: Date.now(),
        ...props,

        onClose: () => {
          resolve("Notification closed")
          appInstance!.unmount()
          container.remove()
          appInstance = null
        }
      })

      const app = createApp({ render: () => vnode })
      appInstance = app

      document.body.append(container)
      appInstance.mount(container)
    })
  }
}

export default notify
export const useNotify = notify.show