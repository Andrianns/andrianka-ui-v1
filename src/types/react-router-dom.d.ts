declare module "react-router-dom" {
  import * as React from "react"

  export interface RouterProviderProps {
    router: any
  }

  export const RouterProvider: React.FC<RouterProviderProps>

  export function createBrowserRouter(routes: any, opts?: any): any

  export type NavigateFunction = (to: string | number, options?: any) => void

  export function useNavigate(): NavigateFunction

  export interface LocationState {
    state?: unknown
    key?: string
  }

  export function useLocation<T extends LocationState = LocationState>(): T
}
