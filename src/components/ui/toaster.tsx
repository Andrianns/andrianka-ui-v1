import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { DEFAULT_SETTINGS } from "@/lib/cms"
import { useToast } from "@/hooks/use-toast"

type ToasterProps = {
  duration?: number
}

export function Toaster({ duration = DEFAULT_SETTINGS.notificationDuration }: ToasterProps) {
  const { toasts } = useToast()

  return (
    <ToastProvider duration={duration}>
      {toasts.map(({ id, title, description, action, ...toast }) => (
        <Toast key={id} {...toast}>
          <div className="grid gap-1">
            {title && <ToastTitle>{title}</ToastTitle>}
            {description && <ToastDescription>{description}</ToastDescription>}
          </div>
          {action}
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  )
}
