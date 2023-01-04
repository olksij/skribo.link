import bg0 from './0.svg';
import bg1 from './1.svg';
import bg2 from './2.svg';
import bg3 from './3.svg';

export default [ bg0, bg1, bg2, bg3 ].map(value => value.src);

export const themeColors = [
  { card: '#F3F4FF', gradient: [
    { color: '#8257D9', offset: 0 },
    { color: '#5782D9', offset: 1 },
  ]},
  { card: '#F3FBD6', gradient: [
    { color: '#5CA611', offset: 0 },
    { color: '#97A600', offset:.5 },
    { color: '#CC9900', offset: 1 },
  ]},
  { card: '#FFF1F0', gradient: [
    { color: '#CC5C78', offset: 0 },
    { color: '#CC7447', offset: 1 },
  ]},
  { card: '#E7FAFF', gradient: [
    { color: '#60BFBF', offset: 0 },
    { color: '#4CA3BF', offset:.5 },
    { color: '#5798D9', offset: 1 },
  ]},
]