import type { BuildSlotKey } from '@/lib/types'

export interface BuildTemplate {
  id: string
  name: string
  description: string
  category: 'gaming' | 'workstation' | 'budget' | 'streaming' | 'content-creation'
  estimatedPrice: number
  performance?: string
  parts: Partial<Record<BuildSlotKey, string>>
}

export const BUILD_TEMPLATES: BuildTemplate[] = [
  {
    id: 'gaming-1440p',
    name: '1440p Gaming',
    description: 'High refresh rate at 1440p for modern AAA games',
    category: 'gaming',
    estimatedPrice: 2200,
    performance: '100–144 fps @ 1440p',
    parts: {
      cpu: 'cpu-r7-7700x',
      motherboard: 'mb-asus-x570-tuf',
      ram: 'ram-gskill-ddr5-6000-16gb',
      gpu: 'gpu-rtx4070',
      storage: 'ssd-wd-sn850x-2tb',
      psu: 'psu-corsair-rm850x',
      case: 'case-lianli-lancool-216',
      cooler: 'cooler-deepcool-ak620',
    },
  },
  {
    id: 'gaming-4k',
    name: '4K Gaming Build',
    description: 'Ultra settings at 4K resolution',
    category: 'gaming',
    estimatedPrice: 3500,
    performance: '60–80 fps @ 4K',
    parts: {
      cpu: 'cpu-r7-7800x3d',
      motherboard: 'mb-asus-x670e-hero',
      ram: 'ram-corsair-ddr5-6400-32gb',
      gpu: 'gpu-rtx4080super',
      storage: 'ssd-samsung-990pro-2tb',
      psu: 'psu-corsair-rm1000x',
      case: 'case-lian-li-o11d-evo',
      cooler: 'cooler-corsair-h150i-elite',
    },
  },
  {
    id: 'workstation-content',
    name: 'Content Creation',
    description: 'Video editing, 3D rendering, photography workflow',
    category: 'content-creation',
    estimatedPrice: 2800,
    performance: 'Multi-threaded workloads',
    parts: {
      cpu: 'cpu-r9-7900x',
      motherboard: 'mb-asus-x670e-hero',
      ram: 'ram-gskill-ddr5-6000-64gb',
      gpu: 'gpu-rtx4070tisuper',
      storage: 'ssd-samsung-990pro-4tb',
      psu: 'psu-corsair-hx1000i',
      case: 'case-fractal-north',
      cooler: 'cooler-noctua-nhd15',
    },
  },
  {
    id: 'workstation-dev',
    name: 'Software Development',
    description: 'Fast compilation, smooth multitasking, reliability',
    category: 'workstation',
    estimatedPrice: 1800,
    performance: 'Multi-core productivity',
    parts: {
      cpu: 'cpu-r7-7700x',
      motherboard: 'mb-gigabyte-x570',
      ram: 'ram-gskill-ddr5-6000-32gb',
      gpu: 'gpu-rx7600',
      storage: 'ssd-wd-sn850x-2tb',
      psu: 'psu-corsair-rm850x',
      case: 'case-corsair-4000d',
      cooler: 'cooler-deepcool-ak620',
    },
  },
  {
    id: 'budget-esports',
    name: 'Budget eSports',
    description: 'Competitive 1080p high refresh rate gaming',
    category: 'budget',
    estimatedPrice: 900,
    performance: '144–200 fps @ 1080p',
    parts: {
      cpu: 'cpu-r5-5600',
      motherboard: 'mb-msi-b550-gaming-plus',
      ram: 'ram-corsair-ddr4-3600',
      gpu: 'gpu-rx7700xt',
      storage: 'ssd-crucial-t705-1tb',
      psu: 'psu-seasonic-focus-750',
      case: 'case-phanteks-p400a',
      cooler: 'cooler-id-frost',
    },
  },
  {
    id: 'budget-gaming',
    name: 'Budget Gaming',
    description: 'Solid 1080p gaming experience on a tight budget',
    category: 'budget',
    estimatedPrice: 650,
    performance: '60–90 fps @ 1080p',
    parts: {
      cpu: 'cpu-r5-5600',
      motherboard: 'mb-msi-b550-gaming-plus',
      ram: 'ram-kingston-ddr4-3200-16gb',
      gpu: 'gpu-rx7600',
      storage: 'ssd-crucial-t705-1tb',
      psu: 'psu-seasonic-focus-750',
      case: 'case-coolermaster-nr400',
      cooler: 'cooler-id-frost',
    },
  },
  {
    id: 'streaming-setup',
    name: 'Streaming & Broadcasting',
    description: 'High-core count CPU for streaming overlays and encoding',
    category: 'streaming',
    estimatedPrice: 2400,
    performance: 'Stable streaming + gaming',
    parts: {
      cpu: 'cpu-r9-7900x',
      motherboard: 'mb-asus-x670e-hero',
      ram: 'ram-corsair-ddr5-6400-32gb',
      gpu: 'gpu-rtx4070',
      storage: 'ssd-samsung-990pro-2tb',
      psu: 'psu-corsair-rm1000x',
      case: 'case-lian-li-o11d-evo',
      cooler: 'cooler-corsair-h150i-elite',
    },
  },
]

export const TEMPLATE_BY_ID = Object.fromEntries(
  BUILD_TEMPLATES.map(t => [t.id, t])
)
