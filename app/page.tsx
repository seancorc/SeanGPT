import { Metadata } from 'next'
import SeanGPTLayout from '../components/SeanGPTLayout'

export const metadata: Metadata = {
  title: 'SeanGPT',
  description: 'Sean but AI',
}

export default function Home() {
  return <SeanGPTLayout />
}

