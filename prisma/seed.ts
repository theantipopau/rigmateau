// RigMate AU – Comprehensive Part Catalog Seed
// AMD Ryzen 5000/7000/9000 + Intel 13th/14th Gen + full GPU lineup
// Prices reflect AU market (May 2026)

import { PrismaLibSql } from '@prisma/adapter-libsql'
import { PrismaClient } from '../app/generated/prisma/index.js'

const adapter = new PrismaLibSql({ url: 'file:E:/RigMateAU/dev.db' })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Seeding RigMate AU database...')

  // ─── Categories ────────────────────────────────────────────────────────────
  const categories = await Promise.all([
    prisma.category.upsert({ where: { slug: 'cpu' },        update: {}, create: { slug: 'cpu',        name: 'CPU',        safeImport: true  } }),
    prisma.category.upsert({ where: { slug: 'motherboard' },update: {}, create: { slug: 'motherboard', name: 'Motherboard',safeImport: false } }),
    prisma.category.upsert({ where: { slug: 'ram' },        update: {}, create: { slug: 'ram',        name: 'RAM',        safeImport: false } }),
    prisma.category.upsert({ where: { slug: 'gpu' },        update: {}, create: { slug: 'gpu',        name: 'GPU',        safeImport: false } }),
    prisma.category.upsert({ where: { slug: 'storage' },    update: {}, create: { slug: 'storage',    name: 'Storage',    safeImport: false } }),
    prisma.category.upsert({ where: { slug: 'psu' },        update: {}, create: { slug: 'psu',        name: 'PSU',        safeImport: false } }),
    prisma.category.upsert({ where: { slug: 'case' },       update: {}, create: { slug: 'case',       name: 'Case',       safeImport: true  } }),
    prisma.category.upsert({ where: { slug: 'cooler' },     update: {}, create: { slug: 'cooler',     name: 'CPU Cooler', safeImport: true  } }),
    prisma.category.upsert({ where: { slug: 'fan' },        update: {}, create: { slug: 'fan',        name: 'Case Fan',   safeImport: true  } }),
  ])
  const cat = Object.fromEntries(categories.map(c => [c.slug, c]))

  // ─── Retailers ─────────────────────────────────────────────────────────────
  await Promise.all([
    prisma.retailer.upsert({ where: { slug: 'scorptec'   }, update: {}, create: { id: 'scorptec',   name: 'Scorptec',        slug: 'scorptec',   url: 'https://www.scorptec.com.au',    country: 'AU', source: 'local'      } }),
    prisma.retailer.upsert({ where: { slug: 'pccg'       }, update: {}, create: { id: 'pccg',       name: 'PC Case Gear',    slug: 'pccg',       url: 'https://www.pccasegear.com',     country: 'AU', source: 'local'      } }),
    prisma.retailer.upsert({ where: { slug: 'ple'        }, update: {}, create: { id: 'ple',        name: 'PLE Computers',   slug: 'ple',        url: 'https://www.ple.com.au',         country: 'AU', source: 'local'      } }),
    prisma.retailer.upsert({ where: { slug: 'msy'        }, update: {}, create: { id: 'msy',        name: 'MSY Technology',  slug: 'msy',        url: 'https://www.msy.com.au',         country: 'AU', source: 'local'      } }),
    prisma.retailer.upsert({ where: { slug: 'umart'      }, update: {}, create: { id: 'umart',      name: 'Umart',           slug: 'umart',      url: 'https://www.umart.com.au',       country: 'AU', source: 'local'      } }),
    prisma.retailer.upsert({ where: { slug: 'centrecom'  }, update: {}, create: { id: 'centrecom',  name: 'Centre Com',      slug: 'centrecom',  url: 'https://www.centrecom.com.au',   country: 'AU', source: 'local'      } }),
    prisma.retailer.upsert({ where: { slug: 'ebay-au'    }, update: {}, create: { id: 'ebay-au',    name: 'eBay Australia',  slug: 'ebay-au',    url: 'https://www.ebay.com.au',        country: 'AU', source: 'ebay'       } }),
    prisma.retailer.upsert({ where: { slug: 'aliexpress' }, update: {}, create: { id: 'aliexpress', name: 'AliExpress',      slug: 'aliexpress', url: 'https://www.aliexpress.com',     country: 'CN', source: 'aliexpress' } }),
  ])

  // ═══════════════════════════════════════════════════════════════════════════
  // CPUs
  // ═══════════════════════════════════════════════════════════════════════════

  // ── AMD Ryzen 5000 (AM4) ──────────────────────────────────────────────────
  await prisma.part.upsert({ where: { id: 'cpu-r5-5600' }, update: {}, create: {
    id: 'cpu-r5-5600', categoryId: cat.cpu.id,
    name: 'AMD Ryzen 5 5600', brand: 'AMD', model: 'Ryzen 5 5600', sku: '100-100000927BOX',
    socket: 'AM4', cores: 6, threads: 12, boostClockMhz: 4600, baseCockMhz: 3500, cacheMb: 35, tdpWatts: 65, benchmarkScore: 1520,
    description: 'Best budget AM4 CPU. 6C/12T, 65W TDP. Exceptional value for gaming.',
  }})

  await prisma.part.upsert({ where: { id: 'cpu-r7-5700x' }, update: {}, create: {
    id: 'cpu-r7-5700x', categoryId: cat.cpu.id,
    name: 'AMD Ryzen 7 5700X', brand: 'AMD', model: 'Ryzen 7 5700X', sku: '100-100000926WOF',
    socket: 'AM4', cores: 8, threads: 16, boostClockMhz: 4600, baseCockMhz: 3400, cacheMb: 36, tdpWatts: 65, benchmarkScore: 1750,
    description: '8C/16T at 65W. Excellent AM4 gaming CPU, drops in as upgrade for existing builds.',
  }})

  await prisma.part.upsert({ where: { id: 'cpu-r9-5900x' }, update: {}, create: {
    id: 'cpu-r9-5900x', categoryId: cat.cpu.id,
    name: 'AMD Ryzen 9 5900X', brand: 'AMD', model: 'Ryzen 9 5900X', sku: '100-100000061WOF',
    socket: 'AM4', cores: 12, threads: 24, boostClockMhz: 4800, baseCockMhz: 3700, cacheMb: 70, tdpWatts: 105, benchmarkScore: 2100,
    description: '12C/24T workstation + gaming beast. Still relevant for content creation.',
  }})

  // ── AMD Ryzen 7000 (AM5) ──────────────────────────────────────────────────
  await prisma.part.upsert({ where: { id: 'cpu-r7-7600' }, update: {}, create: {
    id: 'cpu-r7-7600', categoryId: cat.cpu.id,
    name: 'AMD Ryzen 5 7600', brand: 'AMD', model: 'Ryzen 5 7600', sku: '100-100001015BOX',
    socket: 'AM5', cores: 6, threads: 12, boostClockMhz: 5100, baseCockMhz: 3800, cacheMb: 38, tdpWatts: 65, benchmarkScore: 1780,
    description: 'Best value AM5 entry CPU. PCIe 5.0, DDR5, fast IPC.',
  }})

  await prisma.part.upsert({ where: { id: 'cpu-r7-7600x' }, update: {}, create: {
    id: 'cpu-r7-7600x', categoryId: cat.cpu.id,
    name: 'AMD Ryzen 5 7600X', brand: 'AMD', model: 'Ryzen 5 7600X', sku: '100-100000593WOF',
    socket: 'AM5', cores: 6, threads: 12, boostClockMhz: 5300, baseCockMhz: 4700, cacheMb: 38, tdpWatts: 105, benchmarkScore: 1850,
    description: '6C/12T with higher clocks than 7600. Great for mid-range AM5 builds.',
  }})

  await prisma.part.upsert({ where: { id: 'cpu-r7-7700x' }, update: {}, create: {
    id: 'cpu-r7-7700x', categoryId: cat.cpu.id,
    name: 'AMD Ryzen 7 7700X', brand: 'AMD', model: 'Ryzen 7 7700X', sku: '100-100000591WOF',
    socket: 'AM5', cores: 8, threads: 16, boostClockMhz: 5400, baseCockMhz: 4500, cacheMb: 40, tdpWatts: 105, benchmarkScore: 2050,
    description: '8C/16T AM5. Strong single-core performance for gaming.',
  }})

  await prisma.part.upsert({ where: { id: 'cpu-r7-7800x3d' }, update: {}, create: {
    id: 'cpu-r7-7800x3d', categoryId: cat.cpu.id,
    name: 'AMD Ryzen 7 7800X3D', brand: 'AMD', model: 'Ryzen 7 7800X3D', sku: '100-100000910WOF',
    socket: 'AM5', cores: 8, threads: 16, boostClockMhz: 5050, baseCockMhz: 4200, cacheMb: 96, tdpWatts: 120, benchmarkScore: 2340,
    description: 'Best gaming CPU. 96MB 3D V-Cache. Unmatched in 1440p and 4K gaming.',
  }})

  await prisma.part.upsert({ where: { id: 'cpu-r9-7900x' }, update: {}, create: {
    id: 'cpu-r9-7900x', categoryId: cat.cpu.id,
    name: 'AMD Ryzen 9 7900X', brand: 'AMD', model: 'Ryzen 9 7900X', sku: '100-100000589WOF',
    socket: 'AM5', cores: 12, threads: 24, boostClockMhz: 5600, baseCockMhz: 4700, cacheMb: 76, tdpWatts: 170, benchmarkScore: 2480,
    description: '12C/24T productivity + gaming powerhouse. Great for streaming and creative work.',
  }})

  // ── AMD Ryzen 9000 (AM5) ──────────────────────────────────────────────────
  await prisma.part.upsert({ where: { id: 'cpu-r7-9700x' }, update: {}, create: {
    id: 'cpu-r7-9700x', categoryId: cat.cpu.id,
    name: 'AMD Ryzen 7 9700X', brand: 'AMD', model: 'Ryzen 7 9700X', sku: '100-100001404WOF',
    socket: 'AM5', cores: 8, threads: 16, boostClockMhz: 5500, baseCockMhz: 3800, cacheMb: 40, tdpWatts: 65, benchmarkScore: 2180,
    description: 'Zen 5 architecture. Exceptional IPC uplift, 65W TDP. Top gaming value for AM5.',
  }})

  await prisma.part.upsert({ where: { id: 'cpu-r9-9900x' }, update: {}, create: {
    id: 'cpu-r9-9900x', categoryId: cat.cpu.id,
    name: 'AMD Ryzen 9 9900X', brand: 'AMD', model: 'Ryzen 9 9900X', sku: '100-100001402WOF',
    socket: 'AM5', cores: 12, threads: 24, boostClockMhz: 5600, baseCockMhz: 4400, cacheMb: 76, tdpWatts: 120, benchmarkScore: 2610,
    description: 'Zen 5, 12C/24T. Best all-rounder for gaming + professional workloads.',
  }})

  await prisma.part.upsert({ where: { id: 'cpu-r9-9950x' }, update: {}, create: {
    id: 'cpu-r9-9950x', categoryId: cat.cpu.id,
    name: 'AMD Ryzen 9 9950X', brand: 'AMD', model: 'Ryzen 9 9950X', sku: '100-100001405WOF',
    socket: 'AM5', cores: 16, threads: 32, boostClockMhz: 5700, baseCockMhz: 4300, cacheMb: 80, tdpWatts: 170, benchmarkScore: 3100,
    description: 'Zen 5 flagship. 16C/32T. Exceptional for 3D rendering, video editing, compiling.',
  }})

  // ── Intel 13th Gen (LGA1700) ──────────────────────────────────────────────
  await prisma.part.upsert({ where: { id: 'cpu-i5-13600k' }, update: {}, create: {
    id: 'cpu-i5-13600k', categoryId: cat.cpu.id,
    name: 'Intel Core i5-13600K', brand: 'Intel', model: 'Core i5-13600K', sku: 'BX8071513600K',
    socket: 'LGA1700', cores: 14, threads: 20, boostClockMhz: 5100, baseCockMhz: 3500, cacheMb: 24, tdpWatts: 125, benchmarkScore: 2080,
    description: '14C (6P+8E) Intel gaming & productivity CPU. Outstanding for the money.',
  }})

  await prisma.part.upsert({ where: { id: 'cpu-i7-13700k' }, update: {}, create: {
    id: 'cpu-i7-13700k', categoryId: cat.cpu.id,
    name: 'Intel Core i7-13700K', brand: 'Intel', model: 'Core i7-13700K', sku: 'BX8071513700K',
    socket: 'LGA1700', cores: 16, threads: 24, boostClockMhz: 5400, baseCockMhz: 3400, cacheMb: 30, tdpWatts: 125, benchmarkScore: 2380,
    description: '16C (8P+8E) powerhouse. Great for gaming, streaming, and creative work.',
  }})

  // ── Intel 14th Gen (LGA1700) ──────────────────────────────────────────────
  await prisma.part.upsert({ where: { id: 'cpu-i5-14600k' }, update: {}, create: {
    id: 'cpu-i5-14600k', categoryId: cat.cpu.id,
    name: 'Intel Core i5-14600K', brand: 'Intel', model: 'Core i5-14600K', sku: 'BX8071514600K',
    socket: 'LGA1700', cores: 14, threads: 20, boostClockMhz: 5300, baseCockMhz: 3500, cacheMb: 24, tdpWatts: 125, benchmarkScore: 2150,
    description: '14C (6P+8E), refined Raptor Lake. Excellent value mid-range CPU.',
  }})

  await prisma.part.upsert({ where: { id: 'cpu-i7-14700k' }, update: {}, create: {
    id: 'cpu-i7-14700k', categoryId: cat.cpu.id,
    name: 'Intel Core i7-14700K', brand: 'Intel', model: 'Core i7-14700K', sku: 'BX8071514700K',
    socket: 'LGA1700', cores: 20, threads: 28, boostClockMhz: 5600, baseCockMhz: 3400, cacheMb: 33, tdpWatts: 125, benchmarkScore: 2550,
    description: '20C (8P+12E). Best Intel for combined gaming + heavy workloads.',
  }})

  await prisma.part.upsert({ where: { id: 'cpu-i9-14900k' }, update: {}, create: {
    id: 'cpu-i9-14900k', categoryId: cat.cpu.id,
    name: 'Intel Core i9-14900K', brand: 'Intel', model: 'Core i9-14900K', sku: 'BX8071514900K',
    socket: 'LGA1700', cores: 24, threads: 32, boostClockMhz: 6000, baseCockMhz: 3200, cacheMb: 36, tdpWatts: 125, benchmarkScore: 2900,
    description: '24C (8P+16E). Flagship Intel. Extreme multi-threaded performance.',
  }})

  // ═══════════════════════════════════════════════════════════════════════════
  // MOTHERBOARDS
  // ═══════════════════════════════════════════════════════════════════════════

  // ── AM4 Boards ────────────────────────────────────────────────────────────
  await prisma.part.upsert({ where: { id: 'mb-msi-b550-gaming-plus' }, update: {}, create: {
    id: 'mb-msi-b550-gaming-plus', categoryId: cat.motherboard.id,
    name: 'MSI MAG B550 TOMAHAWK', brand: 'MSI', model: 'MAG B550 TOMAHAWK',
    socket: 'AM4', chipset: 'B550', ramType: 'DDR4', ramSlots: 4, maxRamGb: 128, formFactor: 'ATX',
    description: 'Popular B550 ATX board. Strong VRM, PCIe 4.0, great for Ryzen 5000.',
  }})

  await prisma.part.upsert({ where: { id: 'mb-asus-b550f' }, update: {}, create: {
    id: 'mb-asus-b550f', categoryId: cat.motherboard.id,
    name: 'ASUS ROG Strix B550-F Gaming WiFi', brand: 'ASUS', model: 'ROG Strix B550-F Gaming WiFi',
    socket: 'AM4', chipset: 'B550', ramType: 'DDR4', ramSlots: 4, maxRamGb: 128, formFactor: 'ATX',
    description: 'Premium B550 with WiFi 6, 2.5Gb LAN, and excellent VRM for overclocking.',
  }})

  await prisma.part.upsert({ where: { id: 'mb-gigabyte-x570' }, update: {}, create: {
    id: 'mb-gigabyte-x570', categoryId: cat.motherboard.id,
    name: 'Gigabyte X570 AORUS Elite', brand: 'Gigabyte', model: 'X570 AORUS Elite',
    socket: 'AM4', chipset: 'X570', ramType: 'DDR4', ramSlots: 4, maxRamGb: 128, formFactor: 'ATX',
    description: 'High-end AM4 X570 board. PCIe 4.0 everywhere, full feature set for Ryzen 5000.',
  }})

  await prisma.part.upsert({ where: { id: 'mb-asus-x570-tuf' }, update: {}, create: {
    id: 'mb-asus-x570-tuf', categoryId: cat.motherboard.id,
    name: 'ASUS TUF Gaming X570-Plus WiFi', brand: 'ASUS', model: 'TUF Gaming X570-Plus WiFi',
    socket: 'AM4', chipset: 'X570', ramType: 'DDR4', ramSlots: 4, maxRamGb: 128, formFactor: 'ATX',
    description: 'Reliable X570 with PCIe 4.0, built-in WiFi, robust power delivery.',
  }})

  // ── AM5 Boards ────────────────────────────────────────────────────────────
  await prisma.part.upsert({ where: { id: 'mb-msi-b650m' }, update: {}, create: {
    id: 'mb-msi-b650m', categoryId: cat.motherboard.id,
    name: 'MSI MAG B650M Mortar WiFi', brand: 'MSI', model: 'MAG B650M Mortar WiFi',
    socket: 'AM5', chipset: 'B650', ramType: 'DDR5', ramSlots: 4, maxRamGb: 192, formFactor: 'mATX',
    description: 'Best value AM5 mATX board. WiFi 6E, PCIe 5.0 NVMe, 2.5Gb LAN.',
  }})

  await prisma.part.upsert({ where: { id: 'mb-asus-b650-plus-d4' }, update: {}, create: {
    id: 'mb-asus-b650-plus-d4', categoryId: cat.motherboard.id,
    name: 'ASUS PRIME B650-PLUS', brand: 'ASUS', model: 'PRIME B650-PLUS',
    socket: 'AM5', chipset: 'B650', ramType: 'DDR5', ramSlots: 4, maxRamGb: 192, formFactor: 'ATX',
    description: 'Entry B650 ATX for AM5. PCIe 5.0, USB 3.2 Gen 2, solid budget option.',
  }})

  await prisma.part.upsert({ where: { id: 'mb-gigabyte-b650e-elite' }, update: {}, create: {
    id: 'mb-gigabyte-b650e-elite', categoryId: cat.motherboard.id,
    name: 'Gigabyte B650E AORUS Elite AX ICE', brand: 'Gigabyte', model: 'B650E AORUS Elite AX ICE',
    socket: 'AM5', chipset: 'B650E', ramType: 'DDR5', ramSlots: 4, maxRamGb: 192, formFactor: 'ATX',
    description: 'B650E with PCIe 5.0 GPU slot, WiFi 6E. Excellent mid-range AM5 choice.',
  }})

  await prisma.part.upsert({ where: { id: 'mb-asus-x670e-hero' }, update: {}, create: {
    id: 'mb-asus-x670e-hero', categoryId: cat.motherboard.id,
    name: 'ASUS ROG Crosshair X670E Hero', brand: 'ASUS', model: 'ROG Crosshair X670E Hero',
    socket: 'AM5', chipset: 'X670E', ramType: 'DDR5', ramSlots: 4, maxRamGb: 192, formFactor: 'ATX',
    description: 'Flagship AM5 board. Extreme VRM, WiFi 7, USB4, PCIe 5.0 x16.',
  }})

  await prisma.part.upsert({ where: { id: 'mb-msi-x670e-apex' }, update: {}, create: {
    id: 'mb-msi-x670e-apex', categoryId: cat.motherboard.id,
    name: 'MSI MEG X670E ACE', brand: 'MSI', model: 'MEG X670E ACE',
    socket: 'AM5', chipset: 'X670E', ramType: 'DDR5', ramSlots: 4, maxRamGb: 192, formFactor: 'ATX',
    description: 'Premium X670E flagship. Dual PCIe 5.0, robust 18-phase VRM, overclocking ready.',
  }})

  // ── LGA1700 Boards (Intel 12/13/14th Gen) ─────────────────────────────────
  await prisma.part.upsert({ where: { id: 'mb-asus-b760m-plus' }, update: {}, create: {
    id: 'mb-asus-b760m-plus', categoryId: cat.motherboard.id,
    name: 'ASUS PRIME B760M-PLUS D4', brand: 'ASUS', model: 'PRIME B760M-PLUS D4',
    socket: 'LGA1700', chipset: 'B760', ramType: 'DDR4', ramSlots: 4, maxRamGb: 128, formFactor: 'mATX',
    description: 'Budget LGA1700 mATX board with DDR4. Good for i5-13600K and i5-14600K builds.',
  }})

  await prisma.part.upsert({ where: { id: 'mb-msi-b760-gaming-plus' }, update: {}, create: {
    id: 'mb-msi-b760-gaming-plus', categoryId: cat.motherboard.id,
    name: 'MSI PRO B760-P WiFi DDR5', brand: 'MSI', model: 'PRO B760-P WiFi DDR5',
    socket: 'LGA1700', chipset: 'B760', ramType: 'DDR5', ramSlots: 4, maxRamGb: 192, formFactor: 'ATX',
    description: 'Mid-range B760 ATX with DDR5 and WiFi. Excellent value for Intel builds.',
  }})

  await prisma.part.upsert({ where: { id: 'mb-gigabyte-z790-aorus' }, update: {}, create: {
    id: 'mb-gigabyte-z790-aorus', categoryId: cat.motherboard.id,
    name: 'Gigabyte Z790 AORUS Elite AX DDR5', brand: 'Gigabyte', model: 'Z790 AORUS Elite AX DDR5',
    socket: 'LGA1700', chipset: 'Z790', ramType: 'DDR5', ramSlots: 4, maxRamGb: 192, formFactor: 'ATX',
    description: 'Mid-high Z790 with DDR5. Overclocking support, WiFi 6E, 2.5G LAN.',
  }})

  await prisma.part.upsert({ where: { id: 'mb-asus-z790-tuf' }, update: {}, create: {
    id: 'mb-asus-z790-tuf', categoryId: cat.motherboard.id,
    name: 'ASUS TUF Gaming Z790-Plus WiFi D4', brand: 'ASUS', model: 'TUF Gaming Z790-Plus WiFi D4',
    socket: 'LGA1700', chipset: 'Z790', ramType: 'DDR4', ramSlots: 4, maxRamGb: 128, formFactor: 'ATX',
    description: 'Reliable Z790 with DDR4 – great for upgrading existing DDR4 systems.',
  }})

  await prisma.part.upsert({ where: { id: 'mb-asus-rog-z790-extreme' }, update: {}, create: {
    id: 'mb-asus-rog-z790-extreme', categoryId: cat.motherboard.id,
    name: 'ASUS ROG Maximus Z790 Extreme', brand: 'ASUS', model: 'ROG Maximus Z790 Extreme',
    socket: 'LGA1700', chipset: 'Z790', ramType: 'DDR5', ramSlots: 4, maxRamGb: 192, formFactor: 'ATX',
    description: 'HEDT flagship Intel board. 24+1 VRM stages, Thunderbolt 4, WiFi 7.',
  }})

  // ═══════════════════════════════════════════════════════════════════════════
  // RAM
  // ═══════════════════════════════════════════════════════════════════════════

  // ── DDR4 ──────────────────────────────────────────────────────────────────
  await prisma.part.upsert({ where: { id: 'ram-kingston-ddr4-3200-16gb' }, update: {}, create: {
    id: 'ram-kingston-ddr4-3200-16gb', categoryId: cat.ram.id,
    name: 'Kingston Fury Beast 16GB DDR4-3200', brand: 'Kingston', model: 'Fury Beast 16GB DDR4-3200 (2x8GB)',
    sku: 'KF432C16BBK2/16', ramType: 'DDR4', capacityGb: 16, speedMhz: 3200,
    description: '2x8GB DDR4-3200 CL16. Entry budget kit for AM4/LGA1700.',
  }})

  await prisma.part.upsert({ where: { id: 'ram-corsair-ddr4-3600' }, update: {}, create: {
    id: 'ram-corsair-ddr4-3600', categoryId: cat.ram.id,
    name: 'Corsair Vengeance LPX 32GB DDR4-3600', brand: 'Corsair', model: 'Vengeance LPX 32GB DDR4-3600 (2x16GB)',
    sku: 'CMK32GX4M2D3600C18', ramType: 'DDR4', capacityGb: 32, speedMhz: 3600,
    description: '2x16GB DDR4-3600 CL18. Sweet spot for AM4 performance.',
  }})

  await prisma.part.upsert({ where: { id: 'ram-gskill-ddr4-3600-32gb' }, update: {}, create: {
    id: 'ram-gskill-ddr4-3600-32gb', categoryId: cat.ram.id,
    name: 'G.Skill Ripjaws V 32GB DDR4-3600', brand: 'G.Skill', model: 'Ripjaws V 32GB DDR4-3600 (2x16GB)',
    sku: 'F4-3600C18D-32GVK', ramType: 'DDR4', capacityGb: 32, speedMhz: 3600,
    description: '2x16GB DDR4-3600 CL18. Classic reliable kit for AM4 and Intel DDR4 boards.',
  }})

  await prisma.part.upsert({ where: { id: 'ram-corsair-ddr4-3200-64gb' }, update: {}, create: {
    id: 'ram-corsair-ddr4-3200-64gb', categoryId: cat.ram.id,
    name: 'Corsair Vengeance LPX 64GB DDR4-3200', brand: 'Corsair', model: 'Vengeance LPX 64GB DDR4-3200 (4x16GB)',
    sku: 'CMK64GX4M4E3200C16', ramType: 'DDR4', capacityGb: 64, speedMhz: 3200,
    description: '4x16GB DDR4-3200 CL16. For workstations needing max memory.',
  }})

  // ── DDR5 ──────────────────────────────────────────────────────────────────
  await prisma.part.upsert({ where: { id: 'ram-gskill-ddr5-5600-16gb' }, update: {}, create: {
    id: 'ram-gskill-ddr5-5600-16gb', categoryId: cat.ram.id,
    name: 'G.Skill Ripjaws S5 16GB DDR5-5600', brand: 'G.Skill', model: 'Ripjaws S5 16GB DDR5-5600 (2x8GB)',
    sku: 'F5-5600J2834A8GX2-RS5K', ramType: 'DDR5', capacityGb: 16, speedMhz: 5600,
    description: '2x8GB DDR5-5600 CL28. Budget entry DDR5 for AM5/LGA1700.',
  }})

  await prisma.part.upsert({ where: { id: 'ram-gskill-ddr5-6000' }, update: {}, create: {
    id: 'ram-gskill-ddr5-6000', categoryId: cat.ram.id,
    name: 'G.Skill Trident Z5 32GB DDR5-6000', brand: 'G.Skill', model: 'Trident Z5 32GB DDR5-6000 (2x16GB)',
    sku: 'F5-6000J3040G16GX2-TZ5K', ramType: 'DDR5', capacityGb: 32, speedMhz: 6000,
    description: '2x16GB DDR5-6000 CL30. Sweet spot for Ryzen 7000/9000 performance.',
  }})

  await prisma.part.upsert({ where: { id: 'ram-kingston-ddr5-6000-32gb' }, update: {}, create: {
    id: 'ram-kingston-ddr5-6000-32gb', categoryId: cat.ram.id,
    name: 'Kingston Fury Beast 32GB DDR5-6000', brand: 'Kingston', model: 'Fury Beast 32GB DDR5-6000 (2x16GB)',
    sku: 'KF560C40BBK2-32', ramType: 'DDR5', capacityGb: 32, speedMhz: 6000,
    description: '2x16GB DDR5-6000 CL40. EXPO profile for AM5, XMP for Intel.',
  }})

  await prisma.part.upsert({ where: { id: 'ram-corsair-ddr5-6400-32gb' }, update: {}, create: {
    id: 'ram-corsair-ddr5-6400-32gb', categoryId: cat.ram.id,
    name: 'Corsair Dominator Titanium 32GB DDR5-6400', brand: 'Corsair', model: 'Dominator Titanium 32GB DDR5-6400 (2x16GB)',
    sku: 'CMP32GX5M2B6400C32', ramType: 'DDR5', capacityGb: 32, speedMhz: 6400,
    description: '2x16GB DDR5-6400 CL32. Premium high-speed kit for enthusiast builds.',
  }})

  await prisma.part.upsert({ where: { id: 'ram-gskill-ddr5-6000-64gb' }, update: {}, create: {
    id: 'ram-gskill-ddr5-6000-64gb', categoryId: cat.ram.id,
    name: 'G.Skill Trident Z5 64GB DDR5-6000', brand: 'G.Skill', model: 'Trident Z5 64GB DDR5-6000 (2x32GB)',
    sku: 'F5-6000J3038G32GX2-TZ5K', ramType: 'DDR5', capacityGb: 64, speedMhz: 6000,
    description: '2x32GB DDR5-6000. Maximum RAM for workstations without ECC.',
  }})

  // ═══════════════════════════════════════════════════════════════════════════
  // GPUs
  // ═══════════════════════════════════════════════════════════════════════════

  // ── NVIDIA Ada Lovelace (RTX 4000) ────────────────────────────────────────
  await prisma.part.upsert({ where: { id: 'gpu-rtx4060' }, update: {}, create: {
    id: 'gpu-rtx4060', categoryId: cat.gpu.id,
    name: 'ASUS Dual GeForce RTX 4060 OC', brand: 'ASUS', model: 'Dual GeForce RTX 4060 OC',
    lengthMm: 240, tdpWatts: 115,
    fps1080p: 100, fps1440p: 72, fps4K: 38, benchmarkScore: 12800,
    description: '8GB GDDR6. Efficient 1080p gaming GPU. Very compact and low power.',
  }})

  await prisma.part.upsert({ where: { id: 'gpu-rtx4060ti' }, update: {}, create: {
    id: 'gpu-rtx4060ti', categoryId: cat.gpu.id,
    name: 'MSI Gaming GeForce RTX 4060 Ti 16G', brand: 'MSI', model: 'Gaming GeForce RTX 4060 Ti 16G',
    lengthMm: 268, tdpWatts: 165,
    fps1080p: 115, fps1440p: 88, fps4K: 46, benchmarkScore: 15200,
    description: '16GB GDDR6. Great 1080p/1440p GPU with ample VRAM for future-proofing.',
  }})

  await prisma.part.upsert({ where: { id: 'gpu-rtx4070' }, update: {}, create: {
    id: 'gpu-rtx4070', categoryId: cat.gpu.id,
    name: 'ASUS Dual GeForce RTX 4070 OC', brand: 'ASUS', model: 'Dual GeForce RTX 4070 OC',
    lengthMm: 272, tdpWatts: 200,
    fps1080p: 140, fps1440p: 110, fps4K: 56, benchmarkScore: 18500,
    description: '12GB GDDR6X. Excellent 1440p GPU with DLSS 3 support.',
  }})

  await prisma.part.upsert({ where: { id: 'gpu-rtx4070super' }, update: {}, create: {
    id: 'gpu-rtx4070super', categoryId: cat.gpu.id,
    name: 'Gigabyte GeForce RTX 4070 SUPER OC', brand: 'Gigabyte', model: 'GeForce RTX 4070 SUPER OC',
    lengthMm: 285, tdpWatts: 220,
    fps1080p: 150, fps1440p: 118, fps4K: 62, benchmarkScore: 20200,
    description: '12GB GDDR6X. Significantly better value than the base RTX 4070.',
  }})

  await prisma.part.upsert({ where: { id: 'gpu-rtx4070tisuper' }, update: {}, create: {
    id: 'gpu-rtx4070tisuper', categoryId: cat.gpu.id,
    name: 'MSI Gaming Slim GeForce RTX 4070 Ti Super', brand: 'MSI', model: 'Gaming Slim RTX 4070 Ti Super',
    lengthMm: 310, tdpWatts: 285,
    fps1080p: 175, fps1440p: 142, fps4K: 80, benchmarkScore: 24100,
    description: '16GB GDDR6X. Top 1440p/4K option. Near 4080 performance at lower cost.',
  }})

  await prisma.part.upsert({ where: { id: 'gpu-rtx4080super' }, update: {}, create: {
    id: 'gpu-rtx4080super', categoryId: cat.gpu.id,
    name: 'ASUS ROG Strix GeForce RTX 4080 Super', brand: 'ASUS', model: 'ROG Strix RTX 4080 Super',
    lengthMm: 336, tdpWatts: 320,
    fps1080p: 195, fps1440p: 162, fps4K: 96, benchmarkScore: 27800,
    description: '16GB GDDR6X. Outstanding 4K gaming. Near 4090 performance.',
  }})

  await prisma.part.upsert({ where: { id: 'gpu-rtx4090' }, update: {}, create: {
    id: 'gpu-rtx4090', categoryId: cat.gpu.id,
    name: 'ASUS ROG Strix GeForce RTX 4090 OC', brand: 'ASUS', model: 'ROG Strix RTX 4090 OC',
    lengthMm: 358, tdpWatts: 450,
    fps1080p: 230, fps1440p: 198, fps4K: 132, benchmarkScore: 36200,
    description: '24GB GDDR6X. Absolute best GPU for gaming and AI workloads. Overkill for most.',
  }})

  // ── NVIDIA Blackwell (RTX 5000 – launched Jan 2025) ───────────────────────
  await prisma.part.upsert({ where: { id: 'gpu-rtx5070' }, update: {}, create: {
    id: 'gpu-rtx5070', categoryId: cat.gpu.id,
    name: 'Gigabyte GeForce RTX 5070 Gaming OC', brand: 'Gigabyte', model: 'GeForce RTX 5070 Gaming OC',
    lengthMm: 278, tdpWatts: 250,
    fps1080p: 165, fps1440p: 138, fps4K: 78, benchmarkScore: 23600,
    description: '12GB GDDR7. Blackwell architecture. DLSS 4 multi-frame generation. Excellent 1440p.',
  }})

  await prisma.part.upsert({ where: { id: 'gpu-rtx5070ti' }, update: {}, create: {
    id: 'gpu-rtx5070ti', categoryId: cat.gpu.id,
    name: 'MSI Gaming Trio GeForce RTX 5070 Ti', brand: 'MSI', model: 'Gaming Trio RTX 5070 Ti',
    lengthMm: 316, tdpWatts: 300,
    fps1080p: 190, fps1440p: 158, fps4K: 95, benchmarkScore: 27100,
    description: '16GB GDDR7. Strong 4K contender. DLSS 4 transforms performance.',
  }})

  await prisma.part.upsert({ where: { id: 'gpu-rtx5080' }, update: {}, create: {
    id: 'gpu-rtx5080', categoryId: cat.gpu.id,
    name: 'ASUS TUF Gaming GeForce RTX 5080', brand: 'ASUS', model: 'TUF Gaming RTX 5080',
    lengthMm: 330, tdpWatts: 360,
    fps1080p: 215, fps1440p: 180, fps4K: 112, benchmarkScore: 31400,
    description: '16GB GDDR7. Top-tier 4K gaming. Excellent content creation performance.',
  }})

  // ── AMD RDNA3 (RX 7000) ───────────────────────────────────────────────────
  await prisma.part.upsert({ where: { id: 'gpu-rx7600' }, update: {}, create: {
    id: 'gpu-rx7600', categoryId: cat.gpu.id,
    name: 'Sapphire Pulse RX 7600 8GB', brand: 'Sapphire', model: 'Pulse RX 7600',
    lengthMm: 239, tdpWatts: 165,
    fps1080p: 95, fps1440p: 68, fps4K: 35, benchmarkScore: 12100,
    description: '8GB GDDR6. Budget 1080p gaming AMD card. Great for casual gaming.',
  }})

  await prisma.part.upsert({ where: { id: 'gpu-rx7700xt' }, update: {}, create: {
    id: 'gpu-rx7700xt', categoryId: cat.gpu.id,
    name: 'Sapphire Pulse RX 7700 XT 12GB', brand: 'Sapphire', model: 'Pulse RX 7700 XT',
    lengthMm: 258, tdpWatts: 245,
    fps1080p: 122, fps1440p: 96, fps4K: 50, benchmarkScore: 15900,
    description: '12GB GDDR6. Competitive mid-range AMD. More VRAM than RTX 4060.',
  }})

  await prisma.part.upsert({ where: { id: 'gpu-rx7800xt' }, update: {}, create: {
    id: 'gpu-rx7800xt', categoryId: cat.gpu.id,
    name: 'Sapphire Pulse RX 7800 XT 16GB', brand: 'Sapphire', model: 'Pulse RX 7800 XT',
    lengthMm: 310, tdpWatts: 263,
    fps1080p: 145, fps1440p: 115, fps4K: 58, benchmarkScore: 19800,
    description: '16GB GDDR6. Excellent 1440p value. Huge VRAM advantage.',
  }})

  await prisma.part.upsert({ where: { id: 'gpu-rx7900xtx' }, update: {}, create: {
    id: 'gpu-rx7900xtx', categoryId: cat.gpu.id,
    name: 'Sapphire Nitro+ RX 7900 XTX 24GB', brand: 'Sapphire', model: 'Nitro+ RX 7900 XTX',
    lengthMm: 332, tdpWatts: 355,
    fps1080p: 195, fps1440p: 162, fps4K: 100, benchmarkScore: 28200,
    description: '24GB GDDR6. AMD flagship. Outstanding 4K performance and driver support.',
  }})

  // ── AMD RDNA4 (RX 9000 – launched early 2025) ─────────────────────────────
  await prisma.part.upsert({ where: { id: 'gpu-rx9070xt' }, update: {}, create: {
    id: 'gpu-rx9070xt', categoryId: cat.gpu.id,
    name: 'Sapphire Pulse RX 9070 XT 16GB', brand: 'Sapphire', model: 'Pulse RX 9070 XT',
    lengthMm: 305, tdpWatts: 304,
    fps1080p: 168, fps1440p: 140, fps4K: 82, benchmarkScore: 24400,
    description: '16GB GDDR6. RDNA4 architecture. Exceptional rasterization + ray tracing uplift.',
  }})

  await prisma.part.upsert({ where: { id: 'gpu-rx9070' }, update: {}, create: {
    id: 'gpu-rx9070', categoryId: cat.gpu.id,
    name: 'Sapphire Pulse RX 9070 16GB', brand: 'Sapphire', model: 'Pulse RX 9070',
    lengthMm: 295, tdpWatts: 220,
    fps1080p: 152, fps1440p: 126, fps4K: 72, benchmarkScore: 21900,
    description: '16GB GDDR6. RDNA4. Outstanding value per dollar vs RTX 4070 Super.',
  }})

  // ═══════════════════════════════════════════════════════════════════════════
  // STORAGE
  // ═══════════════════════════════════════════════════════════════════════════

  // ── NVMe Gen4 ─────────────────────────────────────────────────────────────
  await prisma.part.upsert({ where: { id: 'ssd-wd-sn850x-1tb' }, update: {}, create: {
    id: 'ssd-wd-sn850x-1tb', categoryId: cat.storage.id,
    name: 'WD Black SN850X 1TB NVMe', brand: 'Western Digital', model: 'Black SN850X 1TB',
    sku: 'WDS100T2X0E', capacityGb: 1000,
    description: '1TB PCIe 4.0, 7300 MB/s read. Top-tier gaming drive.',
  }})

  await prisma.part.upsert({ where: { id: 'ssd-wd-sn850x-2tb' }, update: {}, create: {
    id: 'ssd-wd-sn850x-2tb', categoryId: cat.storage.id,
    name: 'WD Black SN850X 2TB NVMe', brand: 'Western Digital', model: 'Black SN850X 2TB',
    sku: 'WDS200T2X0E', capacityGb: 2000,
    description: '2TB PCIe 4.0, 7300 MB/s read. Best choice for large game libraries.',
  }})

  await prisma.part.upsert({ where: { id: 'ssd-samsung-990pro-1tb' }, update: {}, create: {
    id: 'ssd-samsung-990pro-1tb', categoryId: cat.storage.id,
    name: 'Samsung 990 Pro 1TB NVMe', brand: 'Samsung', model: '990 Pro 1TB',
    sku: 'MZ-V9P1T0BW', capacityGb: 1000,
    description: '1TB PCIe 4.0. Exceptional sustained writes.',
  }})

  await prisma.part.upsert({ where: { id: 'ssd-samsung-990pro-2tb' }, update: {}, create: {
    id: 'ssd-samsung-990pro-2tb', categoryId: cat.storage.id,
    name: 'Samsung 990 Pro 2TB NVMe', brand: 'Samsung', model: '990 Pro 2TB',
    sku: 'MZ-V9P2T0BW', capacityGb: 2000,
    description: '2TB PCIe 4.0. Best endurance in class.',
  }})

  await prisma.part.upsert({ where: { id: 'ssd-crucial-t705-1tb' }, update: {}, create: {
    id: 'ssd-crucial-t705-1tb', categoryId: cat.storage.id,
    name: 'Crucial T705 1TB NVMe', brand: 'Crucial', model: 'T705 1TB',
    sku: 'CT1000T705SSD3', capacityGb: 1000,
    description: '1TB PCIe 5.0, up to 14,500 MB/s. Fastest consumer SSD.',
  }})

  await prisma.part.upsert({ where: { id: 'ssd-crucial-t705-2tb' }, update: {}, create: {
    id: 'ssd-crucial-t705-2tb', categoryId: cat.storage.id,
    name: 'Crucial T705 2TB NVMe', brand: 'Crucial', model: 'T705 2TB',
    sku: 'CT2000T705SSD3', capacityGb: 2000,
    description: '2TB PCIe 5.0. Extreme sequential speeds for content creation.',
  }})

  await prisma.part.upsert({ where: { id: 'ssd-seagate-firecuda-530-2tb' }, update: {}, create: {
    id: 'ssd-seagate-firecuda-530-2tb', categoryId: cat.storage.id,
    name: 'Seagate FireCuda 530 2TB NVMe', brand: 'Seagate', model: 'FireCuda 530 2TB',
    sku: 'ZP2000GM3A013', capacityGb: 2000,
    description: '2TB PCIe 4.0, 7300 MB/s. High-endurance drive for gaming and creative.',
  }})

  await prisma.part.upsert({ where: { id: 'ssd-kingston-kc3000-1tb' }, update: {}, create: {
    id: 'ssd-kingston-kc3000-1tb', categoryId: cat.storage.id,
    name: 'Kingston KC3000 1TB NVMe', brand: 'Kingston', model: 'KC3000 1TB',
    sku: 'SKC3000S/1024G', capacityGb: 1000,
    description: '1TB PCIe 4.0, 7000 MB/s. Reliable Kingston drive at great value.',
  }})

  // ── SATA SSD ──────────────────────────────────────────────────────────────
  await prisma.part.upsert({ where: { id: 'ssd-samsung-870evo-1tb' }, update: {}, create: {
    id: 'ssd-samsung-870evo-1tb', categoryId: cat.storage.id,
    name: 'Samsung 870 EVO 1TB SATA SSD', brand: 'Samsung', model: '870 EVO 1TB SATA',
    sku: 'MZ-77E1T0BW', capacityGb: 1000,
    description: '1TB SATA III SSD. 560 MB/s read. Ideal secondary drive or budget build.',
  }})

  await prisma.part.upsert({ where: { id: 'ssd-crucial-mx500-2tb' }, update: {}, create: {
    id: 'ssd-crucial-mx500-2tb', categoryId: cat.storage.id,
    name: 'Crucial MX500 2TB SATA SSD', brand: 'Crucial', model: 'MX500 2TB',
    sku: 'CT2000MX500SSD1', capacityGb: 2000,
    description: '2TB SATA SSD. Great value bulk storage. 560 MB/s read.',
  }})

  // ═══════════════════════════════════════════════════════════════════════════
  // PSUs
  // ═══════════════════════════════════════════════════════════════════════════

  await prisma.part.upsert({ where: { id: 'psu-corsair-rm650x' }, update: {}, create: {
    id: 'psu-corsair-rm650x', categoryId: cat.psu.id,
    name: 'Corsair RM650x 650W 80+ Gold', brand: 'Corsair', model: 'RM650x 650W',
    sku: 'CP-9020178-AU', psuWatts: 650, psuFormFactor: 'ATX',
    description: '650W fully modular Gold. Zero-RPM fan mode. Good for mid-range builds.',
  }})

  await prisma.part.upsert({ where: { id: 'psu-corsair-rm850x' }, update: {}, create: {
    id: 'psu-corsair-rm850x', categoryId: cat.psu.id,
    name: 'Corsair RM850x 850W 80+ Gold', brand: 'Corsair', model: 'RM850x 850W',
    sku: 'CP-9020200-AU', psuWatts: 850, psuFormFactor: 'ATX',
    description: '850W fully modular Gold. Reliable, quiet. 10-year warranty.',
  }})

  await prisma.part.upsert({ where: { id: 'psu-corsair-rm1000x' }, update: {}, create: {
    id: 'psu-corsair-rm1000x', categoryId: cat.psu.id,
    name: 'Corsair RM1000x 1000W 80+ Gold', brand: 'Corsair', model: 'RM1000x 1000W',
    sku: 'CP-9020201-AU', psuWatts: 1000, psuFormFactor: 'ATX',
    description: '1000W Gold for RTX 4090/5080 builds. Fully modular, ultra quiet.',
  }})

  await prisma.part.upsert({ where: { id: 'psu-seasonic-focus-750' }, update: {}, create: {
    id: 'psu-seasonic-focus-750', categoryId: cat.psu.id,
    name: 'Seasonic Focus GX-750 750W 80+ Gold', brand: 'Seasonic', model: 'Focus GX-750',
    psuWatts: 750, psuFormFactor: 'ATX',
    description: '750W fully modular Gold. Excellent Seasonic reliability.',
  }})

  await prisma.part.upsert({ where: { id: 'psu-seasonic-prime-850tx' }, update: {}, create: {
    id: 'psu-seasonic-prime-850tx', categoryId: cat.psu.id,
    name: 'Seasonic Prime TX-850 850W 80+ Titanium', brand: 'Seasonic', model: 'Prime TX-850',
    psuWatts: 850, psuFormFactor: 'ATX',
    description: '850W Titanium – best efficiency available. 12-year warranty. Premium enthusiast pick.',
  }})

  await prisma.part.upsert({ where: { id: 'psu-bequiet-straight-1000' }, update: {}, create: {
    id: 'psu-bequiet-straight-1000', categoryId: cat.psu.id,
    name: 'be quiet! Straight Power 12 1000W Platinum', brand: 'be quiet!', model: 'Straight Power 12 1000W',
    psuWatts: 1000, psuFormFactor: 'ATX',
    description: '1000W 80+ Platinum. Near-silent. Ideal for high-end silent builds.',
  }})

  await prisma.part.upsert({ where: { id: 'psu-corsair-sf750' }, update: {}, create: {
    id: 'psu-corsair-sf750', categoryId: cat.psu.id,
    name: 'Corsair SF750 750W 80+ Platinum SFX', brand: 'Corsair', model: 'SF750',
    sku: 'CP-9020186-AU', psuWatts: 750, psuFormFactor: 'SFX',
    description: 'Best SFX PSU. 750W Platinum, fully modular. Perfect for SFF builds.',
  }})

  await prisma.part.upsert({ where: { id: 'psu-corsair-sf600' }, update: {}, create: {
    id: 'psu-corsair-sf600', categoryId: cat.psu.id,
    name: 'Corsair SF600 600W 80+ Gold SFX', brand: 'Corsair', model: 'SF600',
    psuWatts: 600, psuFormFactor: 'SFX',
    description: '600W Gold SFX. More affordable SFF option for mid-range builds.',
  }})

  await prisma.part.upsert({ where: { id: 'psu-lianli-sp850' }, update: {}, create: {
    id: 'psu-lianli-sp850', categoryId: cat.psu.id,
    name: 'Lian Li SP850 850W 80+ Gold SFX-L', brand: 'Lian Li', model: 'SP850',
    psuWatts: 850, psuFormFactor: 'SFX',
    description: '850W Gold SFX-L. Perfect for the O11 Air Mini and SFF high-end builds.',
  }})

  // ═══════════════════════════════════════════════════════════════════════════
  // CASES
  // ═══════════════════════════════════════════════════════════════════════════

  await prisma.part.upsert({ where: { id: 'case-lianli-o11d' }, update: {}, create: {
    id: 'case-lianli-o11d', categoryId: cat.case.id,
    name: 'Lian Li O11 Dynamic EVO', brand: 'Lian Li', model: 'O11 Dynamic EVO',
    formFactor: 'ATX', lengthMm: 420, heightMm: 167, psuFormFactor: 'ATX',
    description: 'Premium dual-chamber ATX case. Excellent airflow, popular for watercooling.',
  }})

  await prisma.part.upsert({ where: { id: 'case-fractal-north' }, update: {}, create: {
    id: 'case-fractal-north', categoryId: cat.case.id,
    name: 'Fractal Design North', brand: 'Fractal Design', model: 'North',
    formFactor: 'ATX', lengthMm: 355, heightMm: 155, psuFormFactor: 'ATX',
    description: 'Beautiful mesh + wood-panel ATX. Compact with great airflow.',
  }})

  await prisma.part.upsert({ where: { id: 'case-fractal-define7' }, update: {}, create: {
    id: 'case-fractal-define7', categoryId: cat.case.id,
    name: 'Fractal Design Define 7', brand: 'Fractal Design', model: 'Define 7',
    formFactor: 'ATX', lengthMm: 491, heightMm: 185, psuFormFactor: 'ATX',
    description: 'Full-tower silent case. Massive component clearance.',
  }})

  await prisma.part.upsert({ where: { id: 'case-corsair-4000d' }, update: {}, create: {
    id: 'case-corsair-4000d', categoryId: cat.case.id,
    name: 'Corsair 4000D Airflow', brand: 'Corsair', model: '4000D Airflow',
    formFactor: 'ATX', lengthMm: 360, heightMm: 170, psuFormFactor: 'ATX',
    description: 'Clean ATX case with excellent front mesh airflow. Very popular beginner choice.',
  }})

  await prisma.part.upsert({ where: { id: 'case-phanteks-p400a' }, update: {}, create: {
    id: 'case-phanteks-p400a', categoryId: cat.case.id,
    name: 'Phanteks Eclipse P400A DRGB', brand: 'Phanteks', model: 'Eclipse P400A DRGB',
    formFactor: 'ATX', lengthMm: 395, heightMm: 170, psuFormFactor: 'ATX',
    description: 'Great budget ATX case with full mesh front and three included fans.',
  }})

  await prisma.part.upsert({ where: { id: 'case-bequiet-pure-500dx' }, update: {}, create: {
    id: 'case-bequiet-pure-500dx', categoryId: cat.case.id,
    name: 'be quiet! Pure Base 500DX', brand: 'be quiet!', model: 'Pure Base 500DX',
    formFactor: 'ATX', lengthMm: 369, heightMm: 185, psuFormFactor: 'ATX',
    description: 'Silent ATX case with tempered glass and built-in RGB light strips.',
  }})

  await prisma.part.upsert({ where: { id: 'case-nzxt-h510' }, update: {}, create: {
    id: 'case-nzxt-h510', categoryId: cat.case.id,
    name: 'NZXT H510', brand: 'NZXT', model: 'H510',
    formFactor: 'ATX', lengthMm: 325, heightMm: 165, psuFormFactor: 'ATX',
    description: 'Clean steel + glass mid-tower. Minimalist design, decent cable management.',
  }})

  await prisma.part.upsert({ where: { id: 'case-lianli-lancool-216' }, update: {}, create: {
    id: 'case-lianli-lancool-216', categoryId: cat.case.id,
    name: 'Lian Li LANCOOL 216 RGB', brand: 'Lian Li', model: 'LANCOOL 216 RGB',
    formFactor: 'ATX', lengthMm: 410, heightMm: 175, psuFormFactor: 'ATX',
    description: 'Budget-friendly Lian Li with two included 160mm fans. Great airflow.',
  }})

  // ── mATX cases ────────────────────────────────────────────────────────────
  await prisma.part.upsert({ where: { id: 'case-coolermaster-nr400' }, update: {}, create: {
    id: 'case-coolermaster-nr400', categoryId: cat.case.id,
    name: 'Cooler Master NR400', brand: 'Cooler Master', model: 'NR400',
    formFactor: 'mATX', lengthMm: 340, heightMm: 160, psuFormFactor: 'ATX',
    description: 'Compact mATX case with mesh front. Good airflow at an affordable price.',
  }})

  // ── ITX cases ─────────────────────────────────────────────────────────────
  await prisma.part.upsert({ where: { id: 'case-ncase-m1' }, update: {}, create: {
    id: 'case-ncase-m1', categoryId: cat.case.id,
    name: 'NCASE M1 v6.1', brand: 'NCASE', model: 'M1 v6.1',
    formFactor: 'ITX', lengthMm: 330, heightMm: 125, psuFormFactor: 'SFX',
    description: 'Premium ITX SFF case. Community favourite. Tight build, great result.',
  }})

  await prisma.part.upsert({ where: { id: 'case-coolermaster-nr200p' }, update: {}, create: {
    id: 'case-coolermaster-nr200p', categoryId: cat.case.id,
    name: 'Cooler Master NR200P', brand: 'Cooler Master', model: 'NR200P',
    formFactor: 'ITX', lengthMm: 330, heightMm: 155, psuFormFactor: 'SFX',
    description: 'Popular ITX case. Supports large GPUs and even 240mm AIOs.',
  }})

  await prisma.part.upsert({ where: { id: 'case-lianli-tu150' }, update: {}, create: {
    id: 'case-lianli-tu150', categoryId: cat.case.id,
    name: 'Lian Li TU150', brand: 'Lian Li', model: 'TU150',
    formFactor: 'ITX', lengthMm: 320, heightMm: 135, psuFormFactor: 'SFX',
    description: 'Aluminium ITX case with PCIe riser. Premium SFF build material.',
  }})

  // ═══════════════════════════════════════════════════════════════════════════
  // COOLERS
  // ═══════════════════════════════════════════════════════════════════════════

  // ── Air Coolers ───────────────────────────────────────────────────────────
  await prisma.part.upsert({ where: { id: 'cooler-noctua-nhd15' }, update: {}, create: {
    id: 'cooler-noctua-nhd15', categoryId: cat.cooler.id,
    name: 'Noctua NH-D15', brand: 'Noctua', model: 'NH-D15',
    socket: 'AM4,AM5,LGA1700', heightMm: 165, tdpWatts: 250,
    description: 'Best air cooler ever made. Dual tower, two NF-A15 fans. Near-silent.',
  }})

  await prisma.part.upsert({ where: { id: 'cooler-noctua-nhd15s' }, update: {}, create: {
    id: 'cooler-noctua-nhd15s', categoryId: cat.cooler.id,
    name: 'Noctua NH-D15S', brand: 'Noctua', model: 'NH-D15S',
    socket: 'AM4,AM5,LGA1700', heightMm: 160, tdpWatts: 220,
    description: 'Single-fan NH-D15 variant. Better RAM compatibility than the standard D15.',
  }})

  await prisma.part.upsert({ where: { id: 'cooler-noctua-nhu12a' }, update: {}, create: {
    id: 'cooler-noctua-nhu12a', categoryId: cat.cooler.id,
    name: 'Noctua NH-U12A', brand: 'Noctua', model: 'NH-U12A',
    socket: 'AM4,AM5,LGA1700', heightMm: 158, tdpWatts: 200,
    description: 'Compact single-tower with dual NF-A12x25 fans. Exceptional for the size.',
  }})

  await prisma.part.upsert({ where: { id: 'cooler-deepcool-ak620' }, update: {}, create: {
    id: 'cooler-deepcool-ak620', categoryId: cat.cooler.id,
    name: 'DeepCool AK620', brand: 'DeepCool', model: 'AK620',
    socket: 'AM4,AM5,LGA1700', heightMm: 160, tdpWatts: 260,
    description: 'Best value dual-tower cooler. Rivals NH-D15 at half the price.',
  }})

  await prisma.part.upsert({ where: { id: 'cooler-thermalright-pa120-se' }, update: {}, create: {
    id: 'cooler-thermalright-pa120-se', categoryId: cat.cooler.id,
    name: 'Thermalright Peerless Assassin 120 SE', brand: 'Thermalright', model: 'Peerless Assassin 120 SE',
    socket: 'AM4,AM5,LGA1700', heightMm: 157, tdpWatts: 220,
    description: 'Budget dual-tower standout. Exceptional price-to-performance.',
  }})

  await prisma.part.upsert({ where: { id: 'cooler-bequiet-darkrock-pro4' }, update: {}, create: {
    id: 'cooler-bequiet-darkrock-pro4', categoryId: cat.cooler.id,
    name: 'be quiet! Dark Rock Pro 4', brand: 'be quiet!', model: 'Dark Rock Pro 4',
    socket: 'AM4,LGA1700', heightMm: 163, tdpWatts: 250,
    description: 'Silent dual-tower. Massive TDP headroom. All-black sleek design.',
  }})

  await prisma.part.upsert({ where: { id: 'cooler-id-frost' }, update: {}, create: {
    id: 'cooler-id-frost', categoryId: cat.cooler.id,
    name: 'ID-COOLING SE-224-XTS', brand: 'ID-COOLING', model: 'SE-224-XTS',
    socket: 'AM4,AM5,LGA1700', heightMm: 155, tdpWatts: 180,
    description: 'Budget tower cooler. Exceptional AliExpress value. Great for 65W CPUs.',
  }})

  // ── AIO Liquid Coolers ────────────────────────────────────────────────────
  await prisma.part.upsert({ where: { id: 'cooler-arctic-lf3-240' }, update: {}, create: {
    id: 'cooler-arctic-lf3-240', categoryId: cat.cooler.id,
    name: 'Arctic Liquid Freezer III 240', brand: 'Arctic', model: 'Liquid Freezer III 240',
    socket: 'AM4,AM5,LGA1700', heightMm: 38, tdpWatts: 300,
    description: '240mm AIO with VRM fan. Best value AIO. Exceptional performance.',
  }})

  await prisma.part.upsert({ where: { id: 'cooler-arctic-lf3-360' }, update: {}, create: {
    id: 'cooler-arctic-lf3-360', categoryId: cat.cooler.id,
    name: 'Arctic Liquid Freezer III 360', brand: 'Arctic', model: 'Liquid Freezer III 360',
    socket: 'AM4,AM5,LGA1700', heightMm: 38, tdpWatts: 350,
    description: '360mm AIO. Top cooling for 9950X, i9-14900K, RTX 4090 builds.',
  }})

  await prisma.part.upsert({ where: { id: 'cooler-corsair-h150i-elite' }, update: {}, create: {
    id: 'cooler-corsair-h150i-elite', categoryId: cat.cooler.id,
    name: 'Corsair iCUE H150i Elite LCD XT', brand: 'Corsair', model: 'iCUE H150i Elite LCD XT',
    socket: 'AM4,AM5,LGA1700', heightMm: 38, tdpWatts: 350,
    description: '360mm AIO with LCD screen. Premium RGB cooler for enthusiast builds.',
  }})

  await prisma.part.upsert({ where: { id: 'cooler-nzxt-kraken-360' }, update: {}, create: {
    id: 'cooler-nzxt-kraken-360', categoryId: cat.cooler.id,
    name: 'NZXT Kraken 360 RGB', brand: 'NZXT', model: 'Kraken 360 RGB',
    socket: 'AM4,AM5,LGA1700', heightMm: 38, tdpWatts: 320,
    description: '360mm AIO with LCD pump head. Popular premium liquid cooler.',
  }})

  await prisma.part.upsert({ where: { id: 'cooler-deepcool-ls720' }, update: {}, create: {
    id: 'cooler-deepcool-ls720', categoryId: cat.cooler.id,
    name: 'DeepCool LS720', brand: 'DeepCool', model: 'LS720',
    socket: 'AM4,AM5,LGA1700', heightMm: 38, tdpWatts: 350,
    description: '360mm AIO. Great AIO value in the 360mm segment.',
  }})

  // ═══════════════════════════════════════════════════════════════════════════
  // CASE FANS
  // ═══════════════════════════════════════════════════════════════════════════

  await prisma.part.upsert({ where: { id: 'fan-noctua-nf-a12x25' }, update: {}, create: {
    id: 'fan-noctua-nf-a12x25', categoryId: cat.fan.id,
    name: 'Noctua NF-A12x25 PWM', brand: 'Noctua', model: 'NF-A12x25 PWM',
    description: 'Reference 120mm fan. Quietest high-airflow fan available.',
  }})

  await prisma.part.upsert({ where: { id: 'fan-noctua-nf-p14s-redux' }, update: {}, create: {
    id: 'fan-noctua-nf-p14s-redux', categoryId: cat.fan.id,
    name: 'Noctua NF-P14s redux-900 140mm', brand: 'Noctua', model: 'NF-P14s redux-900',
    description: '140mm budget Noctua. Extremely quiet, good airflow.',
  }})

  await prisma.part.upsert({ where: { id: 'fan-arctic-p12' }, update: {}, create: {
    id: 'fan-arctic-p12', categoryId: cat.fan.id,
    name: 'ARCTIC P12 PWM PST (5-Pack)', brand: 'ARCTIC', model: 'P12 PWM PST 5-Pack',
    description: 'Best budget 120mm fan. Daisy-chainable, high static pressure.',
  }})

  await prisma.part.upsert({ where: { id: 'fan-arctic-p14' }, update: {}, create: {
    id: 'fan-arctic-p14', categoryId: cat.fan.id,
    name: 'ARCTIC P14 PWM PST (3-Pack)', brand: 'ARCTIC', model: 'P14 PWM PST 3-Pack',
    description: 'Budget 140mm fans. Great for cases with 140mm mounts.',
  }})

  await prisma.part.upsert({ where: { id: 'fan-corsair-ll120-3pack' }, update: {}, create: {
    id: 'fan-corsair-ll120-3pack', categoryId: cat.fan.id,
    name: 'Corsair LL120 RGB 3-Pack', brand: 'Corsair', model: 'LL120 RGB 3-Pack',
    description: 'RGB 120mm fans with iCUE integration. Popular for light builds.',
  }})

  await prisma.part.upsert({ where: { id: 'fan-lianli-uni-sl-3pack' }, update: {}, create: {
    id: 'fan-lianli-uni-sl-3pack', categoryId: cat.fan.id,
    name: 'Lian Li UNI FAN SL120 3-Pack', brand: 'Lian Li', model: 'UNI FAN SL120 3-Pack',
    description: 'Daisy-chain connection system. Clean build with minimal cables.',
  }})

  await prisma.part.upsert({ where: { id: 'fan-bequiet-silent-wings-4' }, update: {}, create: {
    id: 'fan-bequiet-silent-wings-4', categoryId: cat.fan.id,
    name: 'be quiet! Silent Wings 4 120mm PWM', brand: 'be quiet!', model: 'Silent Wings 4 120mm PWM',
    description: 'Whisper-quiet premium 120mm fan. 2500 RPM variant for cooling focused builds.',
  }})

  await prisma.part.upsert({ where: { id: 'fan-thermalright-tl-c12-3pack' }, update: {}, create: {
    id: 'fan-thermalright-tl-c12-3pack', categoryId: cat.fan.id,
    name: 'Thermalright TL-C12 Pro-S 3-Pack', brand: 'Thermalright', model: 'TL-C12 Pro-S 3-Pack',
    description: 'Extremely affordable 3-pack with good performance. Budget ARGB fans.',
  }})

  // ─── Sample Build ──────────────────────────────────────────────────────────
  await prisma.build.upsert({
    where: { slug: 'sample-1440p-gaming' },
    update: {},
    create: {
      id: 'build-sample-1440p',
      slug: 'sample-1440p-gaming',
      name: 'AMD 1440p Gaming Build 2025',
      purpose: '1440p Gaming',
      isPublic: true,
      totalPrice: 1849,
      estimatedWatts: 430,
      buildParts: {
        create: [
          { partId: 'cpu-r7-7800x3d', quantity: 1 },
          { partId: 'mb-gigabyte-b650e-elite', quantity: 1 },
          { partId: 'ram-gskill-ddr5-6000', quantity: 1 },
          { partId: 'gpu-rx9070xt', quantity: 1 },
          { partId: 'ssd-wd-sn850x-1tb', quantity: 1 },
          { partId: 'psu-corsair-rm850x', quantity: 1 },
          { partId: 'case-corsair-4000d', quantity: 1 },
          { partId: 'cooler-deepcool-ak620', quantity: 1 },
        ],
      },
    },
  })

  const count = await prisma.part.count()
  const catCount = await prisma.category.count()
  console.log(`✅ Seeded ${catCount} categories, ${count} parts`)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
