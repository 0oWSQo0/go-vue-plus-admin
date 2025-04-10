declare module 'vue' {
  export interface GlobalComponents {
    Icon: (typeof import('../src/components/Icon/index'))['Icon']
    Permission: (typeof import('../src/components/Permission/index'))['Permission']
  }
}

export {}
