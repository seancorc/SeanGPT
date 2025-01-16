import { Metadata } from 'next'
import SeanGPTLayout from '../components/SeanGPTLayout'

export const metadata: Metadata = {
  title: 'SeanGPT',
  description: 'Your personal fitness AI assistant',
}

export default function Home() {
  return <SeanGPTLayout />
}
