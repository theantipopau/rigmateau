import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Cpu, Shield, DollarSign, Share2, Zap, Star } from 'lucide-react'

export default function Home() {
  return (
    <main className='min-h-screen bg-gray-950 text-white'>
      <nav className='border-b border-white/10 px-4'>
        <div className='mx-auto max-w-6xl flex items-center justify-between h-16'>
          <Link href='/' className='flex items-center'>
            <Image src='/headerlogo.PNG' alt='RigMate AU' width={200} height={44} className='h-11 w-auto' priority />
          </Link>
          <Link href='/builder' className='text-sm bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5'>
            Start Building <ArrowRight className='h-4 w-4' />
          </Link>
        </div>
      </nav>
      <section className='relative overflow-hidden py-20 md:py-32 px-4'>
        <div className='absolute inset-0 bg-gradient-to-b from-blue-950/20 to-transparent' />
        <div className='relative mx-auto max-w-4xl text-center space-y-6'>
          <div className='inline-flex items-center gap-2 bg-orange-950/60 border border-orange-500/30 rounded-full px-4 py-2 text-sm text-orange-300'>
            <Star className='h-4 w-4 text-yellow-400' />
            Built for Australian PC builders
          </div>
          <h1 className='text-4xl md:text-6xl font-bold tracking-tight'>
            Build your perfect<br />
            <span className='bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent'>Australian PC</span>
          </h1>
          <p className='text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed'>
            Compare prices from Scorptec, PC Case Gear, MSY, eBay AU and AliExpress. Full compatibility checking, import trust ratings, and shareable build pages.
          </p>
          <div className='flex flex-wrap items-center justify-center gap-3 pt-2'>
            <Link href='/builder' className='flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white font-medium px-8 py-3.5 rounded-xl transition-colors text-base'>
              Start Building Free <ArrowRight className='h-5 w-5' />
            </Link>
            <Link href='/build/sample-1440p-gaming' className='flex items-center gap-2 border border-white/20 hover:border-white/40 text-white font-medium px-8 py-3.5 rounded-xl transition-colors text-base'>
              View Sample Build
            </Link>
          </div>
        </div>
      </section>
      <section className='py-16 px-4'>
        <div className='mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {([
            { icon: DollarSign, title: 'AU Price Comparison', desc: 'Compare across Scorptec, PLE, PC Case Gear, MSY, Umart, eBay AU. See the true landed cost.', color: 'text-green-400', bg: 'bg-green-400/10' },
            { icon: Shield, title: 'Compatibility Checking', desc: 'Socket, RAM type, form factor, GPU clearance, cooler height, PSU wattage - all auto-checked.', color: 'text-blue-400', bg: 'bg-blue-400/10' },
            { icon: Cpu, title: 'Import Trust Ratings', desc: 'Know which parts are safe from AliExpress and which need an AU warranty.', color: 'text-purple-400', bg: 'bg-purple-400/10' },
            { icon: Zap, title: 'FPS Estimates', desc: 'Real-world estimates for 1080p, 1440p and 4K gaming based on seeded benchmarks.', color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
            { icon: Share2, title: 'Premium Build Pages', desc: 'Share with a beautiful showcase page. Export as PDF.', color: 'text-pink-400', bg: 'bg-pink-400/10' },
            { icon: Star, title: 'Free Always', desc: 'No subscriptions, no paywalls. Affiliate links keep it running.', color: 'text-orange-400', bg: 'bg-orange-400/10' },
          ] as const).map((f) => (
            <div key={f.title} className='rounded-2xl border border-white/10 bg-white/[0.03] p-6 space-y-3 hover:border-white/20 transition-colors'>
              <div className={'w-10 h-10 rounded-lg ' + f.bg + ' flex items-center justify-center'}>
                <f.icon className={'h-5 w-5 ' + f.color} />
              </div>
              <h3 className='font-semibold text-white'>{f.title}</h3>
              <p className='text-sm text-gray-400 leading-relaxed'>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
      <footer className='border-t border-white/10 py-8 px-4'>
        <div className='mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500'>
          <div className='flex items-center gap-2'>
            <Image src='/icon.PNG' alt='RigMate AU' width={28} height={28} className='h-7 w-auto' />
            <span>RigMate AU</span>
          </div>
          <p>Prices are indicative. Always verify on retailer websites.</p>
        </div>
      </footer>
    </main>
  )
}
