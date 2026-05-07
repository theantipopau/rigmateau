import type { Category, Part, PartWithCategory } from '@/lib/types'

const CATEGORIES = {
  cpu: { id: 'cat-cpu', slug: 'cpu', name: 'CPU', safeImport: true },
  motherboard: { id: 'cat-motherboard', slug: 'motherboard', name: 'Motherboard', safeImport: false },
  ram: { id: 'cat-ram', slug: 'ram', name: 'RAM', safeImport: false },
  gpu: { id: 'cat-gpu', slug: 'gpu', name: 'GPU', safeImport: false },
  storage: { id: 'cat-storage', slug: 'storage', name: 'Storage', safeImport: false },
  psu: { id: 'cat-psu', slug: 'psu', name: 'PSU', safeImport: false },
  case: { id: 'cat-case', slug: 'case', name: 'Case', safeImport: true },
  cooler: { id: 'cat-cooler', slug: 'cooler', name: 'CPU Cooler', safeImport: true },
  fan: { id: 'cat-fan', slug: 'fan', name: 'Case Fan', safeImport: true },
} satisfies Record<string, Category>

function part(categoryKey: keyof typeof CATEGORIES, input: Omit<PartWithCategory, 'categoryId' | 'category'>): PartWithCategory {
  const category = CATEGORIES[categoryKey]
  return {
    ...input,
    categoryId: category.id,
    category,
  }
}

