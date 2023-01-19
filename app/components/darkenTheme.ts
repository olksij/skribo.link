export default function darkenTheme(dark: boolean) {
  if (dark) {
    // assign dark theme element
    document.getElementById('metaModalColor')?.setAttribute('name', 'theme-color');
    document.getElementById('metaThemeColor')?.setAttribute('name', '');
  }
  else {
    // assign wallpaper theme element
    document.getElementById('metaThemeColor')?.setAttribute('name', 'theme-color');
    document.getElementById('metaModalColor')?.setAttribute('name', '');
  }
}