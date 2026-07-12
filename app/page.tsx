import { WelcomePage } from '@/components/welcome-page'
import { AppProvider } from '@/lib/app-context'

export default function Home() {
  return (
    <AppProvider>
      <WelcomePage />
    </AppProvider>
  )
}
