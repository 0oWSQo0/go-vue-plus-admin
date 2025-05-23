import type { RouteMeta } from 'vue-router'
import { Icon } from '@/components/Icon'

export const useRenderMenuTitle = () => {
  const renderMenuTitle = (meta: RouteMeta) => {
    const { title = 'Please set title', icon } = meta

    return icon ? (
      <>
        <Icon icon={meta.icon}></Icon>
        <span class="v-menu__title overflow-hidden overflow-ellipsis whitespace-nowrap">{title}</span>
      </>
    ) : (
      <span class="v-menu__title overflow-hidden overflow-ellipsis whitespace-nowrap">{title}</span>
    )
  }

  return {
    renderMenuTitle
  }
}
