import bg0 from './0.svg';
import bg1 from './1.svg';
import bg2 from './2.svg';
import bg3 from './3.svg';
import bg4 from './4.svg';
import bg5 from './5.svg';

export default [ bg0, bg1, bg2, bg3, bg4, bg5 ].map(value => value.src);

export const themeColors = [
  { 
    card: '#F3F4FF', 
    topBar: '#DACEF2',
    gradient: [
      { color: '#8257D9', offset: 0 },
      { color: '#5782D9', offset: 1 },
    ]
  },
  { 
    card: '#F3FBD6', 
    topBar: '#E0F2CE',
    gradient: [
      { color: '#5CA611', offset: 0 },
      { color: '#97A600', offset:.5 },
      { color: '#CC9900', offset: 1 },
    ]
  },
  { 
    card: '#FFF1F0', 
    topBar: '#F2CED7',
      gradient: [
      { color: '#CC5C78', offset: 0 },
      { color: '#CC7447', offset: 1 },
    ]
  },
  { 
    card: '#E7FAFF', 
    topBar: '#D4F3CE',
      gradient: [
      { color: '#60BFBF', offset: 0 },
      { color: '#4CA3BF', offset:.5 },
      { color: '#5798D9', offset: 1 },
    ]
  },
  { 
    card: '#FFF2E9', 
    topBar: '#F3BCAA',
      gradient: [
      { color: '#BF7743', offset: 0 },
      { color: '#D97441', offset:.5 },
      { color: '#BF6856', offset: 1 },
    ]
  },
  { 
    card: '#FFEEFF', 
    topBar: '#F3CEE6',
      gradient: [
      { color: '#CC66BB', offset: 0 },
      { color: '#BB66CC', offset: 1 },
    ]
  },
]