export const STATIC_PARTS: PartWithCategory[] = [
  part('cpu', { id: 'cpu-r5-5600', name: 'AMD Ryzen 5 5600', brand: 'AMD', model: 'Ryzen 5 5600', socket: 'AM4', cores: 6, threads: 12, boostClockMhz: 4600, tdpWatts: 65, benchmarkScore: 1520 }),
  part('cpu', { id: 'cpu-r7-7700x', name: 'AMD Ryzen 7 7700X', brand: 'AMD', model: 'Ryzen 7 7700X', socket: 'AM5', cores: 8, threads: 16, boostClockMhz: 5400, tdpWatts: 105, benchmarkScore: 2050 }),
  part('cpu', { id: 'cpu-r7-7800x3d', name: 'AMD Ryzen 7 7800X3D', brand: 'AMD', model: 'Ryzen 7 7800X3D', socket: 'AM5', cores: 8, threads: 16, boostClockMhz: 5050, tdpWatts: 120, benchmarkScore: 2340 }),
  part('cpu', { id: 'cpu-r7-9800x3d', name: 'AMD Ryzen 7 9800X3D', brand: 'AMD', model: 'Ryzen 7 9800X3D', socket: 'AM5', cores: 8, threads: 16, boostClockMhz: 5500, tdpWatts: 120, benchmarkScore: 2580 }),
  part('cpu', { id: 'cpu-r9-7900x', name: 'AMD Ryzen 9 7900X', brand: 'AMD', model: 'Ryzen 9 7900X', socket: 'AM5', cores: 12, threads: 24, boostClockMhz: 5600, tdpWatts: 170, benchmarkScore: 2480 }),
  part('cpu', { id: 'cpu-r7-9700x', name: 'AMD Ryzen 7 9700X', brand: 'AMD', model: 'Ryzen 7 9700X', socket: 'AM5', cores: 8, threads: 16, boostClockMhz: 5500, tdpWatts: 65, benchmarkScore: 2180 }),
  part('cpu', { id: 'cpu-r9-9950x3d', name: 'AMD Ryzen 9 9950X3D', brand: 'AMD', model: 'Ryzen 9 9950X3D', socket: 'AM5', cores: 16, threads: 32, boostClockMhz: 5700, tdpWatts: 170, benchmarkScore: 3220 }),
  part('cpu', { id: 'cpu-i5-13600k', name: 'Intel Core i5-13600K', brand: 'Intel', model: 'Core i5-13600K', socket: 'LGA1700', cores: 14, threads: 20, boostClockMhz: 5100, tdpWatts: 125, benchmarkScore: 2080 }),
  part('cpu', { id: 'cpu-i7-13700k', name: 'Intel Core i7-13700K', brand: 'Intel', model: 'Core i7-13700K', socket: 'LGA1700', cores: 16, threads: 24, boostClockMhz: 5400, tdpWatts: 125, benchmarkScore: 2380 }),
  part('cpu', { id: 'cpu-i5-14600k', name: 'Intel Core i5-14600K', brand: 'Intel', model: 'Core i5-14600K', socket: 'LGA1700', cores: 14, threads: 20, boostClockMhz: 5300, tdpWatts: 125, benchmarkScore: 2150 }),
  part('cpu', { id: 'cpu-i7-14700k', name: 'Intel Core i7-14700K', brand: 'Intel', model: 'Core i7-14700K', socket: 'LGA1700', cores: 20, threads: 28, boostClockMhz: 5600, tdpWatts: 125, benchmarkScore: 2550 }),
  part('cpu', { id: 'cpu-i9-14900k', name: 'Intel Core i9-14900K', brand: 'Intel', model: 'Core i9-14900K', socket: 'LGA1700', cores: 24, threads: 32, boostClockMhz: 6000, tdpWatts: 125, benchmarkScore: 2900 }),

  part('motherboard', { id: 'mb-msi-b550-gaming-plus', name: 'MSI MAG B550 TOMAHAWK', brand: 'MSI', model: 'MAG B550 TOMAHAWK', socket: 'AM4', chipset: 'B550', ramType: 'DDR4', ramSlots: 4, maxRamGb: 128, formFactor: 'ATX' }),
  part('motherboard', { id: 'mb-msi-b650m', name: 'MSI MAG B650M Mortar WiFi', brand: 'MSI', model: 'MAG B650M Mortar WiFi', socket: 'AM5', chipset: 'B650', ramType: 'DDR5', ramSlots: 4, maxRamGb: 192, formFactor: 'mATX' }),
  part('motherboard', { id: 'mb-asus-b650-plus-d4', name: 'ASUS PRIME B650-PLUS', brand: 'ASUS', model: 'PRIME B650-PLUS', socket: 'AM5', chipset: 'B650', ramType: 'DDR5', ramSlots: 4, maxRamGb: 192, formFactor: 'ATX' }),
  part('motherboard', { id: 'mb-gigabyte-b650e-elite', name: 'Gigabyte B650E AORUS Elite AX', brand: 'Gigabyte', model: 'B650E AORUS Elite AX', socket: 'AM5', chipset: 'B650E', ramType: 'DDR5', ramSlots: 4, maxRamGb: 192, formFactor: 'ATX' }),
  part('motherboard', { id: 'mb-asus-x670e-hero', name: 'ASUS ROG Crosshair X670E Hero', brand: 'ASUS', model: 'ROG Crosshair X670E Hero', socket: 'AM5', chipset: 'X670E', ramType: 'DDR5', ramSlots: 4, maxRamGb: 192, formFactor: 'ATX' }),
  part('motherboard', { id: 'mb-asus-x570-tuf', name: 'ASUS TUF Gaming X570-Plus WiFi', brand: 'ASUS', model: 'TUF Gaming X570-Plus WiFi', socket: 'AM4', chipset: 'X570', ramType: 'DDR4', ramSlots: 4, maxRamGb: 128, formFactor: 'ATX' }),
  part('motherboard', { id: 'mb-asus-b760m-plus', name: 'ASUS PRIME B760M-PLUS D4', brand: 'ASUS', model: 'PRIME B760M-PLUS D4', socket: 'LGA1700', chipset: 'B760', ramType: 'DDR4', ramSlots: 4, maxRamGb: 128, formFactor: 'mATX' }),
  part('motherboard', { id: 'mb-msi-b760-gaming-plus', name: 'MSI PRO B760-P WiFi DDR5', brand: 'MSI', model: 'PRO B760-P WiFi DDR5', socket: 'LGA1700', chipset: 'B760', ramType: 'DDR5', ramSlots: 4, maxRamGb: 192, formFactor: 'ATX' }),
  part('motherboard', { id: 'mb-gigabyte-z790-aorus', name: 'Gigabyte Z790 AORUS Elite AX DDR5', brand: 'Gigabyte', model: 'Z790 AORUS Elite AX DDR5', socket: 'LGA1700', chipset: 'Z790', ramType: 'DDR5', ramSlots: 4, maxRamGb: 192, formFactor: 'ATX' }),
  part('motherboard', { id: 'mb-asus-z790-tuf', name: 'ASUS TUF Gaming Z790-Plus WiFi D4', brand: 'ASUS', model: 'TUF Gaming Z790-Plus WiFi D4', socket: 'LGA1700', chipset: 'Z790', ramType: 'DDR4', ramSlots: 4, maxRamGb: 128, formFactor: 'ATX' }),

  part('ram', { id: 'ram-kingston-ddr4-3200-16gb', name: 'Kingston Fury Beast 16GB DDR4-3200', brand: 'Kingston', model: 'Fury Beast 16GB DDR4', ramType: 'DDR4', capacityGb: 16, speedMhz: 3200 }),
  part('ram', { id: 'ram-corsair-ddr4-3600', name: 'Corsair Vengeance LPX 16GB DDR4-3600', brand: 'Corsair', model: 'Vengeance LPX DDR4', ramType: 'DDR4', capacityGb: 16, speedMhz: 3600 }),
  part('ram', { id: 'ram-gskill-ddr5-6000', name: 'G.Skill Flare X5 32GB DDR5-6000', brand: 'G.Skill', model: 'Flare X5 32GB DDR5', ramType: 'DDR5', capacityGb: 32, speedMhz: 6000 }),
  part('ram', { id: 'ram-kingston-ddr5-6000-32gb', name: 'Kingston Fury Beast 32GB DDR5-6000', brand: 'Kingston', model: 'Fury Beast 32GB DDR5', ramType: 'DDR5', capacityGb: 32, speedMhz: 6000 }),
  part('ram', { id: 'ram-corsair-ddr5-6400-32gb', name: 'Corsair Vengeance 32GB DDR5-6400', brand: 'Corsair', model: 'Vengeance DDR5-6400', ramType: 'DDR5', capacityGb: 32, speedMhz: 6400 }),
  part('ram', { id: 'ram-gskill-ddr5-6000-64gb', name: 'G.Skill Trident Z5 64GB DDR5-6000', brand: 'G.Skill', model: 'Trident Z5 64GB DDR5', ramType: 'DDR5', capacityGb: 64, speedMhz: 6000 }),

  part('gpu', { id: 'gpu-rx7600', name: 'Radeon RX 7600 8GB', brand: 'AMD', model: 'Radeon RX 7600', lengthMm: 245, tdpWatts: 165, benchmarkScore: 1340, fps1080p: 145, fps1440p: 95, fps4K: 54 }),
  part('gpu', { id: 'gpu-rx7700xt', name: 'Radeon RX 7700 XT 12GB', brand: 'AMD', model: 'Radeon RX 7700 XT', lengthMm: 300, tdpWatts: 245, benchmarkScore: 1750, fps1080p: 185, fps1440p: 128, fps4K: 72 }),
  part('gpu', { id: 'gpu-rx7800xt', name: 'Radeon RX 7800 XT 16GB', brand: 'AMD', model: 'Radeon RX 7800 XT', lengthMm: 300, tdpWatts: 263, benchmarkScore: 1980, fps1080p: 213, fps1440p: 146, fps4K: 85 }),
  part('gpu', { id: 'gpu-rx7900xtx', name: 'Radeon RX 7900 XTX 24GB', brand: 'AMD', model: 'Radeon RX 7900 XTX', lengthMm: 320, tdpWatts: 355, benchmarkScore: 2920, fps1080p: 286, fps1440p: 204, fps4K: 126 }),
  part('gpu', { id: 'gpu-rtx4060', name: 'GeForce RTX 4060 8GB', brand: 'NVIDIA', model: 'GeForce RTX 4060', lengthMm: 240, tdpWatts: 115, benchmarkScore: 1280, fps1080p: 152, fps1440p: 101, fps4K: 56 }),
  part('gpu', { id: 'gpu-rtx4060ti', name: 'GeForce RTX 4060 Ti 16GB', brand: 'NVIDIA', model: 'GeForce RTX 4060 Ti', lengthMm: 268, tdpWatts: 165, benchmarkScore: 1520, fps1080p: 171, fps1440p: 118, fps4K: 66 }),
  part('gpu', { id: 'gpu-rtx4070', name: 'GeForce RTX 4070 12GB', brand: 'NVIDIA', model: 'GeForce RTX 4070', lengthMm: 300, tdpWatts: 200, benchmarkScore: 1880, fps1080p: 200, fps1440p: 138, fps4K: 79 }),
  part('gpu', { id: 'gpu-rtx4070super', name: 'GeForce RTX 4070 SUPER 12GB', brand: 'NVIDIA', model: 'GeForce RTX 4070 SUPER', lengthMm: 308, tdpWatts: 220, benchmarkScore: 2050, fps1080p: 215, fps1440p: 151, fps4K: 86 }),
  part('gpu', { id: 'gpu-rtx4070tisuper', name: 'GeForce RTX 4070 Ti SUPER 16GB', brand: 'NVIDIA', model: 'GeForce RTX 4070 Ti SUPER', lengthMm: 320, tdpWatts: 285, benchmarkScore: 2420, fps1080p: 245, fps1440p: 173, fps4K: 102 }),
  part('gpu', { id: 'gpu-rtx4080super', name: 'GeForce RTX 4080 SUPER 16GB', brand: 'NVIDIA', model: 'GeForce RTX 4080 SUPER', lengthMm: 336, tdpWatts: 320, benchmarkScore: 2810, fps1080p: 278, fps1440p: 196, fps4K: 118 }),
  part('gpu', { id: 'gpu-rtx4090', name: 'GeForce RTX 4090 24GB', brand: 'NVIDIA', model: 'GeForce RTX 4090', lengthMm: 340, tdpWatts: 450, benchmarkScore: 3320, fps1080p: 321, fps1440p: 232, fps4K: 144 }),
  part('gpu', { id: 'gpu-rtx5070', name: 'GeForce RTX 5070 12GB', brand: 'NVIDIA', model: 'GeForce RTX 5070', lengthMm: 304, tdpWatts: 250, benchmarkScore: 2290, fps1080p: 232, fps1440p: 164, fps4K: 96 }),
  part('gpu', { id: 'gpu-rtx5070ti', name: 'GeForce RTX 5070 Ti 16GB', brand: 'NVIDIA', model: 'GeForce RTX 5070 Ti', lengthMm: 318, tdpWatts: 300, benchmarkScore: 2620, fps1080p: 258, fps1440p: 183, fps4K: 108 }),
  part('gpu', { id: 'gpu-rtx5080', name: 'GeForce RTX 5080 16GB', brand: 'NVIDIA', model: 'GeForce RTX 5080', lengthMm: 330, tdpWatts: 360, benchmarkScore: 3040, fps1080p: 294, fps1440p: 211, fps4K: 129 }),

  part('storage', { id: 'ssd-kingston-kc3000-1tb', name: 'Kingston KC3000 1TB NVMe', brand: 'Kingston', model: 'KC3000 1TB', capacityGb: 1000 }),
  part('storage', { id: 'ssd-wd-sn850x-2tb', name: 'WD Black SN850X 2TB NVMe', brand: 'Western Digital', model: 'Black SN850X 2TB', capacityGb: 2000 }),
  part('storage', { id: 'ssd-samsung-990pro-2tb', name: 'Samsung 990 Pro 2TB NVMe', brand: 'Samsung', model: '990 Pro 2TB', capacityGb: 2000 }),
  part('storage', { id: 'ssd-crucial-t705-1tb', name: 'Crucial T705 1TB PCIe Gen5 NVMe', brand: 'Crucial', model: 'T705 1TB', capacityGb: 1000 }),
  part('storage', { id: 'ssd-crucial-t705-2tb', name: 'Crucial T705 2TB PCIe Gen5 NVMe', brand: 'Crucial', model: 'T705 2TB', capacityGb: 2000 }),

  part('psu', { id: 'psu-seasonic-focus-750', name: 'Seasonic Focus GX 750W', brand: 'Seasonic', model: 'Focus GX 750', psuWatts: 750, psuFormFactor: 'ATX' }),
  part('psu', { id: 'psu-corsair-rm850x', name: 'Corsair RM850x 850W', brand: 'Corsair', model: 'RM850x', psuWatts: 850, psuFormFactor: 'ATX' }),
  part('psu', { id: 'psu-seasonic-prime-850tx', name: 'Seasonic Prime TX-850', brand: 'Seasonic', model: 'Prime TX-850', psuWatts: 850, psuFormFactor: 'ATX' }),
  part('psu', { id: 'psu-corsair-rm1000x', name: 'Corsair RM1000x 1000W', brand: 'Corsair', model: 'RM1000x', psuWatts: 1000, psuFormFactor: 'ATX' }),
  part('psu', { id: 'psu-corsair-sf750', name: 'Corsair SF750 750W SFX', brand: 'Corsair', model: 'SF750', psuWatts: 750, psuFormFactor: 'SFX' }),

  part('case', { id: 'case-corsair-4000d', name: 'Corsair 4000D Airflow', brand: 'Corsair', model: '4000D Airflow', formFactor: 'ATX', lengthMm: 360, heightMm: 170, psuFormFactor: 'ATX' }),
  part('case', { id: 'case-lianli-o11d', name: 'Lian Li PC-O11 Dynamic', brand: 'Lian Li', model: 'PC-O11 Dynamic', formFactor: 'ATX', lengthMm: 420, heightMm: 167, psuFormFactor: 'ATX' }),
  part('case', { id: 'case-fractal-north', name: 'Fractal Design North', brand: 'Fractal', model: 'North', formFactor: 'ATX', lengthMm: 355, heightMm: 170, psuFormFactor: 'ATX' }),
  part('case', { id: 'case-fractal-define7', name: 'Fractal Design Define 7', brand: 'Fractal', model: 'Define 7', formFactor: 'ATX', lengthMm: 360, heightMm: 185, psuFormFactor: 'ATX' }),
  part('case', { id: 'case-phanteks-p400a', name: 'Phanteks Eclipse P400A', brand: 'Phanteks', model: 'Eclipse P400A', formFactor: 'ATX', lengthMm: 420, heightMm: 160, psuFormFactor: 'ATX' }),
  part('case', { id: 'case-lianli-lancool-216', name: 'Lian Li Lancool 216', brand: 'Lian Li', model: 'Lancool 216', formFactor: 'ATX', lengthMm: 392, heightMm: 180, psuFormFactor: 'ATX' }),
  part('case', { id: 'case-coolermaster-nr400', name: 'Cooler Master NR400', brand: 'Cooler Master', model: 'NR400', formFactor: 'mATX', lengthMm: 346, heightMm: 166, psuFormFactor: 'ATX' }),
  part('case', { id: 'case-coolermaster-nr200p', name: 'Cooler Master NR200P', brand: 'Cooler Master', model: 'NR200P', formFactor: 'mATX', lengthMm: 330, heightMm: 153, psuFormFactor: 'SFX' }),

  part('cooler', { id: 'cooler-id-frost', name: 'ID-Cooling Frostflow X 120', brand: 'ID-Cooling', model: 'Frostflow X 120', socket: 'AM4,AM5,LGA1700', heightMm: 154 }),
  part('cooler', { id: 'cooler-noctua-nhu12a', name: 'Noctua NH-U12A', brand: 'Noctua', model: 'NH-U12A', socket: 'AM4,AM5,LGA1700', heightMm: 158 }),
  part('cooler', { id: 'cooler-deepcool-ak620', name: 'DeepCool AK620', brand: 'DeepCool', model: 'AK620', socket: 'AM4,AM5,LGA1700', heightMm: 160 }),
  part('cooler', { id: 'cooler-noctua-nhd15', name: 'Noctua NH-D15', brand: 'Noctua', model: 'NH-D15', socket: 'AM4,AM5,LGA1700', heightMm: 165 }),
  part('cooler', { id: 'cooler-corsair-h150i-elite', name: 'Corsair iCUE H150i Elite', brand: 'Corsair', model: 'H150i Elite', socket: 'AM4,AM5,LGA1700', heightMm: 55 }),
  part('cooler', { id: 'cooler-arctic-lf3-360', name: 'Arctic Liquid Freezer III 360', brand: 'Arctic', model: 'Liquid Freezer III 360', socket: 'AM4,AM5,LGA1700', heightMm: 55 }),

  part('fan', { id: 'fan-arctic-p12', name: 'Arctic P12 PWM', brand: 'Arctic', model: 'P12 PWM' }),
  part('fan', { id: 'fan-noctua-nf-a12x25', name: 'Noctua NF-A12x25', brand: 'Noctua', model: 'NF-A12x25' }),
  part('fan', { id: 'fan-noctua-nf-p14s-redux', name: 'Noctua NF-P14s Redux', brand: 'Noctua', model: 'NF-P14s Redux' }),
  part('fan', { id: 'fan-bequiet-silent-wings-4', name: 'be quiet! Silent Wings 4', brand: 'be quiet!', model: 'Silent Wings 4' }),
  part('fan', { id: 'fan-corsair-ll120-3pack', name: 'Corsair LL120 RGB 3-Pack', brand: 'Corsair', model: 'LL120 RGB 3-Pack' }),
]

export const STATIC_PARTS_BY_ID = new Map(STATIC_PARTS.map((p) => [p.id, p]))

export function getStaticPartById(partId: string): PartWithCategory | null {
  return STATIC_PARTS_BY_ID.get(partId) ?? null
}

export function getStaticPartsByCategory(categorySlug: string): PartWithCategory[] {
  return STATIC_PARTS.filter((part) => part.category.slug === categorySlug)
}

export function getStaticParts(): PartWithCategory[] {
  return STATIC_PARTS
}

export function toPart(partWithCategory: PartWithCategory): Part {
  return partWithCategory
}
