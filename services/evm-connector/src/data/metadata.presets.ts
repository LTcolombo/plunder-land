
import fs from 'fs'

export const GEAR_PRESET_METADATA: Array<{
  name: string
  description: string
  image: Buffer
  attributes: Array<{
    trait_type: string
    value: string | number }>
}> = [
  {
    name: 'Simple Sword',
    description: 'Simple Sword +2',
    image: fs.readFileSync(process.cwd() + '/assets/sword_1.png'), // replace with reusable url / cid
    attributes: [{
      trait_type: 'damage',
      value: 2
    }, {
      trait_type: 'slot',
      value: 'weapon'
    }]
  },
  {
    name: 'Fair Sword',
    description: 'Fair Sword +4',
    image: fs.readFileSync(process.cwd() + '/assets/sword_2.png'),
    attributes: [{
      trait_type: 'damage',
      value: 4
    }, {
      trait_type: 'slot',
      value: 'weapon'
    }]
  },
  {
    name: 'Rare Sword',
    description: 'Rare Sword +6',
    image: fs.readFileSync(process.cwd() + '/assets/sword_3.png'),
    attributes: [{
      trait_type: 'damage',
      value: 6
    }, {
      trait_type: 'slot',
      value: 'weapon'
    }]
  }, {
    name: 'Simple Armor',
    description: 'Simple Armor +2',
    image: fs.readFileSync(process.cwd() + '/assets/armor_1.png'), // replace with reusable url / cid
    attributes: [{
      trait_type: 'armor',
      value: 2
    }, {
      trait_type: 'slot',
      value: 'armor'
    }]
  },
  {
    name: 'Fair Armor',
    description: 'Fair Armor +4',
    image: fs.readFileSync(process.cwd() + '/assets/armor_2.png'),
    attributes: [{
      trait_type: 'armor',
      value: 4
    }, {
      trait_type: 'slot',
      value: 'armor'
    }]
  },
  {
    name: 'Rare Armor',
    description: 'Rare Armor +6',
    image: fs.readFileSync(process.cwd() + '/assets/armor_3.png'),
    attributes: [{
      trait_type: 'armor',
      value: 6
    }, {
      trait_type: 'slot',
      value: 'armor'
    }]
  }, {
    name: 'Simple Boots',
    description: 'Simple Boots +2',
    image: fs.readFileSync(process.cwd() + '/assets/boots_1.png'), // replace with reusable url / cid
    attributes: [{
      trait_type: 'speed',
      value: 2
    }, {
      trait_type: 'slot',
      value: 'armor'
    }]
  },
  {
    name: 'Fair Boots',
    description: 'Fair Boots +4',
    image: fs.readFileSync(process.cwd() + '/assets/boots_2.png'),
    attributes: [{
      trait_type: 'speed',
      value: 4
    }, {
      trait_type: 'slot',
      value: 'armor'
    }]
  },
  {
    name: 'Rare Boots',
    description: 'Rare Boots +6',
    image: fs.readFileSync(process.cwd() + '/assets/boots_3.png'),
    attributes: [{
      trait_type: 'speed',
      value: 6
    }, {
      trait_type: 'slot',
      value: 'armor'
    }]
  }]
